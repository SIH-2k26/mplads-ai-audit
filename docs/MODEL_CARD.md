# Sanchay AI — Model Card

## Model Details
- **Model Name:** Sanchay Anomaly & Statutory Risk Predictor
- **Model Version:** `sanchay-risk-v2.0.0`
- **Architecture:** Gradient Boosted Decision Tree (Random Forest / CatBoost / XGBoost / LightGBM) with 5-Fold Stratified Cross-Validation and 3-Fold Platt Scaling Calibration.
- **Unsupervised Anomaly Model:** Isolation Forest (multivariate outlier detection).
- **Ensemble Policy:** Versioned Multi-Component Risk Fusion (`configs/risk_policy_v1.yaml`).
- **Release Date:** August 2026

---

## Intended Use & Scope
- **Primary Use Case:** Proactive audit risk screening and statutory anomaly detection for public infrastructure works under the Members of Parliament Local Area Development Scheme (MPLADS).
- **Target Users:** District Collectors, District Planning Officers, Ministry of Statistics & Programme Implementation (MoSPI) Audit Vigilance Teams, and Parliamentary Auditors.
- **Decision Support Principle:** This system provides **probabilistic risk screening and statutory compliance indicators**. It does **NOT** independently establish judicial or criminal fraud. All flags require verified on-site physical inspection and certified Measurement Book verification by authorized officers.

---

## Training & Evaluation Data
- **Internal Dataset:** 25,000 synthetic projects encompassing 12 normalized relational tables, 600+ districts across 18 States/UTs, realistic contractor entities, and transactional payment series.
- **Canonical Feature Count:** 176 tabular features across 7 domains (Financial, Temporal Velocity, Contractor Network, Procurement Spread, Geospatial Proximity, Document Integrity, and Statutory Rule Signals).
- **Cross-Validation:** 5-Fold Stratified Cross-Validation on 85% training partition with Out-Of-Fold (OOF) evaluation.
- **Internal Test Split:** 15% held-out test partition (3,750 projects).
- **Independent External Holdout (Generator B):** 2,000 projects generated via independent orthogonal fraud mechanisms (Cartel Rotation Rings, Rapid Tranche Draining, Split Tendering, and Document Masking).

---

## Empirical Benchmark Performance

| Evaluation Split | Model / Configuration | PR-AUC | ROC-AUC | F1-Score | Brier Score | ECE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **5-Fold CV (OOF)** | Random Forest | **0.9313 (±0.0117)** | 0.9412 | **0.8904** | **0.0329** | 0.0278 |
| **5-Fold CV (OOF)** | CatBoost | 0.9269 (±0.0131) | 0.9388 | 0.8745 | 0.0362 | **0.0156** |
| **5-Fold CV (OOF)** | XGBoost | 0.9230 (±0.0131) | 0.9354 | 0.8767 | 0.0379 | 0.0195 |
| **5-Fold CV (OOF)** | LightGBM | 0.9228 (±0.0127) | 0.9341 | 0.8722 | 0.0384 | 0.0151 |
| **5-Fold CV (OOF)** | HistGradientBoosting | 0.9247 (±0.0137) | 0.9360 | 0.8818 | 0.0371 | 0.0317 |
| **5-Fold CV (OOF)** | Logistic Regression | 0.8564 (±0.0193) | 0.8841 | 0.5640 | 0.2023 | 0.3581 |
| **Internal Test (15%)**| Random Forest (Platt Calibrated) | **0.9182** | **0.9323** | **0.8857** | **0.0341** | **0.0095** |
| **Generator B External Holdout** | Random Forest (Unseen Mechanisms) | **0.1871** | **0.4733** | **0.0000** | **0.1857** | N/A |

### Scientific Finding & Discussion
The dramatic performance drop on the independent Generator B holdout (PR-AUC 0.9182 -> 0.1871) confirms that models trained on specific synthetic fraud heuristics do not magically generalize to unmodeled, novel cartel mechanisms. Sanchay AI addresses this by combining the statistical ML model with:
1. **Deterministic Statutory Rules** (GFR 2017 & MPLADS 2023 Guidelines).
2. **Unsupervised Outlier Detection** (Isolation Forest).
3. **Graph Network Intelligence** (Contractor relationship syndicates).

---

## Known Limitations & Ethical Safeguards
1. **Synthetic Base:** While relationally structured, synthetic baselines lack real unrecorded field nuances.
2. **Entity Leakage Mitigation:** Cross-validation is evaluated with group holdouts to prevent contractor memorization.
3. **Human-in-the-Loop:** Automated disbursement freezing is restricted to advisory recommendations; all administrative actions require human sign-off.
