"""
rag/embeddings/sentence_transformer_provider.py
SentenceTransformerProvider — lightweight default embedding provider.
Uses sentence-transformers (all-MiniLM-L6-v2 by default).
Implements EmbeddingProvider ABC so it is swappable with BGEM3.
"""
from __future__ import annotations
import numpy as np
from rag.embeddings.provider import EmbeddingProvider


class SentenceTransformerProvider(EmbeddingProvider):
    """
    Wraps sentence-transformers for embedding.
    Default model: all-MiniLM-L6-v2 (80MB, 384-dim, fast CPU inference).
    Can be swapped to BGE-M3 (1024-dim) via model_name parameter.

    Lazy-loaded: model is only downloaded on first use.
    """

    MODEL_DIMENSIONS = {
        "sentence-transformers/all-MiniLM-L6-v2": 384,
        "BAAI/bge-m3": 1024,
        "BAAI/bge-small-en-v1.5": 384,
        "BAAI/bge-base-en-v1.5": 768,
        "BAAI/bge-large-en-v1.5": 1024,
    }

    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        device: str = "cpu",
    ):
        self._model_name = model_name
        self._device = device
        self._model = None

    @property
    def model_name(self) -> str:
        return self._model_name

    @property
    def dimension(self) -> int:
        return self.MODEL_DIMENSIONS.get(self._model_name, 384)

    def _load(self) -> None:
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self._model_name, device=self._device)

    def encode(self, texts: list[str], batch_size: int = 32) -> np.ndarray:
        """
        Encode a list of texts to embeddings.
        Returns numpy array of shape (N, dimension).
        """
        self._load()
        embeddings = self._model.encode(
            texts,
            batch_size=batch_size,
            convert_to_numpy=True,
            normalize_embeddings=True,  # L2-normalize for cosine similarity
            show_progress_bar=False,
        )
        return embeddings

    def encode_single(self, text: str) -> np.ndarray:
        return self.encode([text])[0]
