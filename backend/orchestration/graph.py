"""
backend/orchestration/graph.py
LangGraph Stateful Multi-Agent Orchestration Pipeline for Sanchay AI.
Combines LangGraph stateful graph execution with backward-compatible digital twin orchestrator.
"""
from __future__ import annotations
import os
import sys
import uuid
from datetime import datetime, date, timezone
from typing import Any, Dict, List, Optional, TypedDict, Union

from langgraph.graph import StateGraph, START, END

from backend.orchestration.state import SanchayState
from backend.orchestration.supervisor import supervisor_node
from backend.orchestration.router import route_after_data_quality, route_after_investigation
from backend.orchestration.persistence.checkpoint import get_checkpointer, record_trace
from backend.orchestration.agents.data_quality import data_quality_node
from backend.orchestration.agents.compliance import compliance_node
from backend.orchestration.agents.financial import financial_node
from backend.orchestration.agents.procurement import procurement_node
from backend.orchestration.agents.contractor import contractor_node
from backend.orchestration.agents.progress import progress_node
from backend.orchestration.agents.anomaly import anomaly_node
from backend.orchestration.agents.evidence import evidence_node
from backend.orchestration.agents.explanation import explanation_node
from backend.orchestration.agents.investigation import investigation_node

from ml.ensemble import HybridRiskEnsemble

# Imports for Digital Twin and SystemState support
from models.agent import AgentContext, AgentEvidence
from models.digital_twin import ProjectDigitalTwin
from models.enums import RiskLevel, ProjectStatus
from models.graph import GraphResult
from models.investigation import InvestigationIntake, InvestigationCase
from models.risk import RiskOutput
from engine import DynamicWeightEngine, EvidenceFusionEngine, RiskTrajectoryEngine, EarlyWarningEngine
from policy.engine import PolicyEngine
from nlp import NLPExplanationEngine
from investigation.service import InvestigationService

# Import Part A Agents (9)
from agents.deterministic.budget import BudgetAgent
from agents.deterministic.data_quality import DataQualityAgent
from agents.deterministic.deadline import DeadlineAgent
from agents.deterministic.documentation import DocumentationAgent
from agents.deterministic.eligibility import EligibilityAgent
from agents.deterministic.procurement import ProcurementAgent
from agents.intelligence.contractor_intelligence import ContractorIntelligenceAgent
from agents.intelligence.geographic_intelligence import GeographicIntelligenceAgent
from agents.intelligence.duplicate_ghost_work import DuplicateGhostWorkAgent

# Import Part B Agents (10)
from agents.part_b import (
    PaymentAgent,
    FinancialProgressAgent,
    PhysicalProgressAgent,
    AssetCompletionAgent,
    CostIntelligenceAgent,
    AnomalyAgent,
    DelayPredictionAgent,
    TrendBenchmarkAgent,
    FraudArchetypeAgent,
    RAGAgent,
)

ALL_SYSTEM_AGENTS = [
    DataQualityAgent,
    EligibilityAgent,
    BudgetAgent,
    DeadlineAgent,
    DocumentationAgent,
    ProcurementAgent,
    ContractorIntelligenceAgent,
    GeographicIntelligenceAgent,
    DuplicateGhostWorkAgent,
    PaymentAgent,
    FinancialProgressAgent,
    PhysicalProgressAgent,
    AssetCompletionAgent,
    CostIntelligenceAgent,
    AnomalyAgent,
    DelayPredictionAgent,
    TrendBenchmarkAgent,
    FraudArchetypeAgent,
    RAGAgent,
]


