"""
api/v1/endpoints/cases.py
Investigation Case Management & Human Verdict Endpoints.
Persists cases & verdicts to DB (primary) with resilient JSON file storage (data/cases_store.json fallback).
"""
from __future__ import annotations
import json
import os
from pathlib import Path
from typing import Any, List, Optional
from datetime import datetime, timezone
UTC = timezone.utc
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status

from models.enums import Verdict, InvestigationStatus, RiskLevel
from models.investigation import InvestigationCase, InvestigatorVerdict
from investigation.service import InvestigationService
from app.utils.logging import get_logger

logger = get_logger("cases_endpoint")
router = APIRouter()
investigation_service = InvestigationService()

# Persistent file storage path for cases & verdicts fallback
DATA_DIR = Path(__file__).resolve().parents[3] / "data"
CASES_FILE_PATH = DATA_DIR / "cases_store.json"


def _load_file_store() -> dict[str, dict]:
    """Helper to load cases from persistent file storage data/cases_store.json."""
    if not CASES_FILE_PATH.exists():
        return {}
    try:
        with open(CASES_FILE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.warning("cases_store.load_failed", error=str(e))
        return {}


def _save_file_store(store: dict[str, dict]):
    """Helper to save cases to persistent file storage data/cases_store.json."""
    try:
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(CASES_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(store, f, indent=2, default=str)
    except Exception as e:
        logger.error("cases_store.save_failed", error=str(e))


def _get_default_seed_cases() -> dict[str, dict]:
    """Generates initial default seed cases derived from high-risk projects if store is empty."""
    default_cases = {
        "CASE-2025-UP-001": {
            "case_id": "CASE-2025-UP-001",
            "project_id": "MPLADS-UP-24-8841",
            "priority": "CRITICAL",
            "status": "UNDER_REVIEW",
            "risk_score_at_creation": 96.1,
            "risk_level_at_creation": "CRITICAL",
            "trigger_signals": [
                "Synthetic Aperture Radar verified 0% physical progress vs 87.5% financial claim",
                "Single bidder tender award without competitive re-tender"
            ],
            "created_at": datetime.now(UTC).isoformat(),
            "updated_at": datetime.now(UTC).isoformat(),
            "verdicts": []
        },
        "CASE-2025-MH-002": {
            "case_id": "CASE-2025-MH-002",
            "project_id": "MPLADS-MH-24-3192",
            "priority": "CRITICAL",
            "status": "OPEN",
            "risk_score_at_creation": 89.2,
            "risk_level_at_creation": "CRITICAL",
            "trigger_signals": [
                "Common director PAN across L1 and L2 tenderers",
                "14 out of 42 RO units missing from GPS coordinates"
            ],
            "created_at": datetime.now(UTC).isoformat(),
            "updated_at": datetime.now(UTC).isoformat(),
            "verdicts": []
        },
        "CASE-2025-KA-003": {
            "case_id": "CASE-2025-KA-003",
            "project_id": "MPLADS-KA-24-1049",
            "priority": "HIGH",
            "status": "VERDICT_RECORDED",
            "risk_score_at_creation": 78.4,
            "risk_level_at_creation": "HIGH",
            "trigger_signals": [
                "240% cost inflation over GeM benchmark rates"
            ],
            "created_at": datetime.now(UTC).isoformat(),
            "updated_at": datetime.now(UTC).isoformat(),
            "verdicts": [
                {
                    "verdict": "CONFIRMED_ISSUE",
                    "reason": "Overpricing confirmed by state rate audit squad.",
                    "investigator_id": "INV_004",
                    "investigator_name": "Audit Officer Sharma",
                    "submitted_at": datetime.now(UTC).isoformat()
                }
            ]
        }
    }
    return default_cases


class RecordVerdictRequest(BaseModel):
    """Request schema for submitting human investigator verdict on an investigation case."""
    verdict: Verdict = Field(..., description="Verdict status: CONFIRMED_ISSUE, FALSE_POSITIVE, INSUFFICIENT_EVIDENCE, ESCALATE, NO_ACTION_REQUIRED")
    reason: str = Field(..., description="Detailed justification for human investigator verdict")
    investigator_id: Optional[str] = Field("INV_001", description="ID of human investigator")
    investigator_name: Optional[str] = Field("Officer Inspector", description="Name of investigator")
    is_feedback_consented: bool = Field(False, description="Consent for model training feedback loop")


@router.get("/cases", status_code=status.HTTP_200_OK)
@router.get("/api/v1/cases", status_code=status.HTTP_200_OK)
async def list_cases(priority: Optional[str] = None, status_filter: Optional[str] = None) -> List[dict[str, Any]]:
    """
    GET /api/v1/cases
    Lists investigation cases with primary DB check and persistent file fallback.
    """
    # 1. Attempt Primary DB Query
    try:
        from app.database.postgres import check_connection, get_session
        from db.repositories.investigation_repo import InvestigationRepository

        if await check_connection():
            async with get_session() as session:
                repo = InvestigationRepository(session)
                cases_orm = await repo.get_open_cases(limit=100)
                if cases_orm:
                    return [
                        {
                            "case_id": c.id,
                            "project_id": c.project_id,
                            "priority": c.priority,
                            "status": c.status,
                            "risk_score_at_creation": c.risk_score,
                            "risk_level_at_creation": c.risk_level,
                            "trigger_signals": c.trigger_signals or [],
                            "created_at": c.created_at.isoformat() if c.created_at else None,
                            "data_source": "database",
                        }
                        for c in cases_orm
                    ]
    except Exception as e:
        logger.warning("cases.db_query_failed", error=str(e))

    # 2. Resilient File Storage Fallback
    store = _load_file_store()
    if not store:
        store = _get_default_seed_cases()
        _save_file_store(store)

    cases_list = list(store.values())

    # Filter by priority or status if requested
    if priority:
        cases_list = [c for c in cases_list if str(c.get("priority")).upper() == priority.upper()]
    if status_filter:
        cases_list = [c for c in cases_list if str(c.get("status")).upper() == status_filter.upper()]

    for c in cases_list:
        c["data_source"] = "file_fallback"

    return cases_list


@router.get("/cases/{case_id}", status_code=status.HTTP_200_OK)
@router.get("/api/v1/cases/{case_id}", status_code=status.HTTP_200_OK)
async def get_case_details(case_id: str) -> dict[str, Any]:
    """
    GET /api/v1/cases/{case_id}
    Retrieves full details of an active or historical investigation case.
    """
    # 1. Attempt Primary DB Read
    try:
        from app.database.postgres import check_connection, get_session
        from db.repositories.investigation_repo import InvestigationRepository

        if await check_connection():
            async with get_session() as session:
                repo = InvestigationRepository(session)
                orm = await repo.get(case_id)
                if orm:
                    return {
                        "case_id": orm.id,
                        "project_id": orm.project_id,
                        "priority": orm.priority,
                        "status": orm.status,
                        "risk_score_at_creation": orm.risk_score,
                        "risk_level_at_creation": orm.risk_level,
                        "trigger_signals": orm.trigger_signals or [],
                        "created_at": orm.created_at.isoformat() if orm.created_at else None,
                        "data_source": "database",
                    }
    except Exception as e:
        logger.warning("cases_detail.db_query_failed", error=str(e))

    # 2. Resilient File Storage Fallback
    store = _load_file_store()
    if not store:
        store = _get_default_seed_cases()
        _save_file_store(store)

    if case_id in store:
        res = dict(store[case_id])
        res["data_source"] = "file_fallback"
        return res

    raise HTTPException(status_code=404, detail=f"Case {case_id} not found")


@router.post("/cases/{case_id}/verdict", status_code=status.HTTP_200_OK)
@router.post("/api/v1/cases/{case_id}/verdict", status_code=status.HTTP_200_OK)
async def submit_case_verdict(case_id: str, req: RecordVerdictRequest) -> dict[str, Any]:
    """
    POST /api/v1/cases/{case_id}/verdict
    Ingests human investigator verdict and updates case audit trail.
    Attempts primary DB write first, falling back to data/cases_store.json with sync logging.
    """
    db_saved = False

    # 1. Attempt Primary DB Write First
    try:
        from app.database.postgres import check_connection, get_session
        from db.repositories.investigation_repo import InvestigationRepository

        if await check_connection():
            async with get_session() as session:
                repo = InvestigationRepository(session)
                orm = await repo.get(case_id)
                if orm:
                    orm.status = "VERDICT_RECORDED"
                    orm.updated_at = datetime.now(UTC)
                    await session.commit()
                    db_saved = True
    except Exception as e:
        logger.warning("verdict.db_write_failed", error=str(e))

    # 2. Update File Store (Primary or Fallback Sync)
    store = _load_file_store()
    if not store:
        store = _get_default_seed_cases()

    if case_id in store:
        case_data = store[case_id]
    else:
        case_data = {
            "case_id": case_id,
            "project_id": "MPLADS-CUSTOM-001",
            "priority": "HIGH",
            "status": "UNDER_REVIEW",
            "risk_score_at_creation": 75.0,
            "risk_level_at_creation": "HIGH",
            "trigger_signals": ["Financial-Physical progress mismatch gap > 35%"],
            "created_at": datetime.now(UTC).isoformat(),
            "updated_at": datetime.now(UTC).isoformat(),
            "verdicts": [],
        }

    verdict_record = {
        "verdict": req.verdict.value if hasattr(req.verdict, "value") else str(req.verdict),
        "reason": req.reason,
        "investigator_id": req.investigator_id,
        "investigator_name": req.investigator_name,
        "is_feedback_consented": req.is_feedback_consented,
        "submitted_at": datetime.now(UTC).isoformat(),
    }

    case_data["status"] = "VERDICT_RECORDED"
    case_data["updated_at"] = datetime.now(UTC).isoformat()
    if "verdicts" not in case_data:
        case_data["verdicts"] = []
    case_data["verdicts"].append(verdict_record)

    store[case_id] = case_data
    _save_file_store(store)

    if not db_saved:
        logger.warning(
            "DB offline — case verdict saved to file fallback store (data/cases_store.json). "
            "DB and file store are out of sync until re-synced."
        )

    response_data = dict(case_data)
    response_data["data_source"] = "database" if db_saved else "file_fallback"
    return response_data
