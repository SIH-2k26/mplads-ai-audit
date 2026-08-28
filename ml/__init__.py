"""
ml package initialization
"""
import sys
import os

# Ensure backend modules are discoverable
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from ml.ensemble import HybridRiskEnsemble

try:
    import backend.ml.datasets as datasets
    import backend.ml.explainability as explainability
    import backend.ml.registry as registry
    import backend.ml.training as training
except Exception:
    pass

__all__ = ["HybridRiskEnsemble"]
