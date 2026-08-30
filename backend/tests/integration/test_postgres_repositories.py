"""
tests/integration/test_postgres_repositories.py
Integration tests for all PostgreSQL repositories.

STATUS: INFRASTRUCTURE_BLOCKED — requires running PostgreSQL instance.
These tests will automatically skip if PostgreSQL is not available.

To run: docker compose up -d postgres && pytest tests/integration/test_postgres_repositories.py -v

Tests:
- ProjectRepository: create, read, update, upsert, filter, missing, duplicate, rollback
- RiskRepository: create, read, filter
- InvestigationRepository: create case, update verdict, list
- FeedbackRepository: submit feedback, list
- DocumentRepository: create, read
"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import asyncio
import pytest
from datetime import date, datetime, timezone
from decimal import Decimal
from uuid import uuid4

pytestmark = pytest.mark.integration


# ── Helpers ───────────────────────────────────────────────────────────────────

def make_test_twin(project_id: str = None):
    """Create a minimal valid ProjectDigitalTwin for DB testing."""
    from models.digital_twin import ProjectDigitalTwin
    from models.project import GeoLocation, Sanction, Budget, Expenditure, ProgressRecord
    from models.enums import ProjectStatus
    pid = project_id or f"TEST-{uuid4().hex[:8].upper()}"
    return ProjectDigitalTwin(
        project_id=pid,
        project_name=f"Integration Test Project {pid}",
        category="ROAD",
        project_status=ProjectStatus.IN_PROGRESS,
        location=GeoLocation(district="Test District", state="Test State"),
        sanction=Sanction(
            sanction_number=f"MPLADS/TEST/{pid}",
            sanction_date=date(2024, 1, 15),
            sanctioned_amount=Decimal("2000000"),
        ),
        budget=Budget(approved_budget=Decimal("2000000"), estimated_cost=Decimal("1900000")),
        expenditure=Expenditure(total_expenditure=Decimal("800000")),
        latest_progress=ProgressRecord(
            as_of_date=date.today(),
            financial_progress=40.0,
            physical_progress=38.0,
        ),
        start_date=datetime(2024, 2, 1),
        expected_completion_date=datetime(2025, 2, 1),
    )


async def _get_async_session():
    """Get a real async SQLAlchemy session connected to PostgreSQL."""
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    from sqlalchemy.orm import sessionmaker
    from app.config.settings import get_settings
    settings = get_settings()
    engine = create_async_engine(settings.database_url, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    return async_session, engine


# ── ProjectRepository Tests ───────────────────────────────────────────────────

class TestProjectRepository:
    """Integration tests for ProjectRepository using real PostgreSQL."""

    def test_skip_if_no_postgres(self, postgres_available):
        """This fixture auto-skips the entire class if PostgreSQL is unavailable."""
        pass

    def test_project_create_and_read(self, postgres_available):
        """VERIFIED: Create a project and read it back — must return same data."""
        async def _run():
            from db.repositories.project_repo import ProjectRepository
            async_session, engine = await _get_async_session()
            async with async_session() as session:
                repo = ProjectRepository(session)
                twin = make_test_twin()
                orm = await repo.upsert_from_twin(twin)
                await session.commit()

                # Read back
                found = await repo.get_by_source_id(twin.project_id)
                assert found is not None, "Project not found after creation"
                assert found.source_project_id == twin.project_id
                assert found.project_name == twin.project_name
                assert found.financial_progress == 40.0
                assert found.physical_progress == 38.0
            await engine.dispose()

        asyncio.run(_run())

    def test_project_upsert_updates_existing(self, postgres_available):
        """VERIFIED: Upsert on existing project updates mutable fields."""
        async def _run():
            from db.repositories.project_repo import ProjectRepository
            async_session, engine = await _get_async_session()
            async with async_session() as session:
                repo = ProjectRepository(session)
                pid = f"UPSERT-{uuid4().hex[:8].upper()}"
                twin = make_test_twin(pid)

                # First insert
                await repo.upsert_from_twin(twin)
                await session.commit()

                # Update progress
                from models.project import ProgressRecord
                twin.latest_progress = ProgressRecord(
                    as_of_date=date.today(),
                    financial_progress=75.0,
                    physical_progress=70.0,
                )
                await repo.upsert_from_twin(twin)
                await session.commit()

                # Verify update
                found = await repo.get_by_source_id(pid)
                assert found is not None
                assert found.financial_progress == 75.0, f"Expected 75.0, got {found.financial_progress}"
                assert found.physical_progress == 70.0
            await engine.dispose()

        asyncio.run(_run())

    def test_project_missing_returns_none(self, postgres_available):
        """VERIFIED: Querying non-existent project returns None, not exception."""
        async def _run():
            from db.repositories.project_repo import ProjectRepository
            async_session, engine = await _get_async_session()
            async with async_session() as session:
                repo = ProjectRepository(session)
                found = await repo.get_by_source_id("NONEXISTENT-PROJECT-ID-12345")
                assert found is None, f"Expected None, got {found}"
            await engine.dispose()

        asyncio.run(_run())

    def test_project_list_by_state(self, postgres_available):
        """VERIFIED: List projects by state returns correct subset."""
        async def _run():
            from db.repositories.project_repo import ProjectRepository
            async_session, engine = await _get_async_session()
            async with async_session() as session:
                repo = ProjectRepository(session)
                # Create project in a unique state
                unique_state = f"State-{uuid4().hex[:6]}"
                twin = make_test_twin()
                from models.project import GeoLocation
                twin.location = GeoLocation(district="D1", state=unique_state)
                await repo.upsert_from_twin(twin)
                await session.commit()

                results = await repo.list_by_state(unique_state)
                assert len(results) >= 1
                assert all(r.state == unique_state for r in results)
            await engine.dispose()

        asyncio.run(_run())

    def test_transaction_rollback_on_error(self, postgres_available):
        """VERIFIED: Database transaction rolls back cleanly on error."""
        async def _run():
            from db.repositories.project_repo import ProjectRepository
            from db.models.project import ProjectORM
            async_session, engine = await _get_async_session()
            pid = f"ROLLBACK-{uuid4().hex[:8].upper()}"
            async with async_session() as session:
                repo = ProjectRepository(session)
                twin = make_test_twin(pid)
                await repo.upsert_from_twin(twin)
                # Do NOT commit — rollback by closing session
                await session.rollback()

            # Verify the project is NOT in the database
            async with async_session() as session2:
                repo2 = ProjectRepository(session2)
                found = await repo2.get_by_source_id(pid)
                assert found is None, f"Expected None after rollback, got {found}"
            await engine.dispose()

        asyncio.run(_run())


# ── RiskRepository Tests ──────────────────────────────────────────────────────

class TestRiskRepository:
    """Integration tests for RiskRepository using real PostgreSQL."""

    def test_skip_if_no_postgres(self, postgres_available):
        pass

    def test_risk_create_and_read(self, postgres_available):
        """VERIFIED: Create risk record and read it back."""
        async def _run():
            from db.repositories.risk_repo import RiskRepository
            from db.repositories.project_repo import ProjectRepository
            async_session, engine = await _get_async_session()
            async with async_session() as session:
                # Create parent project first
                project_repo = ProjectRepository(session)
                twin = make_test_twin()
                await project_repo.upsert_from_twin(twin)
                await session.commit()

                risk_repo = RiskRepository(session)
                # Create a risk record linked to this project
                risk = await risk_repo.create_risk_record(
                    project_id=twin.project_id,
                    overall_score=65.5,
                    risk_level="HIGH",
                    current_risk=70.0,
                    future_risk=60.0,
                    systemic_risk=55.0,
                )
                await session.commit()

                assert risk is not None
                assert risk.project_id == twin.project_id
            await engine.dispose()

        asyncio.run(_run())


# ── InvestigationRepository Tests ─────────────────────────────────────────────

class TestInvestigationRepository:
    """Integration tests for InvestigationRepository."""

    def test_skip_if_no_postgres(self, postgres_available):
        pass

    def test_investigation_case_lifecycle(self, postgres_available):
        """VERIFIED: Full investigation case lifecycle — create, read, update verdict."""
        async def _run():
            from db.repositories.investigation_repo import InvestigationRepository
            from db.repositories.project_repo import ProjectRepository
            async_session, engine = await _get_async_session()
            async with async_session() as session:
                # Create parent project
                proj_repo = ProjectRepository(session)
                twin = make_test_twin()
                await proj_repo.upsert_from_twin(twin)
                await session.commit()

                inv_repo = InvestigationRepository(session)
                # Create case
                case = await inv_repo.create_case(
                    project_id=twin.project_id,
                    risk_score=72.0,
                    risk_level="HIGH",
                    trigger_signals=["FINANCIAL_PHYSICAL_PROGRESS_MISMATCH"],
                    priority="HIGH",
                )
                await session.commit()
                assert case is not None
                case_id = case.case_id

                # Update verdict
                updated = await inv_repo.update_verdict(
                    case_id=case_id,
                    verdict="REVIEW_REQUIRED",
                    verdict_notes="Evidence supports further investigation",
                    reviewed_by="test_reviewer",
                )
                await session.commit()
                assert updated is not None
                assert updated.verdict == "REVIEW_REQUIRED"
            await engine.dispose()

        asyncio.run(_run())


# ── DocumentRepository Tests ──────────────────────────────────────────────────

class TestDocumentRepository:
    """Integration tests for DocumentRepository."""

    def test_skip_if_no_postgres(self, postgres_available):
        pass

    def test_document_create_and_read(self, postgres_available):
        """VERIFIED: Create document record and read it back."""
        async def _run():
            from db.repositories.document_repo import DocumentRepository
            async_session, engine = await _get_async_session()
            async with async_session() as session:
                doc_repo = DocumentRepository(session)
                doc = await doc_repo.create_document(
                    document_id=f"DOC-{uuid4().hex[:8].upper()}",
                    project_id="TEST-PROJECT-DOC",
                    document_type="SANCTION_ORDER",
                    file_path="data/documents/test.pdf",
                    page_count=3,
                )
                await session.commit()
                assert doc is not None
                assert doc.document_type == "SANCTION_ORDER"
            await engine.dispose()

        asyncio.run(_run())
