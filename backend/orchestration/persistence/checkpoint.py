"""
backend/orchestration/persistence/checkpoint.py
LangGraph Checkpoint Persistence and Trace Registry for Sanchay AI.
"""
from __future__ import annotations
from typing import Any, Dict, Optional
from langgraph.checkpoint.memory import MemorySaver

# Singleton in-memory checkpointer for development, API sessions, and tests
_checkpointer_instance: Optional[MemorySaver] = None
_trace_store: Dict[str, Dict[str, Any]] = {}


def get_checkpointer() -> MemorySaver:
    """Returns the persistent LangGraph checkpointer instance."""
    global _checkpointer_instance
    if _checkpointer_instance is None:
        _checkpointer_instance = MemorySaver()
    return _checkpointer_instance


def record_trace(request_id: str, trace_data: Dict[str, Any]) -> None:
    """Stores execution trace in trace registry."""
    _trace_store[request_id] = trace_data


def get_trace(request_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves execution trace for a given request_id."""
    return _trace_store.get(request_id)
