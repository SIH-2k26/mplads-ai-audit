"""
ml/preprocessing.py
Robust Preprocessing, Zero-Division Safe Utilities & Normalization for MPLADS ML Pipeline.
"""
from __future__ import annotations
import math
from typing import Any, Dict, Union
import numpy as np


def safe_ratio(numerator: Union[float, int, np.ndarray], denominator: Union[float, int, np.ndarray], default: float = 0.0) -> Union[float, np.ndarray]:
    """
    Computes numerator / denominator safely preventing DivisionByZero, NaN, and Infinite values.
    """
    if isinstance(numerator, np.ndarray) or isinstance(denominator, np.ndarray):
        denom_safe = np.where(np.abs(denominator) < 1e-7, 1.0, denominator)
        res = np.where(np.abs(denominator) < 1e-7, default, numerator / denom_safe)
        return np.nan_to_num(res, nan=default, posinf=default, neginf=default)

    if denominator is None or abs(float(denominator)) < 1e-7:
        return default
    try:
        val = float(numerator) / float(denominator)
        if math.isnan(val) or math.isinf(val):
            return default
        return val
    except Exception:
        return default


def clip_bounds(val: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    """Clips numerical values to allowed logical domain bounds."""
    try:
        return max(min_val, min(max_val, float(val)))
    except Exception:
        return min_val
