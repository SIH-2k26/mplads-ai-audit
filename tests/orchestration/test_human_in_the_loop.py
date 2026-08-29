"""
tests/orchestration/test_human_in_the_loop.py
Tests Human-in-the-Loop workflow pausing for critical risk projects and resumption upon human review.
"""
import pytest
from backend.orchestration import SanchayOrchestrator


def test_critical_project_triggers_human_review_pause():
    orch = SanchayOrchestrator()
    critical_payload = {
        "project_id": "TEST-HITL-CRIT-001",
        "sanctioned_amount": 5000000.0,
        "actual_expenditure": 4900000.0,
        "physical_progress": 10.0,
        "financial_progress": 98.0,
        "bid_count": 1,
        "single_bid_flag": 1,
        "missing_mb_flag": 1,
        "missing_uc_flag": 1,
        "contractor_past_irregularity_rate": 0.40,
    }
    res = orch.execute_sync(critical_payload)
    assert res["risk_score"] >= 70.0
    assert res["human_review_required"] is True
    assert res["workflow_status"] == "awaiting_human_review"
    assert "human_review_paused" in res["completed_nodes"]


def test_human_decision_resumes_and_completes_workflow():
    orch = SanchayOrchestrator()
    resumed_payload = {
        "project_id": "TEST-HITL-CRIT-002",
        "sanctioned_amount": 5000000.0,
        "actual_expenditure": 4900000.0,
        "physical_progress": 10.0,
        "financial_progress": 98.0,
        "bid_count": 1,
        "single_bid_flag": 1,
        "missing_mb_flag": 1,
        "contractor_past_irregularity_rate": 0.40,
        "human_decision": {
            "action": "ESCALATE",
            "officer_role": "DISTRICT_COLLECTOR",
            "remarks": "Referred to State Vigilance for physical Measurement Book inspection.",
        }
    }
    res = orch.execute_sync(resumed_payload)
    assert res["workflow_status"] == "completed"
    assert res["human_decision"] is not None
    assert res["human_decision"]["action"] == "ESCALATE"
