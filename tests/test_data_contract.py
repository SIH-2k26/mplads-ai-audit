"""
tests/test_data_contract.py
Mandatory Data Contract & Feature Consistency Tests for Sanchay AI.
Verifies:
1. Training features == Inference features for identical project inputs (Zero Drift).
2. Point-in-time filtering rejects future data.
3. Missing values produce deterministic default semantics.
"""
from __future__ import annotations
from datetime import datetime, timedelta
import numpy as np
import pytest

from ml.features.builder import FeatureBuilder
from ml.features.schema import CANONICAL_FEATURES
from ml.inference import ModelInferenceService


def test_training_inference_feature_parity():
    """Guarantees exact feature match between FeatureBuilder and ModelInferenceService."""
    sample_project = {
        "project_id": "MPLADS-TEST-001",
        "sanction_amount": 3000000.0,
        "estimated_cost": 2900000.0,
        "actual_cost": 2400000.0,
        "fund_released": 3000000.0,
        "tender_amount": 2850000.0,
        "physical_progress": 80.0,
        "financial_progress": 80.0,
        "planned_duration_days": 180,
        "actual_duration_days": 190,
        "bid_count": 5,
        "single_bid_flag": 0,
        "contractor_past_irregularity_rate": 0.04,
        "missing_mb_flag": 0,
        "missing_uc_flag": 0,
        "missing_geotag_flag": 0,
        "district_population": 1200000.0,
        "population_density": 500.0,
        "literacy_rate": 82.0,
        "poverty_rate": 15.0,
    }

    doc_dict = {
        "administrative_sanction": True,
        "technical_sanction": True,
        "dpr": True,
        "work_order": True,
        "measurement_book": True,
        "utilization_certificate": True,
        "completion_certificate": True,
        "geo_tagged_photos": True,
    }

    # 1. FeatureBuilder extraction
    builder = FeatureBuilder()
    fb_dict = builder.extract_features_dict(sample_project, doc_dict)
    fb_vec = builder.build_feature_vector(sample_project, doc_dict)

    # 2. ModelInferenceService extraction
    inf_service = ModelInferenceService()
    scaled_vec, inf_dict = inf_service.extract_features_from_dict(sample_project, doc_dict)

    # Assert all canonical columns exist in both
    assert len(fb_dict) == len(CANONICAL_FEATURES)
    assert len(inf_dict) == len(CANONICAL_FEATURES)
    assert len(fb_vec) == len(CANONICAL_FEATURES)

    # Assert exact value equality across all features
    for col in CANONICAL_FEATURES:
        v_fb = fb_dict[col]
        v_inf = inf_dict[col]
        assert np.isclose(v_fb, v_inf, atol=1e-5), f"Feature drift detected for '{col}': FB={v_fb} != INF={v_inf}"


def test_point_in_time_feature_filtering():
    """Verifies that future transactional records after prediction_timestamp are strictly filtered."""
    base_date = datetime(2024, 1, 1)
    pred_date = datetime(2024, 6, 1)
    future_date = datetime(2024, 9, 1)

    project_with_future_payments = {
        "project_id": "MPLADS-TEMPORAL-001",
        "sanction_date": "2024-01-01",
        "work_order_date": "2024-02-01",
        "payments": [
            {"payment_date": "2024-03-01", "amount": 500000.0},
            {"payment_date": "2024-05-01", "amount": 500000.0},
            {"payment_date": "2024-09-01", "amount": 1500000.0},  # FUTURE PAYMENT
        ],
        "sanction_amount": 2500000.0,
        "actual_cost": 1000000.0,
    }

    builder = FeatureBuilder()
    feats_as_of_june = builder.extract_features_dict(
        project_with_future_payments,
        prediction_timestamp=pred_date,
    )

    # Only 2 payments occurred prior to June 1, 2024
    assert feats_as_of_june["payment_count"] == 2.0


def test_missing_value_semantics():
    """Verifies that missing flags and metrics behave deterministically."""
    empty_project = {
        "project_id": "MPLADS-EMPTY-001",
        "sanction_amount": 1000000.0,
    }

    builder = FeatureBuilder()
    feats = builder.extract_features_dict(empty_project)

    assert not np.isnan(feats["cost_to_sanction_ratio"])
    assert not np.isinf(feats["cost_to_sanction_ratio"])
    assert feats["missing_mb_flag"] == 0.0  # default docs present unless flagged
