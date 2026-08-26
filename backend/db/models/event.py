"""
db/models/event.py — Events ORM
db/models/agent_result.py — Agent results ORM
db/models/policy.py — Policy ORM
db/models/investigation.py — Investigation ORM
db/models/audit.py — Audit log ORM
All in one file to reduce import complexity for Alembic.
"""
from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    BigInteger, Boolean, DateTime, Float, ForeignKey,
    Index, Integer, String, Text, UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base, TimestampMixin


# ══════════════════════════════════════════════════════
# Events
# ══════════════════════════════════════════════════════

class EventORM(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    project_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    entity_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    entity_type: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    schema_version: Mapped[str] = mapped_column(String(16), nullable=False, default="1.0")
    source: Mapped[str] = mapped_column(String(128), nullable=False)
    actor: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)

    payload: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    changed_fields: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    previous_values: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    new_values: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    provenance_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    correlation_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)

    __table_args__ = (
        Index("ix_events_project_type", "project_id", "event_type"),
        Index("ix_events_timestamp_type", "timestamp", "event_type"),
    )


# ══════════════════════════════════════════════════════
# Agent Results
# ══════════════════════════════════════════════════════

class AgentResultORM(Base, TimestampMixin):
    __tablename__ = "agent_results"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    agent_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    agent_name: Mapped[str] = mapped_column(String(128), nullable=False)
    agent_version: Mapped[str] = mapped_column(String(32), nullable=False)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )

    status: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    severity: Mapped[str] = mapped_column(String(32), nullable=False, default="UNKNOWN")
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    applicability: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)

    signals_json: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    evidence_json: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    data_sources: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    provenance_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    execution_time_ms: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recommendation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    __table_args__ = (
        UniqueConstraint("project_id", "agent_id", "created_at", name="uq_agent_result_project_agent_time"),
        Index("ix_agent_results_project_agent", "project_id", "agent_id"),
    )


# ══════════════════════════════════════════════════════
# Policy
# ══════════════════════════════════════════════════════

class PolicyORM(Base, TimestampMixin):
    __tablename__ = "policies"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    version: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(512), nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    document_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    effective_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    effective_to: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    authority: Mapped[str] = mapped_column(String(256), nullable=False)
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    __table_args__ = (
        UniqueConstraint("id", "version", name="uq_policy_id_version"),
        Index("ix_policies_effective", "effective_from", "effective_to"),
    )


class PolicyRuleORM(Base):
    __tablename__ = "policy_rules"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    policy_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("policies.id", ondelete="CASCADE"), nullable=False, index=True
    )
    policy_version: Mapped[str] = mapped_column(String(32), nullable=False)
    rule_name: Mapped[str] = mapped_column(String(256), nullable=False)
    condition: Mapped[str] = mapped_column(Text, nullable=False)
    requirement: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(32), nullable=False)
    applicable_categories: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    applicable_states: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    source_reference: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    source_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)


# ══════════════════════════════════════════════════════
# Investigation
# ══════════════════════════════════════════════════════

class InvestigationCaseORM(Base, TimestampMixin):
    __tablename__ = "investigation_cases"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    priority: Mapped[str] = mapped_column(String(32), nullable=False, default="MEDIUM", index=True)
    status: Mapped[str] = mapped_column(String(64), nullable=False, default="NEW", index=True)

    risk_score_at_creation: Mapped[float] = mapped_column(Float, nullable=False)
    risk_level_at_creation: Mapped[str] = mapped_column(String(32), nullable=False)
    risk_fingerprint_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    trigger_signals: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    agent_evidence_summary_json: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)

    assigned_to: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    assigned_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class CaseEvidenceORM(Base):
    __tablename__ = "case_evidence"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("investigation_cases.id", ondelete="CASCADE"), nullable=False, index=True
    )
    evidence_type: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    value_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    source: Mapped[str] = mapped_column(String(128), nullable=False)
    source_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    document_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    agent_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    provenance_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default="now()")
    added_by: Mapped[str] = mapped_column(String(64), nullable=False, default="system")


class InvestigatorVerdictORM(Base):
    __tablename__ = "investigation_verdicts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("investigation_cases.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )
    verdict: Mapped[str] = mapped_column(String(64), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    investigator_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    investigator_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    investigator_role: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    supporting_evidence_ids: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default="now()")
    is_feedback_consented: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)


# ══════════════════════════════════════════════════════
# Audit / Provenance
# ══════════════════════════════════════════════════════

class AuditLogORM(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    project_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    actor: Mapped[str] = mapped_column(String(128), nullable=False)
    action: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default="now()", nullable=False, index=True
    )
    before_state: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    after_state: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    details: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)


class ProvenanceRecordORM(Base):
    __tablename__ = "provenance_records"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    entity_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    source_id: Mapped[str] = mapped_column(String(256), nullable=False)
    source_type: Mapped[str] = mapped_column(String(32), nullable=False)
    source_name: Mapped[str] = mapped_column(String(512), nullable=False)
    document_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    page: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    section: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    source_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ingestion_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default="now()", nullable=False
    )
    processing_version: Mapped[str] = mapped_column(String(32), nullable=False, default="1.0.0")
    checksum: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    __table_args__ = (
        Index("ix_provenance_entity", "entity_type", "entity_id"),
    )


class DataQualityIssueORM(Base, TimestampMixin):
    __tablename__ = "data_quality_issues"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    field_name: Mapped[str] = mapped_column(String(128), nullable=False)
    issue_type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[str] = mapped_column(String(32), nullable=False)
    age_days: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    resolved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
