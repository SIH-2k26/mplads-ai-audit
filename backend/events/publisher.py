"""
events/publisher.py
EventPublisher abstraction — Kafka-ready interface backed by PostgreSQL.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Callable, Awaitable
from models.event import Event


class EventPublisher(ABC):
    """Abstract event publisher. Replace backend (DB→Kafka) without changing callers."""

    @abstractmethod
    async def publish(self, event: Event) -> None:
        """Publish a single event."""
        ...

    @abstractmethod
    async def publish_batch(self, events: list[Event]) -> None:
        """Publish multiple events atomically where possible."""
        ...


class EventSubscriber(ABC):
    """Abstract event subscriber."""

    @abstractmethod
    async def subscribe(
        self,
        event_type: str,
        handler: Callable[[Event], Awaitable[None]],
    ) -> None:
        """Register a handler for an event type."""
        ...


class DatabaseEventPublisher(EventPublisher):
    """
    PostgreSQL-backed event publisher.
    Events are stored in the events table and can be consumed by subscribers.
    Kafka-replaceable — implement KafkaEventPublisher with the same interface when needed.
    """

    def __init__(self, session_factory=None):
        self._session_factory = session_factory
        self._subscribers: dict[str, list[Callable]] = {}

    async def publish(self, event: Event) -> None:
        """Persist event to DB and notify in-process subscribers."""
        # Persist to database
        if self._session_factory:
            await self._persist(event)

        # Notify in-process subscribers
        handlers = self._subscribers.get(event.event_type.value, [])
        for handler in handlers:
            try:
                await handler(event)
            except Exception as e:
                import structlog
                structlog.get_logger("event_publisher").warning(
                    "event_handler_error",
                    event_type=event.event_type.value,
                    error=str(e),
                )

    async def publish_batch(self, events: list[Event]) -> None:
        for event in events:
            await self.publish(event)

    async def _persist(self, event: Event) -> None:
        from db.models.event import EventORM
        async with self._session_factory() as session:
            orm = EventORM(
                id=event.event_id,
                event_type=event.event_type.value,
                project_id=event.project_id,
                entity_id=event.entity_id,
                entity_type=event.entity_type,
                timestamp=event.timestamp,
                schema_version=event.schema_version,
                source=event.source,
                actor=event.actor,
                payload=event.payload,
                changed_fields=event.changed_fields or None,
                previous_values=event.previous_values or None,
                new_values=event.new_values or None,
                provenance_json=event.provenance.model_dump() if event.provenance else None,
                correlation_id=event.correlation_id,
            )
            session.add(orm)

    def register_handler(
        self,
        event_type: str,
        handler: Callable[[Event], Awaitable[None]],
    ) -> None:
        """Register an in-process event handler (for internal use)."""
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(handler)
