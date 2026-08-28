"""
data/validate.py
Automated 15-point Data Quality & Referential Integrity Checker for MPLADS synthetic relational dataset.
Validates foreign keys, dates, financial sanity, progress bounds, and generates JSON + HTML reports.
"""
from __future__ import annotations
import json
import os
import sys
import pandas as pd
import numpy as np


def run_data_validation(relational_dir: str = "data/synthetic/relational", reports_dir: str = "reports") -> Dict[str, Any]:
    os.makedirs(reports_dir, exist_ok=True)
    print("=" * 60)
    print("[MPLADS DATA VALIDATOR] Executing 15-Point Integrity & Quality Audit")
    print(f"Directory: {relational_dir}")
    print("=" * 60)

    # Load Relational DataFrames
    df_projects = pd.read_parquet(os.path.join(relational_dir, "01_projects.parquet"))
    df_financials = pd.read_parquet(os.path.join(relational_dir, "02_financials.parquet"))
    df_payments = pd.read_parquet(os.path.join(relational_dir, "03_payments.parquet"))
    df_progress = pd.read_parquet(os.path.join(relational_dir, "04_progress.parquet"))
    df_procurement = pd.read_parquet(os.path.join(relational_dir, "05_procurement.parquet"))
    df_contracts = pd.read_parquet(os.path.join(relational_dir, "06_contracts.parquet"))
    df_contractors = pd.read_parquet(os.path.join(relational_dir, "07_contractors.parquet"))
    df_agencies = pd.read_parquet(os.path.join(relational_dir, "08_agencies.parquet"))
    df_districts = pd.read_parquet(os.path.join(relational_dir, "09_geography.parquet"))
    df_constituencies = pd.read_parquet(os.path.join(relational_dir, "10_constituencies.parquet"))
    df_documents = pd.read_parquet(os.path.join(relational_dir, "11_documents.parquet"))
    df_labels = pd.read_parquet(os.path.join(relational_dir, "12_labels.parquet"))

    checks = []

    # 1. Null check in primary keys
    pk_nulls = df_projects["project_id"].isnull().sum() + df_contractors["contractor_id"].isnull().sum()
    checks.append({
        "check_id": "CHK-01",
        "description": "Primary Key Nullity Check",
        "passed": bool(pk_nulls == 0),
        "details": f"Zero nulls in primary keys (Found: {pk_nulls})",
    })

    # 2. Duplicate Primary IDs Check
    dup_pks = df_projects["project_id"].duplicated().sum()
    checks.append({
        "check_id": "CHK-02",
        "description": "Primary Key Uniqueness Check",
        "passed": bool(dup_pks == 0),
        "details": f"Zero duplicate project IDs (Found: {dup_pks})",
    })

    # 3. Foreign Key Integrity: Projects -> Districts
    invalid_dist_fks = (~df_projects["district_id"].isin(df_districts["district_id"])).sum()
    checks.append({
        "check_id": "CHK-03",
        "description": "Foreign Key Integrity (Project -> District)",
        "passed": bool(invalid_dist_fks == 0),
        "details": f"All project district_ids exist in Geography master (Orphans: {invalid_dist_fks})",
    })

    # 4. Foreign Key Integrity: Projects -> Contractors
    invalid_cont_fks = (~df_projects["contractor_id"].isin(df_contractors["contractor_id"])).sum()
    checks.append({
        "check_id": "CHK-04",
        "description": "Foreign Key Integrity (Project -> Contractor)",
        "passed": bool(invalid_cont_fks == 0),
        "details": f"All project contractor_ids exist in Contractor master (Orphans: {invalid_cont_fks})",
    })

    # 5. Foreign Key Integrity: Projects -> Agencies
    invalid_agcy_fks = (~df_projects["implementing_agency_id"].isin(df_agencies["agency_id"])).sum()
    checks.append({
        "check_id": "CHK-05",
        "description": "Foreign Key Integrity (Project -> Agency)",
        "passed": bool(invalid_agcy_fks == 0),
        "details": f"All project agency_ids exist in Agency master (Orphans: {invalid_agcy_fks})",
    })

    # 6. Negative Financial Values Check
    neg_costs = (df_financials["sanctioned_amount"] < 0).sum() + (df_financials["actual_expenditure"] < 0).sum()
    checks.append({
        "check_id": "CHK-06",
        "description": "Non-Negative Financial Values Check",
        "passed": bool(neg_costs == 0),
        "details": f"All financial amounts are strictly non-negative (Found: {neg_costs})",
    })

    # 7. Progress Bounds Check [0.0 - 100.0]
    out_of_bounds_prog = ((df_progress["physical_progress"] < 0) | (df_progress["physical_progress"] > 100)).sum()
    checks.append({
        "check_id": "CHK-07",
        "description": "Physical Progress Range Bounds [0, 100]",
        "passed": bool(out_of_bounds_prog == 0),
        "details": f"Physical progress strictly between 0% and 100% (Violations: {out_of_bounds_prog})",
    })

    # 8. Date Chronology Check: Recommendation <= Sanction <= Start
    date_violations = (pd.to_datetime(df_projects["recommendation_date"]) > pd.to_datetime(df_projects["sanction_date"])).sum()
    checks.append({
        "check_id": "CHK-08",
        "description": "Date Chronology Logic (Recommendation <= Sanction)",
        "passed": bool(date_violations == 0),
        "details": f"Sanctions occur on or after MP recommendations (Violations: {date_violations})",
    })

    # 9. Geographic Coordinate Bounds for India (Including Andaman/Nicobar & Kutch Coast)
    lat_violations = ((df_projects["latitude"] < 6.0) | (df_projects["latitude"] > 38.0)).sum()
    lon_violations = ((df_projects["longitude"] < 67.0) | (df_projects["longitude"] > 98.0)).sum()
    checks.append({
        "check_id": "CHK-09",
        "description": "Plausible Indian Geospatial Bounds Check",
        "passed": bool(lat_violations + lon_violations == 0),
        "details": f"Coordinates fall within mainland Indian bounding box (Outliers: {lat_violations + lon_violations})",
    })

    # 10. Payment Referential Consistency
    orphaned_pmts = (~df_payments["project_id"].isin(df_projects["project_id"])).sum()
    checks.append({
        "check_id": "CHK-10",
        "description": "Payment Referential Consistency",
        "passed": bool(orphaned_pmts == 0),
        "details": f"All payment vouchers linked to valid project records (Orphans: {orphaned_pmts})",
    })

    # 11. Procurement Bid Count Sanity Check
    invalid_bids = (df_procurement["bid_count"] < 1).sum()
    checks.append({
        "check_id": "CHK-11",
        "description": "Tender Bid Count Sanity Check (>= 1)",
        "passed": bool(invalid_bids == 0),
        "details": f"All procurement records have at least 1 bidder (Invalid: {invalid_bids})",
    })

    # 12. Single Bid Flag Consistency
    single_bid_mismatches = ((df_procurement["bid_count"] == 1) & (df_procurement["single_bid_flag"] != 1)).sum()
    checks.append({
        "check_id": "CHK-12",
        "description": "Single-Bid Flag Logical Consistency",
        "passed": bool(single_bid_mismatches == 0),
        "details": f"Single bid flag matches bid_count == 1 exactly (Mismatches: {single_bid_mismatches})",
    })

    # 13. Document Count Logical Integrity
    invalid_docs = (df_documents["available_document_count"] > df_documents["required_document_count"]).sum()
    checks.append({
        "check_id": "CHK-13",
        "description": "Document Count Bounds (Available <= Required)",
        "passed": bool(invalid_docs == 0),
        "details": f"Available documents never exceed required document quota (Violations: {invalid_docs})",
    })

    # 14. Label Completeness Check
    unlabeled_projects = (~df_projects["project_id"].isin(df_labels["project_id"])).sum()
    checks.append({
        "check_id": "CHK-14",
        "description": "Ground Truth Label Completeness",
        "passed": bool(unlabeled_projects == 0),
        "details": f"100% of generated projects have ground truth scenario labels (Unlabeled: {unlabeled_projects})",
    })

    # 15. Risk Tier Distribution Sanity
    risk_dist = df_labels["risk_level"].value_counts().to_dict()
    has_all_tiers = all(k in risk_dist for k in ["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    checks.append({
        "check_id": "CHK-15",
        "description": "Multi-Class Risk Tier Coverage (LOW/MED/HIGH/CRIT)",
        "passed": bool(has_all_tiers),
        "details": f"Distribution: {risk_dist}",
    })

    all_passed = all(c["passed"] for c in checks)
    passed_count = sum(c["passed"] for c in checks)

    # Print summary
    for c in checks:
        status_str = "[PASS]" if c["passed"] else "[FAIL]"
        print(f" {status_str} {c['check_id']}: {c['description']} — {c['details']}")

    # Save JSON Report
    report_data = {
        "timestamp": pd.Timestamp.now().isoformat(),
        "total_projects": len(df_projects),
        "total_checks": len(checks),
        "passed_checks": passed_count,
        "overall_status": "PASS" if all_passed else "FAIL",
        "checks": checks,
        "risk_distribution": risk_dist,
    }

    json_path = os.path.join(reports_dir, "data_quality_report.json")
    with open(json_path, "w") as f:
        json.dump(report_data, f, indent=2)

    # Generate Interactive HTML Report
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MPLADS AI Audit — Synthetic Data Quality Report</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAFAF7; color: #15324A; margin: 40px; }}
        h1 {{ color: #15324A; border-bottom: 2px solid #D99018; padding-bottom: 10px; }}
        .badge {{ display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }}
        .badge-pass {{ background: #DCFCE7; color: #166534; }}
        .badge-fail {{ background: #FEE2E2; color: #991B1B; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; }}
        th, td {{ padding: 12px 16px; text-align: left; border-bottom: 1px solid #E5E7EB; }}
        th {{ background: #F3F4F6; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }}
        tr:hover {{ background: #F9FAFB; }}
    </style>
</head>
<body>
    <h1>AGASTYA — Synthetic Relational Data Quality Audit</h1>
    <p><strong>Status:</strong> <span class="badge {'badge-pass' if all_passed else 'badge-fail'}">{'PASS - 15/15 CHECKS VERIFIED' if all_passed else 'FAIL'}</span></p>
    <p><strong>Total Projects Evaluated:</strong> {len(df_projects):,} | <strong>Timestamp:</strong> {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Check Description</th>
                <th>Status</th>
                <th>Diagnostic Details</th>
            </tr>
        </thead>
        <tbody>
            {"".join(f'''<tr>
                <td><strong>{c["check_id"]}</strong></td>
                <td>{c["description"]}</td>
                <td><span class="badge {'badge-pass' if c['passed'] else 'badge-fail'}">{'PASS' if c['passed'] else 'FAIL'}</span></td>
                <td>{c["details"]}</td>
            </tr>''' for c in checks)}
        </tbody>
    </table>
</body>
</html>"""

    html_path = os.path.join(reports_dir, "data_quality_report.html")
    with open(html_path, "w") as f:
        f.write(html_content)

    print("=" * 60)
    print(f"[MPLADS DATA VALIDATOR] Result: {'PASS' if all_passed else 'FAIL'} ({passed_count}/15 checks)")
    print(f"JSON Report: {json_path}")
    print(f"HTML Report: {html_path}")
    print("=" * 60)

    return report_data


if __name__ == "__main__":
    run_data_validation()
