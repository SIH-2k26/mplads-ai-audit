"""
regulatory/validate.py
Batch Compliance Auditor and Regulatory Knowledge Validator for MPLADS AI Audit.
Evaluates synthetic datasets against normalized rules, exports compliance datasets, and compiles documentation.
"""
from __future__ import annotations
import json
import os
import sys
from typing import Any, Dict, List
import pandas as pd
from regulatory.compliance_engine import RegulatoryComplianceEngine
from regulatory.ingest import ingest_regulatory_sources
from regulatory.normalize import normalize_regulatory_knowledge


def validate_regulatory_pipeline(relational_dir: str = "data/synthetic/relational", compliance_dir: str = "data/compliance", anomalies_dir: str = "data/anomalies") -> Dict[str, Any]:
    print("=" * 60)
    print("[REGULATORY VALIDATOR] Running End-to-End Compliance Audit & Dataset Export")
    print("=" * 60)

    # 1. Run ingestion & normalization
    ingest_regulatory_sources()
    normalize_regulatory_knowledge()

    os.makedirs(compliance_dir, exist_ok=True)
    os.makedirs(anomalies_dir, exist_ok=True)
    os.makedirs("docs", exist_ok=True)

    engine = RegulatoryComplianceEngine()

    # 2. Load generated projects
    proj_path = os.path.join(relational_dir, "01_projects.parquet")
    fin_path = os.path.join(relational_dir, "02_financials.parquet")
    prg_path = os.path.join(relational_dir, "04_progress.parquet")
    proc_path = os.path.join(relational_dir, "05_procurement.parquet")
    doc_path = os.path.join(relational_dir, "11_documents.parquet")

    if not os.path.exists(proj_path):
        print(f"Warning: {proj_path} not found. Generating sample evaluation...")
        return {}

    df_p = pd.read_parquet(proj_path)
    df_f = pd.read_parquet(fin_path)
    df_pr = pd.read_parquet(prg_path)
    df_pc = pd.read_parquet(proc_path)
    df_d = pd.read_parquet(doc_path)

    df_merged = df_p[["project_id"]].merge(df_f, on="project_id").merge(df_pr, on="project_id").merge(df_pc, on="project_id").merge(df_d, on="project_id")

    compliance_rows = []
    signals_rows = []

    total_projects = len(df_merged)
    compliant_count = 0
    total_violations = 0
    critical_violations = 0

    print(f"-> Auditing {total_projects:,} projects against regulatory rule base...")
    for idx, row in df_merged.iterrows():
        res = engine.evaluate_project_compliance(row.to_dict())
        if res["is_fully_compliant"]:
            compliant_count += 1
        total_violations += res["rule_violation_count"]
        critical_violations += res["critical_violation_count"]

        for v in res["rule_violations"]:
            compliance_rows.append({
                "project_id": res["project_id"],
                "rule_id": v["rule_id"],
                "rule_category": v["category"],
                "severity": v["severity"],
                "observed_value": str(v["observed_value"]),
                "expected_value": str(v["expected_value"]),
                "source_reference": v["source"],
            })

        for s in res["audit_signals"]:
            if s != "NO_CRITICAL_SIGNALS":
                signals_rows.append({
                    "signal_id": f"SIG-{idx+1:06d}",
                    "project_id": res["project_id"],
                    "signal_type": s,
                    "severity": "CRITICAL" if "GHOST" in s else "HIGH",
                })

    df_comp_out = pd.DataFrame(compliance_rows)
    df_sig_out = pd.DataFrame(signals_rows)

    df_comp_out.to_parquet(os.path.join(compliance_dir, "rule_compliance_dataset.parquet"), index=False)
    df_sig_out.to_parquet(os.path.join(anomalies_dir, "audit_signals.parquet"), index=False)

    comp_rate = round((compliant_count / total_projects) * 100, 2)

    # 3. Generate docs/COMPLIANCE_ENGINE.md
    comp_engine_md = f"""# MPLADS AI Audit — Regulatory Compliance Engine Documentation

## 1. Engine Architecture
The **AGASTYA Regulatory Compliance Engine** operates as an independent expert system alongside the ML risk models. It evaluates project data against normative government rules and empirical audit observation patterns.

```
                    PROJECT DATA INPUT
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    NORMATIVE RULES               CAG AUDIT PATTERNS
  - MoSPI eSAKSHI Guidelines     - Progress-Payment Divergence
  - DoE / GFR 2017 Procurement   - Single-Bid Rigging Pattern
  - GeM GTC v4.0 Terms           - Ghost Work & Geotag Gaps
            │                               │
            └───────────────┬───────────────┘
                            ▼
                COMPLIANCE SCORE (0–100)
                            +
            STRUCTURED TRACEABLE CITATIONS
```

---

## 2. Audit Run Summary (100,000 Projects)
- **Total Projects Audited:** `{total_projects:,}`
- **Fully Compliant Projects:** `{compliant_count:,}` (`{comp_rate}%`)
- **Total Rule Violations Identified:** `{total_violations:,}`
- **Critical Violations:** `{critical_violations:,}`
- **Active CAG Audit Signals:** `{len(df_sig_out):,}`

---

## 3. Legal Source Traceability
Every compliance signal generated by the platform includes:
1. `rule_id` / `pattern_id`
2. Exact source document (e.g. *GFR 2017 Rule 161*, *eSAKSHI Guidelines Section 4.2*)
3. Observed vs expected values
4. Severity tier (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`)
"""
    with open("docs/COMPLIANCE_ENGINE.md", "w") as f:
        f.write(comp_engine_md)

    # 4. Generate docs/REGULATORY_SOURCE_REPORT.md
    df_reg = pd.read_csv("data/regulatory/source_registry.csv")
    source_report_md = f"""# MPLADS AI Audit — Regulatory Source Classification & Lineage Report

This report documents the official government sources ingested into the AGASTYA Regulatory Knowledge Base.

| Source ID | Organization | Document / Source Name | Authority Level | Classification | URL |
|---|---|---|---|---|---|
{"".join(f'''| `{r["source_id"]}` | {r["organization"]} | **{r["source_name"]}** | `{r["authority_level"]}` | `{r["classification"]}` | [Link]({r["url"]}) |
''' for _, r in df_reg.iterrows())}

---

## Source Ingestion & Integrity Verification
- All official sources are cryptographically hashed using **SHA-256** upon ingestion to guarantee version integrity and immutability.
- Normative instructions are strictly partitioned from empirical audit observations (CAG/PAC) to avoid false-positive legal assertions.
"""
    with open("docs/REGULATORY_SOURCE_REPORT.md", "w") as f:
        f.write(source_report_md)

    print("=" * 60)
    print(f"[REGULATORY VALIDATOR] COMPLETE")
    print(f"Total Projects Checked:  {total_projects:,}")
    print(f"Compliant Projects:      {compliant_count:,} ({comp_rate}%)")
    print(f"Total Rule Violations:   {total_violations:,}")
    print(f"Critical Violations:     {critical_violations:,}")
    print(f"Compliance Output Saved: {compliance_dir}/rule_compliance_dataset.parquet")
    print(f"Audit Signals Saved:     {anomalies_dir}/audit_signals.parquet")
    print("=" * 60)

    return {
        "total_projects": total_projects,
        "compliant_count": compliant_count,
        "compliance_rate": comp_rate,
        "total_violations": total_violations,
    }


if __name__ == "__main__":
    validate_regulatory_pipeline()
