"""
models/provenance.py
Provenance tracking — answers "where did this data come from?"
Every important result must trace back to a source.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field
from .enums import SourceType


class ProvenanceRecord(BaseModel):
    """
    Immutable provenance record for a piece of data or result.
    Every important output must carry provenance.
    """
    source_id: str = Field(..., description="ID of the originating record or file")
    source_type: SourceType
    source_name: str = Field(..., description="Human-readable source name (file name, API endpoint, etc.)")

    # Document-specific provenance
    document_id: Optional[str] = None
    page: Optional[int] = None
    section: Optional[str] = None
    row: Optional[int] = None
    column: Optional[str] = None

    # Timestamps
    source_timestamp: Optional[datetime] = Field(
        None, description="Timestamp on the original source record"
    )
    ingestion_timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When this data was ingested into the system"
    )

    # Processing metadata
    processing_version: str = Field(
        "1.0.0", description="Version of the processing pipeline that produced this result"
    )
    checksum: Optional[str] = Field(
        None, description="SHA-256 checksum of the source content"
    )

    metadata: dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(frozen=True)  # Provenance records are immutable


class DataLineage(BaseModel):
    """
    Tracks the full lineage of a derived result.
    Used when a result is produced from multiple sources.
    """
    primary_source: ProvenanceRecord
    secondary_sources: list[ProvenanceRecord] = Field(default_factory=list)
    transformation: str = Field(..., description="Description of how sources were combined/transformed")
    produced_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
