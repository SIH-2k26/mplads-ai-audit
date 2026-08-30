"""
rag/store/vector_store.py
PGVectorStore — stores and queries document chunk embeddings in PostgreSQL pgvector.
Implements cosine similarity nearest-neighbor search.
"""
from __future__ import annotations
import json
import uuid
from typing import Optional

import numpy as np

from rag.retriever import RetrievalResult
from app.utils.logging import get_logger

logger = get_logger("vector_store")


class PGVectorStore:
    """
    Stores chunk embeddings in PostgreSQL using the pgvector extension.
    Uses raw SQL via asyncpg for efficient vector operations.

    Schema expectation (from migration 001):
        document_chunks table with columns:
          id TEXT PRIMARY KEY,
          document_id TEXT,
          chunk_index INT,
          text TEXT,
          embedding vector(1024),   -- dimension matches BGE-M3 provider
          page_number INT,
          section TEXT,
          project_id TEXT,
          document_type TEXT,
          policy_id TEXT,
          metadata JSONB
    """

    def __init__(self, connection_pool, embedding_dimension: int = 1024):
        """
        Args:
            connection_pool: asyncpg connection pool
            embedding_dimension: Must match the embedding model dimension
        """
        self._pool = connection_pool
        self._dim = embedding_dimension

    async def store_chunk(
        self,
        chunk_id: str,
        document_id: str,
        text: str,
        embedding: np.ndarray,
        chunk_index: int = 0,
        page_number: Optional[int] = None,
        section: Optional[str] = None,
        project_id: Optional[str] = None,
        document_type: Optional[str] = None,
        policy_id: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> None:
        """Store a single chunk and its embedding."""
        embedding_str = "[" + ",".join(str(x) for x in embedding.tolist()) + "]"
        async with self._pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO document_chunks
                    (id, document_id, chunk_index, text, embedding, page_number,
                     section, project_id, document_type, policy_id, metadata)
                VALUES ($1,$2,$3,$4,$5::vector,$6,$7,$8,$9,$10,$11)
                ON CONFLICT (id) DO UPDATE SET
                    text = EXCLUDED.text,
                    embedding = EXCLUDED.embedding,
                    updated_at = now()
                """,
                chunk_id,
                document_id,
                chunk_index,
                text,
                embedding_str,
                page_number,
                section,
                project_id,
                document_type,
                policy_id,
                json.dumps(metadata or {}),
            )

    async def store_chunks_batch(
        self,
        chunks: list[dict],
        embeddings: np.ndarray,
    ) -> int:
        """
        Batch store chunks + embeddings. chunks is a list of dicts with keys:
        chunk_id, document_id, text, chunk_index, page_number, section, project_id, etc.
        Returns count of stored chunks.
        """
        if not chunks or embeddings is None or len(chunks) != len(embeddings):
            return 0

        stored = 0
        async with self._pool.acquire() as conn:
            for i, chunk in enumerate(chunks):
                emb = embeddings[i]
                embedding_str = "[" + ",".join(str(x) for x in emb.tolist()) + "]"
                try:
                    await conn.execute(
                        """
                        INSERT INTO document_chunks
                            (id, document_id, chunk_index, text, embedding,
                             page_number, section, project_id, document_type, policy_id, metadata)
                        VALUES ($1,$2,$3,$4,$5::vector,$6,$7,$8,$9,$10,$11)
                        ON CONFLICT (id) DO UPDATE SET
                            text = EXCLUDED.text, embedding = EXCLUDED.embedding
                        """,
                        chunk["chunk_id"],
                        chunk["document_id"],
                        chunk.get("chunk_index", i),
                        chunk["text"],
                        embedding_str,
                        chunk.get("page_number"),
                        chunk.get("section"),
                        chunk.get("project_id"),
                        chunk.get("document_type"),
                        chunk.get("policy_id"),
                        json.dumps(chunk.get("metadata") or {}),
                    )
                    stored += 1
                except Exception as e:
                    logger.error("vector_store.store_chunk_error", chunk_id=chunk.get("chunk_id"), error=str(e))
        return stored

    async def similarity_search(
        self,
        query_embedding: np.ndarray,
        top_k: int = 10,
        project_id: Optional[str] = None,
        document_type: Optional[str] = None,
        policy_id: Optional[str] = None,
    ) -> list[RetrievalResult]:
        """
        Cosine similarity nearest-neighbor search using pgvector <=> operator.
        Returns top_k results ordered by similarity descending.
        """
        embedding_str = "[" + ",".join(str(x) for x in query_embedding.tolist()) + "]"

        # Build WHERE clause for metadata filters
        conditions = []
        params = [embedding_str, top_k]
        if project_id:
            conditions.append(f"project_id = ${len(params) + 1}")
            params.append(project_id)
        if document_type:
            conditions.append(f"document_type = ${len(params) + 1}")
            params.append(document_type)
        if policy_id:
            conditions.append(f"policy_id = ${len(params) + 1}")
            params.append(policy_id)

        where_clause = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        sql = f"""
            SELECT
                id AS chunk_id,
                document_id,
                text,
                page_number,
                section,
                project_id,
                document_type,
                policy_id,
                metadata,
                1 - (embedding <=> $1::vector) AS score
            FROM document_chunks
            {where_clause}
            ORDER BY embedding <=> $1::vector
            LIMIT $2
        """

        try:
            async with self._pool.acquire() as conn:
                rows = await conn.fetch(sql, *params)
        except Exception as e:
            logger.error("vector_store.search_error", error=str(e))
            return []

        results = []
        for row in rows:
            results.append(RetrievalResult(
                document_id=row["document_id"],
                chunk_id=row["chunk_id"],
                text=row["text"],
                dense_score=float(row["score"]),
                combined_score=float(row["score"]),
                page=row.get("page_number"),
                section=row.get("section"),
                document_type=row.get("document_type"),
                project_id=row.get("project_id"),
                policy_id=row.get("policy_id"),
                metadata=dict(row.get("metadata") or {}),
            ))
        return results
