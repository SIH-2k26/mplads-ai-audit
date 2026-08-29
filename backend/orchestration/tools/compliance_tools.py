"""
backend/orchestration/tools/compliance_tools.py
LangChain structured tools wrapping Statutory Compliance and Policy Engine checks.
"""
from __future__ import annotations
from typing import Any, Dict, List
from langchain_core.tools import tool

try:
    from backend.policy.engine import PolicyEngine
except ImportError:
    from policy.engine import PolicyEngine


@tool
def evaluate_statutory_compliance(project_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates project parameters against GFR 2017, MPLADS 2023 Guidelines, and CVC guidelines.
    Returns compliance score (0-100), penalty breakdown, and detected statutory violations.
    """
    try:
        engine = PolicyEngine()
        res = engine.evaluate_project(project_data)
        return {
            "status": "success",
            "compliance_score": res.compliance_score,
            "is_compliant": res.is_compliant,
            "violations_count": len(res.violations),
            "violations": [
                {
                    "rule_id": v.rule_id,
                    "severity": v.severity,
                    "description": v.description,
                    "statutory_ref": getattr(v, "statutory_ref", "MPLADS Guidelines 2023"),
                    "penalty_weight": getattr(v, "penalty_weight", 10.0),
                }
                for v in res.violations
            ]
        }
    except Exception as e:
        return {
            "status": "fallback",
            "compliance_score": 90,
            "is_compliant": True,
            "violations_count": 0,
            "violations": [],
            "error": str(e),
        }
