from __future__ import annotations
import json
import re
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..config import settings
from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])

PLATFORMS = {"instagram", "facebook", "linkedin", "youtube", "threads"}


def _client():
    if not settings.ANTHROPIC_API_KEY:
        raise HTTPException(503, "AI is not configured. Add ANTHROPIC_API_KEY to backend/.env and restart the server.")
    from anthropic import Anthropic
    return Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def _brand_by_name(user: models.User, name: str | None) -> list[int]:
    if not name:
        return [b.id for b in user.brands]
    match = [b for b in user.brands if b.name.lower() == name.lower()]
    if not match:
        # loose substring fallback
        match = [b for b in user.brands if name.lower() in b.name.lower()]
    return [b.id for b in match] or [b.id for b in user.brands]


def _tool_query_metrics(db: Session, user: models.User, args: dict) -> dict:
    metric = args.get("metric", "reach")
    if metric not in {"reach", "engagement_rate", "saves", "clicks"}:
        return {"error": f"unknown metric {metric}"}
    days = int(args.get("days_back") or 30)
    since = datetime.utcnow() - timedelta(days=days)
    bids = _brand_by_name(user, args.get("brand_name"))
    q = db.query(models.MetricSample).filter(
        models.MetricSample.brand_id.in_(bids),
        models.MetricSample.timestamp >= since,
    )
    plat = args.get("platform")
    if plat and plat in PLATFORMS:
        q = q.filter(models.MetricSample.platform == plat)
    rows = q.all()
    if not rows:
        return {"metric": metric, "total": 0, "count": 0, "note": "no data for this filter"}
    if metric == "engagement_rate":
        value = round(sum(r.engagement_rate for r in rows) / len(rows), 2)
    else:
        value = sum(getattr(r, metric) for r in rows)
    per_platform: dict[str, float] = {}
    for p in PLATFORMS:
        prs = [r for r in rows if r.platform == p]
        if not prs:
            continue
        if metric == "engagement_rate":
            per_platform[p] = round(sum(r.engagement_rate for r in prs) / len(prs), 2)
        else:
            per_platform[p] = float(sum(getattr(r, metric) for r in prs))
    return {
        "metric": metric,
        "days_back": days,
        "brand_filter": args.get("brand_name") or "all_brands",
        "platform_filter": plat or "all_platforms",
        "value": value,
        "per_platform": per_platform,
        "sample_count": len(rows),
    }


def _tool_list_top_posts(db: Session, user: models.User, args: dict) -> dict:
    bids = _brand_by_name(user, args.get("brand_name"))
    sort_by = args.get("sort_by") or "engagement"
    limit = int(args.get("limit") or 5)
    q = db.query(models.Post).filter(
        models.Post.brand_id.in_(bids),
        models.Post.status == "published",
    )
    posts = q.all()
    plat = args.get("platform")
    if plat and plat in PLATFORMS:
        posts = [p for p in posts if plat in (p.platforms or [])]
    key = "engagement" if sort_by == "engagement" else "reach"
    posts.sort(key=lambda p: getattr(p, key), reverse=True)
    posts = posts[:limit]
    brand_map = {b.id: b.name for b in user.brands}
    return {
        "posts": [
            {
                "brand": brand_map.get(p.brand_id, "?"),
                "platforms": p.platforms,
                "caption": (p.caption or "")[:180],
                "engagement_pct": p.engagement,
                "reach": p.reach,
                "published_at": p.published_at.isoformat() if p.published_at else None,
            }
            for p in posts
        ]
    }


def _tool_compare_brands(db: Session, user: models.User, args: dict) -> dict:
    metric = args.get("metric", "reach")
    if metric not in {"reach", "engagement_rate", "saves", "clicks"}:
        return {"error": f"unknown metric {metric}"}
    days = int(args.get("days_back") or 30)
    since = datetime.utcnow() - timedelta(days=days)
    out = {}
    for b in user.brands:
        rows = db.query(models.MetricSample).filter(
            models.MetricSample.brand_id == b.id,
            models.MetricSample.timestamp >= since,
        ).all()
        if not rows:
            out[b.name] = 0
            continue
        if metric == "engagement_rate":
            out[b.name] = round(sum(r.engagement_rate for r in rows) / len(rows), 2)
        else:
            out[b.name] = float(sum(getattr(r, metric) for r in rows))
    ranked = sorted(out.items(), key=lambda kv: kv[1], reverse=True)
    return {"metric": metric, "days_back": days, "ranked": ranked}


def _tool_get_goals(db: Session, user: models.User, args: dict) -> dict:
    from .goals import _compute
    goals = db.query(models.Goal).filter(models.Goal.user_id == user.id).all()
    brand_map = {b.id: b.name for b in user.brands}
    out = []
    for g in goals:
        p = _compute(g, user, db)
        out.append({
            "id": g.id,
            "title": g.title,
            "metric": g.metric,
            "target": g.target_value,
            "current": p["current"],
            "percent": p["percent"],
            "forecast": p["forecast"],
            "status": p["status"],
            "days_left": p["days_left"],
            "brand": brand_map.get(g.brand_id) if g.brand_id else "all_brands",
            "platform": g.platform or "all_platforms",
        })
    return {"goals": out}


