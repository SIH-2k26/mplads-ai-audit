"""
policy/models.py
Data models for the versioned MPLADS Policy Engine.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import date
from enum import Enum
from typing import Any, Callable, Dict, List, Optional


class RuleEvaluationStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    WARNING = "WARNING"
    NOT_APPLICABLE = "NOT_APPLICABLE"
    INSUFFICIENT_EVIDENCE = "INSUFFICIENT_EVIDENCE"


@dataclass
class PolicyRule:
    rule_id: str
    name: str
    description: str
    category: str
    severity: str                       # CRITICAL, HIGH, MEDIUM, LOW, INFO
    condition_expression: str           # Human-readable or DSL expression
    remediation_guidance: str
    applicable_categories: List[str] = field(default_factory=lambda: ["ALL"])
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    citation_section: Optional[str] = None
    parameters: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PolicyVersion:
    policy_id: str                      # e.g., "MPLADS_GUIDELINES"
    version: str                        # e.g., "2016", "2023"
    effective_from: date
    effective_to: Optional[date]
    title: str
    source_document: str
    rules: List[PolicyRule] = field(default_factory=list)


@dataclass
class RuleEvaluationResult:
    rule_id: str
    rule_name: str
    status: RuleEvaluationStatus
    severity: str
    message: str
    evidence_values: Dict[str, Any] = field(default_factory=dict)
    citation_section: Optional[str] = None
    remediation: Optional[str] = None


@dataclass
class PolicyEvaluationResult:
    policy_id: str
    policy_version: str
    project_id: str
    evaluated_at: str
    overall_status: RuleEvaluationStatus
    rule_results: List[RuleEvaluationResult] = field(default_factory=list)
    rules_passed: int = 0
    rules_failed: int = 0
    rules_warned: int = 0
    rules_not_applicable: int = 0
