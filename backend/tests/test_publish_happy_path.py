"""Happy-path: scheduled LinkedIn post → tick → published with external_id.

Mocks the LinkedIn HTTP call so we don't need real credentials.
"""
from __future__ import annotations

from datetime import datetime, timedelta

from app import models, scheduler
from app.publishers import linkedin as linkedin_pub


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"ok": True}


def test_media_upload(client, tmp_path):
    img = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32
    r = client.post(
        "/api/media",
        files={"file": ("p.png", img, "image/png")},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["url"].startswith("/uploads/")
    assert body["content_type"] == "image/png"


def test_scheduled_post_publishes(client, db, seeded_user, monkeypatch):
    user, brand = seeded_user

    # Pretend the user finished the LinkedIn OAuth dance.
    conn = models.Connection(
        brand_id=brand.id,
        platform="linkedin",
        handle="t@orbit.app",
        external_account_id="li-sub-123",
        access_token="fake-access-token",
        scopes="openid profile email w_member_social",
        status="active",
    )
    db.add(conn)
    db.commit()

    # Create a scheduled post in the past so the next tick picks it up.
    past = (datetime.utcnow() - timedelta(minutes=1)).isoformat()
    r = client.post("/api/posts", json={
        "brand_id": brand.id,
        "caption": "Hello from the orbit test suite.",
        "platforms": ["linkedin"],
        "media_urls": [],
        "scheduled_at": past,
        "status": "scheduled",
    })
    assert r.status_code == 200, r.text
    post_id = r.json()["id"]

    calls = {"n": 0}

    def fake_publish(connection, text):
        calls["n"] += 1
        assert connection.access_token == "fake-access-token"
        assert "orbit test suite" in text
        return "urn:li:share:fake-7777"

    monkeypatch.setattr(linkedin_pub, "publish_text", fake_publish)

    scheduler.tick()

    db.expire_all()
    post = db.get(models.Post, post_id)
    assert calls["n"] == 1
    assert post.status == "published"
    assert post.external_ids == {"linkedin": "urn:li:share:fake-7777"}
    assert post.last_error is None
    assert post.published_at is not None


def test_publish_fails_without_connection(client, db, seeded_user, monkeypatch):
    _, brand = seeded_user

    past = (datetime.utcnow() - timedelta(minutes=1)).isoformat()
    r = client.post("/api/posts", json={
        "brand_id": brand.id,
        "caption": "no conn",
        "platforms": ["linkedin"],
        "media_urls": [],
        "scheduled_at": past,
        "status": "scheduled",
    })
    post_id = r.json()["id"]

    scheduler.tick()
    db.expire_all()
    post = db.get(models.Post, post_id)
    assert post.status == "failed"
    assert "no active connection" in (post.last_error or "")
