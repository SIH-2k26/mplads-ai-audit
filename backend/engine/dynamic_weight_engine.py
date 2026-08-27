"""
engine/dynamic_weight_engine.py
Dynamic Weight Engine — Part B.
Calculates context-aware normalized weights for all 19 system agents (9 Part A + 10 Part B).
Handles lifecycle stage redistribution when agents are not applicable.
"""
from __future__ import annotations
from typing import Optional

from models.agent import AgentEvidence
from models.enums import AgentStatus, ProjectStatus


# Baseline weights for all 19 agents (sum = 1.00)
DEFAULT_BASE_WEIGHTS: dict[str, float] = {
    # Part A Agents (9)
    "data_quality_agent": 0.04,
    "eligibility_agent": 0.05,
    "budget_agent": 0.07,
    "deadline_agent": 0.06,
    "documentation_agent": 0.05,
    "procurement_agent": 0.06,
    "contractor_intelligence_agent": 0.06,
    "geographic_intelligence_agent": 0.04,
    "duplicate_ghost_work_agent": 0.06,
    # Part B Agents (10)
    "payment_agent": 0.07,
    "financial_progress_agent": 0.06,
    "physical_progress_agent": 0.07,
    "asset_completion_agent": 0.04,
    "cost_intelligence_agent": 0.06,
    "anomaly_agent": 0.05,
    "delay_prediction_agent": 0.06,
    "trend_benchmark_agent": 0.05,
    "fraud_archetype_agent": 0.06,
    "rag_agent": 0.05,
}


class DynamicWeightEngine:
    """
    Computes context-aware dynamic weights for all 19 agents.
    Adjusted Weight = Base Weight * Applicability * Confidence.
    Redistributes weight across active agents based on project lifecycle stage.
    """

    def __init__(self, base_weights: Optional[dict[str, float]] = None):
        self.base_weights = base_weights or DEFAULT_BASE_WEIGHTS.copy()

    def get_base_weights(self) -> dict[str, float]:
        return self.base_weights.copy()

    def calculate_weights(
        self,
        evidence_list: list[AgentEvidence],
        project_status: Optional[ProjectStatus] = None,
    ) -> dict[str, float]:
        """
        Compute normalized dynamic weights for the provided evidence list.
        Returns dict mapping agent_id -> normalized_weight (sum = 1.0).
        """
        if not evidence_list:
            return {}

        raw_weights: dict[str, float] = {}

        for ev in evidence_list:
            agent_id = ev.agent_id
            base = self.base_weights.get(agent_id, 0.05)

            # Check agent execution status & applicability
            if ev.status == AgentStatus.COMPLETED and ev.applicability > 0.0:
                adjusted = base * ev.applicability * max(0.1, ev.confidence)
            else:
                adjusted = 0.0

            raw_weights[agent_id] = adjusted

        # ── Lifecycle Stage Redistribution Multipliers ────────────────────────
        if project_status:
            multipliers = self._get_stage_multipliers(project_status)
            for agent_id in raw_weights:
                if raw_weights[agent_id] > 0.0 and agent_id in multipliers:
                    raw_weights[agent_id] *= multipliers[agent_id]

        # ── Normalization ─────────────────────────────────────────────────────
        total_raw = sum(raw_weights.values())

        if total_raw == 0.0:
            # If all agents are inactive, return zero weights
            return {ev.agent_id: 0.0 for ev in evidence_list}

        normalized_weights: dict[str, float] = {
            agent_id: round(w / total_raw, 4)
            for agent_id, w in raw_weights.items()
        }

        # Fine-tune rounding difference to guarantee exact sum of 1.0
        diff = 1.0 - sum(normalized_weights.values())
        if abs(diff) > 1e-6 and normalized_weights:
            max_agent = max(normalized_weights, key=normalized_weights.get)
            normalized_weights[max_agent] = round(normalized_weights[max_agent] + diff, 4)

        return normalized_weights

    def _get_stage_multipliers(self, status: ProjectStatus) -> dict[str, float]:
        """
        Returns stage-specific weight multipliers to emphasize relevant risk factors
        during different phases of the project lifecycle.
        """
        if status in (ProjectStatus.PROPOSED, ProjectStatus.SANCTIONED):
            return {
                "eligibility_agent": 1.5,
                "procurement_agent": 1.4,
                "budget_agent": 1.4,
                "cost_intelligence_agent": 1.4,
                "duplicate_ghost_work_agent": 1.3,
                "rag_agent": 1.2,
            }
        elif status in (ProjectStatus.IN_PROGRESS, ProjectStatus.DELAYED):
            return {
                "payment_agent": 1.4,
                "financial_progress_agent": 1.4,
                "physical_progress_agent": 1.5,
                "deadline_agent": 1.4,
                "delay_prediction_agent": 1.5,
                "trend_benchmark_agent": 1.4,
                "anomaly_agent": 1.2,
            }
        elif status == ProjectStatus.COMPLETED:
            return {
                "asset_completion_agent": 1.6,
                "documentation_agent": 1.5,
                "data_quality_agent": 1.3,
                "fraud_archetype_agent": 1.4,
                "contractor_intelligence_agent": 1.3,
            }
        return {}
