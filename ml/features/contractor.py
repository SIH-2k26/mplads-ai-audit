"""
ml/features/contractor.py
Contractor Profile, Historical Performance & Capacity Strain Features for Sanchay AI.
"""
from __future__ import annotations
from typing import Any, Dict, Optional


def compute_contractor_features(
    contractor_dict: Optional[Dict[str, Any]] = None,
    sanction_amount: float = 2500000.0,
) -> Dict[str, float]:
    c = contractor_dict or {}
    total_proj = float(c.get("total_projects", c.get("contractor_total_projects", 10.0)))
    comp_proj = float(c.get("completed_projects", c.get("contractor_completed_projects", 8.0)))
    del_proj = float(c.get("delayed_projects", c.get("contractor_delayed_projects", 1.0)))
    ab_proj = float(c.get("abandoned_projects", c.get("contractor_abandoned_projects", 0.0)))

    irr_rate = float(c.get("past_irregularity_rate", c.get("contractor_past_irregularity_rate", 0.04)))
    win_rate = float(c.get("win_rate", c.get("contractor_win_rate", 0.35)))
    market_share = float(c.get("market_share", c.get("contractor_market_share", 0.08)))
    capacity_strain = float(c.get("capacity_strain", c.get("contractor_capacity_strain", 1.0)))

    return {
        "contractor_total_projects": total_proj,
        "contractor_completed_projects": comp_proj,
        "contractor_delayed_projects": del_proj,
        "contractor_abandoned_projects": ab_proj,
        "contractor_total_value": total_proj * sanction_amount,
        "contractor_average_project_value": sanction_amount,
        "contractor_max_project_value": sanction_amount * 1.5,
        "contractor_win_rate": win_rate,
        "contractor_repeat_winner_rate": float(c.get("repeat_winner_rate", 0.25)),
        "contractor_single_bid_win_rate": float(c.get("single_bid_win_rate", 0.10)),
        "contractor_competitor_count": 6.0,
        "contractor_avg_delay": float(c.get("avg_delay_days", 14.0)),
        "contractor_avg_cost_overrun": float(c.get("avg_cost_overrun_pct", 2.5)),
        "contractor_avg_payment_velocity": sanction_amount / 3.0,
        "contractor_irregularity_score": irr_rate * 100.0,
        "contractor_state_count": 1.0,
        "contractor_district_count": 2.0,
        "contractor_constituency_count": 3.0,
        "contractor_project_concentration": 0.30,
        "contractor_client_concentration": 0.40,
        "contractor_agency_count": 2.0,
        "contractor_agency_repeat_rate": 0.50,
        "contractor_agency_win_rate": 0.45,
        "contractor_district_repeat_rate": 0.60,
        "contractor_constituency_repeat_rate": 0.50,
        "contractor_pair_frequency": 0.10,
        "agency_contractor_network_density": 0.20,
        "contractor_market_share": market_share,
        "contractor_capacity_strain": capacity_strain,
        "contractor_past_irregularity_rate": irr_rate,
    }
