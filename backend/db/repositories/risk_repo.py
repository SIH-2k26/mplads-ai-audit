"""
db/repositories/risk_repo.py
RiskRepository — stores and queries risk history per project.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.project import RiskHistoryORM
from db.repositories.base import BaseRepository
from models.risk import RiskOutput


class RiskRepository(BaseRepository[RiskHistoryORM]):
    model = RiskHistoryORM

    async def record_risk(
        self,
        risk_output: RiskOutput,
        agent_evidence_json: dict,
        model_version: Optional[str] = None,
        policy_version: Optional[str] = None,
        weight_snapshot: Optional[dict] = None,
    ) -> RiskHistoryORM:
        """
        Persist a RiskOutput snapshot to risk_history.
        Every analysis creates an immutable record — never overwrite historical records.
        """
        orm = RiskHistoryORM(
            project_id=risk_output.project_id,
            overall_risk_score=float(risk_output.overall_risk_score),
            risk_level=risk_output.risk_level.value,
            current_risk=float(risk_output.current_risk),
            future_risk=float(risk_output.future_risk),
            systemic_risk=float(risk_output.systemic_risk),
            fingerprint_json=risk_output.fingerprint.model_dump() if risk_output.fingerprint else None,
            top_signals=risk_output.top_signals,
            agent_evidence_json=agent_evidence_json,
            model_version=model_version or risk_output.model_version,
            policy_version=policy_version,
            weight_snapshot=weight_snapshot,
            computed_at=risk_output.computed_at or datetime.now(timezone.utc),
        )
        self._session.add(orm)
        await self._session.flush()
        await self._session.refresh(orm)
        return orm

    async def get_history(
        self,
        project_id: str,
        limit: int = 24,
    ) -> list[RiskHistoryORM]:
        """
        Retrieve risk history for a project, newest first.
        Returns up to `limit` records for trajectory computation.
        """
        result = await self._session.execute(
            select(RiskHistoryORM)
            .where(RiskHistoryORM.project_id == project_id)
            .order_by(desc(RiskHistoryORM.computed_at))
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_latest(self, project_id: str) -> Optional[RiskHistoryORM]:
        """Get most recent risk record for a project."""
        history = await self.get_history(project_id, limit=1)
        return history[0] if history else None
