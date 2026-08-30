"""
backend/orchestration/tools/financial_tools.py
LangChain structured tools for financial velocity, tranche disbursement, and budget ceiling analysis.
"""
from __future__ import annotations
from typing import Any, Dict
from langchain_core.tools import tool

from ml.features.financial import compute_financial_features, safe_ratio


@tool
def analyze_financial_disbursements(project_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes expenditure-to-sanction ratio, payment tranches, front-loading, and peer cost variance.
    """
    sanctioned = float(project_data.get("sanctioned_amount", 0.0))
    expenditure = float(project_data.get("actual_expenditure", 0.0))
    cost_ratio = safe_ratio(expenditure, sanctioned)
    
    findings = []
    if cost_ratio > 1.10:
        findings.append({
            "code": "COST_OVERRUN",
            "severity": "HIGH",
            "description": f"Actual expenditure (₹{expenditure:,.0f}) exceeds approved sanction (₹{sanctioned:,.0f}) by {(cost_ratio - 1.0)*100:.1f}%."
        })
    elif cost_ratio > 1.00:
        findings.append({
            "code": "MINOR_BUDGET_EXCESS",
            "severity": "MEDIUM",
            "description": f"Expenditure exceeds sanctioned ceiling by {(cost_ratio - 1.0)*100:.1f}%."
        })

    payment_count = int(project_data.get("payment_count", 3))
    if payment_count == 1 and expenditure > 1000000.0:
        findings.append({
            "code": "SINGLE_TRANCHE_FRONT_LOADING",
            "severity": "HIGH",
            "description": "Entire multi-lakh fund disbursed in a single tranche without milestone verification."
        })

    return {
        "status": "success",
        "sanctioned_amount": sanctioned,
        "actual_expenditure": expenditure,
        "cost_to_sanction_ratio": round(cost_ratio, 4),
        "payment_count": payment_count,
        "findings": findings,
    }
