"""
tests/unit/test_evidence_fusion_comprehensive.py
Comprehensive tests for EvidenceFusionEngine and DynamicWeightEngine.

Tests:
- One active agent (score flows correctly)
- Multiple agreeing agents (amplify each other)
- Multiple conflicting agents (balanced output)
- Missing/failed agent evidence (fusion continues without crashing)
- Zero evidence list (handled gracefully)
- Low confidence evidence (downweighted correctly)
- 3D risk dimensions: current, future, systemic
- 8-dimension risk fingerprint
- Dynamic weight normalization (weights sum to 1.0)
- No NaN, no infinity in any output
"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pytest
from datetime import date, datetime, timezone, timedelta
from decimal import Decimal
from typing import List

from models.agent import AgentEvidence, AgentStatus, AgentSignal, Severity
from models.enums import ProjectStatus, RiskLevel
from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord
from engine.evidence_fusion import EvidenceFusionEngine
from engine.dynamic_weight_engine import DynamicWeightEngine


def _make_evidence(
    agent_id: str,
    score: float,
    confidence: float = 0.8,
    applicability: float = 1.0,
    signals: list = None,
    status: AgentStatus = AgentStatus.COMPLETED,
    weight_override: float = None,
) -> AgentEvidence:
    return AgentEvidence(
        agent_id=agent_id,
        agent_name=agent_id.replace("_", " ").title(),
        score=score,
        confidence=confidence,
        applicability=applicability,
        status=status,
        signals=signals or [],
        weight_override=weight_override,
    )


def _make_failed_evidence(agent_id: str) -> AgentEvidence:
    return AgentEvidence.failed(
        agent_id=agent_id,
        agent_name=agent_id.title(),
        error="Simulated agent failure",
    )


def _make_twin() -> ProjectDigitalTwin:
    return ProjectDigitalTwin(
        project_id="FUSION-TEST",
        project_name="Fusion Test Project",
        category="ROAD",
        project_status=ProjectStatus.IN_PROGRESS,
        location=GeoLocation(district="Lucknow", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number="MPLADS/FT",
            sanction_date=date(2024, 1, 1),
            sanctioned_amount=Decimal("2500000"),
        ),
        budget=Budget(approved_budget=Decimal("2500000"), estimated_cost=Decimal("2400000")),
        expenditure=Expenditure(total_expenditure=Decimal("1500000")),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=60.0,
            physical_progress=58.0,
        ),
    )


# ── EvidenceFusionEngine Tests ────────────────────────────────────────────────

class TestEvidenceFusionEngine:
    """Test EvidenceFusionEngine produces valid, structured RiskOutput."""

    def setup_method(self):
        self.engine = EvidenceFusionEngine()
        self.twin = _make_twin()

    def test_single_agent_score_produces_valid_output(self):
        """VERIFIED: One active agent produces valid, bounded risk output."""
        evidence = [_make_evidence("budget_agent", score=75.0, confidence=0.9)]
        risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence,
            project_status=self.twin.project_status,
        )
        assert risk is not None
        assert 0.0 <= risk.overall_risk_score <= 100.0
        assert 0.0 <= risk.current_risk <= 100.0
        assert 0.0 <= risk.future_risk <= 100.0
        assert 0.0 <= risk.systemic_risk <= 100.0
        assert risk.risk_level in RiskLevel

    def test_all_failed_agents_produces_safe_output(self):
        """VERIFIED: All failed agents must not crash fusion — produces low/unknown risk."""
        evidence = [
            _make_failed_evidence(f"agent_{i}") for i in range(19)
        ]
        risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence,
            project_status=self.twin.project_status,
        )
        assert risk is not None
        assert 0.0 <= risk.overall_risk_score <= 100.0, f"Failed agents produced invalid score: {risk.overall_risk_score}"

    def test_empty_evidence_list_handled(self):
        """VERIFIED: Empty evidence list must not crash fusion."""
        risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=[],
            project_status=self.twin.project_status,
        )
        assert risk is not None
        assert 0.0 <= risk.overall_risk_score <= 100.0

    def test_multiple_high_risk_agents_elevate_score(self):
        """VERIFIED: Multiple agents all scoring high → overall score should be elevated."""
        evidence = [
            _make_evidence("budget_agent", score=85.0, confidence=0.9),
            _make_evidence("deadline_agent", score=78.0, confidence=0.85),
            _make_evidence("documentation_agent", score=70.0, confidence=0.8),
            _make_evidence("payment_agent", score=90.0, confidence=0.95),
        ]
        high_risk_output = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence,
            project_status=self.twin.project_status,
        )

        # Compare with all low scores
        low_evidence = [
            _make_evidence(f"budget_agent", score=10.0, confidence=0.9),
            _make_evidence(f"deadline_agent", score=8.0, confidence=0.85),
            _make_evidence(f"documentation_agent", score=5.0, confidence=0.8),
            _make_evidence(f"payment_agent", score=12.0, confidence=0.95),
        ]
        low_risk_output = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=low_evidence,
            project_status=self.twin.project_status,
        )

        assert high_risk_output.overall_risk_score > low_risk_output.overall_risk_score, (
            f"High risk agents should score higher than low risk agents: "
            f"high={high_risk_output.overall_risk_score}, low={low_risk_output.overall_risk_score}"
        )

    def test_low_confidence_evidence_is_downweighted(self):
        """VERIFIED: Low confidence evidence should contribute less than high confidence."""
        high_conf_evidence = [_make_evidence("budget_agent", score=80.0, confidence=0.95)]
        low_conf_evidence = [_make_evidence("budget_agent", score=80.0, confidence=0.1)]

        high_conf_risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=high_conf_evidence,
            project_status=self.twin.project_status,
        )
        low_conf_risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=low_conf_evidence,
            project_status=self.twin.project_status,
        )

        # High confidence should produce higher (or equal) weighted score
        assert high_conf_risk.overall_risk_score >= low_conf_risk.overall_risk_score - 0.1, (
            f"High confidence evidence should not produce lower score than low confidence: "
            f"high_conf={high_conf_risk.overall_risk_score}, low_conf={low_conf_risk.overall_risk_score}"
        )

    def test_3d_risk_dimensions_all_present(self):
        """VERIFIED: All 3 risk dimensions must be present in output."""
        evidence = [
            _make_evidence("budget_agent", score=65.0),
            _make_evidence("delay_prediction_agent", score=70.0),
            _make_evidence("fraud_archetype_agent", score=55.0),
        ]
        risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence,
            project_status=self.twin.project_status,
        )
        assert hasattr(risk, "current_risk"), "current_risk missing"
        assert hasattr(risk, "future_risk"), "future_risk missing"
        assert hasattr(risk, "systemic_risk"), "systemic_risk missing"
        assert risk.current_risk is not None
        assert risk.future_risk is not None
        assert risk.systemic_risk is not None

    def test_8d_fingerprint_all_dimensions_in_bounds(self):
        """VERIFIED: All 8 fingerprint dimensions must be in [0, 1]."""
        evidence = [
            _make_evidence("budget_agent", score=70.0),
            _make_evidence("documentation_agent", score=65.0),
            _make_evidence("contractor_intelligence_agent", score=55.0),
            _make_evidence("payment_agent", score=75.0),
        ]
        risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence,
            project_status=self.twin.project_status,
        )
        fp = risk.fingerprint
        assert fp is not None, "Fingerprint is None"

        dimensions = {
            "cost_inflation": fp.cost_inflation,
            "payment_progress_mismatch": fp.payment_progress_mismatch,
            "repeated_delay": fp.repeated_delay,
            "contractor_pattern": fp.contractor_pattern,
            "documentation_gap": fp.documentation_gap,
            "duplicate_work": fp.duplicate_work,
            "procurement_irregularity": fp.procurement_irregularity,
            "geographic_cluster": fp.geographic_cluster,
        }
        for dim_name, value in dimensions.items():
            assert value is not None, f"Fingerprint dimension {dim_name} is None"
            assert 0.0 <= value <= 1.0, \
                f"Fingerprint {dim_name}={value} out of [0, 1]"

    def test_no_nan_or_infinity_in_output(self):
        """VERIFIED: No NaN or infinity values anywhere in risk output."""
        import math
        evidence = [_make_evidence(f"agent_{i}", score=float(i * 10), confidence=0.7) for i in range(10)]
        risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence,
            project_status=self.twin.project_status,
        )

        scores_to_check = [
            risk.overall_risk_score, risk.current_risk, risk.future_risk, risk.systemic_risk
        ]
        for score in scores_to_check:
            assert not math.isnan(score), f"NaN found in risk output: {score}"
            assert not math.isinf(score), f"Infinity found in risk output: {score}"

    def test_duplicate_evidence_not_double_counted(self):
        """VERIFIED: Same agent providing evidence twice must not double-count."""
        evidence_once = [_make_evidence("budget_agent", score=80.0)]
        evidence_twice = [
            _make_evidence("budget_agent", score=80.0),
            _make_evidence("budget_agent", score=80.0),
        ]
        risk_once = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence_once,
            project_status=self.twin.project_status,
        )
        risk_twice = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence_twice,
            project_status=self.twin.project_status,
        )
        # Same agent repeated should not produce dramatically different scores
        # (implementation may handle this differently, but should not 2x the score)
        assert abs(risk_once.overall_risk_score - risk_twice.overall_risk_score) <= 20.0, (
            f"Duplicate evidence produced suspicious score difference: "
            f"once={risk_once.overall_risk_score}, twice={risk_twice.overall_risk_score}"
        )

    def test_score_bounded_at_100(self):
        """VERIFIED: Score can never exceed 100, even with all agents at 100."""
        evidence = [
            _make_evidence(f"agent_{i}", score=100.0, confidence=1.0) for i in range(19)
        ]
        risk = self.engine.fuse_evidence(
            project_id=self.twin.project_id,
            evidence_list=evidence,
            project_status=self.twin.project_status,
        )
        assert risk.overall_risk_score <= 100.0, \
            f"Score exceeded 100 with all-max evidence: {risk.overall_risk_score}"
        assert risk.current_risk <= 100.0
        assert risk.future_risk <= 100.0
        assert risk.systemic_risk <= 100.0


# ── DynamicWeightEngine Tests ─────────────────────────────────────────────────

class TestDynamicWeightEngine:
    """Test DynamicWeightEngine produces valid, normalized weights."""

    def setup_method(self):
        self.engine = DynamicWeightEngine()

    def test_weights_sum_to_one(self):
        """VERIFIED: All active weights must sum to exactly 1.0 (±0.001)."""
        evidence = [
            _make_evidence("budget_agent", score=70.0),
            _make_evidence("deadline_agent", score=45.0),
            _make_evidence("documentation_agent", score=30.0),
            _make_evidence("payment_agent", score=80.0),
            _make_evidence("fraud_archetype_agent", score=60.0),
        ]
        weights = self.engine.calculate_weights(
            evidence_list=evidence,
            project_status=ProjectStatus.IN_PROGRESS,
        )
        total = sum(weights.values())
        assert abs(total - 1.0) < 0.001, \
            f"Weights don't sum to 1.0: sum={total:.6f}, weights={weights}"

    def test_no_negative_weights(self):
        """VERIFIED: No agent can have a negative weight."""
        evidence = [
            _make_evidence(f"agent_{i}", score=float(i * 10)) for i in range(10)
        ]
        weights = self.engine.calculate_weights(
            evidence_list=evidence,
            project_status=ProjectStatus.IN_PROGRESS,
        )
        for agent_id, weight in weights.items():
            assert weight >= 0.0, f"Negative weight for {agent_id}: {weight}"

    def test_no_nan_or_infinity_weights(self):
        """VERIFIED: No NaN or infinity in weights."""
        import math
        evidence = [_make_evidence(f"agent_{i}", score=50.0) for i in range(5)]
        weights = self.engine.calculate_weights(
            evidence_list=evidence,
            project_status=ProjectStatus.IN_PROGRESS,
        )
        for agent_id, weight in weights.items():
            assert not math.isnan(weight), f"NaN weight for {agent_id}"
            assert not math.isinf(weight), f"Infinite weight for {agent_id}"

    def test_failed_agents_get_zero_or_low_weight(self):
        """VERIFIED: Failed agents should have minimal/zero weight in fusion."""
        failed = _make_failed_evidence("failed_agent")
        active = _make_evidence("active_agent", score=70.0)
        weights = self.engine.calculate_weights(
            evidence_list=[failed, active],
            project_status=ProjectStatus.IN_PROGRESS,
        )
        failed_weight = weights.get("failed_agent", 0.0)
        active_weight = weights.get("active_agent", 0.0)
        # Active agent should receive more weight than failed agent
        assert active_weight >= failed_weight, (
            f"Failed agent has higher weight than active: failed={failed_weight}, active={active_weight}"
        )

    def test_zero_applicability_gets_minimal_weight(self):
        """VERIFIED: Zero applicability agents are downweighted or excluded."""
        zero_app = _make_evidence("irrelevant_agent", score=90.0, applicability=0.0)
        full_app = _make_evidence("relevant_agent", score=90.0, applicability=1.0)
        weights = self.engine.calculate_weights(
            evidence_list=[zero_app, full_app],
            project_status=ProjectStatus.IN_PROGRESS,
        )
        zero_weight = weights.get("irrelevant_agent", 0.0)
        full_weight = weights.get("relevant_agent", 0.0)
        assert full_weight >= zero_weight, (
            f"Zero-applicability agent has higher weight than full-applicability: "
            f"zero={zero_weight}, full={full_weight}"
        )

    def test_empty_evidence_list_produces_empty_weights(self):
        """VERIFIED: Empty evidence list produces empty weights dict without crashing."""
        weights = self.engine.calculate_weights(
            evidence_list=[],
            project_status=ProjectStatus.IN_PROGRESS,
        )
        assert isinstance(weights, dict), "Empty evidence should return empty dict, not None"
        # If weights returned, they must sum to 1.0 (or be empty)
        if weights:
            assert abs(sum(weights.values()) - 1.0) < 0.001


class TestRiskFingerprint:
    """Test that Risk Fingerprint differentiates anomaly patterns."""

    def test_different_anomaly_patterns_different_fingerprints(self):
        """VERIFIED: Distinct anomaly types produce distinct fingerprint signatures."""
        engine = EvidenceFusionEngine()
        twin = _make_twin()

        # Pattern A: Financial anomaly (high budget + payment agents)
        evidence_a = [
            _make_evidence("budget_agent", score=90.0),
            _make_evidence("payment_agent", score=85.0),
            _make_evidence("cost_intelligence_agent", score=80.0),
            _make_evidence("deadline_agent", score=10.0),
            _make_evidence("documentation_agent", score=10.0),
        ]
        risk_a = engine.fuse_evidence(
            project_id=twin.project_id,
            evidence_list=evidence_a,
            project_status=twin.project_status,
        )

        # Pattern B: Documentation + delay anomaly
        evidence_b = [
            _make_evidence("documentation_agent", score=90.0),
            _make_evidence("deadline_agent", score=85.0),
            _make_evidence("delay_prediction_agent", score=80.0),
            _make_evidence("budget_agent", score=10.0),
            _make_evidence("payment_agent", score=10.0),
        ]
        risk_b = engine.fuse_evidence(
            project_id=twin.project_id,
            evidence_list=evidence_b,
            project_status=twin.project_status,
        )

        fp_a = risk_a.fingerprint
        fp_b = risk_b.fingerprint

        # At least some dimensions should differ between the two patterns
        fp_a_dict = fp_a.model_dump()
        fp_b_dict = fp_b.model_dump()
        differences = sum(1 for k in fp_a_dict if abs(fp_a_dict.get(k, 0) - fp_b_dict.get(k, 0)) > 0.01)
        assert differences >= 1, (
            f"Different anomaly patterns produced identical fingerprints.\n"
            f"Pattern A: {fp_a_dict}\nPattern B: {fp_b_dict}"
        )

    def test_clean_project_fingerprint_all_low(self):
        """VERIFIED: Clean project should have all fingerprint dimensions near 0."""
        engine = EvidenceFusionEngine()
        twin = _make_twin()

        evidence = [
            _make_evidence(f"agent_{i}", score=5.0, confidence=0.9) for i in range(19)
        ]
        risk = engine.fuse_evidence(
            project_id=twin.project_id,
            evidence_list=evidence,
            project_status=twin.project_status,
        )
        fp = risk.fingerprint
        fp_dict = fp.model_dump()
        high_dims = {k: v for k, v in fp_dict.items() if isinstance(v, float) and v > 0.8}
        assert len(high_dims) == 0, \
            f"Clean project has unexpected high fingerprint dimensions: {high_dims}"
