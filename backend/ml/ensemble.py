"""
backend/ml/ensemble.py
Hybrid Risk Ensemble wrapper forwarding to canonical ml.ensemble.
"""
from __future__ import annotations
import os
import sys
import importlib.util

_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _root not in sys.path:
    sys.path.insert(0, _root)

_spec = importlib.util.spec_from_file_location("root_ml_ensemble", os.path.join(_root, "ml", "ensemble.py"))
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

HybridRiskEnsemble = _mod.HybridRiskEnsemble

__all__ = ["HybridRiskEnsemble"]

