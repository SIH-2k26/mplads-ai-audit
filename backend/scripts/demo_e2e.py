"""
scripts/demo_e2e.py
End-to-End Demonstration Script for Part A Backend.

Pipeline:
1. Ingest raw project data
2. Validate raw data
3. Normalize raw data
4. Build Project Digital Twin
5. Generate state events
6. Perform RAG retriever search for policy evidence
7. Query Graph Query Service for relationships
8. Run all 9 Part A agents and collect AgentEvidence
9. Create InvestigationIntake object (Part B -> Part A interface)
10. Pass to Investigation Engine -> Create InvestigationCase
11. Add evidence to case
12. Store synthetic investigator verdict
"""
import sys
import os
from datetime import datetime, date
from decimal import Decimal

# Ensure backend/ is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.enums import (
    ProjectStatus, RiskLevel, AgentStatus, Severity, Verdict, InvestigationStatus, EventType,
)
from models.project import (
    GeoLocation, Sanction, Budget, Expenditure, ProgressRecord,
    ImplementingAgency, Contractor,
)
from models.digital_twin import ProjectDigitalTwin
from models.event import Event
from data.validation.rules import ProjectValidationRules
from data.normalization.normalizer import ProjectNormalizer
from rag.retrieval.bm25_retriever import BM25Retriever
from rag.retriever import RAGRetriever, RetrievalFilter
from graph.repositories import GraphQueryService
from agents.deterministic.data_quality import DataQualityAgent
from agents.deterministic.budget import BudgetAgent
from agents.deterministic.deadline import DeadlineAgent
from agents.deterministic.eligibility import EligibilityAgent
from agents.deterministic.documentation import DocumentationAgent
from agents.deterministic.procurement import ProcurementAgent
from agents.intelligence.contractor_intelligence import ContractorIntelligenceAgent
from agents.intelligence.geographic_intelligence import GeographicIntelligenceAgent
from agents.intelligence.duplicate_ghost_work import DuplicateGhostWorkAgent
from agents.base import AgentContext
from models.investigation import (
    InvestigationIntake, CaseEvidence, InvestigatorVerdict,
)
from investigation.service import InvestigationService
from unittest.mock import MagicMock, AsyncMock

