"""
api/v1/endpoints/analytics.py
Analytics, Risk Analysis, Simulation & Reporting Endpoints.
"""
from __future__ import annotations
from typing import Any, Optional
from datetime import datetime, date
from decimal import Decimal
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Response, status

from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord
from orchestration.graph import execute_pipeline, run_pipeline
from simulation.what_if import WhatIfSimulator
from services.pdf_service import FieldInspectionPDFService

router = APIRouter()


class ProjectAnalysisRequest(BaseModel):
    """Request schema for project risk analysis endpoint."""
    project_id: Optional[str] = Field(None, description="Unique project ID (e.g., PROJ/VAR/2026/001)")
    digital_twin: Optional[dict[str, Any]] = Field(None, description="Optional raw ProjectDigitalTwin JSON object payload")


class WhatIfSimulationRequest(BaseModel):
    """Request schema for What-If parameter adjustment simulation."""
    project_id: Optional[str] = Field(None, description="Target project ID for baseline risk evaluation")
    digital_twin: Optional[dict[str, Any]] = Field(None, description="Optional raw ProjectDigitalTwin JSON payload")
    delay_days_delta: int = Field(0, description="Projected schedule delay delta in days (+/- days)")
    expenditure_delta: float = Field(0.0, description="Projected financial expenditure change in INR (+/- INR)")
    physical_progress_delta: float = Field(0.0, description="Projected physical progress percentage change (+/- %)")


def _get_or_create_twin(project_id: Optional[str], twin_dict: Optional[dict[str, Any]]) -> ProjectDigitalTwin:
    """Helper to deserialize raw twin payload or resolve default sample digital twin."""
    if twin_dict:
        try:
            return ProjectDigitalTwin(**twin_dict)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid digital_twin payload: {e}")

    pid = project_id or "PROJ/DEMO/2026/001"
    return ProjectDigitalTwin(
        project_id=pid,
        project_name=f"Sample Project {pid}",
        category="ROAD",
        location=GeoLocation(district="Lucknow", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number=f"MPLADS/SAN/{pid}",
            sanction_date=date(2025, 1, 1),
            sanctioned_amount=Decimal("3000000"),
        ),
        budget=Budget(approved_budget=Decimal("3000000"), estimated_cost=Decimal("2900000")),
        expenditure=Expenditure(total_expenditure=Decimal("2100000")),
        latest_progress=ProgressRecord(as_of_date=date.today(), financial_progress=70.0, physical_progress=45.0),
        document_types_present=["SANCTION_ORDER", "WORK_ORDER"],
        start_date=datetime(2025, 1, 15),
        expected_completion_date=datetime(2025, 12, 31),
    )


@router.post("/projects/analyze", status_code=status.HTTP_200_OK)
async def analyze_project(req: ProjectAnalysisRequest) -> dict[str, Any]:
    """
    POST /api/v1/projects/analyze

    Executes 19-agent risk assessment pipeline and evidence fusion engine.

    Args:
        req: ProjectAnalysisRequest payload containing project_id or raw digital_twin dict.

    Returns:
        JSON response with overall risk score, 3D breakdown, 8D fingerprint, agent evidence array,
        NLP markdown summary narrative, and created investigation case ID (if high risk).
    """
    twin = _get_or_create_twin(req.project_id, req.digital_twin)
    state = await execute_pipeline(twin)

    risk_output = state["risk_output"]
    evidence_list = state["agent_evidence_list"]
    nlp_summary = state.get("nlp_summary", "")
    investigation_case = state.get("investigation_case")

    return {
        "project_id": twin.project_id,
        "overall_risk_score": risk_output.overall_risk_score,
        "risk_level": risk_output.risk_level.value,
        "current_risk": risk_output.current_risk,
        "future_risk": risk_output.future_risk,
        "systemic_risk": risk_output.systemic_risk,
        "fingerprint": risk_output.fingerprint.model_dump() if risk_output.fingerprint else {},
        "top_signals": risk_output.top_signals,
        "agent_evidence": [ev.model_dump(mode="json") for ev in evidence_list],
        "nlp_summary": nlp_summary,
        "investigation_case_id": investigation_case.case_id if investigation_case else None,
        "analyzed_at": risk_output.computed_at.isoformat(),
    }


@router.post("/simulation/what-if", status_code=status.HTTP_200_OK)
async def run_what_if_simulation(req: WhatIfSimulationRequest) -> dict[str, Any]:
    """
    POST /api/v1/simulation/what-if

    Executes What-If parameter simulation on cloned digital twin.

    Args:
        req: WhatIfSimulationRequest payload specifying parameter deltas.

    Returns:
        JSON response detailing baseline risk, simulated risk, calculated score deltas, and risk transitions.
    """
    twin = _get_or_create_twin(req.project_id, req.digital_twin)
    simulator = WhatIfSimulator()

    result = simulator.simulate_what_if(
        digital_twin=twin,
        delay_days_delta=req.delay_days_delta,
        expenditure_delta=req.expenditure_delta,
        physical_progress_delta=req.physical_progress_delta,
    )
    return result


@router.get("/reports/pdf/{project_id}")
async def generate_pdf_report(project_id: str):
    """
    GET /api/v1/reports/pdf/{project_id}

    Generates and streams 1-page printable Field Inspection Brief PDF file.

    Args:
        project_id: Target project ID path parameter.

    Returns:
        Streaming Response with application/pdf header and binary PDF stream.
    """
    twin = _get_or_create_twin(project_id, None)
    state = await execute_pipeline(twin)

    risk_output = state["risk_output"]
    nlp_summary = state.get("nlp_summary", "")

    pdf_service = FieldInspectionPDFService()
    pdf_bytes = pdf_service.generate_field_inspection_brief(
        digital_twin=twin,
        risk_output=risk_output,
        nlp_summary=nlp_summary,
    )

    clean_pid = project_id.replace("/", "_")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=field_inspection_{clean_pid}.pdf"
        },
    )
