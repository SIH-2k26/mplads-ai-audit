"""
agents/part_b/deterministic/financial_progress_agent.py
Financial Utilization Agent — Part B.
Calculates financial utilization percentage and evaluates over-utilization or front-loading risk.
"""
from __future__ import annotations
from decimal import Decimal
from typing import Optional

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity, ProjectStatus


class FinancialProgressAgent(BaseAgent):
    """
    Financial Utilization Agent.
    
    Computes financial utilization percentage (expenditure / sanctioned budget)
    and evaluates excess utilization or severe front-loading risks.
    """
    agent_id: str = "financial_progress_agent"
    agent_name: str = "Financial Utilization Agent"
    version: str = "1.0.0"

    # Utilization Thresholds (%)
    OVER_UTILIZATION_CRITICAL: float = 125.0
    OVER_UTILIZATION_HIGH: float = 100.0
    FRONT_LOAD_FINANCIAL_THRESHOLD: float = 80.0
    FRONT_LOAD_PHYSICAL_MAX: float = 30.0

    def is_applicable(self, context: AgentContext) -> bool:
        """
        Determines applicability based on sanction data availability.

        Args:
            context: Project execution context.

        Returns:
            bool: True if sanction budget > 0 exists.
        """
        twin = context.digital_twin
        return twin is not None and twin.sanctioned_amount is not None and twin.sanctioned_amount > 0

    def analyze(self, context: AgentContext) -> AgentEvidence:
        """
        Executes financial progress and utilization anomaly checks.

        Args:
            context: Project execution context.

        Returns:
            AgentEvidence: Calculated utilization signals and evidence records.
        """
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score: float = 0.0

        sanctioned: Decimal = twin.sanctioned_amount or Decimal("0")
        expenditure: Decimal = twin.total_expenditure or Decimal("0")
        approved_budget: Decimal = twin.budget.approved_budget if twin.budget else Decimal("0")
        effective_sanction: Decimal = approved_budget if approved_budget > 0 else sanctioned

        utilization_pct: float = 0.0
        if effective_sanction > 0:
            utilization_pct = float((expenditure / effective_sanction) * Decimal("100"))

        evidence.append(EvidenceDataPoint(
            label="Sanctioned Budget (INR)",
            value=float(effective_sanction),
            source="sanction_budget_record"
        ))
        evidence.append(EvidenceDataPoint(
            label="Total Expenditure (INR)",
            value=float(expenditure),
            source="expenditure_record"
        ))
        evidence.append(EvidenceDataPoint(
            label="Financial Utilization (%)",
            value=round(utilization_pct, 2),
            unit="%",
            source="utilization_calculation"
        ))

        # ── 1. Over-utilization Check (>100% or >125%) ────────────────────────
        if utilization_pct > self.OVER_UTILIZATION_CRITICAL:
            signals.append(AgentSignal(
                signal_type="CRITICAL_EXCESS_FINANCIAL_UTILIZATION",
                description=f"Financial utilization ({utilization_pct:.1f}%) critically exceeds approved sanction budget by >25%",
                severity=Severity.CRITICAL,
                value=utilization_pct,
                unit="%",
                confidence=0.95,
                expected_value="<= 100.0%",
            ))
            score += 50.0
        elif utilization_pct > self.OVER_UTILIZATION_HIGH:
            signals.append(AgentSignal(
                signal_type="EXCESS_FINANCIAL_UTILIZATION",
                description=f"Financial utilization ({utilization_pct:.1f}%) exceeds approved sanction budget",
                severity=Severity.HIGH,
                value=utilization_pct,
                unit="%",
                confidence=0.90,
                expected_value="<= 100.0%",
            ))
            score += 30.0

        # ── 2. Front-Loaded Utilization Check ────────────────────────────────
        phy_prog: Optional[float] = twin.physical_progress
        if phy_prog is not None:
            if utilization_pct >= self.FRONT_LOAD_FINANCIAL_THRESHOLD and phy_prog <= self.FRONT_LOAD_PHYSICAL_MAX:
                signals.append(AgentSignal(
                    signal_type="FRONT_LOADED_FINANCIAL_UTILIZATION",
                    description=f"High financial utilization ({utilization_pct:.1f}%) paired with low physical progress ({phy_prog:.1f}%) indicates severe front-loading",
                    severity=Severity.HIGH,
                    value=utilization_pct,
                    unit="%",
                    confidence=0.88,
                    expected_value=f"Physical progress > {self.FRONT_LOAD_PHYSICAL_MAX}% for {utilization_pct:.1f}% financial utilization",
                ))
                score += 35.0

        # ── 3. Low Utilization on Delayed Projects ───────────────────────────
        if twin.project_status == ProjectStatus.DELAYED and utilization_pct < 10.0:
            signals.append(AgentSignal(
                signal_type="STAGNANT_LOW_FINANCIAL_UTILIZATION",
                description=f"Project is delayed but shows extremely low financial utilization ({utilization_pct:.1f}%)",
                severity=Severity.MEDIUM,
                value=utilization_pct,
                unit="%",
                confidence=0.85,
            ))
            score += 15.0

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
            data_sources=["sanction_records", "expenditure_records", "progress_records"],
        )
