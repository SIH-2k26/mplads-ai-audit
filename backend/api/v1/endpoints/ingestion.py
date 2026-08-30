"""
api/v1/endpoints/ingestion.py
Data Ingestion API endpoints for uploading and normalizing structured MPLADS records.
"""
from __future__ import annotations
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.auth.dependencies import require_role
from app.auth.models import UserRole
from data.pipeline import IngestionPipeline, IngestionPipelineResult

router = APIRouter(prefix="/ingest", tags=["Data Platform & Ingestion"])

pipeline = IngestionPipeline()


@router.post("/records", response_model=Dict[str, Any])
async def ingest_records(
    records: List[Dict[str, Any]],
    current_user=Depends(require_role([UserRole.DISTRICT_AUTHORITY, UserRole.STATE_AUTHORITY, UserRole.MINISTRY, UserRole.ADMIN])),
):
    """
    Ingests an in-memory batch of raw project records through validation, normalization, entity resolution, deduplication, and digital twin conversion.
    """
    if not records:
        raise HTTPException(status_code=400, detail="Empty records batch provided.")

    result: IngestionPipelineResult = pipeline.process_records(records)

    return {
        "batch_id": result.batch_id,
        "total_records": result.total_records,
        "valid_records": result.valid_records,
        "invalid_records": result.invalid_records,
        "duplicates_detected": result.duplicates_detected,
        "twins_created_count": len(result.twins_created),
        "errors": result.errors[:20],  # Return top 20 errors
        "duplicate_groups": [
            {
                "source_id": d.source_id,
                "target_id": d.target_id,
                "duplicate_group_id": d.duplicate_group_id,
                "similarity_score": d.similarity_score,
                "decision": d.decision,
            }
            for d in result.duplicate_matches
        ],
    }
