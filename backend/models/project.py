"""
models/project.py
Core project data models — building blocks of the Digital Twin.
These mirror the PostgreSQL schema but are Pydantic (application layer).
"""
from __future__ import annotations
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Optional
from pydantic import BaseModel, Field, field_validator
from .enums import ProjectStatus
from .provenance import ProvenanceRecord


class GeoLocation(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    village: Optional[str] = None
    block: Optional[str] = None
    district: str
    state: str
    pincode: Optional[str] = None

    # Normalized canonical IDs
    district_id: Optional[str] = None
    state_id: Optional[str] = None
    constituency_id: Optional[str] = None


class Recommendation(BaseModel):
    recommendation_id: Optional[str] = None
    recommended_by_mp_id: Optional[str] = None
    recommended_by_mp_name: Optional[str] = None
    recommendation_date: Optional[date] = None
    recommendation_reference: Optional[str] = None
    notes: Optional[str] = None


class Sanction(BaseModel):
    sanction_id: Optional[str] = None
    sanction_number: Optional[str] = None
    sanction_date: Optional[date] = None
    sanctioned_amount: Decimal = Field(Decimal("0"), ge=0)
    sanctioning_authority: Optional[str] = None
    fund_head: Optional[str] = None
    scheme_year: Optional[str] = None
    notes: Optional[str] = None


class Budget(BaseModel):
    approved_budget: Decimal = Field(Decimal("0"), ge=0)
    revised_budget: Optional[Decimal] = Field(None, ge=0)
    estimated_cost: Decimal = Field(Decimal("0"), ge=0)
    revised_cost: Optional[Decimal] = Field(None, ge=0)
    contingency: Optional[Decimal] = Field(None, ge=0)
    as_of: Optional[date] = None


class Payment(BaseModel):
    payment_id: str
    payment_date: Optional[date] = None
    amount: Decimal = Field(..., ge=0)
    beneficiary: Optional[str] = None  # contractor/agency
    payment_type: Optional[str] = None
    voucher_number: Optional[str] = None
    remarks: Optional[str] = None
    provenance: Optional[ProvenanceRecord] = None


class Expenditure(BaseModel):
    total_expenditure: Decimal = Field(Decimal("0"), ge=0)
    as_of: Optional[date] = None
    payments: list[Payment] = Field(default_factory=list)


class ProgressRecord(BaseModel):
    record_id: Optional[str] = None
    as_of_date: date
    financial_progress: float = Field(..., ge=0, le=100)
    physical_progress: float = Field(..., ge=0, le=100)
    reported_by: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    provenance: Optional[ProvenanceRecord] = None


class Milestone(BaseModel):
    milestone_id: str
    name: str
    planned_date: Optional[date] = None
    actual_date: Optional[date] = None
    is_completed: bool = False
    completion_evidence: Optional[str] = None
    notes: Optional[str] = None


class Asset(BaseModel):
    asset_id: str
    asset_type: str
    description: Optional[str] = None
    geo_location: Optional[GeoLocation] = None
    photo_document_ids: list[str] = Field(default_factory=list)
    measurement_details: dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None


class ImplementingAgency(BaseModel):
    agency_id: Optional[str] = None
    agency_name: str
    agency_type: Optional[str] = None
    contact_person: Optional[str] = None
    contact_info: Optional[str] = None
    canonical_id: Optional[str] = Field(None, description="Normalized canonical agency ID")


class Contractor(BaseModel):
    contractor_id: Optional[str] = None
    contractor_name: str
    registration_number: Optional[str] = None
    category: Optional[str] = None
    contact_info: Optional[str] = None
    canonical_id: Optional[str] = Field(None, description="Normalized canonical contractor ID")


class DataQualityFlag(BaseModel):
    field_name: str
    issue_type: str  # DataQualityIssueType
    description: str
    severity: str   # Severity
    age_days: Optional[int] = None
    detected_at: datetime = Field(default_factory=datetime.utcnow)


class ProjectCompliance(BaseModel):
    """Snapshot of policy compliance checks."""
    evaluated_at: Optional[datetime] = None
    policy_version: Optional[str] = None
    rule_results: list[dict[str, Any]] = Field(default_factory=list)
    overall_compliance: Optional[str] = None
