from __future__ import annotations
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])

VALID_METRICS = {"reach", "engagement_rate", "posts_published", "saves", "clicks"}
VALID_PLATFORMS = {"instagram", "facebook", "linkedin", "youtube", "threads"}


def _owned_brand_ids(user: models.User) -> list[int]:
    return [b.id for b in user.brands]


def _validate(data: schemas.GoalIn | schemas.GoalPatch, user: models.User) -> None:
    if getattr(data, "metric", None) and data.metric not in VALID_METRICS:
        raise HTTPException(400, f"metric must be one of {sorted(VALID_METRICS)}")
    if getattr(data, "platform", None) and data.platform not in VALID_PLATFORMS:
        raise HTTPException(400, f"platform must be one of {sorted(VALID_PLATFORMS)}")
    if getattr(data, "brand_id", None) and data.brand_id not in _owned_brand_ids(user):
        raise HTTPException(403, "Brand not owned")


@router.get("", response_model=list[schemas.GoalOut])
def list_goals(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Goal).filter(models.Goal.user_id == user.id).order_by(models.Goal.created_at.desc()).all()


@router.post("", response_model=schemas.GoalOut)
def create_goal(data: schemas.GoalIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    _validate(data, user)
    if data.period_end <= data.period_start:
        raise HTTPException(400, "period_end must be after period_start")
    goal = models.Goal(user_id=user.id, **data.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.patch("/{goal_id}", response_model=schemas.GoalOut)
def patch_goal(goal_id: int, data: schemas.GoalPatch, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.get(models.Goal, goal_id)
    if not goal or goal.user_id != user.id:
        raise HTTPException(404, "Not found")
    _validate(data, user)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(goal, k, v)
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}")
def delete_goal(goal_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.get(models.Goal, goal_id)
    if not goal or goal.user_id != user.id:
        raise HTTPException(404, "Not found")
    db.delete(goal)
    db.commit()
    return {"ok": True}


def _compute(goal: models.Goal, user: models.User, db: Session) -> dict:
    now = datetime.utcnow()
    start = goal.period_start
    effective_end = min(now, goal.period_end)
    bids = [goal.brand_id] if goal.brand_id and goal.brand_id in _owned_brand_ids(user) else _owned_brand_ids(user)

    if goal.metric == "posts_published":
        q = db.query(models.Post).filter(
            models.Post.brand_id.in_(bids),
            models.Post.status == "published",
            models.Post.published_at >= start,
            models.Post.published_at <= effective_end,
        )
        posts = q.all()
        if goal.platform:
            posts = [p for p in posts if goal.platform in (p.platforms or [])]
        current = float(len(posts))
        by_day: dict[str, float] = {}
        for p in posts:
            key = p.published_at.date().isoformat()
            by_day[key] = by_day.get(key, 0) + 1
        series = []
        running = 0.0
        d = start.date()
        while d <= effective_end.date():
            running += by_day.get(d.isoformat(), 0)
            series.append({"date": d.isoformat(), "actual": round(running, 2)})
            d += timedelta(days=1)
    else:
        col = goal.metric  # reach|engagement_rate|saves|clicks
        q = db.query(models.MetricSample).filter(
            models.MetricSample.brand_id.in_(bids),
            models.MetricSample.timestamp >= start,
            models.MetricSample.timestamp <= effective_end,
        )
        if goal.platform:
            q = q.filter(models.MetricSample.platform == goal.platform)
        rows = q.all()
        if goal.metric == "engagement_rate":
            current = round(sum(getattr(r, col) for r in rows) / max(len(rows), 1), 2)
        else:
            current = float(sum(getattr(r, col) for r in rows))

        by_day = {}
        counts: dict[str, int] = {}
        for r in rows:
            key = r.timestamp.date().isoformat()
            by_day[key] = by_day.get(key, 0) + getattr(r, col)
            counts[key] = counts.get(key, 0) + 1
        series = []
        running = 0.0
        d = start.date()
        while d <= effective_end.date():
            daily = by_day.get(d.isoformat(), 0)
            if goal.metric == "engagement_rate":
                c = counts.get(d.isoformat(), 0)
                val = round(daily / c, 2) if c else 0.0
                series.append({"date": d.isoformat(), "actual": val})
            else:
                running += daily
                series.append({"date": d.isoformat(), "actual": round(running, 2)})
            d += timedelta(days=1)

    total_seconds = max((goal.period_end - goal.period_start).total_seconds(), 1)
    elapsed_seconds = max((effective_end - start).total_seconds(), 1)
    if goal.metric == "engagement_rate":
        forecast = current
    else:
        forecast = current * (total_seconds / elapsed_seconds) if elapsed_seconds > 0 else current

    percent = round(100 * current / goal.target_value, 1) if goal.target_value else 0.0

    if current >= goal.target_value:
        status = "achieved"
    elif forecast >= goal.target_value:
        status = "on_track"
    elif forecast >= goal.target_value * 0.85:
        status = "at_risk"
    else:
        status = "off_track"

    days_left = max((goal.period_end - now).days, 0)

    return {
        "goal_id": goal.id,
        "current": round(current, 2),
        "target": goal.target_value,
        "percent": percent,
        "forecast": round(forecast, 2),
        "status": status,
        "series": series,
        "period_start": goal.period_start.isoformat(),
        "period_end": goal.period_end.isoformat(),
        "days_left": days_left,
    }


@router.get("/progress")
def progress_all(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    goals = db.query(models.Goal).filter(models.Goal.user_id == user.id).all()
    return [{**_compute(g, user, db), "goal": {
        "id": g.id, "title": g.title, "metric": g.metric, "target_value": g.target_value,
        "brand_id": g.brand_id, "platform": g.platform,
        "period_start": g.period_start.isoformat(), "period_end": g.period_end.isoformat(),
    }} for g in goals]


@router.get("/{goal_id}/progress")
def progress(goal_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    goal = db.get(models.Goal, goal_id)
    if not goal or goal.user_id != user.id:
        raise HTTPException(404, "Not found")
    return _compute(goal, user, db)
