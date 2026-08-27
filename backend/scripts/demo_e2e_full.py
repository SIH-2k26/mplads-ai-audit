"""
scripts/demo_e2e_full.py
Complete End-to-End Master Demonstration for MPLADS Guardian.
Executes all connected platform components in real-time.
"""
from __future__ import annotations
import asyncio
from datetime import datetime, timezone
from decimal import Decimal
import json
from pathlib import Path
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from data.pipeline import IngestionPipeline
from engine.early_warning import EarlyWarningEngine
from engine.trajectory import RiskHistoricalPoint, RiskTrajectoryEngine
from ml.explainability.shap_explainer import SHAPExplainer
from ml.features.feature_engineer import FeatureEngineer
from ml.registry.model_registry import ModelRegistry
from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Contractor, ImplementingAgency, Sanction, Budget, Expenditure, ProgressRecord
from models.document import DocumentMetadata
from models.enums import ProjectCategory, ProjectStatus
from orchestration.graph import execute_pipeline
from policy.engine import PolicyEngine


async def main():
    print("=" * 80)
    print(">>> MPLADS GUARDIAN -- COMPLETE END-TO-END SYSTEM DEMONSTRATION")
    print("=" * 80)

    # 1. Structured Ingestion & Digital Twin
    print("\n[STEP 1] Data Platform: Ingesting Raw Project Record & Normalizing...")
    pipeline = IngestionPipeline()
    raw_record = {
        "project_id": "TEST-MPLADS-001",
        "project_name": "Rural Connectivity Road & Culvert Construction",
        "category": "ROAD_CONSTRUCTION",
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "sanctioned_amount": 2000000.0,
        "approved_budget": 1900000.0,
        "total_expenditure": 1850000.0,
        "financial_progress": 97.0,
        "physical_progress": 37.0,
        "contractor_name": "Apex Infra Projects Pvt Ltd",
        "implementing_agency": "District Rural Development Authority Lucknow",
    }
    twin, dup, err = pipeline.process_single_record(raw_record)
    print(f"  [OK] Digital Twin Instantiated: {twin.project_name}")
    print(f"  [OK] Sanction: Rs. {twin.sanctioned_amount:,.2f} | Financial: {twin.financial_progress}% | Physical: {twin.physical_progress}%")
    print(f"  [OK] Deduplication Checked: Group Assigned: {dup.duplicate_group_id if dup else 'UNIQUE'}")

    # Add documents
    twin.document_types_present = ["SANCTION_ORDER", "WORK_ORDER"]
    twin.document_ids = ["doc-sanction-01", "doc-work-01"]

    # 2. Versioned Policy Engine
    print("\n[STEP 2] Statutory Policy Engine: Resolving & Evaluating Rules...")
    pol_engine = PolicyEngine()
    pol_res = pol_engine.evaluate(twin)
    print(f"  [OK] Applicable Policy Version: {pol_res.policy_id} (Version {pol_res.policy_version})")
    print(f"  [OK] Overall Policy Status: {pol_res.overall_status.value}")
    print(f"  [OK] Rules Passed: {pol_res.rules_passed} | Rules Failed: {pol_res.rules_failed}")
    for r in pol_res.rule_results:
        if r.status.value == "FAIL":
            print(f"    [POLICY VIOLATION] {r.rule_name} (Section: {r.citation_section}) -> {r.message}")

    # 3. ML Feature Extraction & Pre-trained Models
    print("\n[STEP 3] ML Pipeline: Extracting Feature Vector & Computing SHAP...")
    fe = FeatureEngineer()
    vec = fe.to_numpy(twin)
    reg = ModelRegistry()
    reg.get_or_train_default_models()
    art = reg.load_artifact("mplads_risk_classifier")
    
    if art:
        explainer = SHAPExplainer(art["model_object"])
        shap_res = explainer.explain_instance(vec)
        print(f"  [OK] ML Risk Classifier Output: {shap_res.predicted_probability:.2f} probability")
        print(f"  [OK] Top SHAP Risk Drivers:")
        for c in shap_res.contributions[:3]:
            print(f"    - {c.feature_name} (Value={c.feature_value:.1f}) -> Impact: {c.shap_value:+.4f} [{c.direction}]")

    # 4. 19-Agent Orchestration & Evidence Fusion
    print("\n[STEP 4] Orchestration: Executing 19 System Agents & Evidence Fusion...")
    final_state = await execute_pipeline(twin)
    risk_out = final_state["risk_output"]

    print(f"  [OK] Composite Risk Score: {risk_out.overall_risk_score:.2f} / 100 ({risk_out.risk_level.value})")
    print(f"    - Current Risk (Operational): {risk_out.current_risk:.2f}")
    print(f"    - Future Risk (Schedule/Delay): {risk_out.future_risk:.2f}")
    print(f"    - Systemic Risk (Network/Graph): {risk_out.systemic_risk:.2f}")
    print(f"  [OK] Top Trigger Signals:")
    for s in risk_out.top_signals:
        print(f"    * {s}")

    # 5. Risk Trajectory & Early Warning Engine
    print("\n[STEP 5] Longitudinal Trajectory & Early Warning Engine...")
    traj = final_state.get("trajectory")
    if traj:
        print(f"  [OK] Direction: {traj.direction.value} | Velocity: {traj.velocity:+.1f} pts/month")
        print(f"  [OK] Trajectory Summary: {traj.summary}")

    warnings = final_state.get("early_warnings") or []
    print(f"  [OK] Active Early Warnings Generated ({len(warnings)}):")
    for w in warnings:
        print(f"    [ALERT - {w.severity.value}] {w.title} -> {w.description}")
        print(f"       Action: {w.remediation_advice}")

    # 6. Investigation Intake & HITL
    print("\n[STEP 6] Investigation Engine & Case Routing...")
    case = final_state.get("investigation_case")
    if case:
        print(f"  [OK] Formal Investigation Case Created: Case ID {case.case_id}")
        print(f"  [OK] Priority: {case.priority} | Status: {case.status.value if hasattr(case.status, 'value') else case.status}")
        print(f"  [OK] Evidence Items Attached: {len(case.evidence_items)}")
    else:
        print("  [OK] No investigation triggered.")

    # 7. Audit-Compliant NLP Narrative Explanation
    print("\n[STEP 7] Audit-Compliant NLP Explanation Preview:")
    print("-" * 60)
    summary_lines = final_state["nlp_summary"].split("\n")[:12]
    print("\n".join(summary_lines))
    print("-" * 60)

    print("\n[SUCCESS] COMPLETE END-TO-END DEMONSTRATION EXECUTED SUCCESSFULLY.")
    print("=" * 80)


if __name__ == "__main__":
    asyncio.run(main())

