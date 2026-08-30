"""
backend/orchestration/tools/procurement_tools.py
LangChain structured tools for procurement bidding, L1-L2 spread compression, and single-bid analysis.
"""
from __future__ import annotations
from typing import Any, Dict
from langchain_core.tools import tool

from ml.features.procurement import compute_procurement_features


@tool
def analyze_procurement_bidding(project_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates tender participation, single-bid status, and competitive price spread compression.
    """
    bid_count = int(project_data.get("bid_count", 4))
    single_bid = 1 if (bid_count <= 1 or int(project_data.get("single_bid_flag", 0)) == 1) else 0
    tender_spread = float(project_data.get("tender_spread_pct", 0.05))
    
    findings = []
    if single_bid == 1:
        findings.append({
            "code": "SINGLE_BID_AWARD",
            "severity": "HIGH",
            "description": "Contract awarded on a single bid without competitive market price discovery (GFR Rule 149 / CVC Circular)."
        })
    elif tender_spread < 0.015 and bid_count >= 2:
        findings.append({
            "code": "PRICE_SPREAD_COMPRESSION",
            "severity": "MEDIUM",
            "description": f"Extremely narrow L1-L2 bid variance ({tender_spread*100:.2f}%) indicative of potential cartel bidding."
        })

    return {
        "status": "success",
        "bid_count": bid_count,
        "single_bid_flag": single_bid,
        "tender_spread_pct": tender_spread,
        "findings": findings,
    }
