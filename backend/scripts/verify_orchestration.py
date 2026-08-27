"""
scripts/verify_orchestration.py
Verification script for NLPExplanationEngine and MPLADSOrchestrator pipeline.
"""
import sys
import os
from datetime import datetime, date
from decimal import Decimal

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from models.digital_twin import ProjectDigitalTwin
from models.enums import ProjectStatus, RiskLevel
from models.project import (
    GeoLocation, Sanction, Budget, Expenditure, Payment, ProgressRecord, Milestone, ImplementingAgency, Contractor
)
from models.graph import GraphResult, ContractorNetworkNode
from nlp.explanation import NLPExplanationEngine
from orchestration.graph import MPLADSOrchestrator, execute_pipeline, run_pipeline

def make_high_risk_twin() -> ProjectDigitalTwin:
    """Create a Digital Twin configured to trigger HIGH/CRITICAL risk scores."""
    return ProjectDigitalTwin(
        project_id="TEST/ORCH/HIGH_RISK/001",
        project_name="High Risk Rural Water Supply Project",
        category="WATER",
        project_status=ProjectStatus.DELAYED,
        location=GeoLocation(district="Gorakhpur", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number="MPLADS/GOR/2024/099",
            sanction_date=date(2024, 1, 1),
            sanctioned_amount=Decimal("4000000"),
        ),
        budget=Budget(
            approved_budget=Decimal("4000000"),
            estimated_cost=Decimal("6500000"),  # Cost overrun >50%
        ),
        expenditure=Expenditure(
            total_expenditure=Decimal("3800000"), # 95% financial progress
            payments=[
                Payment(payment_id="P1", payment_date=date(2024, 3, 28), amount=Decimal("2000000")),
                Payment(payment_id="P2", payment_date=date(2024, 3, 29), amount=Decimal("1800000")), # Split payment March
            ]
        ),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=95.0,
            physical_progress=20.0, # Huge progress gap (75%)
        ),
        document_types_present=["SANCTION_ORDER"], # Missing UC, CC, inspection
        start_date=datetime(2024, 1, 15),
        expected_completion_date=datetime(2024, 8, 30), # Delayed past due date
        implementing_agency=ImplementingAgency(agency_name="District Rural Agency"),
        contractor=Contractor(contractor_name="XYZ Infra Pvt Ltd"),
    )

def make_low_risk_twin() -> ProjectDigitalTwin:
    """Create a Digital Twin configured for LOW risk score (<30)."""
    return ProjectDigitalTwin(
        project_id="TEST/ORCH/LOW_RISK/002",
        project_name="Solar Street Light Installation",
        category="LIGHTING",
        project_status=ProjectStatus.IN_PROGRESS,
        location=GeoLocation(district="Lucknow", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number="MPLADS/LKO/2026/012",
            sanction_date=date(2026, 1, 10),
            sanctioned_amount=Decimal("1000000"),
        ),
        budget=Budget(
            approved_budget=Decimal("1000000"),
            estimated_cost=Decimal("950000"),
        ),
        expenditure=Expenditure(
            total_expenditure=Decimal("400000"),
        ),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=40.0,
            physical_progress=42.0,
        ),
        document_types_present=["SANCTION_ORDER", "WORK_ORDER", "INSPECTION_REPORT"],
        start_date=datetime(2026, 1, 20),
        expected_completion_date=datetime(2026, 11, 30),
    )

def main():
    print("==================================================")
    print("      ORCHESTRATION & NLP VERIFICATION RUNNER")
    print("==================================================")

    high_risk_twin = make_high_risk_twin()
    low_risk_twin = make_low_risk_twin()

    # 1. Test High Risk End-to-End Orchestration Pipeline Run
    print("\n--- Running High-Risk Pipeline ---")
    high_state = run_pipeline(high_risk_twin)

    print(f"  - Digital Twin Resolved: {high_state['digital_twin'].project_id}")
    print(f"  - Agents Executed:       {len(high_state['agent_evidence_list'])} agents")
    print(f"  - Overall Risk Score:    {high_state['risk_output'].overall_risk_score}/100")
    print(f"  - Risk Level:            {high_state['risk_output'].risk_level.value}")
    print(f"  - Investigation Routed:  {high_state['investigation_case'] is not None}")

    if high_state['investigation_case']:
        case = high_state['investigation_case']
        print(f"    * Case ID:       {case.case_id}")
        print(f"    * Priority:      {case.priority}")
        print(f"    * Trigger Signals: {len(case.trigger_signals)} signals")

    assert high_state['risk_output'].risk_level in (RiskLevel.HIGH, RiskLevel.CRITICAL), "High risk twin should trigger HIGH/CRITICAL risk level"
    assert high_state['investigation_case'] is not None, "High risk twin MUST trigger investigation case routing"
    print("  [OK] High-risk orchestration pipeline and CONTRACT 5 investigation routing confirmed!\n")

    # 2. Test Low Risk End-to-End Pipeline Run
    print("--- Running Low-Risk Pipeline ---")
    low_state = run_pipeline(low_risk_twin)
    print(f"  - Overall Risk Score:    {low_state['risk_output'].overall_risk_score}/100")
    print(f"  - Risk Level:            {low_state['risk_output'].risk_level.value}")
    print(f"  - Investigation Routed:  {low_state['investigation_case'] is not None}")

    assert low_state['investigation_case'] is None, "Low risk twin should NOT create an investigation case"
    print("  [OK] Low-risk pipeline routing confirmed!\n")

    # 3. Test NLPExplanationEngine Narrative Output
    print("--- Testing NLPExplanationEngine Summary Generation ---")
    nlp_summary = high_state.get('nlp_summary', '')
    print("Sample Narrative Preview (First 350 chars):\n")
    print(nlp_summary[:350] + "...\n")

    assert "# Executive Risk Assessment Report" in nlp_summary, "NLP summary missing report title"
    assert "Multi-Dimensional Risk Breakdown" in nlp_summary, "NLP summary missing 3D risk section"
    assert "Risk Fingerprint Dimensions" in nlp_summary, "NLP summary missing fingerprint table"
    assert "Actionable Recommendations" in nlp_summary, "NLP summary missing recommendations"
    print("  [OK] NLPExplanationEngine generated audit-compliant Markdown narrative!\n")

    print("==================================================")
    print("      ALL ORCHESTRATION VERIFICATIONS SUCCESSFUL!")
    print("==================================================")

if __name__ == "__main__":
    main()
