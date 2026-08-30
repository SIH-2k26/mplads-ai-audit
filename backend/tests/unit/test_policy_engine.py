"""
tests/unit/test_policy_engine.py
Unit tests for versioned PolicyEngine and PolicyLoader.
"""
from datetime import date, datetime
from decimal import Decimal
import pytest

from models.digital_twin import ProjectDigitalTwin
from models.document import DocumentMetadata
from models.enums import ProjectCategory, ProjectStatus
from policy.engine import PolicyEngine
from policy.loader import PolicyLoader
from policy.models import RuleEvaluationStatus


@pytest.fixture
def policy_engine():
    return PolicyEngine()


def test_policy_loader_loads_versions():
    loader = PolicyLoader()
    v2016 = loader.get_version("MPLADS_GUIDELINES", "2016")
    v2023 = loader.get_version("MPLADS_GUIDELINES", "2023")

    assert v2016 is not None
    assert v2023 is not None
    assert len(v2016.rules) > 0
    assert len(v2023.rules) > 0


def test_policy_resolution_by_date(policy_engine):
    loader = policy_engine.loader
    
    # 2018 date should resolve to 2016 guidelines
    v_old = loader.resolve_for_date("MPLADS_GUIDELINES", date(2018, 5, 1))
    assert v_old.version == "2016"

    # 2024 date should resolve to 2023 guidelines
    v_new = loader.resolve_for_date("MPLADS_GUIDELINES", date(2024, 1, 1))
    assert v_new.version == "2023"


def test_policy_evaluates_compliant_project(policy_engine):
    from models.project import Sanction, Budget, Expenditure, ProgressRecord
    twin = ProjectDigitalTwin(
        project_id="PROJ-POL-001",
        project_name="Community Hall Construction",
        category=ProjectCategory.COMMUNITY_INFRASTRUCTURE.value,
        project_status=ProjectStatus.IN_PROGRESS,
        sanction=Sanction(sanctioned_amount=Decimal("2000000.00"), sanction_date=date(2024, 1, 1)),
        budget=Budget(approved_budget=Decimal("2000000.00")),
        expenditure=Expenditure(total_expenditure=Decimal("1000000.00")),
        latest_progress=ProgressRecord(financial_progress=50.0, physical_progress=50.0, as_of_date=date(2024, 1, 15)),
        document_types_present=["SANCTION_ORDER", "WORK_ORDER", "PHOTO_EVIDENCE"],
    )

    res = policy_engine.evaluate(twin)
    assert res.policy_version == "2023"
    assert res.overall_status in [RuleEvaluationStatus.PASS, RuleEvaluationStatus.WARNING]
    assert res.rules_failed == 0


def test_policy_detects_severe_gap_violation(policy_engine):
    from models.project import Sanction, Budget, Expenditure, ProgressRecord
    twin = ProjectDigitalTwin(
        project_id="PROJ-POL-VIOLATE",
        project_name="Suspicious Road",
        category=ProjectCategory.ROAD_CONSTRUCTION.value,
        sanction=Sanction(sanctioned_amount=Decimal("2000000.00"), sanction_date=date(2024, 1, 1)),
        budget=Budget(approved_budget=Decimal("2000000.00")),
        expenditure=Expenditure(total_expenditure=Decimal("2400000.00")),
        latest_progress=ProgressRecord(financial_progress=95.0, physical_progress=30.0, as_of_date=date(2024, 1, 15)),
        document_types_present=[],
    )

    res = policy_engine.evaluate(twin)
    assert res.overall_status == RuleEvaluationStatus.FAIL
    assert res.rules_failed >= 1
