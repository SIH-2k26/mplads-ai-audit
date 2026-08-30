"""
rag/reranking/bge_reranker.py
BGEReranker — cross-encoder reranker using sentence-transformers cross-encoders.
Falls back to score pass-through if reranker model unavailable.
"""
from __future__ import annotations
from typing import Optional

from rag.retriever import RetrievalResult
from app.utils.logging import get_logger

logger = get_logger("bge_reranker")


class BGEReranker:
    """
    Cross-encoder reranker for RAG candidate reranking.

    Default model: cross-encoder/ms-marco-MiniLM-L-6-v2 (fast, small)
    Production model: BAAI/bge-reranker-v2-m3 (configurable via model_name)

    If model cannot be loaded (no internet / import error), falls back to
    passing through candidates in original order — retrieval still works,
    just without reranking quality improvement.
    """

    def __init__(
        self,
        model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2",
        device: str = "cpu",
    ):
        self._model_name = model_name
        self._device = device
        self._model = None
        self._available = False

    def _load(self) -> None:
        if self._model is not None:
            return
        try:
            from sentence_transformers import CrossEncoder
            self._model = CrossEncoder(self._model_name, device=self._device)
            self._available = True
            logger.info("bge_reranker.loaded", model=self._model_name)
        except Exception as e:
            logger.warning("bge_reranker.load_failed", error=str(e), fallback="pass-through")
            self._available = False

    def rerank(
        self,
        query: str,
        candidates: list[RetrievalResult],
        top_k: int = 3,
    ) -> list[RetrievalResult]:
        """
        Rerank candidates using cross-encoder scores.
        Returns top_k results with reranker_score populated and sorted descending.
        Falls back to original combined_score order if model unavailable.
        """
        if not candidates:
            return []

        self._load()

        if not self._available or self._model is None:
            # Fallback: return top_k by combined_score
            return sorted(candidates, key=lambda r: r.combined_score, reverse=True)[:top_k]

        try:
            pairs = [(query, r.text) for r in candidates]
            scores = self._model.predict(pairs)

            for i, result in enumerate(candidates):
                result.reranker_score = float(scores[i])
                # Blend reranker score with original combined score (70/30)
                result.combined_score = 0.7 * float(scores[i]) + 0.3 * result.combined_score

            reranked = sorted(candidates, key=lambda r: r.combined_score, reverse=True)
            return reranked[:top_k]

        except Exception as e:
            logger.error("bge_reranker.predict_error", error=str(e))
            return sorted(candidates, key=lambda r: r.combined_score, reverse=True)[:top_k]
