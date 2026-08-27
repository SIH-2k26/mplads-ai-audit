"""
models/policy.py
Policy and rule models for the versioned Policy Engine.
"""
from __future__ import annotations
from datetime import date, datetime
from typing import Any, Optional
from pydantic import BaseModel, Field
from .enums import PolicyRuleStatus, Severity


class PolicyRule(BaseModel):
    """A single rule within a policy."""
    rule_id: str
    policy_id: str
    policy_version: str

    rule_name: str
    condition: str = Field(..., description="Human-readable condition description")
    requirement: str = Field(..., description="What the project must satisfy")
    severity: Severity

    # Applicability
    applicable_categories: list[str] = Field(
        default_factory=list,
        description="Empty list = applies to all categories"
    )
    applicable_states: list[str] = Field(default_factory=list)

    # Source reference for RAG
    source_reference: Optional[str] = Field(
        None, description="Section/paragraph reference in the policy document"
    )
    source_text: Optional[str] = None

    metadata: dict[str, Any] = Field(default_factory=dict)


class Policy(BaseModel):
    """A versioned MPLADS policy document."""
    policy_id: str
    version: str
    title: str
    description: Optional[str] = None

    # Source
    source: str = Field(..., description="Authority name or document title")
    source_url: Optional[str] = None
    document_id: Optional[str] = Field(None, description="Associated document in DB")

    # Validity
    effective_from: date
    effective_to: Optional[date] = Field(None, description="None = currently effective")
    authority: str = Field(..., description="Issuing authority")

    rules: list[PolicyRule] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_current: bool = True


class RuleEvaluation(BaseModel):
    """
    Result of evaluating a single policy rule against a project.
    Returned by the Policy Evaluator.
    """
    rule_id: str
    rule_name: str
    status: PolicyRuleStatus

    severity: Severity = Severity.UNKNOWN
    explanation: str
    evidence: list[str] = Field(default_factory=list)

    source: Optional[str] = None
    source_reference: Optional[str] = None
    confidence: float = Field(1.0, ge=0.0, le=1.0)

    evaluated_at: datetime = Field(default_factory=datetime.utcnow)


class PolicyEvaluation(BaseModel):
    """Complete policy evaluation for a project."""
    project_id: str
    policy_id: str
    policy_version: str

    rule_evaluations: list[RuleEvaluation] = Field(default_factory=list)

    # Summary
    total_rules: int = 0
    pass_count: int = 0
    fail_count: int = 0
    warning_count: int = 0
    na_count: int = 0

    evaluated_at: datetime = Field(default_factory=datetime.utcnow)

    def compute_summary(self) -> None:
        self.total_rules = len(self.rule_evaluations)
        self.pass_count = sum(1 for r in self.rule_evaluations if r.status == PolicyRuleStatus.PASS)
        self.fail_count = sum(1 for r in self.rule_evaluations if r.status == PolicyRuleStatus.FAIL)
        self.warning_count = sum(1 for r in self.rule_evaluations if r.status == PolicyRuleStatus.WARNING)
        self.na_count = sum(1 for r in self.rule_evaluations if r.status == PolicyRuleStatus.NOT_APPLICABLE)
