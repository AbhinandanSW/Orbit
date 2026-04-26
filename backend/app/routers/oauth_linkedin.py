"""LinkedIn OAuth (personal profile, OIDC + w_member_social).

Flow:
  1. Frontend (authenticated) calls GET /api/oauth/linkedin/start?brand_id=N
     and gets back an authorize URL it redirects the browser to.
  2. LinkedIn bounces the browser to /api/oauth/linkedin/callback with code+state.
  3. We verify state (signed; carries user_id+brand_id), exchange the code for an
     access token, fetch /v2/userinfo for `sub`/name/email, and upsert a
     Connection row with the encrypted token + sub stored as external_account_id.
  4. We redirect the browser back to FRONTEND_URL/settings with a status flag.
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

router = APIRouter(prefix="/oauth/linkedin", tags=["oauth"])

AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization"
TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
USERINFO_URL = "https://api.linkedin.com/v2/userinfo"

_serializer = URLSafeTimedSerializer(settings.JWT_SECRET, salt="linkedin-oauth")
STATE_MAX_AGE_SECONDS = 600


def _frontend_redirect(status: str, **extra: str) -> RedirectResponse:
    qs = urllib.parse.urlencode({"linkedin": status, **extra})
    return RedirectResponse(f"{settings.FRONTEND_URL}/settings?{qs}", status_code=302)


@router.get("/start")
def start(
    brand_id: int,
    user: models.User = Depends(get_current_user),
):
    if not settings.LINKEDIN_CLIENT_ID:
        raise HTTPException(500, "LINKEDIN_CLIENT_ID not configured")
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
        "client_id": settings.LINKEDIN_CLIENT_ID,
        "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
        "scope": settings.LINKEDIN_SCOPES,
        "state": state,
    }
    return {"authorize_url": f"{AUTHORIZE_URL}?{urllib.parse.urlencode(params)}"}


@router.get("/callback")
def callback(
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
    error_description: str | None = Query(None),
    db: Session = Depends(get_db),
):
    if error:
        return _frontend_redirect("error", reason=error_description or error)
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

    # Exchange code → access token.
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
        "client_id": settings.LINKEDIN_CLIENT_ID,
        "client_secret": settings.LINKEDIN_CLIENT_SECRET,
    }
    try:
        with httpx.Client(timeout=20.0) as client:
            tok_resp = client.post(
                TOKEN_URL,
                data=token_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            )
            if tok_resp.status_code >= 300:
                return _frontend_redirect("error", reason=f"token_{tok_resp.status_code}")
            tok = tok_resp.json()
            access_token = tok.get("access_token")
            expires_in = int(tok.get("expires_in", 0) or 0)
            refresh_token = tok.get("refresh_token")
            scope = tok.get("scope") or settings.LINKEDIN_SCOPES
            if not access_token:
                return _frontend_redirect("error", reason="no_access_token")

            # OIDC userinfo: sub, name, email.
            ui_resp = client.get(
                USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if ui_resp.status_code >= 300:
                return _frontend_redirect("error", reason=f"userinfo_{ui_resp.status_code}")
            ui = ui_resp.json()
    except httpx.HTTPError as e:
        return _frontend_redirect("error", reason=f"http_{type(e).__name__}")

    sub = ui.get("sub")
    if not sub:
        return _frontend_redirect("error", reason="no_sub")

    handle = ui.get("email") or ui.get("name") or f"linkedin:{sub}"
    expires_at = datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else None

    conn = (
        db.query(models.Connection)
        .filter(
            models.Connection.brand_id == brand.id,
            models.Connection.platform == "linkedin",
            models.Connection.external_account_id == sub,
        )
        .one_or_none()
    )
    if conn is None:
        conn = models.Connection(
            brand_id=brand.id,
            platform="linkedin",
            handle=handle,
            external_account_id=sub,
        )
        db.add(conn)

    conn.handle = handle
    conn.access_token = access_token
    if refresh_token:
        conn.refresh_token = refresh_token
    conn.token_expires_at = expires_at
    conn.scopes = scope
    conn.status = "active"
    conn.last_error = None
    conn.connected_at = datetime.utcnow()

    db.commit()
    return _frontend_redirect("ok", brand_id=str(brand.id))
