"""
backend/ml/inference.py
Standardized Model Inference Service wrapper forwarding to canonical ml.inference.
"""
from __future__ import annotations
import os
import sys
import importlib.util

_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _root not in sys.path:
    sys.path.insert(0, _root)

_spec = importlib.util.spec_from_file_location("root_ml_inference", os.path.join(_root, "ml", "inference.py"))
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)

ModelInferenceService = _mod.ModelInferenceService
safe_ratio = getattr(_mod, "safe_ratio", None)
clip_bounds = getattr(_mod, "clip_bounds", None)

__all__ = ["ModelInferenceService", "safe_ratio", "clip_bounds"]

