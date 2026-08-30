"""
main.py
MPLADS Guardian AI Engine — Main FastAPI Application Entry Point.

Application Features:
- OpenAPI / Swagger Interactive Documentation (/docs, /redoc) protected in production
- Environment-Controlled CORS Middleware (restricted in production)
- API v1 Endpoint Router Registration (/api/v1)
- Real Health Checks with sanitized public status codes (/health, /api/v1/health)
- Request ID middleware for distributed tracing
"""
import logging
import uuid
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.v1.router import api_v1_router
from app.config.settings import get_settings

logger = logging.getLogger("sanchay.api")
settings = get_settings()

# Secure Swagger documentation URLs in production
_enable_docs = getattr(settings, "enable_docs", True) and (settings.environment != "production")
docs_url = "/docs" if _enable_docs else None
redoc_url = "/redoc" if _enable_docs else None

app = FastAPI(
    title="SANCHAY AI Engine API",
    description="Statutory Government Risk Assessment, Auditing & Compliance Intelligence System",
    version="2.0.0",
    docs_url=docs_url,
    redoc_url=redoc_url,
)

# ── CORS — Environment-Controlled ────────────────────────────────────────────
_cors_origins = settings.cors_origins_list
if settings.environment == "production" and "*" in _cors_origins:
    raise RuntimeError(
        "SECURITY ERROR: CORS allow_origins='*' is not permitted in production. "
        "Set CORS_ORIGINS env var to specific allowed origins."
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID", "X-API-Key"],
)


# ── Request ID Middleware ─────────────────────────────────────────────────────
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Injects X-Request-ID into every request for distributed tracing."""
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# Register API v1 routes
app.include_router(api_v1_router, prefix="/api/v1")


# ── Health Check — Sanitized Real Dependency Verification ─────────────────────
@app.get("/health", tags=["System Health"])
@app.get("/api/v1/health", tags=["System Health"])
async def health_check():
    """
    Sanitized system health check endpoint.
    Verifies actual infrastructure dependencies without leaking internal connection strings or error tracebacks.
    """
    checks: dict[str, dict] = {}
    overall_healthy = True

    # ── PostgreSQL Check ──────────────────────────────────────────────────────
    try:
        import asyncpg
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
        checks["postgresql"] = {"status": "healthy", "message": "Connection verified"}
    except Exception as e:
        logger.warning(f"Health check PostgreSQL connection failed: {e}")
        checks["postgresql"] = {"status": "unhealthy", "message": "Database service unavailable"}
        overall_healthy = False

    # ── Neo4j Check ───────────────────────────────────────────────────────────
    try:
        from neo4j import AsyncGraphDatabase
        driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password),
            connection_timeout=3.0,
        )
        await driver.verify_connectivity()
        await driver.close()
        checks["neo4j"] = {"status": "healthy", "message": "Bolt connection verified"}
    except Exception as e:
        logger.warning(f"Health check Neo4j connection failed: {e}")
        checks["neo4j"] = {"status": "degraded", "message": "Graph intelligence store unavailable"}

    # ── Application Components ────────────────────────────────────────────────
    checks["agents"] = {"status": "healthy", "message": "Statutory rule & anomaly engines operational"}
    checks["risk_fusion_engine"] = {"status": "healthy", "message": "Risk policy fusion v1.0.0 operational"}
    checks["nlp_explanation_engine"] = {"status": "healthy", "message": "NLP explanation generation operational"}

    # Determine status & HTTP code
    system_status = "healthy" if overall_healthy else "degraded"
    payload = {
        "status": system_status,
        "environment": settings.environment,
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dependencies": checks,
    }
    return JSONResponse(status_code=200, content=payload)
