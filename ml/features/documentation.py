"""
ml/features/documentation.py
Document Integrity, Presence, Completeness & Missing Indicators for Sanchay AI.
"""
from __future__ import annotations
from typing import Any, Dict, Optional


def compute_documentation_features(
    doc_dict: Optional[Dict[str, Any]] = None,
    project_dict: Optional[Dict[str, Any]] = None,
) -> Dict[str, float]:
    d = doc_dict or {}
    p = project_dict or {}

    sanction_doc = 1.0 if d.get("administrative_sanction", d.get("sanction_document_present", True)) else 0.0
    tech_sanction = 1.0 if d.get("technical_sanction", d.get("technical_sanction_present", True)) else 0.0
    dpr = 1.0 if d.get("dpr", d.get("dpr_present", True)) else 0.0
    wo = 1.0 if d.get("work_order", d.get("work_order_present", True)) else 0.0
    mb = 1.0 if (d.get("measurement_book", True) and int(p.get("missing_mb_flag", 0)) == 0) else 0.0
    uc = 1.0 if (d.get("utilization_certificate", True) and int(p.get("missing_uc_flag", 0)) == 0) else 0.0
    comp_cert = 1.0 if (d.get("completion_certificate", True) and int(p.get("missing_completion_cert_flag", 0)) == 0) else 0.0
    geotag = 1.0 if (d.get("geo_tagged_photos", True) and int(p.get("missing_geotag_flag", 0)) == 0) else 0.0

    missing_mb_flag = 1.0 - mb
    missing_uc_flag = 1.0 - uc
    missing_comp_cert_flag = 1.0 - comp_cert
    missing_geotag_flag = 1.0 - geotag

    docs_present = [sanction_doc, tech_sanction, dpr, wo, mb, uc, comp_cert, geotag]
    avail_count = float(sum(docs_present))
    req_count = 8.0
    completeness = float(avail_count / req_count)

    # Missing document ratio
    missing_ratio = float((req_count - avail_count) / req_count)

    # Rule violation counts derived deterministically
    doc_viol = float(missing_mb_flag + missing_uc_flag + missing_geotag_flag)
    proc_viol = 1.0 if int(p.get("single_bid_flag", 0)) == 1 or int(p.get("bid_count", 4)) == 1 else 0.0
    fin_viol = 1.0 if (float(p.get("financial_progress", 80.0)) - float(p.get("physical_progress", 75.0))) > 25.0 else 0.0
    crit_viol = 1.0 if (missing_mb_flag == 1.0 or fin_viol == 1.0) else 0.0
    total_viol = doc_viol + proc_viol + fin_viol

    return {
        "sanction_document_present": sanction_doc,
        "technical_sanction_present": tech_sanction,
        "dpr_present": dpr,
        "estimate_present": 1.0,
        "revised_estimate_present": 0.0,
        "tender_document_present": 1.0,
        "bid_document_present": 1.0,
        "work_order_present": wo,
        "invoice_present": 1.0,
        "payment_voucher_present": 1.0,
        "measurement_book_present": mb,
        "utilization_certificate_present": uc,
        "completion_certificate_present": comp_cert,
        "inspection_report_present": 1.0,
        "site_verification_present": 1.0,
        "photo_count": 4.0 if geotag == 1.0 else 0.0,
        "geotag_photo_count": 4.0 if geotag == 1.0 else 0.0,
        "unique_photo_hash_count": 4.0 if geotag == 1.0 else 0.0,
        "document_date_consistency": 1.0,
        "document_sequence_consistency": 1.0,
        "missing_date_count": 0.0,
        "missing_document_ratio": missing_ratio,
        "required_document_count": req_count,
        "available_document_count": avail_count,
        "document_completeness_score": completeness,
        "document_consistency_score": 1.0,
        "missing_mb_flag": missing_mb_flag,
        "missing_uc_flag": missing_uc_flag,
        "missing_completion_cert_flag": missing_comp_cert_flag,
        "missing_geotag_flag": missing_geotag_flag,
        "eligibility_violation_count": 0.0,
        "procurement_violation_count": proc_viol,
        "documentation_violation_count": doc_viol,
        "financial_violation_count": fin_viol,
        "timeline_violation_count": 0.0,
        "payment_violation_count": 0.0,
        "completion_violation_count": 0.0,
        "total_rule_violation_count": total_viol,
        "critical_rule_violation_count": crit_viol,
    }
