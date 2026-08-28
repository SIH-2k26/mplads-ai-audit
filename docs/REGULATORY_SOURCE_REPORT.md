# MPLADS AI Audit — Regulatory Source Classification & Lineage Report

This report documents the official government sources ingested into the AGASTYA Regulatory Knowledge Base.

| Source ID | Organization | Document / Source Name | Authority Level | Classification | URL |
|---|---|---|---|---|---|
| `SRC-001` | Ministry of Statistics & Programme Implementation (MoSPI) | **MPLADS eSAKSHI Portal & Guidelines** | `LEVEL_1` | `NORMATIVE` | [Link](https://mplads.mospi.gov.in/digigov/dashboard.html) |
| `SRC-002` | Department of Expenditure (Ministry of Finance) | **Procurement Policy Division Archive** | `LEVEL_2` | `NORMATIVE` | [Link](https://doe.gov.in/archive/procurement-policy-division) |
| `SRC-003` | Department of Expenditure (Ministry of Finance) | **Department of Expenditure Main Portal** | `LEVEL_2` | `NORMATIVE` | [Link](https://doe.gov.in/) |
| `SRC-004` | Government e-Marketplace (GeM) - Ministry of Commerce | **GeM General Terms and Conditions (GTC)** | `LEVEL_3` | `CONTRACTUAL` | [Link](https://assets-bg.gem.gov.in/resources/upload/shared_doc/gtc/general-te-1675401798.pdf) |
| `SRC-005` | Comptroller and Auditor General of India | **CAG Audit Reports & Findings** | `LEVEL_4` | `AUDIT_EVIDENCE` | [Link](https://cag.gov.in/en/audit-report) |
| `SRC-006` | Parliament of India (Lok Sabha Secretariat) | **Public Accounts Committee Reports** | `LEVEL_5` | `PARLIAMENTARY_OVERSIGHT` | [Link](https://sansad.in/ls/committee/financial-committees/26-Public%20Accounts) |
| `SRC-007` | Department of Administrative Reforms and Public Grievances | **DARPG Governance Principles** | `LEVEL_6` | `GOVERNANCE_GUIDANCE` | [Link](https://www.darpg.gov.in/) |
| `SRC-008` | Open Government Data (OGD) Platform India | **Government Open Data Platform** | `LEVEL_7` | `REFERENCE_DATA` | [Link](https://www.data.gov.in/) |
| `SRC-009` | Ministry of Law & Justice / Legislative Department | **Constitution of India (Financial Provisions)** | `LEVEL_8` | `LEGAL_CONTEXT` | [Link](https://legislative.gov.in/constitution-of-india/) |


---

## Source Ingestion & Integrity Verification
- All official sources are cryptographically hashed using **SHA-256** upon ingestion to guarantee version integrity and immutability.
- Normative instructions are strictly partitioned from empirical audit observations (CAG/PAC) to avoid false-positive legal assertions.
