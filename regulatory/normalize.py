"""
regulatory/normalize.py
Normalization Pipeline for Regulatory Rules and Audit Observation Patterns.
Generates canonical Parquet & CSV databases and comprehensive Markdown catalogs.
"""
from __future__ import annotations
import json
import os
import sys
import pandas as pd
from regulatory.extractor import extract_regulatory_rules


def normalize_regulatory_knowledge(output_base: str = "data/regulatory") -> Dict[str, Any]:
    print("=" * 60)
    print("[REGULATORY NORMALIZER] Normalizing Rules & Audit Patterns into Canonical Data Stores")
    print("=" * 60)

    rules_dir = os.path.join(output_base, "rules")
    patterns_dir = os.path.join(output_base, "audit_patterns")
    norm_dir = os.path.join(output_base, "normalized")
    os.makedirs(rules_dir, exist_ok=True)
    os.makedirs(patterns_dir, exist_ok=True)
    os.makedirs(norm_dir, exist_ok=True)
    os.makedirs("docs", exist_ok=True)

    extracted = extract_regulatory_rules()
    rules_list = extracted["normative_rules"]
    patterns_list = extracted["audit_patterns"]

    df_rules = pd.DataFrame(rules_list)
    df_patterns = pd.DataFrame(patterns_list)

    # 1. Save Rules
    df_rules.to_csv(os.path.join(rules_dir, "regulatory_rules.csv"), index=False)
    df_rules.to_parquet(os.path.join(rules_dir, "regulatory_rules.parquet"), index=False)

    # 2. Save Patterns
    df_patterns.to_csv(os.path.join(patterns_dir, "cag_audit_patterns.csv"), index=False)
    df_patterns.to_parquet(os.path.join(patterns_dir, "cag_audit_patterns.parquet"), index=False)

    # 3. Save Normalized JSON Catalog
    with open(os.path.join(norm_dir, "rule_catalog.json"), "w") as f:
        json.dump(rules_list, f, indent=2)

    with open(os.path.join(norm_dir, "audit_pattern_catalog.json"), "w") as f:
        json.dump(patterns_list, f, indent=2)

    # 4. Generate docs/RULE_CATALOG.md
    md_rules = f"""# MPLADS AI Audit — Regulatory Rule Catalog

This catalog documents the normalized normative compliance rules extracted from official government sources (MoSPI eSAKSHI Guidelines, DoE / GFR 2017 Procurement Rules, GeM GTC).

| Rule ID | Category | Rule Name | Normalized Standard | Severity | Source |
|---|---|---|---|---|---|
{"".join(f'''| `{r["rule_id"]}` | {r["rule_category"]} | **{r["rule_name"]}** | {r["normalized_rule"]} | `{r["severity"]}` | {r["source_document"]} |
''' for r in rules_list)}

## Rule Hierarchy & Applicability Protocol
- **Level 1 (MPLADS Operational Guidelines):** Precedence on scheme workflow, sanction caps, and eSAKSHI digital milestone verifications.
- **Level 2 (DoE / GFR 2017):** Precedence on public procurement, tendering thresholds (> Rs. 2.5L), and 10% variation order caps.
- **Level 3 (GeM GTC):** Applicable strictly when `procurement_channel == 'GEM'`.
"""
    with open("docs/RULE_CATALOG.md", "w") as f:
        f.write(md_rules)

    # 5. Generate docs/AUDIT_PATTERN_CATALOG.md
    md_patterns = f"""# MPLADS AI Audit — CAG Audit Pattern Catalog

This catalog documents empirical audit observation patterns derived from Comptroller and Auditor General (CAG) audit reports.

> **Methodological Boundary:** Audit patterns represent **evidentiary signals and risk triggers** for investigation prioritisation. They are never treated as self-proving assertions of guilt.

| Pattern ID | Category | Audit Observation Title | Empirical Risk Indicator | Severity | Source Report |
|---|---|---|---|---|---|
{"".join(f'''| `{p["pattern_id"]}` | {p["category"]} | **{p["title"]}** | `{p["indicator_features"]}` | `{p["severity"]}` | {p["source_report"]} |
''' for p in patterns_list)}
"""
    with open("docs/AUDIT_PATTERN_CATALOG.md", "w") as f:
        f.write(md_patterns)

    print(f" [OK] Saved {len(df_rules)} normative rules to {rules_dir}/regulatory_rules.parquet")
    print(f" [OK] Saved {len(df_patterns)} audit patterns to {patterns_dir}/cag_audit_patterns.parquet")
    print(f" [OK] Generated docs/RULE_CATALOG.md and docs/AUDIT_PATTERN_CATALOG.md")
    print("=" * 60)

    return {"rules_count": len(df_rules), "patterns_count": len(df_patterns)}


if __name__ == "__main__":
    normalize_regulatory_knowledge()
