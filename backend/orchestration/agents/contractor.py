"""
backend/orchestration/agents/contractor.py
Contractor Intelligence Agent Node for Sanchay AI LangGraph workflow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState
from backend.orchestration.tools.contractor_tools import analyze_contractor_risk
from backend.orchestration.tools.graph_tools import query_contractor_network


def contractor_node(state: SanchayState) -> Dict[str, Any]:
    """
    Analyzes contractor past irregularity rate and queries entity network graph.
    """
    proj = state.get("project_data", {})
    cont_res = analyze_contractor_risk.invoke({"project_data": proj})
    net_res = query_contractor_network.invoke({"contractor_id": cont_res.get("contractor_id", "UNSPECIFIED")})

    findings: List[Dict[str, Any]] = []
    for f in cont_res.get("findings", []):
        findings.append({
            "category": "CONTRACTOR",
            "code": f["code"],
            "severity": f["severity"],
            "description": f["description"],
        })

    graph_findings = []
    if net_res.get("shared_directors_count", 0) > 0:
        graph_findings.append({
            "type": "SHARED_DIRECTORSHIP",
            "details": f"Contractor shares common directorship with {net_res['shared_directors_count']} entities."
        })

    completed = state.get("completed_nodes", []) + ["contractor"]
    return {
        "contractor_findings": findings,
        "graph_findings": graph_findings,
        "completed_nodes": completed,
    }
