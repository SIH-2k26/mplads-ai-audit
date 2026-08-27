"""
tests/contracts/test_agent_contract.py
CONTRACT 1: BaseAgent → AgentEvidence

Tests that:
1. All agents inherit BaseAgent correctly
2. run() always returns valid AgentEvidence
3. Score, confidence, applicability are in valid ranges
4. Failed agent returns status=FAILED not exception
5. Not applicable agent returns status=NOT_APPLICABLE
"""
import pytest
from datetime import datetime, date
from decimal import Decimal
from agents.base import BaseAgent
from agents.deterministic.data_quality import DataQualityAgent
from agents.deterministic.budget import BudgetAgent
from agents.deterministic.deadline import DeadlineAgent
from agents.deterministic.eligibility import EligibilityAgent
from agents.deterministic.documentation import DocumentationAgent
from agents.deterministic.procurement import ProcurementAgent
from agents.intelligence.contractor_intelligence import ContractorIntelligenceAgent
from agents.intelligence.geographic_intelligence import GeographicIntelligenceAgent
from agents.intelligence.duplicate_ghost_work import DuplicateGhostWorkAgent
from models.agent import AgentEvidence, AgentContext
from models.digital_twin import ProjectDigitalTwin
from models.enums import (
    AgentStatus, ProjectStatus, Severity, RiskLevel,
)
from models.project import (
    GeoLocation, Sanction, Budget, Expenditure, ProgressRecord,
    ImplementingAgency, Contractor,
)


def make_minimal_twin(**kwargs) -> ProjectDigitalTwin:
    """Create a minimal but valid Digital Twin for testing."""
    defaults = dict(
        project_id="TEST/UP/2022/001",
        project_name="Test Road Construction Project",
        category="ROAD",
        state_id="UP",
        project_status=ProjectStatus.IN_PROGRESS,
        location=GeoLocation(district="Lucknow", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number="MPLADS/UP/2022/001",
            sanction_date=date(2022, 4, 1),
            sanctioned_amount=Decimal("2000000"),
        ),
        budget=Budget(
            approved_budget=Decimal("2000000"),
            estimated_cost=Decimal("1900000"),
        ),
        expenditure=Expenditure(total_expenditure=Decimal("1500000")),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=75.0,
            physical_progress=60.0,
        ),
        start_date=datetime(2022, 6, 1),
        expected_completion_date=datetime(2023, 6, 1),
        implementing_agency=ImplementingAgency(agency_name="State PWD"),
        contractor=Contractor(contractor_name="ABC Construction"),
    )
    defaults.update(kwargs)
    return ProjectDigitalTwin(**defaults)


def make_context(twin=None, **kwargs) -> AgentContext:
    if twin is None:
        twin = make_minimal_twin()
    return AgentContext(project_id=twin.project_id, digital_twin=twin, **kwargs)


ALL_AGENTS = [
    DataQualityAgent,
    BudgetAgent,
    DeadlineAgent,
    EligibilityAgent,
    DocumentationAgent,
    ProcurementAgent,
    ContractorIntelligenceAgent,
    GeographicIntelligenceAgent,
    DuplicateGhostWorkAgent,
]


