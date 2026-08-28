import os
import sys
import pytest

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from ml.ensemble import HybridRiskEnsemble


def test_hybrid_risk_ensemble_initialization():
    ensemble = HybridRiskEnsemble()
    assert ensemble.best_model is not None
    assert ensemble.iso_forest is not None
    assert len(ensemble.feature_cols) > 0


def test_normal_project_inference():
    ensemble = HybridRiskEnsemble()
    normal_project = {
        "project_id": "TEST-NORMAL-001",
        "sanctioned_amount": 2500000.0,
        "actual_expenditure": 2400000.0,
        "physical_progress": 95.0,
        "financial_progress": 96.0,
        "bid_count": 5,
        "single_bid_flag": 0,
        "missing_mb_flag": 0,
        "missing_uc_flag": 0,
        "delay_days": 0,
        "contractor_past_irregularity_rate": 0.0,
    }
    result = ensemble.analyze_project(normal_project)
    assert result["risk_score"] < 40.0
    assert result["risk_level"] in ["LOW", "MEDIUM"]
    assert "recommended_action" in result
    assert isinstance(result["category_scores"], dict)


def test_anomalous_progress_gap_project_inference():
    ensemble = HybridRiskEnsemble()
    anomalous_project = {
        "project_id": "TEST-ANOM-002",
        "sanctioned_amount": 5000000.0,
        "actual_expenditure": 4800000.0,
        "physical_progress": 20.0,  # Severe progress lag
        "financial_progress": 96.0,
        "bid_count": 1,             # Single bid
        "single_bid_flag": 1,
        "missing_mb_flag": 1,       # Missing Measurement Book
        "contractor_past_irregularity_rate": 0.35,
    }
    result = ensemble.analyze_project(anomalous_project)
    assert result["risk_score"] >= 65.0
    assert result["risk_level"] in ["HIGH", "CRITICAL"]
    assert len(result["red_flags"]) >= 2
    assert any("financial_physical_gap" in f["feature"] for f in result["top_risk_factors"])
