"""
rag/retrieval/bm25_retriever.py
BM25 lexical retrieval with fallback if rank_bm25 is not installed.
"""
from __future__ import annotations
from typing import Any, Optional
from rag.retriever import RetrievalFilter, RetrievalResult

try:
    from rank_bm25 import BM25Okapi
    HAS_BM25 = True
except ImportError:
    HAS_BM25 = False
    BM25Okapi = None


class BM25Retriever:
    """
    BM25 index for lexical retrieval.
    Falls back to token frequency matching if rank_bm25 is missing.
    """

    def __init__(self):
        self._bm25: Optional[Any] = None
        self._chunks: list[dict] = []
        self._tokenized_corpus: list[list[str]] = []

    def build_index(self, chunks: list[dict]) -> None:
        self._chunks = chunks
        self._tokenized_corpus = [self._tokenize(c["text"]) for c in chunks]
        if self._tokenized_corpus and HAS_BM25:
            self._bm25 = BM25Okapi(self._tokenized_corpus)

    def _tokenize(self, text: str) -> list[str]:
        import re
        return re.findall(r"\w+", text.lower())

    async def retrieve(
        self,
        query: str,
        filters: Optional[RetrievalFilter] = None,
        top_k: int = 10,
    ) -> list[RetrievalResult]:
        if not self._chunks:
            return []

        tokenized_query = self._tokenize(query)

        if HAS_BM25 and self._bm25:
            scores = self._bm25.get_scores(tokenized_query)
        else:
            # Simple term frequency overlap fallback
            q_set = set(tokenized_query)
            scores = []
            for doc_tokens in self._tokenized_corpus:
                match_count = sum(1 for t in doc_tokens if t in q_set)
                scores.append(float(match_count))

        valid_indices = range(len(self._chunks))
        if filters:
            valid_indices = [
                i for i in valid_indices
                if self._passes_filter(self._chunks[i], filters)
            ]

        scored = [(i, scores[i]) for i in valid_indices if scores[i] > 0]
        scored.sort(key=lambda x: x[1], reverse=True)
        top = scored[:top_k]

        results = []
        for idx, score in top:
            chunk = self._chunks[idx]
            results.append(RetrievalResult(
                document_id=chunk["document_id"],
                chunk_id=chunk["chunk_id"],
                text=chunk["text"],
                bm25_score=float(score),
                combined_score=float(score),
                page=chunk.get("page"),
                section=chunk.get("section"),
                document_type=chunk.get("document_type"),
                project_id=chunk.get("project_id"),
                policy_id=chunk.get("policy_id"),
                metadata=chunk.get("metadata", {}),
            ))
        return results

    def _passes_filter(self, chunk: dict, filters: RetrievalFilter) -> bool:
        if filters.project_id and chunk.get("project_id") != filters.project_id:
            return False
        if filters.document_type and chunk.get("document_type") != filters.document_type:
            return False
        if filters.policy_id and chunk.get("policy_id") != filters.policy_id:
            return False
        return True

    def add_chunks(self, new_chunks: list[dict]) -> None:
        all_chunks = self._chunks + new_chunks
        self.build_index(all_chunks)
