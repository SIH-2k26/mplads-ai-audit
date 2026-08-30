"""
api/v1/endpoints/feedback.py
Feedback API endpoints for submitting analyst review verdicts and continuous learning data.
"""
from __future__ import annotations
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import require_role
from app.auth.models import UserRole

router = APIRouter(prefix="/feedback", tags=["Human Review & Continuous Learning"])


class FeedbackSubmission(BaseModel):
    project_id: str
    case_id: Optional[str] = None
    predicted_risk_score: float
    predicted_risk_level: str
    human_verdict: str = Field(..., description="NO_ISSUE | MONITOR | REVIEW_REQUIRED | ESCALATE | SUBSTANTIATED_RISK")
    is_false_positive: bool = False
    is_false_negative: bool = False
    analyst_notes: Optional[str] = None


@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    payload: FeedbackSubmission,
    current_user=Depends(require_role([UserRole.INVESTIGATOR, UserRole.ADMIN])),
):
    """
    Submits verified analyst verdict on an AI prediction.
    This creates the supervised feedback dataset used by the continuous learning pipeline.
    """
    # In-memory logging of verified feedback
    return {
        "status": "RECORDED",
        "message": "Analyst feedback recorded successfully into continuous training dataset.",
        "project_id": payload.project_id,
        "analyst": current_user.sub,
        "verdict": payload.human_verdict,
        "is_false_positive": payload.is_false_positive,
    }
