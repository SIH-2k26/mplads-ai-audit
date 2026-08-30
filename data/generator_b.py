"""
data/generator_b.py
Independent Synthetic Generator B (External Holdout & OOD Validation) for Sanchay AI.
Generates an independent external test benchmark with orthogonal fraud and anomaly mechanisms:
1. Contractor Collusion & Cartel Rotation Rings
2. Documentation Masking & False Certification
3. Temporal Inconsistency & Rapid Tranche Draining
4. Split Tendering & Work Fragmentation
"""
from __future__ import annotations
import json
import os
import random
from typing import Any, Dict, List
import numpy as np
import pandas as pd
from faker import Faker


def generate_external_holdout_dataset(
    num_projects: int = 3000,
    seed: int = 999,
    fraud_rate: float = 0.20,
    output_dir: str = "data/synthetic/external_holdout",
) -> Dict[str, pd.DataFrame]:
    print("=" * 60)
    print(f"[GENERATOR B — INDEPENDENT VALIDATION] Generating {num_projects:,} Projects (Seed: {seed})")
    print(f"Independent Mechanisms: Collusion Rings, Tranche Draining, Split Tendering, Doc Masking")
    print(f"Output Directory: {output_dir}")
    print("=" * 60)

    random.seed(seed)
    np.random.seed(seed)
    fake = Faker("en_IN")
    Faker.seed(seed)
    os.makedirs(output_dir, exist_ok=True)

    # 1. Geographic Entities (Districts & Constituencies)
    districts = []
    for d in range(1, 41):
        districts.append({
            "district_id": f"DIST-EXT-{d:03d}",
            "district_name": f"Holdout District {d}",
            "population": int(np.random.uniform(800000, 2500000)),
            "population_density": round(float(np.random.uniform(300, 1200)), 1),
            "literacy_rate": round(float(np.random.uniform(65.0, 90.0)), 1),
            "poverty_rate": round(float(np.random.uniform(10.0, 35.0)), 1),
            "infrastructure_gap_index": round(float(np.random.uniform(0.2, 0.8)), 3),
        })
    df_geo = pd.DataFrame(districts)

    # 2. Contractor Master with Cartel Sub-Clusters
    contractors = []
    for c in range(1, 81):
        is_cartel_member = 1 if c <= 15 else 0
        contractors.append({
            "contractor_id": f"CONT-EXT-{c:04d}",
            "name": fake.company(),
            "is_cartel_member": is_cartel_member,
            "past_irregularity_rate": round(float(np.random.uniform(0.15, 0.40) if is_cartel_member else np.random.uniform(0.01, 0.08)), 3),
            "capacity_strain": round(float(np.random.uniform(1.4, 2.5) if is_cartel_member else np.random.uniform(0.8, 1.2)), 2),
            "win_rate": round(float(np.random.uniform(0.50, 0.85) if is_cartel_member else np.random.uniform(0.20, 0.40)), 2),
        })
    df_cont = pd.DataFrame(contractors)

    # 3. Generate Project Records & Orthogonal Fraud Archetypes
    projects = []
    financials = []
    progress = []
    procurement = []
    contracts = []
    documents = []
    labels = []
    payments_list = []

    categories = [
        "Roads & Bridges", "Drinking Water", "Education Infrastructure",
        "Public Health", "Community Infrastructure", "Renewable Energy"
    ]

    for i in range(1, num_projects + 1):
        p_id = f"MPLADS-EXT-{i:05d}"
        cat = random.choice(categories)
        dist = random.choice(districts)
        cont = random.choice(contractors)

        sanction = float(np.random.choice([1000000, 1500000, 2500000, 3500000, 5000000]))
        estimate = sanction * float(np.random.uniform(0.92, 0.98))
        tender = sanction * float(np.random.uniform(0.90, 0.97))
        planned_days = int(np.random.choice([90, 120, 180, 240, 365]))

        # Determine if this project exhibits an independent fraud mechanism
        is_fraud = 1 if (random.random() < fraud_rate) else 0
        fraud_mechanism = "NONE"

        if is_fraud:
            mech_choice = random.choice(["CARTEL_ROTATION", "TRANCHE_DRAIN", "SPLIT_TENDER", "DOC_MASKING"])
            fraud_mechanism = mech_choice

            if mech_choice == "CARTEL_ROTATION":
                # Single-bid award to cartel contractor with high capacity strain
                bid_count = 1
                single_bid_flag = 1
                cont = random.choice([c for c in contractors if c["is_cartel_member"] == 1])
                actual_exp = sanction * float(np.random.uniform(0.98, 1.15))
                phys_prog = float(np.random.uniform(20.0, 50.0))
                fin_prog = float(np.random.uniform(85.0, 100.0))
                missing_mb = 0
                missing_uc = 1
                missing_geotag = 1
                actual_days = int(planned_days * np.random.uniform(1.3, 2.0))

            elif mech_choice == "TRANCHE_DRAIN":
                # 90%+ funds disbursed with minimal progress and rapid payment velocity
                bid_count = random.choice([2, 3])
                single_bid_flag = 0
                actual_exp = sanction * float(np.random.uniform(0.90, 1.05))
                phys_prog = float(np.random.uniform(10.0, 35.0))
                fin_prog = float(np.random.uniform(90.0, 110.0))
                missing_mb = 1
                missing_uc = 1
                missing_geotag = 1
                actual_days = int(planned_days * 0.4)  # paid way too fast

            elif mech_choice == "SPLIT_TENDER":
                # Work split under statutory threshold, low bid count, high cost
                bid_count = 1
                single_bid_flag = 1
                actual_exp = sanction * float(np.random.uniform(1.10, 1.30))
                phys_prog = float(np.random.uniform(40.0, 70.0))
                fin_prog = float(np.random.uniform(95.0, 120.0))
                missing_mb = 1
                missing_uc = 0
                missing_geotag = 0
                actual_days = int(planned_days * 1.5)

            else:  # DOC_MASKING
                # False completion reported but Measurement Book and Geotag missing
                bid_count = random.choice([2, 4])
                single_bid_flag = 0
                actual_exp = sanction * 1.0
                phys_prog = float(np.random.uniform(90.0, 100.0))
                fin_prog = 100.0
                missing_mb = 1
                missing_uc = 1
                missing_geotag = 1
                actual_days = planned_days

        else:
            # Genuine compliant or benign delayed work
            is_delayed = 1 if (random.random() < 0.25) else 0
            bid_count = int(np.random.choice([3, 4, 5, 6]))
            single_bid_flag = 0
            phys_prog = float(np.random.uniform(75.0, 100.0))
            fin_prog = phys_prog + float(np.random.uniform(-5.0, 8.0))
            actual_exp = sanction * (fin_prog / 100.0)
            missing_mb = 0
            missing_uc = 0
            missing_geotag = 0
            actual_days = int(planned_days * (1.25 if is_delayed else 0.95))

        # Build records
        projects.append({
            "project_id": p_id,
            "title": f"MPLADS {cat} Project {i}",
            "category": cat,
            "state_id": "ST-EXT-01",
            "district_id": dist["district_id"],
            "constituency_id": "CONST-EXT-01",
            "sanctioned_amount": sanction,
            "estimated_cost": estimate,
            "contractor_id": cont["contractor_id"],
            "agency_id": "AGENCY-EXT-01",
            "sanction_date": "2024-01-15",
            "work_order_date": "2024-02-10",
        })

        financials.append({
            "project_id": p_id,
            "actual_expenditure": actual_exp,
            "released_amount": sanction,
            "unspent_balance": max(0.0, sanction - actual_exp),
            "financial_progress": fin_prog,
        })

        progress.append({
            "project_id": p_id,
            "physical_progress": phys_prog,
            "planned_duration_days": planned_days,
            "actual_duration_days": actual_days,
            "delay_days": max(0, actual_days - planned_days),
        })

        procurement.append({
            "project_id": p_id,
            "bid_count": bid_count,
            "single_bid_flag": single_bid_flag,
            "work_order_amount": tender,
            "extension_count": 0,
        })

        contracts.append({
            "project_id": p_id,
            "contractor_id": cont["contractor_id"],
            "work_order_amount": tender,
        })

        documents.append({
            "project_id": p_id,
            "missing_mb_flag": missing_mb,
            "missing_uc_flag": missing_uc,
            "missing_completion_cert_flag": 0,
            "missing_geotag_flag": missing_geotag,
        })

        # Synthetic payments
        pay_count = 3 if actual_exp > 0 else 0
        for p_idx in range(pay_count):
            payments_list.append({
                "project_id": p_id,
                "payment_amount": actual_exp / max(1, pay_count),
                "payment_date": f"2024-03-{10 + p_idx*15:02d}",
            })

        risk_score = 88.0 if is_fraud else (45.0 if actual_days > planned_days else 22.0)
        labels.append({
            "project_id": p_id,
            "fraud_label": is_fraud,
            "overall_risk_score": risk_score,
            "risk_level": "CRITICAL" if is_fraud else ("MEDIUM" if actual_days > planned_days else "LOW"),
            "scenario_type": fraud_mechanism,
            "scenario_name": fraud_mechanism,
            "investigation_priority": "URGENT" if is_fraud else "ROUTINE",
        })

    # Save to parquet
    df_p = pd.DataFrame(projects)
    df_f = pd.DataFrame(financials)
    df_pr = pd.DataFrame(progress)
    df_pc = pd.DataFrame(procurement)
    df_cn = pd.DataFrame(contracts)
    df_d = pd.DataFrame(documents)
    df_l = pd.DataFrame(labels)
    df_pay = pd.DataFrame(payments_list)

    df_p.to_parquet(os.path.join(output_dir, "01_projects.parquet"), index=False)
    df_f.to_parquet(os.path.join(output_dir, "02_financials.parquet"), index=False)
    df_pay.to_parquet(os.path.join(output_dir, "03_payments.parquet"), index=False)
    df_pr.to_parquet(os.path.join(output_dir, "04_progress.parquet"), index=False)
    df_pc.to_parquet(os.path.join(output_dir, "05_procurement.parquet"), index=False)
    df_cn.to_parquet(os.path.join(output_dir, "06_contracts.parquet"), index=False)
    df_cont.to_parquet(os.path.join(output_dir, "07_contractors.parquet"), index=False)
    df_geo.to_parquet(os.path.join(output_dir, "09_geography.parquet"), index=False)
    df_d.to_parquet(os.path.join(output_dir, "11_documents.parquet"), index=False)
    df_l.to_parquet(os.path.join(output_dir, "12_labels.parquet"), index=False)

    print(f" [OK] Generator B Holdout Dataset Generated: {len(df_p):,} projects")
    return {"projects": df_p, "labels": df_l}


if __name__ == "__main__":
    generate_external_holdout_dataset()
