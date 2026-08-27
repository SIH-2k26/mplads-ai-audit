"""
api/v1/router.py
API v1 Main Router bundling all endpoint routers.
"""
from fastapi import APIRouter
from api.v1.endpoints import analytics, cases, auth, ingestion, risk, feedback

api_v1_router = APIRouter()

# Include endpoint sub-routers
api_v1_router.include_router(auth.router)
api_v1_router.include_router(analytics.router, tags=["Analytics & Risk Assessment"])
api_v1_router.include_router(cases.router, tags=["Investigation Cases"])
api_v1_router.include_router(ingestion.router)
api_v1_router.include_router(risk.router)
api_v1_router.include_router(feedback.router)
