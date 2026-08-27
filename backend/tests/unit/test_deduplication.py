"""
tests/unit/test_deduplication.py
Unit tests for deterministic & fuzzy DuplicateDetector.
"""
import pytest
from data.deduplication.detector import DuplicateDetector


@pytest.fixture
def detector():
    return DuplicateDetector()


def test_exact_fingerprint_duplicate(detector):
    # Register Project 1
    grp1 = detector.register_project(
        project_id="PROJ-ORIG-001",
        project_name="Construction of CC Road from Main Gate to Block Office",
        state="Uttar Pradesh",
        district="Lucknow",
        category="ROAD",
        sanctioned_amount=2000000.0,
    )

    # Check identical project with slightly different casing/whitespace
    match = detector.check_duplicate(
        project_id="PROJ-DUP-002",
        project_name="construction of cc road from main gate to block office  ",
        state="uttar pradesh",
        district="lucknow",
        category="road",
        sanctioned_amount=2000000.0,
    )

    assert match is not None
    assert match.is_exact_match is True
    assert match.duplicate_group_id == grp1
    assert match.similarity_score == 1.0


def test_fuzzy_similar_duplicate(detector):
    detector.register_project(
        project_id="PROJ-A",
        project_name="Installation of Solar High Mast Street Lights at Ward 12",
        state="Maharashtra",
        district="Pune",
        category="ENERGY",
        sanctioned_amount=500000.0,
    )

    match = detector.check_duplicate(
        project_id="PROJ-B",
        project_name="Solar High Mast Street Lights Installation at Ward No 12",
        state="Maharashtra",
        district="Pune",
        category="ENERGY",
        sanctioned_amount=490000.0,
    )

    assert match is not None
    assert match.similarity_score >= 0.85
    assert match.decision == "DUPLICATE"
