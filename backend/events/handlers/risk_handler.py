"""
events/handlers/risk_handler.py
Event handler for Risk and Investigation lifecycle events (RiskUpdated, InvestigationCreated).
"""
from __future__ import annotations
from app.utils.logging import get_logger
from models.event import Event

logger = get_logger("risk_event_handler")


async def handle_risk_event(event: Event) -> None:
    """
    Processes RiskUpdated and InvestigationCreated events.
    Can trigger notifications, webhooks, or alert indexing.
    """
    logger.info(
        "risk_event_handler.processed",
        event_id=event.event_id,
        event_type=event.event_type.value,
        project_id=event.project_id,
        payload_keys=list(event.payload.keys()) if event.payload else [],
    )
