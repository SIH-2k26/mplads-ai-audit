"""
ml/predict.py
CLI Prediction Interface for MPLADS AI Audit.
Loads trained hybrid risk ensemble and performs inference on single project IDs or custom inputs.
"""
from __future__ import annotations
import argparse
import json
import os
import sys
import pandas as pd
from ml.ensemble import HybridRiskEnsemble


def predict_project(project_id: str = "MPLADS-000001", relational_dir: str = "data/synthetic/relational") -> None:
    ensemble = HybridRiskEnsemble()

    # If relational data exists, look up the project
    proj_path = os.path.join(relational_dir, "01_projects.parquet")
    fin_path = os.path.join(relational_dir, "02_financials.parquet")
    prg_path = os.path.join(relational_dir, "04_progress.parquet")
    proc_path = os.path.join(relational_dir, "05_procurement.parquet")
    cont_path = os.path.join(relational_dir, "07_contractors.parquet")
    doc_path = os.path.join(relational_dir, "11_documents.parquet")

    project_data = {"project_id": project_id}

    if os.path.exists(proj_path):
        df_p = pd.read_parquet(proj_path)
        matched = df_p[df_p["project_id"] == project_id]
        if not matched.empty:
            p_row = matched.iloc[0].to_dict()
            project_data.update(p_row)

            # Financials
            if os.path.exists(fin_path):
                df_f = pd.read_parquet(fin_path)
                f_m = df_f[df_f["project_id"] == project_id]
                if not f_m.empty:
                    project_data.update(f_m.iloc[0].to_dict())

            # Progress
            if os.path.exists(prg_path):
                df_pr = pd.read_parquet(prg_path)
                pr_m = df_pr[df_pr["project_id"] == project_id]
                if not pr_m.empty:
                    project_data.update(pr_m.iloc[0].to_dict())

            # Procurement
            if os.path.exists(proc_path):
                df_pc = pd.read_parquet(proc_path)
                pc_m = df_pc[df_pc["project_id"] == project_id]
                if not pc_m.empty:
                    project_data.update(pc_m.iloc[0].to_dict())

            # Documents
            if os.path.exists(doc_path):
                df_d = pd.read_parquet(doc_path)
                d_m = df_d[df_d["project_id"] == project_id]
                if not d_m.empty:
                    project_data.update(d_m.iloc[0].to_dict())

            # Contractor
            if "contractor_id" in project_data and os.path.exists(cont_path):
                df_c = pd.read_parquet(cont_path)
                c_m = df_c[df_c["contractor_id"] == project_data["contractor_id"]]
                if not c_m.empty:
                    project_data.update(c_m.iloc[0].to_dict())

    result = ensemble.analyze_project(project_data)

    print("=" * 60)
    print(f"PROJECT: {result['project_id']}")
    print("=" * 60)
    print(f"Fraud / Anomaly Probability: {result['fraud_probability']*100:.1f}%")
    print(f"Overall Risk Score:          {result['risk_score']} / 100")
    print(f"Calibrated Risk Level:       {result['risk_level']}")
    print(f"Regulatory Compliance Score: {result.get('compliance_score', 100)} / 100")
    print(f"Anomaly Types:               {', '.join(result['anomaly_types'])}")
    print(f"\nRecommended Action:")
    print(f"-> {result['recommended_action']}")

    if result.get("rule_violations"):
        print(f"\nNormative Rule Violations & Legal Citations ({len(result['rule_violations'])}):")
        for idx, v in enumerate(result["rule_violations"], 1):
            print(f" [{idx}] {v['rule_id']}: {v['rule_name']} (Severity: {v['severity']})")
            print(f"     Description: {v['description']}")
            print(f"     Legal Source: {v['source']}")
            print(f"     Observed: {v['observed_value']} | Expected: {v['expected_value']}")

    if result["red_flags"]:
        print(f"\nActive Red Flags ({len(result['red_flags'])}):")
        for flag in result["red_flags"]:
            print(f" [!] {flag}")

    print(f"\nTop Explanatory Risk Factors:")
    for idx, f in enumerate(result["top_risk_factors"][:5], 1):
        print(f" {idx}. {f['feature']} (Impact: {f['impact']:.2f}, {f.get('direction', '')})")

    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Predict MPLADS project risk score and signals.")
    parser.add_argument("--project-id", type=str, default="MPLADS-000001", help="Project ID to evaluate")
    args = parser.parse_args()
    predict_project(project_id=args.project_id)
