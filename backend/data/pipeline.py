"""
data/pipeline.py
Unified Ingestion Pipeline for structured MPLADS dataset ingestion.
Integrates: Ingestion -> Validation -> Normalization -> Entity Resolution -> Deduplication -> Digital Twin -> Event.
"""
from __future__ import annotations
import uuid
from dataclasses import dataclass, field
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional

from app.utils.logging import get_logger
from data.deduplication.detector import DuplicateDetector, DuplicateMatch
from data.entity_resolution.resolver import EntityResolver
from data.ingestion.sources import CSVDataSource, JSONDataSource, ExcelDataSource
from data.normalization.normalizer import (
    normalize_currency,
    normalize_date,
    normalize_district_name,
    normalize_entity_name,
    normalize_project_name,
    normalize_state_name,
)
from data.validation.rules import ValidationEngine
from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Contractor, ImplementingAgency, Sanction, Budget, Expenditure, ProgressRecord
from models.enums import ProjectCategory, ProjectStatus
from events.publisher import EventPublisher, DatabaseEventPublisher

logger = get_logger("ingestion_pipeline")


@dataclass
class IngestionPipelineResult:
    batch_id: str
    total_records: int
    valid_records: int
    invalid_records: int
    duplicates_detected: int
    twins_created: List[ProjectDigitalTwin] = field(default_factory=list)
    errors: List[Dict[str, Any]] = field(default_factory=list)
    duplicate_matches: List[DuplicateMatch] = field(default_factory=list)


