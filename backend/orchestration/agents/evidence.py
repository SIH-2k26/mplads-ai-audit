"""
backend/orchestration/agents/evidence.py
Regulatory Evidence & RAG Agent Node for Sanchay AI LangGraph workflow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState
from backend.orchestration.tools.rag_tools import retrieve_statutory_evidence


def evidence_node(state: SanchayState) -> Dict[str, Any]:
    """
    Retrieves statutory guideline provisions and CAG audit citations grounding the project findings.
    """
    proj = state.get("project_data", {})
    cat = proj.get("category", "INFRASTRUCTURE")
    
    # Query formulated from findings
    findings = (
        state.get("compliance_findings", []) +
        state.get("financial_findings", []) +
        state.get("procurement_findings", []) +
        state.get("progress_findings", [])
    )
    query_terms = [f.get("description", "") for f in findings[:3]]
    query = " ".join(query_terms) if query_terms else f"MPLADS {cat} execution rules"

    rag_res = retrieve_statutory_evidence.invoke({"query": query, "project_category": cat})

    completed = state.get("completed_nodes", []) + ["evidence"]
    return {
        "regulatory_evidence": rag_res.get("citations", []),
        "completed_nodes": completed,
    }
