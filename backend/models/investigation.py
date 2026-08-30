"""
models/investigation.py
Investigation Engine models — CONTRACT 5 (InvestigationIntake).
The boundary between Part B's Risk Engine output and Part A's Investigation Engine.

IMPORTANT:
- Part B calls investigation_service.create_case(intake) with InvestigationIntake
- Part A's Investigation Engine creates the case, stores evidence, tracks verdicts
- Human verdict is the FINAL determination — system only surfaces evidence
"""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from uuid import uuid4
from pydantic import BaseModel, Field
from .enums import InvestigationStatus, Verdict, Severity, RiskLevel
from .agent import AgentEvidence
from .evidence import EvidenceItem, PolicyEvidence
from .risk import RiskOutput, RiskFingerprint
from .provenance import ProvenanceRecord


class InvestigationIntake(BaseModel):
    """
    CONTRACT 5: The intake document that creates an investigation case.
    Part B's Risk Engine (or any authorized caller) submits this.
    Part A's Investigation Engine processes it.

    This is the critical Part B → Part A boundary.
    Part B sends risk signals; Part A manages the investigation lifecycle.
    """
    # Project reference
    project_id: str

    # Risk context (from Part B Risk Engine)
    risk_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: RiskLevel

    # What triggered this intake
    trigger_signals: list[str] = Field(
        ...,
        description="Human-readable description of what triggered investigation"
    )

    # Detailed fingerprint (optional, from Part B)
    risk_fingerprint: Optional[RiskFingerprint] = None

    # Part A agent evidence
    agent_evidence: list[AgentEvidence] = Field(default_factory=list)

    # Supporting documents (document IDs in DB)
    supporting_document_ids: list[str] = Field(default_factory=list)

    # Pre-fetched policy evidence from RAG
    policy_evidence: list[PolicyEvidence] = Field(default_factory=list)

    # Provenance
    provenance: Optional[ProvenanceRecord] = None
    submitted_by: str = Field("risk_engine", description="Component submitting this intake")

    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Priority hint (Investigation Engine may override based on risk_score)
    priority_hint: Optional[str] = Field(
        None, description="LOW, MEDIUM, HIGH, CRITICAL — hint from submitter"
    )


class CaseEvidence(BaseModel):
    """Evidence added to an investigation case."""
    evidence_id: str = Field(default_factory=lambda: str(uuid4()))
    case_id: str

    evidence_type: str
    description: str
    value: Optional[Any] = None

    source: str
    source_id: Optional[str] = None

    document_id: Optional[str] = None
    agent_id: Optional[str] = None

    confidence: float = Field(..., ge=0.0, le=1.0)
    provenance: Optional[ProvenanceRecord] = None

    added_at: datetime = Field(default_factory=datetime.utcnow)
    added_by: str = Field("system")


class InvestigatorVerdict(BaseModel):
    """
    Human investigator's verdict on a case.
    IMPORTANT: This is the final human determination.
    The system facilitates — humans decide.
    """
    verdict_id: str = Field(default_factory=lambda: str(uuid4()))
    case_id: str

    verdict: Verdict
    reason: str = Field(..., description="Detailed justification for the verdict")

    # Human context
    investigator_id: Optional[str] = None
    investigator_name: Optional[str] = None
    investigator_role: Optional[str] = None

    # Supporting evidence
    supporting_evidence_ids: list[str] = Field(default_factory=list)

    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    # Feedback loop (DO NOT automatically convert to training labels)
    is_feedback_consented: bool = Field(
        False,
        description="True only if investigator explicitly consented to use for model improvement"
    )


class AuditEntry(BaseModel):
    """
    Immutable audit trail entry for an investigation case.
    Records every significant action taken on a case.
    """
    audit_id: str = Field(default_factory=lambda: str(uuid4()))
    case_id: str

    actor: str = Field(..., description="User ID or system component")
    action: str = Field(..., description="e.g., 'CASE_CREATED', 'EVIDENCE_ADDED', 'STATUS_CHANGED'")

    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # What changed
    before_state: Optional[dict[str, Any]] = None
    after_state: Optional[dict[str, Any]] = None
    details: dict[str, Any] = Field(default_factory=dict)


class InvestigationCase(BaseModel):
    """
    A complete investigation case.
    Created from InvestigationIntake, managed by the Investigation Engine.
    """
    case_id: str = Field(default_factory=lambda: str(uuid4()))
    project_id: str

    # Priority and status
    priority: str = Field("MEDIUM", description="LOW, MEDIUM, HIGH, CRITICAL")
    status: InvestigationStatus = InvestigationStatus.NEW

    # Risk snapshot at time of creation
    risk_score_at_creation: float
    risk_level_at_creation: RiskLevel
    risk_fingerprint: Optional[RiskFingerprint] = None

    # What triggered this case
    trigger_signals: list[str] = Field(default_factory=list)

    # Evidence
    evidence_items: list[CaseEvidence] = Field(default_factory=list)
    policy_evidence: list[PolicyEvidence] = Field(default_factory=list)
    agent_evidence_summary: list[dict[str, Any]] = Field(default_factory=list)

    # Timeline
    timeline: list[AuditEntry] = Field(default_factory=list)

    # Assignment
    assigned_to: Optional[str] = None
    assigned_at: Optional[datetime] = None

    # Verdict
    verdict: Optional[InvestigatorVerdict] = None

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    closed_at: Optional[datetime] = None

    def primary_concern(self) -> str:
        """Summarize the primary concern from trigger signals."""
        if self.trigger_signals:
            return self.trigger_signals[0]
        return "Unspecified risk signals"

    def is_open(self) -> bool:
        return self.status not in (
            InvestigationStatus.RESOLVED,
            InvestigationStatus.FALSE_POSITIVE,
            InvestigationStatus.INSUFFICIENT_EVIDENCE,
        )
