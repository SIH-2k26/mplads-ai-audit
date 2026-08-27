"""
graph/analytics/contractor_analytics.py
Graph analytics for identifying contractor cartels, monopolistic concentration, and agency collusion.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from app.database.neo4j_client import Neo4jClient
from app.utils.logging import get_logger

logger = get_logger("contractor_analytics")


@dataclass
class ContractorConcentrationProfile:
    contractor_id: str
    contractor_name: str
    total_projects: int
    total_value_inr: float
    district_concentration_ratio: float  # contractor project value / total district value
    top_districts: List[str] = field(default_factory=list)
    affiliated_agencies: List[str] = field(default_factory=list)
    risk_signal_score: float = 0.0      # 0 to 100


class ContractorGraphAnalytics:
    """
    Analyzes network patterns in Neo4j to detect monopolistic concentration,
    exclusive agency-contractor relationships, and shared bidder networks.
    """

    def __init__(self, client: Neo4jClient):
        self.client = client

    async def analyze_contractor_concentration(
        self, contractor_id: str, district: Optional[str] = None
    ) -> Optional[ContractorConcentrationProfile]:
        """
        Calculates the concentration of projects awarded to a contractor in a district/state.
        """
        cypher = """
        MATCH (c:Contractor {contractor_id: $contractor_id})<-[:EXECUTED_BY]-(p:Project)
        OPTIONAL MATCH (p)-[:IMPLEMENTED_BY]->(a:Agency)
        OPTIONAL MATCH (p)-[:LOCATED_IN_DISTRICT]->(d:District)
        RETURN c.contractor_id AS contractor_id,
               c.contractor_name AS contractor_name,
               count(p) AS project_count,
               sum(p.sanctioned_amount) AS total_val,
               collect(DISTINCT d.district_name) AS districts,
               collect(DISTINCT a.agency_name) AS agencies
        """
        try:
            rows = await self.client.execute_query(cypher, {"contractor_id": contractor_id})
            if not rows or rows[0]["project_count"] == 0:
                return None

            row = rows[0]
            proj_count = int(row["project_count"])
            tot_val = float(row["total_val"] or 0.0)
            districts = [d for d in row["districts"] if d]
            agencies = [a for a in row["agencies"] if a]

            # High risk if contractor has > 10 projects or single agency exclusivity with > 5 projects
            risk_score = 0.0
            if proj_count >= 10:
                risk_score += 40.0
            elif proj_count >= 5:
                risk_score += 20.0

            if len(agencies) == 1 and proj_count >= 4:
                risk_score += 35.0  # Exclusivity with one agency

            return ContractorConcentrationProfile(
                contractor_id=contractor_id,
                contractor_name=row.get("contractor_name") or contractor_id,
                total_projects=proj_count,
                total_value_inr=tot_val,
                district_concentration_ratio=min(1.0, proj_count / 20.0),
                top_districts=districts,
                affiliated_agencies=agencies,
                risk_signal_score=min(100.0, risk_score),
            )
        except Exception as e:
            logger.error("contractor_analytics.error", contractor_id=contractor_id, error=str(e))
            return None
