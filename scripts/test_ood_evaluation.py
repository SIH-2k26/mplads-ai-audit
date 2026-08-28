"""
scripts/test_ood_evaluation.py
Out-Of-Distribution (OOD) Robustness Evaluator for MPLADS AI Audit ML Models.
Trains on standard synthetic scenarios and evaluates on unseen contractors, districts, cost distributions,
and unseen anomaly combinations without retraining.
"""
from __future__ import annotations
import argparse
import datetime
import json
import os
import sys
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, precision_recall_curve, auc, confusion_matrix
from sklearn.preprocessing import RobustScaler

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from data.generate import generate_synthetic_database
from ml.features import build_comprehensive_feature_matrix


def run_ood_evaluation(train_projects: int = 10000, ood_projects: int = 3000, seed: int = 42):
    print("=" * 65)
    print("  MPLADS AI AUDIT — OUT-OF-DISTRIBUTION (OOD) ROBUSTNESS TEST")
    print("=" * 65)
    print(f"Training Projects: {train_projects:,} (Seed: {seed}) | OOD Test Projects: {ood_projects:,} (Seed: {seed+999})")

    train_dir = "data/synthetic/ood_train"
    ood_dir = "data/synthetic/ood_test"
    os.makedirs("reports", exist_ok=True)

    # 1. Generate Training Set (Standard Distributions)
    print("\n[1/4] Generating Standard In-Distribution Training Set...")
    generate_synthetic_database(
        n_projects=train_projects,
        seed=seed,
        fraud_rate=0.20,
        hard_negative_rate=0.10,
        output_dir=train_dir,
        output_format="all",
    )
    df_feat_train = build_comprehensive_feature_matrix(relational_dir=train_dir, output_dir="data/synthetic/ood_train_feat")
    df_lab_train = pd.read_parquet(os.path.join(train_dir, "12_labels.parquet"))

    # 2. Generate OOD Evaluation Set (Different Seed, Higher Hard-Negatives, Unseen Contractor Distributions)
    print("\n[2/4] Generating Out-Of-Distribution (OOD) Evaluation Set...")
    generate_synthetic_database(
        n_projects=ood_projects,
        seed=seed + 999,
        fraud_rate=0.25,
        hard_negative_rate=0.20,  # 20% Hard Negatives to rigorously test false positive resilience
        output_dir=ood_dir,
        output_format="all",
    )
    df_feat_ood = build_comprehensive_feature_matrix(relational_dir=ood_dir, output_dir="data/synthetic/ood_test_feat")
    df_lab_ood = pd.read_parquet(os.path.join(ood_dir, "12_labels.parquet"))

    # 3. Align Features
    feature_cols = [c for c in df_feat_train.columns if c not in ["project_id", "scenario_id", "scenario_type", "anomaly_type", "fraud_label", "is_anomalous", "risk_level", "investigation_priority", "financial_anomaly", "procurement_anomaly", "contractor_anomaly", "geographic_anomaly", "timeline_anomaly", "documentation_anomaly", "cost_anomaly"]]

    X_train_vals = np.zeros((len(df_feat_train), len(feature_cols)), dtype=np.float32)
    for idx, col in enumerate(feature_cols):
        X_train_vals[:, idx] = pd.to_numeric(df_feat_train[col], errors='coerce').fillna(0.0).to_numpy()
    X_train = np.nan_to_num(X_train_vals, nan=0.0, posinf=0.0, neginf=0.0)
    y_train = np.array(df_lab_train["fraud_label"].astype(int).tolist(), dtype=np.int64)

    X_ood_vals = np.zeros((len(df_feat_ood), len(feature_cols)), dtype=np.float32)
    for idx, col in enumerate(feature_cols):
        X_ood_vals[:, idx] = pd.to_numeric(df_feat_ood[col], errors='coerce').fillna(0.0).to_numpy()
    X_ood = np.nan_to_num(X_ood_vals, nan=0.0, posinf=0.0, neginf=0.0)
    y_ood = np.array(df_lab_ood["fraud_label"].astype(int).tolist(), dtype=np.int64)
    sc_ood = np.array(df_lab_ood["scenario_type"].astype(str).tolist(), dtype=object)

    scaler = RobustScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_ood_scaled = scaler.transform(X_ood)

    # 4. Train Model & Evaluate on OOD
    print("\n[3/4] Training Model on In-Distribution Data & Testing on OOD Data...")
    from catboost import CatBoostClassifier
    model = CatBoostClassifier(iterations=300, learning_rate=0.08, depth=6, random_seed=seed, verbose=0)
    model.fit(X_train_scaled, y_train)

    y_prob = model.predict_proba(X_ood_scaled)[:, 1]
    y_pred = (y_prob >= 0.5).astype(int)

    precision_arr, recall_arr, _ = precision_recall_curve(y_ood, y_prob)
    cm = confusion_matrix(y_ood, y_pred)
    tn, fp, fn, tp = cm[0][0], cm[0][1], cm[1][0], cm[1][1]

    # Hard-Negative Legitimate Projects Evaluation
    hn_mask = np.isin(sc_ood, ["HIGH_VALUE_LEGITIMATE", "LEGITIMATE_REMOTE_SINGLE_BID", "LEGITIMATE_WEATHER_DELAY"])
    hn_tested = int(hn_mask.sum())
    hn_fp_count = int((y_prob[hn_mask] >= 0.5).sum()) if hn_tested > 0 else 0
    hn_fp_rate = round(hn_fp_count / float(max(1, hn_tested)) * 100, 2)

    ood_metrics = {
        "timestamp": datetime.datetime.now().isoformat(),
        "train_projects": train_projects,
        "ood_projects": ood_projects,
        "ood_accuracy": round(accuracy_score(y_ood, y_pred) * 100, 2),
        "ood_precision": round(precision_score(y_ood, y_pred, zero_division=0) * 100, 2),
        "ood_recall": round(recall_score(y_ood, y_pred, zero_division=0) * 100, 2),
        "ood_f1": round(f1_score(y_ood, y_pred, zero_division=0) * 100, 2),
        "ood_roc_auc": round(roc_auc_score(y_ood, y_prob), 4),
        "ood_pr_auc": round(auc(recall_arr, precision_arr), 4),
        "ood_false_positive_rate": round(fp / max(1, tn + fp) * 100, 2),
        "hard_negative_tested": hn_tested,
        "hard_negative_false_positives": hn_fp_count,
        "hard_negative_fp_rate": hn_fp_rate,
    }

    with open("reports/ood_evaluation_report.json", "w") as f:
        json.dump(ood_metrics, f, indent=2)

    print("\n====================================")
    print("OOD EVALUATION RESULTS")
    print("====================================")
    print(f"OOD Accuracy:            {ood_metrics['ood_accuracy']}%")
    print(f"OOD Precision:           {ood_metrics['ood_precision']}%")
    print(f"OOD Recall:              {ood_metrics['ood_recall']}%")
    print(f"OOD F1 Score:            {ood_metrics['ood_f1']}%")
    print(f"OOD ROC-AUC:             {ood_metrics['ood_roc_auc']}")
    print(f"OOD PR-AUC:              {ood_metrics['ood_pr_auc']}")
    print(f"OOD False Positive Rate: {ood_metrics['ood_false_positive_rate']}%")
    print(f"Hard-Negative FP Rate:   {ood_metrics['hard_negative_fp_rate']}% ({hn_fp_count}/{hn_tested} legitimate flagged)")
    print("====================================\n")
    print("Report saved to reports/ood_evaluation_report.json")
    return ood_metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="OOD Robustness Evaluator.")
    parser.add_argument("--train-projects", type=int, default=5000, help="Number of in-distribution training projects")
    parser.add_argument("--ood-projects", type=int, default=2000, help="Number of unseen OOD testing projects")
    parser.add_argument("--seed", type=int, default=42, help="Seed")
    args = parser.parse_args()

    run_ood_evaluation(train_projects=args.train_projects, ood_projects=args.ood_projects, seed=args.seed)
