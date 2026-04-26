"""LinkedIn personal-profile publisher.

Uses the OIDC `sub` claim (stored as `Connection.external_account_id`) to build
the `urn:li:person:{sub}` author URN, then posts text via the v2 ugcPosts API.

Returns the resulting share/UGC URN, which the caller stores as the post's
external_id for that platform.
"""
from __future__ import annotations

import httpx

from .. import models


class LinkedInPublishError(RuntimeError):
    pass


UGC_ENDPOINT = "https://api.linkedin.com/v2/ugcPosts"


def publish_text(connection: models.Connection, text: str) -> str:
    if not connection.access_token:
        raise LinkedInPublishError("Connection has no access token — reconnect LinkedIn.")
    if not connection.external_account_id:
        raise LinkedInPublishError("Connection is missing LinkedIn member id (sub).")

    author_urn = f"urn:li:person:{connection.external_account_id}"
    body = {
        "author": author_urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text or ""},
                "shareMediaCategory": "NONE",
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    }
    headers = {
        "Authorization": f"Bearer {connection.access_token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
    }

    with httpx.Client(timeout=20.0) as client:
        resp = client.post(UGC_ENDPOINT, json=body, headers=headers)

    if resp.status_code >= 300:
        raise LinkedInPublishError(
            f"LinkedIn ugcPosts {resp.status_code}: {resp.text[:500]}"
        )

    # Preferred: the response header `x-restli-id` contains the URN.
    urn = resp.headers.get("x-restli-id") or resp.headers.get("X-RestLi-Id")
    if not urn:
        try:
            urn = resp.json().get("id")
        except Exception:
            urn = None
    if not urn:
        raise LinkedInPublishError("LinkedIn returned no post URN.")
    return urn
