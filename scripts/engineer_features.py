"""
scripts/engineer_features.py
Feature Engineering script for MPLADS AI Audit.
Calls ml.features.build_comprehensive_feature_matrix to generate the unified feature matrix.
"""
from __future__ import annotations
import os
import sys

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from ml.features import build_comprehensive_feature_matrix


def engineer_features(relational_dir: str = "data/synthetic/relational", output_dir: str = "data/processed"):
    return build_comprehensive_feature_matrix(relational_dir=relational_dir, output_dir="data/synthetic/features")


if __name__ == "__main__":
    engineer_features()
