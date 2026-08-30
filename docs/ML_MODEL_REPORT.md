# Sanchay AI — Machine Learning & Statutory Risk Model Report

## 1. Executive Summary
The **Sanchay Machine Learning Risk Engine** classifies project risk into **LOW, MEDIUM, HIGH, and CRITICAL** tiers and predicts multi-label anomaly vectors across 7 operational domains.

The model stack features **Random Forest, CatBoost, XGBoost, LightGBM, and Isolation Forest**, calibrated with Platt Scaling (3-Fold Sigmoid Calibration) to output reliable posterior probabilities.

---

## 2. Model Benchmark & 5-Fold Cross-Validation Comparison

| Model | Split | PR-AUC | ROC-AUC | F1 Score | Brier Score | ECE |
|---|---|---|---|---|---|---|
| **CatBoost** | 5-Fold OOF CV | `0.9269` | `0.9467` | `0.8745` | `0.0362` | `0.0156` |
| **XGBoost** | 5-Fold OOF CV | `0.923` | `0.945` | `0.8767` | `0.0379` | `0.0195` |
| **LightGBM** | 5-Fold OOF CV | `0.9228` | `0.9448` | `0.8722` | `0.0384` | `0.0151` |
| **RandomForest** | 5-Fold OOF CV | `0.9313` | `0.9502` | `0.8904` | `0.0329` | `0.0278` |
| **HistGradientBoosting** | 5-Fold OOF CV | `0.9247` | `0.9467` | `0.8818` | `0.0371` | `0.0317` |
| **LogisticRegression** | 5-Fold OOF CV | `0.8564` | `0.8954` | `0.564` | `0.2023` | `0.3581` |
| **RandomForest (Calibrated)** | Held-Out Internal Test | `0.9182` | `0.9323` | `0.8857` | `0.0341` | `0.0095` |
| **RandomForest (Calibrated)** | Generator B External Holdout | `0.1871` | `0.4733` | `0.0` | `0.1857` | `0.0` |

---

## 3. Held-Out Test Evaluation
- **Total Test Samples:** `750` (Stratified 15% holdout)
- **Accuracy:** `95.73%`
- **ROC-AUC:** `0.9323`
- **PR-AUC:** `0.9182`
- **Confusion Matrix:** TN=`594`, FP=`9`, FN=`23`, TP=`124`

---

## 4. Top Predictive Risk Drivers
| Rank | Feature Name | Domain | Description |
|---|---|---|---|
| 1 | `total_rule_violation_count` | Statutory Signal | Relative weight: 0.1204 |
| 2 | `progress_acceleration` | Statutory Signal | Relative weight: 0.0577 |
| 3 | `payment_violation_count` | Statutory Signal | Relative weight: 0.0532 |
| 4 | `project_velocity` | Statutory Signal | Relative weight: 0.0476 |
| 5 | `physical_velocity` | Statutory Signal | Relative weight: 0.0475 |
| 6 | `financial_physical_gap` | Statutory Signal | Relative weight: 0.0435 |
| 7 | `velocity_mismatch` | Statutory Signal | Relative weight: 0.0429 |
| 8 | `progress_deceleration` | Statutory Signal | Relative weight: 0.0416 |
| 9 | `physical_progress` | Statutory Signal | Relative weight: 0.0387 |
| 10 | `financial_velocity` | Statutory Signal | Relative weight: 0.0251 |


---

## 5. Visual Artifacts
- **Confusion Matrix:** `reports/confusion_matrix.png`
- **ROC & PR Curves:** `reports/roc_curve.png` & `reports/precision_recall_curve.png`
- **Feature Importance / SHAP:** `reports/shap_summary.png`
