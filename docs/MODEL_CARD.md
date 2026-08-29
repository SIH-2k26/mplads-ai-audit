# MPLADS AI Audit — Model Card: Hybrid Risk & Anomaly Ensemble

## 1. Model Overview
* **Model Name:** AGASTYA MPLADS Hybrid Risk & Anomaly Ensemble
* **Architecture:** Calibrated CatBoost + XGBoost + LightGBM + Random Forest + Isolation Forest + Deterministic Regulatory Rule Engine
* **Version:** 2.0.0
* **Date:** 2026-08-28
* **Intended Use:** Decision-support and risk scoring tool for Public Works Auditors, District Authorities, and MoSPI inspection officers to prioritize audit inspections.
* **Non-Intended Use:** Autonomous judicial determination, punitive contractor blacklisting without human verification, or automated financial clawbacks.

---

## 2. Training Data & Feature Space
* **Training Dataset:** 25,000 Relational Projects (17,500 train, 3,750 validation, 3,750 test holdout).
* **Input Features:** 177 Engineered domain features across:
  - Financial Dynamics (cost overrun %, payment concentration, expenditure vs sanction)
  - Temporal & Velocity Signals (progress velocity, payment acceleration, elapsed milestone duration)
  - Contractor Network (win rate, repeat award rate, network density, capacity strain)
  - Procurement Spread (single bid flag, winning bid deviation, bid dispersion)
  - Geographic & Spatial Proximity (density clusters, distance to agency)
  - Document Integrity (MB presence, UC certification, geotag photo coverage)
  - Regulatory Rule Violations (deterministic GFR 2017 & eSAKSHI compliance counters)

---

## 3. Performance Metrics on Held-Out Test Data
* **Held-Out Test Accuracy:** `95.00%`
* **Test Precision:** `95.91%` (minimizes false alarms)
* **Test Recall:** `80.12%` (catches high-risk non-compliant works)
* **Test F1 Score:** `87.31%`
* **Test PR-AUC:** `0.9590`
* **Test ROC-AUC:** `0.9852`

---

## 4. Ethical Considerations & Human-in-the-Loop
* **Human Oversight Mandatory:** Model outputs are strictly labeled as *"High Risk — Requires Investigation"* or *"Potential Irregularity Signal"*, never *"Fraud Confirmed"*.
* **Explainability:** Every prediction generates positive and negative SHAP attribution signals to provide transparent rationale for audit teams.
