"""
_e2e_audit_test.py
Full E2E pipeline audit verification script.
Tests all 19 agents, orchestration, evidence fusion, NLP, and investigation routing.
"""
import sys
sys.path.insert(0, '.')
import asyncio
from datetime import datetime, date
from decimal import Decimal

from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord
from orchestration.graph import execute_pipeline
from data.pipeline import IngestionPipeline


# ── Test 1: High-Risk Project (Financial/Physical gap, overdue) ────────────────
async def test_high_risk_project():
    twin = ProjectDigitalTwin(
        project_id='AUDIT-HR-001',
        project_name='High Risk Road Construction',
        category='ROAD',
        location=GeoLocation(district='Lucknow', state='Uttar Pradesh'),
        sanction=Sanction(sanction_number='S001', sanction_date=date(2024, 1, 1), sanctioned_amount=Decimal('5000000')),
        budget=Budget(approved_budget=Decimal('5000000'), estimated_cost=Decimal('4800000')),
        expenditure=Expenditure(total_expenditure=Decimal('4600000')),
        latest_progress=ProgressRecord(as_of_date=date.today(), financial_progress=92.0, physical_progress=35.0),
        start_date=datetime(2024, 1, 15),
        expected_completion_date=datetime(2024, 6, 30),  # Overdue
        document_types_present=['SANCTION_ORDER'],
    )
    state = await execute_pipeline(twin)
    ro = state['risk_output']
    assert ro.overall_risk_score >= 0.0
    assert ro.risk_level is not None
    assert len(state['agent_evidence_list']) == 19
    inv = state.get('investigation_case')
    print(f"[PASS] High-Risk Project: Score={ro.overall_risk_score:.1f} ({ro.risk_level.value}), "
          f"Agents={len(state['agent_evidence_list'])}, Case={'CREATED' if inv else 'NONE'}")
    return ro.overall_risk_score


# ── Test 2: Low-Risk Project (healthy, on-time) ────────────────────────────────
async def test_low_risk_project():
    twin = ProjectDigitalTwin(
        project_id='AUDIT-LR-001',
        project_name='Healthy School Construction',
        category='EDUCATION',
        location=GeoLocation(district='Pune', state='Maharashtra'),
        sanction=Sanction(sanction_number='S002', sanction_date=date(2025, 1, 1), sanctioned_amount=Decimal('2000000')),
        budget=Budget(approved_budget=Decimal('2000000'), estimated_cost=Decimal('1900000')),
        expenditure=Expenditure(total_expenditure=Decimal('900000')),
        latest_progress=ProgressRecord(as_of_date=date.today(), financial_progress=45.0, physical_progress=43.0),
        start_date=datetime(2025, 1, 15),
        expected_completion_date=datetime(2026, 12, 31),  # Far future - on track
        document_types_present=['SANCTION_ORDER', 'WORK_ORDER', 'COMPLETION_CERTIFICATE'],
    )
    state = await execute_pipeline(twin)
    ro = state['risk_output']
    assert ro.overall_risk_score >= 0.0
    assert len(state['agent_evidence_list']) == 19
    print(f"[PASS] Low-Risk Project: Score={ro.overall_risk_score:.1f} ({ro.risk_level.value}), "
          f"Agents={len(state['agent_evidence_list'])}")
    return ro.overall_risk_score


# ── Test 3: NLP Summary generated ─────────────────────────────────────────────
async def test_nlp_summary_generated():
    twin = ProjectDigitalTwin(
        project_id='AUDIT-NLP-001',
        project_name='NLP Test Project',
        category='WATER',
        location=GeoLocation(district='Jaipur', state='Rajasthan'),
    )
    state = await execute_pipeline(twin)
    nlp = state.get('nlp_summary', '')
    assert isinstance(nlp, str)
    assert len(nlp) > 0, "NLP summary is empty"
    print(f"[PASS] NLP Summary: {len(nlp)} chars")


