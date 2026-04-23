from __future__ import annotations
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
from .. import models
from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/metrics", tags=["metrics"])

PLATFORMS = ["instagram", "facebook", "linkedin", "youtube", "threads"]


def _brand_ids(user: models.User, brand_id: int | None) -> list[int]:
    ids = [b.id for b in user.brands]
    return [brand_id] if brand_id and brand_id in ids else ids


@router.get("/summary")
def summary(
    brand_id: int | None = None,
    range_: str = Query("7d", alias="range"),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    days = int(range_.rstrip("d")) if range_.endswith("d") else 7
    since = datetime.utcnow() - timedelta(days=days)
    bids = _brand_ids(user, brand_id)
    rows = db.query(models.MetricSample).filter(
        models.MetricSample.brand_id.in_(bids),
        models.MetricSample.timestamp >= since,
    ).all()
    total_reach = sum(r.reach for r in rows)
    avg_eng = round(sum(r.engagement_rate for r in rows) / max(len(rows), 1), 2)
    per_platform = {}
    for p in PLATFORMS:
        prows = [r for r in rows if r.platform == p]
        per_platform[p] = {
            "reach": sum(r.reach for r in prows),
            "engagement": round(sum(r.engagement_rate for r in prows) / max(len(prows), 1), 2),
        }
    scheduled = db.query(models.Post).filter(
        models.Post.brand_id.in_(bids),
        models.Post.status == "scheduled",
    ).count()
    # Sparkline: last N days reach sum by day
    by_day = {}
    for r in rows:
        key = r.timestamp.date().isoformat()
        by_day[key] = by_day.get(key, 0) + r.reach
    spark = [by_day.get((since + timedelta(days=i)).date().isoformat(), 0) for i in range(days)]
    return {
        "reach": total_reach,
        "engagement_rate": avg_eng,
        "posts_scheduled": scheduled,
        "per_platform": per_platform,
        "spark": spark,
    }


@router.get("/timeseries")
def timeseries(
    metric: str = "reach",
    platform: str | None = None,
    range_: str = Query("30d", alias="range"),
    brand_id: int | None = None,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    days = int(range_.rstrip("d")) if range_.endswith("d") else 30
    since = datetime.utcnow() - timedelta(days=days)
    bids = _brand_ids(user, brand_id)
    q = db.query(models.MetricSample).filter(
        models.MetricSample.brand_id.in_(bids),
        models.MetricSample.timestamp >= since,
    )
    if platform:
        q = q.filter(models.MetricSample.platform == platform)
    rows = q.all()
    col = {"reach": "reach", "engagement": "engagement_rate", "saves": "saves", "clicks": "clicks"}[metric]
    by_day: dict[str, float] = {}
    for r in rows:
        key = r.timestamp.date().isoformat()
        by_day[key] = by_day.get(key, 0) + getattr(r, col)
    series = [
        {"date": (since + timedelta(days=i)).date().isoformat(),
         "value": by_day.get((since + timedelta(days=i)).date().isoformat(), 0)}
        for i in range(days)
    ]
    return {"metric": metric, "series": series}


@router.get("/heatmap")
def heatmap(
    brand_id: int | None = None,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bids = _brand_ids(user, brand_id)
    rows = db.query(models.MetricSample).filter(models.MetricSample.brand_id.in_(bids)).all()
    grid = [[0.0 for _ in range(24)] for _ in range(7)]
    counts = [[0 for _ in range(24)] for _ in range(7)]
    for r in rows:
        d = r.timestamp.weekday()
        h = r.timestamp.hour
        grid[d][h] += r.engagement_rate
        counts[d][h] += 1
    for d in range(7):
        for h in range(24):
            if counts[d][h]:
                grid[d][h] = round(grid[d][h] / counts[d][h], 2)
    return {"grid": grid}
