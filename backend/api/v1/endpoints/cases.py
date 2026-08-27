"""
api/v1/endpoints/cases.py
Investigation Case Management & Human Verdict Endpoints.
"""
from __future__ import annotations
from typing import Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status

from models.enums import Verdict, InvestigationStatus, RiskLevel
from models.investigation import InvestigationCase, InvestigatorVerdict
from investigation.service import InvestigationService

router = APIRouter()
investigation_service = InvestigationService()

# In-memory case registry store for API demonstration
CASE_STORE: dict[str, InvestigationCase] = {}


class RecordVerdictRequest(BaseModel):
    verdict: Verdict = Field(..., description="CONFIRMED_ISSUE, FALSE_POSITIVE, INSUFFICIENT_EVIDENCE, ESCALATE, NO_ACTION_REQUIRED")
    reason: str = Field(..., description="Detailed justification for human investigator verdict")
    investigator_id: Optional[str] = Field("INV_001", description="ID of human investigator")
    investigator_name: Optional[str] = Field("Officer Inspector", description="Name of investigator")
    is_feedback_consented: bool = Field(False, description="Consent for model training feedback loop")


@router.post("/cases/{case_id}/verdict", status_code=status.HTTP_200_OK)
async def submit_case_verdict(case_id: str, req: RecordVerdictRequest) -> dict[str, Any]:
    """
    POST /api/v1/cases/{case_id}/verdict
    Ingests human investigator verdict and records it in the investigation case audit trail.
    """
    # Retrieve existing case or construct default open case if testing API directly
    if case_id in CASE_STORE:
        case = CASE_STORE[case_id]
    else:
        case = InvestigationCase(
            case_id=case_id,
            project_id="PROJ/DEMO/2026/001",
            priority="HIGH",
            status=InvestigationStatus.UNDER_REVIEW,
            risk_score_at_creation=75.0,
            risk_level_at_creation=RiskLevel.HIGH,
            trigger_signals=["[HIGH] Financial-Physical progress mismatch gap > 40%"],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

    investigator_verdict = InvestigatorVerdict(
        case_id=case_id,
        verdict=req.verdict,
        reason=req.reason,
        investigator_id=req.investigator_id,
        investigator_name=req.investigator_name,
        is_feedback_consented=req.is_feedback_consented,
        submitted_at=datetime.utcnow(),
    )

    try:
        updated_case = investigation_service.record_verdict(
            case=case,
            verdict=investigator_verdict,
            actor=req.investigator_name or "human_investigator",
        )
        CASE_STORE[case_id] = updated_case
        return updated_case.model_dump(mode="json")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to record verdict on case {case_id}: {e}")


@router.get("/cases/{case_id}", status_code=status.HTTP_200_OK)
async def get_case_details(case_id: str) -> dict[str, Any]:
    """
    GET /api/v1/cases/{case_id}
    Returns details of an investigation case.
    """
    if case_id in CASE_STORE:
        return CASE_STORE[case_id].model_dump(mode="json")

    raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
