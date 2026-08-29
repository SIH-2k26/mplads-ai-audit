"""
tests/test_generator.py
Comprehensive unit tests for the deterministic synthetic MPLADS relational generator.
"""
import os
import shutil
import tempfile
import pytest
import pandas as pd
from data.generate import generate_synthetic_database


@pytest.fixture(scope="module")
def temp_dataset():
    temp_dir = tempfile.mkdtemp(prefix="mplads_test_gen_")
    res = generate_synthetic_database(
        n_projects=500,
        seed=42,
        fraud_rate=0.20,
        hard_negative_rate=0.10,
        output_dir=temp_dir,
        output_format="parquet"
    )
    manifest = res.get("manifest", res)
    yield temp_dir, manifest
    shutil.rmtree(temp_dir, ignore_errors=True)


def test_generator_determinism():
    dir1 = tempfile.mkdtemp(prefix="mplads_det1_")
    dir2 = tempfile.mkdtemp(prefix="mplads_det2_")

    generate_synthetic_database(n_projects=100, seed=123, output_dir=dir1, output_format="parquet")
    generate_synthetic_database(n_projects=100, seed=123, output_dir=dir2, output_format="parquet")

    df1 = pd.read_parquet(os.path.join(dir1, "01_projects.parquet"))
    df2 = pd.read_parquet(os.path.join(dir2, "01_projects.parquet"))

    pd.testing.assert_frame_equal(df1, df2)

    shutil.rmtree(dir1, ignore_errors=True)
    shutil.rmtree(dir2, ignore_errors=True)


def test_unique_primary_keys(temp_dataset):
    temp_dir, _ = temp_dataset
    df_p = pd.read_parquet(os.path.join(temp_dir, "01_projects.parquet"))
    assert df_p["project_id"].nunique() == len(df_p)

    df_pay = pd.read_parquet(os.path.join(temp_dir, "03_payments.parquet"))
    assert df_pay["payment_id"].nunique() == len(df_pay)


def test_foreign_key_integrity(temp_dataset):
    temp_dir, _ = temp_dataset
    df_p = pd.read_parquet(os.path.join(temp_dir, "01_projects.parquet"))
    df_f = pd.read_parquet(os.path.join(temp_dir, "02_financials.parquet"))
    df_c = pd.read_parquet(os.path.join(temp_dir, "07_contractors.parquet"))
    df_a = pd.read_parquet(os.path.join(temp_dir, "08_agencies.parquet"))
    df_g = pd.read_parquet(os.path.join(temp_dir, "09_geography.parquet"))

    # Financials PK/FK
    assert df_f["project_id"].isin(df_p["project_id"]).all()
    # Contractors FK
    assert df_p["contractor_id"].isin(df_c["contractor_id"]).all()
    # Agency FK
    assert df_p["agency_id"].isin(df_a["agency_id"]).all()
    # District FK
    assert df_p["district_id"].isin(df_g["district_id"]).all()


def test_valid_financial_values(temp_dataset):
    temp_dir, _ = temp_dataset
    df_f = pd.read_parquet(os.path.join(temp_dir, "02_financials.parquet"))
    assert (df_f["sanctioned_amount"] >= 0).all()
    assert (df_f["actual_expenditure"] >= 0).all()
    assert (df_f["unspent_balance"] >= 0).all()


def test_valid_dates_and_chronology(temp_dataset):
    temp_dir, _ = temp_dataset
    df_p = pd.read_parquet(os.path.join(temp_dir, "01_projects.parquet"))
    rec_dates = pd.to_datetime(df_p["recommendation_date"])
    sanc_dates = pd.to_datetime(df_p["sanction_date"])
    assert (sanc_dates >= rec_dates).all()


def test_progress_bounds(temp_dataset):
    temp_dir, _ = temp_dataset
    df_prog = pd.read_parquet(os.path.join(temp_dir, "04_progress.parquet"))
    assert (df_prog["physical_progress"] >= 0).all()
    assert (df_prog["physical_progress"] <= 100).all()


def test_coordinate_bounds_for_india(temp_dataset):
    temp_dir, _ = temp_dataset
    df_p = pd.read_parquet(os.path.join(temp_dir, "01_projects.parquet"))
    assert (df_p["project_latitude"] >= 6.0).all() and (df_p["project_latitude"] <= 38.0).all()
    assert (df_p["project_longitude"] >= 67.0).all() and (df_p["project_longitude"] <= 98.0).all()


def test_class_balance_and_hard_negatives(temp_dataset):
    temp_dir, manifest = temp_dataset
    assert manifest["fraud_rate"] > 0.10 and manifest["fraud_rate"] < 0.35
    assert manifest["hard_negative_rate"] >= 0.05
