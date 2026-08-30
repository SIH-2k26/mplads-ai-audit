"""
ml/features
Canonical Feature Engineering Engine for Sanchay AI.
"""
from __future__ import annotations
import os
import sys

# Extend __path__ to allow backend/ml/features modules
backend_features = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend", "ml", "features"))
if os.path.isdir(backend_features) and backend_features not in __path__:
    __path__.append(backend_features)

from ml.features.schema import CANONICAL_FEATURES, FeatureDefinition, FeatureType, LifecycleStage
from ml.features.builder import FeatureBuilder
from ml.features.financial import compute_financial_features, safe_ratio
from ml.features.progress import compute_progress_features
from ml.features.procurement import compute_procurement_features
from ml.features.contractor import compute_contractor_features
from ml.features.temporal import compute_temporal_features
from ml.features.documentation import compute_documentation_features

try:
    from ml.features.feature_engineer import FeatureEngineer, FEATURE_NAMES
except ImportError:
    FeatureEngineer = None
    FEATURE_NAMES = CANONICAL_FEATURES

__all__ = [
    "CANONICAL_FEATURES",
    "FeatureDefinition",
    "FeatureType",
    "LifecycleStage",
    "FeatureBuilder",
    "FeatureEngineer",
    "FEATURE_NAMES",
    "compute_financial_features",
    "compute_progress_features",
    "compute_procurement_features",
    "compute_contractor_features",
    "compute_temporal_features",
    "compute_documentation_features",
    "safe_ratio",
]
