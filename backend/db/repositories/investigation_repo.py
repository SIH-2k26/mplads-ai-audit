"""
db/repositories/investigation_repo.py
InvestigationRepository — persists InvestigationCase + Evidence + Verdicts.
"""
from __future__ import annotations
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.project import InvestigationCaseORM, InvestigationEvidenceORM, InvestigationVerdictORM
from db.repositories.base import BaseRepository
from models.investigation import InvestigationCase, CaseEvidence, InvestigatorVerdict


class InvestigationRepository(BaseRepository[InvestigationCaseORM]):
    model = InvestigationCaseORM

    async def save_case(self, case: InvestigationCase) -> InvestigationCaseORM:
        """Persist an InvestigationCase domain object. Upserts by case_id."""
        existing = await self.get(case.case_id)
        if existing:
            existing.status = case.status.value if hasattr(case.status, "value") else case.status
            existing.priority = case.priority
            existing.updated_at = case.updated_at
            await self._session.flush()
            return existing

        orm = InvestigationCaseORM(
            id=case.case_id,
            project_id=case.project_id,
            status=case.status.value if hasattr(case.status, "value") else str(case.status),
            priority=case.priority,
            risk_score=case.risk_score,
            risk_level=case.risk_level.value if hasattr(case.risk_level, "value") else str(case.risk_level),
            trigger_signals=case.trigger_signals,
            agent_summary=case.agent_summary,
            summary_text=case.summary_text,
            created_at=case.created_at,
            updated_at=case.updated_at,
        )
        self._session.add(orm)
        await self._session.flush()
        return orm

    async def get_by_project(self, project_id: str) -> list[InvestigationCaseORM]:
        result = await self._session.execute(
            select(InvestigationCaseORM).where(InvestigationCaseORM.project_id == project_id)
        )
        return list(result.scalars().all())

    async def get_open_cases(self, limit: int = 100) -> list[InvestigationCaseORM]:
        result = await self._session.execute(
            select(InvestigationCaseORM)
            .where(InvestigationCaseORM.status.in_(["OPEN", "UNDER_REVIEW"]))
            .limit(limit)
        )
        return list(result.scalars().all())
