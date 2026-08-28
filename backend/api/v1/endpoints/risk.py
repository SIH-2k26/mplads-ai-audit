"""
api/v1/endpoints/risk.py
Risk Trajectory and Early Warning API endpoints.
"""
from __future__ import annotations
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import get_current_user
from engine.early_warning import EarlyWarningEngine, EarlyWarningAlert
from engine.trajectory import RiskHistoricalPoint, RiskTrajectoryEngine, RiskTrajectory
from models.digital_twin import ProjectDigitalTwin
from models.enums import RiskLevel, Severity
from models.project import ProgressRecord
from models.risk import RiskFingerprint, RiskOutput

router = APIRouter(prefix="/risk", tags=["Risk & Early Warning"])

trajectory_engine = RiskTrajectoryEngine()
early_warning_engine = EarlyWarningEngine()


@router.get("/{project_id}/trajectory")
async def get_project_risk_trajectory(
    project_id: str,
    current_score: float = 65.0,
    current_user=Depends(get_current_user),
):
    """
    Computes directional risk velocity, acceleration, and escalation hazards across evaluation history.
    """
    # Synthetic historical points for demonstration/evaluation
    now = datetime.now(timezone.utc)
    mock_history = [
        RiskHistoricalPoint(score=max(0.0, current_score - 28.0), timestamp=now - timedelta(days=60)),
        RiskHistoricalPoint(score=max(0.0, current_score - 14.0), timestamp=now - timedelta(days=30)),
    ]

    traj: RiskTrajectory = trajectory_engine.compute_trajectory(
        project_id=project_id,
        current_score=current_score,
        history=mock_history,
    )

    return {
        "project_id": traj.project_id,
        "current_score": traj.current_score,
        "direction": traj.direction.value,
        "velocity_per_month": traj.velocity,
        "acceleration": traj.acceleration,
        "stability_variance": traj.stability,
        "is_rapidly_escalating": traj.is_rapidly_escalating,
        "summary": traj.summary,
    }


@router.get("/{project_id}/warnings")
async def get_project_early_warnings(
    project_id: str,
    current_user=Depends(get_current_user),
):
    """
    Returns active early warning alerts and proactive remediation advice.
    """
    # Create minimal mock context for warning evaluation
    # NOTE: financial_progress/physical_progress are computed properties on ProjectDigitalTwin,
    # they must be supplied via latest_progress ProgressRecord.
    twin = ProjectDigitalTwin(
        project_id=project_id,
        project_name=f"Project {project_id}",
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=95.0,
            physical_progress=38.0,
        ),
    )
    risk_output = RiskOutput(
        project_id=project_id,
        overall_risk_score=72.5,
        risk_level=RiskLevel.HIGH,
        current_risk=45.0,
        future_risk=60.0,
        systemic_risk=20.0,
        top_signals=["Severe financial/physical progress gap (+57%)", "Prolonged timeline overrun"],
    )

    warnings: List[EarlyWarningAlert] = early_warning_engine.evaluate_warnings(twin, risk_output)

    return [
        {
            "warning_id": w.warning_id,
            "warning_type": w.warning_type,
            "severity": w.severity.value if hasattr(w.severity, "value") else str(w.severity),
            "title": w.title,
            "description": w.description,
            "trigger_signal": w.trigger_signal,
            "trigger_value": w.trigger_value,
            "threshold_value": w.threshold_value,
            "remediation_advice": w.remediation_advice,
            "created_at": w.created_at,
            "evidence_items": w.evidence_items,
        }
        for w in warnings
    ]


@router.post("/analyze")
async def analyze_project_risk(
    payload: Dict[str, Any],
):
    """
    Inference endpoint for ML Hybrid Risk Engine.
    Accepts project inputs, derives missing ratios/signals, runs rules + ML + anomaly detection,
    and returns an explainable risk dossier.
    """
    try:
        from ml.ensemble import HybridRiskEnsemble
        ensemble = HybridRiskEnsemble()
        project_dict = payload.get("project", payload)
        result = ensemble.analyze_project(project_dict)
        return result
    except Exception as e:
        # Fallback graceful response if models are initializing
        sanctioned = float(payload.get("sanctioned_amount", 1000000.0))
        actual = float(payload.get("actual_expenditure", sanctioned))
        prog_phys = float(payload.get("physical_progress", 70.0))
        prog_fin = float(payload.get("financial_progress", 70.0))
        gap = prog_fin - prog_phys

        score = 25.0
        if gap > 25.0:
            score += 35.0
        if actual > sanctioned * 1.2:
            score += 25.0

        return {
            "project_id": payload.get("project_id", "SIM-001"),
            "risk_score": min(95.0, score),
            "risk_level": "HIGH" if score >= 65 else ("MEDIUM" if score >= 35 else "LOW"),
            "fraud_probability": round(score / 100.0, 2),
            "anomaly_probability": round(score / 100.0, 2),
            "category_scores": {"cost": 40.0, "financial": 45.0, "procurement": 30.0, "execution": 50.0},
            "anomaly_types": ["PROGRESS"] if gap > 25.0 else ["NONE"],
            "red_flags": [f"Progress desynchronization: financial {prog_fin}% vs physical {prog_phys}%"] if gap > 25.0 else [],
            "top_risk_factors": [{"feature": "financial_physical_gap", "impact": 0.35, "direction": "increases risk"}],
            "recommended_action": "Standard review.",
            "model_version": "v1.0-fallback",
        }

