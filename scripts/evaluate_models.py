"""
scripts/evaluate_models.py
Entrypoint script for evaluating models and generating visual reports.
Calls ml.evaluate.evaluate_and_generate_reports.
"""
from __future__ import annotations
import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from ml.evaluate import evaluate_and_generate_reports


def evaluate_models(data_path: str = "data/processed/project_risk_training.parquet", models_dir: str = "models", reports_dir: str = "reports"):
    return evaluate_and_generate_reports(features_dir="data/synthetic/features", models_dir=models_dir, reports_dir=reports_dir, docs_dir="docs")


if __name__ == "__main__":
    evaluate_models()
