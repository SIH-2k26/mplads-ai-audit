"""
scripts/benchmark_pipeline.py
Multi-Configuration Benchmark Matrix for MPLADS AI Audit ML Models.
Evaluates model stability, precision, recall, and hard negative false-positive rates across 7 diverse configurations.
"""
from __future__ import annotations
import argparse
import datetime
import json
import os
import sys
from typing import Any, Dict, List
import pandas as pd

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from scripts.test_pipeline import run_pipeline_test

BENCHMARK_CONFIGS = [
    {"name": "TEST 1", "projects": 5000, "seed": 42, "fraud_rate": 0.20, "hard_negative_rate": 0.10},
    {"name": "TEST 2", "projects": 10000, "seed": 43, "fraud_rate": 0.20, "hard_negative_rate": 0.10},
    {"name": "TEST 3", "projects": 25000, "seed": 44, "fraud_rate": 0.20, "hard_negative_rate": 0.10},
    {"name": "TEST 4", "projects": 25000, "seed": 45, "fraud_rate": 0.10, "hard_negative_rate": 0.15},
    {"name": "TEST 5", "projects": 25000, "seed": 46, "fraud_rate": 0.30, "hard_negative_rate": 0.10},
    {"name": "TEST 6", "projects": 25000, "seed": 100, "fraud_rate": 0.20, "hard_negative_rate": 0.20},
]


def run_benchmark_suite(quick_mode: bool = False):
    print("=" * 65)
    print("  MPLADS AI AUDIT — MULTI-DATASET BENCHMARK MATRIX")
    print("=" * 65)

    os.makedirs("reports", exist_ok=True)
    configs = BENCHMARK_CONFIGS[:2] if quick_mode else BENCHMARK_CONFIGS

    results: List[Dict[str, Any]] = []

    for cfg in configs:
        print(f"\n>>> Running Benchmark: {cfg['name']} ({cfg['projects']:,} projects, seed={cfg['seed']}, fraud={cfg['fraud_rate']*100:.0f}%, hard_neg={cfg['hard_negative_rate']*100:.0f}%)")
        res = run_pipeline_test(
            n_projects=cfg["projects"],
            seed=cfg["seed"],
            fraud_rate=cfg["fraud_rate"],
            hard_negative_rate=cfg["hard_negative_rate"],
            test_size=0.20,
        )

        best_m = res["models"].get("LightGBM") or res["models"].get("CatBoost") or list(res["models"].values())[0]
        fp_stats = res["false_positive_analysis"]

        row = {
            "test_name": cfg["name"],
            "projects": cfg["projects"],
            "seed": cfg["seed"],
            "fraud_rate": cfg["fraud_rate"],
            "hard_negative_rate": cfg["hard_negative_rate"],
            "accuracy": best_m["accuracy"],
            "precision": best_m["precision"],
            "recall": best_m["recall"],
            "f1": best_m["f1"],
            "roc_auc": best_m["roc_auc"],
            "pr_auc": best_m["pr_auc"],
            "false_positive_rate": round(fp_stats["false_positive_rate"] * 100, 2),
            "hard_negative_fp_rate": fp_stats["hard_negative_fp_rate"],
        }
        results.append(row)

    df_res = pd.DataFrame(results)
    df_res.to_csv("reports/model_benchmark.csv", index=False)
    with open("reports/model_benchmark.json", "w") as f:
        json.dump(results, f, indent=2)

    print("\n" + "=" * 65)
    print("BENCHMARK MATRIX SUMMARY TABLE")
    print("=" * 65)
    print(df_res.to_string(index=False))
    print("=" * 65)
    print("Saved: reports/model_benchmark.csv & reports/model_benchmark.json\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Benchmark Matrix Runner.")
    parser.add_argument("--quick", action="store_true", help="Run quick 2-test benchmark")
    args = parser.parse_args()

    run_benchmark_suite(quick_mode=args.quick)
