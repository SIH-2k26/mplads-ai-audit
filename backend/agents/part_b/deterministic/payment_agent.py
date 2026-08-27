"""
agents/part_b/deterministic/payment_agent.py
Payment Anomaly & Fund Parking Agent — Part B.
Checks payment frequency and flags 45+ day zero-expenditure fund parking.
"""
from __future__ import annotations
from datetime import datetime, date
from decimal import Decimal

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity, ProjectStatus


class PaymentAgent(BaseAgent):
    """
    Payment Anomaly & Fund Parking Agent.
    
    Evaluates payment histories, financial inactivity intervals, and payment
    frequency to identify fund parking anomalies (zero expenditure >= 45 days)
    and invoice splitting patterns.
    """
    agent_id = "payment_agent"
    agent_name = "Payment Anomaly & Fund Parking Agent"
    version = "1.0.0"

    # Thresholds
    FUND_PARKING_DAYS_THRESHOLD = 45  # 45+ days zero expenditure
    CRITICAL_FUND_PARKING_DAYS = 90   # 90+ days zero expenditure
    SPLIT_PAYMENT_WINDOW_DAYS = 2     # Multiple payments within 2 days

    def is_applicable(self, context: AgentContext) -> bool:
        """
        Determines if the agent can analyze the project context.

        Args:
            context: Execution context containing project digital twin.

        Returns:
            True if digital twin and valid sanctioned amount exist, False otherwise.
        """
        twin = context.digital_twin
        return twin is not None and twin.sanctioned_amount is not None and twin.sanctioned_amount > 0

    def analyze(self, context: AgentContext) -> AgentEvidence:
        """
        Analyzes payment records for zero-expenditure fund parking and split payment patterns.

        Args:
            context: Execution context with project digital twin state.

        Returns:
            AgentEvidence containing risk score, signals, and evidence data points.
        """
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        sanctioned = twin.sanctioned_amount or Decimal("0")
        expenditure = twin.total_expenditure or Decimal("0")
        payments = twin.expenditure.payments if twin.expenditure else []

        evidence.append(EvidenceDataPoint(
            label="Sanctioned Amount (INR)",
            value=float(sanctioned),
            source="sanction_record"
        ))
        evidence.append(EvidenceDataPoint(
            label="Total Expenditure (INR)",
            value=float(expenditure),
            source="expenditure_record"
        ))
        evidence.append(EvidenceDataPoint(
            label="Payment Records Count",
            value=len(payments),
            source="payment_records"
        ))

        # ── 1. Fund Parking Detection (45+ days zero expenditure) ────────────────
        now = datetime.utcnow().date()
        reference_date = None
        
        if twin.start_date:
            reference_date = twin.start_date.date() if isinstance(twin.start_date, datetime) else twin.start_date
        elif twin.sanction and twin.sanction.sanction_date:
            reference_date = twin.sanction.sanction_date

        if payments:
            # Find latest payment date
            valid_payment_dates = [p.payment_date for p in payments if p.payment_date]
            if valid_payment_dates:
                latest_payment_date = max(valid_payment_dates)
                reference_date = latest_payment_date

        if reference_date and twin.project_status in (ProjectStatus.IN_PROGRESS, ProjectStatus.SANCTIONED, ProjectStatus.DELAYED):
            days_inactive = (now - reference_date).days
            evidence.append(EvidenceDataPoint(
                label="Days Since Last Active Financial Movement",
                value=days_inactive,
                unit="days",
                source="timeline_evaluation"
            ))

            if expenditure == Decimal("0") or len(payments) == 0:
                if days_inactive >= self.CRITICAL_FUND_PARKING_DAYS:
                    signals.append(AgentSignal(
                        signal_type="CRITICAL_FUND_PARKING",
                        description=f"Zero expenditure recorded for {days_inactive} days (>= {self.CRITICAL_FUND_PARKING_DAYS} days threshold) on active project",
                        severity=Severity.CRITICAL,
                        value=days_inactive,
                        unit="days",
                        confidence=0.95,
                        expected_value=f"< {self.FUND_PARKING_DAYS_THRESHOLD} days",
                    ))
                    score += 55.0
                elif days_inactive >= self.FUND_PARKING_DAYS_THRESHOLD:
                    signals.append(AgentSignal(
                        signal_type="ZERO_EXPENDITURE_FUND_PARKING",
                        description=f"Zero expenditure recorded for {days_inactive} days (>= {self.FUND_PARKING_DAYS_THRESHOLD} days threshold) indicating potential fund parking",
                        severity=Severity.HIGH if days_inactive >= 60 else Severity.MEDIUM,
                        value=days_inactive,
                        unit="days",
                        confidence=0.90,
                        expected_value=f"< {self.FUND_PARKING_DAYS_THRESHOLD} days",
                    ))
                    score += 35.0

        # ── 2. Payment Frequency & Split Payment Detection ──────────────────────
        if len(payments) > 1:
            sorted_payments = sorted([p for p in payments if p.payment_date], key=lambda x: x.payment_date)
            same_day_count = 0
            close_interval_count = 0

            for i in range(len(sorted_payments) - 1):
                p1, p2 = sorted_payments[i], sorted_payments[i + 1]
                delta = (p2.payment_date - p1.payment_date).days
                if delta == 0:
                    same_day_count += 1
                elif delta <= self.SPLIT_PAYMENT_WINDOW_DAYS:
                    close_interval_count += 1

            if same_day_count > 0 or close_interval_count > 0:
                signals.append(AgentSignal(
                    signal_type="SPLIT_PAYMENT_PATTERN",
                    description=f"Detected {same_day_count} same-day and {close_interval_count} short-interval (<={self.SPLIT_PAYMENT_WINDOW_DAYS}d) payments indicating potential invoice splitting",
                    severity=Severity.HIGH if (same_day_count + close_interval_count) >= 3 else Severity.MEDIUM,
                    value=same_day_count + close_interval_count,
                    unit="count",
                    confidence=0.85,
                ))
                score += min(30.0, (same_day_count + close_interval_count) * 10.0)

        score = min(100.0, score)
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=0.90,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["sanction_records", "expenditure_records", "payment_records"],
        )
