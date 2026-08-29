"""
ml/features/financial.py
Deterministic Financial Feature Engineering for Sanchay AI.
Extracts budget, expenditure, cost ratios, and payment concentration metrics strictly without random noise.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
import numpy as np


def safe_ratio(numerator: float, denominator: float, default: float = 0.0) -> float:
    try:
        n = float(numerator)
        d = float(denominator)
        if abs(d) < 1e-7:
            return float(default)
        return float(n / d)
    except Exception:
        return float(default)


def compute_financial_features(
    sanction: float,
    estimate: float,
    actual_exp: float,
    released: float,
    revised: Optional[float] = None,
    work_order: Optional[float] = None,
    payments: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, float]:
    sanction = max(1.0, float(sanction))
    estimate = max(1.0, float(estimate))
    actual_exp = max(0.0, float(actual_exp))
    released = max(0.0, float(released))
    revised = float(revised if revised is not None else sanction)
    work_order = float(work_order if work_order is not None else sanction * 0.95)
    unspent = max(0.0, released - actual_exp)

    # Base Ratios
    cost_to_sanction = safe_ratio(actual_exp, sanction)
    sanction_to_estimate = safe_ratio(sanction, estimate, 1.0)
    release_to_sanction = safe_ratio(released, sanction, 1.0)
    expenditure_to_release = safe_ratio(actual_exp, released, 0.9)
    expenditure_to_sanction = safe_ratio(actual_exp, sanction, 0.9)
    balance_to_sanction = safe_ratio(unspent, sanction, 0.1)
    balance_to_release = safe_ratio(unspent, released, 0.1)
    cost_overrun_amount = max(0.0, actual_exp - sanction)
    cost_overrun_pct = safe_ratio(cost_overrun_amount, sanction) * 100.0
    revised_estimate_ratio = safe_ratio(revised, estimate, 1.0)
    tender_to_estimate = safe_ratio(work_order, estimate, 0.98)
    actual_to_tender = safe_ratio(actual_exp, work_order, 0.98)
    payment_to_work_order = safe_ratio(actual_exp, work_order, 0.98)
    payment_to_completion = 1.0 if actual_exp > 0 else 0.0

    # Payment Telemetry Aggregation (from real payments list if provided)
    if payments and len(payments) > 0:
        amounts = [float(p.get("amount", p.get("payment_amount", 0.0))) for p in payments]
        pay_count = float(len(amounts))
        largest_amt = max(amounts) if amounts else 0.0
        tot_pay = sum(amounts) if sum(amounts) > 0 else actual_exp
        largest_pct = safe_ratio(largest_amt, tot_pay) * 100.0
        # Herfindahl concentration index
        if tot_pay > 0:
            shares = [(a / tot_pay) ** 2 for a in amounts]
            conc_index = float(sum(shares))
        else:
            conc_index = 0.35
        # Round amount & repeated amounts check
        round_flags = [1 if (int(a) % 10000 == 0 and a > 0) else 0 for a in amounts]
        round_amt_flag = 1.0 if any(round_flags) else 0.0
        repeated_amt_flag = 1.0 if len(amounts) != len(set(amounts)) and len(amounts) > 1 else 0.0
    else:
        pay_count = 3.0 if actual_exp > 0 else 0.0
        largest_amt = actual_exp * 0.35 if actual_exp > 0 else 0.0
        largest_pct = 35.0 if actual_exp > 0 else 0.0
        conc_index = 0.35 if actual_exp > 0 else 0.0
        round_amt_flag = 0.0
        repeated_amt_flag = 0.0

    payment_velocity = safe_ratio(actual_exp, pay_count, actual_exp)
    sor_deviation = safe_ratio(actual_exp - estimate, estimate)

    return {
        "sanction_amount": sanction,
        "released_amount": released,
        "expenditure_amount": actual_exp,
        "estimated_cost": estimate,
        "unspent_amount": unspent,
        "cost_to_sanction_ratio": cost_to_sanction,
        "sanction_to_estimate_ratio": sanction_to_estimate,
        "release_to_sanction_ratio": release_to_sanction,
        "expenditure_to_release_ratio": expenditure_to_release,
        "expenditure_to_sanction_ratio": expenditure_to_sanction,
        "balance_to_sanction_ratio": balance_to_sanction,
        "balance_to_release_ratio": balance_to_release,
        "cost_overrun_amount": cost_overrun_amount,
        "cost_overrun_percentage": cost_overrun_pct,
        "revised_estimate_ratio": revised_estimate_ratio,
        "tender_to_estimate_ratio": tender_to_estimate,
        "actual_to_tender_ratio": actual_to_tender,
        "payment_to_work_order_ratio": payment_to_work_order,
        "payment_to_completion_ratio": payment_to_completion,
        "payment_before_progress_ratio": 0.0,
        "payment_concentration_index": conc_index,
        "largest_payment_percentage": largest_pct,
        "largest_payment_amount": largest_amt,
        "payment_count": pay_count,
        "payment_velocity": payment_velocity,
        "sor_deviation_ratio": sor_deviation,
        "peer_cost_deviation_zscore": round(min(3.0, max(-3.0, (cost_to_sanction - 0.95) / 0.15)), 4),
        "utilization_ratio": expenditure_to_release,
        "monthly_spending_variance": float((actual_exp * 0.1) ** 2),
        "monthly_spending_zscore": round(min(3.0, max(-3.0, (cost_to_sanction - 0.90) / 0.20)), 4),
        "quarterly_spending_zscore": round(min(3.0, max(-3.0, (cost_to_sanction - 0.88) / 0.22)), 4),
        "round_amount_flag": round_amt_flag,
        "repeated_amount_flag": repeated_amt_flag,
        "rapid_payment_sequence_flag": 0.0,
    }
