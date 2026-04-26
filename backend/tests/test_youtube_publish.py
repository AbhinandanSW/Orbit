"""YouTube scheduled-post happy path with publisher mocked."""
from __future__ import annotations

from datetime import datetime, timedelta

from app import models, scheduler
from app.publishers import youtube as yt_pub


def test_youtube_scheduled_post_publishes(client, db, seeded_user, monkeypatch):
    _, brand = seeded_user

    conn = models.Connection(
        brand_id=brand.id,
        platform="youtube",
        handle="Test Channel",
        external_account_id="UCfakefakefake",
        access_token="fake-yt-access",
        refresh_token="fake-yt-refresh",
        scopes="openid email profile https://www.googleapis.com/auth/youtube.upload",
        status="active",
    )
    db.add(conn)
    db.commit()

    past = (datetime.utcnow() - timedelta(minutes=1)).isoformat()
    r = client.post("/api/posts", json={
        "brand_id": brand.id,
        "caption": "Test upload\nlonger description here.",
        "platforms": ["youtube"],
        "media_urls": ["/uploads/sample.mp4"],
        "scheduled_at": past,
        "status": "scheduled",
    })
    assert r.status_code == 200, r.text
    post_id = r.json()["id"]

    seen = {}

    def fake_publish(db_arg, connection, caption, media_urls, *, privacy_status="public"):
        seen["caption"] = caption
        seen["media"] = list(media_urls)
        seen["channel"] = connection.external_account_id
        return "yt_video_abc123"

    monkeypatch.setattr(yt_pub, "publish_video", fake_publish)

    scheduler.tick()

    db.expire_all()
    post = db.get(models.Post, post_id)
    assert post.status == "published"
    assert post.external_ids == {"youtube": "yt_video_abc123"}
    assert seen["channel"] == "UCfakefakefake"
    assert seen["media"] == ["/uploads/sample.mp4"]


def test_youtube_publish_no_media_fails(client, db, seeded_user, monkeypatch):
    _, brand = seeded_user

    conn = models.Connection(
        brand_id=brand.id,
        platform="youtube",
        handle="Test Channel",
        external_account_id="UCfakefakefake",
        access_token="fake-yt-access",
        scopes="...youtube.upload",
        status="active",
    )
    db.add(conn)
    db.commit()

    past = (datetime.utcnow() - timedelta(minutes=1)).isoformat()
    r = client.post("/api/posts", json={
        "brand_id": brand.id,
        "caption": "no video attached",
        "platforms": ["youtube"],
        "media_urls": [],
        "scheduled_at": past,
        "status": "scheduled",
    })
    post_id = r.json()["id"]

    # Don't monkeypatch — we want the real publisher to surface its validation error.
    scheduler.tick()
    db.expire_all()
    post = db.get(models.Post, post_id)
    assert post.status == "failed"
    assert "needs a video" in (post.last_error or "").lower() or "media_urls is empty" in (post.last_error or "")
