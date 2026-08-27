"""
db/repositories/feedback_repo.py
FeedbackRepository — stores analyst feedback for continuous ML improvement.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.project import FeedbackRecordORM
from db.repositories.base import BaseRepository


class FeedbackRepository(BaseRepository[FeedbackRecordORM]):
    model = FeedbackRecordORM

    async def record_feedback(
        self,
        project_id: str,
        case_id: str,
        analyst_id: str,
        predicted_risk_score: float,
        predicted_risk_level: str,
        human_verdict: str,
        is_false_positive: bool = False,
        is_false_negative: bool = False,
        analyst_notes: Optional[str] = None,
        model_version: Optional[str] = None,
        agent_evidence_snapshot: Optional[dict] = None,
        risk_fingerprint_snapshot: Optional[dict] = None,
    ) -> FeedbackRecordORM:
        """
        Store a verified analyst feedback record.
        These records form the labelled dataset for supervised model retraining.
        Only analyst-reviewed feedback (not predictions alone) is stored here.
        """
        orm = FeedbackRecordORM(
            project_id=project_id,
            case_id=case_id,
            analyst_id=analyst_id,
            predicted_risk_score=predicted_risk_score,
            predicted_risk_level=predicted_risk_level,
            human_verdict=human_verdict,
            is_false_positive=is_false_positive,
            is_false_negative=is_false_negative,
            analyst_notes=analyst_notes,
            model_version=model_version,
            agent_evidence_snapshot=agent_evidence_snapshot,
            risk_fingerprint_snapshot=risk_fingerprint_snapshot,
            created_at=datetime.now(timezone.utc),
        )
        self._session.add(orm)
        await self._session.flush()
        await self._session.refresh(orm)
        return orm

    async def get_untraining_records(
        self,
        min_count: int = 50,
        model_version: Optional[str] = None,
    ) -> list[FeedbackRecordORM]:
        """
        Fetch verified feedback records not yet used for training.
        Returns empty list if below `min_count` to prevent underfitting on tiny batches.
        """
        stmt = select(FeedbackRecordORM).where(
            FeedbackRecordORM.used_for_training == False  # noqa: E712
        )
        if model_version:
            stmt = stmt.where(FeedbackRecordORM.model_version == model_version)
        result = await self._session.execute(stmt)
        records = list(result.scalars().all())
        return records if len(records) >= min_count else []

    async def mark_as_used(self, record_ids: list[str]) -> None:
        """Mark feedback records as incorporated into a training run."""
        for record_id in record_ids:
            orm = await self.get(record_id)
            if orm:
                orm.used_for_training = True
                orm.used_at = datetime.now(timezone.utc)
        await self._session.flush()
