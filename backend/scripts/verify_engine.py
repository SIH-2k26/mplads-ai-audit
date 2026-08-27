"""
scripts/verify_engine.py
Verification script for DynamicWeightEngine and EvidenceFusionEngine.
"""
import sys
import os
from datetime import datetime, date
from decimal import Decimal

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.agent import AgentEvidence, AgentContext, AgentSignal
from models.digital_twin import ProjectDigitalTwin
from models.enums import AgentStatus, Severity, ProjectStatus, RiskLevel
from models.graph import GraphResult, ContractorNetworkNode
from models.risk import RiskOutput, RiskFingerprint
from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord

# Import Part A & Part B Agents
from agents.part_b import (
    PaymentAgent, FinancialProgressAgent, PhysicalProgressAgent, AssetCompletionAgent,
    CostIntelligenceAgent, AnomalyAgent, DelayPredictionAgent, TrendBenchmarkAgent,
    FraudArchetypeAgent, RAGAgent
)
from agents.deterministic.budget import BudgetAgent
from agents.deterministic.deadline import DeadlineAgent
from agents.deterministic.data_quality import DataQualityAgent

# Import Engines
from engine import DynamicWeightEngine, EvidenceFusionEngine

def make_test_twin() -> ProjectDigitalTwin:
    return ProjectDigitalTwin(
        project_id="TEST/ENGINE/2026/001",
        project_name="Bridge Reconstruction Work",
        category="ROAD",
        project_status=ProjectStatus.IN_PROGRESS,
        location=GeoLocation(district="Varanasi", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number="MPLADS/VAR/2026/001",
            sanction_date=date(2025, 2, 1),
            sanctioned_amount=Decimal("5000000"),
        ),
        budget=Budget(
            approved_budget=Decimal("5000000"),
            estimated_cost=Decimal("4800000"),
        ),
        expenditure=Expenditure(
            total_expenditure=Decimal("4000000"),
        ),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=80.0,
            physical_progress=40.0,
        ),
        document_types_present=["SANCTION_ORDER", "WORK_ORDER"],
        start_date=datetime(2025, 2, 10),
        expected_completion_date=datetime(2025, 10, 30),
    )

def main():
    print("==================================================")
    print("       RISK ENGINE VERIFICATION RUNNER")
    print("==================================================")

    twin = make_test_twin()
    context = AgentContext(project_id=twin.project_id, digital_twin=twin)

    # 1. Run a sample suite of agents to gather evidence
    agents = [
        BudgetAgent(),
        DeadlineAgent(),
        DataQualityAgent(),
        PaymentAgent(),
        FinancialProgressAgent(),
        PhysicalProgressAgent(),
        AssetCompletionAgent(),
        CostIntelligenceAgent(),
        AnomalyAgent(),
        DelayPredictionAgent(),
        TrendBenchmarkAgent(),
        FraudArchetypeAgent(),
        RAGAgent(),
    ]

    evidence_list: list[AgentEvidence] = []
    for ag in agents:
        ev = ag.run(context)
        evidence_list.append(ev)

    print(f"Collected {len(evidence_list)} AgentEvidence records.\n")

    # 2. Verify DynamicWeightEngine
    weight_engine = DynamicWeightEngine()
    weights = weight_engine.calculate_weights(evidence_list, twin.project_status)

    print("--- DynamicWeightEngine Verification ---")
    print(f"Number of weighted agents: {len(weights)}")
    total_w = sum(weights.values())
    print(f"Sum of normalized weights: {total_w:.4f}")
    print("Sample weights:")
    for aid, w in list(weights.items())[:5]:
        print(f"  - {aid:<30}: {w:.4f}")

    assert abs(total_w - 1.0) < 1e-3, f"Normalized weights must sum to 1.0, got {total_w}"
    print("  [OK] DynamicWeightEngine.calculate_weights() output format confirmed!\n")

    # 3. Verify EvidenceFusionEngine
    fusion_engine = EvidenceFusionEngine(weight_engine=weight_engine)

    mock_graph_result = GraphResult(
        query_type="test_network",
        project_id=twin.project_id,
        contractor_network=[
            ContractorNetworkNode(
                contractor_id="CONT_123",
                project_count=6,
                relationship_strength=0.85
            )
        ],
        signals={"split_tendering_flag": True}
    )

    risk_output = fusion_engine.fuse_evidence(
        project_id=twin.project_id,
        evidence_list=evidence_list,
        graph_result=mock_graph_result,
        project_status=twin.project_status
    )

    print("--- EvidenceFusionEngine Verification ---")
    print(f"  - Project ID:         {risk_output.project_id}")
    print(f"  - Overall Risk Score: {risk_output.overall_risk_score}/100")
    print(f"  - Risk Level:         {risk_output.risk_level.value}")
    print(f"  - 3D Risk Breakdown:  Current={risk_output.current_risk} | Future={risk_output.future_risk} | Systemic={risk_output.systemic_risk}")
    print(f"  - Risk Fingerprint:   Cost={risk_output.fingerprint.cost_inflation:.2f}, Payment/Progress={risk_output.fingerprint.payment_progress_mismatch:.2f}, Delay={risk_output.fingerprint.repeated_delay:.2f}")
    print(f"  - Top Signals Count:  {len(risk_output.top_signals)}")

    assert isinstance(risk_output, RiskOutput), "fuse_evidence must return a RiskOutput instance"
    assert isinstance(risk_output.fingerprint, RiskFingerprint), "RiskOutput must contain a valid RiskFingerprint"
    assert 0.0 <= risk_output.overall_risk_score <= 100.0, "Overall risk score out of range"
    assert risk_output.risk_level in RiskLevel, "Invalid RiskLevel"

    print("\n  [OK] EvidenceFusionEngine.fuse_evidence() returned valid RiskOutput!\n")
    print("==================================================")
    print("      ALL ENGINE VERIFICATIONS SUCCESSFUL!")
    print("==================================================")

if __name__ == "__main__":
    main()
