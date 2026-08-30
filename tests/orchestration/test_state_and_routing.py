"""
tests/orchestration/test_state_and_routing.py
Tests supervisor routing, missing telemetry handling, and graceful degradation.
"""
import pytest
from backend.orchestration import SanchayOrchestrator


def test_supervisor_handles_missing_procurement_telemetry():
    orch = SanchayOrchestrator()
    # Payload omitting procurement data completely
    payload = {
        "project_id": "TEST-NO-PROC-001",
        "sanctioned_amount": 1500000.0,
        "actual_expenditure": 1400000.0,
        "physical_progress": 90.0,
        "financial_progress": 92.0,
    }
    res = orch.execute_sync(payload)
    assert res is not None
    assert res.get("workflow_status") in ["completed", "awaiting_human_review"]
    assert "financial" in res["completed_nodes"]
    assert "compliance" in res["completed_nodes"]


def test_supervisor_handles_anomalous_progress_divergence():
    orch = SanchayOrchestrator()
    # High progress gap project
    payload = {
        "project_id": "TEST-PROG-GAP-001",
        "sanctioned_amount": 4000000.0,
        "actual_expenditure": 3900000.0,
        "physical_progress": 25.0,
        "financial_progress": 97.5,
        "delay_days": 120,
    }
    res = orch.execute_sync(payload)
    assert res["risk_score"] >= 50.0
    assert any("PROGRESS" in f.get("category", "") for f in res.get("progress_findings", []))