class IngestionPipeline:
    """
    Orchestrates the entire structured data platform lifecycle:
    Source file -> Validation -> Normalization -> Entity Matching -> Deduplication -> Digital Twin.
    """

    def __init__(
        self,
        event_publisher: Optional[EventPublisher] = None,
        dedup_detector: Optional[DuplicateDetector] = None,
    ):
        self.validator = ValidationEngine()
        self.contractor_resolver = EntityResolver(entity_type="CONTRACTOR")
        self.agency_resolver = EntityResolver(entity_type="AGENCY")
        self.dedup_detector = dedup_detector or DuplicateDetector()
        self.event_publisher = event_publisher or DatabaseEventPublisher()

    def process_csv(self, file_path: str) -> IngestionPipelineResult:
        source = CSVDataSource(file_path=file_path)
        return self._process_source(source)

    def process_json(self, file_path: str) -> IngestionPipelineResult:
        source = JSONDataSource(file_path=file_path)
        return self._process_source(source)

    def process_excel(self, file_path: str) -> IngestionPipelineResult:
        source = ExcelDataSource(file_path=file_path)
        return self._process_source(source)

    def process_records(self, raw_records: List[Dict[str, Any]]) -> IngestionPipelineResult:
        """Process an in-memory list of raw project dictionaries."""
        batch_id = f"batch-{uuid.uuid4().hex[:8]}"
        twins: List[ProjectDigitalTwin] = []
        errors: List[Dict[str, Any]] = []
        dup_matches: List[DuplicateMatch] = []
        valid_cnt = 0
        invalid_cnt = 0

        for idx, row in enumerate(raw_records):
            twin, dup, err = self.process_single_record(row, record_id=f"rec-{idx+1}")
            if err:
                invalid_cnt += 1
                errors.append({"record_index": idx, "error": err, "raw": row})
            else:
                valid_cnt += 1
                if twin:
                    twins.append(twin)
                if dup:
                    dup_matches.append(dup)

        return IngestionPipelineResult(
            batch_id=batch_id,
            total_records=len(raw_records),
            valid_records=valid_cnt,
            invalid_records=invalid_cnt,
            duplicates_detected=len(dup_matches),
            twins_created=twins,
            errors=errors,
            duplicate_matches=dup_matches,
        )

    def _process_source(self, source) -> IngestionPipelineResult:
        batch_id = f"batch-{uuid.uuid4().hex[:8]}"
        twins: List[ProjectDigitalTwin] = []
        errors: List[Dict[str, Any]] = []
        dup_matches: List[DuplicateMatch] = []
        valid_cnt = 0
        invalid_cnt = 0
        total_cnt = 0

        try:
            for record in source.read():
                total_cnt += 1
                twin, dup, err = self.process_single_record(record.raw_data, record_id=record.record_id)
                if err:
                    invalid_cnt += 1
                    errors.append({"record_id": record.record_id, "error": err, "raw": record.raw_data})
                else:
                    valid_cnt += 1
                    if twin:
                        twins.append(twin)
                    if dup:
                        dup_matches.append(dup)
        except Exception as e:
            logger.error("ingestion_pipeline.source_read_error", error=str(e))
            errors.append({"source_error": str(e)})

        return IngestionPipelineResult(
            batch_id=batch_id,
            total_records=total_cnt,
            valid_records=valid_cnt,
            invalid_records=invalid_cnt,
            duplicates_detected=len(dup_matches),
            twins_created=twins,
            errors=errors,
            duplicate_matches=dup_matches,
        )

    def process_single_record(
        self,
        raw: Dict[str, Any],
        record_id: Optional[str] = None,
    ) -> tuple[Optional[ProjectDigitalTwin], Optional[DuplicateMatch], Optional[str]]:
        """
        Runs validation, normalization, entity resolution, deduplication, and twin generation for 1 record.
        """
        # 1. Validation
        val_result = self.validator.validate_record(raw)
        if not val_result.is_valid:
            error_msgs = "; ".join(f"{f}: {m}" for f, m in val_result.field_errors.items())
            return None, None, f"Validation failed: {error_msgs}"

        # 2. Normalization
        proj_id = str(raw.get("project_id") or raw.get("id") or record_id or uuid.uuid4().hex[:8])
        raw_name = str(raw.get("project_name") or raw.get("work_name") or "")
        norm_name = normalize_project_name(raw_name)

        norm_state = normalize_state_name(raw.get("state") or raw.get("state_name"))
        norm_district = normalize_district_name(raw.get("district") or raw.get("district_name"))

        sanctioned_amt = normalize_currency(raw.get("sanctioned_amount") or raw.get("sanction_amount") or 0.0)
        approved_bgt = normalize_currency(raw.get("approved_budget") or raw.get("budget") or sanctioned_amt)
        expenditure = normalize_currency(raw.get("total_expenditure") or raw.get("expenditure") or 0.0)

        fin_progress = float(raw.get("financial_progress") or (expenditure / max(sanctioned_amt, 1.0) * 100.0 if sanctioned_amt else 0.0))
        phys_progress = float(raw.get("physical_progress") or 0.0)

        # 3. Entity Resolution
        contractor_raw = raw.get("contractor_name") or raw.get("contractor")
        contractor_twin = None
        if contractor_raw:
            match_res = self.contractor_resolver.resolve(proj_id, str(contractor_raw))
            canon_name = match_res.match.canonical_name if match_res.match else normalize_entity_name(str(contractor_raw))
            canon_id = match_res.match.canonical_id if match_res.match else f"CONT-{uuid.uuid4().hex[:6]}"
            contractor_twin = Contractor(
                contractor_id=canon_id,
                contractor_name=canon_name,
            )

        agency_raw = raw.get("implementing_agency") or raw.get("agency")
        agency_twin = None
        if agency_raw:
            match_res = self.agency_resolver.resolve(proj_id, str(agency_raw))
            canon_name = match_res.match.canonical_name if match_res.match else normalize_entity_name(str(agency_raw))
            canon_id = match_res.match.canonical_id if match_res.match else f"AGY-{uuid.uuid4().hex[:6]}"
            agency_twin = ImplementingAgency(
                agency_id=canon_id,
                agency_name=canon_name,
            )

        # 4. Deduplication
        cat_raw = raw.get("category") or "GENERAL"
        dup_match = self.dedup_detector.check_duplicate(
            project_id=proj_id,
            project_name=norm_name,
            state=norm_state,
            district=norm_district,
            category=cat_raw,
            sanctioned_amount=sanctioned_amt,
        )
        self.dedup_detector.register_project(
            project_id=proj_id,
            project_name=norm_name,
            state=norm_state,
            district=norm_district,
            category=cat_raw,
            sanctioned_amount=sanctioned_amt,
        )

        # 5. Build Digital Twin
        start_dt = normalize_date(raw.get("start_date"))
        exp_comp_dt = normalize_date(raw.get("expected_completion_date") or raw.get("completion_date"))
        act_comp_dt = normalize_date(raw.get("actual_completion_date"))

        status_raw = str(raw.get("status") or raw.get("project_status") or "IN_PROGRESS").upper()
        try:
            status_enum = ProjectStatus[status_raw]
        except Exception:
            status_enum = ProjectStatus.IN_PROGRESS

        location_twin = GeoLocation(
            state=norm_state or "UNKNOWN",
            district=norm_district or "UNKNOWN",
            latitude=raw.get("latitude"),
            longitude=raw.get("longitude"),
        )

        today_date = date.today()
        sanction_obj = Sanction(
            sanctioned_amount=Decimal(str(sanctioned_amt)),
            sanction_date=start_dt.date() if isinstance(start_dt, datetime) else today_date,
        )
        budget_obj = Budget(
            approved_budget=Decimal(str(approved_bgt)),
            estimated_cost=Decimal(str(approved_bgt)),
        )
        expenditure_obj = Expenditure(
            total_expenditure=Decimal(str(expenditure)),
        )
        progress_obj = ProgressRecord(
            financial_progress=min(100.0, max(0.0, fin_progress)),
            physical_progress=min(100.0, max(0.0, phys_progress)),
            as_of_date=today_date,
        )

        twin = ProjectDigitalTwin(
            project_id=proj_id,
            project_name=norm_name,
            category=cat_raw,
            project_status=status_enum,
            sanction=sanction_obj,
            budget=budget_obj,
            expenditure=expenditure_obj,
            latest_progress=progress_obj,
            start_date=start_dt,
            expected_completion_date=exp_comp_dt,
            actual_completion_date=act_comp_dt,
            location=location_twin,
            contractor=contractor_twin,
            implementing_agency=agency_twin,
            document_types_present=["SANCTION_ORDER", "WORK_ORDER"],
        )

        return twin, dup_match, None

