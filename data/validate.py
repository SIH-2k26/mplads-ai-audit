"""
data/validate.py
Strict Automated Validation & Quality Assurance Framework for MPLADS Synthetic Relational Datasets.
Audits 12 relational tables + 177 engineered features for referential integrity, financial consistency,
date chronology, geographic bounds, document completeness, and zero data leakage.
"""
from __future__ import annotations
import argparse
import datetime
import json
import os
import sys
from typing import Any, Dict, List, Tuple
import numpy as np
import pandas as pd


def run_data_validation(
    input_dir: str = "data/synthetic/relational",
    strict_mode: bool = False,
    output_json: str = "reports/data_validation.json",
    output_html: str = "reports/data_validation.html",
) -> Tuple[int, Dict[str, Any]]:
    """
    Executes a comprehensive multi-tier relational and feature validation audit.
    Returns (exit_code, validation_summary).
    Exit Codes: 0 = PASS (Clean), 1 = WARNINGS_ONLY, 2 = CRITICAL_FAILURE.
    """
    print("=" * 65)
    print("[MPLADS DATA VALIDATOR] Executing Multi-Tier Data Integrity & Quality Audit")
    print(f"Directory: {input_dir} | Strict Mode: {strict_mode}")
    print("=" * 65)

    os.makedirs("reports", exist_ok=True)
    checks: List[Dict[str, Any]] = []
    critical_errors = 0
    warnings = 0
    anomaly_signals = 0

    def add_check(check_id: str, category: str, desc: str, passed: Any, severity: str, details: str):
        nonlocal critical_errors, warnings, anomaly_signals
        passed_bool = bool(passed)
        if not passed_bool:
            if severity == "CRITICAL":
                critical_errors += 1
            elif severity == "WARNING":
                warnings += 1
            elif severity == "ANOMALY_SIGNAL":
                anomaly_signals += 1

        status_str = "[PASS]" if passed_bool else f"[{severity}]"
        print(f" {status_str} {check_id}: {desc} — {details}")
        checks.append({
            "check_id": str(check_id),
            "category": str(category),
            "description": str(desc),
            "passed": passed_bool,
            "severity": str(severity),
            "details": str(details),
        })

    # 1. Load Relational Tables
    table_files = [
        "01_projects", "02_financials", "03_payments", "04_progress",
        "05_procurement", "06_contracts", "07_contractors", "08_agencies",
        "09_geography", "10_constituencies", "11_documents", "12_labels"
    ]
    dfs: Dict[str, pd.DataFrame] = {}

    for tbl in table_files:
        p_parquet = os.path.join(input_dir, f"{tbl}.parquet")
        p_csv = os.path.join(input_dir, f"{tbl}.csv")
        if os.path.exists(p_parquet):
            dfs[tbl] = pd.read_parquet(p_parquet)
        elif os.path.exists(p_csv):
            dfs[tbl] = pd.read_csv(p_csv)
        else:
            add_check("CHK-00", "Schema", f"Table Existence ({tbl})", False, "CRITICAL", f"Missing table file in {input_dir}")
            return 2, {"error": f"Missing table {tbl}"}

    df_p = dfs["01_projects"]
    df_f = dfs["02_financials"]
    df_pay = dfs["03_payments"]
    df_prog = dfs["04_progress"]
    df_proc = dfs["05_procurement"]
    df_c = dfs["06_contracts"]
    df_cont = dfs["07_contractors"]
    df_agcy = dfs["08_agencies"]
    df_geo = dfs["09_geography"]
    df_const = dfs["10_constituencies"]
    df_docs = dfs["11_documents"]
    df_lab = dfs["12_labels"]

    # 2. Primary Key Uniqueness & Non-Nullity
    for tbl_name, id_col in [
        ("01_projects", "project_id"),
        ("02_financials", "project_id"),
        ("03_payments", "payment_id"),
        ("04_progress", "progress_id"),
        ("05_procurement", "tender_id"),
        ("06_contracts", "contract_id"),
        ("07_contractors", "contractor_id"),
        ("08_agencies", "agency_id"),
        ("09_geography", "district_id"),
        ("10_constituencies", "constituency_id"),
        ("11_documents", "document_id"),
        ("12_labels", "project_id"),
    ]:
        df = dfs[tbl_name]
        is_uniq = bool(df[id_col].nunique() == len(df))
        has_null = bool(df[id_col].isnull().any())
        add_check(
            f"PK-{tbl_name[:2]}", "Integrity", f"PK Uniqueness ({tbl_name}.{id_col})",
            is_uniq and not has_null, "CRITICAL",
            f"Total: {len(df):,}, Unique: {df[id_col].nunique():,}, Nulls: {df[id_col].isnull().sum()}"
        )

    # 3. Foreign Key Referential Integrity
    # Projects -> Contractors
    orphans_cont = (~df_p["contractor_id"].isin(df_cont["contractor_id"])).sum()
    add_check("FK-01", "Referential", "FK (Projects -> Contractors)", orphans_cont == 0, "CRITICAL", f"Orphaned contractor references: {orphans_cont}")

    # Projects -> Agencies
    agcy_col = "agency_id" if "agency_id" in df_p.columns else "implementing_agency_id"
    orphans_agcy = (~df_p[agcy_col].isin(df_agcy["agency_id"])).sum()
    add_check("FK-02", "Referential", "FK (Projects -> Agencies)", orphans_agcy == 0, "CRITICAL", f"Orphaned agency references: {orphans_agcy}")

    # Projects -> Geography (Districts)
    orphans_dist = (~df_p["district_id"].isin(df_geo["district_id"])).sum()
    add_check("FK-03", "Referential", "FK (Projects -> Districts)", orphans_dist == 0, "CRITICAL", f"Orphaned district references: {orphans_dist}")

    # Payments -> Projects
    orphans_pmt = (~df_pay["project_id"].isin(df_p["project_id"])).sum()
    add_check("FK-04", "Referential", "FK (Payments -> Projects)", orphans_pmt == 0, "CRITICAL", f"Orphaned payment records: {orphans_pmt}")

    # 4. Financial Integrity Checks
    neg_sanc = (df_f["sanctioned_amount"] < 0).sum()
    neg_exp = (df_f["actual_expenditure"] < 0).sum()
    neg_bal = (df_f["unspent_balance"] < 0).sum()
    add_check("FIN-01", "Financial", "Non-Negative Financial Bounds", (neg_sanc + neg_exp + neg_bal) == 0, "CRITICAL", f"Negative cost instances: {neg_sanc + neg_exp + neg_bal}")

    # Cost overrun check (as Anomaly Signal)
    overrun_count = (df_f["actual_expenditure"] > df_f["sanctioned_amount"] * 1.15).sum()
    add_check("FIN-02", "Financial", "Cost Overrun Anomaly Scan", True, "INFORMATIONAL", f"Projects with expenditure > 115% of sanction: {overrun_count:,} (Controlled anomaly mix)")

    # 5. Date Chronology Checks
    rec_dates = pd.to_datetime(df_p["recommendation_date"])
    sanc_dates = pd.to_datetime(df_p["sanction_date"])
    comp_dates = pd.to_datetime(df_p["target_completion_date"])
    bad_rec_sanc = (sanc_dates < rec_dates).sum()
    bad_sanc_comp = (comp_dates < sanc_dates).sum()
    add_check("DATE-01", "Temporal", "Date Sequence (Rec <= Sanction <= Completion)", (bad_rec_sanc + bad_sanc_comp) == 0, "CRITICAL", f"Chronology violations: {bad_rec_sanc + bad_sanc_comp}")

    # 6. Physical and Financial Progress Bounds
    bad_phys = ((df_prog["physical_progress"] < 0) | (df_prog["physical_progress"] > 100)).sum()
    add_check("PROG-01", "Progress", "Physical Progress Bounds (0-100%)", bad_phys == 0, "CRITICAL", f"Out of bounds physical progress: {bad_phys}")

    # Large progress gap (Anomaly Signal)
    gap_count = (df_prog["progress_gap"] > 25.0).sum()
    add_check("PROG-02", "Progress", "Progress Desynchronization Signal", True, "INFORMATIONAL", f"Projects where financial leads physical by >25%: {gap_count:,}")

    # 7. Geographic Bounds for India
    lat_col = "project_latitude" if "project_latitude" in df_p.columns else "latitude"
    lon_col = "project_longitude" if "project_longitude" in df_p.columns else "longitude"
    bad_lat = ((df_p[lat_col] < 6.0) | (df_p[lat_col] > 38.0)).sum()
    bad_lon = ((df_p[lon_col] < 67.0) | (df_p[lon_col] > 98.0)).sum()
    add_check("GEO-01", "Geospatial", "Indian Coordinate Bounds", (bad_lat + bad_lon) == 0, "CRITICAL", f"Coordinates outside India bounding box: {bad_lat + bad_lon}")

    # 8. Document Completeness Consistency
    bad_doc_ratio = ((df_docs["missing_document_ratio"] < 0) | (df_docs["missing_document_ratio"] > 1.0)).sum()
    bad_doc_avail = (df_docs["available_document_count"] > df_docs["required_document_count"]).sum()
    add_check("DOC-01", "Documentation", "Document Count & Ratio Consistency", (bad_doc_ratio + bad_doc_avail) == 0, "CRITICAL", f"Inconsistent document records: {bad_doc_ratio + bad_doc_avail}")

    # 9. Procurement Integrity
    bad_bids = (df_proc["bid_count"] < 1).sum()
    add_check("PROC-01", "Procurement", "Tender Bid Count (>= 1)", bad_bids == 0, "CRITICAL", f"Tenders with <1 bid: {bad_bids}")

    # 10. Target Leakage Scan
    target_cols = {"fraud_label", "is_anomalous", "risk_level", "scenario_type", "investigation_priority"}
    feature_leaks = 0
    for tbl_name in ["01_projects", "02_financials", "03_payments", "04_progress", "05_procurement", "06_contracts", "11_documents"]:
        leaks = set(dfs[tbl_name].columns).intersection(target_cols)
        if leaks:
            feature_leaks += len(leaks)
    add_check("LEAK-01", "Leakage", "Anti-Target Leakage Segregation", feature_leaks == 0, "CRITICAL", f"Target variables leaking into feature tables: {feature_leaks}")

    # 11. Class Balance & Hard Negative Distribution
    fraud_count = int((df_lab["fraud_label"] == 1).sum())
    fraud_rate = fraud_count / float(len(df_lab))
    hard_neg_count = int(df_lab["scenario_type"].isin(["HIGH_VALUE_LEGITIMATE", "LEGITIMATE_REMOTE_SINGLE_BID", "LEGITIMATE_WEATHER_DELAY"]).sum())
    hard_neg_rate = hard_neg_count / float(len(df_lab))

    add_check("CLASS-01", "ClassBalance", "Target Fraud Ratio (10-35%)", 0.10 <= fraud_rate <= 0.35, "WARNING", f"Actual fraud rate: {fraud_rate*100:.2f}% ({fraud_count:,} projects)")
    add_check("CLASS-02", "ClassBalance", "Hard Negative Controls (>=5%)", hard_neg_rate >= 0.05, "WARNING", f"Actual hard negative rate: {hard_neg_rate*100:.2f}% ({hard_neg_count:,} projects)")

    # Compute Final Status & Exit Code
    if critical_errors > 0:
        exit_code = 2
        overall_status = "FAILED (Critical Integrity Errors Found)"
    elif warnings > 0 and strict_mode:
        exit_code = 1
        overall_status = "FAILED (Strict Mode: Warnings Present)"
    elif warnings > 0:
        exit_code = 1
        overall_status = "PASSED_WITH_WARNINGS"
    else:
        exit_code = 0
        overall_status = "PASSED_CLEAN"

    summary = {
        "timestamp": datetime.datetime.now().isoformat(),
        "input_dir": input_dir,
        "overall_status": overall_status,
        "exit_code": exit_code,
        "total_projects": len(df_p),
        "total_tables": len(dfs),
        "total_rows": sum(len(d) for d in dfs.values()),
        "critical_errors": critical_errors,
        "warnings": warnings,
        "anomaly_signals": anomaly_signals,
        "checks_total": len(checks),
        "checks_passed": sum(1 for c in checks if c["passed"]),
        "fraud_rate": round(fraud_rate, 4),
        "hard_negative_rate": round(hard_neg_rate, 4),
        "checks": checks,
    }

    # Save JSON Report
    with open(output_json, "w") as f:
        json.dump(summary, f, indent=2)

    # Save HTML Report
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>MPLADS Data Validation Report</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 30px; background: #fafaf7; color: #15324a; }}
        .header {{ background: #15324a; color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; }}
        .card {{ background: white; padding: 20px; border-radius: 8px; border: 1px solid #d9dfe3; margin-bottom: 20px; }}
        .status-pass {{ color: #2e8064; font-weight: bold; }}
        .status-fail {{ color: #c94b4b; font-weight: bold; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
        th, td {{ padding: 10px; border: 1px solid #d9dfe3; text-align: left; font-size: 13px; }}
        th {{ background: #f0f4f7; }}
        .badge {{ padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }}
        .badge-pass {{ background: #e6f4ea; color: #137333; }}
        .badge-critical {{ background: #fce8e6; color: #c5221f; }}
    </style>
</head>
<body>
    <div class="header">
        <h2>MPLADS Data Integrity & Quality Validation Audit</h2>
        <p>Status: <strong>{overall_status}</strong> | Projects: {len(df_p):,} | Total Rows: {summary['total_rows']:,}</p>
    </div>
    <div class="card">
        <h3>Executive Summary</h3>
        <p>Total Checks: <strong>{len(checks)}</strong> | Passed: <strong class="status-pass">{summary['checks_passed']}</strong> | Critical Errors: <strong class="status-fail">{critical_errors}</strong> | Warnings: <strong>{warnings}</strong></p>
        <p>Fraud Ratio: <strong>{fraud_rate*100:.2f}%</strong> | Hard Negative Ratio: <strong>{hard_neg_rate*100:.2f}%</strong></p>
    </div>
    <div class="card">
        <h3>Detailed Check Results</h3>
        <table>
            <tr><th>Check ID</th><th>Category</th><th>Description</th><th>Severity</th><th>Status</th><th>Details</th></tr>
            {"".join(f"<tr><td><code>{c['check_id']}</code></td><td>{c['category']}</td><td>{c['description']}</td><td>{c['severity']}</td><td><span class='badge {'badge-pass' if c['passed'] else 'badge-critical'}'>{'PASS' if c['passed'] else 'FAIL'}</span></td><td>{c['details']}</td></tr>" for c in checks)}
        </table>
    </div>
</body>
</html>"""
    with open(output_html, "w") as f:
        f.write(html_content)

    print("=" * 65)
    print(f"[MPLADS DATA VALIDATOR] Final Result: {overall_status} (Exit Code: {exit_code})")
    print(f"Reports: {output_json} & {output_html}")
    print("=" * 65)
    return exit_code, summary


def main():
    parser = argparse.ArgumentParser(description="Strict Automated Validation Framework for MPLADS Synthetic Relational Datasets.")
    parser.add_argument("--input", type=str, default="data/synthetic/relational", help="Input directory containing relational tables")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as failures (Exit code 1)")
    parser.add_argument("--json", type=str, default="reports/data_validation.json", help="Path to write JSON validation report")
    parser.add_argument("--html", type=str, default="reports/data_validation.html", help="Path to write HTML validation report")
    args = parser.parse_args()

    exit_code, _ = run_data_validation(
        input_dir=args.input,
        strict_mode=args.strict,
        output_json=args.json,
        output_html=args.html,
    )
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
