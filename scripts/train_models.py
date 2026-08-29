"""
scripts/train_models.py
Entrypoint script for training and benchmarking all ML classifiers.
Calls ml.train.train_and_benchmark_models.
"""
from __future__ import annotations
import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from ml.train import train_and_benchmark_models


def train_models(data_path: str = "data/processed/project_risk_training.parquet", models_dir: str = "models", reports_dir: str = "reports"):
    return train_and_benchmark_models(features_dir="data/synthetic/features", models_dir=models_dir, reports_dir=reports_dir, selected_model="all")


if __name__ == "__main__":
    train_models()
