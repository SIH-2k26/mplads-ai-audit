"""
ml/features/feature_engineer.py
Feature Engineering pipeline for converting ProjectDigitalTwin instances into normalized feature vectors for ML models.
Guarantees zero target leakage and robust handling of missing data.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Dict, List, Optional
import numpy as np
import pandas as pd

from models.digital_twin import ProjectDigitalTwin


FEATURE_NAMES = [
    "financial_progress",
    "physical_progress",
    "financial_physical_gap",
    "sanctioned_amount_log",
    "expenditure_log",
    "budget_utilization_ratio",
    "cost_overrun_ratio",
    "is_overdue",
    "delay_days",
    "delay_ratio",
    "data_completeness_score",
    "document_count",
    "has_sanction_order",
    "has_work_order",
    "has_completion_cert",
    "payment_count",
    "max_single_payment_ratio",
    "contractor_project_count",
    "contractor_risk_indicator",
    "geo_nearby_count",
]


class FeatureEngineer:
    """
    Transforms ProjectDigitalTwin domain objects into numeric feature vectors and DataFrames.
    """

    def extract_features(self, twin: ProjectDigitalTwin) -> Dict[str, float]:
        """Extracts a feature dictionary for a single digital twin."""
        sanction = float(twin.sanctioned_amount or 0.0)
        budget = float(twin.approved_budget or sanction or 1.0)
        expenditure = float(twin.total_expenditure or 0.0)
        fin_prog = float(twin.financial_progress or 0.0)
        phys_prog = float(twin.physical_progress or 0.0)

        # 1. Financial vs Physical Progress
        fin_phys_gap = max(0.0, fin_prog - phys_prog)
        sanction_log = float(np.log1p(sanction))
        expenditure_log = float(np.log1p(expenditure))
        bgt_util = expenditure / max(budget, 1.0)
        cost_overrun = max(0.0, (expenditure - sanction) / max(sanction, 1.0))

        # 2. Timeline and Delay
        is_overdue = 1.0 if twin.is_overdue else 0.0
        delay_days = float(twin.delay_days or 0.0)
        total_duration = 180.0
        if twin.start_date and twin.expected_completion_date:
            duration = (twin.expected_completion_date - twin.start_date).days
            total_duration = max(30.0, float(duration))
        delay_ratio = delay_days / total_duration

        # 3. Documents
        doc_types = set(getattr(twin, "document_types_present", []) or [])
        doc_count = float(len(doc_types) or len(getattr(twin, "document_ids", []) or []))
        has_sanction = 1.0 if "SANCTION_ORDER" in doc_types else 0.0
        has_work = 1.0 if "WORK_ORDER" in doc_types else 0.0
        has_comp = 1.0 if "COMPLETION_CERTIFICATE" in doc_types else 0.0

        # 4. Payments
        payments = getattr(twin, "payments", []) or getattr(twin, "payments_history", []) or []
        payment_count = float(len(payments))
        max_payment = max([float(getattr(p, "amount", 0.0)) for p in payments], default=0.0)
        max_payment_ratio = max_payment / max(expenditure, 1.0) if expenditure > 0 else 0.0

        # 5. Network / Contractor
        contractor_count = 1.0
        contractor_risk = 0.0
        if twin.contractor and hasattr(twin.contractor, "active_projects_count"):
            contractor_count = float(twin.contractor.active_projects_count or 1.0)
            if contractor_count >= 5:
                contractor_risk = 1.0

        return {
            "financial_progress": fin_prog,
            "physical_progress": phys_prog,
            "financial_physical_gap": fin_phys_gap,
            "sanctioned_amount_log": sanction_log,
            "expenditure_log": expenditure_log,
            "budget_utilization_ratio": min(2.0, bgt_util),
            "cost_overrun_ratio": min(2.0, cost_overrun),
            "is_overdue": is_overdue,
            "delay_days": min(1000.0, delay_days),
            "delay_ratio": min(5.0, delay_ratio),
            "data_completeness_score": float(twin.data_completeness_score or 0.5),
            "document_count": min(20.0, doc_count),
            "has_sanction_order": has_sanction,
            "has_work_order": has_work,
            "has_completion_cert": has_comp,
            "payment_count": min(50.0, payment_count),
            "max_single_payment_ratio": min(1.0, max_payment_ratio),
            "contractor_project_count": min(50.0, contractor_count),
            "contractor_risk_indicator": contractor_risk,
            "geo_nearby_count": 0.0,
        }

    def to_numpy(self, twin: ProjectDigitalTwin) -> np.ndarray:
        feats = self.extract_features(twin)
        return np.array([feats[k] for k in FEATURE_NAMES], dtype=np.float32)

    def batch_to_dataframe(self, twins: List[ProjectDigitalTwin]) -> pd.DataFrame:
        rows = [self.extract_features(t) for t in twins]
        return pd.DataFrame(rows, columns=FEATURE_NAMES)
