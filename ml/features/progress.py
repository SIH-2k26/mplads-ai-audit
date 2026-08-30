"""
ml/features/progress.py
Physical and Financial Progress & Velocity Features for Sanchay AI.
"""
from __future__ import annotations
from typing import Dict
import numpy as np


def compute_progress_features(
    physical_prog: float,
    financial_prog: float,
    planned_days: float,
    actual_days: float,
) -> Dict[str, float]:
    phys = float(np.clip(physical_prog, 0.0, 100.0))
    fin = float(np.clip(financial_prog, 0.0, 150.0))
    p_days = max(1.0, float(planned_days))
    a_days = max(1.0, float(actual_days))

    gap = float(fin - phys)
    delay_days = max(0.0, a_days - p_days)
    delay_ratio = float(delay_days / p_days)

    fin_velocity = float(fin / a_days)
    phys_velocity = float(phys / a_days)
    proj_velocity = float((phys + fin) / (2.0 * a_days))
    velocity_mismatch = float(abs(fin_velocity - phys_velocity))

    return {
        "physical_progress": phys,
        "financial_progress": fin,
        "financial_physical_gap": gap,
        "planned_duration_days": p_days,
        "actual_duration_days": a_days,
        "delay_days": delay_days,
        "delay_ratio": delay_ratio,
        "project_velocity": proj_velocity,
        "financial_velocity": fin_velocity,
        "physical_velocity": phys_velocity,
        "velocity_mismatch": velocity_mismatch,
        "progress_acceleration": 0.0,
        "progress_deceleration": 1.0 if gap > 25.0 and delay_days > 30 else 0.0,
    }
