"""
agents/intelligence/contractor_intelligence.py
Contractor Intelligence Agent — statistical signals about contractor performance.
Uses graph data + PostgreSQL historical data.
Returns risk SIGNALS — never labels a contractor as "corrupt".
"""
from __future__ import annotations
from typing import Any
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity


class ContractorIntelligenceAgent(BaseAgent):
    agent_id = "contractor_intelligence_agent"
    agent_name = "Contractor Intelligence Agent"
    version = "1.0.0"

    # Thresholds
    HIGH_PROJECT_COUNT = 20        # Contractor with >20 projects = concentration risk
    HIGH_DELAY_RATE = 0.40         # >40% projects delayed = elevated indicator
    HIGH_COST_DEVIATION = 0.25     # >25% average cost overrun = elevated indicator
    HIGH_AGENCY_CONCENTRATION = 3  # Same agency >3 times = concentration indicator

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return twin.contractor is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        contractor = twin.contractor
        if not contractor:
            return AgentEvidence.not_applicable(
                self.agent_id, self.agent_name, "No contractor associated with project"
            )

        contractor_name = contractor.contractor_name
        contractor_id = contractor.canonical_id or contractor.contractor_id

        evidence.append(EvidenceDataPoint(
            label="Contractor", value=contractor_name, source="project_record"
        ))

        # ── Graph-based signals ────────────────────────────────────────────────
        graph_data = context.graph_data or {}
        contractor_stats = graph_data.get("contractor_stats", {})

        project_count = contractor_stats.get("project_count", 0)
        total_value = contractor_stats.get("total_value", 0)
        delay_rate = contractor_stats.get("delay_rate", None)
        cost_deviation_rate = contractor_stats.get("cost_deviation_rate", None)
        agency_count = contractor_stats.get("agency_count", 0)
        district_count = contractor_stats.get("district_count", 0)
        repeat_agency_count = contractor_stats.get("max_repeat_agency", 0)

        evidence.extend([
            EvidenceDataPoint(label="Total Projects (historical)", value=project_count, source="graph_db"),
            EvidenceDataPoint(label="Total Contract Value (INR)", value=total_value, source="graph_db"),
            EvidenceDataPoint(label="Delay Rate", value=delay_rate, unit="%", source="graph_db"),
            EvidenceDataPoint(label="Cost Deviation Rate", value=cost_deviation_rate, unit="ratio", source="graph_db"),
            EvidenceDataPoint(label="Agencies Worked With", value=agency_count, source="graph_db"),
            EvidenceDataPoint(label="Districts Covered", value=district_count, source="graph_db"),
        ])

        # Project concentration
        if project_count > self.HIGH_PROJECT_COUNT:
            signals.append(AgentSignal(
                signal_type="CONTRACTOR_HIGH_PROJECT_COUNT",
                description=f"Contractor associated with {project_count} MPLADS projects — elevated concentration",
                severity=Severity.MEDIUM,
                value=project_count,
                unit="projects",
                confidence=0.85,
                metadata={"threshold": self.HIGH_PROJECT_COUNT},
            ))
            score += 10.0

        # Delay rate
        if delay_rate is not None:
            if delay_rate > self.HIGH_DELAY_RATE:
                signals.append(AgentSignal(
                    signal_type="CONTRACTOR_ELEVATED_DELAY_RATE",
                    description=f"Contractor's historical delay rate is {delay_rate:.1%} — elevated indicator",
                    severity=Severity.HIGH if delay_rate > 0.6 else Severity.MEDIUM,
                    value=delay_rate,
                    unit="ratio",
                    confidence=0.8,
                    expected_value=f"<{self.HIGH_DELAY_RATE:.0%}",
                ))
                score += 25.0 if delay_rate > 0.6 else 15.0

        # Cost deviation
        if cost_deviation_rate is not None:
            if cost_deviation_rate > self.HIGH_COST_DEVIATION:
                signals.append(AgentSignal(
                    signal_type="CONTRACTOR_ELEVATED_COST_DEVIATION",
                    description=f"Contractor's average cost overrun rate is {cost_deviation_rate:.1%} across projects",
                    severity=Severity.HIGH if cost_deviation_rate > 0.4 else Severity.MEDIUM,
                    value=cost_deviation_rate,
                    unit="ratio",
                    confidence=0.75,
                    expected_value=f"<{self.HIGH_COST_DEVIATION:.0%}",
                ))
                score += 20.0 if cost_deviation_rate > 0.4 else 10.0

        # Agency concentration (same contractor-agency pair repeated many times)
        if repeat_agency_count >= self.HIGH_AGENCY_CONCENTRATION:
            signals.append(AgentSignal(
                signal_type="CONTRACTOR_AGENCY_CONCENTRATION",
                description=f"Contractor has repeated associations with the same agency in {repeat_agency_count} projects",
                severity=Severity.MEDIUM,
                value=repeat_agency_count,
                unit="projects",
                confidence=0.8,
                metadata={"threshold": self.HIGH_AGENCY_CONCENTRATION},
            ))
            score += 15.0

        # ── Similar projects through graph ─────────────────────────────────────
        similar_projects = context.similar_projects or []
        contractor_projects = [
            p for p in similar_projects
            if "SAME_CONTRACTOR" in (p.get("relationship_type", "") or "")
        ]
        if len(contractor_projects) > 5:
            signals.append(AgentSignal(
                signal_type="MANY_RELATED_PROJECTS_SAME_CONTRACTOR",
                description=f"Contractor is associated with {len(contractor_projects)} similar projects in the graph",
                severity=Severity.LOW,
                value=len(contractor_projects),
                confidence=0.7,
            ))
            score += 5.0

        score = min(100.0, score)

        # Confidence reduces if we have little data
        confidence = 0.85 if project_count > 5 else 0.60

        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=confidence,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["graph_db", "project_record", "payment_records"],
            recommendation=(
                "Historical performance indicators suggest elevated attention for this contractor."
                if score > 30 else None
            ),
        )
