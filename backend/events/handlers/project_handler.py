"""
events/handlers/project_handler.py
Event handler for Project lifecycle events (ProjectCreated, ProjectUpdated, SanctionUpdated).
"""
from __future__ import annotations
from app.utils.logging import get_logger
from models.event import Event

logger = get_logger("project_event_handler")


async def handle_project_event(event: Event) -> None:
    """
    Processes project lifecycle events.
    Logs provenance and triggers downstream state updates or audit records.
    """
    logger.info(
        "project_event_handler.processed",
        event_id=event.event_id,
        event_type=event.event_type.value,
        project_id=event.project_id,
        actor=event.actor,
    )
