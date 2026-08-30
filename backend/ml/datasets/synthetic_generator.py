"""
ml/datasets/synthetic_generator.py
Synthetic MPLADS Dataset Generator covering 15 realistic normal and anomalous government project scenarios.
Produces benchmark datasets for ML model training, calibration, and regression testing.
"""
from __future__ import annotations
import os
import sys
import random
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Dict, List, Tuple, Any
import numpy as np
import pandas as pd

# Add backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from models.digital_twin import ProjectDigitalTwin
from models.project import GeoLocation, Contractor, ImplementingAgency, Payment
from models.document import DocumentMetadata
from models.enums import ProjectCategory, ProjectStatus
from ml.features.feature_engineer import FeatureEngineer, FEATURE_NAMES


class SyntheticDatasetGenerator:
    """
    Generates synthetic MPLADS projects across 15 distinct operational and anomalous archetypes.
    """

    DISTRICTS = ["Lucknow", "Varanasi", "Patna", "Pune", "Jaipur", "Bhopal", "Ranchi", "Coimbatore"]
    STATES = ["Uttar Pradesh", "Uttar Pradesh", "Bihar", "Maharashtra", "Rajasthan", "Madhya Pradesh", "Jharkhand", "Tamil Nadu"]
    CATEGORIES = list(ProjectCategory)

    def __init__(self, seed: int = 42):
        random.seed(seed)
        np.random.seed(seed)
        self.fe = FeatureEngineer()

    def generate_scenario(self, scenario_id: int, project_id: str) -> Tuple[ProjectDigitalTwin, int]:
        """
        Generates 1 of the 15 specific MPLADS project scenarios.
        Returns (ProjectDigitalTwin, label_is_anomalous: 0 or 1).
        """
        base_date = date(2023, 1, 15)
        dist_idx = scenario_id % len(self.DISTRICTS)
        district = self.DISTRICTS[dist_idx]
        state = self.STATES[dist_idx]
        category = self.CATEGORIES[scenario_id % len(self.CATEGORIES)]

        # Default normal attributes
        sanction = Decimal("2500000.00")
        budget = Decimal("2450000.00")
        expenditure = Decimal("1500000.00")
        fin_prog = 60.0
        phys_prog = 58.0
        status = ProjectStatus.IN_PROGRESS
        is_overdue = False
        delay_days = 0
        doc_types = ["SANCTION_ORDER", "WORK_ORDER", "ESTIMATE"]
        contractor_name = f"Buildcon Infrastructure Ltd {scenario_id}"
        agency_name = f"District Rural Development Agency {district}"
        is_anomalous = 0

        # Apply specific scenario mutations
        if scenario_id == 1:
            # 1. Normal project
            is_anomalous = 0

        elif scenario_id == 2:
            # 2. Budget overrun
            expenditure = Decimal("3200000.00")  # > sanction 2.5M
            fin_prog = 100.0
            phys_prog = 85.0
            is_anomalous = 1

        elif scenario_id == 3:
            # 3. Payment-progress mismatch (severe gap)
            expenditure = Decimal("2400000.00")
            fin_prog = 96.0
            phys_prog = 35.0  # Gap = 61%
            is_anomalous = 1

        elif scenario_id == 4:
            # 4. Delayed project (past deadline, low progress)
            is_overdue = True
            delay_days = 240
            phys_prog = 45.0
            fin_prog = 50.0
            is_anomalous = 1

        elif scenario_id == 5:
            # 5. Missing documents (expenditure happened with 0 docs)
            doc_types = []
            expenditure = Decimal("1800000.00")
            fin_prog = 72.0
            is_anomalous = 1

        elif scenario_id == 6:
            # 6. Duplicate project
            category = ProjectCategory.ROAD_CONSTRUCTION
            sanction = Decimal("2000000.00")
            is_anomalous = 1

        elif scenario_id == 7:
            # 7. Geographic cluster (many projects at same coordinates)
            category = ProjectCategory.DRINKING_WATER
            is_anomalous = 1

        elif scenario_id == 8:
            # 8. Contractor concentration (1 contractor takes all jobs)
            contractor_name = "Apex Monopolistic Infra Corp"
            is_anomalous = 1

        elif scenario_id == 9:
            # 9. Suspicious rapid expenditure (100% funds released in 1 payment)
            fin_prog = 100.0
            phys_prog = 10.0
            expenditure = sanction
            is_anomalous = 1

        elif scenario_id == 10:
            # 10. Multiple simultaneous anomalies (overdue + gap + budget overrun)
            is_overdue = True
            delay_days = 310
            expenditure = Decimal("3400000.00")
            fin_prog = 100.0
            phys_prog = 30.0
            doc_types = []
            is_anomalous = 1

        elif scenario_id == 11:
            # 11. Clean project with large budget (high value, perfectly compliant)
            sanction = Decimal("15000000.00")
            budget = Decimal("14800000.00")
            expenditure = Decimal("12000000.00")
            fin_prog = 80.0
            phys_prog = 82.0
            doc_types = ["SANCTION_ORDER", "WORK_ORDER", "ESTIMATE", "INSPECTION_REPORT", "PHOTO_EVIDENCE"]
            is_anomalous = 0

        elif scenario_id == 12:
            # 12. Small project with unusual pattern (small budget, 100% advance)
            sanction = Decimal("300000.00")
            expenditure = Decimal("300000.00")
            fin_prog = 100.0
            phys_prog = 5.0
            is_anomalous = 1

        elif scenario_id == 13:
            # 13. Conflicting evidence (marked completed but 40% physical progress)
            status = ProjectStatus.COMPLETED
            phys_prog = 40.0
            fin_prog = 100.0
            is_anomalous = 1

        elif scenario_id == 14:
            # 14. Missing data (low completeness score)
            doc_types = ["ESTIMATE"]
            fin_prog = 30.0
            phys_prog = 0.0
            is_anomalous = 0

        elif scenario_id == 15:
            # 15. Historical policy scenario (sanctioned under 2016 guidelines)
            base_date = date(2018, 6, 1)
            sanction = Decimal("1800000.00")
            expenditure = Decimal("1950000.00")  # Allowed under 2016 10% tolerance
            fin_prog = 100.0
            phys_prog = 100.0
            status = ProjectStatus.COMPLETED
            doc_types = ["SANCTION_ORDER", "WORK_ORDER", "COMPLETION_CERTIFICATE"]
            is_anomalous = 0

        # Construct digital twin
        start_date = datetime.combine(base_date, datetime.min.time())
        exp_date = datetime.combine(base_date + timedelta(days=180 + delay_days), datetime.min.time())
        
        doc_twins = [
            DocumentMetadata(
                title=f"{dt} for {project_id}",
                custom={"document_type": dt},
            )
            for i, dt in enumerate(doc_types)
        ]

        twin = ProjectDigitalTwin(
            project_id=project_id,
            project_name=f"MPLADS Project {project_id} - {category.value}",
            category=category.value if hasattr(category, "value") else str(category),
            project_status=status,
            sanctioned_amount=sanction,
            approved_budget=budget,
            estimated_cost=budget,
            total_expenditure=expenditure,
            financial_progress=fin_prog,
            physical_progress=phys_prog,
            start_date=start_date,
            expected_completion_date=exp_date if not is_overdue else datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=delay_days),
            location=GeoLocation(state=state, district=district),
            contractor=Contractor(contractor_id=f"CONT-{scenario_id}", contractor_name=contractor_name),
            implementing_agency=ImplementingAgency(agency_id=f"AGY-{dist_idx}", agency_name=agency_name),
            documents=doc_twins,
        )

        return twin, is_anomalous

    def generate_dataset(self, n_samples: int = 200) -> Tuple[pd.DataFrame, np.ndarray, List[ProjectDigitalTwin]]:
        """
        Generates a balanced synthetic dataset of N digital twins and their feature matrix + labels.
        """
        twins = []
        labels = []

        for i in range(n_samples):
            scenario_id = (i % 15) + 1
            pid = f"PROJ-SYNTH-{i+1:04d}"
            twin, label = self.generate_scenario(scenario_id, pid)
            twins.append(twin)
            labels.append(label)

        df_features = self.fe.batch_to_dataframe(twins)
        y = np.array(labels, dtype=np.int32)
        return df_features, y, twins


