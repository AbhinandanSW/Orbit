"""Facebook Page publisher.

Posts text (and optional link) to a Page via the Graph API. Requires a Page
access token (stored on the Connection by oauth_meta) and the
`pages_manage_posts` scope. Returns the resulting `{page_id}_{post_id}` id,
which the caller stores as the post's external_id for facebook.
"""
from __future__ import annotations

import httpx

from .. import models
from ..config import settings


class FacebookPublishError(RuntimeError):
    pass


def publish_text(connection: models.Connection, text: str, link: str | None = None) -> str:
    if not connection.access_token:
        raise FacebookPublishError("Connection has no access token — reconnect Meta.")
    if not connection.external_account_id:
        raise FacebookPublishError("Connection is missing Facebook Page id.")

    endpoint = (
        f"https://graph.facebook.com/{settings.META_GRAPH_VERSION}"
        f"/{connection.external_account_id}/feed"
    )
    data = {"message": text or "", "access_token": connection.access_token}
    if link:
        data["link"] = link

    with httpx.Client(timeout=20.0) as client:
        resp = client.post(endpoint, data=data)

    if resp.status_code >= 300:
        raise FacebookPublishError(
            f"Facebook /feed {resp.status_code}: {resp.text[:500]}"
        )
    post_id = resp.json().get("id")
    if not post_id:
        raise FacebookPublishError("Facebook returned no post id.")
    return post_id
