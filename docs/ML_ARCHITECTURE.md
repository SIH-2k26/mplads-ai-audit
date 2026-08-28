# MPLADS AI Audit — Machine Learning & Synthetic Intelligence Architecture

## 1. System Overview & Philosophy
The MPLADS AI Risk Intelligence Platform (**AGASTYA**) provides decision-support risk scoring, anomaly detection, and explainable audit signals for MPLADS works. 

> **Important Boundary & Terminology:**
> This system is an AI decision-support platform. All outputs are labeled as **Risk Score**, **Anomaly Likelihood**, **Potential Irregularity**, and **Investigation Priority**. The platform strictly never labels synthetic or predicted outputs as "Fraud Confirmed" or "Guilt Established" — formal conclusions require human investigation and evidentiary sign-off.

---

## 2. Architectural Blueprint: The 54-Phase Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       1. DATA SOURCES & REFERENCE                           │
│  - Reference Geography (28 States, 788 Districts, 543 Lok Sabha Seats)      │
│  - Public Schedule of Rates (SOR) & Category Benchmarks                     │
│  - MoSPI Policy Guidelines (Eligible/Prohibited Works, Financial Caps)      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                2. SYNTHETIC RELATIONAL DATA GENERATOR                       │
│  - Relational Schema (18 Normalized Tables, PK/FK Referential Integrity)    │
│  - Deterministic Seeded Generation (Faker + Gaussian Copula / SDV Ready)    │
│  - Controlled Scenario Engine (20+ Scenarios + Hard Negatives)              │
│  - Population: 70% Normal / 30% Anomalous + 90/10 Imbalanced Test Set       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 3. DATA QUALITY VALIDATOR & INTEGRITY CHECKS                │
│  - 15 Point Validation (Foreign Keys, Date Logic, Financial Consistency)    │
│  - Data Quality Reports (JSON + Interactive HTML)                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            4. FEATURE ENGINEERING & LEAKAGE-FREE TRANSFORMATION             │
│  - Cost, Finance, Procurement, Timeline, Contractor & Network Signals       │
│  - Strict Separation: Raw Features vs Derived Signals vs Target Labels      │
│  - Feature Registry (config/features.yaml & config/targets.yaml)            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                5. MULTI-RISK MODEL TRAINING & BENCHMARKING                  │
│  - Baseline: Logistic Regression & Random Forest                            │
│  - Gradient Boosting: HistGradientBoosting, XGBoost, LightGBM, CatBoost     │
│  - Unsupervised Anomaly Detection: Isolation Forest                         │
│  - Stratified 70/15/15 Split + Stratified K-Fold + Imbalance Handling       │
│  - Probability Calibration (CalibratedClassifierCV) & SHAP Explainability   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    6. HYBRID RISK ENSEMBLE ENGINE                           │
│  - 35% Supervised ML Probability                                            │
│  - 25% Rule Engine Compliance Check                                         │
│  - 20% Unsupervised Anomaly Score                                           │
│  - 10% Historical Contractor Risk                                           │
│  - 10% Evidence & Data Quality Integrity                                    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              7. INFERENCE API & FRONTEND SIMULATION ENGINE                  │
│  - FastAPI Endpoint: POST /api/risk/analyze                                 │
│  - Real-time Derived Signal Calculation & Explainable Output                │
│  - Native compatibility with AGASTYA Frontend What-If Simulator             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Relational Schema (18 Normalized Core Tables)

Rather than generating 240 isolated datasets, all 240 data requirements are normalized across 18 core relational tables:

