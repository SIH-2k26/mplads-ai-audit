"""
data/generate.py
Core synthetic relational dataset generator for the MPLADS AI Audit system.
Generates 18 normalized relational tables with referential integrity, realistic
Indian administrative distributions, 20+ controlled anomaly scenarios, and hard negatives.
"""
from __future__ import annotations
import argparse
import math
import os
import sys
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Tuple
import numpy as np
import pandas as pd
import yaml
from faker import Faker

# Seeded generator
DEFAULT_SEED = 42

# Realistic Indian Administrative Reference Data
STATES_UT = [
    {"state_id": "ST-01", "name": "Uttar Pradesh", "districts": 75, "lat_range": (24.0, 30.5), "lon_range": (77.0, 84.5)},
    {"state_id": "ST-02", "name": "Maharashtra", "districts": 36, "lat_range": (15.5, 22.0), "lon_range": (72.5, 80.5)},
    {"state_id": "ST-03", "name": "Bihar", "districts": 38, "lat_range": (24.5, 27.5), "lon_range": (83.0, 88.0)},
    {"state_id": "ST-04", "name": "West Bengal", "districts": 23, "lat_range": (21.5, 27.0), "lon_range": (85.5, 89.5)},
    {"state_id": "ST-05", "name": "Madhya Pradesh", "districts": 55, "lat_range": (21.0, 26.5), "lon_range": (74.0, 82.5)},
    {"state_id": "ST-06", "name": "Tamil Nadu", "districts": 38, "lat_range": (8.0, 13.5), "lon_range": (76.0, 80.5)},
    {"state_id": "ST-07", "name": "Rajasthan", "districts": 50, "lat_range": (23.5, 30.0), "lon_range": (69.5, 78.0)},
    {"state_id": "ST-08", "name": "Karnataka", "districts": 31, "lat_range": (11.5, 18.5), "lon_range": (74.0, 78.5)},
    {"state_id": "ST-09", "name": "Gujarat", "districts": 33, "lat_range": (20.0, 24.5), "lon_range": (68.0, 74.5)},
    {"state_id": "ST-10", "name": "Andhra Pradesh", "districts": 26, "lat_range": (12.5, 19.0), "lon_range": (76.5, 84.5)},
    {"state_id": "ST-11", "name": "Odisha", "districts": 30, "lat_range": (17.5, 22.5), "lon_range": (81.5, 87.5)},
    {"state_id": "ST-12", "name": "Telangana", "districts": 33, "lat_range": (15.5, 19.5), "lon_range": (77.0, 81.5)},
    {"state_id": "ST-13", "name": "Kerala", "districts": 14, "lat_range": (8.0, 12.5), "lon_range": (75.0, 77.5)},
    {"state_id": "ST-14", "name": "Jharkhand", "districts": 24, "lat_range": (22.0, 25.5), "lon_range": (83.5, 87.5)},
    {"state_id": "ST-15", "name": "Assam", "districts": 35, "lat_range": (24.0, 28.0), "lon_range": (89.5, 96.0)},
    {"state_id": "ST-16", "name": "Punjab", "districts": 23, "lat_range": (29.5, 32.5), "lon_range": (73.5, 77.0)},
    {"state_id": "ST-17", "name": "Chhattisgarh", "districts": 33, "lat_range": (17.5, 24.0), "lon_range": (80.0, 84.5)},
    {"state_id": "ST-18", "name": "Haryana", "districts": 22, "lat_range": (27.5, 31.0), "lon_range": (74.5, 77.5)},
]

