"""
ml/features/procurement.py
Procurement, Tender Spread & Bidding Risk Features for Sanchay AI.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
import numpy as np


def compute_procurement_features(
    bid_count: int,
    single_bid_flag: Optional[int] = None,
    bids: Optional[List[Dict[str, Any]]] = None,
    tender_amount: Optional[float] = None,
    estimated_cost: Optional[float] = None,
) -> Dict[str, float]:
    b_count = max(1, int(bid_count))
    s_bid = 1.0 if (single_bid_flag == 1 or b_count == 1) else 0.0

    if bids and len(bids) > 1:
        bid_vals = [float(b.get("amount", b.get("bid_amount", 0.0))) for b in bids]
        bid_vals = sorted([b for b in bid_vals if b > 0])
        if len(bid_vals) >= 2:
            spread = float(bid_vals[-1] - bid_vals[0])
            variance = float(np.var(bid_vals))
            stddev = float(np.std(bid_vals))
            ratio = float(bid_vals[1] / max(1.0, bid_vals[0]))
        else:
            spread, variance, stddev, ratio = 0.0, 0.0, 0.0, 1.0
    else:
        spread, variance, stddev, ratio = 0.0, 0.0, 0.0, 1.0

    proc_risk = 0.85 if s_bid == 1.0 else max(0.05, 1.0 / b_count)
    comp_score = 0.15 if s_bid == 1.0 else min(1.0, b_count * 0.25)

    return {
        "bid_count": float(b_count),
        "single_bid_flag": s_bid,
        "lowest_bid_deviation": 0.02 if s_bid == 0 else 0.0,
        "second_lowest_bid_deviation": 0.05 if s_bid == 0 else 0.0,
        "winning_vs_second_bid_ratio": ratio,
        "bid_spread": spread,
        "bid_variance": variance,
        "bid_stddev": stddev,
        "bidder_concentration": 1.0 if s_bid == 1 else round(1.0 / b_count, 3),
        "bidder_repeat_participation": 0.25,
        "new_bidder_flag": 0.0,
        "new_contractor_flag": 0.0,
        "incumbent_winner_flag": 0.0,
        "same_contractor_previous_tender_flag": 0.0,
        "tender_competition_score": comp_score,
        "procurement_risk_score": proc_risk,
        "tender_extension_count": 0.0,
        "tender_cancellation_count": 0.0,
        "tender_reissue_count": 0.0,
        "winning_bid_deviation": 0.02,
        "bidder_price_similarity": 0.05,
        "tender_duration_days": 21.0,
        "retender_count": 0.0,
        "repeat_winner_rate": 0.20,
    }
