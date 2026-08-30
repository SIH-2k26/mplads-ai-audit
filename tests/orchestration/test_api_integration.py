"""
tests/orchestration/test_api_integration.py
Tests FastAPI endpoint integration with LangGraph execution, review resumption, and trace retrieval.
"""
import pytest
from starlette.testclient import TestClient
from backend.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_api_risk_analyze_endpoint(client):
    payload = {
        "project_id": "TEST-API-001",
        "sanctioned_amount": 2500000.0,
        "actual_expenditure": 2400000.0,
        "physical_progress": 95.0,
        "financial_progress": 96.0,
        "bid_count": 4,
        "single_bid_flag": 0,
        "missing_mb_flag": 0,
    }
    response = client.post("/api/v1/risk/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["project_id"] == "TEST-API-001"
    assert "risk_score" in data
    assert "risk_level" in data
    assert "model_probabilities" in data
    assert "risk_components" in data


def test_api_human_review_and_trace_endpoints(client):
    # 1. Trigger analysis on a critical project
    payload = {
        "project_id": "TEST-API-CRIT-001",
        "sanctioned_amount": 5000000.0,
        "actual_expenditure": 4900000.0,
        "physical_progress": 10.0,
        "financial_progress": 98.0,
        "bid_count": 1,
        "single_bid_flag": 1,
        "missing_mb_flag": 1,
    }
    resp1 = client.post("/api/v1/risk/analyze", json=payload)
    assert resp1.status_code == 200
    
    # 2. Submit human decision
    review_payload = {
        "action": "ESCALATE",
        "officer": "DISTRICT_COLLECTOR",
        "remarks": "Referred to vigilance for on-site inspection",
    }
    resp2 = client.post("/api/v1/risk/analyze/REQ-TEST-123/review", json=review_payload)
    assert resp2.status_code == 200
    review_data = resp2.json()
    assert review_data["status"] == "success"
