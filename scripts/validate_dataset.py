"""
scripts/validate_dataset.py
Automated Relational Dataset Integrity Auditor and Statistical Quality Checker.
Validates foreign keys, dates, non-negative amounts, and saves reports/dataset_statistics.json.
"""
from __future__ import annotations
import json
import os
import sys
import pandas as pd


def validate_dataset(relational_dir: str = "data/synthetic/relational", reports_dir: str = "reports") -> bool:
    print("=" * 60)
    print("[DATASET VALIDATOR] Running Relational Integrity & Quality Audit")
    print(f"Directory: {relational_dir}")
    print("=" * 60)

    os.makedirs(reports_dir, exist_ok=True)

    # 1. Load Tables
    df_p = pd.read_parquet(os.path.join(relational_dir, "01_projects.parquet"))
    df_f = pd.read_parquet(os.path.join(relational_dir, "02_financials.parquet"))
    df_pay = pd.read_parquet(os.path.join(relational_dir, "03_payments.parquet"))
    df_pr = pd.read_parquet(os.path.join(relational_dir, "04_progress.parquet"))
    df_pc = pd.read_parquet(os.path.join(relational_dir, "05_procurement.parquet"))
    df_c = pd.read_parquet(os.path.join(relational_dir, "07_contractors.parquet"))
    df_a = pd.read_parquet(os.path.join(relational_dir, "08_agencies.parquet"))
    df_g = pd.read_parquet(os.path.join(relational_dir, "09_geography.parquet"))
    df_l = pd.read_parquet(os.path.join(relational_dir, "12_labels.parquet"))

    checks = []

    # Check 1: PK nulls
    p_nulls = df_p["project_id"].isnull().sum()
    checks.append({"name": "Primary Key Nulls", "passed": bool(p_nulls == 0), "details": f"Found {p_nulls} nulls"})

    # Check 2: PK uniqueness
    p_dups = df_p["project_id"].duplicated().sum()
    checks.append({"name": "Primary Key Uniqueness", "passed": bool(p_dups == 0), "details": f"Found {p_dups} duplicates"})

    # Check 3: Foreign Key Project -> Geography
    orphan_dist = set(df_p["district_id"]) - set(df_g["district_id"])
    checks.append({"name": "FK Project -> Geography", "passed": len(orphan_dist) == 0, "details": f"Orphan districts: {len(orphan_dist)}"})

    # Check 4: Foreign Key Project -> Contractor
    orphan_cont = set(df_p["contractor_id"]) - set(df_c["contractor_id"])
    checks.append({"name": "FK Project -> Contractor", "passed": len(orphan_cont) == 0, "details": f"Orphan contractors: {len(orphan_cont)}"})

    # Check 5: Foreign Key Project -> Agency
    orphan_agy = set(df_p["agency_id"]) - set(df_a["agency_id"])
    checks.append({"name": "FK Project -> Agency", "passed": len(orphan_agy) == 0, "details": f"Orphan agencies: {len(orphan_agy)}"})

    # Check 6: Foreign Key Payment -> Project
    orphan_pay = set(df_pay["project_id"]) - set(df_p["project_id"])
    checks.append({"name": "FK Payment -> Project", "passed": len(orphan_pay) == 0, "details": f"Orphan payments: {len(orphan_pay)}"})

    # Check 7: Non-negative financial amounts
    neg_sanction = (df_f["sanctioned_amount"] < 0).sum()
    neg_exp = (df_f["actual_expenditure"] < 0).sum()
    checks.append({"name": "Non-Negative Amounts", "passed": bool(neg_sanction == 0 and neg_exp == 0), "details": "All amounts >= 0"})

    # Check 8: Progress Bounds [0, 100]
    invalid_phys = ((df_pr["physical_progress"] < 0) | (df_pr["physical_progress"] > 100)).sum()
    checks.append({"name": "Physical Progress Bounds [0, 100]", "passed": bool(invalid_phys == 0), "details": f"Violations: {invalid_phys}"})

    # Check 9: Date logic (recommendation <= sanction)
    df_p["rec_dt"] = pd.to_datetime(df_p["recommendation_date"])
    df_p["sanc_dt"] = pd.to_datetime(df_p["sanction_date"])
    invalid_dates = (df_p["rec_dt"] > df_p["sanc_dt"]).sum()
    checks.append({"name": "Date Chronology Logic", "passed": bool(invalid_dates == 0), "details": f"Violations: {invalid_dates}"})

    # Print Results
    all_passed = True
    for c in checks:
        status = "[PASS]" if c["passed"] else "[FAIL]"
        if not c["passed"]:
            all_passed = False
        print(f" {status} {c['name']}: {c['details']}")

    # Save Statistical Report
    stats = {
        "total_projects": len(df_p),
        "total_payments": len(df_pay),
        "total_contractors": len(df_c),
        "total_agencies": len(df_a),
        "total_districts": len(df_g),
        "fraud_rate": round(float(df_l["fraud_label"].mean()), 4),
        "risk_level_distribution": df_l["risk_level"].value_counts().to_dict(),
        "checks_summary": {"total": len(checks), "passed": sum(1 for c in checks if c["passed"])},
    }
    with open(os.path.join(reports_dir, "dataset_statistics.json"), "w") as f:
        json.dump(stats, f, indent=2)

    print("=" * 60)
    print(f"[DATASET VALIDATOR] Result: {'ALL CHECKS PASSED' if all_passed else 'FAILED'}")
    print(f"Statistics written to: {reports_dir}/dataset_statistics.json")
    print("=" * 60)
    return all_passed


if __name__ == "__main__":
    passed = validate_dataset()
    if not passed:
        sys.exit(1)
