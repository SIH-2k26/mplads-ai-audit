"""
models/digital_twin.py
The Project Digital Twin — canonical application-layer representation of a project.
CONTRACT 2: The Digital Twin generates Events for all state changes.

IMPORTANT: The Digital Twin is NOT the database. It is built from database records
and represents the complete known state of a project at a point in time.

Architecture:
    PostgreSQL → ProjectRepository → DigitalTwin
    Agents consume the DigitalTwin context, not raw SQL.
"""
from __future__ import annotations
from datetime import datetime, timezone
UTC = timezone.utc
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field
from .enums import ProjectStatus
from .project import (
    GeoLocation, Recommendation, Sanction, Budget, Expenditure,
    ProgressRecord, Milestone, Asset, ImplementingAgency, Contractor,
    DataQualityFlag, ProjectCompliance
)
from .provenance import ProvenanceRecord


class ProjectDigitalTwin(BaseModel):
    """
    The canonical application-layer representation of a MPLADS project.
    Built from multiple DB tables by the ProjectRepository.
    Part A agents consume this — they do NOT query individual tables.
    """
    # Core identity
    project_id: str = Field(..., description="System-assigned unique project identifier")
    source_project_id: Optional[str] = Field(None, description="Original ID from data source")

    project_name: str
    description: Optional[str] = None
    category: Optional[str] = Field(None, description="e.g., ROAD, WATER, EDUCATION, HEALTH")
    sub_category: Optional[str] = None

    # Political/administrative context
    mp_id: Optional[str] = None
    mp_name: Optional[str] = None
    constituency_id: Optional[str] = None
    constituency_name: Optional[str] = None

    # Location
    location: Optional[GeoLocation] = None

    # Financial lifecycle
    recommendation: Optional[Recommendation] = None
    sanction: Optional[Sanction] = None
    budget: Optional[Budget] = None
    expenditure: Optional[Expenditure] = None

    # Progress
    latest_progress: Optional[ProgressRecord] = None
    progress_history: list[ProgressRecord] = Field(default_factory=list)

    # Timeline
    start_date: Optional[datetime] = None
    expected_completion_date: Optional[datetime] = None
    actual_completion_date: Optional[datetime] = None
    approved_extensions: int = Field(0, ge=0, description="Number of approved timeline extensions")
    extension_days: int = Field(0, ge=0, description="Total approved extension days")

    # Status
    project_status: ProjectStatus = ProjectStatus.UNKNOWN
    status_as_of: Optional[datetime] = None

    # Milestones
    milestones: list[Milestone] = Field(default_factory=list)

    # Entities
    implementing_agency: Optional[ImplementingAgency] = None
    contractor: Optional[Contractor] = None
    vendors: list[dict[str, Any]] = Field(default_factory=list)

    # Assets and documentation
    assets: list[Asset] = Field(default_factory=list)
    document_ids: list[str] = Field(default_factory=list)
    document_types_present: list[str] = Field(default_factory=list)

    # Data quality
    data_quality_flags: list[DataQualityFlag] = Field(default_factory=list)
    data_completeness_score: float = Field(
        1.0, ge=0.0, le=1.0,
        description="0.0 = very incomplete, 1.0 = fully complete"
    )

    # Compliance
    compliance: Optional[ProjectCompliance] = None

    # Graph references
    graph_node_id: Optional[str] = Field(
        None, description="Neo4j internal node ID (populated after graph build)"
    )

    # Provenance
    provenance: Optional[ProvenanceRecord] = None
    last_ingested_at: Optional[datetime] = None

    # Versioning
    twin_version: int = Field(1, description="Incremented on each rebuild")
    built_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Computed helpers (populated by builder, NOT by agents)
    @property
    def is_delayed(self) -> bool:
        """True if project is past expected completion with no actual completion."""
        if self.actual_completion_date:
            return False
        if not self.expected_completion_date:
            return False
        # Use naive UTC now for comparison since expected_completion_date is stored as naive datetime
        now_naive = datetime.now(UTC).replace(tzinfo=None)
        return now_naive > self.expected_completion_date

    @property
    def is_overdue(self) -> bool:
        """Alias for is_delayed."""
        return self.is_delayed

    @property
    def delay_days(self) -> int:
        """Days past expected completion (0 if not delayed)."""
        if not self.is_delayed:
            return 0
        now_naive = datetime.now(UTC).replace(tzinfo=None)
        delta = now_naive - self.expected_completion_date
        return max(0, delta.days)

    @property
    def financial_progress(self) -> Optional[float]:
        return self.latest_progress.financial_progress if self.latest_progress else None

    @property
    def physical_progress(self) -> Optional[float]:
        return self.latest_progress.physical_progress if self.latest_progress else None

    @property
    def sanctioned_amount(self):
        return self.sanction.sanctioned_amount if self.sanction else None

    @property
    def approved_budget(self):
        return self.budget.approved_budget if self.budget else None

    @property
    def estimated_cost(self):
        return self.budget.estimated_cost if self.budget else self.sanctioned_amount

    @property
    def total_expenditure(self):
        return self.expenditure.total_expenditure if self.expenditure else None

    def has_document_type(self, doc_type: str) -> bool:
        return doc_type in self.document_types_present

    model_config = ConfigDict(arbitrary_types_allowed=True)


class DigitalTwinSummary(BaseModel):
    """Lightweight summary for list views — avoids loading full twin."""
    project_id: str
    project_name: str
    category: Optional[str] = None
    project_status: ProjectStatus
    location: Optional[GeoLocation] = None
    sanctioned_amount: Optional[Any] = None
    total_expenditure: Optional[Any] = None
    financial_progress: Optional[float] = None
    physical_progress: Optional[float] = None
    is_delayed: bool = False
    delay_days: int = 0
    data_quality_flags_count: int = 0
    built_at: datetime
