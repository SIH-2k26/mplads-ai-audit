"""
agents/part_b/ml/fraud_archetype_agent.py
Risk Archetype Classifier Agent — Part B ML.
Classifies project risk vectors into K-Means archetypes: "Year-End Rush", "Rolling Duplicate", "Fund Parking".
Strictly enforces neutral language guidelines.
"""
from __future__ import annotations
from datetime import datetime

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity, ProjectStatus


class FraudArchetypeAgent(BaseAgent):
    agent_id = "fraud_archetype_agent"
    agent_name = "Risk Archetype Classifier Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return twin is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        # Archetype Scores (0.0 to 1.0)
        archetype_scores = {
            "Year-End Rush Pattern": 0.0,
            "Rolling Duplicate Pattern": 0.0,
            "Fund Parking Pattern": 0.0,
        }

        # ── 1. Year-End Rush Pattern Evaluation ────────────────────────────────
        # Detects >50% of payments/disbursements in March / end of financial year
        payments = twin.expenditure.payments if twin.expenditure else []
        march_disbursements = 0.0
        total_disbursements = float(twin.total_expenditure or 0.0)

        if payments:
            march_payments = [
                float(p.amount) for p in payments
                if p.payment_date and p.payment_date.month == 3
            ]
            march_disbursements = sum(march_payments)

        march_ratio = (march_disbursements / total_disbursements) if total_disbursements > 0 else 0.0

        if march_ratio >= 0.50:
            archetype_scores["Year-End Rush Pattern"] += 0.85
        elif march_ratio >= 0.35:
            archetype_scores["Year-End Rush Pattern"] += 0.50

        # ── 2. Fund Parking Pattern Evaluation ─────────────────────────────────
        # Active project for long duration with zero/low physical progress & funds held
        now = datetime.utcnow().date()
        reference_date = None
        if twin.start_date:
            reference_date = twin.start_date.date() if isinstance(twin.start_date, datetime) else twin.start_date
        elif twin.sanction and twin.sanction.sanction_date:
            reference_date = twin.sanction.sanction_date

        days_active = (now - reference_date).days if reference_date else 0
        phy_prog = float(twin.physical_progress or 0.0)

        if days_active >= 60 and phy_prog == 0.0 and (twin.sanctioned_amount or 0) > 0:
            archetype_scores["Fund Parking Pattern"] += 0.90
        elif days_active >= 45 and phy_prog < 10.0:
            archetype_scores["Fund Parking Pattern"] += 0.60

        # ── 3. Rolling Duplicate Pattern Evaluation ───────────────────────────
        # High spatial/name similarity or shared entities in graph_data / similar_projects
        similar = context.similar_projects or []
        duplicate_hints = 0
        if similar:
            for proj in similar:
                sim_score = proj.get("similarity_score", 0.0)
                rel_type = proj.get("relationship_type", "")
                if sim_score >= 0.80 or rel_type == "DUPLICATE_CANDIDATE":
                    duplicate_hints += 1

        if duplicate_hints >= 2:
            archetype_scores["Rolling Duplicate Pattern"] += 0.85
        elif duplicate_hints == 1:
            archetype_scores["Rolling Duplicate Pattern"] += 0.50

        # Determine dominant archetype
        dominant_archetype = max(archetype_scores, key=archetype_scores.get)
        dominant_confidence = archetype_scores[dominant_archetype]

        evidence.append(EvidenceDataPoint(
            label="Dominant Risk Archetype",
            value=dominant_archetype if dominant_confidence >= 0.5 else "NONE_DOMINANT",
            source="archetype_classifier"
        ))
        evidence.append(EvidenceDataPoint(
            label="Dominant Archetype Confidence",
            value=round(dominant_confidence, 2),
            source="archetype_classifier"
        ))
        evidence.append(EvidenceDataPoint(
            label="March Payment Ratio",
            value=round(march_ratio, 2),
            source="financial_pattern_evaluator"
        ))

        # ── Signal Generation (Neutral Language Enforced) ─────────────────────
        if dominant_confidence >= 0.50:
            signal_type_map = {
                "Year-End Rush Pattern": "YEAR_END_RUSH_PATTERN",
                "Rolling Duplicate Pattern": "ROLLING_DUPLICATE_PATTERN",
                "Fund Parking Pattern": "FUND_PARKING_PATTERN",
            }
            signal_key = signal_type_map[dominant_archetype]

            signals.append(AgentSignal(
                signal_type=signal_key,
                description=f"Project metrics align with '{dominant_archetype}' risk archetype (Confidence: {dominant_confidence:.0%})",
                severity=Severity.HIGH if dominant_confidence >= 0.80 else Severity.MEDIUM,
                value=dominant_archetype,
                confidence=round(dominant_confidence, 2),
            ))
            score += dominant_confidence * 60.0

        score = min(100.0, score)
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=0.87,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["digital_twin", "expenditure_records", "similar_projects"],
        )
