"""
data/generate.py
Deterministic, Schema-Aware, Parameter-Driven Synthetic Relational Data Generator for MPLADS AI Audit.
Generates 12 normalized relational tables with full referential integrity, domain correlations across
19 Risk & Governance dimensions, Faker-driven realistic entities, hard negative controls, and target segregation.
"""
from __future__ import annotations
import argparse
import datetime
import hashlib
import json
import math
import os
import random
import sys
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from faker import Faker

# Indian Administrative Reference Data
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
    {"category": "Roads & Bridges", "types": ["CC Road Construction", "Bituminous Road", "Culvert Bridge", "Paver Block Road"], "base_cost": 2500000, "duration_days": 180, "unit_type": "KM"},
    {"category": "Drinking Water", "types": ["RO Water Plant", "Deep Tube Well", "Piped Water Network", "Community Tank"], "base_cost": 800000, "duration_days": 90, "unit_type": "BENEFICIARY"},
    {"category": "Education Infrastructure", "types": ["School Additional Classroom", "Smart Classroom Lab", "School Boundary Wall", "Library Room"], "base_cost": 1500000, "duration_days": 150, "unit_type": "SQFT"},
    {"category": "Public Health", "types": ["Primary Health Sub-Centre", "Ayurvedic Dispensary", "Ambulance Vehicle", "Maternity Ward Facility"], "base_cost": 3000000, "duration_days": 210, "unit_type": "SQFT"},
    {"category": "Community Infrastructure", "types": ["Community Hall", "Yatri Shed", "Crematorium Shed", "Public Toilet Complex"], "base_cost": 1800000, "duration_days": 120, "unit_type": "SQFT"},
    {"category": "Renewable Energy", "types": ["Solar High-Mast Light", "Solar Street Lighting", "Solar Rooftop Panel"], "base_cost": 500000, "duration_days": 60, "unit_type": "UNIT"},
    {"category": "Irrigation & Agriculture", "types": ["Check Dam", "Lift Irrigation Scheme", "Farm Pond Renovation"], "base_cost": 2200000, "duration_days": 160, "unit_type": "HECTARE"},
    {"category": "Mega Infrastructure", "types": ["District Sports Complex", "Multi-Village Hospital Block", "Major River Overbridge"], "base_cost": 12000000, "duration_days": 400, "unit_type": "SQFT"},
]

AGENCY_TYPES = [
    "Public Works Department (PWD)",
    "Rural Development Department (RDD)",
    "Panchayati Raj Institution (PRI)",
    "Municipal Corporation (MC)",
    "Water Supply & Sewerage Board",
]


