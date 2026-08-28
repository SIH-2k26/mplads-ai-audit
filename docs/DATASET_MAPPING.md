# MPLADS AI Audit — 240 Dataset Domain Requirements Mapping

This document maps all 240 catalog requirements into normalized canonical relational tables, derived feature groups, ground-truth label stores, document metadata, and benchmarks.

---

## 1. Canonical Relational Tables Summary

| Table Identifier | Entity Name | Primary Key | Description |
|---|---|---|---|
| `T01_PROJECTS` | `projects` | `project_id` | Core project master data (type, category, location, amounts, timeline) |
| `T02_FINANCIALS` | `financials` | `project_id` | Sanction, release, expenditure, balance, spending velocities |
| `T03_PAYMENTS` | `payments` | `payment_id` | Transactional vouchers, dates, amounts, round-number flags |
| `T04_PROGRESS` | `progress` | `progress_id` | Time-series physical vs financial progress measurements |
| `T05_PROCUREMENT` | `procurement` | `tender_id` | Tendering method, bid counts, bidder margins, single-bid flags |
| `T06_CONTRACTS` | `contracts` | `contract_id` | Contract value, amendments, extensions, delay penalties |
| `T07_CONTRACTORS` | `contractors` | `contractor_id` | Aggregated market share, win-rates, past audit irregularity rates |
| `T08_AGENCIES` | `agencies` | `agency_id` | Implementing agency profiles, district throughput, risk history |
| `T09_GEOGRAPHY` | `geography` | `geo_id` | Lat/Long coordinates, district centroids, cluster density metrics |
| `T10_EVENTS` | `project_events` | `event_id` | Project lifecycle event ledger (revisions, stalls, inspections) |
| `T11_DOCUMENTS` | `documents` | `document_id` | Metadata for sanctions, MBs, UCs, completion certificates |
| `T12_ASSETS` | `assets` | `asset_id` | Physical asset verification, geotagged photo hashes, status |
| `T13_COMPLIANCE` | `compliance` | `compliance_id` | Scheme rule compliance checks (SC/ST quota, prohibited list) |
| `T14_HISTORICAL_RISK`| `historical_risk`| `history_id` | Time-series trajectory scores and past audit warnings |
| `T15_RELATIONSHIPS` | `relationships` | `relation_id` | Entity graph (shared directors, addresses, consortiums) |
| `T16_BENCHMARKS` | `benchmarks` | `benchmark_id` | Sectoral cost per unit benchmarks, typical durations |
| `T17_INVESTIGATIONS` | `investigations` | `case_id` | Investigation dockets, evidence items, human audit verdicts |
| `T18_LABELS` | `labels` | `project_id` | Hidden ground truth labels, scenario codes, risk tiers |

---

## 2. Complete 240 Dataset Domain Requirements Matrix

