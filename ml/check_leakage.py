"""
ml/check_leakage.py
Anti-Data Leakage Auditor for ML feature matrices.
"""
from __future__ import annotations
import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from scripts.check_leakage import audit_feature_leakage, run_leakage_audit

if __name__ == "__main__":
    success = run_leakage_audit()
    sys.exit(0 if success else 1)
