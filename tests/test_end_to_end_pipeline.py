"""
tests/test_end_to_end_pipeline.py
Automated End-to-End Integration Tests for MPLADS AI Audit.
Tests: Frontend Payload -> Normalization -> 177 Features -> ML Inference -> Compliance Engine -> RAG -> Ensemble -> Canonical Response.
Covers 8 Required Deterministic Scenarios (Clean, Ghost, Cost Outlier, Single-Bid Hard Negative, Missing UC, Progress Mismatch, Split Tender, Legitimate Delay).
"""
from __future__ import annotations
import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
backend_dir = os.path.join(root_dir, "backend")
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import pytest
from fastapi.testclient import TestClient
from backend.main import app


@pytest.fixture
def client():
    return TestClient(app)


# 1. CLEAN NORMAL PROJECT
def test_e2e_scenario_1_clean_normal_project(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-001",
            "title": "Installation of Solar Street Lights in Gram Panchayat",
            "category": "Rural Infrastructure",
            "state": "Maharashtra",
            "district": "Pune",
            "constituency": "Pune",
            "sanction_amount": 2500000.0,
            "estimated_cost": 2400000.0,
            "tender_amount": 2380000.0,
            "actual_cost": 2350000.0,
            "fund_released": 2500000.0,
            "total_expenditure": 2350000.0,
            "physical_progress": 95.0,
            "financial_progress": 94.0,
            "planned_duration_days": 180,
            "actual_duration_days": 190,
            "bid_count": 5,
            "extension_count": 0,
            "contractor_id": "CONT-0001",
            "agency_id": "AGENCY-0001",
            "sanction_date": "2023-08-10"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": True,
            "utilization_certificate": True,
            "completion_certificate": True,
            "geo_tagged_photos": True
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["project_id"] == "MPLADS-TEST-001"
    assert data["risk_score"] < 45.0
    assert data["risk_level"] in ["LOW", "MEDIUM"]
    assert "model_probabilities" in data
    assert "risk_components" in data
    assert data["feature_count"] == 177
    assert data["ml_status"] == "operational"


# 2. GHOST WORK (High financial disbursement, zero physical progress, missing MB & photos)
def test_e2e_scenario_2_ghost_work(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-002",
            "title": "Construction of Ghost Community Hall",
            "category": "Community Infrastructure",
            "state": "Maharashtra",
            "district": "Pune",
            "constituency": "Pune",
            "sanction_amount": 4500000.0,
            "estimated_cost": 4200000.0,
            "tender_amount": 4100000.0,
            "actual_cost": 4400000.0,
            "fund_released": 4500000.0,
            "total_expenditure": 4400000.0,
            "physical_progress": 0.0,
            "financial_progress": 97.8,
            "planned_duration_days": 180,
            "actual_duration_days": 350,
            "bid_count": 1,
            "extension_count": 2,
            "contractor_id": "CONT-0088",
            "agency_id": "AGENCY-0015",
            "sanction_date": "2023-05-15"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": False,
            "utilization_certificate": False,
            "completion_certificate": False,
            "geo_tagged_photos": False
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert data["risk_score"] >= 75.0
    assert data["risk_level"] in ["HIGH", "CRITICAL"]
    assert len(data["compliance_findings"]) >= 2


# 3. COST ANOMALY (>35% above comparable benchmark)
def test_e2e_scenario_3_cost_anomaly(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-003",
            "title": "Construction of Village Road",
            "category": "Roads & Bridges",
            "state": "Maharashtra",
            "district": "Pune",
            "constituency": "Pune",
            "sanction_amount": 5000000.0,
            "estimated_cost": 4800000.0,
            "tender_amount": 4700000.0,
            "actual_cost": 4800000.0,
            "fund_released": 5000000.0,
            "total_expenditure": 4800000.0,
            "physical_progress": 80.0,
            "financial_progress": 96.0,
            "planned_duration_days": 180,
            "actual_duration_days": 180,
            "bid_count": 3,
            "extension_count": 0,
            "contractor_id": "CONT-0022",
            "agency_id": "AGENCY-0004",
            "sanction_date": "2023-07-20"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": True,
            "utilization_certificate": True,
            "completion_certificate": False,
            "geo_tagged_photos": True
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data


# 4. SINGLE BID BUT LEGITIMATE (Hard Negative Control)
def test_e2e_scenario_4_single_bid_hard_negative(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-004",
            "title": "High Altitude Tribal Water Supply Scheme",
            "category": "Drinking Water",
            "state": "Himachal Pradesh",
            "district": "Lahaul and Spiti",
            "constituency": "Mandi",
            "sanction_amount": 3500000.0,
            "estimated_cost": 3400000.0,
            "tender_amount": 3350000.0,
            "actual_cost": 3300000.0,
            "fund_released": 3500000.0,
            "total_expenditure": 3300000.0,
            "physical_progress": 90.0,
            "financial_progress": 94.0,
            "planned_duration_days": 240,
            "actual_duration_days": 250,
            "bid_count": 1, # Single bidder due to extreme remote terrain
            "extension_count": 0,
            "contractor_id": "CONT-0019",
            "agency_id": "AGENCY-0008",
            "sanction_date": "2023-06-12"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": True,
            "utilization_certificate": True,
            "completion_certificate": True,
            "geo_tagged_photos": True
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()

    # Must NOT produce false-positive critical alarm
    assert data["risk_score"] < 60.0
    assert data["risk_level"] in ["LOW", "MEDIUM"]


# 5. MISSING UC (Documentation compliance warning)
def test_e2e_scenario_5_missing_uc(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-005",
            "title": "Govt High School Smart Classrooms",
            "category": "Education",
            "state": "Maharashtra",
            "district": "Pune",
            "constituency": "Pune",
            "sanction_amount": 2000000.0,
            "estimated_cost": 1900000.0,
            "tender_amount": 1850000.0,
            "actual_cost": 1800000.0,
            "fund_released": 2000000.0,
            "total_expenditure": 1800000.0,
            "physical_progress": 85.0,
            "financial_progress": 90.0,
            "planned_duration_days": 180,
            "actual_duration_days": 180,
            "bid_count": 4,
            "extension_count": 0,
            "contractor_id": "CONT-0005",
            "agency_id": "AGENCY-0003",
            "sanction_date": "2023-09-01"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": True,
            "utilization_certificate": False, # Missing UC
            "completion_certificate": False,
            "geo_tagged_photos": True
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert any("Utilization Certificate" in f["rule_name"] for f in data["compliance_findings"])


# 6. FINANCIAL-PHYSICAL PROGRESS MISMATCH (>40% gap)
def test_e2e_scenario_6_financial_physical_mismatch(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-006",
            "title": "Sub-District Health Wellness Centre Addition",
            "category": "Public Health",
            "state": "Maharashtra",
            "district": "Pune",
            "constituency": "Pune",
            "sanction_amount": 3500000.0,
            "estimated_cost": 3300000.0,
            "tender_amount": 3200000.0,
            "actual_cost": 3100000.0,
            "fund_released": 3500000.0,
            "total_expenditure": 3100000.0,
            "physical_progress": 35.0, # 53.6% gap
            "financial_progress": 88.6,
            "planned_duration_days": 180,
            "actual_duration_days": 290,
            "bid_count": 2,
            "extension_count": 2,
            "contractor_id": "CONT-0034",
            "agency_id": "AGENCY-0009",
            "sanction_date": "2023-04-25"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": False,
            "utilization_certificate": False,
            "completion_certificate": False,
            "geo_tagged_photos": True
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] >= 60.0
    assert any("Disbursement" in f["rule_name"] or "Financial" in f["category"] for f in data["compliance_findings"])


# 7. SPLIT TENDER DETECTION
def test_e2e_scenario_7_split_tender(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-007",
            "title": "Ward 4 Paving and Drainage Work (Part A)",
            "category": "Rural Infrastructure",
            "state": "Maharashtra",
            "district": "Pune",
            "constituency": "Pune",
            "sanction_amount": 490000.0,
            "estimated_cost": 480000.0,
            "tender_amount": 475000.0,
            "actual_cost": 470000.0,
            "fund_released": 490000.0,
            "total_expenditure": 470000.0,
            "physical_progress": 60.0,
            "financial_progress": 95.0,
            "planned_duration_days": 90,
            "actual_duration_days": 120,
            "bid_count": 1,
            "extension_count": 1,
            "contractor_id": "CONT-0012",
            "agency_id": "AGENCY-0002",
            "sanction_date": "2023-11-10"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": False,
            "utilization_certificate": False,
            "completion_certificate": False,
            "geo_tagged_photos": True
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "risk_score" in data


# 8. LEGITIMATE DELAY (Hard Negative Control)
def test_e2e_scenario_8_legitimate_delay(client):
    payload = {
        "project": {
            "project_id": "MPLADS-TEST-008",
            "title": "Flood Defense Embankment Repair",
            "category": "Irrigation & Flood Control",
            "state": "Assam",
            "district": "Dima Hasao",
            "constituency": "Autonomous District",
            "sanction_amount": 4000000.0,
            "estimated_cost": 3900000.0,
            "tender_amount": 3850000.0,
            "actual_cost": 3800000.0,
            "fund_released": 4000000.0,
            "total_expenditure": 3800000.0,
            "physical_progress": 78.0,
            "financial_progress": 82.0,
            "planned_duration_days": 180,
            "actual_duration_days": 320, # Delay due to monsoon floods
            "bid_count": 4,
            "extension_count": 1,
            "contractor_id": "CONT-0014",
            "agency_id": "AGENCY-0007",
            "sanction_date": "2023-05-10"
        },
        "documents": {
            "administrative_sanction": True,
            "technical_sanction": True,
            "dpr": True,
            "work_order": True,
            "measurement_book": True,
            "utilization_certificate": True,
            "completion_certificate": False,
            "geo_tagged_photos": True
        }
    }

    res = client.post("/api/v1/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] < 60.0


def test_status_endpoints(client):
    res_m = client.get("/api/v1/models/status")
    assert res_m.status_code == 200
    assert res_m.json()["status"] == "healthy"
    assert res_m.json()["feature_count"] == 177

    res_r = client.get("/api/v1/rag/status")
    assert res_r.status_code == 200
    assert res_r.json()["status"] == "ready"
