"""
agents/deterministic/budget.py
Budget Agent — checks financial consistency and anomalies.
"""
from __future__ import annotations
from decimal import Decimal
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity


class BudgetAgent(BaseAgent):
    agent_id = "budget_agent"
    agent_name = "Budget Agent"
    version = "1.0.0"

    # Thresholds
    COST_OVERRUN_WARNING = 0.10   # 10% over budget = warning
    COST_OVERRUN_HIGH = 0.25      # 25% over budget = high signal
    COST_OVERRUN_CRITICAL = 0.50  # 50% over budget = critical signal
    PROGRESS_MISMATCH_THRESHOLD = 25.0  # Financial - Physical > 25% is anomalous

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        # Need at least a sanctioned amount
        return twin.sanctioned_amount is not None and twin.sanctioned_amount > 0

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        sanctioned = twin.sanctioned_amount or Decimal("0")
        expenditure = twin.total_expenditure or Decimal("0")
        budget_approved = twin.budget.approved_budget if twin.budget else Decimal("0")
        estimated_cost = twin.budget.estimated_cost if twin.budget else Decimal("0")
        revised_cost = twin.budget.revised_cost if twin.budget else None

        effective_budget = revised_cost or budget_approved or sanctioned

        evidence.append(EvidenceDataPoint(label="Sanctioned Amount (INR)", value=float(sanctioned), source="sanction_record"))
        evidence.append(EvidenceDataPoint(label="Total Expenditure (INR)", value=float(expenditure), source="payment_records"))
        if effective_budget:
            evidence.append(EvidenceDataPoint(label="Effective Budget (INR)", value=float(effective_budget), source="budget_record"))

        # ── Expenditure vs. Budget ─────────────────────────────────────────────
        if effective_budget and effective_budget > 0:
            overrun_ratio = float((expenditure - effective_budget) / effective_budget)
            if overrun_ratio > self.COST_OVERRUN_CRITICAL:
                signals.append(AgentSignal(
                    signal_type="SIGNIFICANT_COST_OVERRUN",
                    description=f"Expenditure exceeds effective budget by {overrun_ratio:.1%}",
                    severity=Severity.CRITICAL,
                    value=overrun_ratio,
                    unit="ratio",
                    confidence=0.95,
                ))
                score += 40.0
            elif overrun_ratio > self.COST_OVERRUN_HIGH:
                signals.append(AgentSignal(
                    signal_type="COST_OVERRUN",
                    description=f"Expenditure exceeds effective budget by {overrun_ratio:.1%}",
                    severity=Severity.HIGH,
                    value=overrun_ratio,
                    unit="ratio",
                    confidence=0.9,
                ))
                score += 25.0
            elif overrun_ratio > self.COST_OVERRUN_WARNING:
                signals.append(AgentSignal(
                    signal_type="BUDGET_OVERRUN_WARNING",
                    description=f"Expenditure is {overrun_ratio:.1%} over budget",
                    severity=Severity.MEDIUM,
                    value=overrun_ratio,
                    unit="ratio",
                    confidence=0.85,
                ))
                score += 10.0

        # ── Estimated cost vs. Sanctioned amount ───────────────────────────────
        if estimated_cost and sanctioned and sanctioned > 0:
            est_overrun = float((estimated_cost - sanctioned) / sanctioned)
            if est_overrun > 0.20 and not revised_cost:
                signals.append(AgentSignal(
                    signal_type="COST_ESTIMATE_EXCEEDS_SANCTION",
                    description=f"Cost estimate ({float(estimated_cost):,.0f}) exceeds sanctioned amount ({float(sanctioned):,.0f}) by {est_overrun:.1%} without revision",
                    severity=Severity.MEDIUM,
                    value=est_overrun,
                    unit="ratio",
                    confidence=0.85,
                ))
                score += 15.0

        # ── Financial vs. Physical progress mismatch ───────────────────────────
        fin_prog = twin.financial_progress
        phy_prog = twin.physical_progress
        if fin_prog is not None and phy_prog is not None:
            mismatch = fin_prog - phy_prog
            evidence.append(EvidenceDataPoint(
                label="Progress Mismatch (Financial - Physical)",
                value=round(mismatch, 1),
                unit="%",
                source="progress_records",
            ))
            if mismatch > self.PROGRESS_MISMATCH_THRESHOLD:
                signals.append(AgentSignal(
                    signal_type="FINANCIAL_PHYSICAL_PROGRESS_MISMATCH",
                    description=f"Financial progress ({fin_prog:.1f}%) significantly exceeds physical progress ({phy_prog:.1f}%), gap of {mismatch:.1f}%",
                    severity=Severity.HIGH if mismatch > 40 else Severity.MEDIUM,
                    value=mismatch,
                    unit="%",
                    confidence=0.9,
                    expected_value=f"Financial ≈ Physical ±{self.PROGRESS_MISMATCH_THRESHOLD}%",
                ))
                score += min(30.0, mismatch * 0.8)

        # ── Zero expenditure on active project ────────────────────────────────
        from models.enums import ProjectStatus
        if (twin.project_status in (ProjectStatus.IN_PROGRESS, ProjectStatus.DELAYED)
                and expenditure == 0 and sanctioned > 0):
            signals.append(AgentSignal(
                signal_type="ZERO_EXPENDITURE_ON_ACTIVE_PROJECT",
                description="Project is active but shows zero expenditure",
                severity=Severity.MEDIUM,
                value=0,
                unit="INR",
                confidence=0.75,
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
            confidence=0.9,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["sanction_records", "payment_records", "budget_records", "progress_records"],
        )
