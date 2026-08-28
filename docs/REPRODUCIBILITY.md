# MPLADS AI Audit — Reproducibility & Execution Guide

## 1. Quickstart: Full Pipeline Execution
To execute the complete end-to-end data generation, validation, feature extraction, multi-model benchmark, calibration, and explainability pipeline:

```bash
# Run full benchmark with deterministic seed (25,000 projects):
python scripts/run_ml_benchmark.py --projects 25000 --seed 42
```

---

## 2. Step-by-Step Modular Execution

### Step 1: Relational Synthetic Data Generation
Generates 12 normalized tables (`01_projects.parquet` to `12_labels.parquet`) with latent scenarios and hard negatives:
```bash
python scripts/generate_synthetic_data.py --projects 25000 --seed 42
```

### Step 2: 15-Point Referential Integrity & Quality Validation
Validates foreign keys, dates, non-negative amounts, and progress bounds:
```bash
python data/validate.py
```

### Step 3: High-Dimensional Feature Engineering (177 Features)
Extracts multi-domain feature matrices into `data/synthetic/features/`:
```bash
python scripts/engineer_features.py
```

### Step 4: Anti-Leakage & Data Cheating Scan
Scans for target leakage, duplicate IDs, and future information:
```bash
python scripts/check_leakage.py
```

### Step 5: Multi-Classifier Benchmark & Model Training
Trains CatBoost, XGBoost, LightGBM, Random Forest, Extra Trees, and Isolation Forest:
```bash
python ml/train.py --model all --seed 42
```

### Step 6: Visual Evaluation & SHAP Reports
Generates confusion matrix, ROC/PR curves, and SHAP summary plots:
```bash
python ml/evaluate.py
```

### Step 7: Single Project Risk Prediction
Runs calibrated risk scoring and SHAP factor attribution for any project:
```bash
python -m ml.predict --project-id MPLADS-000001
```

---

## 3. Automated Test Suite (Pytest)
Run all 111 unit, integration, ML, and security tests:
```bash
make test
```
