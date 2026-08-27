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
import pytest_asyncio

# ── Custom Marks ─────────────────────────────────────────────────────────────
# These marks gate tests behind actual infrastructure availability.
# Tests decorated with @pytest.mark.integration require real PostgreSQL.
# Tests decorated with @pytest.mark.neo4j require real Neo4j.
# Tests decorated with @pytest.mark.rag require sentence-transformers + pgvector.


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


# ── PostgreSQL Availability Check ────────────────────────────────────────────
def _check_postgres_available() -> bool:
    """Returns True if PostgreSQL is reachable."""
    try:
        import asyncio
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

        asyncio.get_event_loop().run_until_complete(_ping())
        return True
    except Exception:
        return False


# ── Neo4j Availability Check ─────────────────────────────────────────────────
def _check_neo4j_available() -> bool:
    """Returns True if Neo4j is reachable."""
    try:
        import asyncio
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

        asyncio.get_event_loop().run_until_complete(_ping())
        return True
    except Exception:
        return False


# ── Skip Fixtures ─────────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def postgres_available():
    available = _check_postgres_available()
    if not available:
        pytest.skip(
            "INFRASTRUCTURE_BLOCKED: PostgreSQL is not available. "
            "Start Docker: docker compose up -d postgres"
        )
    return True


@pytest.fixture(scope="session")
def neo4j_available():
    available = _check_neo4j_available()
    if not available:
        pytest.skip(
            "INFRASTRUCTURE_BLOCKED: Neo4j is not available. "
            "Start Docker: docker compose up -d neo4j"
        )
    return True


# ── Async Event Loop ─────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def event_loop():
    """Session-scoped event loop for async integration tests."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
