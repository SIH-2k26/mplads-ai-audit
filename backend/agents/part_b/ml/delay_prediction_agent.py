"""
agents/part_b/ml/delay_prediction_agent.py
Delay Prediction & Horizon Agent — Part B ML/Statistical.
Predicts completion delay probability and expected delay duration.
"""
from __future__ import annotations
from datetime import datetime, timezone
UTC = timezone.utc

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity, ProjectStatus


class DelayPredictionAgent(BaseAgent):
    """
    Delay Prediction & Horizon Agent.

    Predicts project completion delay probability and projected delay duration in days.

    Pace & Horizon Math:
    - `Current Daily Pace (%/day) = Physical Progress (%) / Elapsed Days`
    - `Predicted Remaining Days = (100% - Physical Progress %) / Current Daily Pace`
    - `Predicted Total Days = Elapsed Days + Predicted Remaining Days`
    - `Predicted Delay Days = max(0, Predicted Total Days - Total Planned Days)`
    - `Delay Probability = Logistic(-2.0 + 3.5*PaceDeficit + 0.01*DelayDays + 0.5*ApprovedExtensions)`
    """
    agent_id = "delay_prediction_agent"
    agent_name = "Delay Prediction & Horizon Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        """
        Checks applicability based on project schedule availability.

        Args:
            context: Execution context.

        Returns:
            bool: True if start date or expected completion date exists.
        """
        twin = context.digital_twin
        return twin is not None and (
            twin.expected_completion_date is not None or twin.start_date is not None
        )

    def analyze(self, context: AgentContext) -> AgentEvidence:
        """
        Computes current daily physical pace, projects remaining duration, and evaluates delay probability.

        Args:
            context: Project execution context.

        Returns:
            AgentEvidence: Projected delay days, delay probability, and risk signals.
        """
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        now = datetime.now(UTC)
        start = twin.start_date or (twin.created_at or now)
        expected_comp = twin.expected_completion_date or now
        actual_comp = twin.actual_completion_date

        # Twin dates are stored as naive datetimes (no tzinfo).
        # Normalize `now` to naive UTC to prevent TypeError on subtraction.
        def _to_naive(dt: datetime) -> datetime:
            """Strips tzinfo if present, returning a naive datetime."""
            if dt is None:
                return None
            return dt.replace(tzinfo=None) if dt.tzinfo is not None else dt

        now_naive = _to_naive(now)
        start_naive = _to_naive(start)
        expected_comp_naive = _to_naive(expected_comp)

        total_planned_days = max(1, (expected_comp_naive - start_naive).days)
        elapsed_days = max(1, (now_naive - start_naive).days)

        phy_prog = float(twin.physical_progress or 0.0)

        # ── 1. Progress Pace Calculation ──────────────────────────────────────
        # Pace required: 100% / total_planned_days
        # Current pace: phy_prog / elapsed_days
        current_daily_pace = phy_prog / float(elapsed_days) if elapsed_days > 0 else 0.0
        remaining_progress = max(0.0, 100.0 - phy_prog)

        if current_daily_pace > 0:
            predicted_remaining_days = remaining_progress / current_daily_pace
        else:
            predicted_remaining_days = 365.0  # Default 1 year if zero pace

        predicted_total_days = elapsed_days + predicted_remaining_days
        predicted_delay_days = max(0.0, predicted_total_days - total_planned_days)

        # ── 2. Delay Probability Logistic Function ─────────────────────────────
        # Features influencing delay probability: pace ratio, delay_days already incurred, extensions
        schedule_time_ratio = elapsed_days / float(total_planned_days) if total_planned_days > 0 else 1.0
        pace_deficit = schedule_time_ratio - (phy_prog / 100.0)

        z = -2.0 + (3.5 * pace_deficit) + (0.01 * twin.delay_days) + (0.5 * (twin.approved_extensions or 0))
        delay_probability = 1.0 / (1.0 + math_exp(-max(-10.0, min(10.0, z))))

        evidence.append(EvidenceDataPoint(
            label="Elapsed Time Ratio (Elapsed/Planned)",
            value=round(schedule_time_ratio, 2),
            source="schedule_evaluator"
        ))
        evidence.append(EvidenceDataPoint(
            label="Current Daily Physical Pace (%/day)",
            value=round(current_daily_pace, 3),
            unit="%/day",
            source="pace_calculator"
        ))
        evidence.append(EvidenceDataPoint(
            label="Predicted Completion Delay (Days)",
            value=round(predicted_delay_days, 1),
            unit="days",
            source="predictive_delay_model"
        ))
        evidence.append(EvidenceDataPoint(
            label="Delay Probability Score",
            value=round(delay_probability, 3),
            source="logistic_delay_classifier"
        ))

        # ── 3. Signal Generation ───────────────────────────────────────────────
        if actual_comp is None and twin.project_status != ProjectStatus.COMPLETED:
            if delay_probability >= 0.85 or predicted_delay_days >= 180:
                signals.append(AgentSignal(
                    signal_type="HIGH_DELAY_PROBABILITY",
                    description=f"Predictive model indicates high probability of completion delay ({delay_probability:.1%}) with projected delay of {predicted_delay_days:.0f} days",
                    severity=Severity.CRITICAL if predicted_delay_days >= 270 else Severity.HIGH,
                    value=round(delay_probability, 3),
                    unit="probability",
                    confidence=0.89,
                    expected_value="Delay probability < 40%",
                ))
                score += 55.0
            elif delay_probability >= 0.60 or predicted_delay_days >= 60:
                signals.append(AgentSignal(
                    signal_type="MODERATE_DELAY_PROBABILITY",
                    description=f"Predictive model forecasts moderate completion delay risk ({delay_probability:.1%}) with projected delay of {predicted_delay_days:.0f} days",
                    severity=Severity.MEDIUM,
                    value=round(delay_probability, 3),
                    unit="probability",
                    confidence=0.82,
                    expected_value="Delay probability < 40%",
                ))
                score += 30.0

        score = min(100.0, score)
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=0.88,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["digital_twin", "predictive_delay_model"],
        )


def math_exp(x: float) -> float:
    import math
    return math.exp(x)
