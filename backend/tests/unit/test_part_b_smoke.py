"""
tests/unit/test_part_b_smoke.py
Unit smoke tests for Part B agents, engines, services, and simulation components.
"""
import unittest
import sys
import os
from datetime import datetime, date
from decimal import Decimal

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord
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
from engine import DynamicWeightEngine, EvidenceFusionEngine
from nlp import NLPExplanationEngine
from services.pdf_service import FieldInspectionPDFService
from simulation.what_if import WhatIfSimulator
from orchestration.graph import run_pipeline


class TestPartBSmoke(unittest.TestCase):
    """Smoke test suite verifying Part B components."""

    def make_smoke_twin(self) -> ProjectDigitalTwin:
        """Construct sample digital twin for unit test assertions."""
        return ProjectDigitalTwin(
            project_id="PROJ/TEST/2026/101",
            project_name="Smoke Test Infrastructure Construction Work",
            category="ROAD",
            location=GeoLocation(district="Kanpur", state="Uttar Pradesh"),
            sanction=Sanction(
                sanction_number="MPLADS/KAN/2026/101",
                sanction_date=date(2025, 1, 10),
                sanctioned_amount=Decimal("2500000"),
            ),
            budget=Budget(approved_budget=Decimal("2500000"), estimated_cost=Decimal("2400000")),
            expenditure=Expenditure(total_expenditure=Decimal("1800000")),
            latest_progress=ProgressRecord(as_of_date=date.today(), financial_progress=72.0, physical_progress=50.0),
            document_types_present=["SANCTION_ORDER", "WORK_ORDER"],
            start_date=datetime(2025, 1, 20),
            expected_completion_date=datetime(2025, 12, 20),
        )

    def test_part_b_agents_initialization(self):
        """Verify all 10 Part B agents instantiate with valid agent IDs."""
        agents = [
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
        self.assertEqual(len(agents), 10)
        for agent in agents:
            self.assertTrue(isinstance(agent.agent_id, str) and len(agent.agent_id) > 0)
            self.assertTrue(isinstance(agent.agent_name, str) and len(agent.agent_name) > 0)

    def test_orchestrator_pipeline_execution(self):
        """Verify full 19-agent pipeline execution and RiskOutput state generation."""
        twin = self.make_smoke_twin()
        state = run_pipeline(twin)

        self.assertIn("risk_output", state)
        self.assertIn("agent_evidence_list", state)
        self.assertIn("nlp_summary", state)

        risk_output = state["risk_output"]
        self.assertTrue(0.0 <= risk_output.overall_risk_score <= 100.0)
        self.assertEqual(len(state["agent_evidence_list"]), 19)
        self.assertTrue(isinstance(state["nlp_summary"], str) and len(state["nlp_summary"]) > 50)

    def test_what_if_simulator(self):
        """Verify what-if simulation parameter adjustments and delta calculations."""
        twin = self.make_smoke_twin()
        simulator = WhatIfSimulator()

        res = simulator.simulate_what_if(
            digital_twin=twin,
            delay_days_delta=30,
            expenditure_delta=100000.0,
            physical_progress_delta=5.0,
        )
        self.assertIn("baseline", res)
        self.assertIn("simulated", res)
        self.assertIn("deltas", res)
        self.assertIn("risk_transition", res)

    def test_pdf_report_service(self):
        """Verify 1-page printable Field Inspection PDF generation."""
        twin = self.make_smoke_twin()
        state = run_pipeline(twin)

        pdf_service = FieldInspectionPDFService()
        pdf_bytes = pdf_service.generate_field_inspection_brief(
            digital_twin=twin,
            risk_output=state["risk_output"],
            nlp_summary=state.get("nlp_summary", ""),
        )

        self.assertTrue(isinstance(pdf_bytes, bytes))
        self.assertTrue(pdf_bytes.startswith(b"%PDF"))
        self.assertTrue(len(pdf_bytes) > 2000)


if __name__ == "__main__":
    unittest.main()
