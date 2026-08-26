"""
graph/repositories.py
GraphQueryService — CONTRACT 4.
Part B agents call these methods — they never write Cypher directly.
"""
from __future__ import annotations
from typing import Any, Optional
from models.graph import (
    GraphResult, RelatedProject, ContractorNetworkNode,
    GeographicCluster, GraphNode, GraphRelationship,
)
from app.database.neo4j_client import Neo4jClient
from app.utils.logging import get_logger

logger = get_logger("graph_query_service")


class GraphQueryService:
    """
    CONTRACT 4: Exposes pre-built Cypher queries as Python methods.
    All Part B agents use this interface instead of writing raw Cypher.
    """

    def __init__(self, client: Neo4jClient):
        self._client = client

    async def find_related_projects(self, project_id: str) -> GraphResult:
        """Find all projects directly related to this project through the graph."""
        cypher = """
        MATCH (p:Project {project_id: $project_id})
        MATCH (p)-[r]-(related:Project)
        RETURN related.project_id AS project_id,
               related.project_name AS project_name,
               type(r) AS relationship_type,
               r.distance_km AS distance_km
        LIMIT 50
        """
        rows = await self._client.execute_query(cypher, {"project_id": project_id})
        related = [
            RelatedProject(
                project_id=row["project_id"],
                project_name=row.get("project_name"),
                relationship_type=row["relationship_type"],
                distance_km=row.get("distance_km"),
            )
            for row in rows
        ]
        return GraphResult(
            query_type="find_related_projects",
            project_id=project_id,
            related_projects=related,
            result_count=len(related),
        )

    async def find_projects_by_contractor(self, contractor_id: str) -> GraphResult:
        """Find all projects associated with a contractor."""
        cypher = """
        MATCH (c:Contractor {contractor_id: $contractor_id})-[:EXECUTED_BY]-(p:Project)
        RETURN p.project_id AS project_id,
               p.project_name AS project_name,
               p.project_status AS project_status,
               p.state AS state
        """
        rows = await self._client.execute_query(cypher, {"contractor_id": contractor_id})
        related = [
            RelatedProject(
                project_id=row["project_id"],
                project_name=row.get("project_name"),
                relationship_type="EXECUTED_BY",
            )
            for row in rows
        ]
        return GraphResult(
            query_type="find_projects_by_contractor",
            entity_id=contractor_id,
            related_projects=related,
            result_count=len(related),
        )

    async def find_nearby_projects(self, project_id: str, radius_km: float = 5.0) -> GraphResult:
        """Find geographically nearby projects."""
        cypher = """
        MATCH (p:Project {project_id: $project_id})-[r:NEAR]-(nearby:Project)
        WHERE r.distance_km <= $radius_km
        RETURN nearby.project_id AS project_id,
               nearby.project_name AS project_name,
               r.distance_km AS distance_km,
               nearby.contractor_name AS contractor_name,
               nearby.sanctioned_amount AS sanctioned_amount
        ORDER BY r.distance_km
        LIMIT 30
        """
        rows = await self._client.execute_query(
            cypher, {"project_id": project_id, "radius_km": radius_km}
        )
        related = [
            RelatedProject(
                project_id=row["project_id"],
                project_name=row.get("project_name"),
                relationship_type="NEAR",
                distance_km=row.get("distance_km"),
            )
            for row in rows
        ]
        return GraphResult(
            query_type="find_nearby_projects",
            project_id=project_id,
            related_projects=related,
            result_count=len(related),
        )

    async def find_contractor_network(self, contractor_id: str) -> GraphResult:
        """Find the contractor's network — agencies, projects, geographic spread."""
        cypher = """
        MATCH (c:Contractor {contractor_id: $contractor_id})-[:EXECUTED_BY]-(p:Project)
        OPTIONAL MATCH (p)-[:IMPLEMENTED_BY]-(a:Agency)
        RETURN c.contractor_id AS contractor_id,
               c.contractor_name AS contractor_name,
               count(DISTINCT p) AS project_count,
               sum(toFloat(p.sanctioned_amount)) AS total_value,
               count(DISTINCT a) AS agency_count,
               collect(DISTINCT a.agency_name)[..5] AS top_agencies
        """
        rows = await self._client.execute_query(cypher, {"contractor_id": contractor_id})
        network = [
            ContractorNetworkNode(
                contractor_id=row.get("contractor_id", contractor_id),
                contractor_name=row.get("contractor_name"),
                project_count=row.get("project_count", 0),
                total_value=row.get("total_value"),
                shared_agencies=row.get("top_agencies", []),
            )
            for row in rows
        ]
        return GraphResult(
            query_type="find_contractor_network",
            entity_id=contractor_id,
            contractor_network=network,
            result_count=len(network),
        )

    async def find_similar_project_network(self, project_id: str) -> GraphResult:
        """Find projects similar to this one (SIMILAR_TO relationships)."""
        cypher = """
        MATCH (p:Project {project_id: $project_id})-[r:SIMILAR_TO]-(sim:Project)
        RETURN sim.project_id AS project_id,
               sim.project_name AS project_name,
               r.similarity_score AS similarity_score,
               r.similarity_factors AS similarity_factors
        ORDER BY r.similarity_score DESC
        LIMIT 20
        """
        rows = await self._client.execute_query(cypher, {"project_id": project_id})
        related = [
            RelatedProject(
                project_id=row["project_id"],
                project_name=row.get("project_name"),
                relationship_type="SIMILAR_TO",
                similarity_score=row.get("similarity_score"),
            )
            for row in rows
        ]
        return GraphResult(
            query_type="find_similar_project_network",
            project_id=project_id,
            related_projects=related,
            result_count=len(related),
        )

    async def get_contractor_stats(self, contractor_id: str) -> dict[str, Any]:
        """
        Compute statistical signals for a contractor across all projects.
        Used by ContractorIntelligenceAgent.
        """
        cypher = """
        MATCH (c:Contractor {contractor_id: $contractor_id})-[:EXECUTED_BY]-(p:Project)
        WITH c, p,
             CASE WHEN p.actual_completion_date > p.expected_completion_date THEN 1 ELSE 0 END AS is_delayed,
             CASE WHEN p.total_expenditure > p.estimated_cost AND p.estimated_cost > 0
                  THEN toFloat(p.total_expenditure - p.estimated_cost) / toFloat(p.estimated_cost)
                  ELSE 0.0 END AS cost_deviation
        RETURN count(p) AS project_count,
               sum(toFloat(p.sanctioned_amount)) AS total_value,
               avg(is_delayed) AS delay_rate,
               avg(cost_deviation) AS cost_deviation_rate
        """
        rows = await self._client.execute_query(cypher, {"contractor_id": contractor_id})
        if rows:
            return dict(rows[0])
        return {}

    async def find_project_cluster(self, project_id: str) -> GraphResult:
        """Find geographic clusters this project belongs to."""
        cypher = """
        MATCH (p:Project {project_id: $project_id})-[:NEAR]-(nearby:Project)
        WITH p, collect(nearby.project_id) AS nearby_ids, count(nearby) AS nearby_count
        RETURN nearby_ids, nearby_count
        """
        rows = await self._client.execute_query(cypher, {"project_id": project_id})
        clusters = []
        if rows and rows[0].get("nearby_count", 0) >= 3:
            clusters.append(GeographicCluster(
                cluster_id=f"cluster_{project_id[:8]}",
                project_ids=rows[0].get("nearby_ids", []),
                project_count=rows[0].get("nearby_count", 0),
                radius_km=5.0,
            ))
        return GraphResult(
            query_type="find_project_cluster",
            project_id=project_id,
            geographic_clusters=clusters,
            result_count=len(clusters),
        )
