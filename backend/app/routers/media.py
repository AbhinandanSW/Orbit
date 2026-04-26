from __future__ import annotations

import secrets
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from .. import models, schemas
from ..config import settings
from ..deps import get_current_user
from ..storage import get_storage

router = APIRouter(prefix="/media", tags=["media"])

ALLOWED_PREFIXES = ("image/", "video/")


@router.post("", response_model=schemas.MediaOut)
async def upload_media(
    file: UploadFile = File(...),
    user: models.User = Depends(get_current_user),
):
    if not file.content_type or not file.content_type.startswith(ALLOWED_PREFIXES):
        raise HTTPException(400, f"Unsupported content type: {file.content_type}")

    ext = Path(file.filename or "").suffix.lower()
    if len(ext) > 8:
        ext = ""
    name = f"{secrets.token_urlsafe(16)}{ext}"

    chunks: list[bytes] = []
    written = 0
    chunk = 1 << 20  # 1 MiB
    while True:
        buf = await file.read(chunk)
        if not buf:
            break
        written += len(buf)
        if written > settings.MAX_UPLOAD_BYTES:
            raise HTTPException(413, f"File exceeds {settings.MAX_UPLOAD_BYTES} bytes")
        chunks.append(buf)

    body = b"".join(chunks)
    url = await get_storage().put(name, body, file.content_type)

    return schemas.MediaOut(
        url=url,
        filename=file.filename or name,
        content_type=file.content_type,
        size=written,
    )
