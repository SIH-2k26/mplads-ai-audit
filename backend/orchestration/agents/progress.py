"""
backend/orchestration/agents/progress.py
Physical & Progress Execution Agent Node for Sanchay AI LangGraph workflow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState
from ml.features.progress import compute_progress_features
from ml.features.financial import safe_ratio


def progress_node(state: SanchayState) -> Dict[str, Any]:
    """
    Analyzes physical vs financial progress gap, milestone stagnation, and timeline delay days.
    """
    proj = state.get("project_data", {})
    phys = float(proj.get("physical_progress", 0.0) or 0.0)
    fin = float(proj.get("financial_progress", 0.0) or 0.0)
    delay_days = int(proj.get("delay_days", 0) or 0)
    gap = fin - phys

    findings: List[Dict[str, Any]] = []
    if gap >= 40.0:
        findings.append({
            "category": "PROGRESS",
            "code": "CRITICAL_PROGRESS_DIVERGENCE",
            "severity": "CRITICAL",
            "description": f"Severe progress divergence: financial expenditure ({fin:.1f}%) leads physical execution ({phys:.1f}%) by {gap:.1f}% on site.",
        })
    elif gap >= 20.0:
        findings.append({
            "category": "PROGRESS",
            "code": "PROGRESS_GAP",
            "severity": "HIGH",
            "description": f"Financial disbursement leads verified physical progress by {gap:.1f}%.",
        })

    if delay_days > 180:
        findings.append({
            "category": "PROGRESS",
            "code": "EXTREME_SCHEDULE_DELAY",
            "severity": "HIGH",
            "description": f"Project completion is delayed by {delay_days} days past the sanctioned deadline.",
        })
    elif delay_days > 60:
        findings.append({
            "category": "PROGRESS",
            "code": "SCHEDULE_SLIPPAGE",
            "severity": "MEDIUM",
            "description": f"Project is delayed by {delay_days} days.",
        })

    completed = state.get("completed_nodes", []) + ["progress"]
    return {
        "progress_findings": findings,
        "completed_nodes": completed,
    }
