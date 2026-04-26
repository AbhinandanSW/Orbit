"""Test fixtures.

Each test gets an isolated SQLite file under /tmp so we don't touch the dev DB.
The scheduler is disabled (we drive `tick()` manually in tests).
"""
from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest

# Set env BEFORE importing the app so config.Settings picks them up.
_TMP = Path(tempfile.mkdtemp(prefix="orbit-test-"))
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP / 'test.db'}"
os.environ["UPLOAD_DIR"] = str(_TMP / "uploads")
os.environ["SCHEDULER_ENABLED"] = "0"
os.environ["TOKEN_ENC_KEY"] = "dGVzdF9rZXlfdGVzdF9rZXlfdGVzdF9rZXlfdGVzdF9rZXk="

from fastapi.testclient import TestClient  # noqa: E402

from app import models  # noqa: E402
from app.auth import hash_password  # noqa: E402
from app.db import Base, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def _setup_schema():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db():
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()


@pytest.fixture()
def seeded_user(db):
    db.query(models.User).delete()
    db.commit()
    user = models.User(
        email="t@orbit.app",
        password_hash=hash_password("pw123456"),
        name="T User",
        verified=True,
    )
    db.add(user)
    db.flush()
    brand = models.Brand(user_id=user.id, name="Test Brand", color="#FF5A1F", initials="TB")
    db.add(brand)
    db.commit()
    db.refresh(user)
    db.refresh(brand)
    return user, brand


@pytest.fixture()
def client(seeded_user):
    user, _ = seeded_user
    c = TestClient(app)
    r = c.post("/api/auth/login", json={"email": user.email, "password": "pw123456"})
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    c.headers["Authorization"] = f"Bearer {token}"
    return c
