from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class VerifyIn(BaseModel):
    email: EmailStr
    code: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str
    verified: bool
    class Config: from_attributes = True


class BrandOut(BaseModel):
    id: int
    name: str
    color: str
    initials: str
    class Config: from_attributes = True


class MeOut(BaseModel):
    user: UserOut
    brands: list[BrandOut]


class PostIn(BaseModel):
    brand_id: int
    caption: str = ""
    platforms: list[str] = []
    media_urls: list[str] = []
    scheduled_at: Optional[datetime] = None
    status: str = "draft"


class PostPatch(BaseModel):
    caption: Optional[str] = None
    platforms: Optional[list[str]] = None
    media_urls: Optional[list[str]] = None
    scheduled_at: Optional[datetime] = None
    status: Optional[str] = None


class PostOut(BaseModel):
    id: int
    brand_id: int
    caption: str
    platforms: list[str]
    media_urls: list[str]
    scheduled_at: Optional[datetime]
    published_at: Optional[datetime]
    status: str
    engagement: float
    reach: int
    class Config: from_attributes = True


class ConnectionIn(BaseModel):
    brand_id: int
    platform: str
    handle: str


class ConnectionOut(BaseModel):
    id: int
    brand_id: int
    platform: str
    handle: str
    connected_at: datetime
    class Config: from_attributes = True
