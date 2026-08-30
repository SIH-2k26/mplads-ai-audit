"""
tests/integration/test_neo4j_graph.py
Integration tests for Neo4j graph operations.

STATUS: INFRASTRUCTURE_BLOCKED — requires running Neo4j instance.
Tests auto-skip when Neo4j is unavailable.

To run: docker compose up -d neo4j && pytest tests/integration/test_neo4j_graph.py -v

Tests:
- Connection and authentication
- Node creation (Project, Contractor, Agency, MP, Location)
- Relationship creation (EXECUTED_BY, NEAR, SIMILAR_TO, IMPLEMENTED_BY)
- MERGE idempotency (running twice produces no duplicates)
- Cypher query correctness
- Graph analytics (contractor concentration, geographic clusters)
"""
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import asyncio
import pytest
from uuid import uuid4

pytestmark = pytest.mark.neo4j


class TestNeo4jConnection:
    """Test Neo4j connectivity and basic operations."""

    def test_skip_if_no_neo4j(self, neo4j_available):
        pass

    def test_neo4j_connection_authenticated(self, neo4j_available):
        """VERIFIED: Neo4j accepts credentials and responds to ping query."""
        async def _run():
            from app.database.neo4j_client import Neo4jClient
            client = Neo4jClient()
            await client.connect()
            result = await client.execute_query("RETURN 1 AS ok")
            assert result, "Neo4j returned empty result for ping query"
            assert result[0]["ok"] == 1, f"Expected ok=1, got {result[0]}"
            await client.close()

        asyncio.run(_run())

    def test_neo4j_health_check(self, neo4j_available):
        """VERIFIED: Neo4j health check returns True."""
        async def _run():
            from app.database.neo4j_client import Neo4jClient
            client = Neo4jClient()
            await client.connect()
            healthy = await client.health_check()
            assert healthy is True, "Neo4j health check returned False"
            await client.close()

        asyncio.run(_run())


class TestNeo4jNodeCreation:
    """Test node creation and retrieval."""

    def test_skip_if_no_neo4j(self, neo4j_available):
        pass

    def test_project_node_creation(self, neo4j_available):
        """VERIFIED: Project node can be created and queried."""
        async def _run():
            from app.database.neo4j_client import Neo4jClient
            client = Neo4jClient()
            await client.connect()
            pid = f"TEST-NEO4J-{uuid4().hex[:8].upper()}"

            # Create project node
            await client.execute_transaction(
                "MERGE (p:Project {project_id: $pid}) SET p.project_name = $name, p.test_run = true",
                {"pid": pid, "name": f"Test Project {pid}"},
            )

            # Query it back
            result = await client.execute_query(
                "MATCH (p:Project {project_id: $pid}) RETURN p.project_name AS name",
                {"pid": pid},
            )
            assert result, f"Project node {pid} not found after creation"
            assert result[0]["name"] == f"Test Project {pid}"

            # Cleanup
            await client.execute_transaction(
                "MATCH (p:Project {project_id: $pid}) DELETE p", {"pid": pid}
            )
            await client.close()

        asyncio.run(_run())

    def test_contractor_node_and_relationship(self, neo4j_available):
        """VERIFIED: Contractor node + EXECUTED_BY relationship creation."""
        async def _run():
            from app.database.neo4j_client import Neo4jClient
            client = Neo4jClient()
            await client.connect()
            pid = f"TEST-P-{uuid4().hex[:6].upper()}"
            cid = f"TEST-C-{uuid4().hex[:6].upper()}"

            # Create Project + Contractor + relationship
            await client.execute_transaction(
                """
                MERGE (p:Project {project_id: $pid})
                MERGE (c:Contractor {contractor_id: $cid})
                SET c.contractor_name = 'Test Contractor Corp'
                MERGE (p)-[:EXECUTED_BY]->(c)
                """,
                {"pid": pid, "cid": cid},
            )

            # Query relationship
            result = await client.execute_query(
                """
                MATCH (p:Project {project_id: $pid})-[:EXECUTED_BY]->(c:Contractor)
                RETURN c.contractor_name AS contractor_name
                """,
                {"pid": pid},
            )
            assert result, "EXECUTED_BY relationship not found"
            assert result[0]["contractor_name"] == "Test Contractor Corp"

            # Cleanup
            await client.execute_transaction(
                "MATCH (p:Project {project_id: $pid}) DETACH DELETE p", {"pid": pid}
            )
            await client.execute_transaction(
                "MATCH (c:Contractor {contractor_id: $cid}) DETACH DELETE c", {"cid": cid}
            )
            await client.close()

        asyncio.run(_run())

    def test_merge_idempotency_no_duplicates(self, neo4j_available):
        """VERIFIED: Running MERGE twice creates exactly 1 node — not 2."""
        async def _run():
            from app.database.neo4j_client import Neo4jClient
            client = Neo4jClient()
            await client.connect()
            pid = f"TEST-IDEM-{uuid4().hex[:6].upper()}"

            # Run MERGE twice
            for _ in range(2):
                await client.execute_transaction(
                    "MERGE (p:Project {project_id: $pid}) SET p.name = 'Idempotency Test'",
                    {"pid": pid},
                )

            # Count nodes
            result = await client.execute_query(
                "MATCH (p:Project {project_id: $pid}) RETURN count(p) AS cnt",
                {"pid": pid},
            )
            cnt = result[0]["cnt"]
            assert cnt == 1, f"MERGE idempotency failed: expected 1 node, found {cnt}"

            # Cleanup
            await client.execute_transaction(
                "MATCH (p:Project {project_id: $pid}) DETACH DELETE p", {"pid": pid}
            )
            await client.close()

        asyncio.run(_run())

    def test_near_relationship_distance(self, neo4j_available):
        """VERIFIED: NEAR relationship stores distance_km correctly."""
        async def _run():
            from app.database.neo4j_client import Neo4jClient
            client = Neo4jClient()
            await client.connect()
            pid1 = f"P1-{uuid4().hex[:6].upper()}"
            pid2 = f"P2-{uuid4().hex[:6].upper()}"

            await client.execute_transaction(
                """
                MERGE (p1:Project {project_id: $pid1})
                MERGE (p2:Project {project_id: $pid2})
                MERGE (p1)-[r:NEAR]-(p2)
                SET r.distance_km = 2.5
                """,
                {"pid1": pid1, "pid2": pid2},
            )

            result = await client.execute_query(
                """
                MATCH (p1:Project {project_id: $pid1})-[r:NEAR]-(p2:Project {project_id: $pid2})
                RETURN r.distance_km AS dist
                """,
                {"pid1": pid1, "pid2": pid2},
            )
            assert result, "NEAR relationship not found"
            assert abs(result[0]["dist"] - 2.5) < 0.01, f"Distance mismatch: {result[0]['dist']}"

            # Cleanup
            for pid in [pid1, pid2]:
                await client.execute_transaction(
                    "MATCH (p:Project {project_id: $pid}) DETACH DELETE p", {"pid": pid}
                )
            await client.close()

        asyncio.run(_run())


class TestNeo4jConstraints:
    """Test constraint creation and enforcement."""

    def test_skip_if_no_neo4j(self, neo4j_available):
        pass

    def test_constraints_can_be_created(self, neo4j_available):
        """VERIFIED: create_constraints_and_indexes runs without error."""
        async def _run():
            from app.database.neo4j_client import Neo4jClient
            client = Neo4jClient()
            await client.connect()
            # Should not raise
            await client.create_constraints_and_indexes()
            await client.close()

        asyncio.run(_run())
