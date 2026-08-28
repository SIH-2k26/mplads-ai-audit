# MPLADS AI Audit — Comprehensive Machine Learning & Risk Model Report

## 1. Executive Summary
The **AGASTYA Machine Learning Risk Engine** classifies project risk into **LOW, MEDIUM, HIGH, and CRITICAL** tiers and independently predicts multi-label anomaly vectors across 8 operational domains.

The model stack features **CatBoost, XGBoost, LightGBM, Random Forest, and Isolation Forest**, calibrated with Isotonic Regression to output reliable posterior probabilities without artificial boundary memorization.

---

## 2. Model Benchmark & Comparison

| Model | Accuracy | Precision | Recall | F1 Score | PR-AUC | Balanced Acc | MCC |
|---|---|---|---|---|---|---|---|
| **CatBoost** | 93.27% | 81.01% | 89.78% | 85.17% | `0.9538` | 92.0% | 0.8101 |
| **XGBoost** | 93.67% | 82.57% | 89.47% | 85.88% | `0.9447` | 92.15% | 0.8192 |
| **LightGBM** | 93.27% | 81.18% | 89.47% | 85.13% | `0.9446` | 91.89% | 0.8095 |
| **Gradient Boosting** | 95.07% | 94.95% | 81.42% | 87.67% | `0.9429` | 90.12% | 0.85 |
| **HistGradientBoosting** | 93.2% | 80.11% | 91.02% | 85.22% | `0.9426` | 92.41% | 0.811 |
| **Random Forest** | 93.4% | 82.94% | 87.31% | 85.07% | `0.9425` | 91.19% | 0.8088 |
| **Extra Trees** | 93.6% | 92.19% | 76.78% | 83.78% | `0.935` | 87.5% | 0.8036 |
| **Logistic Regression** | 94.0% | 85.41% | 87.0% | 86.2% | `0.9259` | 91.46% | 0.8237 |


---

## 3. Held-Out Test Evaluation
- **Total Test Samples:** `1,500` (Stratified 15% holdout)
- **Accuracy:** `95.00%`
- **ROC-AUC:** `0.9853`
- **PR-AUC:** `0.9590`
- **Confusion Matrix:** TN=`1167`, FP=`11`, FN=`64`, TP=`258`

---

## 4. Top Predictive Risk Drivers
| Rank | Feature Name | Domain | Description |
|---|---|---|---|
| 1 | `rule_risk_score` | Risk Signal | Relative weight: 13.4439 |
| 2 | `velocity_mismatch` | Risk Signal | Relative weight: 12.9964 |
| 3 | `financial_progress` | Risk Signal | Relative weight: 12.3991 |
| 4 | `total_rule_violation_count` | Risk Signal | Relative weight: 9.6747 |
| 5 | `financial_velocity` | Risk Signal | Relative weight: 4.2677 |
| 6 | `physical_progress` | Risk Signal | Relative weight: 3.1510 |
| 7 | `balance_to_sanction_ratio` | Risk Signal | Relative weight: 2.5170 |
| 8 | `contractor_total_value` | Risk Signal | Relative weight: 2.3058 |
| 9 | `contractor_average_project_value` | Risk Signal | Relative weight: 2.1813 |
| 10 | `financial_physical_gap` | Risk Signal | Relative weight: 2.0510 |


---

## 5. Visual Artifacts
- **Confusion Matrix:** `reports/confusion_matrix.png`
- **ROC & PR Curves:** `reports/roc_curve.png` & `reports/precision_recall_curve.png`
- **Feature Importance / SHAP:** `reports/shap_summary.png`
