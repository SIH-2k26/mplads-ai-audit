"""
rag/embeddings/provider.py
EmbeddingProvider abstraction — decouples RAG from specific embedding model.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
import numpy as np
from typing import Union


class EmbeddingProvider(ABC):
    """Abstract embedding provider. Swap models without changing RAG code."""

    @property
    @abstractmethod
    def model_name(self) -> str: ...

    @property
    @abstractmethod
    def dimension(self) -> int: ...

    @abstractmethod
    def encode(self, texts: list[str], batch_size: int = 32) -> np.ndarray:
        """Encode texts to embeddings. Returns (N, dimension) array."""
        ...

    def encode_single(self, text: str) -> np.ndarray:
        return self.encode([text])[0]


class BGEM3EmbeddingProvider(EmbeddingProvider):
    """BGE-M3 multilingual embedding provider (CPU by default)."""

    def __init__(self, model_name: str = "BAAI/bge-m3", use_gpu: bool = False):
        self._model_name = model_name
        self._use_gpu = use_gpu
        self._model = None

    @property
    def model_name(self) -> str:
        return self._model_name

    @property
    def dimension(self) -> int:
        return 1024  # BGE-M3 produces 1024-dim vectors

    def _load(self):
        if self._model is None:
            from FlagEmbedding import BGEM3FlagModel
            self._model = BGEM3FlagModel(
                self._model_name,
                use_fp16=self._use_gpu,
            )

    def encode(self, texts: list[str], batch_size: int = 16) -> np.ndarray:
        self._load()
        output = self._model.encode(
            texts,
            batch_size=batch_size,
            max_length=512,
            return_dense=True,
            return_sparse=False,
            return_colbert_vecs=False,
        )
        return np.array(output["dense_vecs"])


class SentenceTransformerProvider(EmbeddingProvider):
    """
    Fallback: sentence-transformers compatible models (e.g., multilingual-e5-large).
    """

    def __init__(self, model_name: str = "intfloat/multilingual-e5-large", use_gpu: bool = False):
        self._model_name = model_name
        self._use_gpu = use_gpu
        self._model = None
        self._dim = None

    @property
    def model_name(self) -> str:
        return self._model_name

    @property
    def dimension(self) -> int:
        if self._dim is None:
            self._load()
        return self._dim

    def _load(self):
        if self._model is None:
            from sentence_transformers import SentenceTransformer
            device = "cuda" if self._use_gpu else "cpu"
            self._model = SentenceTransformer(self._model_name, device=device)
            self._dim = self._model.get_sentence_embedding_dimension()

    def encode(self, texts: list[str], batch_size: int = 32) -> np.ndarray:
        self._load()
        return self._model.encode(texts, batch_size=batch_size, normalize_embeddings=True)


def create_embedding_provider(model_name: str, use_gpu: bool = False) -> EmbeddingProvider:
    """Factory: create the appropriate embedding provider for a model name."""
    if "bge-m3" in model_name.lower():
        return BGEM3EmbeddingProvider(model_name, use_gpu)
    else:
        return SentenceTransformerProvider(model_name, use_gpu)
