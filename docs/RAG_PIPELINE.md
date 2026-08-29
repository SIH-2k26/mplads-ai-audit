# MPLADS AI Audit — Temporal-Aware Regulatory RAG Pipeline

## 1. Knowledge Base Provenance & Authority Sources
The RAG pipeline operates on official statutory and audit observation documents:

1. **Revised Guidelines on MPLADS (April 2023):** Effective 01-04-2023. Governs web portal workflow (eSAKSHI), milestone-based fund releases, and mandatory geotagging.
2. **Guidelines on MPLADS (June 2016 Edition):** Governs legacy projects approved prior to 01-04-2023.
3. **General Financial Rules (GFR) 2017:** Rule 149 (Government e-Marketplace GeM procurement) and Rule 144 (Competitive tendering & single-bid restrictions).
4. **GeM General Terms and Conditions (GTC):** Statutory procurement framework for public expenditure.
5. **CAG Performance Audit on MPLADS Scheme (Report 19 of 2021):** Empirical audit observation patterns on contractor concentration, work splitting, and unspent balances.

---

## 2. Temporal Version-Aware Retrieval
Every compliance query inspects `project.sanction_date`:
* If `sanction_date >= 2023-04-01`: Retrieves from the **2023 Revised Guidelines**.
* If `sanction_date < 2023-04-01`: Retrieves from the **2016 Legacy Guidelines**.
* General procurement rules (GFR 2017, GeM, CAG) are cross-applied regardless of sanction date.

---

## 3. Structured Citation Attribution
Each retrieved evidence item retains strict provenance metadata:
- `document_id`: Canonical document identifier
- `document_title`: Full gazette or scheme title
- `authority`: Issuing ministry or department
- `chapter`: Specific chapter header
- `section`: Operational section
- `paragraph`: Exact paragraph / sub-clause reference
- `page`: Gazette page number
- `citation_text`: Verbatim statutory text
- `relevance_score`: Metric of semantic match (0.0 to 1.0)
- `applicability_reason`: Explanation of why this rule applies to the analyzed project
