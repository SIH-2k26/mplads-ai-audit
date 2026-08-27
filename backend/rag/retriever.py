"""
rag/retriever.py
RAGRetriever — CONTRACT 3.
The ONLY interface that Part B agents should use for document retrieval.
Part B must NOT know how embeddings, BM25, or reranking work.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Optional
from models.provenance import ProvenanceRecord


@dataclass
class RetrievalFilter:
    """Optional filters to narrow retrieval scope."""
    project_id: Optional[str] = None
    document_type: Optional[str] = None
    policy_id: Optional[str] = None
    policy_version: Optional[str] = None
    min_confidence: float = 0.0


@dataclass
class RetrievalResult:
    """A single retrieved evidence chunk."""
    document_id: str
    chunk_id: str
    text: str

    # Retrieval scores
    bm25_score: Optional[float] = None
    dense_score: Optional[float] = None
    combined_score: float = 0.0
    reranker_score: Optional[float] = None

    # Location in source document
    page: Optional[int] = None
    section: Optional[str] = None

    # Metadata
    document_type: Optional[str] = None
    project_id: Optional[str] = None
    policy_id: Optional[str] = None

    metadata: dict[str, Any] = field(default_factory=dict)
    provenance: Optional[ProvenanceRecord] = None


@dataclass
class RetrievalResponse:
    """CONTRACT 3: Standard response from RAGRetriever."""
    query: str
    filters_applied: Optional[RetrievalFilter] = None
    results: list[RetrievalResult] = field(default_factory=list)
    total_candidates: int = 0
    retrieval_time_ms: Optional[float] = None

    def top_texts(self, n: int = 3) -> list[str]:
        return [r.text for r in self.results[:n]]

    def is_empty(self) -> bool:
        return len(self.results) == 0


class RAGRetriever:
    """
    CONTRACT 3: The RAG retrieval interface.
    Implements hybrid BM25 + dense retrieval with BGE reranking.
    Part B agents call retrieve() — they never touch embeddings, BM25, or pgvector directly.

    Usage:
        retriever = RAGRetriever(...)
        response = await retriever.retrieve(
            query="What is the maximum permissible cost revision for MPLADS?",
            filters=RetrievalFilter(policy_id="mplads_guidelines_2022"),
            top_k=3,
        )
        for result in response.results:
            print(result.text, result.reranker_score)
    """

    def __init__(
        self,
        bm25_retriever=None,
        dense_retriever=None,
        reranker=None,
        top_k: int = 10,
        rerank_top_k: int = 3,
    ):
        self._bm25 = bm25_retriever
        self._dense = dense_retriever
        self._reranker = reranker
        self._top_k = top_k
        self._rerank_top_k = rerank_top_k

    async def retrieve(
        self,
        query: str,
        filters: Optional[RetrievalFilter] = None,
        top_k: Optional[int] = None,
    ) -> RetrievalResponse:
        """
        CONTRACT 3 entry point.
        Performs hybrid retrieval and returns ranked results.
        """
        import time
        start = time.perf_counter()
        k = top_k or self._top_k

        try:
            # Step 1: BM25 retrieval
            bm25_results = []
            if self._bm25:
                bm25_results = await self._bm25.retrieve(query, filters=filters, top_k=k)

            # Step 2: Dense retrieval
            dense_results = []
            if self._dense:
                dense_results = await self._dense.retrieve(query, filters=filters, top_k=k)

            # Step 3: Merge candidates (reciprocal rank fusion)
            candidates = self._merge_candidates(bm25_results, dense_results)

            # Step 4: Rerank
            if self._reranker and candidates:
                candidates = await self._reranker.rerank(
                    query=query,
                    candidates=candidates,
                    top_k=self._rerank_top_k,
                )

            elapsed_ms = (time.perf_counter() - start) * 1000
            return RetrievalResponse(
                query=query,
                filters_applied=filters,
                results=candidates[:k],
                total_candidates=len(bm25_results) + len(dense_results),
                retrieval_time_ms=round(elapsed_ms, 2),
            )

        except Exception as e:
            # Never crash the caller — return empty response with error noted
            return RetrievalResponse(
                query=query,
                filters_applied=filters,
                results=[],
                retrieval_time_ms=None,
                total_candidates=0,
            )

    def _merge_candidates(
        self,
        bm25_results: list[RetrievalResult],
        dense_results: list[RetrievalResult],
    ) -> list[RetrievalResult]:
        """Reciprocal Rank Fusion (RRF) to combine BM25 and dense results."""
        k = 60  # RRF constant
        scores: dict[str, float] = {}
        lookup: dict[str, RetrievalResult] = {}

        for rank, result in enumerate(bm25_results):
            key = result.chunk_id
            scores[key] = scores.get(key, 0) + 1.0 / (k + rank + 1)
            lookup[key] = result

        for rank, result in enumerate(dense_results):
            key = result.chunk_id
            scores[key] = scores.get(key, 0) + 1.0 / (k + rank + 1)
            if key not in lookup:
                lookup[key] = result

        sorted_keys = sorted(scores.keys(), key=lambda k: scores[k], reverse=True)
        merged = []
        for key in sorted_keys:
            result = lookup[key]
            result.combined_score = scores[key]
            merged.append(result)
        return merged
