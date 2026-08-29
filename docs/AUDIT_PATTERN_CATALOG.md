# MPLADS AI Audit — CAG Audit Pattern Catalog

This catalog documents empirical audit observation patterns derived from Comptroller and Auditor General (CAG) audit reports.

> **Methodological Boundary:** Audit patterns represent **evidentiary signals and risk triggers** for investigation prioritisation. They are never treated as self-proving assertions of guilt.

| Pattern ID | Category | Audit Observation Title | Empirical Risk Indicator | Severity | Source Report |
|---|---|---|---|---|---|
| `CAG-OBS-001` | PROGRESS_PAYMENT_MISMATCH | **Unwarranted Disbursement Against Lagging Physical Progress** | `financial_physical_gap > 30.0` | `CRITICAL` | CAG Union Civil Audit Reports on MPLADS |
| `CAG-OBS-002` | PROCUREMENT_COLLUSION | **Repetitive Award to Single Contractor via Restrictive Bidding** | `single_bid_flag == 1 and contractor_win_rate > 0.70` | `HIGH` | CAG State Audit Reports on Local Bodies and Scheme Works |
| `CAG-OBS-003` | GHOST_ASSET_RISK | **Completed Work Claim Without Physical Asset Register Entry or Geotags** | `financial_progress == 100.0 and (missing_geotag_flag == 1 or geo_distance_mismatch_km > 10.0)` | `CRITICAL` | CAG Compliance Audit on Scheme Asset Creation |
| `CAG-OBS-004` | COST_OVERRUN_ESCALATION | **Excess Expenditure Beyond Administrative Sanction Without Revised Approvals** | `cost_to_sanction_ratio > 1.25` | `HIGH` | CAG Report on Scheme Expenditure Management |
| `CAG-OBS-005` | DOCUMENTATION_DEFICIENCY | **Missing Measurement Book and Stage Utilization Certificates** | `missing_mb_flag == 1 or missing_uc_flag == 1` | `MEDIUM` | CAG Audit Observation on Record Maintenance |

