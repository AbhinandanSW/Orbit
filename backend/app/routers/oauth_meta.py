"""Meta (Facebook + Instagram) OAuth.

One Meta app covers both Pages posting and IG Business content publishing.

Flow:
  1. Frontend calls GET /api/oauth/meta/start?brand_id=N → returns authorize URL.
  2. Meta bounces browser to /api/oauth/meta/callback with code+state.
  3. We verify state, exchange code → short-lived user token, then short-lived
     → long-lived (~60 days). Page tokens derived from a long-lived user token
     do not expire.
  4. Fetch /me/accounts to enumerate Pages the user manages. For each Page
     read `instagram_business_account{id,username}` to discover linked IG
     Business accounts. We persist:
       - one Connection(platform="facebook") per Page (token = page token)
       - one Connection(platform="instagram") per linked IG account
         (token = parent page token; IG content publishing uses the page token)
  5. Redirect back to FRONTEND_URL/settings with status flag.

If the user has multiple Pages we currently take *all* of them (one connection
per page) but the UI only displays one per platform — a picker is a follow-up.
"""
from __future__ import annotations

import secrets
import time
import urllib.parse
from datetime import datetime, timedelta

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from itsdangerous import BadSignature, URLSafeTimedSerializer
from sqlalchemy.orm import Session

from .. import models
from ..config import settings
from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/oauth/meta", tags=["oauth"])

GRAPH = f"https://graph.facebook.com/{settings.META_GRAPH_VERSION}"
AUTHORIZE_URL = f"https://www.facebook.com/{settings.META_GRAPH_VERSION}/dialog/oauth"

_serializer = URLSafeTimedSerializer(settings.JWT_SECRET, salt="meta-oauth")
STATE_MAX_AGE_SECONDS = 600


def _frontend_redirect(status: str, **extra: str) -> RedirectResponse:
    qs = urllib.parse.urlencode({"meta": status, **extra})
    return RedirectResponse(f"{settings.FRONTEND_URL}/settings?{qs}", status_code=302)


@router.get("/start")
def start(
    brand_id: int,
    user: models.User = Depends(get_current_user),
):
    if not settings.META_CLIENT_ID:
        raise HTTPException(500, "META_CLIENT_ID not configured")
    if brand_id not in [b.id for b in user.brands]:
        raise HTTPException(403, "Brand not owned")

    state = _serializer.dumps({
        "uid": user.id,
        "bid": brand_id,
        "n": secrets.token_urlsafe(8),
        "t": int(time.time()),
    })
    params = {
        "response_type": "code",
        "client_id": settings.META_CLIENT_ID,
        "redirect_uri": settings.META_REDIRECT_URI,
        "scope": settings.META_SCOPES,
        "state": state,
    }
    return {"authorize_url": f"{AUTHORIZE_URL}?{urllib.parse.urlencode(params)}"}


def _upsert_connection(
    db: Session,
    *,
    brand_id: int,
    platform: str,
    external_account_id: str,
    handle: str,
    access_token: str,
    scopes: str,
    expires_at: datetime | None,
) -> None:
    conn = (
        db.query(models.Connection)
        .filter(
            models.Connection.brand_id == brand_id,
            models.Connection.platform == platform,
            models.Connection.external_account_id == external_account_id,
        )
        .one_or_none()
    )
    if conn is None:
        conn = models.Connection(
            brand_id=brand_id,
            platform=platform,
            handle=handle,
            external_account_id=external_account_id,
        )
        db.add(conn)
    conn.handle = handle
    conn.access_token = access_token
    conn.token_expires_at = expires_at
    conn.scopes = scopes
    conn.status = "active"
    conn.last_error = None
    conn.connected_at = datetime.utcnow()


@router.get("/callback")
def callback(
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
    error_reason: str | None = Query(None),
    error_description: str | None = Query(None),
    db: Session = Depends(get_db),
):
    if error:
        return _frontend_redirect("error", reason=error_description or error_reason or error)
    if not code or not state:
        return _frontend_redirect("error", reason="missing_code_or_state")

    try:
        payload = _serializer.loads(state, max_age=STATE_MAX_AGE_SECONDS)
    except BadSignature:
        return _frontend_redirect("error", reason="bad_state")

    user = db.get(models.User, payload["uid"])
    brand = db.get(models.Brand, payload["bid"])
    if not user or not brand or brand.user_id != user.id:
        return _frontend_redirect("error", reason="bad_state_owner")

    try:
        with httpx.Client(timeout=20.0) as client:
            # 1. code → short-lived user token
            r = client.get(f"{GRAPH}/oauth/access_token", params={
                "client_id": settings.META_CLIENT_ID,
                "client_secret": settings.META_CLIENT_SECRET,
                "redirect_uri": settings.META_REDIRECT_URI,
                "code": code,
            })
            if r.status_code >= 300:
                return _frontend_redirect("error", reason=f"token_{r.status_code}")
            short_token = r.json().get("access_token")
            if not short_token:
                return _frontend_redirect("error", reason="no_access_token")

            # 2. short-lived → long-lived (~60 days)
            r = client.get(f"{GRAPH}/oauth/access_token", params={
                "grant_type": "fb_exchange_token",
                "client_id": settings.META_CLIENT_ID,
                "client_secret": settings.META_CLIENT_SECRET,
                "fb_exchange_token": short_token,
            })
            if r.status_code >= 300:
                return _frontend_redirect("error", reason=f"longlived_{r.status_code}")
            long_data = r.json()
            user_token = long_data.get("access_token") or short_token
            user_expires_in = int(long_data.get("expires_in", 0) or 0)
            user_expires_at = (
                datetime.utcnow() + timedelta(seconds=user_expires_in)
                if user_expires_in else None
            )

            # 3. Pages + linked IG Business accounts
            r = client.get(f"{GRAPH}/me/accounts", params={
                "fields": "id,name,access_token,instagram_business_account{id,username}",
                "access_token": user_token,
            })
            if r.status_code >= 300:
                return _frontend_redirect("error", reason=f"pages_{r.status_code}")
            pages = r.json().get("data", []) or []
    except httpx.HTTPError as e:
        return _frontend_redirect("error", reason=f"http_{type(e).__name__}")

    if not pages:
        return _frontend_redirect("error", reason="no_pages")

    fb_count = 0
    ig_count = 0
    for page in pages:
        page_id = page.get("id")
        page_name = page.get("name") or f"page:{page_id}"
        page_token = page.get("access_token")
        if not page_id or not page_token:
            continue
        _upsert_connection(
            db,
            brand_id=brand.id,
            platform="facebook",
            external_account_id=page_id,
            handle=page_name,
            access_token=page_token,
            scopes=settings.META_SCOPES,
            expires_at=user_expires_at,  # page tokens themselves don't expire, but we mirror user expiry
        )
        fb_count += 1

        ig = page.get("instagram_business_account") or {}
        ig_id = ig.get("id")
        if ig_id:
            ig_handle = ig.get("username") or f"ig:{ig_id}"
            _upsert_connection(
                db,
                brand_id=brand.id,
                platform="instagram",
                external_account_id=ig_id,
                handle=ig_handle,
                access_token=page_token,
                scopes=settings.META_SCOPES,
                expires_at=user_expires_at,
            )
            ig_count += 1

    db.commit()
    extra: dict[str, str] = {"brand_id": str(brand.id), "fb": str(fb_count), "ig": str(ig_count)}
    if fb_count > 1 or ig_count > 1:
        extra["note"] = "multiple_accounts"
    return _frontend_redirect("ok", **extra)
