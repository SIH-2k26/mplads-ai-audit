"""
ml package initialization for Sanchay AI.
"""
from __future__ import annotations
import os
import sys

# Ensure project root is in sys.path
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_path not in sys.path:
    sys.path.insert(0, root_path)

# Extend __path__ to allow submodules from backend/ml as well
backend_ml = os.path.abspath(os.path.join(root_path, "backend", "ml"))
if os.path.isdir(backend_ml) and backend_ml not in __path__:
    __path__.append(backend_ml)

from ml.features.builder import FeatureBuilder
from ml.features.schema import CANONICAL_FEATURES
from ml.ensemble import HybridRiskEnsemble
from ml.inference import ModelInferenceService
from ml.preprocessing import safe_ratio, clip_bounds

__all__ = [
    "FeatureBuilder",
    "CANONICAL_FEATURES",
    "HybridRiskEnsemble",
    "ModelInferenceService",
    "safe_ratio",
    "clip_bounds",
]
