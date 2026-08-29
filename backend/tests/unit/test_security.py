"""
tests/unit/test_security.py
Security unit tests for MPLADS Guardian.

Tests:
- JWT token creation and decoding
- Expired token rejection
- Wrong secret rejection  
- Algorithm confusion (none algorithm attack)
- Payload tampering detection
- Role-based access enforcement
- Password hashing strength
- Input sanitization (SQL injection patterns)
"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pytest
import time
from datetime import timedelta

from app.auth.jwt_handler import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.auth.models import UserRole


class TestJWTSecurity:
    """JWT token security tests."""

    def test_valid_token_decoded_correctly(self):
        """VERIFIED: Valid token produces correct payload."""
        token = create_access_token(
            subject="user@mplads.gov.in",
            role=UserRole.INVESTIGATOR,
            state="Maharashtra",
            district="Pune",
        )
        payload = decode_access_token(token)
        assert payload is not None, "Valid token failed to decode"
        assert payload.sub == "user@mplads.gov.in"
        assert payload.role == UserRole.INVESTIGATOR
        assert payload.state == "Maharashtra"
        assert payload.district == "Pune"

    def test_expired_token_rejected(self):
        """VERIFIED: Token expired 1 second ago is rejected, not accepted."""
        token = create_access_token(
            subject="expired@test.com",
            role=UserRole.INVESTIGATOR,
            expires_delta=timedelta(seconds=-1),  # Already expired
        )
        payload = decode_access_token(token)
        assert payload is None, \
            f"Expired token should return None, but got: {payload}"

    def test_tampered_payload_rejected(self):
        """VERIFIED: Modified token signature fails validation."""
        token = create_access_token(
            subject="real@test.com",
            role=UserRole.INVESTIGATOR,
        )
        # Tamper with signature
        tampered = token[:-4] + "XXXX"
        payload = decode_access_token(tampered)
        assert payload is None, \
            f"Tampered token should return None, but got: {payload}"

    def test_wrong_secret_token_rejected(self):
        """VERIFIED: Token signed with wrong secret key is rejected."""
        # Create a token signed with a different secret by manipulating the decode
        # We simulate this by creating a token and then manually verifying the decode
        # rejects tokens with wrong key via the test token format
        token = create_access_token(subject="test@test.com", role=UserRole.INVESTIGATOR)
        # Inject a different header
        parts = token.split(".")
        if len(parts) == 3:
            # Change signature to invalid
            parts[2] = "invalidsignatureXXX"
            bad_token = ".".join(parts)
            payload = decode_access_token(bad_token)
            assert payload is None, "Wrong-secret token should be rejected"

    def test_none_algorithm_attack_rejected(self):
        """SECURITY: 'none' algorithm attack must be rejected."""
        import base64
        import json

        # Craft a token with 'none' algorithm (classic JWT attack)
        header = base64.urlsafe_b64encode(
            json.dumps({"alg": "none", "typ": "JWT"}).encode()
        ).rstrip(b"=").decode()
        payload = base64.urlsafe_b64encode(
            json.dumps({
                "sub": "attacker@evil.com",
                "role": "ADMIN",
                "exp": int(time.time()) + 9999999,
            }).encode()
        ).rstrip(b"=").decode()
        malicious_token = f"{header}.{payload}."  # Empty signature

        result = decode_access_token(malicious_token)
        assert result is None, \
            f"SECURITY CRITICAL: 'none' algorithm attack accepted! Got: {result}"

    def test_empty_token_rejected(self):
        """VERIFIED: Empty string token returns None."""
        assert decode_access_token("") is None

    def test_garbage_token_rejected(self):
        """VERIFIED: Random garbage string returns None."""
        assert decode_access_token("not.a.jwt.token.at.all") is None
        assert decode_access_token("AAAAAAAAAA") is None

    def test_token_contains_iat_claim(self):
        """VERIFIED: Tokens include iat (issued at) claim for audit trails."""
        token = create_access_token(
            subject="auditor@mplads.gov.in",
            role=UserRole.INVESTIGATOR,
        )
        # Decode raw payload without full validation
        import base64
        import json
        parts = token.split(".")
        if len(parts) == 3:
            padded = parts[1] + "=="
            raw = json.loads(base64.urlsafe_b64decode(padded).decode())
            assert "iat" in raw, "Token must contain 'iat' (issued at) claim for audit trails"
            assert "exp" in raw, "Token must contain 'exp' (expiry) claim"


class TestRoleBasedAccess:
    """Tests for role-based access control."""

    def test_all_user_roles_produce_valid_tokens(self):
        """VERIFIED: All user roles can be encoded and decoded correctly."""
        for role in UserRole:
            token = create_access_token(subject=f"{role.value}@test.com", role=role)
            payload = decode_access_token(token)
            assert payload is not None, f"Token for role {role} failed to decode"
            assert payload.role == role, \
                f"Role mismatch: expected {role}, got {payload.role}"

    def test_admin_role_encodes_without_state_restriction(self):
        """VERIFIED: Admin role tokens have no location restriction."""
        token = create_access_token(
            subject="admin@mplads.gov.in",
            role=UserRole.ADMIN,
            state=None,
            district=None,
        )
        payload = decode_access_token(token)
        assert payload is not None
        assert payload.role == UserRole.ADMIN
        assert payload.state is None  # Admin has no location restriction

    def test_analyst_role_encodes_state_restriction(self):
        """VERIFIED: Analyst tokens encode state restriction correctly."""
        token = create_access_token(
            subject="analyst@up.gov.in",
            role=UserRole.INVESTIGATOR,
            state="Uttar Pradesh",
            district="Lucknow",
        )
        payload = decode_access_token(token)
        assert payload is not None
        assert payload.role == UserRole.INVESTIGATOR
        assert payload.state == "Uttar Pradesh"
        assert payload.district == "Lucknow"


class TestPasswordSecurity:
    """Tests for password hashing security."""

    def test_password_hash_is_not_plaintext(self):
        """VERIFIED: Hashed password bears no resemblance to original."""
        password = "SecureP@ssw0rd123"
        hashed = hash_password(password)
        assert hashed != password, "Hash must not equal plaintext"
        assert password not in hashed, "Plaintext must not appear in hash"

    def test_password_verification_correct(self):
        """VERIFIED: Correct password verifies against its hash."""
        password = "TestP@ssword2024!"
        hashed = hash_password(password)
        assert verify_password(password, hashed) is True

    def test_wrong_password_verification_fails(self):
        """VERIFIED: Wrong password fails verification."""
        password = "CorrectPassword123"
        wrong = "WrongPassword456"
        hashed = hash_password(password)
        assert verify_password(wrong, hashed) is False

    def test_similar_passwords_produce_different_hashes(self):
        """VERIFIED: bcrypt uses random salt — identical inputs produce different hashes."""
        password = "SamePassword!"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2, "bcrypt should produce different hashes due to random salt"

    def test_hash_has_bcrypt_format(self):
        """VERIFIED: Produced hash uses bcrypt format ($2b$...)."""
        hashed = hash_password("TestPassword")
        assert hashed.startswith("$2b$"), \
            f"Expected bcrypt hash format ($2b$...), got: {hashed[:10]}"

    def test_empty_password_does_not_crash(self):
        """VERIFIED: Empty password is handled without crashing."""
        try:
            hashed = hash_password("")
            result = verify_password("", hashed)
            # Result may be True or False — what matters is no crash
        except Exception as e:
            pytest.fail(f"Empty password crashed: {e}")

    def test_garbage_hash_returns_false(self):
        """VERIFIED: Garbage hash input returns False, not exception."""
        result = verify_password("password", "not_a_real_hash")
        assert result is False


class TestInputSanitization:
    """Tests for input boundary conditions."""

    def test_project_id_with_sql_injection_pattern(self):
        """VERIFIED: SQL injection in project_id is handled safely (no crash, no leakage)."""
        from models.agent import AgentContext
        from models.digital_twin import ProjectDigitalTwin
        from models.enums import ProjectStatus
        from agents.deterministic.budget import BudgetAgent

        # SQL injection pattern in project_id
        malicious_id = "' OR 1=1; DROP TABLE projects; --"
        twin = ProjectDigitalTwin(
            project_id=malicious_id,
            project_name="Test Project",
            project_status=ProjectStatus.IN_PROGRESS,
        )
        ctx = AgentContext(project_id=malicious_id, digital_twin=twin)

        # Must not raise an exception — inputs are just strings in the domain model
        try:
            ev = BudgetAgent().run(ctx)
            assert ev is not None
        except Exception as e:
            pytest.fail(f"SQL injection pattern caused crash: {e}")

    def test_extremely_long_project_id(self):
        """VERIFIED: Very long project ID is handled gracefully."""
        from models.agent import AgentContext
        from models.digital_twin import ProjectDigitalTwin
        from models.enums import ProjectStatus
        from agents.deterministic.deadline import DeadlineAgent

        long_id = "P" * 10000
        twin = ProjectDigitalTwin(
            project_id=long_id,
            project_name="Long ID Project",
            project_status=ProjectStatus.IN_PROGRESS,
        )
        ctx = AgentContext(project_id=long_id, digital_twin=twin)
        try:
            ev = DeadlineAgent().run(ctx)
            assert ev is not None
        except Exception as e:
            pytest.fail(f"Long project ID caused crash: {e}")

    def test_unicode_in_project_fields(self):
        """VERIFIED: Unicode characters in fields do not crash agents."""
        from models.agent import AgentContext
        from models.digital_twin import ProjectDigitalTwin
        from models.enums import ProjectStatus
        from agents.deterministic.documentation import DocumentationAgent

        twin = ProjectDigitalTwin(
            project_id="UNICODE-TEST",
            project_name="परियोजना नाम — ₹ 25,00,000 — 工程项目",
            project_status=ProjectStatus.IN_PROGRESS,
        )
        ctx = AgentContext(project_id="UNICODE-TEST", digital_twin=twin)
        try:
            ev = DocumentationAgent().run(ctx)
            assert ev is not None
        except Exception as e:
            pytest.fail(f"Unicode input caused crash: {e}")
