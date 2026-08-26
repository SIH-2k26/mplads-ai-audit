"""
models/graph.py
Knowledge Graph models — CONTRACT 4 (GraphQueryService → GraphResult).
"""
from __future__ import annotations
from typing import Any, Optional
from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    """A node in the Neo4j knowledge graph."""
    node_id: str
    labels: list[str]
    properties: dict[str, Any] = Field(default_factory=dict)


class GraphRelationship(BaseModel):
    """A relationship between two nodes."""
    relationship_id: Optional[str] = None
    type: str
    source_node_id: str
    target_node_id: str
    properties: dict[str, Any] = Field(default_factory=dict)


class RelatedProject(BaseModel):
    """A project related to another through the graph."""
    project_id: str
    project_name: Optional[str] = None
    relationship_type: str
    relationship_path: list[str] = Field(default_factory=list)
    shared_entities: list[str] = Field(default_factory=list)
    distance_km: Optional[float] = None
    similarity_score: Optional[float] = None


class ContractorNetworkNode(BaseModel):
    contractor_id: str
    contractor_name: Optional[str] = None
    project_count: int = 0
    total_value: Optional[float] = None
    shared_agencies: list[str] = Field(default_factory=list)
    relationship_strength: float = Field(0.0, ge=0.0, le=1.0)


class GeographicCluster(BaseModel):
    cluster_id: str
    center_lat: Optional[float] = None
    center_lon: Optional[float] = None
    radius_km: float
    project_ids: list[str] = Field(default_factory=list)
    project_count: int = 0
    shared_contractors: list[str] = Field(default_factory=list)
    shared_agencies: list[str] = Field(default_factory=list)
    cluster_value: Optional[float] = None


class GraphResult(BaseModel):
    """
    CONTRACT 4: Standard result from GraphQueryService.
    Part B agents call GraphQueryService methods that return GraphResult.
    Part B agents must NOT write Cypher directly.
    """
    query_type: str
    project_id: Optional[str] = None
    entity_id: Optional[str] = None

    # Result data
    related_projects: list[RelatedProject] = Field(default_factory=list)
    contractor_network: list[ContractorNetworkNode] = Field(default_factory=list)
    geographic_clusters: list[GeographicCluster] = Field(default_factory=list)
    nodes: list[GraphNode] = Field(default_factory=list)
    relationships: list[GraphRelationship] = Field(default_factory=list)

    # Analytics signals
    signals: dict[str, Any] = Field(
        default_factory=dict,
        description="Computed analytics signals (concentration, clustering, etc.)"
    )

    # Metadata
    result_count: int = 0
    execution_time_ms: Optional[float] = None
    metadata: dict[str, Any] = Field(default_factory=dict)

    def is_empty(self) -> bool:
        return (
            not self.related_projects
            and not self.contractor_network
            and not self.geographic_clusters
            and not self.nodes
        )
