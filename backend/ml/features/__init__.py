"""
backend/ml/features/__init__.py
"""
import importlib.util
import os

try:
    from .feature_engineer import FeatureEngineer, FEATURE_NAMES
    from .feature_pipeline import FeaturePipeline
except ImportError:
    pass

# Dynamically load build_comprehensive_feature_matrix from root ml/features.py
root_feat_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../ml/features.py"))
if os.path.exists(root_feat_file):
    spec = importlib.util.spec_from_file_location("root_features_mod", root_feat_file)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    build_comprehensive_feature_matrix = getattr(mod, "build_comprehensive_feature_matrix", None)
