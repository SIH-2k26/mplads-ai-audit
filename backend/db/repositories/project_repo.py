"""
db/repositories/project_repo.py
ProjectRepository — CRUD + queries for ProjectORM.
"""
from __future__ import annotations
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.project import ProjectORM
from db.repositories.base import BaseRepository
from models.digital_twin import ProjectDigitalTwin


class ProjectRepository(BaseRepository[ProjectORM]):
    model = ProjectORM

    async def get_by_source_id(self, source_project_id: str) -> Optional[ProjectORM]:
        """Find project by external source ID."""
        result = await self._session.execute(
            select(ProjectORM).where(ProjectORM.source_project_id == source_project_id)
        )
        return result.scalars().first()

    async def list_by_state(self, state: str, limit: int = 100) -> list[ProjectORM]:
        result = await self._session.execute(
            select(ProjectORM).where(ProjectORM.state == state).limit(limit)
        )
        return list(result.scalars().all())

    async def list_by_district(self, district: str, limit: int = 100) -> list[ProjectORM]:
        result = await self._session.execute(
            select(ProjectORM).where(ProjectORM.district == district).limit(limit)
        )
        return list(result.scalars().all())

    async def list_by_status(self, status: str, limit: int = 100) -> list[ProjectORM]:
        result = await self._session.execute(
            select(ProjectORM).where(ProjectORM.project_status == status).limit(limit)
        )
        return list(result.scalars().all())

    async def list_by_contractor(self, contractor_id: str) -> list[ProjectORM]:
        result = await self._session.execute(
            select(ProjectORM).where(ProjectORM.contractor_id == contractor_id)
        )
        return list(result.scalars().all())

    async def upsert_from_twin(self, twin: ProjectDigitalTwin) -> ProjectORM:
        """
        Create or update a ProjectORM from a ProjectDigitalTwin.
        Uses source_project_id for lookup, falls back to twin.project_id.
        """
        existing = await self.get_by_source_id(twin.project_id)
        now = datetime.now(timezone.utc)

        if existing is None:
            orm = ProjectORM(
                id=twin.project_id,
                source_project_id=twin.project_id,
                project_name=twin.project_name or "",
                category=twin.category,
                district=twin.location.district if twin.location else None,
                state=twin.location.state if twin.location else None,
                sanctioned_amount=twin.sanctioned_amount or 0,
                approved_budget=twin.approved_budget or 0,
                estimated_cost=twin.estimated_cost or 0,
                total_expenditure=twin.total_expenditure or 0,
                financial_progress=twin.financial_progress,
                physical_progress=twin.physical_progress,
                start_date=twin.start_date.date() if twin.start_date else None,
                expected_completion_date=twin.expected_completion_date.date()
                    if twin.expected_completion_date else None,
                actual_completion_date=twin.actual_completion_date.date()
                    if twin.actual_completion_date else None,
                project_status=twin.project_status.value if twin.project_status else "UNKNOWN",
                contractor_name=twin.contractor_name,
                data_completeness_score=twin.data_completeness_score,
                created_at=now,
                updated_at=now,
            )
            self._session.add(orm)
            await self._session.flush()
            await self._session.refresh(orm)
            return orm
        else:
            # Update mutable fields
            existing.financial_progress = twin.financial_progress
            existing.physical_progress = twin.physical_progress
            existing.total_expenditure = twin.total_expenditure or existing.total_expenditure
            existing.project_status = twin.project_status.value if twin.project_status else existing.project_status
            existing.data_completeness_score = twin.data_completeness_score
            existing.updated_at = now
            await self._session.flush()
            return existing
