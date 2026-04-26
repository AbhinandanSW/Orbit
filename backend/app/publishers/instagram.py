"""Instagram Business content publisher.

Two-step Graph API flow:
  1. POST /{ig-user-id}/media with image_url + caption → returns creation_id
  2. POST /{ig-user-id}/media_publish with creation_id → returns ig media id

IG Content Publishing API constraints to be aware of:
  - The IG account must be a Business or Creator account linked to a Facebook Page.
  - Text-only posts are NOT supported. Every post needs at least one media item.
  - `image_url` must be PUBLICLY reachable from Meta's servers — localhost or
    auth-gated URLs will fail. In dev, point UPLOAD_PUBLIC_BASE at a tunnel
    (e.g. ngrok) or a real CDN.
  - JPEG/PNG only for images; videos use a different (longer) flow not handled here.
"""
from __future__ import annotations

import httpx

from .. import models
from ..config import settings


class InstagramPublishError(RuntimeError):
    pass


def publish_image(connection: models.Connection, caption: str, image_url: str) -> str:
    if not connection.access_token:
        raise InstagramPublishError("Connection has no access token — reconnect Meta.")
    if not connection.external_account_id:
        raise InstagramPublishError("Connection is missing IG Business account id.")
    if not image_url:
        raise InstagramPublishError(
            "Instagram requires a publicly reachable image URL — text-only posts are not supported."
        )
    if image_url.startswith("http://localhost") or image_url.startswith("http://127."):
        raise InstagramPublishError(
            "Instagram cannot fetch localhost URLs. Configure UPLOAD_PUBLIC_BASE to a public host."
        )

    base = f"https://graph.facebook.com/{settings.META_GRAPH_VERSION}/{connection.external_account_id}"

    with httpx.Client(timeout=30.0) as client:
        # Step 1 — create container
        r = client.post(
            f"{base}/media",
            data={
                "image_url": image_url,
                "caption": caption or "",
                "access_token": connection.access_token,
            },
        )
        if r.status_code >= 300:
            raise InstagramPublishError(
                f"Instagram /media {r.status_code}: {r.text[:500]}"
            )
        creation_id = r.json().get("id")
        if not creation_id:
            raise InstagramPublishError("Instagram /media returned no creation id.")

        # Step 2 — publish container
        r = client.post(
            f"{base}/media_publish",
            data={"creation_id": creation_id, "access_token": connection.access_token},
        )
        if r.status_code >= 300:
            raise InstagramPublishError(
                f"Instagram /media_publish {r.status_code}: {r.text[:500]}"
            )
        media_id = r.json().get("id")
        if not media_id:
            raise InstagramPublishError("Instagram /media_publish returned no media id.")
        return media_id
