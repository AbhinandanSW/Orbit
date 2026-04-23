from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..db import get_db
from ..auth import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["auth"])

DEFAULT_BRANDS = [
    {"name": "Luma Studio", "color": "#FF5A1F", "initials": "LS"},
    {"name": "Arc & Oak", "color": "#7C5CFF", "initials": "AO"},
    {"name": "Kinfolk Coffee", "color": "#C8FF3D", "initials": "KC"},
    {"name": "Verge Athletics", "color": "#FF4D6D", "initials": "VA"},
    {"name": "Mira Botanics", "color": "#3DC6FF", "initials": "MB"},
]


@router.post("/signup", response_model=schemas.UserOut)
def signup(data: schemas.SignupIn, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=data.email).first():
        raise HTTPException(409, "Email already registered")
    user = models.User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name,
    )
    db.add(user)
    db.flush()
    for b in DEFAULT_BRANDS:
        db.add(models.Brand(user_id=user.id, **b))
    db.commit()
    db.refresh(user)
    return user


@router.post("/verify", response_model=schemas.TokenOut)
def verify(data: schemas.VerifyIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=data.email).first()
    if not user:
        raise HTTPException(404, "User not found")
    # Dev OTP: accept 000000
    if data.code != "000000":
        raise HTTPException(400, "Invalid code")
    user.verified = True
    db.commit()
    return schemas.TokenOut(access_token=create_token(user.id))


@router.post("/login", response_model=schemas.TokenOut)
def login(data: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    return schemas.TokenOut(access_token=create_token(user.id))
