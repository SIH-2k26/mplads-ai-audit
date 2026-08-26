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
