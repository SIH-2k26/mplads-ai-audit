"""
app/config/settings.py
Centralized configuration using Pydantic BaseSettings.
All secrets come from environment variables — never hardcoded.
"""
from __future__ import annotations
from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────────────────
    environment: str = Field("development", description="development | staging | production")
    log_level: str = Field("INFO", description="DEBUG | INFO | WARNING | ERROR")
    debug: bool = False

    # ── PostgreSQL ────────────────────────────────────────────────────────────
    postgres_host: str = Field("localhost")
    postgres_port: int = Field(5432)
    postgres_db: str = Field("mplads_guardian")
    postgres_user: str = Field("mplads")
    postgres_password: str = Field("mplads_secret")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def database_url_sync(self) -> str:
        """Synchronous URL for Alembic migrations."""
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    # ── Neo4j ─────────────────────────────────────────────────────────────────
    neo4j_uri: str = Field("bolt://localhost:7687")
    neo4j_user: str = Field("neo4j")
    neo4j_password: str = Field("mplads_neo4j")
    neo4j_database: str = Field("neo4j")

    # ── Embedding / RAG ───────────────────────────────────────────────────────
    embedding_model: str = Field("BAAI/bge-m3")
    reranker_model: str = Field("BAAI/bge-reranker-v2-m3")
    vector_dimension: int = Field(1024, description="BGE-M3 produces 1024-dim vectors")
    use_gpu: bool = Field(False, description="Set True if CUDA is available")

    rag_top_k: int = Field(10, description="Candidates before reranking")
    rerank_top_k: int = Field(3, description="Results after reranking")
    bm25_top_k: int = Field(10)

    # ── OCR ───────────────────────────────────────────────────────────────────
    ocr_engine: str = Field("PADDLE_OCR", description="PADDLE_OCR | TESSERACT")
    ocr_fallback_threshold: float = Field(
        0.5, description="Extraction quality below this triggers OCR"
    )
    tesseract_lang: str = Field("eng", description="Tesseract language(s)")

    # ── Policy ────────────────────────────────────────────────────────────────
    policy_default_version: str = Field("2.0", description="Default policy version to apply")
    policy_config_dir: str = Field("configs/policies")

    # ── Document Storage ──────────────────────────────────────────────────────
    document_storage_path: str = Field("data/documents")
    raw_data_path: str = Field("data/raw")
    processed_data_path: str = Field("data/processed")

    # ── Chunking ──────────────────────────────────────────────────────────────
    chunk_size: int = Field(512, description="Target chunk size in tokens")
    chunk_overlap: int = Field(64, description="Overlap between chunks in tokens")

    # ── Entity Resolution ─────────────────────────────────────────────────────
    fuzzy_match_threshold: float = Field(
        0.85, description="Minimum similarity for fuzzy entity matching"
    )

    # ── Caching ───────────────────────────────────────────────────────────────
    enable_embedding_cache: bool = True
    enable_rag_cache: bool = True
    cache_ttl_seconds: int = 3600


def get_settings() -> Settings:
    """Returns a cached Settings instance."""
    return _settings


_settings = Settings()
