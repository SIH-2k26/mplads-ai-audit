"""
ml/datasets/synthetic_generator.py
Synthetic MPLADS Dataset Generator covering 15 realistic normal and anomalous government project scenarios.
Produces benchmark datasets for ML model training, calibration, and regression testing.
"""
from __future__ import annotations
import random
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Dict, List, Tuple
import numpy as np
import pandas as pd

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
