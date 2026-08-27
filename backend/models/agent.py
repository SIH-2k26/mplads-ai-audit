"""
models/agent.py
Agent contracts — CONTRACT 1 (BaseAgent → AgentEvidence).
All Part A agents must return AgentEvidence.
Part B agents will also use this contract.

IMPORTANT:
- Score range: 0–100 (higher = more risk)
- Confidence: 0.0–1.0
- Applicability: 0.0–1.0
- Agents must NEVER label a contractor as "corrupt" or "fraudulent"
  Use: "elevated risk indicator", "anomaly detected", "requires investigation"
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any, Optional
from uuid import uuid4
from pydantic import BaseModel, Field, field_validator
from .enums import AgentStatus, Severity
from .provenance import ProvenanceRecord


class AgentSignal(BaseModel):
    """
    A single signal detected by an agent.
    Signals are building blocks of AgentEvidence.
    """
    signal_id: str = Field(default_factory=lambda: str(uuid4()))
    signal_type: str = Field(..., description="e.g., 'COST_INCONSISTENCY', 'MISSING_DOCUMENT'")
    description: str = Field(..., description="Human-readable description using neutral language")
    severity: Severity
    value: Optional[Any] = Field(None, description="The actual value that triggered this signal")
    expected_value: Optional[Any] = Field(None, description="What was expected")
    unit: Optional[str] = Field(None, description="Unit of the value (e.g., 'days', 'INR', '%')")
    confidence: float = Field(..., ge=0.0, le=1.0)
    metadata: dict[str, Any] = Field(default_factory=dict)


class EvidenceDataPoint(BaseModel):
    """A structured data point supporting an agent's finding."""
    label: str
    value: Any
    unit: Optional[str] = None
    source: Optional[str] = None
    provenance: Optional[ProvenanceRecord] = None


class AgentEvidence(BaseModel):
    """
    CONTRACT 1: The standard output of every agent in the system.
    Part B's Evidence Fusion engine will consume this.

    Rules:
    - score: 0–100 (0 = no risk, 100 = maximum risk signal)
    - confidence: 0.0–1.0
    - applicability: 0.0–1.0 (how relevant is this agent to this project)
    - Never use language that implies legal guilt
    """
    # Agent identity
    agent_id: str
    agent_name: str
    agent_version: str = "1.0.0"

    # Execution result
    status: AgentStatus

    # Risk signal output (range 0–100)
    score: float = Field(0.0, ge=0.0, le=100.0, description="Risk signal score 0–100")
    severity: Severity = Severity.UNKNOWN
    confidence: float = Field(0.0, ge=0.0, le=1.0)
    applicability: float = Field(1.0, ge=0.0, le=1.0, description="0=not applicable, 1=fully applicable")

    # Findings
    signals: list[AgentSignal] = Field(default_factory=list)
    evidence: list[EvidenceDataPoint] = Field(default_factory=list)

    # Traceable sources
    data_sources: list[str] = Field(
        default_factory=list,
        description="Table names, API names, or document IDs consulted"
    )

    # Provenance
    provenance: Optional[ProvenanceRecord] = None

    # Timing
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    execution_time_ms: Optional[float] = None

    # For failure cases
    error_message: Optional[str] = Field(
        None, description="Set when status=FAILED, describes the failure"
    )

    # Additional context
    recommendation: Optional[str] = Field(
        None, description="Suggested investigative action (neutral language)"
    )
    metadata: dict[str, Any] = Field(default_factory=dict)

    @field_validator("score")
    @classmethod
    def score_must_be_in_range(cls, v: float) -> float:
        if not 0.0 <= v <= 100.0:
            raise ValueError(f"Score must be between 0 and 100, got {v}")
        return round(v, 2)

    def is_flagged(self) -> bool:
        """True if the agent detected a significant risk signal."""
        return (
            self.status == AgentStatus.COMPLETED
            and self.score >= 30.0
            and self.severity in (Severity.MEDIUM, Severity.HIGH, Severity.CRITICAL)
        )

    def is_applicable(self) -> bool:
        return self.applicability >= 0.5

    @classmethod
    def not_applicable(cls, agent_id: str, agent_name: str, reason: str) -> "AgentEvidence":
        """Factory: Create a NOT_APPLICABLE result."""
        return cls(
            agent_id=agent_id,
            agent_name=agent_name,
            status=AgentStatus.NOT_APPLICABLE,
            score=0.0,
            severity=Severity.UNKNOWN,
            confidence=1.0,
            applicability=0.0,
            metadata={"reason": reason},
        )

    @classmethod
    def failed(cls, agent_id: str, agent_name: str, error: str) -> "AgentEvidence":
        """Factory: Create a FAILED result."""
        return cls(
            agent_id=agent_id,
            agent_name=agent_name,
            status=AgentStatus.FAILED,
            score=0.0,
            severity=Severity.UNKNOWN,
            confidence=0.0,
            applicability=1.0,
            error_message=error,
        )

    @classmethod
    def insufficient_data(cls, agent_id: str, agent_name: str, missing: list[str]) -> "AgentEvidence":
        """Factory: Create an INSUFFICIENT_DATA result."""
        return cls(
            agent_id=agent_id,
            agent_name=agent_name,
            status=AgentStatus.INSUFFICIENT_DATA,
            score=0.0,
            severity=Severity.UNKNOWN,
            confidence=0.0,
            applicability=1.0,
            metadata={"missing_fields": missing},
        )


class AgentContext(BaseModel):
    """
    The execution context passed to every agent.
    Contains the Digital Twin plus supplementary data.
    Agents must ONLY read from this context — they must NOT query databases directly.
    """
    project_id: str
    digital_twin: Any  # ProjectDigitalTwin — avoid circular import
    graph_data: Optional[dict[str, Any]] = Field(
        None, description="Pre-fetched graph relationships for this project"
    )
    policy_rules: Optional[list[dict[str, Any]]] = Field(
        None, description="Applicable policy rules for this project"
    )
    rag_evidence: Optional[list[dict[str, Any]]] = Field(
        None, description="Pre-fetched RAG policy evidence"
    )
    similar_projects: Optional[list[dict[str, Any]]] = Field(
        None, description="Nearby/similar projects from graph query"
    )
    metadata: dict[str, Any] = Field(default_factory=dict)
    context_built_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
