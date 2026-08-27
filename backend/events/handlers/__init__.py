"""
events/handlers/__init__.py
"""
from events.handlers.project_handler import handle_project_event
from events.handlers.risk_handler import handle_risk_event

__all__ = ["handle_project_event", "handle_risk_event"]
