"""
backend/ml package initialization
"""
import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

try:
    from ml.ensemble import HybridRiskEnsemble
    from ml.inference import ModelInferenceService
    from ml.preprocessing import safe_ratio, clip_bounds
except ImportError:
    pass
