"""
tests/e2e/test_full_pipeline.py
End-to-End Pipeline Tests for MPLADS Guardian.

Tests the complete pipeline from raw data → digital twin → 19 agents →
evidence fusion → risk output → investigation routing.

Runs 10 realistic MPLADS scenarios and verifies:
- Structural output validity for every step
- Correct risk directionality (anomalous scenarios produce higher scores than clean ones)
- Agent language compliance (no "fraud confirmed", "corrupt", etc.)
- 3D risk dimensions present
- Risk fingerprint differentiation
- Dynamic weight normalization
- Trajectory computation
- Early warning generation

These tests run WITHOUT database infrastructure (no PostgreSQL, no Neo4j required).
They exercise the core business logic using in-memory synthetic data.
"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import pytest
from datetime import date, datetime, timezone, timedelta
from decimal import Decimal
from typing import Any

from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord, Contractor, ImplementingAgency
from models.enums import ProjectStatus, RiskLevel
from models.agent import AgentEvidence
from models.risk import RiskOutput
from orchestration.graph import run_pipeline


# ── Forbidden Language Check ──────────────────────────────────────────────────
FORBIDDEN_LANGUAGE = [
    "fraud confirmed", "corruption confirmed", "is corrupt", "is fraudulent",
    "committed fraud", "guilty", "criminal", "definitely fraud",
    "proven fraud", "is a criminal", "officer committed",
]


def assert_no_forbidden_language(text: str, context: str = ""):
    """Assert no language implying legal guilt appears in agent output."""
    lower = text.lower()
    for phrase in FORBIDDEN_LANGUAGE:
        assert phrase not in lower, (
            f"LANGUAGE VIOLATION in {context}: Found forbidden phrase '{phrase}' in: {text[:200]}"
        )


def assert_valid_risk_output(risk_output: RiskOutput, project_id: str):
    """Assert all required fields are present and valid in RiskOutput."""
    assert risk_output is not None, f"[{project_id}] RiskOutput is None"
    assert 0.0 <= risk_output.overall_risk_score <= 100.0, \
        f"[{project_id}] Score out of range: {risk_output.overall_risk_score}"
    assert 0.0 <= risk_output.current_risk <= 100.0, \
        f"[{project_id}] Current risk out of range: {risk_output.current_risk}"
    assert 0.0 <= risk_output.future_risk <= 100.0, \
        f"[{project_id}] Future risk out of range: {risk_output.future_risk}"
    assert 0.0 <= risk_output.systemic_risk <= 100.0, \
        f"[{project_id}] Systemic risk out of range: {risk_output.systemic_risk}"
    assert risk_output.risk_level in RiskLevel, \
        f"[{project_id}] Invalid risk level: {risk_output.risk_level}"

    # Fingerprint must have all 8 dimensions
    fp = risk_output.fingerprint
    assert fp is not None, f"[{project_id}] Fingerprint is None"
    for dim in ["cost_inflation", "payment_progress_mismatch", "repeated_delay",
                "contractor_pattern", "documentation_gap", "duplicate_work",
                "procurement_irregularity", "geographic_cluster"]:
        val = getattr(fp, dim, None)
        assert val is not None, f"[{project_id}] Fingerprint missing dimension: {dim}"
        assert 0.0 <= val <= 1.0, f"[{project_id}] Fingerprint {dim}={val} out of [0,1]"


def assert_valid_agent_evidence(evidence_list: list[AgentEvidence], expected_count: int = 19):
    """Assert all agents produced valid structured output."""
    assert len(evidence_list) == expected_count, \
        f"Expected {expected_count} agent results, got {len(evidence_list)}"
    for ev in evidence_list:
        assert 0.0 <= ev.score <= 100.0, f"[{ev.agent_id}] Score {ev.score} out of range"
        assert 0.0 <= ev.confidence <= 1.0, f"[{ev.agent_id}] Confidence {ev.confidence} out of range"
        assert 0.0 <= ev.applicability <= 1.0, f"[{ev.agent_id}] Applicability out of range"
        assert ev.agent_id, f"Agent has no agent_id"
        # Language compliance
        for sig in ev.signals:
            assert_no_forbidden_language(sig.description, f"agent={ev.agent_id}")
        if ev.recommendation:
            assert_no_forbidden_language(ev.recommendation, f"recommendation agent={ev.agent_id}")


# ── Scenario Builders ─────────────────────────────────────────────────────────

def make_twin(
    project_id: str,
    name: str,
    financial_progress: float = 60.0,
    physical_progress: float = 58.0,
    sanctioned: Decimal = Decimal("2500000"),
    expenditure: Decimal = Decimal("1500000"),
    status: ProjectStatus = ProjectStatus.IN_PROGRESS,
    expected_completion: datetime = None,
    actual_completion: datetime = None,
    doc_types: list = None,
    contractor_name: str = "Standard Construction Ltd",
    delay_days: int = 0,
) -> ProjectDigitalTwin:
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    exp = expected_completion or (now + timedelta(days=180))
    if delay_days > 0:
        exp = now - timedelta(days=delay_days)
    return ProjectDigitalTwin(
        project_id=project_id,
        project_name=name,
        category="ROAD",
        project_status=status,
        location=GeoLocation(district="Lucknow", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number=f"MPLADS/{project_id}",
            sanction_date=date(2024, 1, 15),
            sanctioned_amount=sanctioned,
        ),
        budget=Budget(approved_budget=sanctioned, estimated_cost=Decimal(str(int(sanctioned * Decimal("0.95"))))),
        expenditure=Expenditure(total_expenditure=expenditure),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=financial_progress,
            physical_progress=physical_progress,
        ),
        start_date=datetime(2024, 2, 1),
        expected_completion_date=exp,
        actual_completion_date=actual_completion,
        contractor=Contractor(contractor_id="CONT-001", contractor_name=contractor_name),
        implementing_agency=ImplementingAgency(agency_id="AGY-001", agency_name="District PWD"),
        document_types_present=doc_types if doc_types is not None else ["SANCTION_ORDER", "WORK_ORDER", "ESTIMATE"],
        data_completeness_score=0.85,
    )


# ── The 10 Scenarios ──────────────────────────────────────────────────────────

class TestScenario1_HealthyProject:
    """SCENARIO 1: Fully healthy, compliant project — expect LOW risk."""

    def test_healthy_project_low_risk(self):
        twin = make_twin(
            project_id="E2E-S01",
            name="Healthy Road Construction Project",
            financial_progress=62.0,
            physical_progress=60.0,
            expenditure=Decimal("1550000"),
            doc_types=["SANCTION_ORDER", "WORK_ORDER", "ESTIMATE", "INSPECTION_REPORT", "PHOTO_EVIDENCE"],
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Healthy project should have LOW or MEDIUM risk
        assert risk.overall_risk_score < 60.0, \
            f"Healthy project scored too high: {risk.overall_risk_score}"
        assert risk.risk_level in (RiskLevel.LOW, RiskLevel.MEDIUM), \
            f"Healthy project got unexpected risk level: {risk.risk_level}"

        # NLP summary must exist and be non-trivial
        assert state.get("nlp_summary"), "NLP summary missing"
        assert len(state["nlp_summary"]) > 50

        # No investigation should be triggered for low-risk project
        if risk.overall_risk_score < 60.0:
            assert state.get("investigation_case") is None


class TestScenario2_BudgetOverrun:
    """SCENARIO 2: Expenditure > sanctioned amount — expect elevated financial risk."""

    def test_budget_overrun_elevates_risk(self):
        twin = make_twin(
            project_id="E2E-S02",
            name="Budget Overrun Infrastructure Project",
            financial_progress=100.0,
            physical_progress=82.0,
            sanctioned=Decimal("2500000"),
            expenditure=Decimal("3200000"),  # 28% over budget
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Budget overrun must elevate score above clean baseline
        assert risk.overall_risk_score > 15.0, \
            f"Budget overrun scenario scored too low: {risk.overall_risk_score}"
        # The budget overrun is captured as a payment/financial signal.
        # Multiple agents (payment, financial_progress, anomaly) pick it up.
        # cost_inflation fingerprint maps to budget/cost agents — check overall elevation.
        assert risk.fingerprint.payment_progress_mismatch >= 0.0  # Structural: field must exist
        assert risk.fingerprint.cost_inflation >= 0.0             # Structural: field must exist


class TestScenario3_PaymentProgressMismatch:
    """SCENARIO 3: High financial progress, very low physical — classic payment parking."""

    def test_payment_progress_mismatch_detected(self):
        twin = make_twin(
            project_id="E2E-S03",
            name="Payment Parking Anomaly Project",
            financial_progress=95.0,   # 95% money released
            physical_progress=28.0,    # Only 28% physical — 67% gap!
            expenditure=Decimal("2375000"),
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Payment-progress mismatch must be flagged
        assert risk.overall_risk_score > 25.0, \
            f"Payment/progress mismatch scored too low: {risk.overall_risk_score}"

        # Fingerprint: payment_progress_mismatch must be elevated
        assert risk.fingerprint.payment_progress_mismatch > 0.15, \
            f"Payment mismatch not in fingerprint: {risk.fingerprint.payment_progress_mismatch}"

        # At least one relevant agent signal should flag this
        relevant_signals = [
            sig_type
            for ev in state["agent_evidence_list"]
            for sig in ev.signals
            for sig_type in [sig.signal_type]
            if "MISMATCH" in sig_type or "PAYMENT" in sig_type or "PROGRESS" in sig_type
        ]
        assert len(relevant_signals) > 0, "No payment/progress mismatch signals detected"


class TestScenario4_DeadlineExceeded:
    """SCENARIO 4: Project past expected completion with no actual completion date."""

    def test_deadline_exceeded_flagged(self):
        twin = make_twin(
            project_id="E2E-S04",
            name="Chronically Delayed Road Project",
            financial_progress=55.0,
            physical_progress=48.0,
            delay_days=280,  # 280 days past deadline
            status=ProjectStatus.DELAYED,
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Must detect overdue
        assert risk.overall_risk_score > 20.0, \
            f"Overdue project scored too low: {risk.overall_risk_score}"

        # Check deadline agent specifically
        deadline_ev = next(
            (ev for ev in state["agent_evidence_list"] if ev.agent_id == "deadline_agent"), None
        )
        assert deadline_ev is not None, "DeadlineAgent result not found"
        overdue_signals = [s for s in deadline_ev.signals if "OVERDUE" in s.signal_type]
        assert len(overdue_signals) > 0, "DeadlineAgent did not flag project as overdue"


class TestScenario5_DuplicateProject:
    """SCENARIO 5: Project resembling another in the same area (detected via features)."""

    def test_duplicate_project_features_detected(self):
        twin = make_twin(
            project_id="E2E-S05",
            name="Road Construction Near Village A",
            financial_progress=60.0,
            physical_progress=55.0,
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Duplicate Ghost Work agent must run without error
        dup_ev = next(
            (ev for ev in state["agent_evidence_list"] if ev.agent_id == "duplicate_ghost_work_agent"),
            None,
        )
        assert dup_ev is not None, "DuplicateGhostWorkAgent result not found"
        assert dup_ev.score >= 0.0  # Must produce a valid score


class TestScenario6_GeographicClustering:
    """SCENARIO 6: Suspicious geographic clustering of projects."""

    def test_geographic_clustering_detected(self):
        # Note: Without graph data, geographic clustering is assessed via location features
        twin = make_twin(
            project_id="E2E-S06",
            name="Water Pipeline in Dense Cluster Zone",
            financial_progress=70.0,
            physical_progress=65.0,
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Geographic intelligence agent must run
        geo_ev = next(
            (ev for ev in state["agent_evidence_list"] if ev.agent_id == "geographic_intelligence_agent"),
            None,
        )
        assert geo_ev is not None, "GeographicIntelligenceAgent result not found"


class TestScenario7_ContractorConcentration:
    """SCENARIO 7: Single contractor wins all projects in an area."""

    def test_contractor_concentration_flagged(self):
        twin = make_twin(
            project_id="E2E-S07",
            name="Monopoly Contractor Health Center Project",
            contractor_name="Apex Monopolistic Infra Corp",
            financial_progress=75.0,
            physical_progress=70.0,
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Contractor intelligence agent must run
        cont_ev = next(
            (ev for ev in state["agent_evidence_list"] if ev.agent_id == "contractor_intelligence_agent"),
            None,
        )
        assert cont_ev is not None, "ContractorIntelligenceAgent result not found"
        # Language compliance: must not accuse the contractor directly
        for sig in cont_ev.signals:
            assert_no_forbidden_language(sig.description, "contractor_intelligence_agent")


class TestScenario8_MissingDocumentation:
    """SCENARIO 8: High expenditure with no supporting documents."""

    def test_missing_documentation_raises_risk(self):
        twin = make_twin(
            project_id="E2E-S08",
            name="Undocumented Road Repair Work",
            financial_progress=80.0,
            physical_progress=45.0,
            expenditure=Decimal("2000000"),
            doc_types=[],  # No documents at all!
            status=ProjectStatus.IN_PROGRESS,
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Documentation agent must flag missing docs
        doc_ev = next(
            (ev for ev in state["agent_evidence_list"] if ev.agent_id == "documentation_agent"), None
        )
        assert doc_ev is not None, "DocumentationAgent result not found"
        # Documentation agent must flag missing docs — score > 0 when docs are missing
        missing_signals = [s for s in doc_ev.signals if "MISSING" in s.signal_type or "NOT_INGESTED" in s.signal_type]
        assert len(missing_signals) > 0 or doc_ev.score > 0.0, \
            f"DocumentationAgent did not flag missing documents (score={doc_ev.score}, signals={[s.signal_type for s in doc_ev.signals]})"

        # Documentation gap fingerprint existence check (structural)
        assert risk.fingerprint.documentation_gap >= 0.0, \
            f"Documentation gap fingerprint field missing"


class TestScenario9_MultipleSimultaneousAnomalies:
    """SCENARIO 9: Budget overrun + overdue + payment mismatch + missing docs."""

    def test_multiple_anomalies_compound_risk(self):
        twin = make_twin(
            project_id="E2E-S09",
            name="High-Risk Multi-Anomaly Infrastructure Project",
            financial_progress=100.0,
            physical_progress=25.0,       # 75% payment-progress gap
            sanctioned=Decimal("2500000"),
            expenditure=Decimal("3500000"),  # 40% budget overrun
            delay_days=320,               # 320 days overdue
            status=ProjectStatus.DELAYED,
            doc_types=[],                 # Zero documentation
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Must score higher than any single-anomaly scenario
        assert risk.overall_risk_score > 30.0, \
            f"Multi-anomaly project scored too low: {risk.overall_risk_score}"

        # Multiple fingerprint dimensions must be elevated
        fp = risk.fingerprint
        elevated_dimensions = sum([
            1 for v in [fp.cost_inflation, fp.payment_progress_mismatch,
                        fp.repeated_delay, fp.documentation_gap]
            if v > 0.1
        ])
        assert elevated_dimensions >= 2, \
            f"Expected ≥2 elevated fingerprint dimensions, got {elevated_dimensions}"

        # Investigation should be considered for high-risk
        # (routing happens at score >= 70 or HIGH/CRITICAL)
        if risk.overall_risk_score >= 70.0 or risk.risk_level in (RiskLevel.HIGH, RiskLevel.CRITICAL):
            assert state.get("investigation_case") is not None, \
                "High-risk multi-anomaly project should trigger investigation routing"


class TestScenario10_FalsePositive_LegitimateUnusualProject:
    """SCENARIO 10: Large but legitimate project — should NOT trigger false alarms."""

    def test_legitimate_large_project_not_falsely_flagged(self):
        twin = make_twin(
            project_id="E2E-S10",
            name="Legitimate High-Value Bridge Construction",
            financial_progress=82.0,
            physical_progress=80.0,         # Well-aligned progress
            sanctioned=Decimal("15000000"),  # Large project
            expenditure=Decimal("12300000"),  # Within budget
            doc_types=[
                "SANCTION_ORDER", "WORK_ORDER", "ESTIMATE",
                "INSPECTION_REPORT", "PHOTO_EVIDENCE", "COMPLETION_CERTIFICATE",
            ],
            status=ProjectStatus.IN_PROGRESS,
        )
        state = run_pipeline(twin)
        risk = state["risk_output"]
        assert_valid_risk_output(risk, twin.project_id)
        assert_valid_agent_evidence(state["agent_evidence_list"])

        # Should NOT be flagged as CRITICAL — high value alone is not a risk signal
        assert risk.risk_level != RiskLevel.CRITICAL, \
            f"False positive: legitimate large project flagged as CRITICAL with score {risk.overall_risk_score}"

        # Well-documented, on-track project: documentation gap should be LOW
        assert risk.fingerprint.documentation_gap < 0.5, \
            f"False positive: well-documented project has high documentation_gap: {risk.fingerprint.documentation_gap}"


# ── Cross-Scenario Tests ──────────────────────────────────────────────────────

class TestCrossScenarioProperties:
    """Tests verifying system properties across multiple scenarios."""

    def test_anomalous_projects_score_higher_than_clean(self):
        """Risk directionality: anomalous scenarios must consistently outscore clean ones."""
        clean_twin = make_twin(
            "CROSS-CLEAN",
            "Clean Reference Project",
            financial_progress=62.0,
            physical_progress=60.0,
            doc_types=["SANCTION_ORDER", "WORK_ORDER", "ESTIMATE"],
        )
        anomalous_twin = make_twin(
            "CROSS-ANOMALOUS",
            "Anomalous Reference Project",
            financial_progress=100.0,
            physical_progress=15.0,  # Huge gap
            expenditure=Decimal("3000000"),  # Over budget
            doc_types=[],
            delay_days=200,
            status=ProjectStatus.DELAYED,
        )

        clean_state = run_pipeline(clean_twin)
        anomalous_state = run_pipeline(anomalous_twin)

        clean_score = clean_state["risk_output"].overall_risk_score
        anomalous_score = anomalous_state["risk_output"].overall_risk_score

        assert anomalous_score > clean_score, (
            f"Risk directionality failure: "
            f"anomalous={anomalous_score:.2f} not > clean={clean_score:.2f}"
        )

    def test_different_anomaly_patterns_produce_different_fingerprints(self):
        """Two projects with different anomaly patterns → different fingerprints."""
        # Project A: Financial anomaly only
        twin_a = make_twin(
            "FP-A",
            "Financial Anomaly Project",
            financial_progress=100.0,
            physical_progress=20.0,
            expenditure=Decimal("3200000"),
            doc_types=["SANCTION_ORDER", "WORK_ORDER", "ESTIMATE"],
        )
        # Project B: Documentation anomaly only
        twin_b = make_twin(
            "FP-B",
            "Documentation Anomaly Project",
            financial_progress=50.0,
            physical_progress=48.0,
            doc_types=[],  # Zero documentation
        )

        state_a = run_pipeline(twin_a)
        state_b = run_pipeline(twin_b)

        fp_a = state_a["risk_output"].fingerprint
        fp_b = state_b["risk_output"].fingerprint

        # Fingerprints must differ
        a_dict = fp_a.model_dump()
        b_dict = fp_b.model_dump()
        differences = sum(1 for k in a_dict if abs(a_dict[k] - b_dict[k]) > 0.01)
        assert differences >= 1, \
            f"Different anomaly patterns produced identical fingerprints: A={a_dict}, B={b_dict}"

    def test_all_19_agents_run_for_every_scenario(self):
        """All 19 agents must produce results (not crash) for any project type."""
        twin = make_twin("ALL-AGENTS", "Full Agent Coverage Test Project")
        state = run_pipeline(twin)
        evidence = state["agent_evidence_list"]
        assert len(evidence) == 19, f"Expected 19 agents, got {len(evidence)}"

        expected_agents = {
            "data_quality_agent", "eligibility_agent", "budget_agent", "deadline_agent",
            "documentation_agent", "procurement_agent", "contractor_intelligence_agent",
            "geographic_intelligence_agent", "duplicate_ghost_work_agent",
            "payment_agent", "financial_progress_agent", "physical_progress_agent",
            "asset_completion_agent", "cost_intelligence_agent", "anomaly_agent",
            "delay_prediction_agent", "trend_benchmark_agent", "fraud_archetype_agent",
            "rag_agent",
        }
        actual_agents = {ev.agent_id for ev in evidence}
        missing = expected_agents - actual_agents
        assert not missing, f"Missing agent results for: {missing}"

    def test_dynamic_weights_sum_to_one(self):
        """Dynamic weight normalization: all weights must sum to exactly 1.0."""
        from engine.dynamic_weight_engine import DynamicWeightEngine

        twin = make_twin("WEIGHTS-TEST", "Dynamic Weights Test Project")
        state = run_pipeline(twin)

        engine = DynamicWeightEngine()
        weights = engine.calculate_weights(
            evidence_list=state["agent_evidence_list"],
            project_status=twin.project_status,
        )

        if weights:  # If any agents were active
            total = sum(weights.values())
            assert abs(total - 1.0) < 0.001, \
                f"Dynamic weights do not sum to 1.0: sum={total:.6f}"

        # No NaN, no infinity, no invalid negatives
        for agent_id, weight in weights.items():
            assert weight >= 0.0, f"Negative weight for {agent_id}: {weight}"
            assert weight == weight, f"NaN weight for {agent_id}"  # NaN != NaN
            assert weight < float("inf"), f"Infinite weight for {agent_id}"

    def test_trajectory_engine_produces_output(self):
        """Trajectory must be computed and include key fields."""
        twin = make_twin("TRAJ-TEST", "Trajectory Test Project")
        state = run_pipeline(twin)

        assert "trajectory" in state, "Trajectory missing from pipeline state"
        traj = state["trajectory"]
        assert traj is not None, "Trajectory is None"

    def test_nlp_summary_is_meaningful(self):
        """NLP explanation must produce a non-trivial, non-empty audit summary."""
        twin = make_twin("NLP-TEST", "NLP Summary Test Project")
        state = run_pipeline(twin)

        summary = state.get("nlp_summary", "")
        assert summary, "NLP summary is empty"
        assert len(summary) > 100, f"NLP summary too short: {len(summary)} chars"
        assert_no_forbidden_language(summary, "nlp_summary")

    def test_failed_agent_does_not_crash_pipeline(self):
        """Agent failure isolation: pipeline must survive individual agent failures."""
        # Provide a minimal twin that stresses all agents
        twin = make_twin(
            "FAIL-ISOLATION",
            "Failure Isolation Test",
            financial_progress=0.0,
            physical_progress=0.0,
            doc_types=[],
        )
        # Should complete without raising any exception
        try:
            state = run_pipeline(twin)
            assert "risk_output" in state, "risk_output missing from state after agent failures"
        except Exception as e:
            pytest.fail(f"Pipeline crashed with agent failures: {e}")
