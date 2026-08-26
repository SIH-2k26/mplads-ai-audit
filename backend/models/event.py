"""
models/event.py
Event model — CONTRACT 2 (DigitalTwin → Event).
Events are the audit trail of all state changes in the system.
"""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from uuid import uuid4
from pydantic import BaseModel, Field
from .enums import EventType
from .provenance import ProvenanceRecord


class Event(BaseModel):
    """
    Immutable event representing a state change in the system.
    CONTRACT 2: DigitalTwin must produce Events for all significant changes.
    """
    event_id: str = Field(default_factory=lambda: str(uuid4()))
    event_type: EventType
    project_id: Optional[str] = Field(None, description="Associated project, if applicable")
    entity_id: Optional[str] = Field(None, description="ID of the specific changed entity")
    entity_type: Optional[str] = Field(None, description="Type of entity (Project, Payment, Document, etc.)")

    timestamp: datetime = Field(default_factory=datetime.utcnow)
    schema_version: str = "1.0"

    source: str = Field(..., description="Component that produced this event (e.g., 'ingestion_pipeline')")
    actor: Optional[str] = Field(None, description="User or system actor that triggered the change")

    # Payload — the full event data
    payload: dict[str, Any] = Field(default_factory=dict)

    # For update events — tracks what changed
    changed_fields: list[str] = Field(default_factory=list)
    previous_values: dict[str, Any] = Field(default_factory=dict)
    new_values: dict[str, Any] = Field(default_factory=dict)

    # Provenance
    provenance: Optional[ProvenanceRecord] = None

    # Correlation
    correlation_id: Optional[str] = Field(
        None, description="Links related events in a workflow"
    )

    class Config:
        frozen = True  # Events are immutable once created

    def model_dump_json_safe(self) -> dict[str, Any]:
        """Serialize to a JSON-safe dict for persistence."""
        return self.model_dump(mode="json")


class EventBatch(BaseModel):
    """A collection of events produced by a single operation."""
    batch_id: str = Field(default_factory=lambda: str(uuid4()))
    events: list[Event]
    produced_at: datetime = Field(default_factory=datetime.utcnow)
    source: str
