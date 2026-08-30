"""
app/auth/models.py
User and RBAC role models for MPLADS Guardian.
"""
from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    MP = "MP"
    DISTRICT_AUTHORITY = "DISTRICT_AUTHORITY"
    STATE_AUTHORITY = "STATE_AUTHORITY"
    MINISTRY = "MINISTRY"
    INVESTIGATOR = "INVESTIGATOR"
    ADMIN = "ADMIN"


class UserBase(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: UserRole = UserRole.DISTRICT_AUTHORITY
    state: Optional[str] = None
    district: Optional[str] = None
    constituency_id: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    username: str
    expires_in_seconds: int


class TokenPayload(BaseModel):
    sub: str                # username
    role: UserRole
    state: Optional[str] = None
    district: Optional[str] = None
    exp: int
