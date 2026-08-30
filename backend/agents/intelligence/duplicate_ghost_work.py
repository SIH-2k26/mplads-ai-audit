"""
agents/intelligence/duplicate_ghost_work.py
Duplicate / Ghost Work Agent — multi-stage detection pipeline.

IMPORTANT:
- This agent produces CANDIDATES, not conclusions
- High similarity + same contractor + nearby location = strong indicator
- Final determination requires human investigation
"""
from __future__ import annotations
from typing import Any
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity


class DuplicateGhostWorkAgent(BaseAgent):
    agent_id = "duplicate_ghost_work_agent"
    agent_name = "Duplicate / Ghost Work Agent"
    version = "1.0.0"

    # Detection thresholds
    TEXT_SIMILARITY_THRESHOLD = 0.80     # 80% name similarity
    HIGH_SIMILARITY_THRESHOLD = 0.92     # 92%+ = strong candidate
    PROXIMITY_THRESHOLD_KM = 2.0         # Within 2km = nearby
    COST_SIMILARITY_THRESHOLD = 0.10     # Costs within 10% = similar

    def is_applicable(self, context: AgentContext) -> bool:
        # Applicable if we have graph data with similar projects
        return bool(context.similar_projects or context.graph_data)

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        similar_projects = context.similar_projects or []
        graph_data = context.graph_data or {}

        duplicate_candidates = graph_data.get("duplicate_candidates", [])
        ghost_indicators = graph_data.get("ghost_work_indicators", {})

        evidence.append(EvidenceDataPoint(
            label="Similar Projects Analyzed", value=len(similar_projects), source="graph_db"
        ))
        evidence.append(EvidenceDataPoint(
            label="Duplicate Candidates", value=len(duplicate_candidates), source="graph_db"
        ))

        # ── STEP 1: Text + Location Similarity candidates ──────────────────────
        for candidate in duplicate_candidates:
            text_sim = candidate.get("text_similarity", 0)
            loc_dist = candidate.get("location_distance_km")
            cost_sim = candidate.get("cost_similarity", 0)
            shared_contractor = candidate.get("same_contractor", False)
            shared_agency = candidate.get("same_agency", False)
            candidate_id = candidate.get("project_id", "UNKNOWN")

            if text_sim < self.TEXT_SIMILARITY_THRESHOLD:
                continue

            # Build strength score for this candidate
            candidate_strength = 0.0
            candidate_signals = []

            if text_sim >= self.HIGH_SIMILARITY_THRESHOLD:
                candidate_strength += 30.0
                candidate_signals.append(f"High name similarity ({text_sim:.0%})")
            else:
                candidate_strength += 15.0
                candidate_signals.append(f"Moderate name similarity ({text_sim:.0%})")

            if loc_dist is not None and loc_dist <= self.PROXIMITY_THRESHOLD_KM:
                candidate_strength += 25.0
                candidate_signals.append(f"Nearby location ({loc_dist:.1f}km)")

            if shared_contractor:
                candidate_strength += 20.0
                candidate_signals.append("Same contractor")

            if shared_agency:
                candidate_strength += 10.0
                candidate_signals.append("Same implementing agency")

            if abs(cost_sim) <= self.COST_SIMILARITY_THRESHOLD:
                candidate_strength += 10.0
                candidate_signals.append(f"Similar sanctioned amount ({cost_sim:.0%} difference)")

            if candidate_strength >= 40.0:
                severity = Severity.HIGH if candidate_strength >= 70 else Severity.MEDIUM
                signals.append(AgentSignal(
                    signal_type="POTENTIAL_DUPLICATE_PROJECT",
                    description=(
                        f"Potential duplicate project detected: {candidate_id}. "
                        f"Indicators: {', '.join(candidate_signals)}"
                    ),
                    severity=severity,
                    value={
                        "candidate_project_id": candidate_id,
                        "text_similarity": round(text_sim, 3),
                        "location_distance_km": loc_dist,
                        "shared_contractor": shared_contractor,
                        "shared_agency": shared_agency,
                    },
                    confidence=min(0.9, candidate_strength / 100),
                    metadata={"supporting_signals": candidate_signals},
                ))
                score += candidate_strength * 0.6  # Scale down — this is a signal

        # ── STEP 2: Ghost Work Indicators ─────────────────────────────────────
        # Payment without progress evidence
        payments_high = ghost_indicators.get("high_payments_low_progress", False)
        if payments_high:
            financial_prog = twin.financial_progress or 0
            physical_prog = twin.physical_progress or 0
            if financial_prog > 70 and physical_prog < 20:
                signals.append(AgentSignal(
                    signal_type="PAYMENT_WITHOUT_PHYSICAL_PROGRESS",
                    description=f"High financial progress ({financial_prog:.0f}%) with minimal physical progress ({physical_prog:.0f}%) — payment-progress mismatch indicator",
                    severity=Severity.HIGH,
                    value={"financial": financial_prog, "physical": physical_prog},
                    confidence=0.85,
                ))
                score += 30.0

        # No assets despite significant completion
        has_assets = len(twin.assets) > 0
        if twin.project_status.value == "COMPLETED" and not has_assets:
            signals.append(AgentSignal(
                signal_type="COMPLETED_WITHOUT_ASSET_RECORD",
                description="Project recorded as completed but no physical assets documented",
                severity=Severity.MEDIUM,
                value=None,
                confidence=0.6,
                metadata={"note": "Asset records may not have been ingested"},
            ))
            score += 15.0

        score = min(100.0, score)
        confidence = 0.75 if duplicate_candidates else 0.5

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
            data_sources=["graph_db", "project_record", "document_store"],
            recommendation=(
                "Potential duplicate or ghost work indicators detected. "
                "Field verification recommended before escalation."
                if score > 40 else None
            ),
        )