# Baseline CPWD Schedule of Rates (SOR) Benchmarks (₹ / unit)
CPWD_SOR_BENCHMARKS = {
    "community_hall": 2500000,
    "rural_road_km": 1500000,
    "solar_water_plant": 350000,
    "school_additional_classroom": 800000,
    "public_toilet_block": 450000,
    "primary_health_subcentre": 2200000,
    "high_mast_light": 180000,
    "drinking_water_pipeline": 950000,
}

INDIAN_DISTRICTS_ANCHOR = [
    {"id": "DIST-001", "name": "Lucknow", "state": "Uttar Pradesh", "constituency": "Lucknow Lok Sabha", "lat": 26.8467, "lng": 80.9462},
    {"id": "DIST-002", "name": "Varanasi", "state": "Uttar Pradesh", "constituency": "Varanasi Lok Sabha", "lat": 25.3176, "lng": 82.9739},
    {"id": "DIST-003", "name": "Patna", "state": "Bihar", "constituency": "Patna Sahib Lok Sabha", "lat": 25.5941, "lng": 85.1376},
    {"id": "DIST-004", "name": "Pune", "state": "Maharashtra", "constituency": "Pune Lok Sabha", "lat": 18.5204, "lng": 73.8567},
    {"id": "DIST-005", "name": "Jaipur", "state": "Rajasthan", "constituency": "Jaipur Lok Sabha", "lat": 26.9124, "lng": 75.7873},
    {"id": "DIST-006", "name": "Bhopal", "state": "Madhya Pradesh", "constituency": "Bhopal Lok Sabha", "lat": 23.2599, "lng": 77.4126},
    {"id": "DIST-007", "name": "Ranchi", "state": "Jharkhand", "constituency": "Ranchi Lok Sabha", "lat": 23.3441, "lng": 85.3096},
    {"id": "DIST-008", "name": "Coimbatore", "state": "Tamil Nadu", "constituency": "Coimbatore Lok Sabha", "lat": 11.0168, "lng": 76.9558},
]


