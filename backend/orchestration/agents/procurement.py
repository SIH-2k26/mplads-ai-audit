"""
backend/orchestration/agents/procurement.py
Procurement Specialist Agent Node for Sanchay AI LangGraph workflow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState
from backend.orchestration.tools.procurement_tools import analyze_procurement_bidding


def procurement_node(state: SanchayState) -> Dict[str, Any]:
    """
    Executes procurement bidding tools and assesses tender competition.
    """
    proj = state.get("project_data", {})
    proc_res = analyze_procurement_bidding.invoke({"project_data": proj})

    findings: List[Dict[str, Any]] = []
    for f in proc_res.get("findings", []):
        findings.append({
            "category": "PROCUREMENT",
            "code": f["code"],
            "severity": f["severity"],
            "description": f["description"],
        })

    completed = state.get("completed_nodes", []) + ["procurement"]
    return {
        "procurement_findings": findings,
        "completed_nodes": completed,
    }
