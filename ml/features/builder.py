"""
ml/features/builder.py
Canonical Single Source of Truth Feature Builder for Sanchay AI.
Guarantees 100% feature consistency between batch training and real-time inference.
"""
from __future__ import annotations
import datetime
from datetime import date, datetime as dt_cls
import json
import os
from typing import Any, Dict, List, Optional, Tuple, Union

import numpy as np
import pandas as pd

from ml.features.schema import CANONICAL_FEATURES
from ml.features.financial import compute_financial_features, safe_ratio
from ml.features.progress import compute_progress_features
from ml.features.procurement import compute_procurement_features
from ml.features.contractor import compute_contractor_features
from ml.features.temporal import compute_temporal_features, parse_date
from ml.features.documentation import compute_documentation_features


class FeatureBuilder:
    def __init__(self, feature_list: Optional[List[str]] = None):
        self.feature_cols = feature_list or CANONICAL_FEATURES

    def extract_features_dict(
        self,
        project_dict: Dict[str, Any],
        doc_dict: Optional[Dict[str, Any]] = None,
        prediction_timestamp: Optional[Any] = None,
    ) -> Dict[str, float]:
        """
        Extracts all canonical features from a project dictionary with point-in-time filtering.
        Used identically during single-instance inference and batch generation.
        """
        p = project_dict
        d = doc_dict or {}
        pred_ts = parse_date(prediction_timestamp)

        sanction = float(p.get("sanction_amount", p.get("sanctioned_amount", 2500000.0)))
        estimate = float(p.get("estimated_cost", sanction * 0.96))
        actual_exp = float(p.get("actual_cost", p.get("actual_expenditure", p.get("total_expenditure", sanction * 0.90))))
        released = float(p.get("fund_released", p.get("released_amount", sanction)))
        revised = float(p.get("revised_cost", sanction))
        work_order = float(p.get("tender_amount", p.get("work_order_amount", sanction * 0.95)))

        phys_prog = float(p.get("physical_progress", 75.0))
        fin_prog = float(p.get("financial_progress", safe_ratio(actual_exp, sanction) * 100.0))
        planned_days = float(p.get("planned_duration_days", 180.0))
        actual_days = float(p.get("actual_duration_days", 200.0))

        bid_count = int(p.get("bid_count", 4))
        single_bid_flag = int(p.get("single_bid_flag", 1 if bid_count == 1 else 0))

        raw_payments = p.get("payments", None)
        valid_payments = None
        if raw_payments is not None:
            valid_payments = []
            for item in raw_payments:
                p_date = parse_date(item.get("payment_date", item.get("date")))
                if pred_ts is None or p_date is None or p_date <= pred_ts:
                    valid_payments.append(item)

        bids = p.get("bids", None)
        contractor = p.get("contractor_data", p)

        # 1. Domain Feature Extractors
        fin_feats = compute_financial_features(
            sanction=sanction,
            estimate=estimate,
            actual_exp=actual_exp,
            released=released,
            revised=revised,
            work_order=work_order,
            payments=valid_payments,
        )

        prog_feats = compute_progress_features(
            physical_prog=phys_prog,
            financial_prog=fin_prog,
            planned_days=planned_days,
            actual_days=actual_days,
        )

        proc_feats = compute_procurement_features(
            bid_count=bid_count,
            single_bid_flag=single_bid_flag,
            bids=bids,
            tender_amount=work_order,
            estimated_cost=estimate,
        )

        cont_feats = compute_contractor_features(
            contractor_dict=contractor,
            sanction_amount=sanction,
        )

        temp_feats = compute_temporal_features(
            sanction_date=p.get("sanction_date"),
            work_order_date=p.get("work_order_date"),
            payments=valid_payments,
            prediction_timestamp=prediction_timestamp,
        )

        doc_feats = compute_documentation_features(
            doc_dict=d,
            project_dict=p,
        )

        # Geospatial and Demographic Baseline Features
        geo_feats = {
            "project_density_1km": float(p.get("project_density_1km", 0.0)),
            "project_density_5km": float(p.get("project_density_5km", 1.0)),
            "project_density_10km": float(p.get("project_density_10km", 2.0)),
            "same_location_project_count": float(p.get("same_location_project_count", 0.0)),
            "same_coordinates_project_count": float(p.get("same_coordinates_project_count", 0.0)),
            "same_contractor_nearby_projects": float(p.get("same_contractor_nearby_projects", 0.0)),
            "same_agency_nearby_projects": float(p.get("same_agency_nearby_projects", 1.0)),
            "nearest_project_distance": float(p.get("nearest_project_distance", 3.5)),
            "average_neighbor_distance": float(p.get("average_neighbor_distance", 5.2)),
            "district_project_density": float(p.get("district_project_density", 0.45)),
            "constituency_project_density": float(p.get("constituency_project_density", 0.40)),
            "contractor_locality_ratio": float(p.get("contractor_locality_ratio", 0.85)),
            "contractor_outside_district_ratio": float(p.get("contractor_outside_district_ratio", 0.15)),
            "infrastructure_gap_score": float(p.get("infrastructure_gap_score", 0.45)),
            "geo_cluster_density": float(p.get("geo_cluster_density", 0.45)),
            "contractor_district_distance_km": float(p.get("contractor_district_distance_km", 12.5)),
            "is_high_density_cluster": float(p.get("is_high_density_cluster", 0.0)),
            "geo_distance_mismatch_km": float(p.get("geo_distance_mismatch_km", 0.0)),
            "district_population": float(p.get("population", p.get("district_population", 1500000.0))),
            "population_density": float(p.get("population_density", 650.0)),
            "literacy_rate": float(p.get("literacy_rate", 78.0)),
            "poverty_rate": float(p.get("poverty_rate", 20.0)),
        }

        # Combine all sub-domain feature dictionaries
        all_feats: Dict[str, float] = {}
        for d_group in (fin_feats, prog_feats, proc_feats, cont_feats, temp_feats, doc_feats, geo_feats):
            all_feats.update(d_group)

        # Overwrite with any explicit numerical inputs present in project_dict
        for k in self.feature_cols:
            if k in p and p[k] is not None:
                try:
                    all_feats[k] = float(p[k])
                except (ValueError, TypeError):
                    pass

        # Ensure all canonical features exist deterministically in correct order
        ordered_feats = {}
        for col in self.feature_cols:
            val = all_feats.get(col, 0.0)
            ordered_feats[col] = float(0.0 if (val is None or np.isnan(val)) else val)

        return ordered_feats

    def build_feature_vector(
        self,
        project_dict: Dict[str, Any],
        doc_dict: Optional[Dict[str, Any]] = None,
        prediction_timestamp: Optional[Any] = None,
    ) -> np.ndarray:
        """Returns a 1D numpy array of shape (176,) in canonical feature ordering."""
        feat_dict = self.extract_features_dict(project_dict, doc_dict, prediction_timestamp)
        return np.array([feat_dict[c] for c in self.feature_cols], dtype=np.float32)

    def build_feature_matrix_from_df(self, df_projects: pd.DataFrame) -> pd.DataFrame:
        """Transforms a DataFrame of raw project rows into the canonical feature matrix."""
        records = []
        for _, row in df_projects.iterrows():
            proj_dict = row.to_dict()
            feat_dict = self.extract_features_dict(proj_dict)
            if "project_id" in proj_dict:
                feat_dict["project_id"] = proj_dict["project_id"]
            records.append(feat_dict)
        return pd.DataFrame(records)
