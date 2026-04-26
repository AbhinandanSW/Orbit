"""Google OAuth (used for YouTube uploads).

Flow:
  1. Frontend (authenticated) calls GET /api/oauth/google/start?brand_id=N and
     gets back the Google authorize URL.
  2. Google bounces the browser to /api/oauth/google/callback with code+state.
  3. We verify state (signed; carries user_id+brand_id), exchange the code for
     access+refresh tokens, fetch the channel id from
     youtube.channels.list?mine=true, and upsert a Connection row with
     platform=youtube. Tokens are stored Fernet-encrypted via EncryptedString.
  4. We redirect the browser back to FRONTEND_URL/settings with a status flag.

Note: while Google's OAuth consent screen is in "Testing" mode in the GCP
console, this works for up to 100 listed test users without app verification.
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

router = APIRouter(prefix="/oauth/google", tags=["oauth"])

AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"
CHANNELS_URL = "https://www.googleapis.com/youtube/v3/channels"

_serializer = URLSafeTimedSerializer(settings.JWT_SECRET, salt="google-oauth")
STATE_MAX_AGE_SECONDS = 600


def _frontend_redirect(status: str, **extra: str) -> RedirectResponse:
    qs = urllib.parse.urlencode({"youtube": status, **extra})
    return RedirectResponse(f"{settings.FRONTEND_URL}/settings?{qs}", status_code=302)


@router.get("/start")
def start(
    brand_id: int,
    user: models.User = Depends(get_current_user),
):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(500, "GOOGLE_CLIENT_ID not configured")
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
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "scope": settings.GOOGLE_SCOPES,
        "state": state,
        "access_type": "offline",  # we want a refresh_token
        "prompt": "consent",       # force refresh_token issuance on every connect
        "include_granted_scopes": "true",
    }
    return {"authorize_url": f"{AUTHORIZE_URL}?{urllib.parse.urlencode(params)}"}


@router.get("/callback")
def callback(
    code: str | None = Query(None),
    state: str | None = Query(None),
    error: str | None = Query(None),
    db: Session = Depends(get_db),
):
    if error:
        return _frontend_redirect("error", reason=error)
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

    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
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
            refresh_token = tok.get("refresh_token")
            expires_in = int(tok.get("expires_in", 0) or 0)
            scope = tok.get("scope") or settings.GOOGLE_SCOPES
            if not access_token:
                return _frontend_redirect("error", reason="no_access_token")

            # Channel id (the YouTube account this user controls).
            ch_resp = client.get(
                CHANNELS_URL,
                params={"part": "snippet", "mine": "true"},
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if ch_resp.status_code >= 300:
                return _frontend_redirect("error", reason=f"channels_{ch_resp.status_code}")
            ch_payload = ch_resp.json()
            items = ch_payload.get("items") or []
            if not items:
                return _frontend_redirect("error", reason="no_youtube_channel")
            channel = items[0]
            channel_id = channel["id"]
            channel_title = channel.get("snippet", {}).get("title", channel_id)
    except httpx.HTTPError as e:
        return _frontend_redirect("error", reason=f"http_{type(e).__name__}")

    expires_at = datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else None

    conn = (
        db.query(models.Connection)
        .filter(
            models.Connection.brand_id == brand.id,
            models.Connection.platform == "youtube",
            models.Connection.external_account_id == channel_id,
        )
        .one_or_none()
    )
    if conn is None:
        conn = models.Connection(
            brand_id=brand.id,
            platform="youtube",
            handle=channel_title,
            external_account_id=channel_id,
        )
        db.add(conn)

    conn.handle = channel_title
    conn.access_token = access_token
    if refresh_token:  # Google only sends refresh_token on first consent (or with prompt=consent)
        conn.refresh_token = refresh_token
    conn.token_expires_at = expires_at
    conn.scopes = scope
    conn.status = "active"
    conn.last_error = None
    conn.connected_at = datetime.utcnow()

    db.commit()
    return _frontend_redirect("ok", brand_id=str(brand.id), channel=channel_title)
