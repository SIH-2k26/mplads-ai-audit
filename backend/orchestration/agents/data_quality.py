"""
backend/orchestration/agents/data_quality.py
Data Quality Agent Node for Sanchay AI LangGraph workflow.
Performs deterministic field presence, range checks, and document completeness validation.
"""
from __future__ import annotations
from typing import Any, Dict, List
from pydantic import BaseModel, Field

from backend.orchestration.state import SanchayState
from backend.orchestration.tools.document_tools import verify_document_records


class DataQualityFinding(BaseModel):
    check_name: str
    status: str  # "PASS" | "WARN" | "FAIL"
    message: str
    severity: str  # "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"


def data_quality_node(state: SanchayState) -> Dict[str, Any]:
    """
    Evaluates input project data for required fields, logical range constraints,
    and statutory document dockets.
    """
    proj = state.get("project_data", {})
    doc_dict = state.get("normalized_data", {}).get("documents", {})
    findings: List[Dict[str, Any]] = []

    # 1. Required Field Checks
    required_fields = ["project_id", "sanctioned_amount", "actual_expenditure"]
    for rf in required_fields:
        if rf not in proj or proj[rf] is None:
            findings.append({
                "check_name": f"REQUIRED_FIELD_{rf.upper()}",
                "status": "FAIL",
                "message": f"Mandatory field '{rf}' is missing from project input.",
                "severity": "CRITICAL",
            })

    # 2. Value Range & Logical Constraints
    sanctioned = float(proj.get("sanctioned_amount", 0.0) or 0.0)
    expenditure = float(proj.get("actual_expenditure", 0.0) or 0.0)
    if sanctioned <= 0.0:
        findings.append({
            "check_name": "NON_POSITIVE_SANCTION",
            "status": "FAIL",
            "message": "Sanctioned amount must be greater than zero.",
            "severity": "CRITICAL",
        })
    if expenditure < 0.0:
        findings.append({
            "check_name": "NEGATIVE_EXPENDITURE",
            "status": "FAIL",
            "message": "Actual expenditure cannot be negative.",
            "severity": "CRITICAL",
        })

    # 3. Document Verification Tool
    doc_res = verify_document_records.invoke({"project_data": proj, "doc_dict": doc_dict})
    for df in doc_res.get("findings", []):
        findings.append({
            "check_name": df["code"],
            "status": "FAIL" if df["severity"] in ["CRITICAL", "HIGH"] else "WARN",
            "message": df["description"],
            "severity": df["severity"],
        })

    completed = state.get("completed_nodes", []) + ["data_quality"]
    return {
        "data_quality_findings": findings,
        "completed_nodes": completed,
    }