def normalize_data_node(state: SanchayState) -> Dict[str, Any]:
    """Normalizes incoming project and document payloads into standard format."""
    proj = state.get("project_data", {})
    if "project" in proj:
        project_dict = dict(proj["project"])
        doc_dict = dict(proj.get("documents", {}))
    else:
        project_dict = dict(proj)
        doc_dict = dict(state.get("normalized_data", {}).get("documents", {}))

    # Field aliases mapping
    if "sanction_amount" in project_dict and "sanctioned_amount" not in project_dict:
        project_dict["sanctioned_amount"] = project_dict["sanction_amount"]
    if "actual_cost" in project_dict and "actual_expenditure" not in project_dict:
        project_dict["actual_expenditure"] = project_dict["actual_cost"]
    elif "total_expenditure" in project_dict and "actual_expenditure" not in project_dict:
        project_dict["actual_expenditure"] = project_dict["total_expenditure"]

    # Documents flags mapping
    if doc_dict:
        if not doc_dict.get("measurement_book", True):
            project_dict["missing_mb_flag"] = 1
        if not doc_dict.get("utilization_certificate", True):
            project_dict["missing_uc_flag"] = 1
        if not doc_dict.get("geo_tagged_photos", True):
            project_dict["missing_geotag_flag"] = 1
        if not doc_dict.get("completion_certificate", True):
            project_dict["missing_completion_cert_flag"] = 1

    if int(project_dict.get("bid_count", 4)) <= 1:
        project_dict["single_bid_flag"] = 1

    req_id = state.get("request_id") or str(uuid.uuid4())
    proj_id = str(project_dict.get("project_id", "MPLADS-PROJ-001"))
    trace_id = state.get("trace_id") or f"trace-{uuid.uuid4().hex[:12]}"
    human_dec = project_dict.get("human_decision") or state.get("human_decision")

    return {
        "request_id": req_id,
        "project_id": proj_id,
        "trace_id": trace_id,
        "prediction_timestamp": state.get("prediction_timestamp") or datetime.now(timezone.utc).isoformat(),
        "project_data": project_dict,
        "normalized_data": {"project": project_dict, "documents": doc_dict},
        "human_decision": human_dec,
        "completed_nodes": ["normalize_data"],
        "errors": [],
        "warnings": [],
    }


def risk_fusion_node(state: SanchayState) -> Dict[str, Any]:
    """
    Deterministic risk fusion node executing versioned risk policy v1.0.0.
    Fuses supervised ML, compliance penalties, Isolation Forest anomaly scores,
    contractor risk, and documentation integrity into a 0-100 score.
    """
    proj = state.get("project_data", {})
    ensemble = HybridRiskEnsemble()
    ens_res = ensemble.analyze_project(proj)

    score = ens_res.get("risk_score", 25.0)
    level = ens_res.get("risk_level", "LOW")
    label = ens_res.get("severity_label", "STANDARD_MONITORING")
    verdict = ens_res.get("audit_verdict", "ROUTINE_MONITORING")
    
    components = {
        "supervised_ml": ens_res.get("supervised_ml_probability", 0.15),
        "unsupervised_anomaly": ens_res.get("unsupervised_anomaly_score", 0.15),
        "rule_compliance": ens_res.get("rule_compliance_score", 0.0),
        "contractor_risk": ens_res.get("contractor_risk_factor", 0.0),
        "evidence_integrity": ens_res.get("evidence_data_integrity", 0.0),
    }

    completed = state.get("completed_nodes", []) + ["risk_fusion"]
    return {
        "risk_score": score,
        "risk_level": level,
        "severity_label": label,
        "audit_verdict": verdict,
        "risk_components": components,
        "model_version": "sanchay-risk-v2.0.0",
        "risk_policy_version": ens_res.get("policy_version", "risk_policy_v1.0.0"),
        "completed_nodes": completed,
    }


def human_review_node(state: SanchayState) -> Dict[str, Any]:
    """
    Human-in-the-Loop review node.
    Pauses workflow if human review is required and records decision upon resumption.
    """
    decision = state.get("human_decision")
    if not decision:
        return {
            "workflow_status": "awaiting_human_review",
            "completed_nodes": state.get("completed_nodes", []) + ["human_review_paused"],
        }
    
    return {
        "workflow_status": f"resumed_{decision.get('action', 'approved').lower()}",
        "completed_nodes": state.get("completed_nodes", []) + ["human_review_completed"],
    }


