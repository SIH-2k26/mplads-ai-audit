# MPLADS Synthetic Data & ML Feature Engineering Architecture

## 1. Executive Summary & Design Philosophy
This document establishes the end-to-end relational data architecture, feature engineering framework, and machine learning training pipeline for **AGASTYA / MPLADS AI Audit**.

Rather than relying on independent random synthetic rows (which result in artificial leakage and trivial 99%+ accuracy), the architecture generates a **normalized relational database of interconnected government entities** (Projects, Sanctions, Payments, Progress Records, Tenders, Contractors, Agencies, Districts, Documents, Inspections, and Ground Truth Labels) grounded in official MoSPI eSAKSHI workflows, GFR 2017 procurement standards, and CPWD Schedule of Rates (SOR) benchmarks.

```
                    RELATIONAL GOVERNMENT DATA MODEL
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │  Projects ──┬── Sanctions & Financials                                      │
 │             ├── Milestone Payments (1-N)                                    │
 │             ├── Physical & Financial Progress Timeseries (1-N)              │
 │             ├── Tenders & Bids (1-N)                                        │
 │             ├── Work Orders & Contract Amendments                           │
 │             ├── Contractors (M-N with Agencies & Districts)                 │
 │             ├── Implementing Agencies & Workloads                           │
 │             ├── Geographic Masters (Coordinates, Demographics, Socio-Econ)  │
 │             ├── Document Registries (MBs, UCs, Geotags, Sanctions)          │
 │             └── Ground-Truth Latent Scenario Engine (Anti-Leakage)          │
 └─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                        FEATURE ENGINEERING ENGINE
        (Preserves 47 Base Features + Adds 10 Multi-Domain Feature Groups)
                                      │
                                      ▼
                      LEAKAGE-FREE PARTITIONING & SMOTE
                     (70% Train / 15% Val / 15% Holdout Test)
                                      │
                                      ▼
                      MULTI-MODEL BENCHMARK & CALIBRATION
    (LogisticRegression, DecisionTree, RandomForest, ExtraTrees, HistGB, XGB, LGBM)
                                      │
                                      ▼
                       HYBRID RISK ENSEMBLE ENGINE
                     (ML + Rules + Isolation Forest + Evidence)
                                      │
                                      ▼
                        EXPLAINABLE REST API & CLI
               (POST /api/v1/risk/analyze & python -m ml.predict)
```

---

## 2. Relational Entity Schema

| Entity | Primary Key | Foreign Keys | Key Attributes |
|---|---|---|---|
| `projects` | `project_id` | `district_id`, `contractor_id`, `agency_id`, `constituency_id` | Work type, category, sanction date, target completion, status |
| `financials` | `financial_id` | `project_id` | Sanction amount, revised estimate, expenditure, unspent balance |
| `payments` | `payment_id` | `project_id`, `contractor_id` | Voucher number, installment number, amount, date, MB reference |
| `progress` | `progress_id` | `project_id` | Physical progress %, financial progress %, gap, stagnation flag |
| `procurement` | `tender_id` | `project_id`, `agency_id` | Tender value, channel (GeM/State), bid count, lowest bid, winning bid |
| `contracts` | `contract_id` | `project_id`, `contractor_id` | Contract amount, work order date, variation percentage, extensions |
| `contractors` | `contractor_id` | `state_id`, `primary_district_id` | GSTIN, total projects, win rate, capacity strain, past irregularity |
| `agencies` | `agency_id` | `district_id` | Agency name, total active projects, average delay, completion rate |
| `geography` | `district_id` | `state_id` | District name, coordinates, distance to HQ, cluster density |
| `demographics`| `district_id` | `state_id` | Population, density, literacy, deprivation index, infrastructure gap |
| `documents` | `document_id` | `project_id` | Document type (MB, UC, Sanction, Photo), verified flag, hash |
| `labels` | `label_id` | `project_id` | Latent scenario, fraud label (0/1), risk level, anomaly types |