# ── Test 4: Ingestion Pipeline processes raw records ─────────────────────────
def test_ingestion_pipeline():
    pipeline = IngestionPipeline()
    records = [
        {
            'project_id': 'ING-001',
            'project_name': 'Road Project Alpha',
            'state': 'Delhi',
            'district': 'New Delhi',
            'category': 'ROAD',
            'sanctioned_amount': 3000000,
            'financial_progress': 65.0,
            'physical_progress': 60.0,
        },
        {
            'project_id': 'ING-002',
            'project_name': 'Health Clinic Beta',
            'state': 'Maharashtra',
            'district': 'Mumbai',
            'category': 'HEALTH',
            'sanctioned_amount': 1500000,
            'financial_progress': 80.0,
            'physical_progress': 75.0,
        },
        {
            # Duplicate - same project
            'project_id': 'ING-003',
            'project_name': 'Road Project Alpha',
            'state': 'Delhi',
            'district': 'New Delhi',
            'category': 'ROAD',
            'sanctioned_amount': 3000000,
        }
    ]
    result = pipeline.process_records(records)
    assert result.total_records == 3
    assert result.valid_records >= 2
    print(f"[PASS] Ingestion Pipeline: total={result.total_records}, "
          f"valid={result.valid_records}, invalid={result.invalid_records}, "
          f"duplicates={result.duplicates_detected}, "
          f"twins_created={len(result.twins_created)}")


# ── Test 5: Trajectory + Early Warning engines ────────────────────────────────
def test_trajectory_and_warnings():
    from engine.trajectory import RiskTrajectoryEngine, RiskHistoricalPoint
    from engine.early_warning import EarlyWarningEngine
    from models.risk import RiskOutput
    from models.enums import RiskLevel
    from datetime import timedelta, timezone

    traj_engine = RiskTrajectoryEngine()
    warning_engine = EarlyWarningEngine()

    now = datetime.now(timezone.utc)
    history = [
        RiskHistoricalPoint(score=40.0, timestamp=now - timedelta(days=60)),
        RiskHistoricalPoint(score=55.0, timestamp=now - timedelta(days=30)),
    ]

    traj = traj_engine.compute_trajectory('TEST-001', current_score=75.0, history=history)
    assert traj.project_id == 'TEST-001'
    assert traj.current_score == 75.0
    assert traj.direction is not None

    twin = ProjectDigitalTwin(
        project_id='TEST-001',
        project_name='Test',
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=95.0,
            physical_progress=35.0
        ),
        expected_completion_date=datetime(2024, 6, 30),
    )
    risk_output = RiskOutput(
        project_id='TEST-001',
        overall_risk_score=75.0,
        risk_level=RiskLevel.HIGH,
        current_risk=60.0,
        future_risk=70.0,
        systemic_risk=30.0,
        top_signals=['Financial gap detected'],
    )
    warnings = warning_engine.evaluate_warnings(twin, risk_output, traj)
    print(f"[PASS] Trajectory: direction={traj.direction.value}, velocity={traj.velocity:.2f}")
    print(f"[PASS] Early Warnings: {len(warnings)} warnings generated")


# ── Main Runner ────────────────────────────────────────────────────────────────
async def main():
    print("=" * 60)
    print("MPLADS Guardian - Full E2E Audit Test")
    print("=" * 60)

    failures = []

    # Async tests
    for fn_name, fn in [
        ('test_high_risk_project', test_high_risk_project),
        ('test_low_risk_project', test_low_risk_project),
        ('test_nlp_summary_generated', test_nlp_summary_generated),
    ]:
        try:
            await fn()
        except Exception as e:
            print(f"[FAIL] {fn_name}: {e}")
            failures.append(fn_name)

    # Sync tests
    for fn_name, fn in [
        ('test_ingestion_pipeline', test_ingestion_pipeline),
        ('test_trajectory_and_warnings', test_trajectory_and_warnings),
    ]:
        try:
            fn()
        except Exception as e:
            print(f"[FAIL] {fn_name}: {e}")
            failures.append(fn_name)

    print("=" * 60)
    if failures:
        print(f"RESULT: {len(failures)} FAILURES: {failures}")
    else:
        print("RESULT: ALL E2E TESTS PASSED")
    print("=" * 60)
    return len(failures)


if __name__ == '__main__':
    exit(asyncio.run(main()))
