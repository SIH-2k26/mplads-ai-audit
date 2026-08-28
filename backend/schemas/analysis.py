"""
backend/schemas/analysis.py
Standardized API Contract & Pydantic Data Models for MPLADS Project Risk Analysis.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ProjectInputSchema(BaseModel):
    project_id: str = Field(..., example="MPLADS-000001", description="Unique Project ID")
    title: str = Field("Community Infrastructure Work", description="Project descriptive title")
    category: str = Field("Drinking Water", description="Functional sector")
    state: str = Field("Maharashtra", description="State name")
    district: str = Field("Pune", description="District name")
    constituency: str = Field("Pune", description="Constituency name")
    sanction_amount: float = Field(2500000.0, ge=0.0, description="Sanctioned ceiling in INR")
    estimated_cost: float = Field(2400000.0, ge=0.0, description="Initial DPR estimated cost in INR")
    revised_cost: Optional[float] = Field(2500000.0, ge=0.0, description="Revised estimate cost in INR")
    tender_amount: Optional[float] = Field(2380000.0, ge=0.0, description="Contract / Work order tender amount in INR")
    actual_cost: float = Field(2300000.0, ge=0.0, description="Total actual expenditure incurred in INR")
    fund_released: float = Field(2500000.0, ge=0.0, description="Funds released by District Authority in INR")
    total_expenditure: float = Field(2300000.0, ge=0.0, description="Cumulative disbursed expenditure in INR")
    physical_progress: float = Field(75.0, ge=0.0, le=100.0, description="Physical completion percentage")
    financial_progress: float = Field(80.0, ge=0.0, le=150.0, description="Financial disbursement percentage")
    planned_duration_days: int = Field(180, ge=1, description="Sanctioned duration in days")
    actual_duration_days: int = Field(200, ge=1, description="Elapsed duration in days")
    bid_count: int = Field(4, ge=1, description="Number of competitive bids received")
    extension_count: int = Field(0, ge=0, description="Number of formal timeline extensions granted")
    contractor_id: Optional[str] = Field("CONT-0001", description="Assigned contractor ID")
    agency_id: Optional[str] = Field("AGENCY-0001", description="Implementing agency ID")
    latitude: Optional[float] = Field(18.5204, description="Project site latitude")
    longitude: Optional[float] = Field(73.8567, description="Project site longitude")
    sanction_date: Optional[str] = Field("2023-06-15", description="Administrative sanction date (YYYY-MM-DD)")


class DocumentChecklistSchema(BaseModel):
    administrative_sanction: bool = True
    technical_sanction: bool = True
    dpr: bool = True
    work_order: bool = True
    measurement_book: bool = True
    utilization_certificate: bool = True
    completion_certificate: bool = True
    geo_tagged_photos: bool = True


class AnalysisOptionsSchema(BaseModel):
    include_rag: bool = True
    include_explanations: bool = True
    include_feature_values: bool = True


class AnalysisRequest(BaseModel):
    project: ProjectInputSchema
    documents: Optional[DocumentChecklistSchema] = Field(default_factory=DocumentChecklistSchema)
    analysis_options: Optional[AnalysisOptionsSchema] = Field(default_factory=AnalysisOptionsSchema)


class RegulatoryEvidenceItem(BaseModel):
    document_id: str
    document_title: str
    authority: str
    chapter: Optional[str] = None
    section: Optional[str] = None
    paragraph: Optional[str] = None
    page: Optional[int] = None
    effective_date: str
    citation_text: str
    relevance_score: float
    applicability_reason: str


class ComplianceFindingItem(BaseModel):
    rule_id: str
    rule_name: str
    category: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    status: str    # COMPLIANT, WARNING, VIOLATION
    description: str
    statutory_reference: str


class RiskComponentBreakdown(BaseModel):
    supervised_ml: float
    rule_compliance: float
    unsupervised_anomaly: float
    contractor_risk: float
    evidence_integrity: float


class ModelProbabilityBreakdown(BaseModel):
    catboost: float
    xgboost: float
    lightgbm: float
    random_forest: float
    isolation_forest_anomaly: float


class AnalysisResponse(BaseModel):
    project_id: str
    project_title: str
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Unified risk score (0-100)")
    risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    model_probability: float
    confidence: float
    severity_label: str
    model_probabilities: ModelProbabilityBreakdown
    risk_components: RiskComponentBreakdown
    top_risk_factors: List[Dict[str, Any]]
    anomalies: List[str]
    compliance_findings: List[ComplianceFindingItem]
    regulatory_evidence: List[RegulatoryEvidenceItem]
    recommended_actions: List[str]
    feature_count: int = 177
    rag_status: str
    ml_status: str
    timestamp: str