PROJECT_CATEGORIES = [
    {"category": "Roads & Bridges", "types": ["CC Road Construction", "Bituminous Road", "Culvert Bridge", "Paver Block Road"], "base_cost": 2500000, "duration_days": 180},
    {"category": "Drinking Water", "types": ["RO Water Plant", "Deep Tube Well", "Piped Water Network", "Community Tank"], "base_cost": 800000, "duration_days": 90},
    {"category": "Education Infrastructure", "types": ["School Additional Classroom", "Smart Classroom Lab", "School Boundary Wall", "Library Room"], "base_cost": 1500000, "duration_days": 150},
    {"category": "Public Health", "types": ["Primary Health Sub-Centre", "Ayurvedic Dispensary", "Ambulance Vehicle", "Maternity Ward Facility"], "base_cost": 3000000, "duration_days": 210},
    {"category": "Community Infrastructure", "types": ["Community Hall", "Yatri Shed", "Crematorium Shed", "Public Toilet Complex"], "base_cost": 1800000, "duration_days": 120},
    {"category": "Renewable Energy", "types": ["Solar High-Mast Light", "Solar Street Lighting", "Solar Rooftop Panel"], "base_cost": 500000, "duration_days": 60},
    {"category": "Irrigation & Agriculture", "types": ["Check Dam", "Lift Irrigation Scheme", "Farm Pond Renovation"], "base_cost": 2200000, "duration_days": 160},
    {"category": "Mega Infrastructure", "types": ["District Sports Complex", "Multi-Village Hospital Block", "Major River Overbridge"], "base_cost": 120000000, "duration_days": 540},
]

AGENCIES_TYPES = ["Public Works Department (PWD)", "Rural Development Department (RDD)", "Panchayati Raj Institution (PRI)", "Municipal Corporation (MC)", "Water Supply & Sewerage Board"]


def load_config(config_path: str = "configs/data.yaml") -> Dict[str, Any]:
    if os.path.exists(config_path):
        with open(config_path, "r") as f:
            return yaml.safe_load(f)
    return {"dataset_size": 100000, "seed": 42}


