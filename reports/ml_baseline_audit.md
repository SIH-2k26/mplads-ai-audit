# MPLADS AI Audit — ML Pipeline Baseline Audit Report

## 1. Executive Summary & Audit Context
This audit reviews the baseline state of the **MPLADS AI Audit (AGASTYA)** machine learning pipeline prior to Phase 2 enhancements.

The system is designed to perform **multi-risk fraud and irregularity detection** on MPLADS public work projects, identifying subtle anomalies such as progress-payment divergence, single-bid procurement collusion, cost inflation over Schedule of Rates (SOR), ghost works, and contractor monopolies.

---

## 2. Current Architecture & Pipeline Components

```
                RELATIONAL RAW DATA (18 Tables)
              (data/synthetic/relational/*.parquet)
                               │
                               ▼
               15-POINT DATA QUALITY VALIDATOR
                      (data/validate.py)
                               │
                               ▼
               MULTI-DOMAIN FEATURE EXTRACTOR
                     (ml/features.py)
                               │
                               ▼
                ANTI-LEAKAGE VERIFICATION SCAN
                  (scripts/check_leakage.py)
                               │
                               ▼
               MULTI-CLASSIFIER BENCHMARK SUITE
             (Logistic, Trees, XGB, LGBM, IsoForest)
                               │
                               ▼
                  HYBRID RISK ENSEMBLE ENGINE
                       (ml/ensemble.py)
                               │
                               ▼
               REST API & EXPLAINABLE INFERENCE
                   (POST /api/v1/risk/analyze)
```

---

## 3. Current Pipeline Baseline Evaluation

| Dimension | Baseline State | Audit Findings & Improvement Areas |
|---|---|---|
| **Dataset Schema** | 18 Relational tables in `data/synthetic/relational/` (10,000–100,000 projects). | Normalized structure is robust; requires extended relational aggregations (e.g. contractor-agency repeat rate, pairwise bid spread). |
| **Feature Registry** | 71 Extracted features across 7 domains. | Good baseline; missing dedicated temporal velocity, contractor network centrality, and explicit rule-violation counters. |
| **Target Variables** | Binary `fraud_label` (0/1) + 4-class `risk_level` (LOW/MED/HIGH/CRIT). | Need explicit multi-target anomaly flags (`financial_anomaly`, `procurement_anomaly`, `contractor_anomaly`, etc.). |
| **Class Distribution** | ~78% Legitimate, 12% Suspicious, 7% High Risk, 3% Critical. | Realistic imbalanced distribution; requires class-weight balancing and stratified validation. |
| **Validation Strategy**| Stratified 70% Train / 15% Val / 15% Held-out Test. | Leakage-free; will benefit from GroupKFold by contractor and temporal holdout testing. |
| **Model Families** | Logistic Regression, Random Forest, Extra Trees, HistGB, XGBoost, LightGBM, Isolation Forest. | Add CatBoost, LocalOutlierFactor, and weighted out-of-fold meta-ensembling. |
| **Metrics Prioritization**| Accuracy, Precision, Recall, F1, ROC-AUC, PR-AUC. | Emphasize Macro-F1, PR-AUC, and HIGH/CRITICAL risk recall over raw accuracy. |

---

## 4. Leakage & Overfitting Risks Identified
1. **Target Leakage:** `scenario_type` and `investigation_verdict` must strictly remain excluded from the feature inputs $X$.
2. **Contractor Overfitting:** Without contractor-level grouping or generalized ratio features, tree models could memorize specific contractor IDs. All contractor features must be normalized ratios (`win_rate`, `past_irregularity_rate`, `capacity_strain`).
3. **Over-Separability:** Anomalies must not be defined by trivial binary flags (`delay_days > 500`); instead, they must emerge from multi-parameter statistical interactions (e.g. Single-bid + rapid payment + low physical progress + missing MB).

---

## 5. Phase 2 Enhancement Plan
- [x] Integrate CatBoost for primary tabular boosting.
- [x] Extend feature pipeline to 100+ multi-domain features (Financial, Temporal Velocity, Contractor Network, Procurement Spread, Geographic Proximity, Document Integrity, Deterministic Compliance Violations).
- [x] Support multi-target output (Risk Tier + Anomaly Categories).
- [x] Build Optuna hyperparameter optimization prioritizing Macro-F1 and High-Risk Recall.
- [x] Generate visual SHAP summary and feature importance reports.
