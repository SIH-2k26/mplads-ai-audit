# Sanchay AI — Feature Availability & Point-in-Time Matrix

This document defines the lifecycle availability stages, point-in-time constraints, and data leakage rules for all features engineered in Sanchay AI.

---

## 1. Project Lifecycle Stages

Features are classified into five discrete operational stages:

1. **`AVAILABLE_AT_SANCTION`**: Information available at administrative / financial sanction (DPR, estimated cost, category, constituency, historical baseline stats).
2. **`AVAILABLE_AT_WORK_ORDER`**: Information available after procurement and contract award (tender amount, bid count, winning contractor ID, scheduled timeline).
3. **`AVAILABLE_DURING_EXECUTION`**: Incremental telemetry generated during execution up to `prediction_timestamp` (disbursed tranches, physical inspection milestones, measurement book entries, contractor active project load).
4. **`AVAILABLE_AT_COMPLETION`**: Post-completion records (completion certificate, final expenditure, total elapsed delay, asset handover).
5. **`POST_AUDIT`**: CAG / State Vigilance audit findings, recovery notices, penalty orders. **NEVER permitted in risk prediction features.**

---

## 2. Feature Availability & Prediction Safety Matrix

| Feature Name | Category | Lifecycle Stage | Safe at Sanction? | Safe During Execution? | Missing Value Semantics |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sanction_amount` | Financial | AVAILABLE_AT_SANCTION | YES | YES | Exact value required |
| `estimated_cost` | Financial | AVAILABLE_AT_SANCTION | YES | YES | Exact value required |
| `sanction_to_estimate_ratio` | Financial | AVAILABLE_AT_SANCTION | YES | YES | Computed ratio |
| `planned_duration_days` | Temporal | AVAILABLE_AT_SANCTION | YES | YES | Exact days |
| `state_id_encoded` | Geographic | AVAILABLE_AT_SANCTION | YES | YES | Categorical encoding |
| `district_population` | Demographic | AVAILABLE_AT_SANCTION | YES | YES | Census baseline |
| `infrastructure_gap_index`| Socio-Economic | AVAILABLE_AT_SANCTION | YES | YES | Regional index |
| `tender_amount` | Procurement | AVAILABLE_AT_WORK_ORDER | NO | YES | Missing indicator if pre-tender |
| `tender_to_estimate_ratio` | Procurement | AVAILABLE_AT_WORK_ORDER | NO | YES | Missing indicator if pre-tender |
| `bid_count` | Procurement | AVAILABLE_AT_WORK_ORDER | NO | YES | 1 when single-bid; missing indicator if pre-tender |
| `single_bid_flag` | Procurement | AVAILABLE_AT_WORK_ORDER | NO | YES | 1 if single bid |
| `contractor_id_encoded` | Contractor | AVAILABLE_AT_WORK_ORDER | NO | YES | Missing indicator if unassigned |
| `contractor_past_irregularity_rate` | Contractor | AVAILABLE_AT_WORK_ORDER | NO | YES | Historical entity rate at sanction date |
| `contractor_market_share` | Contractor | AVAILABLE_AT_WORK_ORDER | NO | YES | Historical entity rate at sanction date |
| `sanction_to_work_order_days` | Temporal | AVAILABLE_AT_WORK_ORDER | NO | YES | Computed from dates |
| `actual_expenditure_to_date` | Financial | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | 0.0 if no payments to date |
| `financial_progress` | Financial | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | 0.0 if no payments |
| `physical_progress` | Progress | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | 0.0 if uninspected |
| `financial_physical_gap` | Financial/Progress| AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | `financial_progress - physical_progress` |
| `payment_count` | Payments | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | Count of payments before timestamp |
| `largest_payment_percentage` | Payments | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | Computed from payments before timestamp |
| `payment_concentration_index` | Payments | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | Herfindahl index of payments before timestamp |
| `days_between_payments_mean` | Payments | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | Computed from payment dates (NaN -> missing flag) |
| `measurement_book_present` | Documentation | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | 1 if verified before timestamp, 0 if missing |
| `measurement_book_missing` | Documentation | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | Explicit missing indicator (1 if missing) |
| `utilization_certificate_present` | Documentation | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | 1 if verified before timestamp, 0 if missing |
| `utilization_certificate_missing` | Documentation | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | Explicit missing indicator (1 if missing) |
| `geo_tagged_photos_present` | Documentation | AVAILABLE_DURING_EXECUTION | NO | YES (`<= prediction_time`) | 1 if verified before timestamp, 0 if missing |
| `final_completion_cost` | Post-Completion | AVAILABLE_AT_COMPLETION | **NO (LEAKAGE)** | **NO (LEAKAGE)** | Prohibited during active execution prediction |
| `final_completion_delay` | Post-Completion | AVAILABLE_AT_COMPLETION | **NO (LEAKAGE)** | **NO (LEAKAGE)** | Prohibited during active execution prediction |
| `post_audit_irregularity_flag` | Audit | POST_AUDIT | **PROHIBITED** | **PROHIBITED** | Strictly prohibited from model features |

---

## 3. Point-in-Time Guarantee

Every feature extraction call takes:
```python
def build_features(project: dict, prediction_timestamp: Optional[datetime] = None) -> np.ndarray:
    ...
```
When `prediction_timestamp` is provided:
1. Transactional payments occurring after `prediction_timestamp` are strictly filtered out.
2. Progress inspections recorded after `prediction_timestamp` are ignored.
3. Document uploads dated after `prediction_timestamp` are considered missing.
4. Elapsed duration is computed as `min(prediction_timestamp - work_order_date, planned_duration_days)`.