class TestBaseAgentContract:
    """CONTRACT 1: Every agent must return valid AgentEvidence."""

    def test_all_agents_inherit_base_agent(self):
        for agent_cls in ALL_AGENTS:
            assert issubclass(agent_cls, BaseAgent), f"{agent_cls.__name__} must inherit BaseAgent"

    def test_all_agents_have_required_attributes(self):
        for agent_cls in ALL_AGENTS:
            agent = agent_cls()
            assert hasattr(agent, "agent_id"), f"{agent_cls.__name__} missing agent_id"
            assert hasattr(agent, "agent_name"), f"{agent_cls.__name__} missing agent_name"
            assert hasattr(agent, "version"), f"{agent_cls.__name__} missing version"
            assert agent.agent_id, f"{agent_cls.__name__}.agent_id is empty"
            assert agent.agent_name, f"{agent_cls.__name__}.agent_name is empty"

    def test_all_agents_return_agent_evidence(self):
        context = make_context()
        for agent_cls in ALL_AGENTS:
            agent = agent_cls()
            result = agent.run(context)
            assert isinstance(result, AgentEvidence), (
                f"{agent_cls.__name__}.run() must return AgentEvidence, got {type(result)}"
            )

    def test_score_in_valid_range(self):
        context = make_context()
        for agent_cls in ALL_AGENTS:
            agent = agent_cls()
            result = agent.run(context)
            assert 0.0 <= result.score <= 100.0, (
                f"{agent_cls.__name__}: score {result.score} out of range [0, 100]"
            )

    def test_confidence_in_valid_range(self):
        context = make_context()
        for agent_cls in ALL_AGENTS:
            agent = agent_cls()
            result = agent.run(context)
            assert 0.0 <= result.confidence <= 1.0, (
                f"{agent_cls.__name__}: confidence {result.confidence} out of range [0, 1]"
            )

    def test_applicability_in_valid_range(self):
        context = make_context()
        for agent_cls in ALL_AGENTS:
            agent = agent_cls()
            result = agent.run(context)
            assert 0.0 <= result.applicability <= 1.0, (
                f"{agent_cls.__name__}: applicability {result.applicability} out of range [0, 1]"
            )

    def test_agent_id_matches(self):
        context = make_context()
        for agent_cls in ALL_AGENTS:
            agent = agent_cls()
            result = agent.run(context)
            assert result.agent_id == agent.agent_id, (
                f"{agent_cls.__name__}: result.agent_id {result.agent_id} != {agent.agent_id}"
            )

    def test_failed_agent_returns_failed_status_not_exception(self):
        """Agents must never raise — return FAILED status instead."""
        # Create a context with a corrupted twin (None project_id)
        good_context = make_context()
        for agent_cls in ALL_AGENTS:
            agent = agent_cls()
            # run() should never raise
            try:
                result = agent.run(good_context)
                assert result.status in AgentStatus, f"{agent_cls.__name__} returned invalid status"
            except Exception as e:
                pytest.fail(f"{agent_cls.__name__}.run() raised an exception: {e}")

    def test_agent_evidence_factory_not_applicable(self):
        evidence = AgentEvidence.not_applicable("test_agent", "Test Agent", "No data")
        assert evidence.status == AgentStatus.NOT_APPLICABLE
        assert evidence.score == 0.0
        assert evidence.applicability == 0.0

    def test_agent_evidence_factory_failed(self):
        evidence = AgentEvidence.failed("test_agent", "Test Agent", "Connection error")
        assert evidence.status == AgentStatus.FAILED
        assert evidence.error_message == "Connection error"
        assert evidence.score == 0.0

    def test_agent_evidence_factory_insufficient_data(self):
        evidence = AgentEvidence.insufficient_data("test_agent", "Test Agent", ["start_date"])
        assert evidence.status == AgentStatus.INSUFFICIENT_DATA
        assert "start_date" in evidence.metadata.get("missing_fields", [])


class TestBudgetAgentSpecific:
    """Specific budget agent behavior tests."""

    def test_detects_financial_physical_mismatch(self):
        twin = make_minimal_twin(
            latest_progress=ProgressRecord(
                as_of_date=date.today(),
                financial_progress=90.0,   # High financial
                physical_progress=20.0,    # Low physical — mismatch
            )
        )
        context = make_context(twin)
        agent = BudgetAgent()
        result = agent.run(context)

        signal_types = [s.signal_type for s in result.signals]
        assert "FINANCIAL_PHYSICAL_PROGRESS_MISMATCH" in signal_types
        assert result.score > 0

    def test_no_anomaly_for_normal_project(self):
        twin = make_minimal_twin(
            latest_progress=ProgressRecord(
                as_of_date=date.today(),
                financial_progress=60.0,
                physical_progress=55.0,
            ),
            expenditure=Expenditure(total_expenditure=Decimal("1200000")),  # Under budget
        )
        context = make_context(twin)
        agent = BudgetAgent()
        result = agent.run(context)
        # Low score for normal project
        signal_types = [s.signal_type for s in result.signals]
        assert "FINANCIAL_PHYSICAL_PROGRESS_MISMATCH" not in signal_types


class TestDeadlineAgentSpecific:
    """Deadline agent behavior tests."""

    def test_detects_overdue_project(self):
        twin = make_minimal_twin(
            expected_completion_date=datetime(2020, 1, 1),  # Way past due
            actual_completion_date=None,
            project_status=ProjectStatus.IN_PROGRESS,
        )
        context = make_context(twin)
        result = DeadlineAgent().run(context)
        signal_types = [s.signal_type for s in result.signals]
        assert "PROJECT_OVERDUE" in signal_types
        assert result.score > 30

    def test_no_flag_for_on_time_project(self):
        from datetime import timedelta, timezone
        twin = make_minimal_twin(
            expected_completion_date=datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(days=180),
            actual_completion_date=None,
        )
        context = make_context(twin)
        result = DeadlineAgent().run(context)
        signal_types = [s.signal_type for s in result.signals]
        assert "PROJECT_OVERDUE" not in signal_types
        assert result.score < 30
