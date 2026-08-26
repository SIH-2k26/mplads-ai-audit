"""
app/database/neo4j_client.py
Neo4j driver wrapper — all Cypher goes through this client.
Provides parameterized queries, transactions, and health checking.
"""
from __future__ import annotations
from typing import Any, Optional
from app.config.settings import get_settings
from app.utils.logging import get_logger

try:
    from neo4j import AsyncGraphDatabase, AsyncDriver, AsyncSession
    HAS_NEO4J = True
except ImportError:
    HAS_NEO4J = False
    AsyncGraphDatabase = None
    AsyncDriver = Any
    AsyncSession = Any

logger = get_logger("neo4j_client")
_settings = get_settings()


class Neo4jClient:
    """
    Thin wrapper around the Neo4j async driver.
    All graph operations must go through this client.
    """

    def __init__(self) -> None:
        self._driver: Optional[AsyncDriver] = None

    async def connect(self) -> None:
        if not HAS_NEO4J:
            logger.warning("neo4j_driver_not_installed")
            return
        self._driver = AsyncGraphDatabase.driver(
            _settings.neo4j_uri,
            auth=(_settings.neo4j_user, _settings.neo4j_password),
        )
        await self._driver.verify_connectivity()
        logger.info("neo4j_connected", uri=_settings.neo4j_uri)

    async def close(self) -> None:
        if self._driver and HAS_NEO4J:
            await self._driver.close()
            self._driver = None

    @property
    def driver(self) -> AsyncDriver:
        if not self._driver:
            raise RuntimeError("Neo4j client not connected. Call connect() first.")
        return self._driver

    async def execute_query(
        self,
        cypher: str,
        parameters: Optional[dict[str, Any]] = None,
        database: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        if not HAS_NEO4J or not self._driver:
            logger.warning("neo4j_execute_query_skipped_driver_missing")
            return []
        db = database or _settings.neo4j_database
        async with self.driver.session(database=db) as session:
            result = await session.run(cypher, parameters or {})
            records = await result.data()
            return records

    async def execute_transaction(
        self,
        cypher: str,
        parameters: Optional[dict[str, Any]] = None,
        database: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        if not HAS_NEO4J or not self._driver:
            return []
        db = database or _settings.neo4j_database

        async def _write_tx(tx: Any) -> list[dict[str, Any]]:
            result = await tx.run(cypher, parameters or {})
            return await result.data()

        async with self.driver.session(database=db) as session:
            return await session.execute_write(_write_tx)

    async def health_check(self) -> bool:
        if not HAS_NEO4J:
            return False
        try:
            result = await self.execute_query("RETURN 1 AS ok")
            return bool(result and result[0].get("ok") == 1)
        except Exception as e:
            logger.warning("neo4j_health_check_failed", error=str(e))
            return False

    async def create_constraints_and_indexes(self) -> None:
        if not HAS_NEO4J:
            return
        statements = [
            "CREATE CONSTRAINT project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.project_id IS UNIQUE",
            "CREATE CONSTRAINT mp_id IF NOT EXISTS FOR (m:MP) REQUIRE m.mp_id IS UNIQUE",
            "CREATE CONSTRAINT contractor_id IF NOT EXISTS FOR (c:Contractor) REQUIRE c.contractor_id IS UNIQUE",
            "CREATE CONSTRAINT agency_id IF NOT EXISTS FOR (a:Agency) REQUIRE a.agency_id IS UNIQUE",
            "CREATE CONSTRAINT district_id IF NOT EXISTS FOR (d:District) REQUIRE d.district_id IS UNIQUE",
            "CREATE CONSTRAINT state_id IF NOT EXISTS FOR (s:State) REQUIRE s.state_id IS UNIQUE",
            "CREATE CONSTRAINT policy_id IF NOT EXISTS FOR (p:Policy) REQUIRE p.policy_id IS UNIQUE",
            "CREATE CONSTRAINT document_id IF NOT EXISTS FOR (d:Document) REQUIRE d.document_id IS UNIQUE",
            "CREATE INDEX project_status IF NOT EXISTS FOR (p:Project) ON (p.project_status)",
            "CREATE INDEX project_state IF NOT EXISTS FOR (p:Project) ON (p.state)",
            "CREATE INDEX project_category IF NOT EXISTS FOR (p:Project) ON (p.category)",
        ]
        for stmt in statements:
            try:
                await self.execute_transaction(stmt)
            except Exception as e:
                logger.warning("constraint_creation_error", statement=stmt[:80], error=str(e))
        logger.info("neo4j_constraints_created")


_client: Optional[Neo4jClient] = None

def get_neo4j_client() -> Neo4jClient:
    global _client
    if _client is None:
        _client = Neo4jClient()
    return _client
