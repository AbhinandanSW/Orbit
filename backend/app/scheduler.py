"""APScheduler tick that publishes due posts.

Runs every SCHEDULER_INTERVAL_SECONDS in-process via BackgroundScheduler. For
each post in `scheduled` status whose `scheduled_at` has passed, we look up the
matching Connection per platform and call the platform publisher. The returned
external id is stored under `Post.external_ids[platform]`.

Only LinkedIn is wired up today; other platforms are silently skipped (the post
stays scheduled). Publish errors flip a post to `failed` with `last_error` set.
"""
from __future__ import annotations

import logging
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from . import models
from .config import settings
from .db import SessionLocal
from .publishers import linkedin as linkedin_pub
from .publishers import facebook as facebook_pub
from .publishers import instagram as instagram_pub
from .publishers import youtube as youtube_pub

log = logging.getLogger("orbit.scheduler")

_scheduler: BackgroundScheduler | None = None
SUPPORTED_PLATFORMS = {"linkedin", "facebook", "instagram", "youtube"}


def _publish_one(db: Session, post: models.Post) -> None:
    platforms = list(post.platforms or [])
    targets = [p for p in platforms if p in SUPPORTED_PLATFORMS]
    if not targets:
        # Nothing we can publish yet; mark as published so it doesn't loop.
        # (Other platforms will be wired in later.)
        post.status = "published"
        post.published_at = datetime.utcnow()
        return

    external_ids = dict(post.external_ids or {})
    errors: list[str] = []

    for platform in targets:
        if external_ids.get(platform):
            continue  # already published to this platform
        conn = (
            db.query(models.Connection)
            .filter(
                models.Connection.brand_id == post.brand_id,
                models.Connection.platform == platform,
                models.Connection.status == "active",
            )
            .order_by(models.Connection.connected_at.desc())
            .first()
        )
        if conn is None:
            errors.append(f"{platform}: no active connection")
            continue
        try:
            if platform == "linkedin":
                ext_id = linkedin_pub.publish_text(conn, post.caption or "")
            elif platform == "facebook":
                ext_id = facebook_pub.publish_text(conn, post.caption or "")
            elif platform == "instagram":
                media_urls = list(post.media_urls or [])
                image_url = media_urls[0] if media_urls else ""
                ext_id = instagram_pub.publish_image(conn, post.caption or "", image_url)
            elif platform == "youtube":
                ext_id = youtube_pub.publish_video(
                    db, conn, post.caption or "", list(post.media_urls or []),
                )
            else:
                continue
            external_ids[platform] = ext_id
        except Exception as e:  # noqa: BLE001
            log.exception("publish failed post=%s platform=%s", post.id, platform)
            errors.append(f"{platform}: {e}")

    post.external_ids = external_ids
    flag_modified(post, "external_ids")

    published_any = bool(external_ids)
    if errors and not published_any:
        post.status = "failed"
        post.last_error = " | ".join(errors)
    elif errors:
        post.status = "published"
        post.published_at = datetime.utcnow()
        post.last_error = " | ".join(errors)
    else:
        post.status = "published"
        post.published_at = datetime.utcnow()
        post.last_error = None


def tick() -> None:
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        due = (
            db.query(models.Post)
            .filter(
                models.Post.status == "scheduled",
                models.Post.scheduled_at != None,  # noqa: E711
                models.Post.scheduled_at <= now,
            )
            .limit(25)
            .all()
        )
        for post in due:
            try:
                _publish_one(db, post)
                db.commit()
            except Exception:  # noqa: BLE001
                log.exception("tick failure for post=%s", post.id)
                db.rollback()
    finally:
        db.close()


def start() -> None:
    global _scheduler
    if _scheduler is not None or not settings.SCHEDULER_ENABLED:
        return
    sched = BackgroundScheduler(daemon=True, timezone="UTC")
    sched.add_job(
        tick,
        "interval",
        seconds=settings.SCHEDULER_INTERVAL_SECONDS,
        id="orbit-publish-tick",
        max_instances=1,
        coalesce=True,
        next_run_time=datetime.utcnow(),
    )
    sched.start()
    _scheduler = sched
    log.info("scheduler started, interval=%ss", settings.SCHEDULER_INTERVAL_SECONDS)


def stop() -> None:
    global _scheduler
    if _scheduler is None:
        return
    _scheduler.shutdown(wait=False)
    _scheduler = None
