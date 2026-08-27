"""
agents/part_b/ml/cost_intelligence_agent.py
Cost Intelligence & Peer Benchmark Agent — Part B ML/Statistical.
Evaluates cost deviations against regional/category peer distributions.
"""
from __future__ import annotations
from decimal import Decimal
import math

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity


# Baseline regional/category benchmarks (Median Cost in INR, StdDev in INR)
CATEGORY_BENCHMARKS = {
    "ROAD": {"median": 2_500_000, "std_dev": 1_000_000},
    "WATER": {"median": 1_500_000, "std_dev": 600_000},
    "EDUCATION": {"median": 3_000_000, "std_dev": 1_200_000},
    "HEALTH": {"median": 3_500_000, "std_dev": 1_500_000},
    "SANITATION": {"median": 1_000_000, "std_dev": 400_000},
    "COMMUNITY_HALL": {"median": 2_000_000, "std_dev": 800_000},
    "OTHER": {"median": 2_000_000, "std_dev": 1_000_000},
}


class CostIntelligenceAgent(BaseAgent):
    agent_id = "cost_intelligence_agent"
    agent_name = "Cost Intelligence & Peer Benchmark Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return twin is not None and (
            (twin.sanctioned_amount is not None and twin.sanctioned_amount > 0)
            or (twin.total_expenditure is not None and twin.total_expenditure > 0)
        )

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        sanctioned = float(twin.sanctioned_amount or 0)
        expenditure = float(twin.total_expenditure or 0)
        effective_cost = expenditure if expenditure > 0 else sanctioned
        category = (twin.category or "OTHER").upper()

        benchmark = CATEGORY_BENCHMARKS.get(category, CATEGORY_BENCHMARKS["OTHER"])
        
        # Override with dynamic peer values if provided in context
        similar = context.similar_projects or []
        if similar:
            peer_costs = [p.get("sanctioned_amount", benchmark["median"]) for p in similar if p.get("sanctioned_amount")]
            if len(peer_costs) >= 3:
                median = float(sorted(peer_costs)[len(peer_costs) // 2])
                variance = sum((x - median) ** 2 for x in peer_costs) / len(peer_costs)
                std_dev = math.sqrt(variance) or benchmark["std_dev"]
                benchmark = {"median": median, "std_dev": std_dev}

        median_cost = benchmark["median"]
        std_dev = benchmark["std_dev"]

        # Z-score & Cost Ratio Calculation
        z_score = (effective_cost - median_cost) / std_dev if std_dev > 0 else 0.0
        cost_ratio = effective_cost / median_cost if median_cost > 0 else 1.0

        evidence.append(EvidenceDataPoint(
            label="Project Effective Cost (INR)",
            value=effective_cost,
            source="sanction_or_expenditure"
        ))
        evidence.append(EvidenceDataPoint(
            label="Category Peer Median Cost (INR)",
            value=median_cost,
            source="benchmark_database"
        ))
        evidence.append(EvidenceDataPoint(
            label="Cost Z-Score",
            value=round(z_score, 2),
            source="peer_distribution_model"
        ))
        evidence.append(EvidenceDataPoint(
            label="Cost Ratio vs Peer Median",
            value=round(cost_ratio, 2),
            source="peer_distribution_model"
        ))

        # ── Peer Deviation Signal Rules ────────────────────────────────────────
        if z_score >= 3.0 or cost_ratio >= 2.5:
            signals.append(AgentSignal(
                signal_type="EXTREME_REGIONAL_COST_DEVIATION",
                description=f"Project cost ({effective_cost:,.0f} INR) is {cost_ratio:.1f}x the regional benchmark median (Z-score: {z_score:.2f})",
                severity=Severity.CRITICAL,
                value=round(z_score, 2),
                unit="z_score",
                confidence=0.92,
                expected_value=f"Within 2.0 std dev of median ({median_cost:,.0f} INR)",
            ))
            score += 55.0
        elif z_score >= 2.0 or cost_ratio >= 1.8:
            signals.append(AgentSignal(
                signal_type="HIGH_REGIONAL_COST_DEVIATION",
                description=f"Project cost ({effective_cost:,.0f} INR) significantly exceeds regional category median by {cost_ratio:.1f}x (Z-score: {z_score:.2f})",
                severity=Severity.HIGH,
                value=round(z_score, 2),
                unit="z_score",
                confidence=0.87,
                expected_value=f"Within 2.0 std dev of median ({median_cost:,.0f} INR)",
            ))
            score += 35.0

        elif z_score <= -2.0 or cost_ratio <= 0.3:
            signals.append(AgentSignal(
                signal_type="ABNORMALLY_LOW_COST_ESTIMATE",
                description=f"Project cost ({effective_cost:,.0f} INR) is abnormally lower ({cost_ratio:.2f}x) than category benchmark median, risking unfeasible delivery",
                severity=Severity.MEDIUM,
                value=round(z_score, 2),
                unit="z_score",
                confidence=0.80,
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
            data_sources=["digital_twin", "category_benchmarks", "similar_projects"],
        )
