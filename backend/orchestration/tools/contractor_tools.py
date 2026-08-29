"""
backend/orchestration/tools/contractor_tools.py
LangChain structured tools for contractor risk, historical non-compliance, and capacity strain.
"""
from __future__ import annotations
from typing import Any, Dict
from langchain_core.tools import tool

from ml.features.contractor import compute_contractor_features


@tool
def analyze_contractor_risk(project_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates contractor historical non-compliance, active district workload, and capacity strain.
    """
    irr_rate = float(project_data.get("contractor_past_irregularity_rate", 0.05))
    capacity_strain = float(project_data.get("contractor_capacity_strain", 0.30))
    contractor_id = str(project_data.get("contractor_id", project_data.get("contractor_name", "UNSPECIFIED")))
    
    findings = []
    if irr_rate >= 0.25:
        findings.append({
            "code": "REPEAT_IRREGULARITY_HISTORY",
            "severity": "HIGH",
            "description": f"Contractor ({contractor_id}) exhibits a repeat audit irregularity rate of {irr_rate*100:.1f}% across prior works."
        })
    elif irr_rate >= 0.10:
        findings.append({
            "code": "ELEVATED_CONTRACTOR_RISK",
            "severity": "MEDIUM",
            "description": f"Contractor past irregularity rate ({irr_rate*100:.1f}%) exceeds district average."
        })

    if capacity_strain >= 0.85:
        findings.append({
            "code": "CAPACITY_STRAIN_OVERLOAD",
            "severity": "HIGH",
            "description": f"Contractor active commitments exceed verified operational capacity (strain: {capacity_strain*100:.1f}%)."
        })

    return {
        "status": "success",
        "contractor_id": contractor_id,
        "past_irregularity_rate": irr_rate,
        "capacity_strain": capacity_strain,
        "findings": findings,
    }
