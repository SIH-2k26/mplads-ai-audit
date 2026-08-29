"""
backend/orchestration/agents/explanation.py
Audit Explanation & Synthesis Agent Node for Sanchay AI LangGraph workflow.
Generates neutral, evidence-grounded plain-language summaries for auditors.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState


def explanation_node(state: SanchayState) -> Dict[str, Any]:
    """
    Synthesizes multi-agent findings, risk fusion scores, SHAP explanations, and statutory citations
    into a professional executive audit narrative.
    """
    score = state.get("risk_score", 25.0)
    level = state.get("risk_level", "LOW")
    findings = (
        state.get("compliance_findings", []) +
        state.get("financial_findings", []) +
        state.get("procurement_findings", []) +
        state.get("progress_findings", []) +
        state.get("anomaly_findings", [])
    )
    shaps = state.get("shap_explanations", [])
    citations = state.get("regulatory_evidence", [])

    # Synthesize plain-language summary
    if score >= 70.0:
        headline = f"CRITICAL RISK AUDIT ALERT (Score: {score}/100) — Significant statutory and milestone anomalies detected."
    elif score >= 50.0:
        headline = f"HIGH RISK ADVISORY (Score: {score}/100) — Operational delays and procurement irregularities flagged for verification."
    elif score >= 35.0:
        headline = f"MEDIUM RISK NOTICE (Score: {score}/100) — Minor procedural deviations noted; desk audit recommended."
    else:
        headline = f"STANDARD COMPLIANCE (Score: {score}/100) — Project telemetry conforms to approved administrative sanction."

    key_points = []
    for f in findings[:4]:
        key_points.append(f"- {f.get('description', '')}")

    shap_points = []
    for s in shaps[:3]:
        shap_points.append(f"- {s.get('feature', '')}: {s.get('explanation', '')}")

    narrative = f"""### {headline}

**Key Risk Indicators:**
{chr(10).join(key_points) if key_points else '- No critical risk indicators observed.'}

**Primary Feature Drivers:**
{chr(10).join(shap_points) if shap_points else '- Feature contributions within standard operating envelope.'}

**Statutory Basis:**
{f'- Grounded in {len(citations)} statutory citation(s) from MPLADS Guidelines and GFR 2017.' if citations else '- Standard routine monitoring provisions apply.'}
"""

    completed = state.get("completed_nodes", []) + ["explanation"]
    return {
        "final_explanation": narrative.strip(),
        "completed_nodes": completed,
    }
