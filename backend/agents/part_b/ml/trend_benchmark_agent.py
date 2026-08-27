"""
agents/part_b/ml/trend_benchmark_agent.py
Progress Stagnation & Trend Agent — Part B ML/Statistical.
Detects progress stagnation across reporting periods and evaluates physical vs financial trend divergence.
"""
from __future__ import annotations

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity, ProjectStatus


class TrendBenchmarkAgent(BaseAgent):
    agent_id = "trend_benchmark_agent"
    agent_name = "Progress Stagnation & Trend Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return twin is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        history = twin.progress_history or []
        latest_prog = twin.latest_progress
        if latest_prog and not history:
            history = [latest_prog]

        evidence.append(EvidenceDataPoint(
            label="Reporting Periods Analyzed",
            value=len(history),
            source="progress_history"
        ))

        # ── 1. Progress Stagnation Evaluation ──────────────────────────────────
        if len(history) >= 2:
            sorted_history = sorted(history, key=lambda x: x.as_of_date)
            recent_reports = sorted_history[-3:]  # Inspect up to last 3 periods

            phy_values = [r.physical_progress for r in recent_reports]
            fin_values = [r.financial_progress for r in recent_reports]

            phy_delta = phy_values[-1] - phy_values[0]
            fin_delta = fin_values[-1] - fin_values[0]

            days_span = (recent_reports[-1].as_of_date - recent_reports[0].as_of_date).days or 1

            evidence.append(EvidenceDataPoint(
                label="Physical Progress Delta (Last Reporting Window)",
                value=round(phy_delta, 2),
                unit="%",
                source="trend_analyzer"
            ))
            evidence.append(EvidenceDataPoint(
                label="Financial Progress Delta (Last Reporting Window)",
                value=round(fin_delta, 2),
                unit="%",
                source="trend_analyzer"
            ))

            if twin.project_status in (ProjectStatus.IN_PROGRESS, ProjectStatus.DELAYED):
                # Rule A: Physical progress unchanged for multiple periods (Stagnation)
                if phy_delta == 0.0 and twin.physical_progress < 100.0 and days_span >= 30:
                    signals.append(AgentSignal(
                        signal_type="CHRONIC_PROGRESS_STAGNATION",
                        description=f"Physical progress stagnated at {phy_values[-1]:.1f}% with zero physical movement across {len(recent_reports)} consecutive reporting periods ({days_span} days)",
                        severity=Severity.HIGH if days_span >= 60 else Severity.MEDIUM,
                        value=days_span,
                        unit="days",
                        confidence=0.90,
                        expected_value="Physical progress increase > 0%",
                    ))
                    score += 35.0

                # Rule B: Financial progress increasing while physical progress remains flat (Financial Drain)
                if phy_delta == 0.0 and fin_delta >= 15.0:
                    signals.append(AgentSignal(
                        signal_type="FINANCIAL_DRAIN_WITHOUT_PHYSICAL_MOVEMENT",
                        description=f"Financial progress increased by {fin_delta:.1f}% while physical progress remained completely unchanged (0.0% delta)",
                        severity=Severity.CRITICAL if fin_delta >= 30.0 else Severity.HIGH,
                        value=fin_delta,
                        unit="%",
                        confidence=0.93,
                        expected_value="Physical progress increase aligned with financial disbursement",
                    ))
                    score += 45.0

        # Fallback for single or missing history on delayed projects
        elif twin.project_status == ProjectStatus.DELAYED and (twin.physical_progress or 0) < 50.0:
            signals.append(AgentSignal(
                signal_type="DELAYED_PROJECT_LOW_PROGRESS_TREND",
                description="Delayed project exhibits stagnant overall progress indicators",
                severity=Severity.MEDIUM,
                value=float(twin.physical_progress or 0),
                unit="%",
                confidence=0.75,
            ))
            score += 20.0

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
            data_sources=["progress_history", "digital_twin"],
        )
