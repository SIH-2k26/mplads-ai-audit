"""
db/repositories/document_repo.py
DocumentRepository — stores document records and chunk embeddings.
"""
from __future__ import annotations
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.document import DocumentORM, DocumentChunkORM
from db.repositories.base import BaseRepository


class DocumentRepository(BaseRepository[DocumentORM]):
    model = DocumentORM

    async def get_by_project(self, project_id: str) -> list[DocumentORM]:
        result = await self._session.execute(
            select(DocumentORM).where(DocumentORM.project_id == project_id)
        )
        return list(result.scalars().all())

    async def get_by_checksum(self, checksum: str) -> Optional[DocumentORM]:
        """Find document by SHA-256 checksum to detect duplicate uploads."""
        result = await self._session.execute(
            select(DocumentORM).where(DocumentORM.checksum == checksum)
        )
        return result.scalars().first()


class DocumentChunkRepository(BaseRepository[DocumentChunkORM]):
    model = DocumentChunkORM

    async def get_by_document(self, document_id: str) -> list[DocumentChunkORM]:
        result = await self._session.execute(
            select(DocumentChunkORM).where(DocumentChunkORM.document_id == document_id)
        )
        return list(result.scalars().all())

    async def get_all_texts_for_bm25(self) -> list[tuple[str, str]]:
        """
        Returns (chunk_id, text) pairs for BM25 index construction.
        Called at startup to build the in-memory BM25 corpus.
        """
        result = await self._session.execute(
            select(DocumentChunkORM.id, DocumentChunkORM.text)
        )
        return [(row[0], row[1]) for row in result.all()]