TOOLS = [
    {
        "name": "query_metrics",
        "description": "Aggregate the user's social metrics across a time range. Use this whenever the user asks about reach, engagement, saves, or clicks.",
        "input_schema": {
            "type": "object",
            "properties": {
                "metric": {"type": "string", "enum": ["reach", "engagement_rate", "saves", "clicks"]},
                "brand_name": {"type": "string", "description": "Filter by brand name. Omit for all brands."},
                "platform": {"type": "string", "enum": ["instagram", "facebook", "linkedin", "youtube", "threads"]},
                "days_back": {"type": "integer", "description": "Window size in days (default 30)."},
            },
            "required": ["metric"],
        },
    },
    {
        "name": "list_top_posts",
        "description": "Return top-performing published posts with their captions and stats.",
        "input_schema": {
            "type": "object",
            "properties": {
                "brand_name": {"type": "string"},
                "platform": {"type": "string", "enum": ["instagram", "facebook", "linkedin", "youtube", "threads"]},
                "sort_by": {"type": "string", "enum": ["engagement", "reach"]},
                "limit": {"type": "integer"},
            },
        },
    },
    {
        "name": "compare_brands",
        "description": "Rank all of the user's brands by a metric over a window.",
        "input_schema": {
            "type": "object",
            "properties": {
                "metric": {"type": "string", "enum": ["reach", "engagement_rate", "saves", "clicks"]},
                "days_back": {"type": "integer"},
            },
            "required": ["metric"],
        },
    },
    {
        "name": "get_goals",
        "description": "List the user's goals with their current progress, forecast, and status. Use when answering questions about goals or targets.",
        "input_schema": {"type": "object", "properties": {}},
    },
]

TOOL_FNS = {
    "query_metrics": _tool_query_metrics,
    "list_top_posts": _tool_list_top_posts,
    "compare_brands": _tool_compare_brands,
    "get_goals": _tool_get_goals,
}


@router.post("/chat")
def chat(data: schemas.ChatIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    client = _client()
    brand_list = ", ".join(f'"{b.name}"' for b in user.brands) or "(no brands)"
    system = (
        f"You are Orbit, a concise social-media analytics assistant for {user.name}. "
        f"The user manages these brands: {brand_list}. "
        f"Today is {datetime.utcnow().strftime('%Y-%m-%d')}. "
        "Always call a tool before citing a number; never invent data. "
        "Keep replies tight — 2–4 sentences with short bullet lists when useful. "
        "When a number surprises, call out the likely cause using the data you have."
    )
    messages = [{"role": m.role, "content": m.content} for m in data.messages]

    tool_calls: list[dict] = []
    for _ in range(6):
        resp = client.messages.create(
            model=settings.ANTHROPIC_MODEL,
            max_tokens=1024,
            system=system,
            tools=TOOLS,
            messages=messages,
        )
        if resp.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": [b.model_dump() for b in resp.content]})
            tool_results = []
            for block in resp.content:
                if block.type == "tool_use":
                    fn = TOOL_FNS.get(block.name)
                    try:
                        result = fn(db, user, block.input) if fn else {"error": f"unknown tool {block.name}"}
                    except Exception as e:
                        result = {"error": str(e)}
                    tool_calls.append({"name": block.name, "input": block.input, "result": result})
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })
            messages.append({"role": "user", "content": tool_results})
            continue
        text = "".join(b.text for b in resp.content if b.type == "text")
        return {"reply": text, "tool_calls": tool_calls}

    return {"reply": "I hit my reasoning limit — try rephrasing the question.", "tool_calls": tool_calls}


@router.post("/caption")
def caption(data: schemas.CaptionIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.platform not in PLATFORMS:
        raise HTTPException(400, f"platform must be one of {sorted(PLATFORMS)}")
    brand = db.get(models.Brand, data.brand_id)
    if not brand or brand.user_id != user.id:
        raise HTTPException(404, "Brand not found")

    client = _client()
    recent = (
        db.query(models.Post)
        .filter(models.Post.brand_id == brand.id, models.Post.status == "published")
        .order_by(models.Post.published_at.desc())
        .limit(6)
        .all()
    )
    examples = "\n".join(f"- {p.caption}" for p in recent if p.caption) or "(no prior captions)"
    tone = data.tone or "match the voice of the examples"
    system = (
        f"You write on-brand social captions for {brand.name}.\n"
        f"Study these recent captions for tone/voice/length/emoji usage:\n{examples}\n\n"
        f"Write 3 distinct caption variants for a {data.platform} post.\n"
        f"Topic: {data.topic}\n"
        f"Tone: {tone}\n"
        "Return ONLY a JSON array of 3 strings. No preamble, no trailing prose."
    )
    resp = client.messages.create(
        model=settings.ANTHROPIC_MODEL,
        max_tokens=600,
        system=system,
        messages=[{"role": "user", "content": "Generate the 3 captions now."}],
    )
    text = "".join(b.text for b in resp.content if getattr(b, "type", None) == "text")
    try:
        match = re.search(r"\[.*\]", text, re.DOTALL)
        captions = json.loads(match.group(0)) if match else [text.strip()]
        captions = [c for c in captions if isinstance(c, str) and c.strip()]
    except Exception:
        captions = [text.strip()]
    return {"captions": captions[:3] or [text.strip()]}
