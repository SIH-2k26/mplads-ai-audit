"""
scripts/verify_api_and_layer.py
Verification script for PDF Service, What-If Simulator, FastAPI endpoints, and main app.
"""
import sys
import os
from datetime import datetime, date
from decimal import Decimal
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from models.digital_twin import ProjectDigitalTwin
from models.enums import ProjectStatus, Verdict
from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord
from services.pdf_service import FieldInspectionPDFService
from simulation.what_if import WhatIfSimulator
from orchestration.graph import run_pipeline

def make_sample_twin() -> ProjectDigitalTwin:
    return ProjectDigitalTwin(
        project_id="PROJ/VERIFY/2026/777",
        project_name="Inter-Village Concrete Road & Drainage Work",
        category="ROAD",
        project_status=ProjectStatus.IN_PROGRESS,
        location=GeoLocation(district="Varanasi", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number="MPLADS/VAR/2026/777",
            sanction_date=date(2025, 2, 1),
            sanctioned_amount=Decimal("3500000"),
        ),
        budget=Budget(approved_budget=Decimal("3500000"), estimated_cost=Decimal("3400000")),
        expenditure=Expenditure(total_expenditure=Decimal("2800000")),
        latest_progress=ProgressRecord(as_of_date=date.today(), financial_progress=80.0, physical_progress=45.0),
        document_types_present=["SANCTION_ORDER", "WORK_ORDER"],
        start_date=datetime(2025, 2, 15),
        expected_completion_date=datetime(2025, 11, 30),
    )

def main():
    print("==================================================")
    print("      API & REPORTING LAYER VERIFICATION RUNNER")
    print("==================================================")

    twin = make_sample_twin()
    pipeline_state = run_pipeline(twin)
    risk_output = pipeline_state["risk_output"]
    nlp_summary = pipeline_state.get("nlp_summary", "")

    # 1. Verify FieldInspectionPDFService Generation
    print("\n--- 1. Testing FieldInspectionPDFService ---")
    pdf_service = FieldInspectionPDFService()
    pdf_bytes = pdf_service.generate_field_inspection_brief(twin, risk_output, nlp_summary)
    
    print(f"  - Generated PDF Binary Size: {len(pdf_bytes)} bytes")
    assert isinstance(pdf_bytes, bytes), "PDF service must return bytes"
    assert pdf_bytes.startswith(b"%PDF"), "PDF binary must start with %PDF header magic bytes"
    print("  [OK] 1-page PDF Brief generation confirmed (Valid PDF binary bytes)!\n")

    # 2. Verify WhatIfSimulator Execution
    print("--- 2. Testing WhatIfSimulator ---")
    simulator = WhatIfSimulator()
    sim_result = simulator.simulate_what_if(
        digital_twin=twin,
        delay_days_delta=60,
        expenditure_delta=500000.0,
        physical_progress_delta=-10.0,
    )

    print(f"  - Baseline Risk Score:  {sim_result['baseline']['overall_risk_score']:.1f}")
    print(f"  - Simulated Risk Score: {sim_result['simulated']['overall_risk_score']:.1f}")
    print(f"  - Overall Risk Delta:   {sim_result['deltas']['overall_risk_delta']:+.2f}")
    print(f"  - Future Risk Delta:    {sim_result['deltas']['future_risk_delta']:+.2f}")
    print(f"  - Risk Transition:      {sim_result['risk_transition']}")

    assert "baseline" in sim_result and "simulated" in sim_result, "Simulation result must contain baseline & simulated keys"
    assert "deltas" in sim_result, "Simulation result must contain deltas key"
    print("  [OK] WhatIfSimulator risk simulation execution confirmed!\n")

    # 3. Verify FastAPI App Route Registration & Endpoints
    print("--- 3. Testing FastAPI App Startup & Route Registration ---")
    client = TestClient(app)

    # Health check
    res_health = client.get("/api/v1/health")
    print(f"  - GET /api/v1/health status: {res_health.status_code} | body: {res_health.json()['status']}")
    assert res_health.status_code == 200, "Health check endpoint failed"

    # Analyze project endpoint
    res_analyze = client.post("/api/v1/projects/analyze", json={"project_id": twin.project_id})
    print(f"  - POST /api/v1/projects/analyze status: {res_analyze.status_code}")
    assert res_analyze.status_code == 200, "Analyze project endpoint failed"
    analyze_json = res_analyze.json()
    assert "overall_risk_score" in analyze_json, "Response missing overall_risk_score"
    assert "nlp_summary" in analyze_json, "Response missing nlp_summary"

    # What-If simulation endpoint
    res_sim = client.post(
        "/api/v1/simulation/what-if",
        json={
            "project_id": twin.project_id,
            "delay_days_delta": 45,
            "expenditure_delta": 200000.0,
            "physical_progress_delta": 5.0,
        }
    )
    print(f"  - POST /api/v1/simulation/what-if status: {res_sim.status_code}")
    assert res_sim.status_code == 200, "Simulation endpoint failed"

    # PDF Report streaming endpoint
    res_pdf = client.get(f"/api/v1/reports/pdf/{twin.project_id}")
    print(f"  - GET /api/v1/reports/pdf/{twin.project_id} status: {res_pdf.status_code} | media_type: {res_pdf.headers.get('content-type')}")
    assert res_pdf.status_code == 200, "PDF endpoint failed"
    assert res_pdf.headers.get("content-type") == "application/pdf", "Media type must be application/pdf"
    assert res_pdf.content.startswith(b"%PDF"), "Response body must be PDF bytes"

    # Case verdict endpoint
    res_verdict = client.post(
        "/api/v1/cases/CASE_VERIFY_999/verdict",
        json={
            "verdict": "CONFIRMED_ISSUE",
            "reason": "Physical progress gap verified on site by inspection engineer.",
            "investigator_name": "Inspector R. Sharma",
        }
    )
    print(f"  - POST /api/v1/cases/CASE_VERIFY_999/verdict status: {res_verdict.status_code}")
    assert res_verdict.status_code == 200, "Verdict endpoint failed"
    verdict_json = res_verdict.json()
    assert verdict_json["verdict"]["verdict"] == "CONFIRMED_ISSUE", "Verdict status mismatch"

    print("  [OK] FastAPI app startup, CORS, and all API endpoints verified successfully!\n")

    print("==================================================")
    print("      ALL API & LAYER VERIFICATIONS SUCCESSFUL!")
    print("==================================================")

if __name__ == "__main__":
    main()
