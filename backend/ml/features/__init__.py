"""
backend/ml/features/__init__.py
"""
import os
import sys

# Extend __path__ to include root ml/features
root_feat_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../ml/features"))
if os.path.isdir(root_feat_dir) and root_feat_dir not in __path__:
    __path__.append(root_feat_dir)

try:
    from .feature_engineer import FeatureEngineer, FEATURE_NAMES
    from .feature_pipeline import FeaturePipeline
except ImportError:
    FeatureEngineer = None
    FEATURE_NAMES = []
    FeaturePipeline = None

from ml.features.schema import CANONICAL_FEATURES, FeatureDefinition, FeatureType, LifecycleStage
from ml.features.builder import FeatureBuilder
from ml.features.financial import compute_financial_features, safe_ratio
from ml.features.progress import compute_progress_features
from ml.features.procurement import compute_procurement_features
from ml.features.contractor import compute_contractor_features
from ml.features.temporal import compute_temporal_features
from ml.features.documentation import compute_documentation_features

__all__ = [
    "FeatureEngineer",
    "FEATURE_NAMES",
    "FeaturePipeline",
    "CANONICAL_FEATURES",
    "FeatureDefinition",
    "FeatureType",
    "LifecycleStage",
    "FeatureBuilder",
    "compute_financial_features",
    "compute_progress_features",
    "compute_procurement_features",
    "compute_contractor_features",
    "compute_temporal_features",
    "compute_documentation_features",
    "safe_ratio",
]
