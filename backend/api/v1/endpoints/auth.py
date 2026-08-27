"""
api/v1/endpoints/auth.py
Authentication endpoints: Login, user profile, and JWT token issuance.
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.jwt_handler import create_access_token, hash_password, verify_password
from app.auth.models import TokenResponse, UserBase, UserCreate, UserLogin, UserRole
from app.auth.dependencies import get_current_user, TokenPayload

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory mock user store for authentication (production backed by PostgreSQL UserORM)
MOCK_USERS = {
    "admin": {
        "password_hash": hash_password("admin123"),
        "role": UserRole.ADMIN,
        "state": None,
        "district": None,
    },
    "investigator_delhi": {
        "password_hash": hash_password("investigator123"),
        "role": UserRole.INVESTIGATOR,
        "state": "Delhi",
        "district": "New Delhi",
    },
    "district_officer_up": {
        "password_hash": hash_password("officer123"),
        "role": UserRole.DISTRICT_AUTHORITY,
        "state": "Uttar Pradesh",
        "district": "Lucknow",
    },
}


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin) -> TokenResponse:
    """
    Authenticates user credentials and returns a signed JWT bearer token with assigned RBAC roles.
    """
    user = MOCK_USERS.get(credentials.username)
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(
        subject=credentials.username,
        role=user["role"],
        state=user.get("state"),
        district=user.get("district"),
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=user["role"],
        username=credentials.username,
        expires_in_seconds=86400,
    )


@router.get("/me")
async def get_my_profile(current_user: TokenPayload = Depends(get_current_user)):
    """
    Returns the decoded profile and RBAC permissions for the currently authenticated bearer token.
    """
    return {
        "username": current_user.sub,
        "role": current_user.role,
        "state": current_user.state,
        "district": current_user.district,
    }
