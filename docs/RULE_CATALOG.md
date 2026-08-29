# MPLADS AI Audit — Regulatory Rule Catalog

This catalog documents the normalized normative compliance rules extracted from official government sources (MoSPI eSAKSHI Guidelines, DoE / GFR 2017 Procurement Rules, GeM GTC).

| Rule ID | Category | Rule Name | Normalized Standard | Severity | Source |
|---|---|---|---|---|---|
| `MPLADS-WF-001` | WORK_RECOMMENDATION | **Mandatory Work Recommendation via eSAKSHI** | Every project must originate from an authorized MP recommendation record before sanction. | `CRITICAL` | MPLADS eSAKSHI Guidelines 2023 |
| `MPLADS-TIMELINE-002` | TIMELINE | **One-Year Project Completion Norm** | Project execution duration should not exceed 365 days without formal recorded extension. | `MEDIUM` | MPLADS Guidelines Section 3 |
| `MPLADS-PAYMENT-003` | PAYMENT | **Advance Payment Cap to Implementing Agency** | Initial disbursement prior to recorded physical milestone progress is capped at 50% of sanctioned amount. | `HIGH` | MPLADS Guidelines Section 4 |
| `MPLADS-EVIDENCE-004` | DOCUMENTATION | **Measurement Book (MB) & Geotagged Photo Requirement** | Progress payments and completion claims require valid MB entry and verified geotagged photos. | `HIGH` | MPLADS eSAKSHI Guidelines Section 4.2 |
| `DOE-PROC-001` | PROCUREMENT | **Open Competitive Bidding Threshold (> Rs 2.5 Lakhs)** | Works with value > Rs 2,50,000 must undergo open competitive tendering. | `HIGH` | GFR 2017 Rule 161 |
| `DOE-PROC-002` | TENDER | **Single-Bid Tender Verification Norm** | Single-bid awards must not exceed approved SOR by more than 5%. | `HIGH` | DoE Procurement Policy Manual |
| `DOE-COST-003` | COST_ESTIMATION | **Contract Variation / Amendment Cap (10%)** | Actual expenditure should not exceed sanctioned/contract value by more than 10%. | `HIGH` | GFR 2017 Rule 141 |
| `GEM-GTC-001` | CONTRACT | **GeM Delivery & Liquidated Damages SLA** | For GeM procurement, execution delays beyond contractual delivery date must trigger penalty review. | `MEDIUM` | GeM GTC v4.0 |
| `MPLADS-ELIG-005` | ELIGIBILITY | **Prohibited Works Filter** | Work type and beneficiary category must be strictly public community assets. | `CRITICAL` | MPLADS Guidelines Annexure-II |


## Rule Hierarchy & Applicability Protocol
- **Level 1 (MPLADS Operational Guidelines):** Precedence on scheme workflow, sanction caps, and eSAKSHI digital milestone verifications.
- **Level 2 (DoE / GFR 2017):** Precedence on public procurement, tendering thresholds (> Rs. 2.5L), and 10% variation order caps.
- **Level 3 (GeM GTC):** Applicable strictly when `procurement_channel == 'GEM'`.
