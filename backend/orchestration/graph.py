"""
orchestration/graph.py
MPLADSOrchestrator — End-to-End State Graph Pipeline.
Connects DigitalTwin resolution, 19 Part A & Part B agents, EvidenceFusionEngine,
NLPExplanationEngine, and CONTRACT 5 Investigation Engine case routing.
Supports LangGraph StateGraph with a seamless async fallback execution router.
"""
from __future__ import annotations
import asyncio
from typing import Any, Optional, TypedDict, Union

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

# Complete list of all 19 System Agents
ALL_SYSTEM_AGENTS = [
    # Part A
    DataQualityAgent,
    EligibilityAgent,
    BudgetAgent,
    DeadlineAgent,
    DocumentationAgent,
    ProcurementAgent,
    ContractorIntelligenceAgent,
    GeographicIntelligenceAgent,
    DuplicateGhostWorkAgent,
    # Part B
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


class SystemState(TypedDict, total=False):
    """The central state dictionary flowing through the orchestration graph."""
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
    Orchestrates the entire MPLADS Guardian Risk Assessment & Audit workflow.

    Node Routing Pipeline:
    1. node_fetch_digital_twin: Resolves ProjectDigitalTwin and initializes AgentContext.
    2. node_evaluate_policy: Evaluates versioned statutory policy rules.
    3. node_run_all_agents: Executes all 19 system agents with pre-cached instances.
    4. node_fuse_evidence: Computes dynamic weights and fuses evidence into 3D RiskOutput.
    5. node_trajectory_and_warnings: Computes risk velocity, trajectory, and early warnings.
    6. node_generate_explanation: Generates audit-compliant NLP Markdown report.
    7. node_investigation_routing: Routes high-risk projects (score >= 70 or HIGH/CRITICAL) to CONTRACT 5 Investigation Service.
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

        # Cache agent instances to avoid costly re-instantiation per request
        self._agents = [cls() for cls in ALL_SYSTEM_AGENTS]
        self._graph_runner = self._build_graph()

    # ── Node Definitions ───────────────────────────────────────────────────────

    def node_fetch_digital_twin(self, state: SystemState) -> SystemState:
        """
        Node 1: Resolves DigitalTwin and builds execution context.

        Args:
            state: Current SystemState.

        Returns:
            SystemState: Updated state with digital twin and AgentContext populated.
        """
        twin = state.get("digital_twin")
        context = state.get("context")

        if twin is None and context is not None:
            twin = context.digital_twin
            state["digital_twin"] = twin

        if twin is None:
            raise ValueError("SystemState missing required 'digital_twin' or 'context'")

        if context is None:
            context = AgentContext(
                project_id=twin.project_id,
                digital_twin=twin,
                graph_data=state.get("graph_result").model_dump() if state.get("graph_result") else None,
            )
            state["context"] = context

        state["agent_evidence_list"] = state.get("agent_evidence_list", [])
        state["metadata"] = state.get("metadata", {})
        return state

    def node_evaluate_policy(self, state: SystemState) -> SystemState:
        """
        Node 2: Evaluates digital twin against applicable versioned statutory policy rules.
        """
        twin = state["digital_twin"]
        policy_result = self.policy_engine.evaluate(twin)
        state["policy_result"] = policy_result
        return state

    def node_run_all_agents(self, state: SystemState) -> SystemState:
        """
        Node 3: Executes all 19 system agents using pre-cached agent singletons.
        """
        context = state["context"]
        evidence_list: list[AgentEvidence] = []

        for agent in self._agents:
            try:
                ev = agent.run(context)
                evidence_list.append(ev)
            except Exception as e:
                failed_ev = AgentEvidence.failed(
                    agent_id=getattr(agent, "agent_id", "unknown_agent"),
                    agent_name=getattr(agent, "agent_name", "Unknown Agent"),
                    error=str(e),
                )
                evidence_list.append(failed_ev)

        state["agent_evidence_list"] = evidence_list
        return state

    def node_fuse_evidence(self, state: SystemState) -> SystemState:
        """
        Node 4: Invokes DynamicWeightEngine and EvidenceFusionEngine to construct RiskOutput.
        """
        twin = state["digital_twin"]
        evidence_list = state["agent_evidence_list"]
        graph_result = state.get("graph_result")

        risk_output = self.fusion_engine.fuse_evidence(
            project_id=twin.project_id,
            evidence_list=evidence_list,
            graph_result=graph_result,
            project_status=twin.project_status,
        )

        state["risk_output"] = risk_output
        return state

    def node_trajectory_and_warnings(self, state: SystemState) -> SystemState:
        """
        Node 5: Computes risk trajectory velocity and generates early warnings.
        """
        twin = state["digital_twin"]
        risk_output = state["risk_output"]
        evidence_list = state["agent_evidence_list"]

        traj = self.trajectory_engine.compute_trajectory(
            project_id=twin.project_id,
            current_score=float(risk_output.overall_risk_score),
            history=[],
        )
        warnings = self.early_warning_engine.evaluate_warnings(
            twin=twin,
            risk_output=risk_output,
            trajectory=traj,
            evidence_list=evidence_list,
        )

        state["trajectory"] = traj
        state["early_warnings"] = warnings
        return state

    def node_generate_explanation(self, state: SystemState) -> SystemState:
        """
        Node 6: Invokes NLPExplanationEngine for human-readable narrative generation.
        """
        risk_output = state["risk_output"]
        evidence_list = state["agent_evidence_list"]
        twin = state.get("digital_twin")

        summary = self.explanation_engine.generate_explanation(
            risk_output=risk_output,
            evidence_list=evidence_list,
            digital_twin=twin,
        )

        state["nlp_summary"] = summary
        return state

    def node_investigation_routing(self, state: SystemState) -> SystemState:
        """
        Node 7: Routes high-risk projects (Score >= 70 or HIGH/CRITICAL) to Investigation Engine (CONTRACT 5).
        """
        risk_output = state["risk_output"]
        evidence_list = state["agent_evidence_list"]

        is_high_risk = (
            risk_output.overall_risk_score >= 70.0
            or risk_output.risk_level in (RiskLevel.HIGH, RiskLevel.CRITICAL)
        )

        if is_high_risk:
            intake = InvestigationIntake(
                project_id=risk_output.project_id,
                risk_score=risk_output.overall_risk_score,
                risk_level=risk_output.risk_level,
                trigger_signals=risk_output.top_signals,
                risk_fingerprint=risk_output.fingerprint,
                agent_evidence=evidence_list,
                submitted_by="mplads_orchestrator",
                priority_hint=risk_output.risk_level.value,
            )
            case = self.investigation_service.create_case(intake)
            state["investigation_case"] = case
        else:
            state["investigation_case"] = None

        return state

    # ── Graph Building & Execution Router ──────────────────────────────────────

    def _build_graph(self):
        """Constructs LangGraph StateGraph if available, or falls back to async runner."""
        try:
            from langgraph.graph import StateGraph, END
            workflow = StateGraph(SystemState)

            workflow.add_node("fetch_digital_twin", self.node_fetch_digital_twin)
            workflow.add_node("evaluate_policy", self.node_evaluate_policy)
            workflow.add_node("run_all_agents", self.node_run_all_agents)
            workflow.add_node("fuse_evidence", self.node_fuse_evidence)
            workflow.add_node("trajectory_and_warnings", self.node_trajectory_and_warnings)
            workflow.add_node("generate_explanation", self.node_generate_explanation)
            workflow.add_node("investigation_routing", self.node_investigation_routing)

            workflow.set_entry_point("fetch_digital_twin")
            workflow.add_edge("fetch_digital_twin", "evaluate_policy")
            workflow.add_edge("evaluate_policy", "run_all_agents")
            workflow.add_edge("run_all_agents", "fuse_evidence")
            workflow.add_edge("fuse_evidence", "trajectory_and_warnings")
            workflow.add_edge("trajectory_and_warnings", "generate_explanation")
            workflow.add_edge("generate_explanation", "investigation_routing")
            workflow.add_edge("investigation_routing", END)

            return workflow.compile()
        except ImportError:
            return None

    async def execute(self, state: SystemState) -> SystemState:
        """
        Executes state graph pipeline.
        """
        if self._graph_runner is not None:
            return await self._graph_runner.ainvoke(state)

        # Fallback Sequential Execution Router
        state = self.node_fetch_digital_twin(state)
        state = self.node_evaluate_policy(state)
        state = self.node_run_all_agents(state)
        state = self.node_fuse_evidence(state)
        state = self.node_trajectory_and_warnings(state)
        state = self.node_generate_explanation(state)
        state = self.node_investigation_routing(state)
        return state


# ── Global Module Helper Functions ─────────────────────────────────────────────

async def execute_pipeline(
    input_data: Union[ProjectDigitalTwin, AgentContext],
    graph_result: Optional[GraphResult] = None,
) -> SystemState:
    """
    Async entry point to execute the complete MPLADS Guardian risk pipeline.
    Accepts ProjectDigitalTwin or AgentContext.
    """
    orchestrator = MPLADSOrchestrator()

    if isinstance(input_data, ProjectDigitalTwin):
        initial_state: SystemState = {
            "digital_twin": input_data,
            "graph_result": graph_result,
        }
    elif isinstance(input_data, AgentContext):
        initial_state = {
            "context": input_data,
            "digital_twin": input_data.digital_twin,
            "graph_result": graph_result,
        }
    else:
        raise TypeError(f"Unsupported input_data type: {type(input_data)}")

    return await orchestrator.execute(initial_state)


def run_pipeline(
    input_data: Union[ProjectDigitalTwin, AgentContext],
    graph_result: Optional[GraphResult] = None,
) -> SystemState:
    """Synchronous wrapper around execute_pipeline."""
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        # Running in existing event loop
        return asyncio.run_coroutine_threadsafe(
            execute_pipeline(input_data, graph_result), loop
        ).result()
    else:
        return asyncio.run(execute_pipeline(input_data, graph_result))
