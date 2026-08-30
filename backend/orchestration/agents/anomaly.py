"""
backend/orchestration/agents/anomaly.py
Statistical Anomaly & Model Inference Agent Node for Sanchay AI LangGraph workflow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState
from backend.orchestration.tools.ml_tools import run_ml_risk_models, compute_shap_attributions


def anomaly_node(state: SanchayState) -> Dict[str, Any]:
    """
    Executes supervised ML models, Isolation Forest anomaly detector, and SHAP explainability.
    """
    feat_dict = state.get("feature_dict", state.get("project_data", {}))
    
    ml_res = run_ml_risk_models.invoke({"feature_dict": feat_dict})
    shap_res = compute_shap_attributions.invoke({"feature_dict": feat_dict})

    findings: List[Dict[str, Any]] = []
    iso_score = ml_res.get("isolation_forest_anomaly_score", 0.15)
    ml_prob = ml_res.get("primary_ml_probability", 0.15)

    if iso_score >= 0.60:
        findings.append({
            "category": "ANOMALY",
            "type": "MULTIVARIATE_OUTLIER",
            "severity": "HIGH",
            "score": round(iso_score, 4),
            "description": "Multivariate feature profile significantly diverges from normal MPLADS execution baseline.",
        })

    if ml_prob >= 0.70:
        findings.append({
            "category": "ANOMALY",
            "type": "HIGH_ML_RISK_PATTERN",
            "severity": "CRITICAL",
            "score": round(ml_prob, 4),
            "description": f"Ensemble gradient boosted trees predict high irregularity probability ({ml_prob*100:.1f}%).",
        })

    completed = state.get("completed_nodes", []) + ["ml_analysis", "anomaly"]
    return {
        "ml_prediction": ml_res,
        "shap_explanations": shap_res.get("top_contributions", []),
        "anomaly_findings": findings,
        "completed_nodes": completed,
    }
