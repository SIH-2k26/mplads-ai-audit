"""
tests/contracts/test_investigation_contract.py
CONTRACT 5: InvestigationIntake -> InvestigationCase

Tests that:
1. InvestigationService processes InvestigationIntake into an InvestigationCase.
2. Risk details, agent evidence, and supporting documents are mapped cleanly.
3. Case status and verdicts update case state correctly.
"""
import pytest
from datetime import datetime
from models.investigation import (
    InvestigationIntake, InvestigationCase, InvestigatorVerdict,
)
from models.agent import AgentEvidence
from models.enums import (
    RiskLevel, AgentStatus, Severity, InvestigationStatus, Verdict,
)
from investigation.service import InvestigationService

class TestInvestigationContract:
    def test_create_case_from_intake(self):
        agent_ev = AgentEvidence(
            agent_id="budget_agent",
            agent_name="Budget Agent",
            status=AgentStatus.COMPLETED,
            score=75.0,
            severity=Severity.HIGH,
            confidence=0.9,
        )
        
        intake = InvestigationIntake(
            project_id="P100",
            risk_score=82.5,
            risk_level=RiskLevel.CRITICAL,
            trigger_signals=["Cost overrun of 65%", "Delay of 220 days"],
            agent_evidence=[agent_ev],
            supporting_document_ids=["doc_sanction_01"],
            submitted_by="test_risk_engine"
        )
        
        service = InvestigationService()
        case = service.create_case(intake)
        
        assert isinstance(case, InvestigationCase)
        assert case.project_id == "P100"
        assert case.priority == "CRITICAL"
        assert case.status == InvestigationStatus.NEW
        assert len(case.evidence_items) >= 1

    def test_record_verdict_contract(self):
        service = InvestigationService()
        intake = InvestigationIntake(
            project_id="P100",
            risk_score=50.0,
            risk_level=RiskLevel.MEDIUM,
            trigger_signals=["Moderate delay"],
            submitted_by="test"
        )
        case = service.create_case(intake)
        
        verdict = InvestigatorVerdict(
            case_id=case.case_id,
            verdict=Verdict.CONFIRMED_ISSUE,
            reason="Physical inspection confirmed 40% work incomplete despite 90% disbursement.",
            investigator_id="INV_007",
            investigator_name="Audit Officer Sharma",
            is_feedback_consented=True,
        )
        
        updated_case = service.record_verdict(case, verdict, actor="INV_007")
        assert updated_case.status == InvestigationStatus.RESOLVED
        assert updated_case.verdict.verdict == Verdict.CONFIRMED_ISSUE
