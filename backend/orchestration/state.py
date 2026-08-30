"""
backend/orchestration/state.py
Shared Strongly-Typed State Definition for Sanchay AI LangGraph Pipeline.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional, TypedDict


class SanchayState(TypedDict, total=False):
    """
    Central state dictionary flowing through the LangGraph multi-agent orchestration graph.
    All data is serializable for persistence and checkpointing.
    """
    # Core identifiers & metadata
    request_id: str
    project_id: str
    prediction_timestamp: str
    trace_id: str
    model_version: str
    risk_policy_version: str
    
    # Input payloads & normalized features
    project_data: Dict[str, Any]
    normalized_data: Dict[str, Any]
    feature_vector: List[float]
    feature_dict: Dict[str, Any]
    active_domains: List[str]
    
    # Specialist agent findings
    data_quality_findings: List[Dict[str, Any]]
    compliance_findings: List[Dict[str, Any]]
    financial_findings: List[Dict[str, Any]]
    procurement_findings: List[Dict[str, Any]]
    contractor_findings: List[Dict[str, Any]]
    progress_findings: List[Dict[str, Any]]
    anomaly_findings: List[Dict[str, Any]]
    graph_findings: List[Dict[str, Any]]
    
    # ML & Statistical Models
    ml_prediction: Dict[str, Any]
    shap_explanations: List[Dict[str, Any]]
    
    # Risk Fusion & Evidence Synthesis
    risk_components: Dict[str, float]
    risk_score: float
    risk_level: str
    severity_label: str
    audit_verdict: str
    regulatory_evidence: List[Dict[str, Any]]
    
    # Actionable Audit Outputs
    final_explanation: str
    investigation_plan: Dict[str, Any]
    recommended_actions: List[str]
    
    # Human-in-the-Loop & Governance
    human_review_required: bool
    human_decision: Optional[Dict[str, Any]]
    workflow_status: str  # "completed" | "awaiting_human_review" | "degraded" | "error"
    
    # Observability & Tracing
    completed_nodes: List[str]
    node_durations: Dict[str, float]
    errors: List[Dict[str, Any]]
    warnings: List[Dict[str, Any]]
    
    # Retries and loop bounds
    evidence_retries: int
