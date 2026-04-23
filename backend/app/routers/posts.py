from __future__ import annotations
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_
from sqlalchemy.orm import Session
from .. import models, schemas
from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/posts", tags=["posts"])


def _owned_brand_ids(user: models.User) -> list[int]:
    return [b.id for b in user.brands]


@router.get("", response_model=list[schemas.PostOut])
def list_posts(
    status: str | None = None,
    brand_id: int | None = None,
    month: str | None = Query(None, description="YYYY-MM"),
    user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(models.Post).filter(models.Post.brand_id.in_(_owned_brand_ids(user)))
    if status:
        q = q.filter(models.Post.status == status)
    if brand_id:
        q = q.filter(models.Post.brand_id == brand_id)
    if month:
        y, m = map(int, month.split("-"))
        start = datetime(y, m, 1)
        end = datetime(y + (m // 12), (m % 12) + 1, 1)
        q = q.filter(and_(models.Post.scheduled_at >= start, models.Post.scheduled_at < end))
    return q.order_by(models.Post.scheduled_at.desc().nullslast()).all()


@router.post("", response_model=schemas.PostOut)
def create_post(data: schemas.PostIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.brand_id not in _owned_brand_ids(user):
        raise HTTPException(403, "Brand not owned")
    post = models.Post(**data.model_dump())
    if post.scheduled_at and post.status == "draft":
        post.status = "scheduled"
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.patch("/{post_id}", response_model=schemas.PostOut)
def patch_post(post_id: int, data: schemas.PostPatch, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.get(models.Post, post_id)
    if not post or post.brand_id not in _owned_brand_ids(user):
        raise HTTPException(404, "Not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(post, k, v)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}")
def delete_post(post_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    post = db.get(models.Post, post_id)
    if not post or post.brand_id not in _owned_brand_ids(user):
        raise HTTPException(404, "Not found")
    db.delete(post)
    db.commit()
    return {"ok": True}
