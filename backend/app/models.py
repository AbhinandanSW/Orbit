from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from .db import Base
from .security import EncryptedString


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="Social lead")
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    brands = relationship("Brand", back_populates="user", cascade="all, delete-orphan")


class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)
    initials = Column(String, nullable=False)
    user = relationship("User", back_populates="brands")
    posts = relationship("Post", back_populates="brand", cascade="all, delete-orphan")
    connections = relationship("Connection", back_populates="brand", cascade="all, delete-orphan")


class Connection(Base):
    __tablename__ = "connections"
    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"))
    platform = Column(String, nullable=False)  # instagram|facebook|linkedin|youtube|threads
    handle = Column(String, nullable=False)
    connected_at = Column(DateTime, default=datetime.utcnow)

    external_account_id = Column(String, nullable=True)
    access_token = Column(EncryptedString(2048), nullable=True)
    refresh_token = Column(EncryptedString(2048), nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    scopes = Column(String, nullable=True)
    status = Column(String, default="active")  # active|expired|revoked|error
    last_error = Column(String, nullable=True)

    brand = relationship("Brand", back_populates="connections")


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"))
    caption = Column(String, default="")
    platforms = Column(JSON, default=list)
    media_urls = Column(JSON, default=list)
    scheduled_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    status = Column(String, default="draft")  # draft|scheduled|published|failed|review
    engagement = Column(Float, default=0.0)
    reach = Column(Integer, default=0)
    external_ids = Column(JSON, default=dict)  # {"linkedin": "urn:li:share:..."}
    last_error = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    brand = relationship("Brand", back_populates="posts")


class MetricSample(Base):
    __tablename__ = "metric_samples"
    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), index=True)
    platform = Column(String, index=True)
    timestamp = Column(DateTime, index=True)
    reach = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    saves = Column(Integer, default=0)
    clicks = Column(Integer, default=0)


class Goal(Base):
    __tablename__ = "goals"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    brand_id = Column(Integer, ForeignKey("brands.id", ondelete="CASCADE"), nullable=True, index=True)
    platform = Column(String, nullable=True)  # None = all platforms
    metric = Column(String, nullable=False)  # reach|engagement_rate|posts_published|saves|clicks
    target_value = Column(Float, nullable=False)
    title = Column(String, nullable=False)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
