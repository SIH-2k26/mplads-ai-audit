"""
tests/contracts/test_graph_contract.py
CONTRACT 4: GraphQueryService -> GraphResult

Tests that:
1. GraphQueryService methods return GraphResult objects.
2. Result contains expected fields (related_projects, contractor_network, etc.).
"""
import asyncio
import pytest
from unittest.mock import AsyncMock, MagicMock
from graph.repositories import GraphQueryService
from models.graph import GraphResult, RelatedProject

class TestGraphContract:
    def test_find_related_projects_contract(self):
        async def _run():
            mock_client = MagicMock()
            mock_client.execute_query = AsyncMock(return_value=[
                {
                    "project_id": "P200",
                    "project_name": "Nearby Solar Lighting",
                    "relationship_type": "NEAR",
                    "distance_km": 1.2
                }
            ])
            
            service = GraphQueryService(mock_client)
            res = await service.find_related_projects("P100")
            
            assert isinstance(res, GraphResult)
            assert res.query_type == "find_related_projects"
            assert res.project_id == "P100"
            assert len(res.related_projects) == 1
            assert isinstance(res.related_projects[0], RelatedProject)
            assert res.related_projects[0].project_id == "P200"

        asyncio.run(_run())
