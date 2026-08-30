"""
tests/orchestration/test_graph_compilation.py
Tests LangGraph compilation, node integrity, and checkpointer binding.
"""
import pytest
from backend.orchestration import build_sanchay_graph, sanchay_graph, SanchayOrchestrator


def test_sanchay_graph_compilation():
    graph = build_sanchay_graph()
    assert graph is not None
    assert hasattr(graph, "invoke")
    assert hasattr(graph, "ainvoke")


def test_orchestrator_initialization():
    orch = SanchayOrchestrator()
    assert orch.graph is not None


def test_orchestrator_sync_execution():
    orch = SanchayOrchestrator()
    sample_project = {
        "project_id": "TEST-GRAPH-001",
        "sanctioned_amount": 3000000.0,
        "actual_expenditure": 2800000.0,
        "physical_progress": 90.0,
        "financial_progress": 92.0,
        "bid_count": 4,
        "single_bid_flag": 0,
        "missing_mb_flag": 0,
    }
    res = orch.execute_sync(sample_project)
    assert res is not None
    assert "risk_score" in res
    assert "risk_level" in res
    assert "completed_nodes" in res
    assert "normalize_data" in res["completed_nodes"]
    assert "finalize" in res["completed_nodes"]
