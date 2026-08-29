"""
backend/orchestration/supervisor.py
Central Supervisor Node for Sanchay AI LangGraph workflow.
Inspects data completeness, determines active domain subgraphs, and coordinates execution flow.
"""
from __future__ import annotations
from typing import Any, Dict, List

from backend.orchestration.state import SanchayState
from ml.features.builder import FeatureBuilder


def supervisor_node(state: SanchayState) -> Dict[str, Any]:
    """
    Supervisor node inspects normalized project data, computes canonical 176 features,
    and dynamically identifies available specialist domains.
    """
    proj = state.get("project_data", {})
    doc_dict = state.get("normalized_data", {}).get("documents", {})
    
    # Extract canonical feature dictionary using canonical FeatureBuilder
    builder = FeatureBuilder()
    feat_dict = builder.extract_features_dict(
        project_dict=proj,
        doc_dict=doc_dict,
        prediction_timestamp=state.get("prediction_timestamp")
    )
    feat_vector = builder.build_feature_vector(
        project_dict=proj,
        doc_dict=doc_dict,
        prediction_timestamp=state.get("prediction_timestamp")
    ).tolist()

    # Determine active domains based on data presence
    active_domains: List[str] = ["financial", "compliance"]
    
    if "bid_count" in proj or "tender_amount" in proj or "single_bid_flag" in proj:
        active_domains.append("procurement")
    if "contractor_id" in proj or "contractor_name" in proj or "contractor_past_irregularity_rate" in proj:
        active_domains.append("contractor")
    if "physical_progress" in proj or "delay_days" in proj:
        active_domains.append("progress")

    completed = state.get("completed_nodes", []) + ["supervisor"]
    return {
        "feature_dict": feat_dict,
        "feature_vector": feat_vector,
        "active_domains": active_domains,
        "completed_nodes": completed,
    }
