"""
rag/retrieval/dense_retriever.py
DenseRetriever — queries PGVectorStore with an embedded query.
Implements the same retrieve() interface as BM25Retriever.
"""
from __future__ import annotations
from typing import Optional

from rag.retriever import RetrievalFilter, RetrievalResult
from rag.embeddings.provider import EmbeddingProvider
from rag.store.vector_store import PGVectorStore
from app.utils.logging import get_logger

logger = get_logger("dense_retriever")


class DenseRetriever:
    """
    Performs dense vector search via PGVectorStore.

    Workflow:
    1. Encode query text using the EmbeddingProvider
    2. Query PGVectorStore for top_k nearest neighbors
    3. Apply metadata filters (project_id, document_type, policy_id)
    4. Return list[RetrievalResult] with dense_score populated

    Falls back to empty list gracefully if vector store is unavailable.
    """

    def __init__(
        self,
        embedding_provider: EmbeddingProvider,
        vector_store: PGVectorStore,
    ):
        self._provider = embedding_provider
        self._store = vector_store

    async def retrieve(
        self,
        query: str,
        filters: Optional[RetrievalFilter] = None,
        top_k: int = 10,
    ) -> list[RetrievalResult]:
        """
        Embed query and perform cosine similarity search.
        Returns up to top_k RetrievalResults.
        """
        try:
            embedding = self._provider.encode_single(query)
            results = await self._store.similarity_search(
                query_embedding=embedding,
                top_k=top_k,
                project_id=filters.project_id if filters else None,
                document_type=filters.document_type if filters else None,
                policy_id=filters.policy_id if filters else None,
            )
            return results
        except Exception as e:
            logger.error("dense_retriever.error", error=str(e))
            return []
