"""
engine/early_warning.py
Early Warning Engine for proactive hazard detection, deadline alerts, and automatic escalation signals.
Includes alert deduplication and severity categorization.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

from app.utils.logging import get_logger
from engine.trajectory import RiskTrajectory
from models.agent import AgentEvidence
from models.digital_twin import ProjectDigitalTwin
from models.enums import Severity
from models.risk import RiskOutput

logger = get_logger("early_warning_engine")


@dataclass
class EarlyWarningAlert:
    warning_id: str
    warning_type: str
    severity: Severity
    title: str
    description: str
    trigger_signal: str
    trigger_value: float
    threshold_value: float
    remediation_advice: str
    created_at: str
    project_id: str
    evidence_items: List[str] = field(default_factory=list)


class EarlyWarningEngine:
    """
    Evaluates multi-dimensional risk outputs, digital twin state, and risk trajectory
    to generate prioritized, actionable early warnings.
    """

    def evaluate_warnings(
        self,
        twin: ProjectDigitalTwin,
        risk_output: RiskOutput,
        trajectory: Optional[RiskTrajectory] = None,
        evidence_list: Optional[List[AgentEvidence]] = None,
    ) -> List[EarlyWarningAlert]:
        """
        Scans digital twin state and risk metrics to emit early warnings.
        """
        alerts: List[EarlyWarningAlert] = []
        now_iso = datetime.now(timezone.utc).isoformat()
        pid = twin.project_id

        # 1. Critical Overall Risk Breach
        if risk_output.overall_risk_score >= 70.0:
            alerts.append(EarlyWarningAlert(
                warning_id=f"EW-CRIT-{pid}",
                warning_type="HIGH_RISK_THRESHOLD_EXCEEDED",
                severity=Severity.CRITICAL,
                title="Critical Systemic Risk Threshold Exceeded",
                description=f"Project composite risk score ({risk_output.overall_risk_score:.1f}/100) requires immediate administrative audit.",
                trigger_signal="overall_risk_score",
                trigger_value=float(risk_output.overall_risk_score),
                threshold_value=70.0,
                remediation_advice="Freeze further fund disbursement and trigger formal Investigation Case.",
                created_at=now_iso,
                project_id=pid,
                evidence_items=risk_output.top_signals,
            ))

        # 2. Severe Financial-Physical Progress Desynchronization
        gap = float(twin.financial_progress or 0.0) - float(twin.physical_progress or 0.0)
        if gap >= 35.0:
            alerts.append(EarlyWarningAlert(
                warning_id=f"EW-GAP-{pid}",
                warning_type="PROGRESS_DESYNCHRONIZATION",
                severity=Severity.HIGH,
                title="Severe Financial-to-Physical Progress Mismatch",
                description=f"Financial disbursement ({twin.financial_progress:.1f}%) leads physical work ({twin.physical_progress:.1f}%) by {gap:.1f} percentage points.",
                trigger_signal="financial_physical_gap",
                trigger_value=gap,
                threshold_value=35.0,
                remediation_advice="Conduct mandatory physical site verification before releasing next payment installment.",
                created_at=now_iso,
                project_id=pid,
                evidence_items=[f"Financial: {twin.financial_progress}%", f"Physical: {twin.physical_progress}%"],
            ))

        # 3. Rapid Risk Escalation from Trajectory
        if trajectory and trajectory.is_rapidly_escalating:
            alerts.append(EarlyWarningAlert(
                warning_id=f"EW-TRAJ-{pid}",
                warning_type="RAPID_RISK_ESCALATION",
                severity=Severity.HIGH,
                title="Rapid Risk Velocity Alert",
                description=f"Project risk has accelerated by +{trajectory.velocity:.1f} points per month.",
                trigger_signal="risk_velocity",
                trigger_value=trajectory.velocity,
                threshold_value=12.0,
                remediation_advice="Review recent change requests, payment vouchers, and contractor dispute logs.",
                created_at=now_iso,
                project_id=pid,
                evidence_items=[trajectory.summary],
            ))

        # 4. Overdue Critical Delay
        is_ovd = getattr(twin, "is_overdue", False) or getattr(twin, "is_delayed", False)
        delay_d = getattr(twin, "delay_days", 0) or 0
        phys_p = getattr(twin, "physical_progress", 0.0) or 0.0
        if is_ovd and delay_d > 90 and phys_p < 100.0:
            alerts.append(EarlyWarningAlert(
                warning_id=f"EW-DELAY-{pid}",
                warning_type="CRITICAL_TIMELINE_BREACH",
                severity=Severity.MEDIUM,
                title="Prolonged Completion Delay",
                description=f"Project is overdue by {twin.delay_days} days with only {twin.physical_progress:.1f}% completion.",
                trigger_signal="delay_days",
                trigger_value=float(twin.delay_days or 0),
                threshold_value=90.0,
                remediation_advice="Issue show-cause notice to the executing agency and demand revised work timeline.",
                created_at=now_iso,
                project_id=pid,
                evidence_items=[f"Overdue by {twin.delay_days} days"],
            ))

        return alerts
