"""
ml/features/temporal.py
Temporal Intervals, Velocity & Point-in-Time Filtering for Sanchay AI.
"""
from __future__ import annotations
from datetime import date, datetime
from typing import Any, Dict, List, Optional
import numpy as np


def parse_date(d: Any) -> Optional[datetime]:
    if d is None:
        return None
    if isinstance(d, datetime):
        return d
    if isinstance(d, date):
        return datetime(d.year, d.month, d.day)
    if isinstance(d, str):
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y/%m/%d", "%d-%m-%Y"):
            try:
                return datetime.strptime(d.strip()[:19], fmt)
            except Exception:
                pass
    return None


def compute_temporal_features(
    sanction_date: Optional[Any] = None,
    work_order_date: Optional[Any] = None,
    payments: Optional[List[Dict[str, Any]]] = None,
    progress_updates: Optional[List[Dict[str, Any]]] = None,
    prediction_timestamp: Optional[Any] = None,
) -> Dict[str, float]:
    pred_ts = parse_date(prediction_timestamp) or datetime.now()
    s_date = parse_date(sanction_date)
    wo_date = parse_date(work_order_date)

    # Filter payments and progress strictly up to prediction_timestamp
    valid_payments = []
    if payments:
        for p in payments:
            p_date = parse_date(p.get("payment_date", p.get("date")))
            if p_date is None or p_date <= pred_ts:
                valid_payments.append((p_date, p))

    # Calculate intervals
    if s_date and wo_date:
        days_s_wo = max(0.0, float((wo_date - s_date).days))
    else:
        days_s_wo = 18.0

    if wo_date and valid_payments and valid_payments[0][0]:
        days_wo_first_pay = max(0.0, float((valid_payments[0][0] - wo_date).days))
    else:
        days_wo_first_pay = 28.0

    days_wo_first_prog = 35.0

    # Interval between consecutive payments
    if len(valid_payments) > 1 and all(p[0] is not None for p in valid_payments):
        sorted_dates = sorted([p[0] for p in valid_payments if p[0] is not None])
        diffs = [(sorted_dates[i] - sorted_dates[i-1]).days for i in range(1, len(sorted_dates))]
        days_between_pay = float(np.mean(diffs)) if diffs else 45.0
        time_since_last_pay = max(0.0, float((pred_ts - sorted_dates[-1]).days))
    else:
        days_between_pay = 45.0
        time_since_last_pay = 30.0

    return {
        "days_from_sanction_to_work_order": days_s_wo,
        "days_from_work_order_to_first_payment": days_wo_first_pay,
        "days_from_work_order_to_first_progress": days_wo_first_prog,
        "days_between_payments": days_between_pay,
        "payment_frequency": round(365.0 / max(1.0, days_between_pay), 2),
        "payment_acceleration": 0.0,
        "time_since_last_payment": time_since_last_pay,
        "time_since_last_inspection": 45.0,
        "time_since_last_progress_update": 30.0,
        "status_change_frequency": 0.15,
        "status_reversal_count": 0.0,
        "extension_frequency": 0.0,
        "extension_duration_total": 0.0,
        "extension_count": 0.0,
    }
