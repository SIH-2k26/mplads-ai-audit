"""
tests/unit/test_auth_and_rbac.py
Unit tests for JWT generation, validation, password hashing, and RBAC models.
"""
import pytest
from app.auth.jwt_handler import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.auth.models import UserRole


def test_password_hashing():
    pw = "SuperSecret123!"
    hashed = hash_password(pw)
    assert hashed != pw
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_creation_and_decoding():
    token = create_access_token(
        subject="officer_sharma",
        role=UserRole.DISTRICT_AUTHORITY,
        state="Uttar Pradesh",
        district="Varanasi",
    )

    payload = decode_access_token(token)
    assert payload is not None
    assert payload.sub == "officer_sharma"
    assert payload.role == UserRole.DISTRICT_AUTHORITY
    assert payload.district == "Varanasi"
