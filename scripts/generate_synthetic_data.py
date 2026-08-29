"""
scripts/generate_synthetic_data.py
Relational Synthetic MPLADS Dataset Generator with Latent Scenarios and Hard Negatives.
Generates normalized relational tables connected via stable foreign keys.
"""
from __future__ import annotations
import argparse
import json
import os
import sys
from datetime import date, datetime, timedelta
import numpy as np
import pandas as pd
from faker import Faker

# Add project root to sys.path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)


def generate_relational_data(num_projects: int = 10000, seed: int = 42, output_dir: str = "data/synthetic/relational"):
    print("=" * 60)
    print(f"[SYNTHETIC DATA GENERATOR] Generating {num_projects:,} Relational Projects (Seed: {seed})")
    print(f"Output Directory: {output_dir}")
    print("=" * 60)

    np.random.seed(seed)
    fake = Faker("en_IN")
    Faker.seed(seed)
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs("data", exist_ok=True)

    # 1. State & District Master (619 Districts across 18 States/UTs)
    STATES = [
        "Uttar Pradesh", "Maharashtra", "Bihar", "West Bengal", "Madhya Pradesh",
        "Tamil Nadu", "Rajasthan", "Karnataka", "Gujarat", "Andhra Pradesh",
        "Odisha", "Telangana", "Kerala", "Jharkhand", "Assam", "Punjab",
        "Haryana", "Chhattisgarh"
    ]
    districts = []
    for s_idx, state in enumerate(STATES):
        dist_count = 34 if s_idx < 4 else 25
        for d in range(dist_count):
            d_id = f"DIST-{len(districts)+1:03d}"
            districts.append({
                "district_id": d_id,
                "district_name": f"{state} District {d+1}",
                "state_id": f"ST-{s_idx+1:02d}",
                "state_name": state,
                "district_latitude": round(8.0 + np.random.rand() * 24.0, 4),
                "district_longitude": round(68.0 + np.random.rand() * 28.0, 4),
                "population": int(np.random.lognormal(mean=14.2, sigma=0.5)),
                "population_density": round(float(np.random.uniform(200, 1500)), 1),
                "literacy_rate": round(float(np.random.uniform(62.0, 94.0)), 1),
                "poverty_rate": round(float(np.random.uniform(8.0, 38.0)), 1),
                "infrastructure_gap_index": round(float(np.random.uniform(0.15, 0.85)), 3),
            })
    df_geography = pd.DataFrame(districts)

    # 2. Contractors Master (2,500 Contractors)
    num_contractors = min(2500, max(500, num_projects // 4))
    contractors = []
    for c in range(num_contractors):
        c_id = f"CONT-{c+1:05d}"
        contractors.append({
            "contractor_id": c_id,
            "contractor_name": f"{fake.last_name()} {np.random.choice(['Infra', 'Constructions', 'Enterprises', 'Projects'])} Ltd",
            "gstin": f"{np.random.randint(10, 36):02d}AAAAA{np.random.randint(1000, 9999)}1Z{np.random.randint(1, 9)}",
            "primary_district_id": np.random.choice(df_geography["district_id"]),
            "contractor_past_irregularity_rate": round(float(np.random.beta(0.5, 10.0)), 4),
            "contractor_capacity_strain": round(float(np.random.beta(2.0, 5.0)), 3),
            "contractor_total_projects": 0,
        })
    df_contractors = pd.DataFrame(contractors)

    # 3. Implementing Agencies Master (800 Agencies)
    num_agencies = min(800, max(200, num_projects // 12))
    agencies = []
    for a in range(num_agencies):
        a_id = f"AGY-{a+1:04d}"
        dist = np.random.choice(df_geography["district_id"])
        agencies.append({
            "agency_id": a_id,
            "agency_name": f"{np.random.choice(['DRDA', 'PWD Division', 'Zilla Parishad', 'Rural Engineering Dept'])} {dist}",
            "district_id": dist,
            "agency_workload_ratio": round(float(np.random.uniform(0.4, 1.6)), 2),
            "agency_completion_rate": round(float(np.random.uniform(65.0, 96.0)), 1),
        })
    df_agencies = pd.DataFrame(agencies)

    # 4. Projects Generation & Scenario Engine
    WORK_TYPES = [
        ("community_hall", 2500000), ("rural_road_km", 1800000), ("solar_water_plant", 450000),
        ("school_additional_classroom", 900000), ("public_toilet_block", 500000),
        ("primary_health_subcentre", 2800000), ("high_mast_light", 220000),
        ("drinking_water_pipeline", 1200000), ("anganwadi_centre", 750000),
        ("flood_protection_bund", 3500000)
    ]
    CATEGORIES = ["PUBLIC_HEALTH", "EDUCATION", "ROADS_BRIDGES", "DRINKING_WATER", "SANITATION", "COMMUNITY_INFRASTRUCTURE"]
    SCENARIOS = [
        "LEGITIMATE", "HIGH_VALUE_LEGITIMATE", "COST_OVERRUN", "PAYMENT_PROGRESS_MISMATCH",
        "DELAYED_PROJECT", "ABANDONED_PROJECT", "DUPLICATE_PROJECT", "GHOST_WORK",
        "SUSPICIOUS_CONTRACTOR", "CONTRACTOR_MONOPOLY", "SUSPICIOUS_PROCUREMENT", "DOCUMENTATION_ANOMALY"
    ]
    SCENARIO_PROBS = [0.65, 0.13, 0.04, 0.04, 0.03, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01]

    projects = []
    financials = []
    payments = []
    progress_records = []
    procurement_records = []
    contracts_records = []
    documents = []
    labels = []

    start_anchor = date(2022, 1, 1)

    for i in range(num_projects):
        p_id = f"MPLADS-{i+1:06d}"
        dist_row = df_geography.iloc[i % len(df_geography)]
        w_type, base_cost = WORK_TYPES[np.random.choice(len(WORK_TYPES))]
        cat = np.random.choice(CATEGORIES)
        scenario = np.random.choice(SCENARIOS, p=SCENARIO_PROBS)

        sanction_dt = start_anchor + timedelta(days=int(np.random.randint(0, 750)))
        rec_dt = sanction_dt - timedelta(days=int(np.random.randint(15, 60)))
        planned_dur = int(np.random.choice([180, 270, 365]))
        target_comp_dt = sanction_dt + timedelta(days=planned_dur)

        # Baseline Financials
        is_high_val = (scenario == "HIGH_VALUE_LEGITIMATE")
        mult = np.random.uniform(2.5, 4.0) if is_high_val else np.random.uniform(0.85, 1.15)
        sanction_amt = round(float(base_cost * mult), 2)
        est_cost = round(float(sanction_amt * np.random.uniform(0.95, 1.05)), 2)
        exp_amt = round(float(sanction_amt * np.random.uniform(0.60, 1.0)), 2)

        phys_prog = float(np.random.uniform(40.0, 100.0))
        fin_prog = (exp_amt / sanction_amt) * 100.0
        bid_cnt = int(np.random.choice([3, 4, 5, 6]))
        single_bid = 0
        missing_mb = 0
        missing_uc = 0
        missing_geotag = 0
        delay_days = 0
        status = "COMPLETED" if phys_prog >= 95.0 else "IN_PROGRESS"

        # Apply Latent Scenario Mutations & Hard Negatives
        fraud_label = 0
        risk_level = "LOW"
        anom_type = "NONE"

        if scenario == "LEGITIMATE":
            fraud_label = 0
            risk_level = "LOW"
            anom_type = "NONE"
            fin_prog = phys_prog + float(np.random.normal(0, 3.0))

        elif scenario == "HIGH_VALUE_LEGITIMATE":
            # Hard negative: high sanction amount but fully documented and legitimate
            fraud_label = 0
            risk_level = "LOW" if phys_prog > 70.0 else "MEDIUM"
            anom_type = "NONE"

        elif scenario == "COST_OVERRUN":
            fraud_label = 1
            risk_level = "HIGH"
            anom_type = "COST"
            exp_amt = round(sanction_amt * float(np.random.uniform(1.22, 1.45)), 2)
            fin_prog = (exp_amt / sanction_amt) * 100.0

        elif scenario == "PAYMENT_PROGRESS_MISMATCH":
            fraud_label = 1
            risk_level = "CRITICAL"
            anom_type = "PROGRESS"
            fin_prog = 94.0
            phys_prog = 36.0
            exp_amt = round(sanction_amt * 0.94, 2)

        elif scenario == "DELAYED_PROJECT":
            fraud_label = 1
            risk_level = "MEDIUM"
            anom_type = "TIMELINE"
            delay_days = int(np.random.randint(180, 420))
            status = "DELAYED"

        elif scenario == "GHOST_WORK":
            fraud_label = 1
            risk_level = "CRITICAL"
            anom_type = "GHOST_WORK"
            fin_prog = 100.0
            phys_prog = 0.0
            exp_amt = sanction_amt
            missing_mb = 1
            missing_geotag = 1
            status = "COMPLETED"

        elif scenario == "SUSPICIOUS_PROCUREMENT":
            fraud_label = 1
            risk_level = "HIGH"
            anom_type = "PROCUREMENT"
            single_bid = 1
            bid_cnt = 1

        elif scenario == "CONTRACTOR_MONOPOLY":
            fraud_label = 1
            risk_level = "HIGH"
            anom_type = "CONTRACTOR"
            single_bid = 1
            bid_cnt = 1

        elif scenario == "DOCUMENTATION_ANOMALY":
            fraud_label = 1
            risk_level = "HIGH"
            anom_type = "DOCUMENTATION"
            missing_mb = 1
            missing_uc = 1

        elif scenario in ["ABANDONED_PROJECT", "DUPLICATE_PROJECT", "SUSPICIOUS_CONTRACTOR"]:
            fraud_label = 1
            risk_level = "HIGH"
            anom_type = scenario

        c_idx = np.random.randint(0, len(df_contractors))
        a_idx = np.random.randint(0, len(df_agencies))
        c_id = df_contractors.iloc[c_idx]["contractor_id"]
        a_id = df_agencies.iloc[a_idx]["agency_id"]

        # Save Entity Records
        projects.append({
            "project_id": p_id,
            "work_name": f"{w_type.replace('_', ' ').title()} at {dist_row['district_name']}",
            "work_type": w_type,
            "category": cat,
            "district_id": dist_row["district_id"],
            "state_id": dist_row["state_id"],
            "constituency_id": f"CONST-{dist_row['district_id']}",
            "contractor_id": c_id,
            "agency_id": a_id,
            "recommendation_date": rec_dt.isoformat(),
            "sanction_date": sanction_dt.isoformat(),
            "target_completion_date": target_comp_dt.isoformat(),
            "status": status,
            "project_latitude": dist_row["district_latitude"] + float(np.random.normal(0, 0.04)),
            "project_longitude": dist_row["district_longitude"] + float(np.random.normal(0, 0.04)),
        })

        financials.append({
            "project_id": p_id,
            "sanctioned_amount": sanction_amt,
            "estimated_cost": est_cost,
            "actual_expenditure": exp_amt,
            "unspent_balance": max(0.0, sanction_amt - exp_amt),
            "utilization_ratio": round(exp_amt / max(1.0, sanction_amt), 4),
        })

        progress_records.append({
            "project_id": p_id,
            "physical_progress": round(min(100.0, max(0.0, phys_prog)), 1),
            "financial_progress": round(min(140.0, max(0.0, fin_prog)), 1),
            "financial_physical_gap": round(fin_prog - phys_prog, 1),
            "delay_days": delay_days,
            "extension_count": 1 if delay_days > 90 else 0,
        })

        procurement_records.append({
            "project_id": p_id,
            "tender_id": f"TND-{i+1:06d}",
            "procurement_channel": "GEM" if np.random.rand() > 0.4 else "STATE_TENDER",
            "bid_count": bid_cnt,
            "single_bid_flag": single_bid,
            "winning_bid_deviation": round(float(np.random.uniform(-0.04, 0.08)), 4),
        })

        contracts_records.append({
            "project_id": p_id,
            "contract_id": f"CNT-{i+1:06d}",
            "work_order_amount": sanction_amt,
            "cost_variation_ratio": round(exp_amt / max(1.0, sanction_amt), 4),
        })

        documents.append({
            "project_id": p_id,
            "missing_mb_flag": missing_mb,
            "missing_uc_flag": missing_uc,
            "missing_geotag_flag": missing_geotag,
            "missing_completion_cert_flag": 1 if (status == "COMPLETED" and phys_prog < 90.0) else 0,
            "required_document_count": 5,
            "available_document_count": 5 - (missing_mb + missing_uc + missing_geotag),
        })

        labels.append({
            "project_id": p_id,
            "scenario_type": scenario,
            "fraud_label": fraud_label,
            "risk_level": risk_level,
            "anomaly_type": anom_type,
            "investigation_priority": "URGENT" if risk_level == "CRITICAL" else ("HIGH" if risk_level == "HIGH" else "LOW"),
        })

        # Generate 1 to 4 payment vouchers per project
        num_vouchers = max(1, int(np.random.choice([1, 2, 3, 4])))
        voucher_amt = exp_amt / num_vouchers
        for v in range(num_vouchers):
            payments.append({
                "payment_id": f"PAY-{len(payments)+1:07d}",
                "project_id": p_id,
                "contractor_id": c_id,
                "installment_number": v + 1,
                "payment_amount": round(voucher_amt, 2),
                "payment_date": (sanction_dt + timedelta(days=int(np.random.randint(15, 300)))).isoformat(),
            })

    # Save Tables as Parquet & CSV
    df_p = pd.DataFrame(projects)
    df_f = pd.DataFrame(financials)
    df_pr = pd.DataFrame(progress_records)
    df_pc = pd.DataFrame(procurement_records)
    df_cn = pd.DataFrame(contracts_records)
    df_d = pd.DataFrame(documents)
    df_l = pd.DataFrame(labels)
    df_pay = pd.DataFrame(payments)

    for name, df in [
        ("01_projects", df_p), ("02_financials", df_f), ("03_payments", df_pay),
        ("04_progress", df_pr), ("05_procurement", df_pc), ("06_contracts", df_cn),
        ("07_contractors", df_contractors), ("08_agencies", df_agencies),
        ("09_geography", df_geography), ("11_documents", df_d), ("12_labels", df_l)
    ]:
        df.to_parquet(os.path.join(output_dir, f"{name}.parquet"), index=False)
        df.to_csv(os.path.join(output_dir, f"{name}.csv"), index=False)

    # Save Dataset Metadata
    meta = {
        "dataset_version": "v2.4-relational-extended",
        "generation_timestamp": datetime.now().isoformat(),
        "random_seed": seed,
        "number_of_projects": len(df_p),
        "number_of_contractors": len(df_contractors),
        "number_of_agencies": len(df_agencies),
        "number_of_payments": len(df_pay),
        "fraud_rate": round(float(df_l["fraud_label"].mean()), 4),
        "risk_distribution": df_l["risk_level"].value_counts().to_dict(),
        "generator_version": "2.4.0",
    }
    with open("data/dataset_metadata.json", "w") as f:
        json.dump(meta, f, indent=2)

    print(" [OK] Relational Tables Generated Successfully:")
    print(f"      - Projects:    {len(df_p):,}")
    print(f"      - Payments:    {len(df_pay):,}")
    print(f"      - Contractors: {len(df_contractors):,}")
    print(f"      - Agencies:    {len(df_agencies):,}")
    print(f"      - Fraud Rate:  {meta['fraud_rate']*100:.1f}%")
    print(f"      - Metadata:    data/dataset_metadata.json")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Relational Synthetic MPLADS Dataset")
    parser.add_argument("--projects", type=int, default=10000, help="Total projects to generate")
    parser.add_argument("--seed", type=int, default=42, help="Reproducibility random seed")
    parser.add_argument("--output", type=str, default="data/synthetic/relational", help="Output directory")
    args = parser.parse_args()

    generate_relational_data(num_projects=args.projects, seed=args.seed, output_dir=args.output)