---

## 3. Feature Architecture

### A. Base Features (Preserved 47 Signals)
* **Financial & Cost:** `cost_to_sanction_ratio`, `tender_to_estimate_ratio`, `actual_to_tender_ratio`, `sor_deviation_ratio`, `peer_cost_deviation_zscore`, `utilization_ratio`, `fund_release_ratio`, `unspent_balance_ratio`, `payment_velocity`, `round_number_payment_ratio`, `final_installment_concentration`, `spending_spike_score`.
* **Progress & Timeline:** `physical_progress`, `financial_progress`, `financial_physical_gap`, `progress_velocity`, `actual_vs_planned_progress_gap`, `is_stagnant_flag`, `planned_duration_days`, `actual_duration_days`, `delay_days`, `delay_ratio`, `extension_count`.
* **Procurement:** `bid_count`, `single_bid_flag`, `winning_bid_deviation`, `bidder_price_similarity`, `tender_duration_days`, `retender_count`, `repeat_winner_rate`.
* **Contractor & Agency:** `contractor_total_projects`, `contractor_market_share`, `contractor_win_rate`, `contractor_past_irregularity_rate`, `contractor_delay_rate`, `contractor_capacity_strain`.
* **Geographic & Evidence:** `geo_cluster_density`, `contractor_district_distance_km`, `is_high_density_cluster`, `missing_document_ratio`, `required_document_count`, `available_document_count`, `missing_mb_flag`, `missing_uc_flag`, `missing_completion_cert_flag`, `missing_geotag_flag`, `geo_distance_mismatch_km`.

### B. Extended Feature Groups (10 Domains)
1. **Financial Granularity:** Payment concentration index, cash flow volatility, duplicate payment indicators, monthly spending variance.
2. **Project Lifecycle & Milestone:** Milestone delay rate, milestone-payment mismatch, status reversal flags, reopened project indicators.
3. **Procurement Depth:** Bid spread percentage, winner margin, late bid counts, contractor tender participation frequency.
4. **Contractor Profile:** Abandonment rate, cost overrun rate, document failure rate, agency dependency index, growth rate.
5. **Agency Performance:** Workload ratio, contractor concentration, average payment turnaround time.
6. **Geographic & Spatial:** Distance to district HQ, nearby project density (1km/5km/10km), repeat location frequency, terrain & flood risk indices.
7. **Socio-Economic Context:** District deprivation index, infrastructure gap, literacy, road connectivity index.
8. **Document Evidence Integrity:** Administrative sanction presence, technical sanction presence, DPR, invoice verification, timestamp sequence consistency.
9. **Temporal Dynamics:** Sanction-to-tender days, tender-to-work order days, holiday transaction ratios, fiscal year-end spending spikes.
10. **Cross-Entity Ratios:** Project cost vs contractor average, project duration vs district average, contractor-agency mutual dependency ratio.

---

## 4. Anti-Leakage & Hard Negative Strategy

1. **Strict Target Separation:** Latent `scenario_type`, `fraud_label`, `risk_level`, and `investigation_verdict` are strictly excluded from the feature matrix $X$.
2. **Hard Negatives:**
   * Legitimate mega-projects (> ₹1.5 Cr) with higher absolute variance but valid documentation.
   * Legitimate single-bid tenders in remote/border hill districts (justified by low local contractor availability).
   * Legitimate weather/monsoon delayed works with verified extension approvals.
   * Legitimate year-end utilization accelerations matching eSAKSHI guidelines.
3. **Subtle Multi-Factor Scenarios:** Anomaly cases do not rely on single binary flags (e.g. `single_bid_flag == 1`); instead, they require multi-parameter correlation (e.g. Single-bid + high past irregularity + rapid payment + missing MB).
4. **Grouped & Temporal Splitting:** 70% Train, 15% Validation, 15% Test. Future-like projects are preserved in the test partition to evaluate generalization on unseen distributions.
