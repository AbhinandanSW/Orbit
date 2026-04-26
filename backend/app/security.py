"""Token encryption + a SQLAlchemy column type that handles it transparently."""
from __future__ import annotations

import base64
import hashlib

from cryptography.fernet import Fernet, InvalidToken
from sqlalchemy.types import String, TypeDecorator

from .config import settings


def _normalize_key(raw: str) -> bytes:
    """Accept either a real Fernet key or any string (hashed → 32 bytes → b64)."""
    try:
        Fernet(raw.encode())
        return raw.encode()
    except (ValueError, TypeError):
        digest = hashlib.sha256(raw.encode()).digest()
        return base64.urlsafe_b64encode(digest)


_fernet = Fernet(_normalize_key(settings.TOKEN_ENC_KEY))


def encrypt(plaintext: str) -> str:
    return _fernet.encrypt(plaintext.encode()).decode()


def decrypt(ciphertext: str) -> str:
    try:
        return _fernet.decrypt(ciphertext.encode()).decode()
    except InvalidToken as e:
        raise ValueError("Cannot decrypt token — wrong TOKEN_ENC_KEY?") from e


class EncryptedString(TypeDecorator):
    """Stores values encrypted at rest. NULL passes through."""

    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return encrypt(str(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return decrypt(value)
