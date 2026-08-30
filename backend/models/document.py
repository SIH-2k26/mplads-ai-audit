"""
models/document.py
Document and chunk models for the Document AI pipeline.
"""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from uuid import uuid4
from pydantic import BaseModel, Field
from .enums import DocumentType, DocumentStatus, OCREngine
from .provenance import ProvenanceRecord


class DocumentMetadata(BaseModel):
    """Metadata extracted from a document."""
    title: Optional[str] = None
    author: Optional[str] = None
    created_date: Optional[datetime] = None
    modified_date: Optional[datetime] = None
    page_count: Optional[int] = None
    file_size_bytes: Optional[int] = None
    language: Optional[str] = None
    encoding: Optional[str] = None
    custom: dict[str, Any] = Field(default_factory=dict)


class DocumentChunk(BaseModel):
    """
    A chunk of text extracted from a document.
    Every chunk carries its source location for provenance.
    """
    chunk_id: str = Field(default_factory=lambda: str(uuid4()))
    document_id: str

    text: str
    text_length: int = 0

    # Location within document
    page: Optional[int] = None
    section: Optional[str] = None
    chunk_index: int = 0
    chunk_type: str = Field("paragraph", description="e.g., 'title', 'paragraph', 'table', 'list'")

    # Vector embedding (stored separately in pgvector)
    embedding_model: Optional[str] = None
    has_embedding: bool = False

    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Document(BaseModel):
    """Full document record."""
    document_id: str = Field(default_factory=lambda: str(uuid4()))

    # Source file
    file_name: str
    file_path: Optional[str] = None
    file_type: str = Field(..., description="pdf, xlsx, csv, etc.")
    file_size_bytes: Optional[int] = None
    checksum: Optional[str] = None

    # Classification
    document_type: DocumentType = DocumentType.OTHER
    project_id: Optional[str] = None

    # Processing state
    status: DocumentStatus = DocumentStatus.PENDING
    ocr_used: bool = False
    ocr_engine: Optional[OCREngine] = None
    ocr_confidence: Optional[float] = None
    extraction_quality: Optional[float] = Field(
        None, ge=0.0, le=1.0,
        description="Quality score for text extraction (0=poor, 1=excellent)"
    )

    # Extraction results
    raw_text: Optional[str] = None
    page_count: Optional[int] = None
    metadata: Optional[DocumentMetadata] = None

    # Chunks
    chunk_ids: list[str] = Field(default_factory=list)
    chunk_count: int = 0

    # Provenance
    provenance: Optional[ProvenanceRecord] = None

    # Timestamps
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    error_message: Optional[str] = None


class ExtractionResult(BaseModel):
    """Result from the document parsing/OCR pipeline."""
    document_id: str
    success: bool
    text: Optional[str] = None
    page_count: Optional[int] = None
    used_ocr: bool = False
    ocr_engine: Optional[OCREngine] = None
    ocr_confidence: Optional[float] = None
    extraction_quality: float = 0.0
    elements: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Structured elements from Unstructured (titles, tables, etc.)"
    )
    error: Optional[str] = None
    processing_time_ms: Optional[float] = None
