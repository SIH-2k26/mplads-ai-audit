# MPLADS AI Audit — Comprehensive Data & ML Pipeline Audit

## 1. Executive Overview
This document fulfills **Phase 0 (Repository Audit)** for the **AGASTYA / MPLADS AI Audit** system. It assesses the existing data assets, schemas, feature pipelines, model artifacts, leakage controls, class balance, and test coverage before assembling the unified production ML benchmark.

---

## 2. Inventory of Existing Repository Assets

### A. Data & Synthetic Generators
- **Relational Tables (`data/synthetic/relational/`):** 12 core Parquet + CSV tables (`01_projects` to `12_labels`).
- **Feature Datasets (`data/synthetic/features/` & `data/processed/`):** `train_features.parquet` (70%), `val_features.parquet` (15%), `test_features.parquet` (15%).
- **Regulatory Datasets (`data/regulatory/`):** Official norm rules (`regulatory_rules.parquet`), CAG audit observations (`cag_audit_patterns.parquet`), and source registries.
- **Generator Scripts (`scripts/generate_synthetic_data.py` & `data/generate.py`):** Relational population generator incorporating realistic correlation patterns and domain bounds.

### B. Validation & Integrity Checkers
- **Data Quality Validator (`data/validate.py` & `scripts/validate_dataset.py`):** 15-point referential integrity, foreign key validation, date chronology checks, non-negative amounts, and physical progress [0, 100] assertions.

### C. Feature Engineering & Leakage Protection
- **Multi-Domain Feature Extractor (`ml/features.py`):** 177 derived features across Financial, Temporal Velocity, Contractor Network, Procurement Spread, Geospatial Proximity, Document Integrity, and Deterministic Compliance Violations.
- **Leakage Checkers (`scripts/check_leakage.py`):** Scans for target variable leakage, duplicate project IDs across train/test splits, and synthetic scenario ID leakage.

### D. Model Training, Calibration & Inference
- **Multi-Classifier Suite (`ml/train.py`):** CatBoost, XGBoost, LightGBM, Random Forest, Extra Trees, HistGradientBoosting, Gradient Boosting, Logistic Regression, and Isolation Forest.
- **Ensemble & Calibration Engine (`ml/ensemble.py`):** Probability calibration (Isotonic), weighted meta-fusion, compounded red flag multipliers, and rule engine integration.
- **Explainability Engine (`ml/evaluate.py`):** SHAP summary generation, feature importance ranking, ROC/PR curves, and confusion matrix visual reports.
- **CLI & REST Prediction (`ml/predict.py` & `backend/api/`):** Explainable inference outputting `risk_score`, `risk_level`, `top_risk_factors`, and `recommended_action`.

---

## 3. Identified Pipeline Gaps & Planned Enhancements

| Area | Current State | Planned Phase Enhancement |
|---|---|---|
| **Data Architecture** | 12 tables in relational directory. | Expand to 24 formal logical entities in [`docs/DATA_SCHEMA.md`](file:///Users/sukrutdusane/Documents/Projects%20/Sy/mplads-ai-audit/docs/DATA_SCHEMA.md) with stable foreign keys. |
| **Class Distribution** | Binary ~21.5% fraud rate. | Configure realistic multi-tier distribution: 65% Normal, 10% Hard Negatives, 12% Single Anomaly, 8% Multi-Anomaly, 4% Suspicious, 1% Critical. |
| **Split Partitions** | Standard Stratified 70/15/15. | Add separate **Temporal Holdout Test** (`temporal_test.parquet`) and **Adversarial Hard-Negative Test** (`hard_negatives_test.parquet`). |
| **Model Registry & Versioning**| Direct `models/` artifacts. | Formalize structured subdirectories (`models/baseline/`, `models/tuned/`, `models/ensemble/`, `models/calibrated/`, `models/metadata/`). |
| **Automated Benchmarking**| `scripts/train_models.py` | Create single-command runner `scripts/run_ml_benchmark.py` running validation -> leakage scan -> tuning -> calibration -> SHAP -> HTML report. |
| **Documentation & Model Card**| Technical reports in `reports/`. | Create [`docs/MODEL_CARD.md`](file:///Users/sukrutdusane/Documents/Projects%20/Sy/mplads-ai-audit/docs/MODEL_CARD.md), [`docs/DATA_GENERATION.md`](file:///Users/sukrutdusane/Documents/Projects%20/Sy/mplads-ai-audit/docs/DATA_GENERATION.md), and [`docs/REPRODUCIBILITY.md`](file:///Users/sukrutdusane/Documents/Projects%20/Sy/mplads-ai-audit/docs/REPRODUCIBILITY.md). |
| **ML Auditor Inspection**| Static metric logs. | Perform 18-point ML Auditor Inspection in [`reports/ml/FINAL_ML_AUDIT.md`](file:///Users/sukrutdusane/Documents/Projects%20/Sy/mplads-ai-audit/reports/ml/FINAL_ML_AUDIT.md). |

---

## 4. Leakage & Cheating Prevention Rules
1. **Target Leakage Prohibition:** Under no circumstances will `fraud_binary`, `risk_level`, `anomaly_type`, or `investigation_priority` be included in feature matrix $X$.
2. **Deterministic Reproducibility:** Fixed random seed `SEED=42` must be used across all split, generation, and training modules.
3. **Out-of-Fold / Test Isolation:** Probability threshold optimization and meta-ensemble training must only occur on training/validation folds; the held-out test, temporal test, and hard-negative test partitions must remain strictly untouched until final benchmark evaluation.
