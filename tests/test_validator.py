"""
tests/test_validator.py
Unit and Integration tests for data/validate.py strict validation framework.
"""
import os
import shutil
import tempfile
import pytest
from data.generate import generate_synthetic_database
from data.validate import run_data_validation


@pytest.fixture(scope="module")
def valid_dataset_dir():
    temp_dir = tempfile.mkdtemp(prefix="mplads_val_valid_")
    generate_synthetic_database(
        n_projects=500,
        seed=42,
        fraud_rate=0.20,
        hard_negative_rate=0.10,
        output_dir=temp_dir,
        output_format="parquet"
    )
    yield temp_dir
    shutil.rmtree(temp_dir, ignore_errors=True)


def test_validator_on_clean_data(valid_dataset_dir):
    exit_code, summary = run_data_validation(
        input_dir=valid_dataset_dir,
        strict_mode=False
    )
    assert exit_code in [0, 1]  # 0 (clean) or 1 (warnings only)
    assert summary["critical_errors"] == 0
    assert summary["total_projects"] == 500


def test_validator_fails_on_missing_table():
    empty_dir = tempfile.mkdtemp(prefix="mplads_val_empty_")
    exit_code, summary = run_data_validation(input_dir=empty_dir)
    assert exit_code == 2
    shutil.rmtree(empty_dir, ignore_errors=True)


def test_validator_strict_mode(valid_dataset_dir):
    exit_code, summary = run_data_validation(
        input_dir=valid_dataset_dir,
        strict_mode=True
    )
    assert exit_code in [0, 1]
    assert summary["critical_errors"] == 0
