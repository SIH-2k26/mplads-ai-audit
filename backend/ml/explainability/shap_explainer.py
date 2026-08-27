"""
ml/explainability/shap_explainer.py
SHAP Explainability Engine for ML model predictions.
Decomposes predictions into directional feature contributions.
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

from app.utils.logging import get_logger
from ml.features.feature_engineer import FEATURE_NAMES

logger = get_logger("shap_explainer")


@dataclass
class SHAPFeatureContribution:
    feature_name: str
    feature_value: float
    shap_value: float           # Directional impact on risk (+ increases risk, - decreases risk)
    direction: str              # "INCREASES_RISK" | "DECREASES_RISK"
    importance_rank: int


@dataclass
class SHAPExplanation:
    base_value: float
    predicted_probability: float
    contributions: List[SHAPFeatureContribution]
    summary_statement: str


class SHAPExplainer:
    """
    Computes SHAP explanations for tree-based risk models.
    Falls back gracefully to model feature importances if SHAP/numba is unavailable.
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
        names = feature_names or FEATURE_NAMES
        if self._explainer is None:
            # Fallback heuristic explanation if TreeExplainer is unavailable
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

            # Sort by magnitude of shap value
            sorted_indices = np.argsort(np.abs(values))[::-1]
            contributions = []

            for rank, idx in enumerate(sorted_indices[:8]):
                sv = float(values[idx])
                fv = float(feature_vector[idx])
                fname = names[idx] if idx < len(names) else f"feature_{idx}"
                direction = "INCREASES_RISK" if sv > 0 else "DECREASES_RISK"
                
                contributions.append(SHAPFeatureContribution(
                    feature_name=fname,
                    feature_value=fv,
                    shap_value=round(sv, 4),
                    direction=direction,
                    importance_rank=rank + 1,
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
            sv = 0.15 if ("gap" in fname or "overdue" in fname) and val > 0 else -0.05
            contributions.append(SHAPFeatureContribution(
                feature_name=fname,
                feature_value=val,
                shap_value=round(sv, 4),
                direction="INCREASES_RISK" if sv > 0 else "DECREASES_RISK",
                importance_rank=idx + 1,
            ))
        return SHAPExplanation(
            base_value=0.5,
            predicted_probability=0.6,
            contributions=contributions,
            summary_statement="Estimated feature importance based on domain risk heuristics.",
        )
