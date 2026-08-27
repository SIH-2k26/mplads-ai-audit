"""
agents/deterministic/eligibility.py
Eligibility Agent — checks project eligibility against policy rules.
Uses the Policy Engine — does NOT hardcode rules.
"""
from __future__ import annotations
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, PolicyRuleStatus, Severity


# Categories permitted under MPLADS (from policy — loaded dynamically in production)
PERMITTED_CATEGORIES_DEFAULT = {
    "ROAD", "WATER", "SANITATION", "EDUCATION", "HEALTH",
    "SPORTS", "CULTURE", "RURAL_DEVELOPMENT", "URBAN_DEVELOPMENT",
    "ELECTRICITY", "ENVIRONMENT",
}

# Minimum sanctioned amount (₹ — policy-defined)
MIN_SANCTION_AMOUNT = 100_000  # ₹1,00,000


class EligibilityAgent(BaseAgent):
    agent_id = "eligibility_agent"
    agent_name = "Eligibility Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        # Always check eligibility if we have basic project info
        return bool(twin.project_name)

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        # ── Use Policy Engine rules if available from context ─────────────────
        policy_rules = context.policy_rules or []

        if policy_rules:
            # Policy-driven evaluation (full evaluation)
            for rule_eval in policy_rules:
                if rule_eval.get("status") == PolicyRuleStatus.FAIL.value:
                    sev_str = rule_eval.get("severity", "MEDIUM")
                    severity = Severity[sev_str] if sev_str in Severity.__members__ else Severity.MEDIUM
                    signals.append(AgentSignal(
                        signal_type="POLICY_RULE_VIOLATION",
                        description=f"Policy rule violated: {rule_eval.get('rule_name', 'Unknown')}",
                        severity=severity,
                        value=rule_eval.get("explanation"),
                        confidence=rule_eval.get("confidence", 0.8),
                        metadata={"rule_id": rule_eval.get("rule_id"), "source": rule_eval.get("source_reference")},
                    ))
                    score += 20.0 if severity == Severity.HIGH else 10.0
        else:
            # Fallback: basic eligibility checks without policy engine
            self._basic_eligibility_checks(twin, signals, evidence, score_ref := [score])
            score = score_ref[0]

        # ── Category check ────────────────────────────────────────────────────
        category = twin.category
        if category:
            evidence.append(EvidenceDataPoint(label="Project Category", value=category, source="project_record"))
            if category.upper() not in PERMITTED_CATEGORIES_DEFAULT:
                signals.append(AgentSignal(
                    signal_type="UNUSUAL_CATEGORY",
                    description=f"Category '{category}' is not in the standard permitted categories list",
                    severity=Severity.MEDIUM,
                    value=category,
                    confidence=0.7,
                    metadata={"permitted": list(PERMITTED_CATEGORIES_DEFAULT)[:5]},
                ))
                score += 15.0
        else:
            signals.append(AgentSignal(
                signal_type="MISSING_CATEGORY",
                description="Project category is not specified",
                severity=Severity.MEDIUM,
                value=None,
                confidence=1.0,
            ))
            score += 10.0

        # ── Sanction amount check ─────────────────────────────────────────────
        sanctioned = twin.sanctioned_amount
        if sanctioned is not None:
            evidence.append(EvidenceDataPoint(label="Sanctioned Amount (INR)", value=float(sanctioned), source="sanction_record"))
            if float(sanctioned) < MIN_SANCTION_AMOUNT:
                signals.append(AgentSignal(
                    signal_type="BELOW_MINIMUM_SANCTION",
                    description=f"Sanctioned amount (₹{float(sanctioned):,.0f}) is below minimum threshold (₹{MIN_SANCTION_AMOUNT:,})",
                    severity=Severity.LOW,
                    value=float(sanctioned),
                    unit="INR",
                    confidence=0.9,
                ))
                score += 5.0

        # ── Location check ─────────────────────────────────────────────────────
        if not twin.location or not twin.location.state:
            signals.append(AgentSignal(
                signal_type="MISSING_LOCATION",
                description="Project location (state/district) is not specified",
                severity=Severity.MEDIUM,
                value=None,
                confidence=1.0,
            ))
            score += 10.0
        else:
            evidence.append(EvidenceDataPoint(
                label="Location",
                value=f"{twin.location.district}, {twin.location.state}",
                source="project_record",
            ))

        score = min(100.0, score)
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=0.85 if not policy_rules else 0.95,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["project_record", "policy_engine", "sanction_record"],
        )

    def _basic_eligibility_checks(self, twin, signals, evidence, score_ref: list):
        """Minimal fallback checks when policy engine is not available."""
        if not twin.sanction:
            signals.append(AgentSignal(
                signal_type="MISSING_SANCTION",
                description="No sanction record found for this project",
                severity=Severity.HIGH,
                value=None,
                confidence=0.9,
            ))
            score_ref[0] += 20.0
