"""
db/models/project.py
SQLAlchemy ORM models for project-related tables.
These are the persistence models — NOT the application models.
Application layer uses models/project.py (Pydantic).
"""
from __future__ import annotations
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Optional
from sqlalchemy import (
    BigInteger, Boolean, CheckConstraint, Date, DateTime, ForeignKey,
    Index, Integer, Numeric, String, Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base, TimestampMixin
import uuid


class ProjectORM(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(
        String(64), primary_key=True,
        comment="System project ID (e.g. MPLADS/UP/2022/0042)"
    )
    source_project_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    project_name: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    sub_category: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    # Political/administrative
    mp_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True, index=True)
    mp_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    constituency_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True, index=True)
    constituency_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)

    # Location (denormalized for query performance)
    district: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    state: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    district_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    state_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    location_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Sanction
    sanction_number: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    sanction_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    sanctioned_amount: Mapped[Decimal] = mapped_column(
        Numeric(14, 2), nullable=False, default=Decimal("0"),
        comment="In INR"
    )

    # Budget
    approved_budget: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=Decimal("0"))
    revised_budget: Mapped[Optional[Decimal]] = mapped_column(Numeric(14, 2), nullable=True)
    estimated_cost: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=Decimal("0"))
    revised_cost: Mapped[Optional[Decimal]] = mapped_column(Numeric(14, 2), nullable=True)

    # Expenditure (denormalized total)
    total_expenditure: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False, default=Decimal("0"))

    # Progress (latest snapshot — history in progress_records table)
    financial_progress: Mapped[Optional[float]] = mapped_column(
        Numeric(5, 2), nullable=True,
        comment="Percentage 0-100"
    )
    physical_progress: Mapped[Optional[float]] = mapped_column(
        Numeric(5, 2), nullable=True,
        comment="Percentage 0-100"
    )
    progress_as_of: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Timeline
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    expected_completion_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    actual_completion_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    approved_extensions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    extension_days: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Status
    project_status: Mapped[str] = mapped_column(String(32), nullable=False, default="UNKNOWN", index=True)

    # Implementing entities (denormalized for quick access)
    agency_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    agency_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    contractor_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    contractor_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)

    # Data quality
    data_completeness_score: Mapped[float] = mapped_column(Numeric(4, 3), nullable=False, default=1.0)
    data_quality_flags_json: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)

    # Digital twin
    twin_version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    twin_built_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Provenance
    source_checksum: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    source_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    last_ingested_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Graph
    neo4j_node_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    __table_args__ = (
        CheckConstraint("sanctioned_amount >= 0", name="ck_projects_sanctioned_amount"),
        CheckConstraint("total_expenditure >= 0", name="ck_projects_expenditure"),
        CheckConstraint("financial_progress >= 0 AND financial_progress <= 100", name="ck_projects_fin_progress"),
        CheckConstraint("physical_progress >= 0 AND physical_progress <= 100", name="ck_projects_phy_progress"),
        CheckConstraint("data_completeness_score >= 0 AND data_completeness_score <= 1", name="ck_projects_completeness"),
        Index("ix_projects_state_district", "state", "district"),
        Index("ix_projects_status_category", "project_status", "category"),
    )


class ProgressRecordORM(Base, TimestampMixin):
    __tablename__ = "progress_records"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    as_of_date: Mapped[date] = mapped_column(Date, nullable=False)
    financial_progress: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    physical_progress: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    reported_by: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    provenance_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    __table_args__ = (
        UniqueConstraint("project_id", "as_of_date", "source", name="uq_progress_project_date_source"),
        CheckConstraint("financial_progress >= 0 AND financial_progress <= 100", name="ck_progress_fin"),
        CheckConstraint("physical_progress >= 0 AND physical_progress <= 100", name="ck_progress_phy"),
    )


