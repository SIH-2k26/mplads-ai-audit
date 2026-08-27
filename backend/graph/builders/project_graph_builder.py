"""
graph/builders/project_graph_builder.py
Neo4j Graph Builder for constructing and updating the MPLADS Knowledge Graph from ProjectDigitalTwin.
Uses parameterized Cypher with idempotent MERGE statements.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional

from app.database.neo4j_client import Neo4jClient
from app.utils.logging import get_logger
from models.digital_twin import ProjectDigitalTwin

logger = get_logger("project_graph_builder")


class ProjectGraphBuilder:
    """
    Constructs and synchronizes Knowledge Graph entities and edges in Neo4j from digital twins.
    Guarantees idempotency via Cypher MERGE operations.
    """

    def __init__(self, client: Neo4jClient):
        self.client = client

    async def build_project_subgraph(self, twin: ProjectDigitalTwin) -> None:
        """
        Builds the entire node and relationship graph for a single digital twin.
        """
        try:
            # 1. Merge Project Node
            await self._merge_project_node(twin)

            # 2. Merge State & District & Location
            if twin.location:
                await self._merge_location_hierarchy(twin)

            # 3. Merge Contractor
            if twin.contractor and twin.contractor.contractor_name:
                await self._merge_contractor(twin)

            # 4. Merge Implementing Agency
            if twin.implementing_agency and twin.implementing_agency.agency_name:
                await self._merge_agency(twin)

            # 5. Merge MP and Constituency
            if twin.mp_id or twin.mp_name or twin.constituency_id or twin.constituency_name:
                await self._merge_political_entities(twin)

            # 6. Merge Documents
            if twin.documents:
                await self._merge_documents(twin)

            logger.info("project_graph_builder.synced", project_id=twin.project_id)
        except Exception as e:
            logger.error("project_graph_builder.error", project_id=twin.project_id, error=str(e))

    async def _merge_project_node(self, twin: ProjectDigitalTwin) -> None:
        cypher = """
        MERGE (p:Project {project_id: $project_id})
        SET p.project_name = $project_name,
            p.category = $category,
            p.status = $status,
            p.sanctioned_amount = $sanctioned_amount,
            p.total_expenditure = $total_expenditure,
            p.financial_progress = $financial_progress,
            p.physical_progress = $physical_progress,
            p.is_overdue = $is_overdue,
            p.updated_at = datetime()
        """
        params = {
            "project_id": twin.project_id,
            "project_name": twin.project_name or "",
            "category": twin.category.value if hasattr(twin.category, "value") else str(twin.category or ""),
            "status": twin.project_status.value if hasattr(twin.project_status, "value") else str(twin.project_status or ""),
            "sanctioned_amount": float(twin.sanctioned_amount or 0.0),
            "total_expenditure": float(twin.total_expenditure or 0.0),
            "financial_progress": float(twin.financial_progress or 0.0),
            "physical_progress": float(twin.physical_progress or 0.0),
            "is_overdue": bool(twin.is_overdue),
        }
        await self.client.execute_write(cypher, params)

    async def _merge_location_hierarchy(self, twin: ProjectDigitalTwin) -> None:
        loc = twin.location
        cypher = """
        MATCH (p:Project {project_id: $project_id})
        
        FOREACH (_ IN CASE WHEN $state <> '' THEN [1] ELSE [] END |
            MERGE (s:State {state_name: $state})
            MERGE (p)-[:LOCATED_IN_STATE]->(s)
        )
        
        FOREACH (_ IN CASE WHEN $district <> '' THEN [1] ELSE [] END |
            MERGE (d:District {district_name: $district, state_name: $state})
            MERGE (p)-[:LOCATED_IN_DISTRICT]->(d)
        )
        """
        params = {
            "project_id": twin.project_id,
            "state": loc.state or "",
            "district": loc.district or "",
        }
        await self.client.execute_write(cypher, params)

    async def _merge_contractor(self, twin: ProjectDigitalTwin) -> None:
        cont = twin.contractor
        cid = cont.contractor_id or f"CONT-{cont.contractor_name.upper().replace(' ', '_')}"
        cypher = """
        MATCH (p:Project {project_id: $project_id})
        MERGE (c:Contractor {contractor_id: $contractor_id})
        SET c.contractor_name = $contractor_name
        MERGE (p)-[:EXECUTED_BY]->(c)
        """
        params = {
            "project_id": twin.project_id,
            "contractor_id": cid,
            "contractor_name": cont.contractor_name,
        }
        await self.client.execute_write(cypher, params)

    async def _merge_agency(self, twin: ProjectDigitalTwin) -> None:
        agy = twin.implementing_agency
        aid = agy.agency_id or f"AGY-{agy.agency_name.upper().replace(' ', '_')}"
        cypher = """
        MATCH (p:Project {project_id: $project_id})
        MERGE (a:Agency {agency_id: $agency_id})
        SET a.agency_name = $agency_name
        MERGE (p)-[:IMPLEMENTED_BY]->(a)
        """
        params = {
            "project_id": twin.project_id,
            "agency_id": aid,
            "agency_name": agy.agency_name,
        }
        await self.client.execute_write(cypher, params)

    async def _merge_political_entities(self, twin: ProjectDigitalTwin) -> None:
        cypher = """
        MATCH (p:Project {project_id: $project_id})
        
        FOREACH (_ IN CASE WHEN $constituency_name <> '' THEN [1] ELSE [] END |
            MERGE (c:Constituency {constituency_name: $constituency_name})
            MERGE (p)-[:IN_CONSTITUENCY]->(c)
        )
        
        FOREACH (_ IN CASE WHEN $mp_name <> '' THEN [1] ELSE [] END |
            MERGE (m:MP {mp_name: $mp_name})
            MERGE (p)-[:RECOMMENDED_BY]->(m)
        )
        """
        params = {
            "project_id": twin.project_id,
            "constituency_name": twin.constituency_name or (twin.location.constituency if twin.location else "") or "",
            "mp_name": twin.mp_name or "",
        }
        await self.client.execute_write(cypher, params)

    async def _merge_documents(self, twin: ProjectDigitalTwin) -> None:
        for doc in twin.documents:
            doc_id = getattr(doc, "document_id", None) or getattr(doc, "id", None) or f"{twin.project_id}-doc"
            doc_type = getattr(doc, "document_type", "OTHER")
            cypher = """
            MATCH (p:Project {project_id: $project_id})
            MERGE (d:Document {document_id: $document_id})
            SET d.document_type = $document_type
            MERGE (p)-[:HAS_DOCUMENT]->(d)
            """
            params = {
                "project_id": twin.project_id,
                "document_id": str(doc_id),
                "document_type": str(doc_type),
            }
            await self.client.execute_write(cypher, params)
