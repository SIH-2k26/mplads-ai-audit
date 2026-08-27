"""
app/auth/jwt_handler.py
JWT Token issuance, validation, and password hashing utility.

Security Notes:
- JWT_SECRET_KEY is read from settings (env var in production).
- No hardcoded fallback secrets. Never commit secrets to source control.
"""
from __future__ import annotations
from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt
from jose import JWTError, jwt

from app.auth.models import TokenPayload, UserRole
from app.config.settings import get_settings

settings = get_settings()

JWT_ALGORITHM = settings.jwt_algorithm
JWT_EXPIRATION_MINUTES = settings.jwt_expiration_minutes


def _get_secret() -> str:
    """Return the JWT secret key from settings. Raises if not configured."""
    secret = settings.jwt_secret_key
    if not secret or len(secret) < 16:
        raise RuntimeError(
            "JWT_SECRET_KEY is not properly configured. "
            "Set a cryptographically random string of at least 32 characters "
            "via the JWT_SECRET_KEY environment variable."
        )
    return secret


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
    """Creates a signed JWT token containing user identity and RBAC role."""
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=JWT_EXPIRATION_MINUTES)
    )

    to_encode = {
        "sub": subject,
        "role": role.value if hasattr(role, "value") else str(role),
        "state": state,
        "district": district,
        "exp": int(expire.timestamp()),
        "iat": int(datetime.now(timezone.utc).timestamp()),
    }
    return jwt.encode(to_encode, _get_secret(), algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[TokenPayload]:
    """Decodes and validates a JWT token. Returns None on any validation failure."""
    try:
        payload = jwt.decode(token, _get_secret(), algorithms=[JWT_ALGORITHM])
        return TokenPayload(
            sub=payload["sub"],
            role=UserRole(payload["role"]),
            state=payload.get("state"),
            district=payload.get("district"),
            exp=payload["exp"],
        )
    except (JWTError, KeyError, ValueError):
        return None
