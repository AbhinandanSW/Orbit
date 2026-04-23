from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..db import get_db
from ..deps import get_current_user

router = APIRouter(tags=["brands"])


@router.get("/me", response_model=schemas.MeOut)
def me(user: models.User = Depends(get_current_user)):
    return {"user": user, "brands": user.brands}


@router.get("/brands", response_model=list[schemas.BrandOut])
def list_brands(user: models.User = Depends(get_current_user)):
    return user.brands
