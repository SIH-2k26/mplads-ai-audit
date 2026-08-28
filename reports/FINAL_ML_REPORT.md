# MPLADS AI Audit — Comprehensive Machine Learning & Risk Model Report

## 1. Executive Summary
The **AGASTYA Machine Learning Risk Engine** classifies project risk into **LOW, MEDIUM, HIGH, and CRITICAL** tiers and independently predicts multi-label anomaly vectors across 8 operational domains.

The model stack features **CatBoost, XGBoost, LightGBM, Random Forest, and Isolation Forest**, calibrated with Isotonic Regression to output reliable posterior probabilities without artificial boundary memorization.

---

## 2. Model Benchmark & Comparison

| Model | Accuracy | Precision | Recall | F1 Score | PR-AUC | Balanced Acc | MCC |
|---|---|---|---|---|---|---|---|
| **CatBoost** | 93.41% | 79.64% | 93.33% | 85.94% | `0.9672` | 93.38% | 0.8211 |
| **XGBoost** | 93.12% | 78.91% | 92.95% | 85.36% | `0.9563` | 93.06% | 0.8136 |
| **Gradient Boosting** | 95.44% | 98.48% | 80.1% | 88.34% | `0.9552` | 89.88% | 0.8625 |
| **HistGradientBoosting** | 92.99% | 78.5% | 92.95% | 85.12% | `0.9542` | 92.97% | 0.8106 |
| **LightGBM** | 93.28% | 79.41% | 92.95% | 85.65% | `0.954` | 93.16% | 0.8173 |
| **Random Forest** | 93.95% | 83.37% | 89.86% | 86.5% | `0.9533` | 92.47% | 0.827 |
| **Extra Trees** | 93.89% | 93.03% | 77.5% | 84.56% | `0.9455` | 87.95% | 0.8131 |
| **Logistic Regression** | 93.79% | 84.37% | 87.39% | 85.85% | `0.9353` | 91.47% | 0.8189 |


---

## 3. Held-Out Test Evaluation
- **Total Test Samples:** `3,750` (Stratified 15% holdout)
- **Accuracy:** `95.97%`
- **ROC-AUC:** `0.9902`
- **PR-AUC:** `0.9713`
- **Confusion Matrix:** TN=`2922`, FP=`19`, FN=`132`, TP=`677`

---

## 4. Top Predictive Risk Drivers
| Rank | Feature Name | Domain | Description |
|---|---|---|---|
| 1 | `financial_progress` | Risk Signal | Relative weight: 18.4760 |
| 2 | `total_rule_violation_count` | Risk Signal | Relative weight: 12.1605 |
| 3 | `velocity_mismatch` | Risk Signal | Relative weight: 8.8420 |
| 4 | `rule_risk_score` | Risk Signal | Relative weight: 7.5059 |
| 5 | `financial_velocity` | Risk Signal | Relative weight: 5.7739 |
| 6 | `expenditure_to_sanction_ratio` | Risk Signal | Relative weight: 4.2669 |
| 7 | `physical_velocity` | Risk Signal | Relative weight: 4.0075 |
| 8 | `payment_to_work_order_ratio` | Risk Signal | Relative weight: 3.6636 |
| 9 | `actual_to_tender_ratio` | Risk Signal | Relative weight: 3.3137 |
| 10 | `release_to_sanction_ratio` | Risk Signal | Relative weight: 3.2885 |


---

## 5. Visual Artifacts
- **Confusion Matrix:** `reports/confusion_matrix.png`
- **ROC & PR Curves:** `reports/roc_curve.png` & `reports/precision_recall_curve.png`
- **Feature Importance / SHAP:** `reports/shap_summary.png`
