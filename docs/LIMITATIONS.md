# Sanchay AI — System Limitations & Governance Constraints

This document outlines the real-world operational constraints, data limitations, and architectural boundaries of the Sanchay AI platform.

---

## 1. Synthetic Data Limitations
- The underlying 25,000 project dataset was generated using schema-aware relational generation.
- While it includes domain correlations across 19 risk dimensions and hard negative controls, synthetic data cannot replicate the full complexity of unrecorded verbal collusions, political patronage networks, or local geographical nuances.
- High internal benchmark scores (e.g. PR-AUC ~0.92) reflect performance on known synthetic anomaly generators. As demonstrated by the independent Generator B external holdout benchmark (PR-AUC 0.187), statistical models alone experience distribution shift when confronted with unseen fraud strategies.

---

## 2. Ground-Truth & Judicial Liability Limitations
- Sanchay AI produces **risk screening indicators**, not legal proof of fraud.
- An alert indicates that a project matches statistical or rule-based patterns associated with non-compliance (such as single-bid concentration or expenditure leading physical progress).
- Official prosecution or administrative sanctions must always be predicated on formal site verification by the District Planning Authority, physical Measurement Book audits, and technical vigilance squad reports.

---

## 3. Entity Resolution & Network Graph Limitations
- Contractor network graphs connect entities via matching PAN, GSTIN, registered addresses, and corporate director IDs.
- In scenarios where contractors operate under informal sub-contracting agreements or unlinked shell entities without shared formal registrations, entity resolution confidence is degraded.
- Graph analytics provide entity-risk indicators with documented match confidence scores (`confidence: 0.85+`), rather than conclusive syndicate proofs.

---

## 4. Temporal Constraints & Point-in-Time Integrity
- Fraud risk is dynamic. A project evaluated during sanction cannot be judged using telemetry available only at completion.
- When predicting risk during project execution, the system strictly utilizes events and documents timestamped prior to `prediction_timestamp`.
- Retrospective evaluations must specify historical cutoff dates to avoid future-data leakage.

---

## 5. Satellite & Geospatial Optical Limitations
- Earth observation and optical progress verification depend on satellite revisit rates, cloud cover (particularly during monsoon seasons in Northeast and Coastal regions), and spatial resolution limits.
- Small-scale rural works (such as installing community solar streetlights or minor culverts) cannot be conclusively certified via low-resolution optical satellite passes. In such scenarios, geo-tagged on-site mobile photographs with cryptographic EXIF validation serve as the primary verification layer.

---

## 6. Regulatory RAG & Policy Versioning
- Sanchay AI's RAG system enforces temporal routing between legacy guidelines (MPLADS 2016) and modernized digital guidelines (MPLADS 2023 / e-SAKSHI).
- For works sanctioned prior to April 1, 2023, legacy financial tranches and revised expenditure rules are applied.
- If relevant citations cannot be retrieved with high vector and BM25 relevance (`score < 0.65`), the system returns a fallback notice rather than hallucinating statutory provisions.
