"""
agents/part_b/deterministic/physical_progress_agent.py
Physical Progress Mismatch Agent — Part B.
Measures progress gap = Financial % - Physical % and evaluates discrepancy severity.
"""
from __future__ import annotations

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity


class PhysicalProgressAgent(BaseAgent):
    """
    Physical Progress Mismatch Agent.

    Evaluates the physical-financial progress gap using the formula:
    `Progress Gap (%) = Financial Progress (%) - Physical Progress (%)`

    Threshold Brackets:
    - Moderate Gap (>= 10.0%): Triggers MODERATE_PROGRESS_DISCREPANCY (Score +15.0)
    - High Gap (>= 20.0%): Triggers HIGH_PROGRESS_DISCREPANCY (Score +30.0 + linear scaling)
    - Critical Gap (>= 35.0%): Triggers CRITICAL_PROGRESS_DISCREPANCY (Score +50.0 + linear scaling)
    """
    agent_id = "physical_progress_agent"
    agent_name = "Physical Progress Mismatch Agent"
    version = "1.0.0"

    # Progress Gap Thresholds (%)
    GAP_CRITICAL = 35.0
    GAP_HIGH = 20.0
    GAP_MODERATE = 10.0

    def is_applicable(self, context: AgentContext) -> bool:
        """
        Checks if both financial and physical progress values are recorded.

        Args:
            context: Project execution context.

        Returns:
            bool: True if digital twin has non-null progress entries.
        """
        twin = context.digital_twin
        if twin is None:
            return False
        # Need both financial and physical progress values
        fin_prog = twin.financial_progress
        phy_prog = twin.physical_progress
        return fin_prog is not None and phy_prog is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        """
        Calculates the progress gap math and returns risk signals based on threshold severity.

        Math:
            `progress_gap = fin_prog - phy_prog`
            If `progress_gap >= 35.0%`: score = 50.0 + min(40.0, (gap - 35.0) * 1.5)
            If `progress_gap >= 20.0%`: score = 30.0 + (gap - 20.0) * 1.0

        Args:
            context: Execution context with digital twin progress history.

        Returns:
            AgentEvidence: Calculated progress gap evidence data points and signals.
        """
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        fin_prog = twin.financial_progress or 0.0
        phy_prog = twin.physical_progress or 0.0
        progress_gap = fin_prog - phy_prog

        evidence.append(EvidenceDataPoint(
            label="Financial Progress (%)",
            value=round(fin_prog, 2),
            unit="%",
            source="latest_progress_record"
        ))
        evidence.append(EvidenceDataPoint(
            label="Physical Progress (%)",
            value=round(phy_prog, 2),
            unit="%",
            source="latest_progress_record"
        ))
        evidence.append(EvidenceDataPoint(
            label="Progress Gap (Financial % - Physical %)",
            value=round(progress_gap, 2),
            unit="%",
            source="gap_calculation"
        ))

        # ── Discrepancy Evaluation ─────────────────────────────────────────────
        if progress_gap >= self.GAP_CRITICAL:
            signals.append(AgentSignal(
                signal_type="CRITICAL_PROGRESS_DISCREPANCY",
                description=f"Critical progress discrepancy detected: Financial progress ({fin_prog:.1f}%) exceeds physical progress ({phy_prog:.1f}%) by {progress_gap:.1f}%",
                severity=Severity.CRITICAL,
                value=progress_gap,
                unit="%",
                confidence=0.92,
                expected_value=f"Progress gap < {self.GAP_MODERATE}%",
            ))
            score += 50.0 + min(40.0, (progress_gap - self.GAP_CRITICAL) * 1.5)
        elif progress_gap >= self.GAP_HIGH:
            signals.append(AgentSignal(
                signal_type="HIGH_PROGRESS_DISCREPANCY",
                description=f"High progress discrepancy detected: Financial progress ({fin_prog:.1f}%) exceeds physical progress ({phy_prog:.1f}%) by {progress_gap:.1f}%",
                severity=Severity.HIGH,
                value=progress_gap,
                unit="%",
                confidence=0.88,
                expected_value=f"Progress gap < {self.GAP_MODERATE}%",
            ))
            score += 30.0 + (progress_gap - self.GAP_HIGH) * 1.0
        elif progress_gap >= self.GAP_MODERATE:
            signals.append(AgentSignal(
                signal_type="MODERATE_PROGRESS_DISCREPANCY",
                description=f"Moderate progress discrepancy: Financial progress ({fin_prog:.1f}%) exceeds physical progress ({phy_prog:.1f}%) by {progress_gap:.1f}%",
                severity=Severity.MEDIUM,
                value=progress_gap,
                unit="%",
                confidence=0.82,
                expected_value=f"Progress gap < {self.GAP_MODERATE}%",
            ))
            score += 15.0

        # Reverse gap check (Physical >> Financial)
        elif progress_gap <= -25.0:
            signals.append(AgentSignal(
                signal_type="UNPAID_PHYSICAL_ADVANCEMENT",
                description=f"Physical progress ({phy_prog:.1f}%) substantially exceeds financial progress ({fin_prog:.1f}%) by {abs(progress_gap):.1f}%",
                severity=Severity.LOW,
                value=progress_gap,
                unit="%",
                confidence=0.80,
            ))
            score += 5.0

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
            data_sources=["progress_records"],
        )
