"""
ml package initialization
Extends __path__ so ml.* seamlessly resolves modules from both ./backend/ml and ./ml.
"""
import sys
import os

backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

backend_ml = os.path.join(backend_path, "ml")
if os.path.isdir(backend_ml) and backend_ml not in __path__:
    __path__.insert(0, backend_ml)

from ml.ensemble import HybridRiskEnsemble
from ml.inference import ModelInferenceService
from ml.preprocessing import safe_ratio, clip_bounds

__all__ = ["HybridRiskEnsemble", "ModelInferenceService", "safe_ratio", "clip_bounds"]
