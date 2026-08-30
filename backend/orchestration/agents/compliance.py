"""
backend/orchestration/agents/compliance.py
Compliance Specialist Agent Node for Sanchay AI LangGraph workflow.
Evaluates statutory rules (MPLADS 2023 Guidelines, GFR 2017) using deterministic tools and regulatory retrieval.
"""
from __future__ import annotations
from typing import Any, Dict, List
from pydantic import BaseModel

from backend.orchestration.state import SanchayState
from backend.orchestration.tools.compliance_tools import evaluate_statutory_compliance


def compliance_node(state: SanchayState) -> Dict[str, Any]:
    """
    Evaluates project parameters against GFR 2017 and MPLADS Guidelines.
    """
    proj = state.get("project_data", {})
    comp_res = evaluate_statutory_compliance.invoke({"project_data": proj})

    findings: List[Dict[str, Any]] = []
    for v in comp_res.get("violations", []):
        findings.append({
            "category": "COMPLIANCE",
            "rule_id": v["rule_id"],
            "severity": v["severity"],
            "description": v["description"],
            "statutory_ref": v["statutory_ref"],
            "penalty_weight": v["penalty_weight"],
        })

    completed = state.get("completed_nodes", []) + ["compliance"]
    return {
        "compliance_findings": findings,
        "completed_nodes": completed,
    }