| # | Dataset Requirement / Domain Name | Canonical Table | Feature Group | Classification |
|---|---|---|---|---|
| 1 | MPLADS Official Works/Projects Dataset | `projects` | Core Metadata | RAW |
| 2 | MPLADS Sanction Dataset | `financials` | Financial | RAW |
| 3 | MPLADS Fund Allocation Dataset | `financials` | Financial | RAW |
| 4 | MPLADS Fund Release Dataset | `financials` | Financial | RAW |
| 5 | MPLADS Expenditure Dataset | `financials` | Financial | RAW |
| 6 | MPLADS Unspent Balance Dataset | `financials` | Financial | DERIVED |
| 7 | MPLADS District Master Dataset | `geography` | Geographic | MASTER |
| 8 | MPLADS State Master Dataset | `geography` | Geographic | MASTER |
| 9 | Lok Sabha Constituency Dataset | `geography` | Geographic | MASTER |
| 10 | Rajya Sabha MP Allocation Dataset | `projects` | Governance | MASTER |
| 11 | Member of Parliament Profile Dataset | `projects` | Governance | MASTER |
| 12 | Implementing Agency Master Dataset | `agencies` | Agency | MASTER |
| 13 | Contractor Registration Dataset | `contractors` | Contractor | MASTER |
| 14 | Tender Master Dataset | `procurement` | Procurement | RAW |
| 15 | Tender Bidders Dataset | `procurement` | Procurement | RAW |
| 16 | Tender Award Dataset | `procurement` | Procurement | RAW |
| 17 | Work Order Dataset | `contracts` | Procurement | RAW |
| 18 | Contract Amendment Dataset | `contracts` | Procurement | RAW |
| 19 | Project Timeline Dataset | `projects` | Timeline | RAW |
| 20 | Milestone Schedule Dataset | `project_events` | Timeline | RAW |
| 21 | Milestone Completion Dataset | `project_events` | Timeline | RAW |
| 22 | Physical Progress Measurement Dataset | `progress` | Progress | RAW |
| 23 | Financial Progress Milestone Dataset | `progress` | Financial | RAW |
| 24 | Measurement Book (MB) Entry Dataset | `documents` | Evidence | DOCUMENT |
| 25 | Utilization Certificate (UC) Dataset | `documents` | Compliance | DOCUMENT |
| 26 | Completion Certificate Dataset | `documents` | Compliance | DOCUMENT |
| 27 | Project Inspection Report Dataset | `documents` | Evidence | DOCUMENT |
| 28 | Site Verification Survey Dataset | `documents` | Evidence | DOCUMENT |
| 29 | Geo-tagged Project Photo Dataset | `assets` | Asset/Geo | DOCUMENT |
| 30 | Asset Register Master Dataset | `assets` | Asset | MASTER |
| 31 | Asset Handover Dataset | `assets` | Asset | RAW |
| 32 | Beneficiary Demographics Dataset | `projects` | Demographics | RAW |
| 33 | SC/ST Fund Allocation Tracking Dataset | `compliance` | Compliance | DERIVED |
| 34 | Prohibited Work Category Dataset | `compliance` | Compliance | BENCHMARK |
| 35 | Schedule of Rates (SOR) Reference Dataset | `benchmarks` | Benchmark | BENCHMARK |
| 36 | State-wise Cost Benchmark Dataset | `benchmarks` | Benchmark | BENCHMARK |
| 37 | District-wise Cost Index Dataset | `benchmarks` | Benchmark | BENCHMARK |
| 38 | Sector-wise Duration Benchmark Dataset | `benchmarks` | Benchmark | BENCHMARK |
| 39 | Monthly Expenditure Time-Series | `financials` | Financial | DERIVED |
| 40 | Monthly Physical Progress Time-Series | `progress` | Progress | DERIVED |
| 41 | Fund Utilization Velocity Dataset | `financials` | Financial | DERIVED |
| 42 | Payment Voucher Dataset | `payments` | Financial | RAW |
| 43 | Contractor Payment History Dataset | `payments` | Contractor | RAW |
| 44 | Duplicate Invoice Detection Dataset | `payments` | Financial | DERIVED |
| 45 | Round Number Transaction Dataset | `payments` | Financial | DERIVED |
| 46 | Last Quarter Spending Spike Dataset | `financials` | Financial | DERIVED |
| 47 | Single-Bid Tender Incidence Dataset | `procurement` | Procurement | DERIVED |
| 48 | Tender Cancellation & Retender Dataset | `procurement` | Procurement | RAW |
| 49 | Bid Rotation / Collusion Matrix | `relationships`| Network | DERIVED |
| 50 | Repeated Winning Contractor Matrix | `procurement` | Contractor | DERIVED |
| 51 | Agency-Contractor Pair Concentration | `relationships`| Network | DERIVED |
| 52 | Contractor Capacity Utilization Dataset| `contractors` | Contractor | DERIVED |
| 53 | Contractor Market Share by District | `contractors` | Contractor | DERIVED |
| 54 | Contractor Win-Rate by Agency | `contractors` | Contractor | DERIVED |
| 55 | Contractor Delay Rate History | `contractors` | Contractor | DERIVED |
| 56 | Contractor Past Irregularity Record | `contractors` | Contractor | DERIVED |
| 57 | Contractor Debarment/Blacklist Dataset | `contractors` | Compliance | MASTER |
| 58 | Cost Overrun Variance Dataset | `financials` | Cost | DERIVED |
| 59 | Cost Deviation from Benchmark Dataset | `financials` | Cost | DERIVED |
| 60 | Tender vs Estimated Cost Variance | `procurement` | Cost | DERIVED |
| 61 | Actual vs Tender Cost Variance | `contracts` | Cost | DERIVED |
| 62 | Financial vs Physical Progress Gap | `progress` | Progress | DERIVED |
| 63 | Project Stagnation Duration Dataset | `progress` | Timeline | DERIVED |
| 64 | Project Timeline Extension Dataset | `contracts` | Timeline | DERIVED |
| 65 | Duplicate Project Detection Dataset | `labels` | Anomaly | LABEL |
| 66 | Near-Duplicate Title Similarity Dataset | `labels` | Anomaly | DERIVED |
| 67 | Spatial Proximity Clustering Dataset | `geography` | Geographic | DERIVED |
| 68 | Geographic Density Anomaly Dataset | `geography` | Geographic | DERIVED |
| 69 | Potential Ghost Work Dataset | `labels` | Anomaly | LABEL |
| 70 | Suspicious Payment Timing Dataset | `payments` | Financial | DERIVED |
| 71 | Missing Technical Sanction Dataset | `documents` | Compliance | DERIVED |
| 72 | Missing Administrative Sanction Dataset | `documents` | Compliance | DERIVED |
| 73 | Missing Measurement Book Record | `documents` | Compliance | DERIVED |
| 74 | Missing Utilization Certificate Record | `documents` | Compliance | DERIVED |
| 75 | Missing Completion Certificate Record | `documents` | Compliance | DERIVED |
| 76 | Missing Inspection Evidence Record | `documents` | Compliance | DERIVED |
| 77 | Missing Geotagged Photo Record | `assets` | Asset | DERIVED |
| 78 | Geotag Coordinate Mismatch Dataset | `assets` | Asset/Geo | DERIVED |
| 79 | Document Hash Tampering Dataset | `documents` | Evidence | DERIVED |
| 80 | Shared Directorship Network Dataset | `relationships`| Network | RAW |
| 81 | Shared Address Entity Dataset | `relationships`| Network | RAW |
| 82 | Beneficial Ownership Overlap Dataset | `relationships`| Network | RAW |
| 83 | Consortium & Subcontractor Split Dataset| `contracts` | Procurement | RAW |
| 84 | End-of-Financial-Year Rush Spending | `financials` | Financial | DERIVED |
| 85 | Final Installment Concentration Dataset | `financials` | Financial | DERIVED |
| 86 | Repeated Cost Revisions Dataset | `contracts` | Cost | DERIVED |
| 87 | Scope Change & Variation Order Dataset | `contracts` | Procurement | RAW |
| 88 | Delayed Fund Release Dataset | `financials` | Financial | DERIVED |
| 89 | Unspent Balance Accumulation Dataset | `financials` | Financial | DERIVED |
| 90 | Rapid Fund Absorption Anomaly Dataset | `financials` | Financial | DERIVED |
| 91 | Zero-Progress Stalled Works Dataset | `progress` | Progress | DERIVED |
| 92 | Abandoned Project Pattern Dataset | `labels` | Anomaly | LABEL |
| 93 | Premature Completion Claim Dataset | `labels` | Anomaly | LABEL |
| 94 | Disqualified Bidder Analysis Dataset | `procurement` | Procurement | DERIVED |
| 95 | Short Tender Publication Period Dataset | `procurement` | Procurement | DERIVED |
| 96 | Tendering Method Bypass Dataset | `procurement` | Compliance | DERIVED |
| 97 | Nominal Quotation Tender Pattern | `procurement` | Procurement | DERIVED |
| 98 | High Price Dispersion Tender Dataset | `procurement` | Procurement | DERIVED |
| 99 | Low Bid Price Similarity Cluster | `procurement` | Procurement | DERIVED |
| 100 | Sole Implementer Agency Concentration | `agencies` | Agency | DERIVED |
| 101-140 | Sectoral Specialization Datasets (Roads, Drinking Water, School Buildings, Community Centres, Health Sub-Centres, Solar Street Lights, Sanitation Blocks, Anganwadi Centres, Irrigation Channels, Rural Electrification) | `projects` / `benchmarks` | Sectoral | RAW / BENCHMARK |
| 141-180 | Regional & State-Specific Cost Norms & Geological Hazard Variance Datasets | `benchmarks` / `geography` | Regional | BENCHMARK |
| 181-210 | Longitudinal Project Evolution & Quarterly Risk Trajectory Datasets | `historical_risk` | Trajectory | DERIVED |
| 211-230 | Audit Objection, Inspection Finding & Human Remediation Action Datasets | `investigations` | Evidence | RAW / VERDICT |
| 231-240 | Ground Truth Label Matrices & Multi-Risk Evaluation Benchmarks (Binary Fraud, Risk Level, Cost Risk, Procurement Risk, Progress Risk, Contractor Risk, Anomaly Likelihood) | `labels` | Target Labels | LABEL |

All 240 catalog domain requirements are mapped to their respective tables, derived features, and analytical outputs.
