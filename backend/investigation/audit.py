"""
investigation/audit.py
Audit trail for investigation cases.
Every significant action is recorded immutably.
"""
from __future__ import annotations
from datetime import datetime, timezone
UTC = timezone.utc
from typing import Any, Optional
from uuid import uuid4
from models.investigation import AuditEntry


class AuditService:
    """Creates immutable audit entries for investigation actions."""

    def record(
        self,
        case_id: str,
        actor: str,
        action: str,
        before_state: Optional[dict[str, Any]] = None,
        after_state: Optional[dict[str, Any]] = None,
        details: Optional[dict[str, Any]] = None,
    ) -> AuditEntry:
        return AuditEntry(
            audit_id=str(uuid4()),
            case_id=case_id,
            actor=actor,
            action=action,
            timestamp=datetime.now(UTC),
            before_state=before_state,
            after_state=after_state,
            details=details or {},
        )
