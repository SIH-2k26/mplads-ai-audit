"""
engine/evidence_fusion.py
Evidence Fusion Engine — Part B.
Aggregates AgentEvidence from Part A & Part B agents into a unified 3D Risk Breakdown
(Current, Future, Systemic), generates an 8-dimensional RiskFingerprint, and returns RiskOutput.
"""
from __future__ import annotations
from datetime import datetime
from typing import Optional

from models.agent import AgentEvidence, AgentSignal
from models.enums import RiskLevel, Severity, ProjectStatus
from models.graph import GraphResult
from models.risk import RiskOutput, RiskFingerprint
from .dynamic_weight_engine import DynamicWeightEngine


# Agent grouping into 3 Risk Dimensions
CURRENT_RISK_AGENTS = {
    "payment_agent",
    "financial_progress_agent",
    "physical_progress_agent",
    "budget_agent",
    "cost_intelligence_agent",
    "data_quality_agent",
    "documentation_agent",
    "asset_completion_agent",
}

FUTURE_RISK_AGENTS = {
    "delay_prediction_agent",
    "trend_benchmark_agent",
    "deadline_agent",
    "anomaly_agent",
}

SYSTEMIC_RISK_AGENTS = {
    "contractor_intelligence_agent",
    "duplicate_ghost_work_agent",
    "geographic_intelligence_agent",
    "procurement_agent",
    "fraud_archetype_agent",
    "eligibility_agent",
    "rag_agent",
}


