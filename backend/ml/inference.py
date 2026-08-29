"""
backend/ml/inference.py
Standardized Model Inference Service wrapper forwarding to canonical ml.inference.
"""
from __future__ import annotations
from ml.inference import ModelInferenceService, safe_ratio, clip_bounds

__all__ = ["ModelInferenceService", "safe_ratio", "clip_bounds"]