def finalize_node(state: SanchayState) -> Dict[str, Any]:
    """Finalizes workflow execution, updates audit trace, and seals output state."""
    status = state.get("workflow_status") or "completed"
    completed = state.get("completed_nodes", []) + ["finalize"]
    
    trace_data = {
        "request_id": state.get("request_id"),
        "project_id": state.get("project_id"),
        "trace_id": state.get("trace_id"),
        "risk_score": state.get("risk_score"),
        "risk_level": state.get("risk_level"),
        "status": status,
        "completed_nodes": completed,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    if state.get("request_id"):
        record_trace(state["request_id"], trace_data)

    return {
        "workflow_status": status,
        "completed_nodes": completed,
    }


def build_sanchay_graph() -> StateGraph:
    """Builds and compiles the Sanchay AI LangGraph workflow."""
    workflow = StateGraph(SanchayState)

    # 1. Add Nodes
    workflow.add_node("normalize_data", normalize_data_node)
    workflow.add_node("data_quality", data_quality_node)
    workflow.add_node("supervisor", supervisor_node)
    
    # Domain Specialist Nodes
    workflow.add_node("financial", financial_node)
    workflow.add_node("compliance", compliance_node)
    workflow.add_node("procurement", procurement_node)
    workflow.add_node("contractor", contractor_node)
    workflow.add_node("progress", progress_node)
    
    # ML, Fusion & Synthesis Nodes
    workflow.add_node("anomaly", anomaly_node)
    workflow.add_node("risk_fusion", risk_fusion_node)
    workflow.add_node("evidence", evidence_node)
    workflow.add_node("explanation", explanation_node)
    workflow.add_node("investigation", investigation_node)
    workflow.add_node("human_review", human_review_node)
    workflow.add_node("finalize", finalize_node)

    # 2. Add Edges & Conditional Routing
    workflow.add_edge(START, "normalize_data")
    workflow.add_edge("normalize_data", "data_quality")
    
    workflow.add_conditional_edges(
        "data_quality",
        route_after_data_quality,
        {"supervisor": "supervisor", "finalize": "finalize"}
    )
    
    # Supervisor routes through specialist domains into ML analysis
    workflow.add_edge("supervisor", "financial")
    workflow.add_edge("financial", "compliance")
    workflow.add_edge("compliance", "procurement")
    workflow.add_edge("procurement", "contractor")
    workflow.add_edge("contractor", "progress")
    workflow.add_edge("progress", "anomaly")
    
    # ML anomaly feeds into deterministic risk fusion
    workflow.add_edge("anomaly", "risk_fusion")
    workflow.add_edge("risk_fusion", "evidence")
    workflow.add_edge("evidence", "explanation")
    workflow.add_edge("explanation", "investigation")
    
    workflow.add_conditional_edges(
        "investigation",
        route_after_investigation,
        {"human_review": "human_review", "finalize": "finalize"}
    )
    
    workflow.add_edge("human_review", "finalize")
    workflow.add_edge("finalize", END)

    checkpointer = get_checkpointer()
    return workflow.compile(checkpointer=checkpointer)


# Singleton compiled graph instance
sanchay_graph = build_sanchay_graph()


class SanchayOrchestrator:
    """Orchestrator interface wrapping the compiled LangGraph workflow."""

    def __init__(self):
        self.graph = sanchay_graph

    async def execute(self, project_data: Dict[str, Any], config: Optional[Dict[str, Any]] = None) -> SanchayState:
        """Asynchronously executes the Sanchay LangGraph workflow."""
        init_state: SanchayState = {
            "project_data": project_data,
            "completed_nodes": [],
            "errors": [],
            "warnings": [],
        }
        thread_id = str(project_data.get("request_id") or uuid.uuid4())
        run_config = config or {"configurable": {"thread_id": thread_id}}
        return await self.graph.ainvoke(init_state, config=run_config)

    def execute_sync(self, project_data: Dict[str, Any], config: Optional[Dict[str, Any]] = None) -> SanchayState:
        """Synchronously executes the Sanchay LangGraph workflow."""
        init_state: SanchayState = {
            "project_data": project_data,
            "completed_nodes": [],
            "errors": [],
            "warnings": [],
        }
        thread_id = str(project_data.get("request_id") or uuid.uuid4())
        run_config = config or {"configurable": {"thread_id": thread_id}}
        return self.graph.invoke(init_state, config=run_config)


# ── Backward-Compatible SystemState & MPLADSOrchestrator for Digital Twin ─────

class SystemState(TypedDict, total=False):
    """The central state dictionary flowing through the 19-agent digital twin pipeline."""
    digital_twin: Optional[ProjectDigitalTwin]
    context: Optional[AgentContext]
    policy_result: Optional[Any]
    agent_evidence_list: list[AgentEvidence]
    graph_result: Optional[GraphResult]
    risk_output: Optional[RiskOutput]
    trajectory: Optional[Any]
    early_warnings: Optional[list[Any]]
    nlp_summary: Optional[str]
    investigation_case: Optional[InvestigationCase]
    metadata: dict[str, Any]


class MPLADSOrchestrator:
    """
    19-Agent Digital Twin pipeline orchestrator supporting legacy tests and simulations.
    """

    def __init__(
        self,
        fusion_engine: Optional[EvidenceFusionEngine] = None,
        explanation_engine: Optional[NLPExplanationEngine] = None,
        investigation_service: Optional[InvestigationService] = None,
        policy_engine: Optional[PolicyEngine] = None,
        trajectory_engine: Optional[RiskTrajectoryEngine] = None,
        early_warning_engine: Optional[EarlyWarningEngine] = None,
    ):
        self.fusion_engine = fusion_engine or EvidenceFusionEngine()
        self.explanation_engine = explanation_engine or NLPExplanationEngine()
        self.investigation_service = investigation_service or InvestigationService()
        self.policy_engine = policy_engine or PolicyEngine()
        self.trajectory_engine = trajectory_engine or RiskTrajectoryEngine()
        self.early_warning_engine = early_warning_engine or EarlyWarningEngine()
        self._agents = [cls() for cls in ALL_SYSTEM_AGENTS]

    def run(self, digital_twin: ProjectDigitalTwin) -> SystemState:
        """Executes full 19-agent pipeline on ProjectDigitalTwin."""
        state: SystemState = {
            "digital_twin": digital_twin,
            "context": AgentContext(project_id=str(digital_twin.project_id), digital_twin=digital_twin),
            "agent_evidence_list": [],
            "metadata": {},
        }
        # 1. Policy
        state["policy_result"] = self.policy_engine.evaluate(digital_twin)
        
        # 2. Run 19 agents
        ev_list = []
        for ag in self._agents:
            try:
                ev = ag.run(state["context"])
                ev_list.append(ev)
            except Exception as e:
                ev_list.append(AgentEvidence.failed(
                    agent_id=getattr(ag, "agent_id", "unknown"),
                    agent_name=getattr(ag, "agent_name", "Unknown Agent"),
                    error=str(e)
                ))
        state["agent_evidence_list"] = ev_list

        # 3. Fuse evidence
        risk_output = self.fusion_engine.fuse_evidence(
            project_id=str(digital_twin.project_id),
            evidence_list=ev_list,
            project_status=digital_twin.project_status
        )
        state["risk_output"] = risk_output

        # 4. Trajectory & early warnings
        traj = self.trajectory_engine.compute_trajectory(
            project_id=str(digital_twin.project_id),
            current_score=risk_output.overall_risk_score,
            history=[],
        )
        state["trajectory"] = traj
        state["early_warnings"] = self.early_warning_engine.evaluate_warnings(
            twin=digital_twin,
            risk_output=risk_output,
            trajectory=traj,
            evidence_list=ev_list,
        )

        # 5. NLP Summary
        state["nlp_summary"] = self.explanation_engine.generate_explanation(
            risk_output=risk_output,
            evidence_list=ev_list,
            digital_twin=digital_twin,
        )

        # 6. Investigation routing
        if risk_output.overall_risk_score >= 70.0 or risk_output.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            intake = InvestigationIntake(
                project_id=str(digital_twin.project_id),
                risk_score=risk_output.overall_risk_score,
                risk_level=risk_output.risk_level,
                trigger_signals=risk_output.top_signals or ["Elevated risk threshold exceeded."],
                agent_evidence=ev_list,
                risk_fingerprint=risk_output.fingerprint,
            )
            state["investigation_case"] = self.investigation_service.create_case(intake)

        return state


def run_pipeline(digital_twin_or_id: Any, db: Any = None, context: Any = None) -> Union[SystemState, SanchayState]:
    """
    Unified entry point for both digital twin objects and raw dictionary payloads.
    """
    if isinstance(digital_twin_or_id, ProjectDigitalTwin):
        orch = MPLADSOrchestrator()
        return orch.run(digital_twin_or_id)
    
    orch_langgraph = SanchayOrchestrator()
    if isinstance(digital_twin_or_id, dict):
        return orch_langgraph.execute_sync(digital_twin_or_id)
    return orch_langgraph.execute_sync({"project_id": str(digital_twin_or_id)})


async def execute_pipeline(project_data: Any, context: Any = None) -> Union[SystemState, SanchayState]:
    if isinstance(project_data, ProjectDigitalTwin):
        orch = MPLADSOrchestrator()
        return orch.run(project_data)
    
    orch_langgraph = SanchayOrchestrator()
    if hasattr(project_data, "model_dump"):
        p_dict = project_data.model_dump()
    elif isinstance(project_data, dict):
        p_dict = project_data
    else:
        p_dict = {"project_id": str(project_data)}
    return await orch_langgraph.execute(p_dict)
