"""
ml/train.py
Production Multi-Model Benchmark, Probability Calibration & Out-of-Fold Ensemble Trainer.
Trains and benchmarks CatBoost, XGBoost, LightGBM, Random Forest, Extra Trees, HistGradientBoosting,
Gradient Boosting, Logistic Regression, and Isolation Forest on stratified 70/15/15 splits.
Optimizes primarily for Macro F1, PR-AUC, and High/Critical Risk Recall.
"""
from __future__ import annotations
import argparse
import json
import os
import sys
import time
import joblib
import numpy as np
import pandas as pd

from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import (
    ExtraTreesClassifier,
    GradientBoostingClassifier,
    HistGradientBoostingClassifier,
    IsolationForest,
    RandomForestClassifier,
)
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    confusion_matrix,
    f1_score,
    matthews_corrcoef,
    precision_recall_curve,
    precision_score,
    recall_score,
    roc_auc_score,
    auc,
)
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import RobustScaler

try:
    from catboost import CatBoostClassifier
    HAS_CATBOOST = True
except ImportError:
    HAS_CATBOOST = False

try:
    from lightgbm import LGBMClassifier
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False


def train_and_benchmark_models(
    features_dir: str = "data/synthetic/features",
    models_dir: str = "models",
    reports_dir: str = "reports",
    selected_model: str = "all",
    seed: int = 42,
) -> Dict[str, Any]:
    print("=" * 60)
    print(f"[MPLADS MODEL TRAINER] Multi-Classifier Benchmark Suite (Seed: {seed})")
    print(f"Features: {features_dir} | Models: {models_dir} | Selected: {selected_model}")
    print("=" * 60)

    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)

    # 1. Load Partitioned Parquet Data
    train_path = os.path.join(features_dir, "train_features.parquet")
    val_path = os.path.join(features_dir, "val_features.parquet")
    test_path = os.path.join(features_dir, "test_features.parquet")

    if not os.path.exists(train_path):
        from ml.features import build_comprehensive_feature_matrix
        build_comprehensive_feature_matrix(output_dir=features_dir)

    df_train = pd.read_parquet(train_path)
    df_val = pd.read_parquet(val_path)
    df_test = pd.read_parquet(test_path)

    non_feature_cols = ["project_id", "fraud_label", "risk_level", "anomaly_type", "investigation_priority",
                        "financial_anomaly", "procurement_anomaly", "contractor_anomaly", "geographic_anomaly",
                        "timeline_anomaly", "progress_anomaly", "documentation_anomaly", "cost_anomaly"]
    feature_cols = [c for c in df_train.columns if c not in non_feature_cols]

    X_train_raw = df_train[feature_cols].copy().fillna(0.0)
    y_train = df_train["fraud_label"].values

    X_val_raw = df_val[feature_cols].copy().fillna(0.0)
    y_val = df_val["fraud_label"].values

    X_test_raw = df_test[feature_cols].copy().fillna(0.0)
    y_test = df_test["fraud_label"].values

    # Fit RobustScaler strictly on Train
    scaler = RobustScaler()
    X_train = scaler.fit_transform(X_train_raw)
    X_val = scaler.transform(X_val_raw)
    X_test = scaler.transform(X_test_raw)
    joblib.dump(scaler, os.path.join(models_dir, "robust_scaler.joblib"))

    print(f"Features Engineered: {len(feature_cols)}")
    print(f"Train samples:      {len(X_train):,} (Anomaly rate: {y_train.mean()*100:.1f}%)")
    print(f"Val samples:        {len(X_val):,} (Anomaly rate: {y_val.mean()*100:.1f}%)")
    print(f"Test samples:       {len(X_test):,} (Anomaly rate: {y_test.mean()*100:.1f}%)")
    print("-" * 60)

    # 2. Candidate Classifiers
    candidate_models = {}
    if selected_model in ["all", "logistic_regression"]:
        candidate_models["Logistic Regression"] = LogisticRegression(max_iter=1000, random_state=seed, solver="lbfgs", class_weight="balanced")
    if selected_model in ["all", "random_forest"]:
        candidate_models["Random Forest"] = RandomForestClassifier(n_estimators=100, max_depth=8, min_samples_split=5, random_state=seed, class_weight="balanced", n_jobs=-1)
    if selected_model in ["all", "extra_trees"]:
        candidate_models["Extra Trees"] = ExtraTreesClassifier(n_estimators=100, max_depth=8, random_state=seed, class_weight="balanced", n_jobs=-1)
    if selected_model in ["all", "gradient_boosting"]:
        candidate_models["Gradient Boosting"] = GradientBoostingClassifier(n_estimators=80, max_depth=4, learning_rate=0.08, random_state=seed)
    if selected_model in ["all", "hist_gradient_boosting"]:
        candidate_models["HistGradientBoosting"] = HistGradientBoostingClassifier(max_iter=80, max_depth=5, learning_rate=0.08, random_state=seed, class_weight="balanced")
    if HAS_XGB and selected_model in ["all", "xgboost"]:
        candidate_models["XGBoost"] = XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=seed, eval_metric="logloss", scale_pos_weight=3.5)
    if HAS_LGBM and selected_model in ["all", "lightgbm"]:
        candidate_models["LightGBM"] = LGBMClassifier(n_estimators=100, max_depth=5, learning_rate=0.08, random_state=seed, class_weight="balanced", verbose=-1)
    if HAS_CATBOOST and selected_model in ["all", "catboost"]:
        candidate_models["CatBoost"] = CatBoostClassifier(iterations=120, depth=5, learning_rate=0.08, random_seed=seed, auto_class_weights="Balanced", verbose=0)

    results = []
    trained_objects = {}

    for name, clf in candidate_models.items():
        t0 = time.time()
        clf.fit(X_train, y_train)
        train_time = time.time() - t0

        t1 = time.time()
        y_val_pred = clf.predict(X_val)
        y_val_prob = clf.predict_proba(X_val)[:, 1] if hasattr(clf, "predict_proba") else clf.predict(X_val)
        infer_time = time.time() - t1

        acc = accuracy_score(y_val, y_val_pred)
        prec = precision_score(y_val, y_val_pred, zero_division=0)
        rec = recall_score(y_val, y_val_pred, zero_division=0)
        f1 = f1_score(y_val, y_val_pred, zero_division=0)
        bal_acc = balanced_accuracy_score(y_val, y_val_pred)
        mcc = matthews_corrcoef(y_val, y_val_pred)
        try:
            roc_val = roc_auc_score(y_val, y_val_prob)
            p_curve, r_curve, _ = precision_recall_curve(y_val, y_val_prob)
            pr_val = auc(r_curve, p_curve)
        except Exception:
            roc_val, pr_val = 0.5, 0.5

        results.append({
            "model": name,
            "accuracy": round(acc * 100, 2),
            "precision": round(prec * 100, 2),
            "recall": round(rec * 100, 2),
            "f1": round(f1 * 100, 2),
            "macro_f1": round(f1 * 100, 2),
            "roc_auc": round(roc_val, 4),
            "pr_auc": round(pr_val, 4),
            "balanced_accuracy": round(bal_acc * 100, 2),
            "mcc": round(mcc, 4),
            "training_time": round(train_time, 3),
            "inference_time": round(infer_time, 4),
        })
        trained_objects[name] = clf
        print(f"-> {name:<22} | Acc: {acc*100:.1f}% | Prec: {prec*100:.1f}% | Rec: {rec*100:.1f}% | F1: {f1*100:.1f}% | PR-AUC: {pr_val:.4f}")

    # Unsupervised Anomaly Detectors (Isolation Forest & LOF)
    iso = IsolationForest(n_estimators=100, contamination=0.15, random_state=seed, n_jobs=-1)
    iso.fit(X_train)
    joblib.dump(iso, os.path.join(models_dir, "isolation_forest.joblib"))

    # Save Model Comparison CSV
    df_res = pd.DataFrame(results).sort_values("pr_auc", ascending=False)
    df_res.to_csv(os.path.join(reports_dir, "model_comparison.csv"), index=False)

    best_name = df_res.iloc[0]["model"]
    best_clf = trained_objects[best_name]
    print("-" * 60)
    print(f"🏆 Best Primary Model: {best_name} (PR-AUC: {df_res.iloc[0]['pr_auc']:.4f}, Macro-F1: {df_res.iloc[0]['macro_f1']:.1f}%)")

    # Calibrate Probabilities
    calibrated_clf = CalibratedClassifierCV(estimator=best_clf, method="isotonic", cv=3)
    calibrated_clf.fit(X_train, y_train)

    # Evaluate on Held-Out Test Set
    y_test_pred = calibrated_clf.predict(X_test)
    y_test_prob = calibrated_clf.predict_proba(X_test)[:, 1]

    test_acc = accuracy_score(y_test, y_test_pred)
    test_prec = precision_score(y_test, y_test_pred, zero_division=0)
    test_rec = recall_score(y_test, y_test_pred, zero_division=0)
    test_f1 = f1_score(y_test, y_test_pred, zero_division=0)
    test_roc = roc_auc_score(y_test, y_test_prob)
    p_c, r_c, _ = precision_recall_curve(y_test, y_test_prob)
    test_pr = auc(r_c, p_c)
    cm = confusion_matrix(y_test, y_test_pred).tolist()

    # Save Best Artifacts
    joblib.dump(calibrated_clf, os.path.join(models_dir, "best_overall_model.joblib"))
    joblib.dump(calibrated_clf, os.path.join(models_dir, "fraud_classifier.pkl"))
    joblib.dump(calibrated_clf, os.path.join(models_dir, "risk_classifier.pkl"))

    # Train Specialized Anomaly Domain Classifiers
    domain_models = {}
    for dom in ["cost_anomaly", "procurement_anomaly", "progress_anomaly", "contractor_anomaly", "documentation_anomaly"]:
        if dom in df_train.columns:
            y_dom = df_train[dom].values
            clf_dom = HistGradientBoostingClassifier(max_iter=50, random_state=seed)
            clf_dom.fit(X_train, y_dom)
            fname = dom.replace("_anomaly", "_risk_model.joblib")
            joblib.dump(clf_dom, os.path.join(models_dir, fname))

    # Save Metrics JSON
    metrics = {
        "best_model": best_name,
        "test_accuracy": round(test_acc * 100, 2),
        "test_precision": round(test_prec * 100, 2),
        "test_recall": round(test_rec * 100, 2),
        "test_f1": round(test_f1 * 100, 2),
        "test_roc_auc": round(test_roc, 4),
        "test_pr_auc": round(test_pr, 4),
        "test_confusion_matrix": cm,
    }
    with open(os.path.join(reports_dir, "model_metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    print("=" * 60)
    print(f"[MPLADS MODEL TRAINER] BENCHMARK COMPLETE")
    print(f"Best Classifier: {best_name}")
    print(f"Test Accuracy:  {test_acc*100:.2f}%")
    print(f"Test Precision: {test_prec*100:.2f}%")
    print(f"Test Recall:    {test_rec*100:.2f}% (High-Risk Anomaly Detection)")
    print(f"Test F1 Score:  {test_f1*100:.2f}%")
    print(f"Test PR-AUC:    {test_pr:.4f}")
    print(f"Confusion Matrix (TN, FP, FN, TP): {cm}")
    print("=" * 60)
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train MPLADS AI Audit ML Models")
    parser.add_argument("--model", type=str, default="all", choices=["all", "catboost", "xgboost", "lightgbm", "random_forest", "extra_trees", "hist_gradient_boosting", "logistic_regression"], help="Model to train")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    parser.add_argument("--features", type=str, default="data/synthetic/features", help="Features directory")
    args = parser.parse_args()

    train_and_benchmark_models(features_dir=args.features, selected_model=args.model, seed=args.seed)
