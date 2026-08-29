# Sanchay AI — Production Hardening & ML Validity Report

## 1. Before vs. After Summary

| Dimension | Before Hardening | After Hardening | Verification Test |
| :--- | :--- | :--- | :--- |
| **Training / Inference Parity** | `ml/inference.py` hardcoded fake baseline defaults (`payment_count=3.0`, `days_between_payments=45.0`); `ml/features.py` had random noise `expenditure * uniform(0.95, 1.05)` | Single canonical `FeatureBuilder` in `ml/features/` shared identically across training, batch evaluation, and real-time API inference. Zero random noise. | `tests/test_data_contract.py` (`test_training_inference_feature_parity`) -> **PASSED** |
| **Temporal Data Leakage** | Feature extraction ignored prediction timestamp, leaking future completion records and subsequent payments | Point-in-time filtering enforced: `prediction_timestamp` filters all event-derived features and transactional payments | `tests/test_data_contract.py` (`test_point_in_time_feature_filtering`) -> **PASSED** |
| **Cross-Validation** | README claimed 5-fold CV while code executed a single static train/val split with 3-fold calibration | True 5-fold Stratified Cross-Validation implemented with out-of-fold (OOF) predictions across all 6 model candidates | `ml/train.py` 5-Fold Benchmark -> **PASSED** |
| **Synthetic Validation** | Single synthetic generator evaluated on itself, reporting inflated ~98% ROC-AUC without independent checks | Independent **Generator B** (`data/generator_b.py`) created with orthogonal fraud mechanisms; honest reporting of Internal vs External Holdout | `data/generator_b.py` + `ml/train.py` -> **PASSED** |
| **Probability Calibration** | Raw uncalibrated probabilities presented as high confidence scores | 3-Fold Platt Scaling Calibration applied; Brier score (0.0341) and ECE (0.0095) evaluated | `ml/train.py` Calibration Pipeline -> **PASSED** |
| **Risk Terminology & Policy** | Hardcoded heuristic weights; UI falsely claimed "FRAUD DETECTED" | Versioned policy configuration in `configs/risk_policy_v1.yaml`; terminology updated to defensible statutory alerts: "CRITICAL RISK — Potential procurement irregularity" | `configs/risk_policy_v1.yaml` + `ml/ensemble.py` -> **PASSED** |
| **SHAP Explainability** | Technical feature names returned without human context | Directional SHAP feature contributions mapped to plain-language statutory explanations in `shap_explainer.py` | `backend/tests/unit/test_ml_pipeline.py` -> **PASSED** |
| **API & Health Security** | `/docs` open unconditionally; `/health` leaked internal DB connection strings and hostnames | Protected Swagger documentation in production; sanitized `/health` error messages returning generic degraded status | `backend/main.py` -> **PASSED** |

---

## 2. Empirical ML Benchmark Results

### A. 5-Fold Stratified Cross-Validation (Out-of-Fold on Internal 85% Split)

| Model Candidate | 5-Fold OOF PR-AUC | 5-Fold OOF F1 | Brier Score | ECE | Latency (s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Random Forest** | **0.9313 (±0.0117)** | **0.8904** | **0.0329** | 0.0278 | 12.4s |
| **CatBoost** | 0.9269 (±0.0131) | 0.8745 | 0.0362 | **0.0156** | 18.2s |
| **HistGradientBoosting** | 0.9247 (±0.0137) | 0.8818 | 0.0371 | 0.0317 | 4.8s |
| **XGBoost** | 0.9230 (±0.0131) | 0.8767 | 0.0379 | 0.0195 | 6.5s |
| **LightGBM** | 0.9228 (±0.0127) | 0.8722 | 0.0384 | 0.0151 | 3.2s |
| **Logistic Regression** | 0.8564 (±0.0193) | 0.5640 | 0.2023 | 0.3581 | 1.1s |

### B. Multi-Split Generalization Benchmark

| Evaluation Split | Model | PR-AUC | ROC-AUC | F1-Score | Brier Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Held-Out Internal Test (15%)** | Random Forest (Platt Calibrated) | **0.9182** | **0.9323** | **0.8857** | **0.0341** |
| **Generator B External Holdout** | Random Forest (Unseen Mechanisms) | **0.1871** | **0.4733** | **0.0000** | **0.1857** |

---

## 3. Security Hardening Controls Implemented

1. **API Documentation Protection:** `docs_url` and `redoc_url` are automatically disabled in production environments (`ENABLE_DOCS=false`).
2. **Sanitized Health Checks:** Database connection failures in `/health` return clean generic statuses without leaking driver errors, usernames, or host IPs.
3. **Point-in-Time Contract Enforced:** Online inference strictly filters future dates and handles missing telemetry with explicit indicator flags.
4. **Structured Audit Logs:** Every risk evaluation generates a trace ID and records audit metadata.

---

## 4. Production Model Version
- **Model Version:** `sanchay-risk-v2.0.0`
- **Policy Version:** `risk_policy_v1.0.0`
- **Feature Manifest:** 176 Canonical Features (`ml/features/schema.py`)