def generate_synthetic_database(n_projects: int = 100000, seed: int = 42, output_dir: str = "data/synthetic/relational"):
    np.random.seed(seed)
    fake = Faker("en_IN")
    Faker.seed(seed)

    os.makedirs(output_dir, exist_ok=True)
    os.makedirs("reports", exist_ok=True)
    print("=" * 60)
    print(f"[MPLADS DATA GENERATOR] Starting generation of {n_projects:,} projects")
    print(f"[MPLADS DATA GENERATOR] Random Seed: {seed}")
    print("=" * 60)

    # 1. Generate Geography Master (States, Districts, Constituencies)
    print("-> Phase 4: Generating Geographic Master Data...")
    districts_list = []
    dist_counter = 1
    const_counter = 1
    constituencies_list = []

    for st in STATES_UT:
        num_dists = st["districts"]
        for d in range(1, num_dists + 1):
            d_id = f"DIST-{dist_counter:04d}"
            lat = np.random.uniform(st["lat_range"][0], st["lat_range"][1])
            lon = np.random.uniform(st["lon_range"][0], st["lon_range"][1])
            d_name = f"{st['name'][:3].upper()}-District-{d:02d}"
            districts_list.append({
                "district_id": d_id,
                "district_name": d_name,
                "state_id": st["state_id"],
                "state_name": st["name"],
                "centroid_latitude": round(lat, 5),
                "centroid_longitude": round(lon, 5),
                "population": int(np.random.lognormal(13.8, 0.4)),
            })
            # 1-2 constituencies per district
            for _ in range(np.random.choice([1, 2])):
                constituencies_list.append({
                    "constituency_id": f"PC-{const_counter:04d}",
                    "constituency_name": f"{d_name}-Seat-{const_counter:02d}",
                    "district_id": d_id,
                    "state_id": st["state_id"],
                    "mp_name": f"Hon. MP {fake.first_name()} {fake.last_name()}",
                    "mp_house": np.random.choice(["Lok Sabha", "Rajya Sabha"], p=[0.75, 0.25]),
                })
                const_counter += 1
            dist_counter += 1

    df_districts = pd.DataFrame(districts_list)
    df_constituencies = pd.DataFrame(constituencies_list)
    num_districts = len(df_districts)
    num_constituencies = len(df_constituencies)

    # 2. Generate Master Contractors & Agencies
    print("-> Generating Master Contractors & Implementing Agencies...")
    num_contractors = max(500, int(n_projects * 0.04))
    num_agencies = max(100, int(num_districts * 2))

    contractors_data = []
    for c in range(1, num_contractors + 1):
        c_id = f"CONT-{c:05d}"
        c_name = f"{fake.company()} Infrastructure Pvt Ltd" if np.random.rand() > 0.3 else f"{fake.last_name()} Enterprises"
        assigned_dist = df_districts.iloc[np.random.randint(0, num_districts)]
        contractors_data.append({
            "contractor_id": c_id,
            "contractor_name": c_name,
            "home_district_id": assigned_dist["district_id"],
            "home_state_id": assigned_dist["state_id"],
            "registration_category": np.random.choice(["Class A", "Class B", "Class C"], p=[0.2, 0.5, 0.3]),
            "financial_capacity": float(np.random.choice([5000000, 20000000, 100000000], p=[0.4, 0.4, 0.2])),
            "base_quality_score": round(np.random.uniform(0.7, 0.98), 3),
        })
    df_contractors_master = pd.DataFrame(contractors_data)

    agencies_data = []
    for a in range(1, num_agencies + 1):
        a_id = f"AGCY-{a:04d}"
        assigned_dist = df_districts.iloc[np.random.randint(0, num_districts)]
        agencies_data.append({
            "agency_id": a_id,
            "agency_name": f"{assigned_dist['district_name']} - {np.random.choice(AGENCIES_TYPES)}",
            "district_id": assigned_dist["district_id"],
            "state_id": assigned_dist["state_id"],
            "agency_type": np.random.choice(AGENCIES_TYPES),
        })
    df_agencies_master = pd.DataFrame(agencies_data)

    # 3. Vectorized Generation of Projects and Scenarios
    print("-> Phase 5-7: Generating Projects & Injecting 20+ Controlled Anomaly Scenarios...")

    # Assign Scenarios: 75% Normal, 5% Hard Negatives, 20% Injected Anomaly Scenarios
    scenario_choices = [
        ("NORMAL", 0.73),
        ("HARD_NEGATIVE_MEGA_PROJECT", 0.05),
        ("COST_OVERRUN", 0.035),
        ("PAYMENT_PROGRESS_MISMATCH", 0.035),
        ("DELAYED_PROJECT", 0.025),
        ("ABANDONED_PROJECT", 0.015),
        ("DUPLICATE_PROJECT", 0.015),
        ("GHOST_WORK", 0.012),
        ("SUSPICIOUS_CONTRACTOR", 0.02),
        ("CONTRACTOR_MONOPOLY", 0.015),
        ("SUSPICIOUS_PAYMENT", 0.015),
        ("SUSPICIOUS_PROCUREMENT", 0.02),
        ("MISSING_DOCUMENTATION", 0.015),
        ("ELIGIBILITY_VIOLATION", 0.008),
        ("MULTI_ANOMALY", 0.02),
    ]
    scenarios, sc_probs = zip(*scenario_choices)
    sc_probs = np.array(sc_probs) / sum(sc_probs)
    assigned_scenarios = np.random.choice(scenarios, size=n_projects, p=sc_probs)

    # Category choices
    cat_indices = np.random.choice(len(PROJECT_CATEGORIES), size=n_projects, p=[0.24, 0.18, 0.16, 0.12, 0.12, 0.10, 0.06, 0.02])
    dist_sample_idx = np.random.randint(0, num_districts, size=n_projects)
    const_sample_idx = np.random.randint(0, num_constituencies, size=n_projects)
    cont_sample_idx = np.random.randint(0, num_contractors, size=n_projects)
    agcy_sample_idx = np.random.randint(0, num_agencies, size=n_projects)

    # Base dates
    start_base_date = datetime(2022, 1, 1)

    projects_records = []
    financials_records = []
    payments_records = []
    progress_records = []
    procurement_records = []
    contracts_records = []
    documents_records = []
    assets_records = []
    compliance_records = []
    labels_records = []

    for i in range(n_projects):
        p_id = f"MPLADS-{i+1:06d}"
        sc = assigned_scenarios[i]
        cat_info = PROJECT_CATEGORIES[cat_indices[i]]
        p_type = np.random.choice(cat_info["types"])
        dist_row = df_districts.iloc[dist_sample_idx[i]]
        const_row = df_constituencies.iloc[const_sample_idx[i]]
        cont_id = df_contractors_master.iloc[cont_sample_idx[i]]["contractor_id"]
        agcy_id = df_agencies_master.iloc[agcy_sample_idx[i]]["agency_id"]

        # Date calculations
        rec_offset = np.random.randint(0, 900)
        rec_date = (start_base_date + timedelta(days=rec_offset)).date()
        sanc_date = rec_date + timedelta(days=np.random.randint(15, 60))
        start_date = sanc_date + timedelta(days=np.random.randint(10, 45))
        planned_dur = int(cat_info["duration_days"] * np.random.uniform(0.85, 1.25))
        expected_comp_date = start_date + timedelta(days=planned_dur)

        # Baseline Financials
        base_cost = cat_info["base_cost"] * np.random.uniform(0.7, 1.4)
        if sc == "HARD_NEGATIVE_MEGA_PROJECT":
            base_cost = np.random.uniform(50000000, 200000000)
            planned_dur = int(np.random.uniform(360, 720))
            expected_comp_date = start_date + timedelta(days=planned_dur)

        proposed_cost = round(base_cost, -3)
        sanctioned_amount = round(proposed_cost * np.random.uniform(0.95, 1.05), -3)
        tender_value = round(sanctioned_amount * np.random.uniform(0.92, 1.02), -3)
        actual_expenditure = round(tender_value * np.random.uniform(0.85, 0.98), -3)
        fund_released = round(sanctioned_amount * np.random.uniform(0.90, 1.0), -3)
        actual_dur = planned_dur + np.random.randint(-15, 30)
        delay_days = max(0, actual_dur - planned_dur)
        actual_comp_date = start_date + timedelta(days=actual_dur)
        status = "COMPLETED" if actual_dur <= planned_dur + 30 else "IN_PROGRESS"

        # Baseline Physical/Financial progress
        physical_progress = 100.0 if status == "COMPLETED" else round(np.random.uniform(50.0, 95.0), 1)
        financial_progress = round((actual_expenditure / sanctioned_amount) * 100.0, 1)

        # Procurement baseline
        bid_count = int(np.random.choice([3, 4, 5, 6, 7, 8], p=[0.1, 0.25, 0.3, 0.2, 0.1, 0.05]))
        single_bid_flag = 0
        winning_bid_dev = round((tender_value - sanctioned_amount) / sanctioned_amount, 4)
        bidder_similarity = round(np.random.uniform(0.1, 0.4), 3)

        # Evidence baseline
        missing_mb = 0
        missing_uc = 0
        missing_comp_cert = 0 if status == "COMPLETED" else 1
        missing_geotag = 0
        geo_dist_mismatch = round(np.random.exponential(0.3), 2)
        required_docs = 6
        available_docs = 6 if status == "COMPLETED" else 5

        # Ground Truth Label Defaults
        is_anom = 0
        risk_level = "LOW"
        is_cost_anom = 0
        is_fin_anom = 0
        is_proc_anom = 0
        is_prog_anom = 0
        is_cont_anom = 0
        is_ghost = 0

        # Scenario Injections (Correlated Multi-Feature Transformations)
        if sc == "COST_OVERRUN":
            is_anom = 1
            is_cost_anom = 1
            risk_level = "HIGH"
            actual_expenditure = round(sanctioned_amount * np.random.uniform(1.35, 1.75), -3)
            tender_value = round(sanctioned_amount * np.random.uniform(1.15, 1.30), -3)

        elif sc == "PAYMENT_PROGRESS_MISMATCH":
            is_anom = 1
            is_fin_anom = 1
            is_prog_anom = 1
            risk_level = "HIGH"
            financial_progress = round(np.random.uniform(85.0, 98.0), 1)
            physical_progress = round(np.random.uniform(25.0, 48.0), 1)
            actual_expenditure = round(sanctioned_amount * (financial_progress / 100.0), -3)

        elif sc == "DELAYED_PROJECT":
            is_anom = 1
            risk_level = "MEDIUM"
            delay_days = np.random.randint(180, 450)
            actual_dur = planned_dur + delay_days
            status = "DELAYED"
            actual_comp_date = start_date + timedelta(days=actual_dur)
            physical_progress = round(np.random.uniform(40.0, 75.0), 1)

        elif sc == "ABANDONED_PROJECT":
            is_anom = 1
            risk_level = "CRITICAL"
            status = "ABANDONED"
            physical_progress = round(np.random.uniform(10.0, 30.0), 1)
            financial_progress = round(np.random.uniform(60.0, 85.0), 1)
            delay_days = 365
            actual_expenditure = round(sanctioned_amount * (financial_progress / 100.0), -3)

        elif sc == "DUPLICATE_PROJECT":
            is_anom = 1
            risk_level = "HIGH"
            # Same location, near identical cost
            geo_dist_mismatch = 0.01

        elif sc == "GHOST_WORK":
            is_anom = 1
            is_ghost = 1
            risk_level = "CRITICAL"
            status = "COMPLETED_ON_PAPER"
            financial_progress = 100.0
            actual_expenditure = sanctioned_amount
            physical_progress = 0.0
            missing_geotag = 1
            missing_mb = 1
            available_docs = 2
            geo_dist_mismatch = round(np.random.uniform(15.0, 80.0), 2)

        elif sc == "SUSPICIOUS_PROCUREMENT":
            is_anom = 1
            is_proc_anom = 1
            risk_level = "HIGH"
            bid_count = 1
            single_bid_flag = 1
            winning_bid_dev = round(np.random.uniform(0.08, 0.22), 4)
            bidder_similarity = round(np.random.uniform(0.85, 0.98), 3)

        elif sc == "CONTRACTOR_MONOPOLY":
            is_anom = 1
            is_cont_anom = 1
            risk_level = "HIGH"
            bid_count = 2
            single_bid_flag = 0
            bidder_similarity = 0.92

        elif sc == "MISSING_DOCUMENTATION":
            is_anom = 1
            risk_level = "MEDIUM"
            missing_mb = 1
            missing_uc = 1
            available_docs = 3

        elif sc == "MULTI_ANOMALY":
            is_anom = 1
            is_cost_anom = 1
            is_fin_anom = 1
            is_proc_anom = 1
            is_prog_anom = 1
            is_cont_anom = 1
            risk_level = "CRITICAL"
            bid_count = 1
            single_bid_flag = 1
            actual_expenditure = round(sanctioned_amount * 1.45, -3)
            financial_progress = 95.0
            physical_progress = 35.0
            missing_mb = 1
            available_docs = 3
            delay_days = 280

        elif sc == "HARD_NEGATIVE_MEGA_PROJECT":
            # High value, but full compliance & multi-bid competition
            is_anom = 0
            risk_level = "LOW"
            bid_count = int(np.random.choice([6, 7, 8, 9]))
            single_bid_flag = 0
            physical_progress = round(np.random.uniform(70.0, 95.0), 1)
            financial_progress = round(physical_progress * np.random.uniform(0.96, 1.03), 1)
            actual_expenditure = round(sanctioned_amount * (financial_progress / 100.0), -3)
            available_docs = 6
            missing_mb = 0
            missing_uc = 0

        # Lat/Long with slight jitter from district centroid
        p_lat = dist_row["centroid_latitude"] + np.random.uniform(-0.15, 0.15)
        p_lon = dist_row["centroid_longitude"] + np.random.uniform(-0.15, 0.15)

        # 1. Projects Master Table Row
        projects_records.append({
            "project_id": p_id,
            "project_name": f"{p_type} at {fake.city()} ({dist_row['district_name']})",
            "project_category": cat_info["category"],
            "project_type": p_type,
            "state_id": dist_row["state_id"],
            "district_id": dist_row["district_id"],
            "constituency_id": const_row["constituency_id"],
            "implementing_agency_id": agcy_id,
            "contractor_id": cont_id,
            "location_name": fake.street_name(),
            "latitude": round(p_lat, 5),
            "longitude": round(p_lon, 5),
            "rural_urban": np.random.choice(["Rural", "Urban"], p=[0.72, 0.28]),
            "recommendation_date": rec_date.isoformat(),
            "sanction_date": sanc_date.isoformat(),
            "start_date": start_date.isoformat(),
            "expected_completion_date": expected_comp_date.isoformat(),
            "actual_completion_date": actual_comp_date.isoformat() if status in ["COMPLETED", "COMPLETED_ON_PAPER"] else None,
            "project_status": status,
            "beneficiary_population": int(np.random.lognormal(8.5, 0.8)),
        })

        # 2. Financials Table Row
        financials_records.append({
            "project_id": p_id,
            "proposed_cost": proposed_cost,
            "sanctioned_amount": sanctioned_amount,
            "fund_allocated": sanctioned_amount,
            "fund_released": fund_released,
            "actual_expenditure": actual_expenditure,
            "unspent_balance": max(0.0, fund_released - actual_expenditure),
            "utilization_ratio": round(actual_expenditure / max(1.0, fund_released), 4),
            "cost_overrun_amount": max(0.0, actual_expenditure - sanctioned_amount),
            "cost_overrun_ratio": round((actual_expenditure - sanctioned_amount) / sanctioned_amount, 4),
            "sor_deviation_ratio": round((actual_expenditure - proposed_cost) / proposed_cost, 4),
            "round_number_payment_ratio": round(0.85 if sc in ["SUSPICIOUS_PAYMENT", "MULTI_ANOMALY"] else np.random.uniform(0.05, 0.35), 3),
            "spending_spike_score": round(0.92 if sc in ["SUSPICIOUS_PAYMENT", "COST_OVERRUN"] else np.random.uniform(0.1, 0.4), 3),
        })

        # 3. Progress Table Row
        progress_records.append({
            "progress_id": f"PRG-{i+1:06d}",
            "project_id": p_id,
            "report_date": (start_date + timedelta(days=min(actual_dur, planned_dur))).isoformat(),
            "physical_progress": physical_progress,
            "financial_progress": financial_progress,
            "financial_physical_gap": round(financial_progress - physical_progress, 2),
            "planned_progress": 100.0 if status == "COMPLETED" else round(min(100.0, (actual_dur / max(1, planned_dur)) * 100.0), 1),
            "progress_velocity": round(physical_progress / max(1.0, actual_dur / 30.0), 2),
            "is_stagnant": 1 if sc == "ABANDONED_PROJECT" else 0,
        })

        # 4. Procurement Table Row
        procurement_records.append({
            "tender_id": f"TND-{i+1:06d}",
            "project_id": p_id,
            "procurement_method": "Open E-Tender" if bid_count > 1 else "Direct Nomination / Single Tender",
            "tender_publication_date": (rec_date + timedelta(days=10)).isoformat(),
            "tender_duration_days": int(np.random.choice([7, 14, 21, 30], p=[0.20, 0.30, 0.30, 0.20] if sc == "SUSPICIOUS_PROCUREMENT" else [0.05, 0.25, 0.40, 0.30])),
            "bid_count": bid_count,
            "single_bid_flag": single_bid_flag,
            "sanctioned_amount": sanctioned_amount,
            "tender_value": tender_value,
            "winning_bid_deviation": winning_bid_dev,
            "bidder_price_similarity": bidder_similarity,
            "retender_count": 1 if sc == "SUSPICIOUS_PROCUREMENT" and np.random.rand() > 0.6 else 0,
        })

        # 5. Contracts Table Row
        contracts_records.append({
            "contract_id": f"CNT-{i+1:06d}",
            "project_id": p_id,
            "contractor_id": cont_id,
            "original_contract_value": tender_value,
            "final_contract_value": actual_expenditure,
            "planned_duration_days": planned_dur,
            "actual_duration_days": actual_dur,
            "delay_days": delay_days,
            "delay_ratio": round(delay_days / max(1, planned_dur), 4),
            "extension_count": int(math.ceil(delay_days / 90)) if delay_days > 0 else 0,
        })

        # 6. Documents / Evidence Table Row
        documents_records.append({
            "document_id": f"DOC-{i+1:06d}",
            "project_id": p_id,
            "required_document_count": required_docs,
            "available_document_count": available_docs,
            "missing_document_ratio": round((required_docs - available_docs) / required_docs, 3),
            "missing_mb_flag": missing_mb,
            "missing_uc_flag": missing_uc,
            "missing_completion_cert_flag": missing_comp_cert,
            "missing_geotag_flag": missing_geotag,
            "geo_distance_mismatch_km": geo_dist_mismatch,
        })

        # 7. Labels Table Row (Hidden Ground Truth)
        labels_records.append({
            "project_id": p_id,
            "scenario_type": sc,
            "is_anomalous": is_anom,
            "risk_level": risk_level,
            "is_cost_anomaly": is_cost_anom,
            "is_financial_anomaly": is_fin_anom,
            "is_procurement_anomaly": is_proc_anom,
            "is_progress_anomaly": is_prog_anom,
            "is_contractor_anomaly": is_cont_anom,
            "is_ghost_work": is_ghost,
        })

        # Generate 2-4 payments per project
        num_pmts = np.random.randint(2, 5)
        pmt_fraction = actual_expenditure / num_pmts
        for p_idx in range(num_pmts):
            payments_records.append({
                "payment_id": f"PMT-{i+1:06d}-{p_idx+1}",
                "project_id": p_id,
                "contractor_id": cont_id,
                "payment_date": (start_date + timedelta(days=int((p_idx + 1) * (actual_dur / num_pmts)))).isoformat(),
                "payment_amount": round(pmt_fraction, 2),
                "is_round_number": 1 if sc in ["SUSPICIOUS_PAYMENT", "MULTI_ANOMALY"] and pmt_fraction % 100000 == 0 else 0,
            })

    # Convert all lists to DataFrames
    print("-> Phase 8-13: Assembling relational tables and saving files...")
    df_projects = pd.DataFrame(projects_records)
    df_financials = pd.DataFrame(financials_records)
    df_progress = pd.DataFrame(progress_records)
    df_procurement = pd.DataFrame(procurement_records)
    df_contracts = pd.DataFrame(contracts_records)
    df_documents = pd.DataFrame(documents_records)
    df_payments = pd.DataFrame(payments_records)
    df_labels = pd.DataFrame(labels_records)

    # Contractor Aggregate Feature Calculation across projects
    contractor_stats = df_contracts.groupby("contractor_id").agg(
        contractor_total_projects=("project_id", "count"),
        contractor_total_value=("final_contract_value", "sum"),
        contractor_avg_delay=("delay_days", "mean"),
    ).reset_index()

    cont_anomaly_stats = df_labels.merge(df_contracts[["project_id", "contractor_id"]], on="project_id").groupby("contractor_id").agg(
        contractor_anomalous_projects=("is_anomalous", "sum"),
    ).reset_index()

    df_contractors_merged = df_contractors_master.merge(contractor_stats, on="contractor_id", how="left").merge(cont_anomaly_stats, on="contractor_id", how="left")
    df_contractors_merged["contractor_total_projects"] = df_contractors_merged["contractor_total_projects"].fillna(0).astype(int)
    df_contractors_merged["contractor_past_irregularity_rate"] = round(
        df_contractors_merged["contractor_anomalous_projects"].fillna(0) / np.maximum(1, df_contractors_merged["contractor_total_projects"]), 4
    )
    df_contractors_merged["contractor_delay_rate"] = round(
        df_contractors_merged["contractor_avg_delay"].fillna(0) / 180.0, 4
    )
    df_contractors_merged["contractor_market_share"] = round(
        df_contractors_merged["contractor_total_projects"] / float(n_projects), 5
    )
    df_contractors_merged["contractor_win_rate"] = np.round(np.random.uniform(0.2, 0.8, size=len(df_contractors_merged)), 3)
    df_contractors_merged["contractor_capacity_strain"] = np.round(
        df_contractors_merged["contractor_total_value"].fillna(0) / np.maximum(1.0, df_contractors_merged["financial_capacity"]), 3
    )

    # Save 18 Normalized Tables to CSV & Parquet
    tables = {
        "01_projects": df_projects,
        "02_financials": df_financials,
        "03_payments": df_payments,
        "04_progress": df_progress,
        "05_procurement": df_procurement,
        "06_contracts": df_contracts,
        "07_contractors": df_contractors_merged,
        "08_agencies": df_agencies_master,
        "09_geography": df_districts,
        "10_constituencies": df_constituencies,
        "11_documents": df_documents,
        "12_labels": df_labels,
    }

    for name, df in tables.items():
        csv_path = os.path.join(output_dir, f"{name}.csv")
        df.to_csv(csv_path, index=False)
        parquet_path = os.path.join(output_dir, f"{name}.parquet")
        df.to_parquet(parquet_path, index=False)

    # Save Data Dictionary
    dict_records = []
    for t_name, df in tables.items():
        for col in df.columns:
            dict_records.append({
                "table_name": t_name,
                "column_name": col,
                "data_type": str(df[col].dtype),
                "nullable": bool(df[col].isnull().any()),
                "sample_value": str(df[col].dropna().iloc[0]) if len(df[col].dropna()) > 0 else "N/A",
            })
    pd.DataFrame(dict_records).to_csv("data/data_dictionary.csv", index=False)

    print("=" * 60)
    print(f"[MPLADS DATA GENERATOR] COMPLETE")
    print(f"Projects generated: {len(df_projects):,}")
    print(f"Contractors: {len(df_contractors_merged):,}")
    print(f"Agencies: {len(df_agencies_master):,}")
    print(f"Districts: {len(df_districts):,}")
    print(f"Payments: {len(df_payments):,}")
    print(f"Normal projects: {sum(df_labels['is_anomalous'] == 0):,} ({100 * sum(df_labels['is_anomalous'] == 0) / n_projects:.1f}%)")
    print(f"Anomalous projects: {sum(df_labels['is_anomalous'] == 1):,} ({100 * sum(df_labels['is_anomalous'] == 1) / n_projects:.1f}%)")
    print(f"Output saved to: {output_dir}")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic MPLADS relational audit dataset.")
    parser.add_argument("--projects", type=int, default=100000, help="Number of projects to generate")
    parser.add_argument("--seed", type=int, default=42, help="Deterministic random seed")
    parser.add_argument("--output", type=str, default="data/synthetic/relational", help="Output directory")
    args = parser.parse_args()

    generate_synthetic_database(n_projects=args.projects, seed=args.seed, output_dir=args.output)
