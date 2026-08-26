"""
data/entity_resolution/resolver.py
Entity Resolution — resolves raw entity mentions to canonical IDs.
Supports exact, normalized, and fuzzy matching.
Never auto-merges low-confidence matches.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Optional
from rapidfuzz import fuzz, process as fuzz_process
from models.enums import MatchMethod
from data.normalization.normalizer import normalize_entity_name
from app.config.settings import get_settings

settings = get_settings()


@dataclass
class EntityMatch:
    source_name: str
    canonical_id: str
    canonical_name: str
    method: MatchMethod
    confidence: float
    is_auto_merged: bool = False


@dataclass
class ResolutionResult:
    source_id: str
    source_name: str
    match: Optional[EntityMatch] = None
    is_new_entity: bool = False
    needs_human_review: bool = False


class EntityResolver:
    """
    Resolves entity mentions to canonical entities.

    Rules:
    - confidence >= 0.95 → auto-merge (EXACT or NORMALIZED)
    - confidence 0.85–0.95 → auto-merge with fuzzy flag
    - confidence < 0.85 → create new entity or flag for human review
    """

    AUTO_MERGE_THRESHOLD = 0.95
    FUZZY_THRESHOLD = settings.fuzzy_match_threshold

    def __init__(self, entity_type: str):
        self.entity_type = entity_type
        # canonical_id → (canonical_name, normalized_name)
        self._registry: dict[str, tuple[str, str]] = {}

    def register(self, canonical_id: str, canonical_name: str) -> None:
        """Add a known entity to the registry."""
        normalized = normalize_entity_name(canonical_name)
        self._registry[canonical_id] = (canonical_name, normalized)

    def resolve(self, source_id: str, source_name: str) -> ResolutionResult:
        """
        Resolve a raw entity name to a canonical entity.
        Returns a ResolutionResult — never automatically merges low-confidence matches.
        """
        if not source_name:
            return ResolutionResult(source_id=source_id, source_name=source_name, is_new_entity=True)

        # STEP 1: Exact name match
        for cid, (cname, _) in self._registry.items():
            if cname.strip().lower() == source_name.strip().lower():
                return ResolutionResult(
                    source_id=source_id,
                    source_name=source_name,
                    match=EntityMatch(
                        source_name=source_name,
                        canonical_id=cid,
                        canonical_name=cname,
                        method=MatchMethod.EXACT,
                        confidence=1.0,
                        is_auto_merged=True,
                    ),
                )

        # STEP 2: Normalized name match
        normalized_source = normalize_entity_name(source_name)
        for cid, (cname, normalized_canonical) in self._registry.items():
            if normalized_canonical == normalized_source:
                return ResolutionResult(
                    source_id=source_id,
                    source_name=source_name,
                    match=EntityMatch(
                        source_name=source_name,
                        canonical_id=cid,
                        canonical_name=cname,
                        method=MatchMethod.NORMALIZED,
                        confidence=0.97,
                        is_auto_merged=True,
                    ),
                )

        # STEP 3: Fuzzy match
        if self._registry:
            choices = {cid: norm for cid, (_, norm) in self._registry.items()}
            result = fuzz_process.extractOne(
                normalized_source,
                choices,
                scorer=fuzz.WRatio,
                score_cutoff=int(self.FUZZY_THRESHOLD * 100),
            )
            if result:
                matched_cid = result[2]  # Key
                score = result[1] / 100.0
                canonical_name = self._registry[matched_cid][0]
                is_auto = score >= self.AUTO_MERGE_THRESHOLD

                return ResolutionResult(
                    source_id=source_id,
                    source_name=source_name,
                    match=EntityMatch(
                        source_name=source_name,
                        canonical_id=matched_cid,
                        canonical_name=canonical_name,
                        method=MatchMethod.FUZZY,
                        confidence=score,
                        is_auto_merged=is_auto,
                    ),
                    needs_human_review=not is_auto,
                )

        # STEP 4: No match — new entity
        return ResolutionResult(
            source_id=source_id,
            source_name=source_name,
            is_new_entity=True,
        )

    def generate_canonical_id(self, name: str, prefix: str = "ENT") -> str:
        """Generate a canonical ID for a new entity."""
        from app.utils.hashing import short_id
        return f"{prefix}_{short_id(name.lower())}"
