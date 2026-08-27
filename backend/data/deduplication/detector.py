"""
data/deduplication/detector.py
Deduplication Engine for MPLADS projects, records, and payments.
Uses deterministic SHA-256 fingerprinting followed by token-based fuzzy similarity.
"""
from __future__ import annotations
import hashlib
import uuid
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from rapidfuzz import fuzz

from data.normalization.normalizer import (
    normalize_project_name,
    normalize_district_name,
    normalize_state_name,
)
from app.utils.logging import get_logger

logger = get_logger("deduplication_detector")


@dataclass
class DuplicateMatch:
    source_id: str
    target_id: str
    duplicate_group_id: str
    similarity_score: float
    is_exact_match: bool
    matching_features: Dict[str, float] = field(default_factory=dict)
    decision: str = "DUPLICATE"  # DUPLICATE | SUSPECTED_DUPLICATE | UNIQUE


class DuplicateDetector:
    """
    Detects identical and near-duplicate records across MPLADS project portfolios.

    Multi-tier strategy:
    1. Deterministic Fingerprint: normalized (state + district + category + amount + canonical_name)
    2. Fuzzy Match: Jaccard + Token Sort Ratio for projects in the same district/category.
    """

    EXACT_MATCH_THRESHOLD = 1.00
    FUZZY_MATCH_THRESHOLD = 0.88
    SUSPECT_THRESHOLD = 0.75

    def __init__(self):
        # In-memory index of registered fingerprints: fingerprint -> (project_id, duplicate_group_id)
        self._fingerprints: Dict[str, Tuple[str, str]] = {}
        # In-memory store of projects for fuzzy matching: project_id -> metadata_dict
        self._project_index: Dict[str, dict] = {}

    def compute_fingerprint(
        self,
        project_name: str,
        state: Optional[str],
        district: Optional[str],
        category: Optional[str],
        sanctioned_amount: float,
    ) -> str:
        """
        Creates a deterministic hash fingerprint from normalized core fields.
        """
        norm_name = normalize_project_name(project_name) if project_name else ""
        norm_state = normalize_state_name(state) if state else ""
        norm_dist = normalize_district_name(district) if district else ""
        norm_cat = (category or "").strip().upper()
        # Round amount to nearest thousand to catch minor rounding diffs in exact fingerprints
        rounded_amt = f"{round(float(sanctioned_amount), -3):.0f}" if sanctioned_amount else "0"

        raw = f"{norm_state}|{norm_dist}|{norm_cat}|{rounded_amt}|{norm_name}"
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def check_duplicate(
        self,
        project_id: str,
        project_name: str,
        state: Optional[str],
        district: Optional[str],
        category: Optional[str],
        sanctioned_amount: float,
    ) -> Optional[DuplicateMatch]:
        """
        Checks if the project matches an existing project.
        Returns DuplicateMatch if a duplicate or suspected duplicate is found.
        """
        fp = self.compute_fingerprint(project_name, state, district, category, sanctioned_amount)

        # 1. Exact Fingerprint Match
        if fp in self._fingerprints:
            target_id, group_id = self._fingerprints[fp]
            if target_id != project_id:
                return DuplicateMatch(
                    source_id=project_id,
                    target_id=target_id,
                    duplicate_group_id=group_id,
                    similarity_score=1.0,
                    is_exact_match=True,
                    matching_features={"fingerprint_match": 1.0},
                    decision="DUPLICATE",
                )

        # 2. Fuzzy Match across projects in the same geographic district/category
        norm_name = normalize_project_name(project_name) if project_name else ""
        norm_dist = normalize_district_name(district) if district else ""

        for other_id, other_meta in self._project_index.items():
            if other_id == project_id:
                continue

            # Quick filter: must match district if both present
            if norm_dist and other_meta["district"] and norm_dist != other_meta["district"]:
                continue

            # Compare names
            name_score = fuzz.token_sort_ratio(norm_name, other_meta["norm_name"]) / 100.0
            
            # Compare amounts
            other_amt = other_meta["amount"]
            amt_score = 1.0 - (abs(sanctioned_amount - other_amt) / max(sanctioned_amount, other_amt, 1.0))
            amt_score = max(0.0, amt_score)

            overall_sim = (0.7 * name_score) + (0.3 * amt_score)

            if overall_sim >= self.FUZZY_MATCH_THRESHOLD:
                return DuplicateMatch(
                    source_id=project_id,
                    target_id=other_id,
                    duplicate_group_id=other_meta["group_id"],
                    similarity_score=round(overall_sim, 3),
                    is_exact_match=False,
                    matching_features={"name_similarity": name_score, "amount_similarity": amt_score},
                    decision="DUPLICATE",
                )
            elif overall_sim >= self.SUSPECT_THRESHOLD:
                return DuplicateMatch(
                    source_id=project_id,
                    target_id=other_id,
                    duplicate_group_id=other_meta["group_id"],
                    similarity_score=round(overall_sim, 3),
                    is_exact_match=False,
                    matching_features={"name_similarity": name_score, "amount_similarity": amt_score},
                    decision="SUSPECTED_DUPLICATE",
                )

        return None

    def register_project(
        self,
        project_id: str,
        project_name: str,
        state: Optional[str],
        district: Optional[str],
        category: Optional[str],
        sanctioned_amount: float,
        group_id: Optional[str] = None,
    ) -> str:
        """
        Registers a project into the deduplication index.
        Returns the assigned duplicate_group_id.
        """
        match = self.check_duplicate(project_id, project_name, state, district, category, sanctioned_amount)
        if match and match.is_exact_match:
            assigned_group = match.duplicate_group_id
        else:
            assigned_group = group_id or f"dup-grp-{uuid.uuid4().hex[:12]}"

        fp = self.compute_fingerprint(project_name, state, district, category, sanctioned_amount)
        self._fingerprints[fp] = (project_id, assigned_group)

        self._project_index[project_id] = {
            "norm_name": normalize_project_name(project_name) if project_name else "",
            "district": normalize_district_name(district) if district else "",
            "state": normalize_state_name(state) if state else "",
            "category": (category or "").strip().upper(),
            "amount": float(sanctioned_amount or 0.0),
            "group_id": assigned_group,
        }

        return assigned_group