def generate_synthetic_database(
    n_projects: int = 25000,
    seed: int = 42,
    fraud_rate: float = 0.20,
    hard_negative_rate: float = 0.10,
    output_dir: str = "data/synthetic/relational",
    output_format: str = "all",
    overwrite: bool = True,
) -> Dict[str, Any]:
    """
    Generates deterministic, relationally consistent MPLADS datasets across 12 normalized tables
    encompassing 19 Risk & Governance dimensions with Faker-driven entity profiles.
    """
    random.seed(seed)
    np.random.seed(seed)
    rng = np.random.default_rng(seed)
    fake = Faker("en_IN")
    Faker.seed(seed)

    os.makedirs(output_dir, exist_ok=True)
    os.makedirs("data", exist_ok=True)

    print("=" * 60)
    print(f"[MPLADS DATA GENERATOR] Generating {n_projects:,} Relational Projects (Seed: {seed})")
    print(f"Fraud Rate: {fraud_rate*100:.1f}% | Hard Negative Rate: {hard_negative_rate*100:.1f}%")
    print(f"Output Directory: {output_dir}")
    print("=" * 60)

    # 1. Generate Geography Master (600+ Districts across 18 States)
    districts_list = []
    constituencies_list = []
    dist_counter = 1
    const_counter = 1

    for st in STATES_UT:
        num_dists = st["districts"]
        for d in range(1, num_dists + 1):
            d_id = f"DIST-{dist_counter:04d}"
            lat = float(rng.uniform(st["lat_range"][0], st["lat_range"][1]))
            lon = float(rng.uniform(st["lon_range"][0], st["lon_range"][1]))
            d_name = f"{st['name'][:3].upper()}-District-{d:02d}"
            districts_list.append({
                "district_id": d_id,
                "district_name": d_name,
                "state_id": st["state_id"],
                "state_name": st["name"],
                "district_latitude": round(lat, 5),
                "district_longitude": round(lon, 5),
                "population": int(rng.lognormal(13.8, 0.4)),
                "population_density": round(float(rng.uniform(200, 1500)), 1),
                "literacy_rate": round(float(rng.uniform(62.0, 94.0)), 1),
                "poverty_rate": round(float(rng.uniform(8.0, 38.0)), 1),
                "infrastructure_gap_index": round(float(rng.uniform(0.15, 0.85)), 3),
                "geographic_cluster_id": f"GEO-CLUST-{dist_counter % 25:02d}",
            })

            # 1-2 constituencies per district
            for _ in range(rng.choice([1, 2])):
                constituencies_list.append({
                    "constituency_id": f"PC-{const_counter:04d}",
                    "constituency_name": f"{d_name}-Seat-{const_counter:02d}",
                    "district_id": d_id,
                    "state_id": st["state_id"],
                    "mp_name": f"Hon. MP {fake.first_name()} {fake.last_name()}",
                    "mp_house": str(rng.choice(["Lok Sabha", "Rajya Sabha"], p=[0.75, 0.25])),
                })
                const_counter += 1
            dist_counter += 1

    df_districts = pd.DataFrame(districts_list)
    df_constituencies = pd.DataFrame(constituencies_list)
    num_districts = len(df_districts)
    num_constituencies = len(df_constituencies)

    # 2. Master Contractors & Implementing Agencies
    num_contractors = max(300, int(n_projects * 0.08))
    num_agencies = max(100, int(num_districts * 2))

    contractors_data = []
    for c in range(1, num_contractors + 1):
        c_id = f"CONT-{c:04d}"
        c_name = f"{fake.company()} Infrastructure Pvt Ltd" if rng.random() > 0.3 else f"{fake.last_name()} Enterprises"
        assigned_dist = df_districts.iloc[rng.integers(0, num_districts)]
        
        shared_dir_flag = int(rng.random() < 0.08)
        shared_addr_flag = int(rng.random() < 0.06)
        
        contractors_data.append({
            "contractor_id": c_id,
            "contractor_name": c_name,
            "home_district_id": assigned_dist["district_id"],
            "home_state_id": assigned_dist["state_id"],
            "registration_category": str(rng.choice(["Class A", "Class B", "Class C"], p=[0.2, 0.5, 0.3])),
            "financial_capacity": float(rng.choice([5000000, 20000000, 100000000], p=[0.4, 0.4, 0.2])),
            "base_quality_score": round(float(rng.uniform(0.7, 0.98)), 3),
            "past_irregularity_rate": round(float(rng.beta(1.5, 18.0)), 4),
            "contractor_past_irregularity_rate": round(float(rng.beta(1.5, 18.0)), 4),
            "contractor_capacity_strain": round(float(rng.uniform(0.4, 1.8)), 3),
            "contractor_project_count": int(rng.integers(1, 45)),
            "contractor_total_contract_value": float(rng.uniform(10000000, 250000000)),
            "contractor_average_contract_value": float(rng.uniform(2000000, 15000000)),
            "contractor_max_contract_value": float(rng.uniform(5000000, 50000000)),
            "contractor_project_share": round(float(rng.uniform(0.01, 0.35)), 4),
            "contractor_value_share": round(float(rng.uniform(0.01, 0.40)), 4),
            "contractor_district_concentration": round(float(rng.uniform(0.2, 0.95)), 3),
            "contractor_agency_concentration": round(float(rng.uniform(0.2, 0.90)), 3),
            "contractor_constituency_concentration": round(float(rng.uniform(0.1, 0.85)), 3),
            "contractor_delay_rate": round(float(rng.uniform(0.05, 0.45)), 3),
            "contractor_completion_rate": round(float(rng.uniform(0.65, 0.98)), 3),
            "contractor_cancellation_rate": round(float(rng.uniform(0.0, 0.08)), 3),
            "contractor_previous_irregularities": int(rng.choice([0, 1, 2, 4], p=[0.75, 0.15, 0.08, 0.02])),
            "contractor_financial_capacity": float(rng.choice([5000000, 20000000, 100000000], p=[0.4, 0.4, 0.2])),
            "contractor_value_to_capacity": round(float(rng.uniform(0.2, 1.6)), 3),
            "repeated_agency_contractor_pair": int(rng.random() < 0.25),
            "shared_ownership": shared_dir_flag,
            "shared_directors": shared_dir_flag,
            "shared_shareholders": int(rng.random() < 0.05),
            "shared_address": shared_addr_flag,
            "beneficial_owner_overlap": int(shared_dir_flag and shared_addr_flag),
            "contractor_financial_health": round(float(rng.uniform(0.55, 0.99)), 3),
            "company_ownership_change": int(rng.random() < 0.04),
            "director_change": int(rng.random() < 0.07),
            "address_change": int(rng.random() < 0.05),
        })
    df_contractors_master = pd.DataFrame(contractors_data)

    agencies_data = []
    for a in range(1, num_agencies + 1):
        a_id = f"AGENCY-{a:04d}"
        assigned_dist = df_districts.iloc[rng.integers(0, num_districts)]
        agencies_data.append({
            "agency_id": a_id,
            "agency_name": f"{assigned_dist['district_name']} - {rng.choice(AGENCY_TYPES)}",
            "district_id": assigned_dist["district_id"],
            "state_id": assigned_dist["state_id"],
            "agency_type": str(rng.choice(AGENCY_TYPES)),
            "agency_workload_ratio": round(float(rng.uniform(0.6, 2.2)), 3),
            "agency_geographic_concentration": round(float(rng.uniform(0.4, 0.98)), 3),
        })
    df_agencies_master = pd.DataFrame(agencies_data)

    # 3. Scenario Assignment
    norm_rate = max(0.40, 1.0 - fraud_rate - hard_negative_rate)
    scenarios_pool = [
        ("NORMAL", norm_rate),
        ("HIGH_VALUE_LEGITIMATE", hard_negative_rate * 0.5),
        ("LEGITIMATE_REMOTE_SINGLE_BID", hard_negative_rate * 0.3),
        ("LEGITIMATE_WEATHER_DELAY", hard_negative_rate * 0.2),
        ("COST_OVERRUN", fraud_rate * 0.20),
        ("PAYMENT_PROGRESS_MISMATCH", fraud_rate * 0.25),
        ("DELAYED_WORK", fraud_rate * 0.15),
        ("ABANDONED_WORK", fraud_rate * 0.08),
        ("SUSPICIOUS_CONTRACTOR_MONOPOLY", fraud_rate * 0.10),
        ("PROCUREMENT_SINGLE_BID", fraud_rate * 0.10),
        ("DOCUMENTATION_DEFICIT", fraud_rate * 0.07),
        ("GHOST_WORK", fraud_rate * 0.05),
    ]
    sc_names, sc_weights = zip(*scenarios_pool)
    sc_weights = np.array(sc_weights) / sum(sc_weights)
    assigned_scenarios = rng.choice(sc_names, size=n_projects, p=sc_weights)

    # 4. Generate Relational Tables from Root Project Entity
    projects_rows = []
    financials_rows = []
    payments_rows = []
    progress_rows = []
    procurement_rows = []
    contracts_rows = []
    documents_rows = []
    labels_rows = []

    start_anchor = datetime.date(2022, 1, 1)

    for i in range(n_projects):
        p_id = f"MPLADS-{i+1:06d}"
        sc = assigned_scenarios[i]

        cat_obj = rng.choice(PROJECT_CATEGORIES)
        cat_name = cat_obj["category"]
        work_type = str(rng.choice(cat_obj["types"]))
        work_name = f"{work_type} at Ward-{rng.integers(1, 99):02d}"
        unit_type = cat_obj.get("unit_type", "UNIT")

        # Assign Geography, Contractor & Agency
        dist_row = df_districts.iloc[rng.integers(0, num_districts)]
        const_row = df_constituencies[df_constituencies["district_id"] == dist_row["district_id"]]
        if len(const_row) == 0:
            const_row = df_constituencies.iloc[0]
        else:
            const_row = const_row.iloc[rng.integers(0, len(const_row))]

        cont_row = df_contractors_master.iloc[rng.integers(0, num_contractors)]
        agcy_row = df_agencies_master.iloc[rng.integers(0, num_agencies)]

        # Dates & Chronology
        rec_offset = int(rng.integers(0, 700))
        rec_date = start_anchor + datetime.timedelta(days=rec_offset)
        sanction_days = int(rng.integers(15, 60))
        sanction_date = rec_date + datetime.timedelta(days=sanction_days)
        start_date = sanction_date + datetime.timedelta(days=int(rng.integers(10, 30)))
        planned_duration = cat_obj["duration_days"]

        # Base Financials
        base_cost = cat_obj["base_cost"] * float(rng.uniform(0.7, 1.4))
        if sc == "HIGH_VALUE_LEGITIMATE":
            base_cost = cat_obj["base_cost"] * float(rng.uniform(3.5, 6.0))

        estimated_cost = round(base_cost, -3)
        sanction_amount = round(estimated_cost * float(rng.uniform(0.98, 1.05)), -3)
        revised_cost = sanction_amount
        tender_amount = round(estimated_cost * float(rng.uniform(0.92, 1.02)), -3)
        fund_released = sanction_amount
        actual_expenditure = round(sanction_amount * float(rng.uniform(0.85, 0.98)), -3)

        # Progress & Delays
        physical_progress = round(float(rng.uniform(70.0, 100.0)), 1)
        financial_progress = round(float((actual_expenditure / max(1.0, sanction_amount)) * 100.0), 1)
        actual_duration = planned_duration + int(rng.integers(-15, 35))
        extension_count = 0
        bid_count = int(rng.integers(3, 8))
        single_bid_flag = 0

        # Documents checklist
        has_as = True
        has_ts = True
        has_dpr = True
        has_wo = True
        has_mb = True
        has_uc = True
        has_cc = True
        has_geotag = True
        photo_count = int(rng.integers(3, 8))

        # Scenario Injectors
        if sc == "COST_OVERRUN":
            revised_cost = round(sanction_amount * float(rng.uniform(1.25, 1.60)), -3)
            actual_expenditure = revised_cost
            financial_progress = round(float((actual_expenditure / max(1.0, sanction_amount)) * 100.0), 1)
        elif sc == "PAYMENT_PROGRESS_MISMATCH":
            financial_progress = round(float(rng.uniform(85.0, 99.0)), 1)
            physical_progress = round(float(rng.uniform(15.0, 35.0)), 1)
            actual_expenditure = round(sanction_amount * (financial_progress / 100.0), -3)
            has_mb = False
        elif sc == "DELAYED_WORK":
            actual_duration = planned_duration * int(rng.integers(3, 5))
            extension_count = int(rng.integers(2, 5))
            physical_progress = round(float(rng.uniform(40.0, 75.0)), 1)
        elif sc == "ABANDONED_WORK":
            physical_progress = round(float(rng.uniform(10.0, 25.0)), 1)
            financial_progress = round(float(rng.uniform(40.0, 70.0)), 1)
            actual_expenditure = round(sanction_amount * (financial_progress / 100.0), -3)
        elif sc == "PROCUREMENT_SINGLE_BID" or sc == "LEGITIMATE_REMOTE_SINGLE_BID":
            bid_count = 1
            single_bid_flag = 1
        elif sc == "DOCUMENTATION_DEFICIT":
            has_mb = False
            has_uc = False
            has_cc = False
            has_geotag = False
            photo_count = 0
        elif sc == "GHOST_WORK":
            financial_progress = 100.0
            physical_progress = 0.0
            actual_expenditure = sanction_amount
            has_mb = False
            has_cc = False
            has_geotag = False
            photo_count = 0

        target_completion = sanction_date + datetime.timedelta(days=int(planned_duration))
        actual_comp_date = (start_date + datetime.timedelta(days=int(actual_duration))).isoformat() if physical_progress >= 95.0 else None

        # Coordinates
        p_lat = round(float(dist_row["district_latitude"] + rng.uniform(-0.08, 0.08)), 5)
        p_lon = round(float(dist_row["district_longitude"] + rng.uniform(-0.08, 0.08)), 5)

        # 01_projects
        projects_rows.append({
            "project_id": p_id,
            "work_name": work_name,
            "title": work_name,
            "work_type": work_type,
            "category": cat_name,
            "project_category": cat_name,
            "project_type": work_type,
            "project_size": "LARGE" if estimated_cost > 5000000 else ("MEDIUM" if estimated_cost > 1500000 else "SMALL"),
            "district_id": dist_row["district_id"],
            "district_name": dist_row["district_name"],
            "state_id": dist_row["state_id"],
            "state_name": dist_row["state_name"],
            "constituency_id": const_row["constituency_id"],
            "constituency_name": const_row["constituency_name"],
            "contractor_id": cont_row["contractor_id"],
            "agency_id": agcy_row["agency_id"],
            "recommendation_date": rec_date.isoformat(),
            "sanction_date": sanction_date.isoformat(),
            "start_date": start_date.isoformat(),
            "expected_completion_date": target_completion.isoformat(),
            "target_completion_date": target_completion.isoformat(),
            "actual_completion_date": actual_comp_date,
            "project_duration": planned_duration,
            "planned_duration_days": planned_duration,
            "actual_duration_days": actual_duration,
            "status": "COMPLETED" if physical_progress >= 95.0 else ("WORK_IN_PROGRESS" if physical_progress > 25.0 else "DELAYED"),
            "project_status": "COMPLETED" if physical_progress >= 95.0 else ("WORK_IN_PROGRESS" if physical_progress > 25.0 else "DELAYED"),
            "project_latitude": p_lat,
            "project_longitude": p_lon,
        })

        # Cost metrics calculations
        cost_km = round(actual_expenditure / max(1.0, float(rng.uniform(1.2, 4.5))), 2) if unit_type == "KM" else 0.0
        cost_sqft = round(actual_expenditure / max(1.0, float(rng.uniform(800, 3500))), 2) if unit_type == "SQFT" else 0.0
        cost_beneficiary = round(actual_expenditure / max(1.0, float(rng.uniform(150, 1200))), 2) if unit_type == "BENEFICIARY" else 0.0

        # 02_financials
        financials_rows.append({
            "project_id": p_id,
            "recommended_amount": estimated_cost,
            "estimated_cost": estimated_cost,
            "sanctioned_amount": sanction_amount,
            "revised_cost": revised_cost,
            "tender_amount": tender_amount,
            "tender_value": tender_amount,
            "released_amount": fund_released,
            "fund_released": fund_released,
            "actual_expenditure": actual_expenditure,
            "unspent_balance": max(0.0, fund_released - actual_expenditure),
            "remaining_balance": max(0.0, fund_released - actual_expenditure),
            "fund_utilization_ratio": round(actual_expenditure / max(1.0, fund_released), 4),
            "utilization_ratio": round(actual_expenditure / max(1.0, fund_released), 4),
            "release_ratio": round(fund_released / max(1.0, sanction_amount), 4),
            "expenditure_ratio": round(actual_expenditure / max(1.0, sanction_amount), 4),
            "cost_per_unit": round(actual_expenditure / max(1.0, float(rng.uniform(10, 500))), 2),
            "peer_median_cost": round(base_cost, -2),
            "peer_mean_cost": round(base_cost * 1.02, -2),
            "cost_deviation": round((actual_expenditure - estimated_cost) / max(1.0, estimated_cost), 4),
            "tender_estimate_deviation": round((tender_amount - estimated_cost) / max(1.0, estimated_cost), 4),
            "actual_sanction_deviation": round((actual_expenditure - sanction_amount) / max(1.0, sanction_amount), 4),
            "cost_overrun": max(0.0, actual_expenditure - sanction_amount),
            "cost_per_km": cost_km,
            "cost_per_sqft": cost_sqft,
            "cost_per_beneficiary": cost_beneficiary,
            "sor_deviation": round(float(rng.uniform(-0.08, 0.18)), 4),
            "market_rate_deviation": round(float(rng.uniform(-0.05, 0.22)), 4),
            "inflation_adjusted_cost_deviation": round(float(rng.uniform(-0.04, 0.15)), 4),
        })

        # 03_payments (2-4 tranches)
        tranche_count = 3 if actual_expenditure > 1000000 else 2
        tranche_val = round(actual_expenditure / tranche_count, -2)
        cum_pay = 0.0
        for tr in range(1, tranche_count + 1):
            pay_date = sanction_date + datetime.timedelta(days=int((actual_duration / tranche_count) * tr))
            p_amt = tranche_val if tr < tranche_count else max(0.0, actual_expenditure - (tranche_val * (tranche_count - 1)))
            cum_pay += p_amt
            payments_rows.append({
                "payment_id": f"PAY-{i+1:06d}-{tr:02d}",
                "project_id": p_id,
                "contractor_id": cont_row["contractor_id"],
                "tranche_number": tr,
                "payment_number": tr,
                "payment_amount": p_amt,
                "payment_date": pay_date.isoformat(),
                "voucher_number": f"VCH-{i+1:06d}-{tr:02d}",
                "cumulative_payment": cum_pay,
                "payment_velocity": round(p_amt / max(1, planned_duration / tranche_count), 2),
                "payment_frequency": round(planned_duration / tranche_count, 1),
                "payment_concentration": round(p_amt / max(1.0, actual_expenditure), 4),
                "is_round_number": int(p_amt % 50000 == 0),
                "is_final_installment": int(tr == tranche_count),
                "duplicate_payment_flag": 0,
                "payment_timing_anomaly": int(pay_date.month == 3 and rng.random() < 0.25),
                "measurement_book_verified": has_mb,
            })

        # 04_progress
        progress_rows.append({
            "progress_id": f"PROG-{i+1:06d}",
            "project_id": p_id,
            "record_date": (sanction_date + datetime.timedelta(days=int(actual_duration * 0.8))).isoformat(),
            "physical_progress": physical_progress,
            "financial_progress": financial_progress,
            "planned_progress": min(100.0, round(float(rng.uniform(80.0, 100.0)), 1)),
            "actual_vs_planned_progress": round(physical_progress - min(100.0, 90.0), 2),
            "progress_mismatch": round(abs(financial_progress - physical_progress), 2),
            "progress_velocity": round(physical_progress / max(1, actual_duration), 4),
            "progress_acceleration": round(float(rng.uniform(-0.02, 0.05)), 4),
            "completion_percentage": physical_progress,
            "physical_progress_delay": max(0.0, financial_progress - physical_progress),
            "financial_physical_gap": round(financial_progress - physical_progress, 2),
            "planned_duration_days": planned_duration,
            "actual_duration_days": actual_duration,
            "extension_count": extension_count,
            "progress_gap": round(financial_progress - physical_progress, 2),
            "measurement_book_verified": has_mb,
            "geo_tag_available": has_geotag,
            "geo_tag_progress_consistency": 1 if has_geotag else 0,
        })

        # 05_procurement
        procurement_rows.append({
            "tender_id": f"TND-{i+1:06d}",
            "project_id": p_id,
            "tender_exists": 1,
            "procurement_method": "Open e-Tender" if bid_count > 1 else "Direct / Single Inquiry",
            "tender_publication_date": (sanction_date - datetime.timedelta(days=21)).isoformat(),
            "tender_duration": int(rng.integers(14, 30)),
            "bid_count": bid_count,
            "qualified_bid_count": max(1, bid_count - int(rng.integers(0, 2))),
            "single_bid_flag": single_bid_flag,
            "bid_competition_score": round(min(1.0, bid_count / 6.0), 3),
            "tender_type": "Open e-Tender" if bid_count > 1 else "Single Tender Inquiry",
            "winning_bid": tender_amount,
            "winning_bid_amount": tender_amount,
            "winning_bid_deviation": round((tender_amount - estimated_cost) / max(1.0, estimated_cost), 4),
            "winning_bid_vs_lowest_bid": round(float(rng.uniform(0.0, 0.05)), 4),
            "bid_price_similarity": round(float(rng.uniform(0.85, 0.99)), 4) if bid_count > 1 else 0.0,
            "bidder_disqualification_rate": round(float(rng.uniform(0.0, 0.25)), 3),
            "re_tender_count": int(rng.choice([0, 1], p=[0.88, 0.12])),
            "tender_cancellation_count": 0,
            "tender_bypass_flag": 0,
            "repeated_winner_flag": int(rng.random() < 0.20),
            "bid_rotation_score": round(float(rng.uniform(0.1, 0.75)), 3),
            "repeated_loser_score": round(float(rng.uniform(0.05, 0.50)), 3),
            "procurement_compliance_flag": int(bid_count >= 3),
        })

        # 06_contracts
        contracts_rows.append({
            "contract_id": f"CNTR-{i+1:06d}",
            "project_id": p_id,
            "contractor_id": cont_row["contractor_id"],
            "work_order_amount": tender_amount,
            "original_contract_value": tender_amount,
            "final_contract_value": actual_expenditure,
            "contract_value_change": round((actual_expenditure - tender_amount) / max(1.0, tender_amount), 4),
            "contract_amendment_count": extension_count,
            "amendment_value": max(0.0, actual_expenditure - tender_amount),
            "extension_count": extension_count,
            "extension_duration": extension_count * 30,
            "award_date": (sanction_date + datetime.timedelta(days=14)).isoformat(),
            "original_completion_date": target_completion.isoformat(),
            "revised_completion_date": (target_completion + datetime.timedelta(days=extension_count * 30)).isoformat(),
            "contract_delay_days": max(0, actual_duration - planned_duration),
            "contractor_capacity": cont_row["financial_capacity"],
            "contract_value_to_capacity": round(tender_amount / max(1.0, cont_row["financial_capacity"]), 4),
            "external_service_provider_flag": 0,
            "subcontractor_count": int(rng.choice([0, 1, 2], p=[0.7, 0.2, 0.1])),
            "subcontractor_value_share": round(float(rng.uniform(0.0, 0.30)), 3),
            "end_period_expenditure_ratio": round(float(rng.uniform(0.15, 0.55)), 3),
            "performance_guarantee_submitted": True,
        })

        # 11_documents & Asset verification
        req_docs = 5
        avail_docs = sum([has_as, has_ts, has_wo, has_mb, has_uc])
        asset_created = 1 if physical_progress >= 95.0 else 0
        documents_rows.append({
            "document_id": f"DOC-{i+1:06d}",
            "project_id": p_id,
            "administrative_sanction": has_as,
            "technical_sanction": has_ts,
            "dpr": has_dpr,
            "work_order": has_wo,
            "measurement_book": has_mb,
            "utilization_certificate": has_uc,
            "completion_certificate": has_cc,
            "geo_tagged_photos": has_geotag,
            "photo_count": photo_count,
            "required_document_count": req_docs,
            "available_document_count": avail_docs,
            "missing_document_ratio": round((req_docs - avail_docs) / float(req_docs), 4),
            "document_exists_flag": 1,
            "document_type": "PDF_BUNDLE",
            "document_date": sanction_date.isoformat(),
            "document_amount": sanction_amount,
            "document_entity": agcy_row["agency_name"],
            "document_project_reference": p_id,
            "document_database_match_score": 0.98 if has_mb and has_uc else 0.65,
            "document_amount_mismatch": 0,
            "document_date_mismatch": 0,
            "document_entity_mismatch": 0,
            "document_duplicate_hash": f"SHA256-{hashlib.sha256(p_id.encode()).hexdigest()[:12]}",
            "document_version_count": 1 + extension_count,
            "document_tampering_flag": 0,
            "ocr_confidence_score": round(float(rng.uniform(0.88, 0.99)), 3),
            "data_completeness_score": round(float(avail_docs / req_docs), 3),
            "missing_field_count": 0 if avail_docs == req_docs else (req_docs - avail_docs),
            "missing_critical_field_flag": int(not has_mb or not has_as),
            "data_validation_status": "PASSED" if avail_docs >= 4 else "DEFICIT",
            "data_source": "e-SAKSHI Portal",
            "source_system": "MoSPI_MPLADS_V2",
            "last_updated_timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "record_update_count": 3,
            "late_data_submission_flag": int(extension_count > 1),
            "inconsistent_record_flag": int(not has_mb and financial_progress > 80.0),
            "cross_source_mismatch_flag": 0,
            "asset_id": f"ASSET-{i+1:06d}",
            "asset_created_flag": asset_created,
            "asset_register_entry_flag": asset_created,
            "asset_location": f"{dist_row['district_name']} Sector {rng.integers(1, 15)}",
            "asset_latitude": p_lat,
            "asset_longitude": p_lon,
            "asset_photo_available": 1 if has_geotag and photo_count > 0 else 0,
            "asset_photo_date": (sanction_date + datetime.timedelta(days=actual_duration)).isoformat() if asset_created else None,
            "asset_photo_count": photo_count,
            "asset_status": "OPERATIONAL" if asset_created else "UNDER_CONSTRUCTION",
            "asset_verification_status": "VERIFIED" if asset_created and has_geotag else "PENDING",
            "asset_project_link_match": 1,
            "asset_geo_consistency": 1,
            "asset_completion_evidence_score": 1.0 if has_cc and has_geotag else (0.5 if has_geotag else 0.0),
        })

        # 12_labels (Target Segregated)
        is_fraud = 0 if sc in ["NORMAL", "HIGH_VALUE_LEGITIMATE", "LEGITIMATE_REMOTE_SINGLE_BID", "LEGITIMATE_WEATHER_DELAY"] else 1
        risk_lvl = "LOW"
        if is_fraud == 1:
            risk_lvl = "CRITICAL" if sc in ["GHOST_WORK", "PAYMENT_PROGRESS_MISMATCH", "COST_OVERRUN"] else "HIGH"
        elif sc == "HIGH_VALUE_LEGITIMATE":
            risk_lvl = "MEDIUM"

        labels_rows.append({
            "project_id": p_id,
            "fraud_label": is_fraud,
            "is_fraud": is_fraud,
            "is_anomalous": is_fraud,
            "is_hard_negative": int(sc in ["HIGH_VALUE_LEGITIMATE", "LEGITIMATE_REMOTE_SINGLE_BID", "LEGITIMATE_WEATHER_DELAY"]),
            "risk_level": risk_lvl,
            "scenario_type": sc,
            "scenario_name": sc,
            "overall_risk_score": 85.0 if risk_lvl == "CRITICAL" else (70.0 if risk_lvl == "HIGH" else (45.0 if risk_lvl == "MEDIUM" else 20.0)),
            "investigation_priority": "URGENT" if risk_lvl == "CRITICAL" else ("ELEVATED" if risk_lvl == "HIGH" else "ROUTINE"),
        })

    # Convert to DataFrames
    tables_dict = {
        "01_projects": pd.DataFrame(projects_rows),
        "02_financials": pd.DataFrame(financials_rows),
        "03_payments": pd.DataFrame(payments_rows),
        "04_progress": pd.DataFrame(progress_rows),
        "05_procurement": pd.DataFrame(procurement_rows),
        "06_contracts": pd.DataFrame(contracts_rows),
        "07_contractors": df_contractors_master,
        "08_agencies": df_agencies_master,
        "09_geography": df_districts,
        "10_constituencies": df_constituencies,
        "11_documents": pd.DataFrame(documents_rows),
        "12_labels": pd.DataFrame(labels_rows),
    }

    # Save outputs
    row_counts = {}
    for tbl_name, df in tables_dict.items():
        row_counts[tbl_name] = len(df)
        if output_format in ["parquet", "all"]:
            df.to_parquet(os.path.join(output_dir, f"{tbl_name}.parquet"), index=False)
        if output_format in ["csv", "all"]:
            df.to_csv(os.path.join(output_dir, f"{tbl_name}.csv"), index=False)

    # Calculate actual fraud and hard negative stats
    df_lab = tables_dict["12_labels"]
    actual_fraud_count = int((df_lab["fraud_label"] == 1).sum())
    actual_fraud_rate = actual_fraud_count / float(n_projects)
    hard_neg_count = int(df_lab["scenario_type"].isin(["HIGH_VALUE_LEGITIMATE", "LEGITIMATE_REMOTE_SINGLE_BID", "LEGITIMATE_WEATHER_DELAY"]).sum())
    hard_neg_rate = hard_neg_count / float(n_projects)

    manifest = {
        "dataset_name": "MPLADS_AI_AUDIT_SYNTHETIC_RELATIONAL",
        "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "seed": seed,
        "num_projects": n_projects,
        "fraud_rate": round(actual_fraud_rate, 4),
        "hard_negative_rate": round(hard_neg_rate, 4),
        "fraud_rate_target": fraud_rate,
        "fraud_rate_actual": round(actual_fraud_rate, 4),
        "hard_negative_rate_target": hard_negative_rate,
        "hard_negative_rate_actual": round(hard_neg_rate, 4),
        "table_counts": row_counts,
        "tables": list(tables_dict.keys()),
    }

    with open(os.path.join(output_dir, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=2)

    with open("data/dataset_metadata.json", "w") as f:
        json.dump(manifest, f, indent=2)

    print("\n[SUCCESS] 12 Normalized Relational Tables Generated Successfully.")
    for tbl, count in row_counts.items():
        print(f" - {tbl:20s}: {count:,} rows")
    print(f"Actual Fraud Rate: {actual_fraud_rate*100:.2f}% | Hard Negatives: {hard_neg_rate*100:.2f}%\n")

    return {
        "manifest": manifest,
        "tables": tables_dict,
    }


def main():
    parser = argparse.ArgumentParser(description="Deterministic Relational MPLADS Synthetic Data Generator")
    parser.add_argument("--projects", type=int, default=25000, help="Number of projects to generate (default: 25000)")
    parser.add_argument("--seed", type=int, default=42, help="Deterministic random seed (default: 42)")
    parser.add_argument("--fraud-rate", type=float, default=0.20, help="Ratio of anomalous projects (default: 0.20)")
    parser.add_argument("--hard-negative-rate", type=float, default=0.10, help="Ratio of legitimate complex projects (default: 0.10)")
    parser.add_argument("--output", type=str, default="data/synthetic/relational", help="Output directory path")
    parser.add_argument("--format", type=str, choices=["csv", "parquet", "all"], default="all", help="Output format")
    parser.add_argument("--overwrite", action="store_true", default=True, help="Overwrite existing files")

    args = parser.parse_args()
    generate_synthetic_database(
        n_projects=args.projects,
        seed=args.seed,
        fraud_rate=args.fraud_rate,
        hard_negative_rate=args.hard_negative_rate,
        output_dir=args.output,
        output_format=args.format,
        overwrite=args.overwrite,
    )


if __name__ == "__main__":
    main()
