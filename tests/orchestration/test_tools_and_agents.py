"""
tests/orchestration/test_tools_and_agents.py
Tests LangChain tools and specialist agent nodes in Sanchay AI orchestration package.
"""
import pytest
from backend.orchestration.tools.ml_tools import run_ml_risk_models, compute_shap_attributions
from backend.orchestration.tools.financial_tools import analyze_financial_disbursements
from backend.orchestration.tools.procurement_tools import analyze_procurement_bidding
from backend.orchestration.tools.document_tools import verify_document_records
from backend.orchestration.tools.rag_tools import retrieve_statutory_evidence


def test_ml_tools_execution():
    sample_feat = {
        "sanctioned_amount": 2500000.0,
        "actual_expenditure": 2400000.0,
        "physical_progress": 95.0,
        "financial_progress": 96.0,
    }
    res = run_ml_risk_models.invoke({"feature_dict": sample_feat})
    assert res["status"] in ["success", "degraded"]
    assert "primary_ml_probability" in res


def test_financial_tools_execution():
    sample_proj = {
        "sanctioned_amount": 2000000.0,
        "actual_expenditure": 2500000.0,  # 25% overrun
    }
    res = analyze_financial_disbursements.invoke({"project_data": sample_proj})
    assert res["status"] == "success"
    assert res["cost_to_sanction_ratio"] == 1.25
    assert len(res["findings"]) > 0


def test_procurement_tools_single_bid():
    sample_proj = {
        "bid_count": 1,
        "single_bid_flag": 1,
    }
    res = analyze_procurement_bidding.invoke({"project_data": sample_proj})
    assert res["status"] == "success"
    assert res["single_bid_flag"] == 1
    assert any("SINGLE_BID" in f["code"] for f in res["findings"])


def test_document_tools_missing_mb():
    sample_proj = {
        "missing_mb_flag": 1,
    }
    res = verify_document_records.invoke({"project_data": sample_proj})
    assert res["status"] == "success"
    assert res["missing_mb"] == 1
    assert any("MISSING_MEASUREMENT_BOOK" in f["code"] for f in res["findings"])
