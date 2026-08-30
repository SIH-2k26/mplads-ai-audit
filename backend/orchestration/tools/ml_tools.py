"""
backend/orchestration/tools/ml_tools.py
LangChain structured tools wrapping ML Inference, Isolation Forest Anomaly Detection, and SHAP Explainability.
"""
from __future__ import annotations
from typing import Any, Dict, List
from langchain_core.tools import tool
import numpy as np

from ml.inference import ModelInferenceService
from backend.ml.explainability.shap_explainer import SHAPExplainer


@tool
def run_ml_risk_models(feature_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes supervised ML risk models (Random Forest, CatBoost, XGBoost, LightGBM)
    and Isolation Forest anomaly detector on canonical feature dictionary.
    Returns calibrated probability breakdown and anomaly outlier score.
    """
    try:
        inf = ModelInferenceService()
        feat_vector, f_dict = inf.extract_features_from_dict(feature_dict)
        probs = inf.predict(feat_vector, f_dict)
        return {
            "status": "success",
            "probabilities": probs,
            "feature_vector_dim": len(feat_vector),
            "primary_ml_probability": probs.get("calibrated_probability", probs.get("random_forest_probability", 0.15)),
            "isolation_forest_anomaly_score": probs.get("isolation_forest_score", 0.15),
        }
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e),
            "primary_ml_probability": 0.20,
            "isolation_forest_anomaly_score": 0.15,
            "probabilities": {"random_forest_probability": 0.20, "isolation_forest_score": 0.15},
        }


@tool
def compute_shap_attributions(feature_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes directional SHAP feature attributions and maps technical feature drivers
    to human-readable statutory audit explanations.
    """
    try:
        inf = ModelInferenceService()
        feat_vector, f_dict = inf.extract_features_from_dict(feature_dict)
        model = inf.best_model
        explainer = SHAPExplainer(model)
        explanation = explainer.explain_instance(feat_vector)
        if explanation is None:
            return {"status": "unavailable", "contributions": []}
        
        return {
            "status": "success",
            "base_value": explanation.base_value,
            "summary_statement": explanation.summary_statement,
            "top_contributions": [
                {
                    "feature": c.feature_name,
                    "value": c.feature_value,
                    "shap_value": c.shap_value,
                    "direction": c.direction,
                    "rank": c.importance_rank,
                    "explanation": c.human_explanation,
                }
                for c in explanation.contributions
            ]
        }
    except Exception as e:
        return {"status": "degraded", "error": str(e), "top_contributions": []}
