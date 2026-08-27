"""
models/evidence.py
Evidence model — traceable pieces of information supporting findings.
Every evidence item must carry provenance.
"""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from uuid import uuid4
from pydantic import BaseModel, Field
from .enums import SourceType
from .provenance import ProvenanceRecord


class EvidenceItem(BaseModel):
    """
    A single piece of evidence supporting an investigation finding or agent signal.
    Must be traceable back to a source.
    """
    evidence_id: str = Field(default_factory=lambda: str(uuid4()))
    evidence_type: str = Field(
        ..., description="e.g., 'PAYMENT_RECORD', 'DOCUMENT_EXTRACT', 'GRAPH_RELATIONSHIP'"
    )
    description: str
    value: Optional[Any] = None
    unit: Optional[str] = None

    # Source tracing
    source: str = Field(..., description="Name of the data source")
    source_type: SourceType
    source_id: Optional[str] = Field(None, description="ID in the source system")

    # Document-specific tracing
    document_id: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    chunk_id: Optional[str] = None

    # Project reference
    project_id: Optional[str] = None

    # Quality
    confidence: float = Field(..., ge=0.0, le=1.0)

    # Timestamps
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source_timestamp: Optional[datetime] = None

    # Full provenance
    provenance: Optional[ProvenanceRecord] = None

    metadata: dict[str, Any] = Field(default_factory=dict)


class PolicyEvidence(BaseModel):
    """
    Evidence retrieved from the RAG system about policy applicability.
    Used by the Investigation Engine and Policy & Evidence Agent (Part B).
    """
    evidence_id: str = Field(default_factory=lambda: str(uuid4()))
    rule_id: str
    policy_id: str
    policy_version: str

    # The retrieved text
    applicable_rule: str
    evidence_text: str
    source_document: str
    page: Optional[int] = None
    section: Optional[str] = None

    # Retrieval quality
    retrieval_score: float = Field(..., ge=0.0, le=1.0)
    reranker_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)

    effective_date: Optional[datetime] = None
    source_url: Optional[str] = None
    provenance: Optional[ProvenanceRecord] = None


class EvidenceBundle(BaseModel):
    """
    A collection of evidence items for a project or case.
    Aggregates evidence from multiple sources for use by the Investigation Engine.
    """
    bundle_id: str = Field(default_factory=lambda: str(uuid4()))
    project_id: str

    # Evidence from different sources
    agent_signals: list[Any] = Field(default_factory=list)       # AgentSignal
    document_evidence: list[EvidenceItem] = Field(default_factory=list)
    policy_evidence: list[PolicyEvidence] = Field(default_factory=list)
    graph_evidence: list[EvidenceItem] = Field(default_factory=list)
    database_evidence: list[EvidenceItem] = Field(default_factory=list)

    assembled_at: datetime = Field(default_factory=datetime.utcnow)
    assembled_by: str = Field("investigation_engine")

    def total_evidence_count(self) -> int:
        return (
            len(self.document_evidence)
            + len(self.policy_evidence)
            + len(self.graph_evidence)
            + len(self.database_evidence)
        )