class PaymentORM(Base, TimestampMixin):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    payment_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    beneficiary: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    payment_type: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    voucher_number: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    provenance_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    __table_args__ = (
        CheckConstraint("amount >= 0", name="ck_payments_amount"),
    )


class ContractorORM(Base, TimestampMixin):
    __tablename__ = "contractors"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, comment="Canonical contractor ID")
    contractor_name: Mapped[str] = mapped_column(String(256), nullable=False)
    normalized_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True, index=True)
    registration_number: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    contact_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    source_ids: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True, comment="Original IDs from data sources")


class AgencyORM(Base, TimestampMixin):
    __tablename__ = "agencies"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, comment="Canonical agency ID")
    agency_name: Mapped[str] = mapped_column(String(256), nullable=False)
    normalized_name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True, index=True)
    agency_type: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    contact_info: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    source_ids: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)


class MilestoneORM(Base):
    __tablename__ = "milestones"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    planned_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    actual_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    completion_evidence: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)


# ─── Risk History ──────────────────────────────────────────────────────────────

class RiskHistoryORM(Base):
    """Immutable append-only risk score history per project."""
    __tablename__ = "risk_history"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    overall_risk_score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    risk_level: Mapped[str] = mapped_column(String(32), nullable=False)
    current_risk: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False, default=0)
    future_risk: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False, default=0)
    systemic_risk: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False, default=0)
    fingerprint_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    top_signals: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    agent_evidence_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    model_version: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    policy_version: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    weight_snapshot: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )

    __table_args__ = (
        Index("ix_risk_history_project_computed", "project_id", "computed_at"),
    )


# ─── Investigation Case ────────────────────────────────────────────────────────

class InvestigationCaseORM(Base, TimestampMixin):
    """Persisted investigation case."""
    __tablename__ = "investigation_cases"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, comment="UUID case_id")
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="OPEN", index=True)
    priority: Mapped[str] = mapped_column(String(32), nullable=False, default="MEDIUM")
    risk_score: Mapped[Optional[float]] = mapped_column(Numeric(6, 2), nullable=True)
    risk_level: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    trigger_signals: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    agent_summary: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)
    summary_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assigned_to: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    verdict: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    verdict_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    closed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class InvestigationEvidenceORM(Base):
    """Evidence items attached to an investigation case."""
    __tablename__ = "investigation_evidence"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    case_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("investigation_cases.id", ondelete="CASCADE"), nullable=False, index=True
    )
    evidence_type: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    document_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    confidence: Mapped[Optional[float]] = mapped_column(Numeric(4, 3), nullable=True)
    added_by: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


# ─── Feedback Records ──────────────────────────────────────────────────────────

class FeedbackRecordORM(Base):
    """Analyst-verified feedback record for supervised ML retraining."""
    __tablename__ = "feedback_records"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    project_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    case_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    analyst_id: Mapped[str] = mapped_column(String(128), nullable=False)
    predicted_risk_score: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    predicted_risk_level: Mapped[str] = mapped_column(String(32), nullable=False)
    human_verdict: Mapped[str] = mapped_column(String(64), nullable=False)
    is_false_positive: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_false_negative: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    analyst_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    model_version: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    agent_evidence_snapshot: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    risk_fingerprint_snapshot: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    used_for_training: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    used_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


# ─── Early Warnings ────────────────────────────────────────────────────────────

class EarlyWarningORM(Base):
    """Deduplicated early warning alerts per project."""
    __tablename__ = "early_warnings"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    project_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    warning_type: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(32), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    trigger_value: Mapped[Optional[float]] = mapped_column(Numeric(10, 4), nullable=True)
    threshold_value: Mapped[Optional[float]] = mapped_column(Numeric(10, 4), nullable=True)
    evidence_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    is_acknowledged: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    acknowledged_by: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    triggered_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )

    __table_args__ = (
        # Deduplication: same warning type per project within 7 days must not be duplicated
        Index("ix_early_warnings_project_type_time", "project_id", "warning_type", "triggered_at"),
    )
