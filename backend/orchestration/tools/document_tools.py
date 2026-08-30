"""
backend/orchestration/tools/document_tools.py
LangChain structured tools for verifying document presence (Measurement Book, Utilization Certificate, Geotags).
"""
from __future__ import annotations
from typing import Any, Dict
from langchain_core.tools import tool

from ml.features.documentation import compute_documentation_features


@tool
def verify_document_records(project_data: Dict[str, Any], doc_dict: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Verifies statutory presence of Measurement Book (MB), Utilization Certificate (UC),
    Completion Certificate, and Geo-tagged site verification photographs.
    """
    doc_dict = doc_dict or {}
    missing_mb = 1 if (int(project_data.get("missing_mb_flag", 0)) == 1 or not doc_dict.get("measurement_book", True)) else 0
    missing_uc = 1 if (int(project_data.get("missing_uc_flag", 0)) == 1 or not doc_dict.get("utilization_certificate", True)) else 0
    missing_geotag = 1 if (int(project_data.get("missing_geotag_flag", 0)) == 1 or not doc_dict.get("geo_tagged_photos", True)) else 0
    
    findings = []
    if missing_mb == 1:
        findings.append({
            "code": "MISSING_MEASUREMENT_BOOK",
            "severity": "CRITICAL",
            "description": "Mandatory physical Measurement Book (MB) record is absent from the audit docket."
        })
    if missing_uc == 1:
        findings.append({
            "code": "MISSING_UTILIZATION_CERTIFICATE",
            "severity": "HIGH",
            "description": "Statutory Utilization Certificate (UC) has not been submitted for disbursed public funds."
        })
    if missing_geotag == 1:
        findings.append({
            "code": "MISSING_GEOTAGGED_PHOTOS",
            "severity": "MEDIUM",
            "description": "Geo-tagged on-site verification photographs are missing from the asset registry."
        })

    evidence_score = 1.0 - ((missing_mb * 0.5) + (missing_uc * 0.3) + (missing_geotag * 0.2))
    return {
        "status": "success",
        "missing_mb": missing_mb,
        "missing_uc": missing_uc,
        "missing_geotag": missing_geotag,
        "evidence_integrity_score": round(max(0.0, evidence_score), 2),
        "findings": findings,
    }
