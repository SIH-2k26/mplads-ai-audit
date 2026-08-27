"""
app/auth/jwt_handler.py
JWT Token issuance, validation, and password hashing utility.
"""
from __future__ import annotations
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import bcrypt
from jose import JWTError, jwt

from app.auth.models import TokenPayload, UserRole
from app.config.settings import get_settings

settings = get_settings()

JWT_SECRET_KEY = getattr(settings, "jwt_secret_key", "mplads-guardian-production-secret-key-2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 60 * 24  # 24 hours


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


def create_access_token(
    subject: str,
    role: UserRole,
    state: Optional[str] = None,
    district: Optional[str] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Creates signed JWT token containing user identity and RBAC role."""
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=JWT_EXPIRATION_MINUTES))
    
    to_encode = {
        "sub": subject,
        "role": role.value if hasattr(role, "value") else str(role),
        "state": state,
        "district": district,
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[TokenPayload]:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return TokenPayload(
            sub=payload["sub"],
            role=UserRole(payload["role"]),
            state=payload.get("state"),
            district=payload.get("district"),
            exp=payload["exp"],
        )
    except (JWTError, KeyError, ValueError):
        return None
