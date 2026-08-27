"""
tests/contracts/test_digital_twin_contract.py
CONTRACT 2: DigitalTwin -> Event

Tests that:
1. DigitalTwin model correctly represents canonical project state.
2. State changes generate valid serializable Event objects.
3. Event schema and attributes match expected specification.
"""
import pytest
from datetime import datetime, date
from decimal import Decimal
from models.digital_twin import ProjectDigitalTwin
from models.event import Event
from models.enums import EventType, ProjectStatus
from models.project import (
    GeoLocation, Sanction, Budget, Expenditure, ProgressRecord,
)

class TestDigitalTwinContract:
    def test_digital_twin_creation(self):
        twin = ProjectDigitalTwin(
            project_id="MPLADS/UP/2022/1042",
            project_name="Construction of Solar Street Lights",
            category="ROAD",
            project_status=ProjectStatus.IN_PROGRESS,
            sanction=Sanction(
                sanction_number="SANC-1042",
                sanctioned_amount=Decimal("2000000"),
            ),
            budget=Budget(approved_budget=Decimal("2000000")),
            expenditure=Expenditure(total_expenditure=Decimal("1500000")),
            latest_progress=ProgressRecord(
                as_of_date=date.today(),
                financial_progress=75.0,
                physical_progress=40.0,
            )
        )
        assert twin.project_id == "MPLADS/UP/2022/1042"
        assert twin.sanctioned_amount == Decimal("2000000")
        assert twin.financial_progress == 75.0

    def test_event_generation_contract(self):
        event = Event(
            event_type=EventType.PROJECT_CREATED,
            project_id="MPLADS/UP/2022/1042",
            entity_id="MPLADS/UP/2022/1042",
            entity_type="Project",
            source="digital_twin_builder",
            payload={"status": "IN_PROGRESS", "sanctioned_amount": 2000000}
        )
        
        assert event.event_id is not None
        assert event.event_type == EventType.PROJECT_CREATED
        assert event.project_id == "MPLADS/UP/2022/1042"
        
        # Test JSON serialization safe
        data = event.model_dump_json_safe()
        assert isinstance(data, dict)
        assert data["event_type"] == "PROJECT_CREATED"
