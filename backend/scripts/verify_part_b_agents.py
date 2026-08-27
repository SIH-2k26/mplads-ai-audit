"""
scripts/verify_part_b_agents.py
Verification script to inspect and validate all 10 Part B agents.
"""
import sys
import os
from datetime import datetime, date
from decimal import Decimal

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.base import BaseAgent
from models.agent import AgentEvidence, AgentContext
from models.digital_twin import ProjectDigitalTwin
from models.enums import ProjectStatus
from models.project import (
    GeoLocation, Sanction, Budget, Expenditure, Payment, ProgressRecord, Asset
)

# Import all 10 Part B Agents
from agents.part_b import (
    RAGAgent,
    PaymentAgent,
    FinancialProgressAgent,
    PhysicalProgressAgent,
    AssetCompletionAgent,
    CostIntelligenceAgent,
    AnomalyAgent,
    DelayPredictionAgent,
    TrendBenchmarkAgent,
    FraudArchetypeAgent,
)

ALL_PART_B_AGENTS = [
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

def make_test_twin() -> ProjectDigitalTwin:
    return ProjectDigitalTwin(
        project_id="TEST/PARTB/2026/001",
        project_name="Community Center Construction",
        category="COMMUNITY_HALL",
        project_status=ProjectStatus.IN_PROGRESS,
        location=GeoLocation(district="Lucknow", state="Uttar Pradesh"),
        sanction=Sanction(
            sanction_number="MPLADS/2026/001",
            sanction_date=date(2025, 1, 1),
            sanctioned_amount=Decimal("2500000"),
        ),
        budget=Budget(
            approved_budget=Decimal("2500000"),
            estimated_cost=Decimal("2400000"),
        ),
        expenditure=Expenditure(
            total_expenditure=Decimal("1800000"),
            payments=[
                Payment(payment_id="PAY1", payment_date=date(2025, 3, 15), amount=Decimal("1000000")),
                Payment(payment_id="PAY2", payment_date=date(2025, 3, 16), amount=Decimal("800000")),
            ]
        ),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=72.0,
            physical_progress=35.0,
        ),
        document_types_present=["SANCTION_ORDER", "WORK_ORDER"],
        start_date=datetime(2025, 1, 15),
        expected_completion_date=datetime(2025, 12, 31),
    )

def main():
    print("==================================================")
    print("      PART B AGENTS VERIFICATION RUNNER")
    print("==================================================")

    twin = make_test_twin()
    context = AgentContext(project_id=twin.project_id, digital_twin=twin)

    passed_inherits = 0
    passed_returns = 0
    errors = []

    for agent_cls in ALL_PART_B_AGENTS:
        try:
            agent_instance = agent_cls()
            # 1. Inherits BaseAgent
            inherits = issubclass(agent_cls, BaseAgent)
            if inherits:
                passed_inherits += 1
            else:
                errors.append(f"{agent_cls.__name__} DOES NOT inherit BaseAgent")

            # 2. Run agent and check return type
            evidence = agent_instance.run(context)
            if isinstance(evidence, AgentEvidence):
                passed_returns += 1
                print(f"  [OK] {agent_cls.__name__:<30} -> Score: {evidence.score:5.1f} | Status: {evidence.status.value:<10} | Signals: {len(evidence.signals)}")
            else:
                errors.append(f"{agent_cls.__name__}.run() returned {type(evidence)} instead of AgentEvidence")

        except Exception as e:
            errors.append(f"{agent_cls.__name__} execution failed with error: {str(e)}")
            print(f"  [FAIL] {agent_cls.__name__:<30} -> EXCEPTION: {e}")

    print("\n--------------------------------------------------")
    print(f"Summary:")
    print(f"  - Total Agents Tested: {len(ALL_PART_B_AGENTS)}")
    print(f"  - Inherits BaseAgent:  {passed_inherits}/{len(ALL_PART_B_AGENTS)}")
    print(f"  - Returns AgentEvidence: {passed_returns}/{len(ALL_PART_B_AGENTS)}")
    print(f"  - Errors Encounted:    {len(errors)}")

    if errors:
        print("\nErrors:")
        for err in errors:
            print(f"  - {err}")
        sys.exit(1)
    else:
        print("\nAll 10 Part B Agents verified successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
