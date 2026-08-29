"""
backend/orchestration/agents/investigation.py
Investigation Planning Agent Node for Sanchay AI LangGraph workflow.
Creates structured field verification checklists, questions for authorities, and prioritized action steps.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState


def investigation_node(state: SanchayState) -> Dict[str, Any]:
    """
    Formulates a concrete investigation and inspection checklist based on aggregated risk findings.
    """
    score = state.get("risk_score", 25.0)
    level = state.get("risk_level", "LOW")
    findings = (
        state.get("compliance_findings", []) +
        state.get("financial_findings", []) +
        state.get("procurement_findings", []) +
        state.get("progress_findings", []) +
        state.get("data_quality_findings", [])
    )

    evidence_checklist = [
        "Verified copy of Administrative Sanction & Technical Approval",
        "Tender comparative statement and e-tendering log records",
        "Physical Measurement Book (MB) entries signed by Junior/Assistant Engineer",
        "Certified Geo-Tagged, Time-Stamped site verification photographs",
        "Statutory Utilization Certificate (UC) in Form GFR 12-C",
    ]

    questions_for_officers = []
    if any(f.get("code") == "SINGLE_BID_AWARD" for f in findings):
        questions_for_officers.append("What justified awarding the contract under single-bid tender without re-tendering?")
    if any(f.get("code") == "CRITICAL_PROGRESS_DIVERGENCE" for f in findings):
        questions_for_officers.append("Why does financial disbursement significantly lead physical progress recorded on site?")
    if any(f.get("code") == "MISSING_MEASUREMENT_BOOK" for f in findings):
        questions_for_officers.append("Where is the physical Measurement Book record for the certified payment tranches?")

    if not questions_for_officers:
        questions_for_officers.append("Confirm milestone completion matches scheduled quarterly expenditure forecast.")

    if score >= 70.0:
        recommended_actions = [
            "Withhold subsequent milestone fund releases pending physical inspection.",
            "Dispatch District Technical Vigilance Squad for on-site physical measurement verification within 7 days.",
            "Summon Implementing Agency and Contractor for joint rate and timeline explanation.",
        ]
    elif score >= 50.0:
        recommended_actions = [
            "Initiate desk review of tender bid comparison statement and Measurement Book entries.",
            "Request updated geotagged photographs with EXIF timestamp verification.",
            "Flag contractor record for district-wide concentration audit.",
        ]
    else:
        recommended_actions = [
            "Maintain standard quarterly monitoring; proceed with scheduled milestone disbursement.",
            "Routine verification of utilization certificates upon project completion.",
        ]

    investigation_plan = {
        "case_priority": "CRITICAL" if score >= 70.0 else ("HIGH" if score >= 50.0 else "ROUTINE"),
        "evidence_checklist": evidence_checklist,
        "questions_for_auditor": questions_for_officers,
        "recommended_verification_actions": recommended_actions,
    }

    # Determine human review requirement
    human_review_required = score >= 70.0

    completed = state.get("completed_nodes", []) + ["investigation"]
    return {
        "investigation_plan": investigation_plan,
        "recommended_actions": recommended_actions,
        "human_review_required": human_review_required,
        "completed_nodes": completed,
    }
