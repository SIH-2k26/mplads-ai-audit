"""
tests/integration/conftest.py
Pytest configuration and fixtures for integration tests.

Integration tests require real infrastructure (PostgreSQL, Neo4j).
They are skipped automatically when infrastructure is unavailable.

Usage:
    # Run only integration tests (requires running DB):
    pytest tests/integration/ -m integration -v

    # Skip integration tests (default for CI without DB):
    pytest tests/ -m "not integration and not neo4j" -v
"""
import asyncio
import pytest

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))


def pytest_configure(config):
    config.addinivalue_line(
        "markers", "integration: mark test as requiring real PostgreSQL (skipped if DB unavailable)"
    )
    config.addinivalue_line(
        "markers", "neo4j: mark test as requiring real Neo4j (skipped if Neo4j unavailable)"
    )
    config.addinivalue_line(
        "markers", "rag: mark test as requiring sentence-transformers + pgvector"
    )


def _check_postgres_available() -> bool:
    """Returns True if PostgreSQL is reachable within 3 seconds."""
    try:
        import asyncpg
        from app.config.settings import get_settings
        settings = get_settings()

        async def _ping():
            conn = await asyncpg.connect(
                host=settings.postgres_host,
                port=settings.postgres_port,
                database=settings.postgres_db,
                user=settings.postgres_user,
                password=settings.postgres_password,
                timeout=3.0,
            )
            await conn.execute("SELECT 1")
            await conn.close()

        asyncio.run(_ping())
        return True
    except Exception:
        return False


def _check_neo4j_available() -> bool:
    """Returns True if Neo4j is reachable within 3 seconds."""
    try:
        from neo4j import AsyncGraphDatabase
        from app.config.settings import get_settings
        settings = get_settings()

        async def _ping():
            driver = AsyncGraphDatabase.driver(
                settings.neo4j_uri,
                auth=(settings.neo4j_user, settings.neo4j_password),
                connection_timeout=3.0,
            )
            await driver.verify_connectivity()
            await driver.close()

        asyncio.run(_ping())
        return True
    except Exception:
        return False


# ── Shared Skip Markers ───────────────────────────────────────────────────────
POSTGRES_AVAILABLE = None
NEO4J_AVAILABLE = None


@pytest.fixture(scope="session")
def postgres_available():
    global POSTGRES_AVAILABLE
    if POSTGRES_AVAILABLE is None:
        POSTGRES_AVAILABLE = _check_postgres_available()
    if not POSTGRES_AVAILABLE:
        pytest.skip(
            "INFRASTRUCTURE_BLOCKED: PostgreSQL not reachable. "
            "Run: docker compose up -d postgres (then wait for healthcheck)"
        )
    return True


@pytest.fixture(scope="session")
def neo4j_available():
    global NEO4J_AVAILABLE
    if NEO4J_AVAILABLE is None:
        NEO4J_AVAILABLE = _check_neo4j_available()
    if not NEO4J_AVAILABLE:
        pytest.skip(
            "INFRASTRUCTURE_BLOCKED: Neo4j not reachable. "
            "Run: docker compose up -d neo4j (then wait for healthcheck)"
        )
    return True
