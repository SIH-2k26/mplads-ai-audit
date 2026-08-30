"""
tests/unit/test_trajectory_and_warnings.py
Unit tests for RiskTrajectoryEngine and EarlyWarningEngine.
"""
from datetime import datetime, timedelta, timezone
from decimal import Decimal
import pytest

from engine.early_warning import EarlyWarningEngine
from engine.trajectory import RiskHistoricalPoint, RiskTrajectoryEngine, TrajectoryDirection
from models.digital_twin import ProjectDigitalTwin
from models.enums import RiskLevel
from models.risk import RiskOutput


def test_trajectory_engine_detects_rising_escalation():
    engine = RiskTrajectoryEngine()
    now = datetime.now(timezone.utc)
    
    # Rising risk: 20 -> 45 -> 78
    history = [
        RiskHistoricalPoint(score=20.0, timestamp=now - timedelta(days=60)),
        RiskHistoricalPoint(score=45.0, timestamp=now - timedelta(days=30)),
    ]

    traj = engine.compute_trajectory("PROJ-TEST", current_score=78.0, history=history)

    assert traj.direction == TrajectoryDirection.RISING
    assert traj.velocity > 0.0
    assert traj.is_rapidly_escalating is True


def test_early_warning_engine_triggers_alerts():
    from datetime import date
    from models.project import ProgressRecord
    engine = EarlyWarningEngine()
    twin = ProjectDigitalTwin(
        project_id="PROJ-EW-001",
        project_name="High Risk School Building",
        latest_progress=ProgressRecord(financial_progress=98.0, physical_progress=40.0, as_of_date=date(2024, 1, 15)),
    )
    risk = RiskOutput(
        project_id="PROJ-EW-001",
        overall_risk_score=76.0,
        risk_level=RiskLevel.HIGH,
        current_risk=50.0,
        future_risk=65.0,
        systemic_risk=10.0,
        top_signals=["Severe gap"],
    )

    alerts = engine.evaluate_warnings(twin, risk)
    assert len(alerts) >= 2
    types = [a.warning_type for a in alerts]
    assert "HIGH_RISK_THRESHOLD_EXCEEDED" in types
    assert "PROGRESS_DESYNCHRONIZATION" in types
