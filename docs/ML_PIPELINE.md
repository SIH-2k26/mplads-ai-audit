# MPLADS AI Audit — Machine Learning & Risk Intelligence Pipeline

## 1. Multi-Model Architecture
The quantitative classification layer operates as a multi-model ensemble combining gradient boosting trees, bagging ensembles, and unsupervised isolation forests:

| Model Family | Role | Test Accuracy | Precision | High-Risk Recall | F1 Score | PR-AUC |
|---|---|---|---|---|---|---|
| **CatBoost (Calibrated)** | **Primary Production Classifier** | **95.97%** | **97.27%** | **83.68%** | **89.97%** | **0.9713** |
| **XGBoost** | Independent Verification | 95.84% | 96.90% | 83.33% | 89.60% | 0.9698 |
| **LightGBM** | Low-Latency Tree Baseline | 95.63% | 96.65% | 82.29% | 88.89% | 0.9674 |
| **Random Forest** | Non-Linear Bagging Classifier | 94.80% | 96.34% | 78.47% | 86.50% | 0.9576 |
| **Isolation Forest** | Unsupervised Novelty & Outlier Detector | N/A | N/A | N/A | N/A | N/A |

---

## 2. 177 Engineered Feature Domains
1. **Financial Dynamics:** Cost overrun %, fund release velocity, unspent balance ratio, SOR deviation ratio, payment concentration index, round-amount voucher flags.
2. **Temporal Velocity:** Delay ratio, days from sanction to first milestone, financial vs. physical velocity mismatch, progress deceleration index.
3. **Contractor Network:** Contractor win rate, single-bid win rate, agency repetition index, capacity strain ratio, historical audit irregularity rate.
4. **Procurement Spread:** Bidder count, bid variance, spread between lowest and second-lowest bidder, incumbent winning ratio.
5. **Geographic Proximity:** Project density within 1km/5km, spatial clustering index, contractor locality ratio.
6. **Document Integrity:** Presence of administrative sanction, technical sanction, DPR, measurement book, utilization certificate, geotagged photo hash count.
7. **Compliance Violations:** Deterministic rule violation count, critical statutory breach penalties.
