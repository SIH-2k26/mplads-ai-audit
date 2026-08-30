"""
graph/builders/geographic_builder.py
Geographic Knowledge Graph builder for spatial proximity relationships.
Uses the Haversine formula to link proximate projects via [:NEAR] edges.
"""
from __future__ import annotations
import math
from typing import List, Tuple

from app.database.neo4j_client import Neo4jClient
from app.utils.logging import get_logger

logger = get_logger("geographic_graph_builder")


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two geographic points in kilometers."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 3)


class GeographicGraphBuilder:
    """
    Computes spatial adjacency and updates Neo4j [:NEAR] edges between projects.
    """

    def __init__(self, client: Neo4jClient, proximity_threshold_km: float = 2.0):
        self.client = client
        self.proximity_threshold_km = proximity_threshold_km

    async def link_nearby_projects(self) -> int:
        """
        Fetches all projects with geographic coordinates, calculates pairwise distances,
        and creates [:NEAR {distance_km: d}] edges for pairs within threshold.
        """
        cypher_get = """
        MATCH (p:Project)
        WHERE p.latitude IS NOT NULL AND p.longitude IS NOT NULL
        RETURN p.project_id AS id, p.latitude AS lat, p.longitude AS lon
        """
        try:
            rows = await self.client.execute_query(cypher_get)
        except Exception as e:
            logger.error("geographic_graph_builder.fetch_error", error=str(e))
            return 0

        projects = [(r["id"], float(r["lat"]), float(r["lon"])) for r in rows if r["lat"] and r["lon"]]
        links_created = 0

        for i in range(len(projects)):
            id1, lat1, lon1 = projects[i]
            for j in range(i + 1, len(projects)):
                id2, lat2, lon2 = projects[j]
                dist = haversine_distance_km(lat1, lon1, lat2, lon2)
                if dist <= self.proximity_threshold_km:
                    cypher_link = """
                    MATCH (p1:Project {project_id: $id1})
                    MATCH (p2:Project {project_id: $id2})
                    MERGE (p1)-[r:NEAR {distance_km: $dist}]-(p2)
                    """
                    await self.client.execute_write(cypher_link, {"id1": id1, "id2": id2, "dist": dist})
                    links_created += 1

        logger.info("geographic_graph_builder.completed", links_created=links_created)
        return links_created