class EvidenceFusionEngine:
    """
    Fuses AgentEvidence from all system agents into a comprehensive RiskOutput.
    Computes 3D Risk (Current, Future, Systemic) and generates an 8D RiskFingerprint.
    """

    def __init__(self, weight_engine: Optional[DynamicWeightEngine] = None):
        self.weight_engine = weight_engine or DynamicWeightEngine()

    def fuse_evidence(
        self,
        project_id: str,
        evidence_list: list[AgentEvidence],
        graph_result: Optional[GraphResult] = None,
        project_status: Optional[ProjectStatus] = None,
    ) -> RiskOutput:
        """
        Main fusion entrypoint.
        Consumes evidence from Part A and Part B agents, computes dynamic weights,
        evaluates 3D risk dimensions, generates fingerprint, and returns RiskOutput.
        """
        # Step 1: Compute dynamic context-aware weights for all active agents
        weights = self.weight_engine.calculate_weights(evidence_list, project_status)

        # Lookup dict for efficient agent evidence score indexing
        evidence_map: dict[str, AgentEvidence] = {ev.agent_id: ev for ev in evidence_list}

        # Step 2: Compute 3D Risk Breakdown (Current, Future, Systemic)
        # Current Risk: Financial utilization, payment parking, physical gap, budget, cost deviation
        current_risk = self._compute_dimension_risk(CURRENT_RISK_AGENTS, evidence_map, weights)
        # Future Risk: Delay prediction, schedule deadline, trend stagnation, multivariate vector anomaly
        future_risk = self._compute_dimension_risk(FUTURE_RISK_AGENTS, evidence_map, weights)
        # Systemic Risk: Network relationship graph, contractor intelligence, duplicate work, archetype
        systemic_risk = self._compute_dimension_risk(SYSTEMIC_RISK_AGENTS, evidence_map, weights)

        # Incorporate Neo4j Knowledge Graph signals into Systemic Risk if available (CONTRACT 4)
        if graph_result and not graph_result.is_empty():
            systemic_risk = self._enrich_systemic_risk_with_graph(systemic_risk, graph_result)

        # Step 3: Overall Risk Synthesis & Severity Floor
        # Weighted synthesis: 45% Current + 35% Future + 20% Systemic
        weighted_overall = (0.45 * current_risk) + (0.35 * future_risk) + (0.20 * systemic_risk)

        # Severity floor enforcement: if any individual agent detected a critical score (>=85), floor overall risk
        max_agent_score = max([ev.score for ev in evidence_list if ev.is_applicable()], default=0.0)
        if max_agent_score >= 85.0:
            weighted_overall = max(weighted_overall, max_agent_score * 0.75)

        overall_risk_score = round(min(100.0, max(0.0, weighted_overall)), 2)
        risk_level = self._determine_risk_level(overall_risk_score)

        # Step 4: Generate 8D RiskFingerprint (Normalized 0.0 to 1.0)
        fingerprint = self._generate_risk_fingerprint(evidence_map)

        # Step 5: Extract Top Audit Signals
        top_signals = self._extract_top_signals(evidence_list)

        return RiskOutput(
            project_id=project_id,
            overall_risk_score=overall_risk_score,
            risk_level=risk_level,
            current_risk=round(current_risk, 2),
            future_risk=round(future_risk, 2),
            systemic_risk=round(systemic_risk, 2),
            fingerprint=fingerprint,
            top_signals=top_signals,
            computed_at=datetime.utcnow(),
            model_version="2.0.0",
        )

    def _compute_dimension_risk(
        self,
        dimension_agents: set[str],
        evidence_map: dict[str, AgentEvidence],
        weights: dict[str, float],
    ) -> float:
        """
        Computes weighted average score for a specific 3D risk dimension.
        """
        total_weighted_score = 0.0
        sum_weights = 0.0

        for agent_id in dimension_agents:
            if agent_id in evidence_map and agent_id in weights:
                ev = evidence_map[agent_id]
                w = weights[agent_id]
                if w > 0.0 and ev.is_applicable():
                    total_weighted_score += ev.score * w
                    sum_weights += w

        if sum_weights == 0.0:
            return 0.0

        return min(100.0, total_weighted_score / sum_weights)

    def _enrich_systemic_risk_with_graph(
        self, base_systemic_risk: float, graph_result: GraphResult
    ) -> float:
        """
        Enriches systemic risk score using Knowledge Graph network metrics (contractor density, cartels, split tendering).
        """
        boost = 0.0

        # Check contractor network strength
        for net_node in graph_result.contractor_network:
            if net_node.project_count >= 5:
                boost += 10.0
            if net_node.relationship_strength >= 0.7:
                boost += 15.0

        # Check geographic clusters
        if graph_result.geographic_clusters:
            boost += 10.0 * len(graph_result.geographic_clusters)

        # Check custom analytics signals in graph result
        signals = graph_result.signals or {}
        if signals.get("cartel_risk_flag"):
            boost += 25.0
        if signals.get("split_tendering_flag"):
            boost += 20.0

        return min(100.0, base_systemic_risk + boost)

    def _generate_risk_fingerprint(self, evidence_map: dict[str, AgentEvidence]) -> RiskFingerprint:
        """
        Maps agent scores into an 8-dimensional normalized RiskFingerprint (0.0 to 1.0 scale).
        """
        def get_norm_score(*agent_ids: str) -> float:
            scores = [evidence_map[aid].score for aid in agent_ids if aid in evidence_map and evidence_map[aid].is_applicable()]
            if not scores:
                return 0.0
            # Average score normalized to 0-1
            avg_score = sum(scores) / len(scores)
            return round(min(1.0, max(0.0, avg_score / 100.0)), 3)

        return RiskFingerprint(
            cost_inflation=get_norm_score("cost_intelligence_agent", "budget_agent"),
            payment_progress_mismatch=get_norm_score("physical_progress_agent", "financial_progress_agent", "payment_agent"),
            repeated_delay=get_norm_score("deadline_agent", "delay_prediction_agent", "trend_benchmark_agent"),
            contractor_pattern=get_norm_score("contractor_intelligence_agent", "fraud_archetype_agent"),
            documentation_gap=get_norm_score("documentation_agent", "asset_completion_agent", "data_quality_agent"),
            duplicate_work=get_norm_score("duplicate_ghost_work_agent", "rag_agent"),
            procurement_irregularity=get_norm_score("procurement_agent", "eligibility_agent"),
            geographic_cluster=get_norm_score("geographic_intelligence_agent", "anomaly_agent"),
        )

    def _extract_top_signals(self, evidence_list: list[AgentEvidence]) -> list[str]:
        """
        Extracts top human-readable signals from high and critical agent findings.
        """
        extracted: list[str] = []

        for ev in evidence_list:
            if not ev.is_applicable():
                continue

            for sig in ev.signals:
                if sig.severity in (Severity.CRITICAL, Severity.HIGH) or ev.score >= 30.0:
                    prefix = f"[{sig.severity.value}] {ev.agent_name}: "
                    extracted.append(f"{prefix}{sig.description}")

        # Sort by severity priority (CRITICAL > HIGH > MEDIUM > LOW)
        def severity_key(sig_str: str) -> int:
            if "[CRITICAL]" in sig_str:
                return 0
            if "[HIGH]" in sig_str:
                return 1
            if "[MEDIUM]" in sig_str:
                return 2
            return 3

        extracted.sort(key=severity_key)
        return extracted[:10]

    def _determine_risk_level(self, score: float) -> RiskLevel:
        """
        Maps overall risk score to qualitative RiskLevel enum.
        """
        if score >= 80.0:
            return RiskLevel.CRITICAL
        elif score >= 60.0:
            return RiskLevel.HIGH
        elif score >= 30.0:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW
