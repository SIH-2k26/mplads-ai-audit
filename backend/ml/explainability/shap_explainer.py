"""
ml/explainability/shap_explainer.py
SHAP Explainability Engine for ML model predictions.
Decomposes predictions into directional feature contributions with human-readable audit explanations.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import numpy as np

try:
    import shap
    HAS_SHAP = True
except (ImportError, Exception):
    HAS_SHAP = False

try:
    from app.utils.logging import get_logger
except ImportError:
    try:
        from backend.app.utils.logging import get_logger
    except ImportError:
        import logging
        def get_logger(name: str):
            return logging.getLogger(name)

from ml.features.schema import CANONICAL_FEATURES

logger = get_logger("shap_explainer")

HUMAN_FEATURE_MAPPING = {
    "financial_physical_gap": "Financial expenditure significantly leads verified physical progress on site.",
    "cost_to_sanction_ratio": "Actual expenditure exceeds the approved administrative sanction ceiling.",
    "single_bid_flag": "Contract was awarded under a single-bid tender with zero competitive spread.",
    "missing_mb_flag": "Mandatory physical Measurement Book (MB) record is missing from the audit file.",
    "missing_uc_flag": "Statutory Utilization Certificate (UC) has not been submitted for disbursed funds.",
    "missing_geotag_flag": "Mandatory geo-tagged site verification photographs are absent from asset registry.",
    "contractor_past_irregularity_rate": "Assigned contractor exhibits a high historical rate of audit irregularities.",
    "delay_days": "Project duration exceeds sanctioned completion timeline.",
    "payment_concentration_index": "Unusual payment concentration in a single tranche disbursement.",
    "procurement_risk_score": "Procurement price discovery score indicates lack of competitive bidding.",
    "contractor_capacity_strain": "Contractor holds active commitments exceeding certified execution capacity.",
}


@dataclass
class SHAPFeatureContribution:
    feature_name: str
    feature_value: float
    shap_value: float           # Directional impact on risk (+ increases risk, - decreases risk)
    direction: str              # "INCREASES_RISK" | "DECREASES_RISK"
    importance_rank: int
    human_explanation: str = ""


@dataclass
class SHAPExplanation:
    base_value: float
    predicted_probability: float
    contributions: List[SHAPFeatureContribution]
    summary_statement: str


class SHAPExplainer:
    """
    Computes SHAP explanations for tree-based risk models.
    Maps technical feature contributions to plain-language statutory explanations.
    """

    def __init__(self, model: Any):
        self.model = model
        self._explainer = None
        self._init_explainer()

    def _init_explainer(self) -> None:
        if not HAS_SHAP:
            self._explainer = None
            return
        try:
            self._explainer = shap.TreeExplainer(self.model)
        except Exception as e:
            logger.warning("shap_explainer.tree_failed", error=str(e))
            self._explainer = None

    def explain_instance(self, feature_vector: np.ndarray, feature_names: Optional[List[str]] = None) -> Optional[SHAPExplanation]:
        """
        Explains a single feature vector of shape (n_features,).
        """
        names = feature_names or CANONICAL_FEATURES
        if self._explainer is None:
            return self._heuristic_explanation(feature_vector, names)

        try:
            X = feature_vector.reshape(1, -1)
            shap_values = self._explainer.shap_values(X)
            
            # Handle binary classifier output shape
            if isinstance(shap_values, list) and len(shap_values) == 2:
                values = shap_values[1][0]
            elif isinstance(shap_values, np.ndarray) and len(shap_values.shape) == 3:
                values = shap_values[0, :, 1]
            elif isinstance(shap_values, np.ndarray) and len(shap_values.shape) == 2:
                values = shap_values[0]
            else:
                values = np.array(shap_values).flatten()

            base_val = float(self._explainer.expected_value[1] if isinstance(self._explainer.expected_value, (list, np.ndarray)) else self._explainer.expected_value)

            sorted_indices = np.argsort(np.abs(values))[::-1]
            contributions = []

            for rank, idx in enumerate(sorted_indices[:8]):
                sv = float(values[idx])
                fv = float(feature_vector[idx]) if idx < len(feature_vector) else 0.0
                fname = names[idx] if idx < len(names) else f"feature_{idx}"
                direction = "INCREASES_RISK" if sv > 0 else "DECREASES_RISK"
                human_exp = HUMAN_FEATURE_MAPPING.get(fname, f"Variation in {fname.replace('_', ' ')}.")
                
                contributions.append(SHAPFeatureContribution(
                    feature_name=fname,
                    feature_value=round(fv, 4),
                    shap_value=round(sv, 4),
                    direction=direction,
                    importance_rank=rank + 1,
                    human_explanation=human_exp,
                ))

            top_drivers = [c.feature_name.replace("_", " ").title() for c in contributions if c.direction == "INCREASES_RISK"][:2]
            summary = f"Risk increased primarily by {', '.join(top_drivers)}." if top_drivers else "No abnormal feature contributions detected."

            return SHAPExplanation(
                base_value=round(base_val, 4),
                predicted_probability=round(float(1.0 / (1.0 + np.exp(-base_val - np.sum(values)))), 4),
                contributions=contributions,
                summary_statement=summary,
            )
        except Exception as e:
            logger.error("shap_explainer.error", error=str(e))
            return self._heuristic_explanation(feature_vector, names)

    def _heuristic_explanation(self, feature_vector: np.ndarray, names: List[str]) -> SHAPExplanation:
        """Heuristic fallback when exact SHAP computation fails."""
        contributions = []
        for idx, fname in enumerate(names[:6]):
            val = float(feature_vector[idx]) if idx < len(feature_vector) else 0.0
            sv = 0.15 if ("gap" in fname or "overdue" in fname or "single_bid" in fname) and val > 0 else -0.05
            direction = "INCREASES_RISK" if sv > 0 else "DECREASES_RISK"
            human_exp = HUMAN_FEATURE_MAPPING.get(fname, f"Impact from {fname.replace('_', ' ')}.")
            contributions.append(SHAPFeatureContribution(
                feature_name=fname,
                feature_value=round(val, 4),
                shap_value=round(sv, 4),
                direction=direction,
                importance_rank=idx + 1,
                human_explanation=human_exp,
            ))
        return SHAPExplanation(
            base_value=0.5,
            predicted_probability=0.6,
            contributions=contributions,
            summary_statement="Estimated feature importance based on statutory risk heuristics.",
        )
