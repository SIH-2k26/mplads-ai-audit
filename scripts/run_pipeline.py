"""
scripts/run_pipeline.py
End-to-End Pipeline Runner for MPLADS Synthetic Data, Feature Engineering, and Multi-Risk ML Training.
Executes: Generation -> Validation -> Feature Engineering -> Training -> Evaluation -> Reporting.
"""
from __future__ import annotations
import argparse
import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from scripts.generate_synthetic_data import generate_relational_data
from scripts.validate_dataset import validate_dataset
from scripts.engineer_features import engineer_features
from scripts.train_models import train_models
from scripts.evaluate_models import evaluate_models


def run_full_pipeline(projects: int = 10000, seed: int = 42):
    print("\n" + "#" * 70)
    print(f" MPLADS AI AUDIT — FULL DATA & ML TRAINING PIPELINE (Projects: {projects:,}, Seed: {seed})")
    print("#" * 70 + "\n")

    # Step 1: Relational Data Generation
    generate_relational_data(num_projects=projects, seed=seed)

    # Step 2: Referential Integrity & Data Quality Validation
    passed = validate_dataset()
    if not passed:
        print("[ERROR] Dataset validation failed. Halting pipeline.")
        sys.exit(1)

    # Step 3: High-Dimensional Feature Engineering
    engineer_features()

    # Step 4: Multi-Model Training & Benchmark
    train_models()

    # Step 5: Visual Evaluation & Explainability Reports
    evaluate_models()

    print("\n" + "#" * 70)
    print(" [SUCCESS] PIPELINE EXECUTION COMPLETED SUCCESSFULLY!")
    print("#" * 70 + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Full MPLADS Data & ML Pipeline")
    parser.add_argument("--projects", type=int, default=10000, help="Total projects to generate")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility")
    args = parser.parse_args()

    run_full_pipeline(projects=args.projects, seed=args.seed)