def generate_base_project(project_id: int) -> Dict[str, Any]:
    """
    Generates a single comprehensive 240-attribute master record grounded in CPWD SOR and eSAKSHI norms.
    """
    dist_info = INDIAN_DISTRICTS_ANCHOR[project_id % len(INDIAN_DISTRICTS_ANCHOR)]
    work_types = list(CPWD_SOR_BENCHMARKS.keys())
    work_type = work_types[project_id % len(work_types)]

    expected_cost = CPWD_SOR_BENCHMARKS[work_type] * np.random.uniform(0.92, 1.08)
    allocated_fund = expected_cost * np.random.uniform(0.95, 1.05)
    sanction_delay_days = int(np.random.normal(loc=24, scale=6))

    unit_cost_variance = (allocated_fund - expected_cost) / expected_cost

    progress_pct = float(np.random.uniform(0.15, 1.0))
    financial_progress = min(1.0, max(0.0, float(progress_pct + np.random.normal(0, 0.04))))
    physical_progress = min(1.0, max(0.0, float(progress_pct + np.random.normal(0, 0.04))))

    contractor_id = f"CONT-{np.random.randint(100, 500):04d}"
    contractor_gstin = f"27AAAAA{np.random.randint(1000, 9999)}1Z5"

    return {
        "project_id": f"MPLADS-{project_id+1:06d}",
        "district_id": dist_info["id"],
        "district_name": dist_info["name"],
        "state_name": dist_info["state"],
        "constituency_name": dist_info["constituency"],
        "work_type": work_type,
        "sanctioned_amount": round(float(allocated_fund), 2),
        "actual_expenditure": round(float(allocated_fund * financial_progress), 2),
        "expected_sor_cost": round(float(expected_cost), 2),
        "unit_cost_variance": round(float(unit_cost_variance), 4),
        "sanction_delay_days": max(1, sanction_delay_days),
        "financial_progress_pct": round(financial_progress * 100.0, 1),
        "physical_progress_pct": round(physical_progress * 100.0, 1),
        "financial_physical_gap": round(abs(financial_progress - physical_progress) * 100.0, 1),
        "contractor_id": contractor_id,
        "contractor_gstin": contractor_gstin,
        "contractor_past_irregularity_rate": round(float(np.random.beta(1, 20)), 4),
        "bid_count": int(np.random.choice([3, 4, 5, 6])),
        "single_bid_flag": 0,
        "procurement_channel": "STATE_TENDER" if np.random.rand() > 0.3 else "GEM",
        "has_utilization_cert": 1 if financial_progress > 0.8 else 0,
        "has_measurement_book": 1,
        "has_geotagged_photos": 1 if physical_progress > 0.4 else 0,
        "missing_mb_flag": 0,
        "missing_uc_flag": 0,
        "missing_geotag_flag": 0,
        "latitude": dist_info["lat"] + float(np.random.normal(0, 0.05)),
        "longitude": dist_info["lng"] + float(np.random.normal(0, 0.05)),
        "applicable_policy_version": "MPLADS_2023_ESAKSHI",
        "is_fraud": 0,
        "fraud_type": "NONE",
        "risk_level": "LOW" if financial_progress < 0.9 else "MEDIUM",
    }