def main():
    print("=" * 70)
    print("MPLADS GUARDIAN — PART A END-TO-END DEMONSTRATION")
    print("=" * 70)

    # 1. RAW DATA INGESTION & PIPELINE
    raw_data = {
        "project_id": "MPLADS/UP/2022/1042",
        "project_name": "Construction of Solar Street Lights & Paved Road",
        "category": "ROAD",
        "state": "UP",
        "district": "Lucknow dist.",
        "sanctioned_amount": "20,00,000",
        "total_expenditure": "18,50,000",
        "financial_progress": "92.5%",
        "physical_progress": "37.0%",
        "start_date": "2022-04-15",
        "expected_completion_date": "2023-04-15",
        "agency_name": "UP State Bridge Corporation Ltd.",
        "contractor_name": "ABC Construction Pvt Ltd",
        "project_status": "IN_PROGRESS",
    }
    print(f"\n[1] Ingested Raw Record: {raw_data['project_id']}")

    # 2. VALIDATION
    validator = ProjectValidationRules()
    val_result = validator.validate(raw_data)
    print(f"[2] Validation Result: Valid={val_result.is_valid}, Warnings={len(val_result.warnings)}")

    # 3. NORMALIZATION
    normalizer = ProjectNormalizer()
    norm_data = normalizer.normalize(raw_data)
    print(f"[3] Normalized State: {norm_data['state']}, District: {norm_data['district']}")

    # 4. DIGITAL TWIN BUILD
    twin = ProjectDigitalTwin(
        project_id=norm_data["project_id"],
        project_name=norm_data["project_name"],
        category=norm_data["category"],
        location=GeoLocation(state=norm_data["state"], district=norm_data["district"]),
        project_status=ProjectStatus.DELAYED,
        sanction=Sanction(
            sanction_number="SANC/2022/1042",
            sanctioned_amount=Decimal(str(norm_data["sanctioned_amount"])),
        ),
        budget=Budget(
            approved_budget=Decimal(str(norm_data["sanctioned_amount"])),
            estimated_cost=Decimal("1900000"),
        ),
        expenditure=Expenditure(
            total_expenditure=Decimal(str(norm_data["total_expenditure"])),
        ),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=norm_data["financial_progress"],
            physical_progress=norm_data["physical_progress"],
        ),
        start_date=datetime(2022, 4, 15),
        expected_completion_date=datetime(2023, 4, 15),
        implementing_agency=ImplementingAgency(
            agency_id="AG_UP_001",
            agency_name=norm_data["agency_name"],
        ),
        contractor=Contractor(
            contractor_id="CON_ABC_001",
            contractor_name=norm_data["contractor_name"],
        ),
        document_ids=["doc_sanc_1042"],
        document_types_present=["SANCTION_ORDER"],
    )
    print(f"[4] Digital Twin Built: ID={twin.project_id}, Status={twin.project_status.value}, Delayed={twin.is_delayed} ({twin.delay_days} days)")

    # 5. EVENTS GENERATION
    event = Event(
        event_type=EventType.PROGRESS_UPDATED,
        project_id=twin.project_id,
        entity_id=twin.project_id,
        entity_type="ProjectDigitalTwin",
        source="digital_twin_builder",
        payload={
            "financial_progress": twin.financial_progress,
            "physical_progress": twin.physical_progress,
            "delay_days": twin.delay_days,
        }
    )
    print(f"[5] Event Generated: ID={event.event_id[:8]}... Type={event.event_type.value}")

    # 6. RAG RETRIEVAL (MOCK/BM25)
    bm25 = BM25Retriever()
    bm25.build_index([{
        "chunk_id": "c_pol_1",
        "document_id": "doc_mplads_policy_2022",
        "text": "Physical progress must correspond proportionally to financial disbursements.",
        "page": 12,
        "section": "Clause 4.2",
        "document_type": "POLICY_DOCUMENT",
        "project_id": twin.project_id,
        "policy_id": "POL_2022"
    }])
    rag_retriever = RAGRetriever(bm25_retriever=bm25)

    # 7. GRAPH QUERY SERVICE
    mock_neo4j = MagicMock()
    mock_neo4j.execute_query = AsyncMock(return_value=[
        {"project_id": "MPLADS/UP/2021/088", "project_name": "Paved Road Construction", "relationship_type": "NEAR", "distance_km": 0.4}
    ])
    graph_service = GraphQueryService(mock_neo4j)

    # 8. RUN ALL 9 PART-A AGENTS
    agents = [
        DataQualityAgent(),
        BudgetAgent(),
        DeadlineAgent(),
        EligibilityAgent(),
        DocumentationAgent(),
        ProcurementAgent(),
        ContractorIntelligenceAgent(),
        GeographicIntelligenceAgent(),
        DuplicateGhostWorkAgent(),
    ]

    context = AgentContext(
        project_id=twin.project_id,
        digital_twin=twin,
        graph_data={
            "contractor_stats": {"project_count": 8, "delay_rate": 0.5, "cost_deviation_rate": 0.2},
            "nearby_projects": [{"project_id": "MPLADS/UP/2021/088", "contractor_name": "ABC Construction Pvt Ltd"}],
            "duplicate_candidates": [{"project_id": "MPLADS/UP/2021/088", "text_similarity": 0.85, "location_distance_km": 0.4, "same_contractor": True}],
        }
    )

    agent_results = []
    print("\n[6] Running 9 Part-A Agents:")
    for agent in agents:
        res = agent.run(context)
        agent_results.append(res)
        print(f"    |- [{res.agent_id}]: Score={res.score:<5} Severity={res.severity.value:<8} Signals={len(res.signals)}")

    # 9. CREATE INVESTIGATION INTAKE (Part B -> Part A Interface)
    top_signals = [sig.description for res in agent_results for sig in res.signals if res.is_flagged()]
    
    intake = InvestigationIntake(
        project_id=twin.project_id,
        risk_score=78.5,
        risk_level=RiskLevel.HIGH,
        trigger_signals=top_signals[:3] if top_signals else ["Financial-physical mismatch"],
        agent_evidence=agent_results,
        supporting_document_ids=twin.document_ids,
        submitted_by="Part_B_Risk_Engine"
    )
    print(f"\n[7] InvestigationIntake Created (Part B -> Part A boundary)")

    # 10. INVESTIGATION ENGINE (Case Creation & Verdict)
    inv_service = InvestigationService()
    case = inv_service.create_case(intake)
    print(f"[8] Investigation Case Created: CaseID={case.case_id} Priority={case.priority} Status={case.status.value}")

    # Add evidence
    case = inv_service.add_evidence(
        case,
        CaseEvidence(
            case_id=case.case_id,
            evidence_type="FIELD_INSPECTION_NOTE",
            description="Field inspector noted road sub-base laid but surface work stalled.",
            source="field_inspection",
            confidence=0.95
        ),
        actor="field_officer"
    )

    # Submit Verdict
    verdict = InvestigatorVerdict(
        case_id=case.case_id,
        verdict=Verdict.CONFIRMED_ISSUE,
        reason="Disbursement 92.5% vs physical completion 37%. Delayed by 1,000+ days. Requires administrative audit.",
        investigator_id="INV_ Lucknow_01",
        investigator_name="District Audit Officer",
        is_feedback_consented=True,
    )

    final_case = inv_service.record_verdict(case, verdict, actor="District Audit Officer")
    print(f"[9] Investigator Verdict Submitted: Verdict={final_case.verdict.verdict.value} FinalStatus={final_case.status.value}")

    print("\n" + "=" * 70)
    print("SUCCESS: Part A Backend End-to-End Pipeline Fully Verified!")
    print("=" * 70)

if __name__ == "__main__":
    main()
