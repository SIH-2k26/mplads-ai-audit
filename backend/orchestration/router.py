"""
backend/orchestration/router.py
Conditional Edge Routing Predicates for Sanchay AI LangGraph workflow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState


def route_after_data_quality(state: SanchayState) -> str:
    """
    Routes to supervisor or halts if critical required fields are missing.
    """
    dq = state.get("data_quality_findings", [])
    critical_errors = [f for f in dq if f.get("severity") == "CRITICAL" and "REQUIRED_FIELD" in f.get("check_name", "")]
    if len(critical_errors) >= 3:
        return "finalize"
    return "supervisor"


def route_after_investigation(state: SanchayState) -> str:
    """
    Routes to human_review pause node if risk is critical (score >= 70) and no prior decision was recorded,
    otherwise routes directly to finalize.
    """
    human_req = state.get("human_review_required", False)
    human_decision = state.get("human_decision")
    
    if human_req and not human_decision:
        return "human_review"
    return "finalize"
