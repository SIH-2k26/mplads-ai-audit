"""
models/risk.py
Risk-related models — Part A exposes these as stubs/contracts.
Part B fills in the actual risk computation.

Part A agents produce AgentEvidence (score 0-100).
Part B aggregates these into RiskOutput.
"""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field
from .enums import RiskLevel, Severity


class RiskFingerprint(BaseModel):
    """
    Decomposed risk across dimensions.
    Computed by Part B's Risk Engine using AgentEvidence from Part A.
    Defined here so Part A knows the expected output shape.
    """
    cost_inflation: float = Field(0.0, ge=0.0, le=1.0)
    payment_progress_mismatch: float = Field(0.0, ge=0.0, le=1.0)
    repeated_delay: float = Field(0.0, ge=0.0, le=1.0)
    contractor_pattern: float = Field(0.0, ge=0.0, le=1.0)
    documentation_gap: float = Field(0.0, ge=0.0, le=1.0)
    duplicate_work: float = Field(0.0, ge=0.0, le=1.0)
    procurement_irregularity: float = Field(0.0, ge=0.0, le=1.0)
    geographic_cluster: float = Field(0.0, ge=0.0, le=1.0)


class RiskOutput(BaseModel):
    """
    CONTRACT 5 (partial): The risk output that triggers investigation creation.
    Computed by Part B's Risk Engine. Part A receives this as InvestigationIntake input.
    Defined here so Part A's Investigation Engine knows the expected input shape.
    """
    project_id: str
    overall_risk_score: float = Field(..., ge=0.0, le=100.0)
    risk_level: RiskLevel

    # Decomposed risk scores (computed by Part B)
    current_risk: float = Field(0.0, ge=0.0, le=100.0)
    future_risk: float = Field(0.0, ge=0.0, le=100.0)
    systemic_risk: float = Field(0.0, ge=0.0, le=100.0)

    # Fingerprint
    fingerprint: Optional[RiskFingerprint] = None

    # Top contributing agents
    top_signals: list[str] = Field(default_factory=list)

    computed_at: datetime = Field(default_factory=datetime.utcnow)
    model_version: Optional[str] = None


class EarlyWarningPrediction(BaseModel):
    """
    An early warning about a project outcome.
    Computed by Part B, defined here as a contract.
    """
    warning_type: str
    label: str
    probability: float = Field(..., ge=0.0, le=1.0)
    severity: Severity
    description: Optional[str] = None
    horizon_days: Optional[int] = None
