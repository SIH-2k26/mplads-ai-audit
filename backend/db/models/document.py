"""
db/models/document.py
ORM models for documents and vector chunks.
"""
from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Boolean, DateTime, ForeignKey, Float, Index, Integer, String, Text,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from .base import Base, TimestampMixin


class DocumentORM(Base, TimestampMixin):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    file_name: Mapped[str] = mapped_column(String(512), nullable=False)
    file_path: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    file_type: Mapped[str] = mapped_column(String(16), nullable=False)
    file_size_bytes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    checksum: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, unique=True, index=True)

    document_type: Mapped[str] = mapped_column(String(64), nullable=False, default="OTHER", index=True)
    project_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("projects.id", ondelete="SET NULL"), nullable=True, index=True
    )

    # Processing state
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="PENDING", index=True)
    ocr_used: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    ocr_engine: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    ocr_confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    extraction_quality: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    page_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    chunk_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    raw_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    provenance_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index("ix_documents_project_type", "project_id", "document_type"),
    )


class DocumentChunkORM(Base):
    __tablename__ = "document_chunks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    document_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True
    )
    project_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)

    text: Mapped[str] = mapped_column(Text, nullable=False)
    text_length: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    page: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    section: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    chunk_type: Mapped[str] = mapped_column(String(32), nullable=False, default="paragraph")

    # pgvector embedding column — dimension set at migration time
    embedding: Mapped[Optional[list]] = mapped_column(
        Vector(1024), nullable=True,
        comment="BGE-M3 1024-dim embedding"
    )
    embedding_model: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    has_embedding: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    metadata_json: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default="now()", nullable=False
    )

    __table_args__ = (
        Index("ix_chunks_document_index", "document_id", "chunk_index"),
        # HNSW vector index created via migration (requires pgvector)
    )
