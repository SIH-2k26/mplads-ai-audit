"""
backend/orchestration/agents/financial.py
Financial Intelligence Agent Node for Sanchay AI LangGraph workflow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState
from backend.orchestration.tools.financial_tools import analyze_financial_disbursements


def financial_node(state: SanchayState) -> Dict[str, Any]:
    """
    Executes financial disbursement tool and aggregates financial anomaly findings.
    """
    proj = state.get("project_data", {})
    fin_res = analyze_financial_disbursements.invoke({"project_data": proj})

    findings: List[Dict[str, Any]] = []
    for f in fin_res.get("findings", []):
        findings.append({
            "category": "FINANCIAL",
            "code": f["code"],
            "severity": f["severity"],
            "description": f["description"],
        })

    completed = state.get("completed_nodes", []) + ["financial"]
    return {
        "financial_findings": findings,
        "completed_nodes": completed,
    }
