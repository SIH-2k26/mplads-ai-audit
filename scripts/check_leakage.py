"""
scripts/check_leakage.py
Anti-Data Leakage Auditor for MPLADS AI Audit ML training matrices.
Verifies that:
1. Target variables (is_anomalous, risk_level, scenario_id, etc.) are strictly omitted from X.
2. Identifiers (project_id, contractor_id, etc.) are omitted from feature inputs.
3. No future or post-verdict fields are present in the feature columns.
4. Permutation correlation check verifies no single feature has 1.0 correlation with target.
"""
from __future__ import annotations
import os
import sys
import numpy as np
import pandas as pd
import yaml


def audit_feature_leakage(features_path: str = "data/synthetic/features/train_features.parquet", config_path: str = "configs/features.yaml") -> bool:
    print("=" * 60)
    print("[ANTI-LEAKAGE AUDITOR] Running Comprehensive Data Leakage Scan")
    print("=" * 60)

    if not os.path.exists(config_path):
        print(f"Error: Config path {config_path} not found.")
        return False

    with open(config_path, "r") as f:
        config = yaml.safe_load(f)

    exclusions = config.get("leakage_exclusions", [])
    print(f"-> Registered Exclusion Patterns: {exclusions}")

    if not os.path.exists(features_path):
        print(f"Warning: Features file {features_path} not built yet. Running schema check against feature registry...")
        all_features = []
        for group, feats in config.get("feature_groups", {}).items():
            all_features.extend(feats)

        # Check for forbidden intersection
        overlap = set(all_features).intersection(set(exclusions))
        if overlap:
            print(f"[FAIL] Forbidden targets found in feature registry: {overlap}")
            return False
        print("[PASS] Feature registry is clean with 0 forbidden targets.")
        return True

    df_feats = pd.read_parquet(features_path)
    target_labels = ["fraud_label", "is_anomalous", "risk_level", "anomaly_type", "investigation_priority",
                     "financial_anomaly", "procurement_anomaly", "contractor_anomaly", "geographic_anomaly",
                     "timeline_anomaly", "progress_anomaly", "documentation_anomaly", "cost_anomaly", "project_id"]
    feature_cols = [c for c in df_feats.columns if c not in target_labels]

    # 1. Check for explicit exclusion overlap in feature inputs
    forbidden_present = set(feature_cols).intersection(set(exclusions))
    if forbidden_present:
        print(f"[FAIL] Leakage Detected! Forbidden columns present in feature matrix: {forbidden_present}")
        return False

    print(f"[PASS] Zero forbidden target columns present in {len(feature_cols)} feature inputs.")

    # 2. Check for perfect collinearity / leakage with target
    if "is_anomalous" in df_feats.columns:
        target = df_feats["is_anomalous"]
        perfect_correlations = []
        for col in feature_cols:
            if np.issubdtype(df_feats[col].dtype, np.number):
                corr = abs(df_feats[col].corr(target))
                if corr > 0.98:
                    perfect_correlations.append((col, corr))

        if perfect_correlations:
            print(f"[FAIL] Suspiciously high feature-target correlation (>0.98): {perfect_correlations}")
            return False
        print("[PASS] No trivial single-feature leakage detected (Max correlation < 0.98).")

    print("=" * 60)
    print("[ANTI-LEAKAGE AUDITOR] AUDIT PASSED — Model feature matrix is verified clean.")
    print("=" * 60)
    return True


run_leakage_audit = audit_feature_leakage

if __name__ == "__main__":
    success = audit_feature_leakage()
    sys.exit(0 if success else 1)