| # | Table Name | Primary Key | Foreign Keys | Key Features / Content |
|---|---|---|---|---|
| 01 | `projects.csv` | `project_id` | `contractor_id`, `agency_id`, `constituency_id`, `district_id`, `state_id` | Category, type, size, location, amounts, status, timeline |
| 02 | `financials.csv` | `project_id` | `project_id` | Sanction, releases, expenditure, utilization ratios, SOR deviation |
| 03 | `payments.csv` | `payment_id` | `project_id`, `contractor_id` | Payment milestones, dates, amounts, velocity, round numbers |
| 04 | `progress.csv` | `progress_id` | `project_id` | Time-series physical vs financial progress, gap, velocity |
| 05 | `procurement.csv` | `tender_id` | `project_id`, `contractor_id` | Tendering method, bid counts, single-bid flag, rotation score |
| 06 | `contracts.csv` | `contract_id` | `project_id`, `contractor_id` | Contract value, amendments, extensions, delay days |
| 07 | `contractors.csv` | `contractor_id` | - | Cumulative metrics, market share, past irregularity history |
| 08 | `agencies.csv` | `agency_id` | `district_id`, `state_id` | Implementing agency profile, volume, throughput, risk history |
| 09 | `geography.csv` | `geo_id` | `project_id`, `district_id` | Lat/long, cluster density, urban/rural classification |
| 10 | `project_events.csv` | `event_id` | `project_id` | Lifecycle events: sanctions, revisions, inspections, delays |
| 11 | `documents.csv` | `document_id` | `project_id` | Sanctions, MB, UCs, completion certificates, hash consistency |
| 12 | `assets.csv` | `asset_id` | `project_id` | Physical asset verification, geotagged photo metadata, status |
| 13 | `compliance.csv` | `compliance_id`| `project_id` | Rule-based policy checks (SC/ST allocation, prohibited list) |
| 14 | `historical_risk.csv`| `history_id`| `project_id`, `contractor_id` | Multi-quarter trajectory points, past audit warnings |
| 15 | `relationships.csv` | `relation_id` | `entity_a`, `entity_b` | Entity graph (shared directors, addresses, consortiums) |
| 16 | `benchmarks.csv` | `benchmark_id`| `project_type`, `state_id` | Peer median/p25/p75 costs, typical durations, bid counts |
| 17 | `investigations.csv`| `case_id` | `project_id` | Audit dockets, human verdicts, verified field findings |
| 18 | `labels.csv` | `project_id` | `project_id` | Binary & multi-class ground truth labels, scenario metadata |

---

## 4. Controlled Scenario Engine & Hard Negatives

The scenario engine injects controlled behavioral anomalies while keeping correlations physically consistent:

- **Scenario Types:**
  1. `NORMAL`: Standard execution within historical norms.
  2. `COST_OVERRUN`: Elevated actual expenditure with derived SOR/peer cost deviations.
  3. `PAYMENT_PROGRESS_MISMATCH`: High financial progress with lagging physical progress.
  4. `DELAYED_PROJECT`: Stalled milestones with timeline extensions.
  5. `ABANDONED_PROJECT`: Zero progress for 180+ days post partial payment.
  6. `DUPLICATE_PROJECT`: High geospatial, text, and cost similarity to existing work.
  7. `GHOST_WORK`: Complete financial disbursement with missing asset/geotag verification.
  8. `SUSPICIOUS_CONTRACTOR`: High past irregularity rate and capacity strain.
  9. `CONTRACTOR_MONOPOLY`: Abnormal win-rates and repeat agency-contractor pairings.
  10. `SUSPICIOUS_PAYMENT`: Rapid payment spikes and high round-number concentration.
  11. `SUSPICIOUS_PROCUREMENT`: Single-bid tenders, ultra-short tender periods, bidder overlap.
  12. `MISSING_DOCUMENTATION`: Missing Measurement Books, UCs, or technical sanctions.
  13. `ELIGIBILITY_VIOLATION`: Prohibited works according to MoSPI scheme guidelines.
  14. `MULTI_ANOMALY`: Compounded risk signals across procurement, finance, and execution.
  15. **`HARD_NEGATIVE` (Crucial):** High-value projects (e.g. ₹15–25 Cr hospital/bridge) with legitimate multi-bid competition, full documentation, verified milestones, and proportionate progress. Ensures models don't blindly equate project size with risk.

---

## 5. Strict Anti-Leakage Protocol

To ensure models generalize and evaluation reflects true discrimination ability:
1. **No Target-Derived Inputs:** Risk scores, probability estimates, and scenario labels are strictly excluded from feature matrices.
2. **No Post-Outcome Information:** Future inspection findings or investigation dockets are never used to predict intake risk.
3. **No Entity ID Overfitting:** Raw entity IDs (`project_id`, `contractor_id`, `tender_id`) are never fed as numerical features.
4. **Partition-Isolated Preprocessing:** Scalers, encoders, and SMOTE balancing are fitted **strictly on the training split** and transformed on validation/test splits.

---

## 6. Hybrid Risk Ensemble & Explainability Architecture

```
                 Project Input Data
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   Rule Engine      Supervised ML     Isolation Forest
   (Compliance)    (Classification)  (Anomaly Detection)
         │               │               │
      [0-100]         [0-100]         [0-100]
         │               │               │
         └───────────────┬───────────────┘
                         ▼
             Weighted Ensemble Formula
     Overall Risk = 0.35*ML + 0.25*Rule + 0.20*Anomaly + 0.10*Contractor + 0.10*Evidence
                         │
                         ▼
             Calibrated Risk Output & SHAP Drivers
```
