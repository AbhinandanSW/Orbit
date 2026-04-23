from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..db import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/connections", tags=["connections"])

ALLOWED = {"instagram", "facebook", "linkedin", "youtube", "threads"}


@router.get("", response_model=list[schemas.ConnectionOut])
def list_conns(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    bids = [b.id for b in user.brands]
    return db.query(models.Connection).filter(models.Connection.brand_id.in_(bids)).all()


@router.post("", response_model=schemas.ConnectionOut)
def connect(data: schemas.ConnectionIn, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.platform not in ALLOWED:
        raise HTTPException(400, "Unsupported platform")
    if data.brand_id not in [b.id for b in user.brands]:
        raise HTTPException(403, "Brand not owned")
    c = models.Connection(**data.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.delete("/{conn_id}")
def disconnect(conn_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    bids = [b.id for b in user.brands]
    c = db.get(models.Connection, conn_id)
    if not c or c.brand_id not in bids:
        raise HTTPException(404, "Not found")
    db.delete(c)
    db.commit()
    return {"ok": True}
