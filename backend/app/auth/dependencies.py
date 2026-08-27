"""
app/auth/dependencies.py
FastAPI security dependencies for Authentication and Role-Based Access Control (RBAC).
"""
from __future__ import annotations
from typing import Callable, List, Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt_handler import decode_access_token
from app.auth.models import TokenPayload, UserRole

security_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
) -> TokenPayload:
    """
    Extracts and validates the current user token from the Authorization header.
    """
    if credentials is None:
        # For development ease if not authenticated, return anonymous dev role or raise 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


def require_role(allowed_roles: List[UserRole]) -> Callable:
    """
    Dependency generator enforcing that the authenticated user possesses one of the allowed RBAC roles.
    """
    async def role_checker(current_user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
        if current_user.role not in allowed_roles and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: User role '{current_user.role.value}' lacks required permissions.",
            )
        return current_user

    return role_checker