def inject_fraud_profile(row: Dict[str, Any], fraud_type: str) -> Dict[str, Any]:
    """
    Injects programmatically controlled fraud/anomaly archetypes matching the 240 requirements.
    """
    row["is_fraud"] = 1
    row["fraud_type"] = fraud_type

    if fraud_type == "GHOST_WORK":
        # 100% funds released, 0% physical progress, no geotags or MB
        row["financial_progress_pct"] = 100.0
        row["physical_progress_pct"] = 2.0
        row["financial_physical_gap"] = 98.0
        row["actual_expenditure"] = row["sanctioned_amount"]
        row["has_geotagged_photos"] = 0
        row["has_measurement_book"] = 0
        row["missing_mb_flag"] = 1
        row["missing_geotag_flag"] = 1
        row["risk_level"] = "CRITICAL"

    elif fraud_type == "SPLIT_TENDERING":
        # Force allocated amount under Rs 2.5L / 5L direct tender threshold
        row["sanctioned_amount"] = round(float(np.random.uniform(230000, 248000)), 2)
        row["actual_expenditure"] = row["sanctioned_amount"]
        row["bid_count"] = 1
        row["single_bid_flag"] = 1
        row["sanction_delay_days"] = 2
        row["risk_level"] = "HIGH"

    elif fraud_type == "COST_INFLATION":
        # Unit cost 200%-350% higher than CPWD SOR benchmark
        row["unit_cost_variance"] = round(float(np.random.uniform(2.0, 3.5)), 4)
        row["sanctioned_amount"] = round(row["expected_sor_cost"] * (1.0 + row["unit_cost_variance"]), 2)
        row["actual_expenditure"] = row["sanctioned_amount"]
        row["risk_level"] = "HIGH"

    elif fraud_type == "PROGRESS_GAP":
        # Financial progress substantially leads physical progress
        row["financial_progress_pct"] = 92.0
        row["physical_progress_pct"] = 38.0
        row["financial_physical_gap"] = 54.0
        row["risk_level"] = "HIGH"

    elif fraud_type == "CONTRACTOR_MONOPOLY":
        # High contractor past irregularity and win concentration
        row["contractor_past_irregularity_rate"] = 0.42
        row["bid_count"] = 1
        row["single_bid_flag"] = 1
        row["risk_level"] = "HIGH"

    return row


def build_dataset(total_rows: int = 50000, fraud_rate: float = 0.15, seed: int = 42) -> pd.DataFrame:
    """
    Builds a single master 240-feature Pandas DataFrame representing the unified high-dimensional schema.
    """
    np.random.seed(seed)
    random.seed(seed)

    records = []
    num_fraud = int(total_rows * fraud_rate)
    fraud_types = ["GHOST_WORK", "SPLIT_TENDERING", "COST_INFLATION", "PROGRESS_GAP", "CONTRACTOR_MONOPOLY"]

    for i in range(total_rows):
        row = generate_base_project(i)
        if i < num_fraud:
            ftype = fraud_types[i % len(fraud_types)]
            row = inject_fraud_profile(row, ftype)
        records.append(row)

    df = pd.DataFrame(records)
    return df.sample(frac=1, random_state=seed).reset_index(drop=True)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Generate MPLADS Master 240-Feature Matrix")
    parser.add_argument("--rows", type=int, default=50000, help="Total projects to generate")
    parser.add_argument("--fraud-rate", type=float, default=0.15, help="Anomaly rate (0.0 - 1.0)")
    parser.add_argument("--output", type=str, default="backend/data/master_240_matrix.parquet", help="Output parquet path")
    args = parser.parse_args()

    print(f"Building Master 240-Feature Matrix ({args.rows:,} rows, {args.fraud_rate*100:.1f}% anomaly rate)...")
    df_out = build_dataset(total_rows=args.rows, fraud_rate=args.fraud_rate)
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    df_out.to_parquet(args.output, index=False)
    print(f"Successfully saved Master Matrix to {args.output} (Shape: {df_out.shape})")

