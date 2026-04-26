"""YouTube video publisher.

Refresh-flow aware: if `Connection.token_expires_at` is past (or close), we
swap `refresh_token` for a fresh `access_token` against Google's token endpoint
and persist the new value (caller is responsible for committing).

Upload uses the multipart upload endpoint, which is fine for files up to a
few GB. For very large files prefer the resumable upload protocol — left as a
future improvement.
"""
from __future__ import annotations

import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse

import httpx
from sqlalchemy.orm import Session

from .. import models
from ..config import settings


class YouTubePublishError(RuntimeError):
    pass


TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"

VIDEO_EXTS = {".mp4", ".mov", ".webm", ".avi", ".mkv", ".m4v", ".3gp"}


def _refresh(connection: models.Connection) -> None:
    if not connection.refresh_token:
        raise YouTubePublishError("No refresh token — reconnect YouTube.")
    data = {
        "grant_type": "refresh_token",
        "refresh_token": connection.refresh_token,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
    }
    with httpx.Client(timeout=20.0) as client:
        resp = client.post(
            TOKEN_URL,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    if resp.status_code >= 300:
        connection.status = "expired"
        connection.last_error = f"refresh {resp.status_code}: {resp.text[:300]}"
        raise YouTubePublishError(connection.last_error)
    tok = resp.json()
    access = tok.get("access_token")
    if not access:
        raise YouTubePublishError("Token refresh returned no access_token")
    connection.access_token = access
    expires_in = int(tok.get("expires_in", 0) or 0)
    connection.token_expires_at = (
        datetime.utcnow() + timedelta(seconds=expires_in) if expires_in else None
    )


def _ensure_fresh_token(db: Session, connection: models.Connection) -> str:
    if not connection.access_token:
        raise YouTubePublishError("Connection has no access token — reconnect YouTube.")
    expires_at = connection.token_expires_at
    if expires_at and expires_at <= datetime.utcnow() + timedelta(seconds=60):
        _refresh(connection)
        db.add(connection)
        db.commit()
    return connection.access_token


def _resolve_media(media_url: str) -> tuple[bytes, str]:
    """Return (body, content_type) for a media reference.

    Accepts:
      - "/uploads/abc.mp4"             → reads from local UPLOAD_DIR
      - "http(s)://..."                → fetched with httpx
    """
    if media_url.startswith(("http://", "https://")):
        with httpx.Client(timeout=60.0) as client:
            r = client.get(media_url)
            r.raise_for_status()
            return r.content, r.headers.get("content-type", "video/mp4")

    # Local URL like /uploads/<name>.mp4
    parsed = urlparse(media_url)
    path = parsed.path or media_url
    base = settings.UPLOAD_PUBLIC_BASE.rstrip("/")
    if base and path.startswith(base + "/"):
        path = path[len(base) + 1 :]
    elif path.startswith("/"):
        path = path.lstrip("/")
    full = Path(settings.UPLOAD_DIR) / path
    if not full.is_file():
        raise YouTubePublishError(f"Media not found locally: {media_url}")
    suffix = full.suffix.lower()
    content_type = {
        ".mp4": "video/mp4",
        ".mov": "video/quicktime",
        ".webm": "video/webm",
        ".m4v": "video/x-m4v",
    }.get(suffix, "video/mp4")
    return full.read_bytes(), content_type


def _title_from_caption(caption: str) -> str:
    text = (caption or "").strip()
    if not text:
        return "Untitled"
    first_line = text.splitlines()[0]
    first_line = re.sub(r"\s+", " ", first_line).strip()
    return first_line[:100] or "Untitled"


def publish_video(
    db: Session,
    connection: models.Connection,
    caption: str,
    media_urls: list[str],
    *,
    privacy_status: str = "public",
) -> str:
    """Upload a video and return the YouTube video id."""
    if not media_urls:
        raise YouTubePublishError("YouTube post needs a video — media_urls is empty.")

    # Pick the first media that looks like a video.
    chosen = next(
        (
            u for u in media_urls
            if Path(urlparse(u).path).suffix.lower() in VIDEO_EXTS
        ),
        media_urls[0],
    )
    body, content_type = _resolve_media(chosen)

    metadata = {
        "snippet": {
            "title": _title_from_caption(caption),
            "description": caption or "",
            "categoryId": "22",  # People & Blogs — safe default
        },
        "status": {
            "privacyStatus": privacy_status,
            "selfDeclaredMadeForKids": False,
        },
    }

    access_token = _ensure_fresh_token(db, connection)

    boundary = "----orbit-yt-" + os.urandom(8).hex()
    multipart_body = (
        f"--{boundary}\r\n"
        f"Content-Type: application/json; charset=UTF-8\r\n\r\n"
        f"{json.dumps(metadata)}\r\n"
        f"--{boundary}\r\n"
        f"Content-Type: {content_type}\r\n\r\n"
    ).encode() + body + f"\r\n--{boundary}--\r\n".encode()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": f"multipart/related; boundary={boundary}",
    }
    params = {"part": "snippet,status", "uploadType": "multipart"}

    with httpx.Client(timeout=300.0) as client:
        resp = client.post(UPLOAD_URL, params=params, headers=headers, content=multipart_body)

    if resp.status_code == 401:
        # token may have expired between refresh check and request — try once more
        _refresh(connection)
        db.add(connection)
        db.commit()
        headers["Authorization"] = f"Bearer {connection.access_token}"
        with httpx.Client(timeout=300.0) as client:
            resp = client.post(UPLOAD_URL, params=params, headers=headers, content=multipart_body)

    if resp.status_code >= 300:
        raise YouTubePublishError(f"YouTube upload {resp.status_code}: {resp.text[:500]}")

    payload = resp.json()
    video_id = payload.get("id")
    if not video_id:
        raise YouTubePublishError(f"YouTube returned no video id: {payload}")
    return video_id
