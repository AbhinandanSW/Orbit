"""Pluggable upload storage. Local filesystem by default; S3 if STORAGE_BACKEND=s3."""
from __future__ import annotations

from pathlib import Path
from typing import Protocol

from .config import settings


class Storage(Protocol):
    async def put(self, name: str, body: bytes, content_type: str) -> str: ...


class LocalStorage:
    def __init__(self, root: str, public_base: str) -> None:
        self.root = Path(root)
        self.public_base = public_base.rstrip("/")
        self.root.mkdir(parents=True, exist_ok=True)

    async def put(self, name: str, body: bytes, content_type: str) -> str:
        (self.root / name).write_bytes(body)
        return f"{self.public_base}/{name}"


class S3Storage:
    def __init__(self) -> None:
        import boto3  # imported lazily so dev installs don't need boto3

        if not settings.S3_BUCKET:
            raise RuntimeError("STORAGE_BACKEND=s3 requires S3_BUCKET")
        self.bucket = settings.S3_BUCKET
        self.client = boto3.client("s3", region_name=settings.S3_REGION)
        self.public_base = (
            settings.S3_PUBLIC_BASE.rstrip("/")
            or f"https://{self.bucket}.s3.{settings.S3_REGION}.amazonaws.com"
        )

    async def put(self, name: str, body: bytes, content_type: str) -> str:
        self.client.put_object(
            Bucket=self.bucket,
            Key=name,
            Body=body,
            ContentType=content_type,
            ACL="public-read",
        )
        return f"{self.public_base}/{name}"


def get_storage() -> Storage:
    if settings.STORAGE_BACKEND == "s3":
        return S3Storage()
    return LocalStorage(settings.UPLOAD_DIR, settings.UPLOAD_PUBLIC_BASE)
