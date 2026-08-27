"""
documents/extraction/structure_extractor.py
StructureExtractor — identifies document sections, headings, and tables
from cleaned PDF text using regex + heuristics.
"""
from __future__ import annotations
import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class DocumentSection:
    section_id: str
    heading: Optional[str]
    level: int              # 1 = top-level, 2 = subsection, etc.
    text: str
    page_start: int
    char_start: int
    char_end: int


@dataclass
class ExtractedStructure:
    document_id: str
    sections: list[DocumentSection] = field(default_factory=list)
    tables_detected: int = 0

    @property
    def section_texts(self) -> list[str]:
        return [s.text for s in self.sections if s.text.strip()]


class StructureExtractor:
    """
    Identifies structure in MPLADS-style government documents.

    Detects:
    - Numbered headings (e.g., "1. INTRODUCTION", "4.3 ELIGIBILITY")
    - Section headers in ALL CAPS
    - Paragraph breaks as logical section boundaries
    - Simple table indicators (lines with pipe chars or tab-separated values)

    Strategy: Greedy section splitting — if headings detected, use them;
    otherwise treat document as flat paragraphs.
    """

    # Numbered section heading: "1.", "1.1", "4.3.2" followed by text
    NUMBERED_HEADING_RE = re.compile(
        r"^(\d+(?:\.\d+)*)\s*[.)]\s+([A-Z][A-Z\s\-&/]{2,})",
        re.MULTILINE
    )
    # ALL CAPS heading (3+ words)
    CAPS_HEADING_RE = re.compile(
        r"^([A-Z][A-Z\s\-&/]{4,})$",
        re.MULTILINE
    )
    TABLE_RE = re.compile(r"[|│].*[|│]")

    def extract(self, document_id: str, text: str, page_number: int = 1) -> ExtractedStructure:
        """Extract structure from document text."""
        sections: list[DocumentSection] = []
        tables_detected = 0

        # Count table-like lines
        tables_detected = len(self.TABLE_RE.findall(text))

        # Try numbered headings first (most structured)
        numbered_matches = list(self.NUMBERED_HEADING_RE.finditer(text))

        if len(numbered_matches) >= 2:
            sections = self._split_by_matches(
                document_id, text, numbered_matches, page_number, heading_group=2
            )
        else:
            # Fall back to ALL CAPS headings
            caps_matches = list(self.CAPS_HEADING_RE.finditer(text))
            if len(caps_matches) >= 2:
                sections = self._split_by_matches(
                    document_id, text, caps_matches, page_number, heading_group=1
                )
            else:
                # No structure detected — treat as single section
                sections = [DocumentSection(
                    section_id=f"{document_id}-s0",
                    heading=None,
                    level=1,
                    text=text,
                    page_start=page_number,
                    char_start=0,
                    char_end=len(text),
                )]

        return ExtractedStructure(
            document_id=document_id,
            sections=sections,
            tables_detected=tables_detected,
        )

    def _split_by_matches(
        self,
        document_id: str,
        text: str,
        matches: list[re.Match],
        page_number: int,
        heading_group: int,
    ) -> list[DocumentSection]:
        sections = []
        positions = [(m.start(), m.end(), m.group(heading_group)) for m in matches]

        # Add sentinel
        positions.append((len(text), len(text), None))

        for i, (start, end, heading) in enumerate(positions[:-1]):
            next_start = positions[i + 1][0]
            section_text = text[end:next_start].strip()
            if section_text:
                sections.append(DocumentSection(
                    section_id=f"{document_id}-s{i}",
                    heading=heading.strip() if heading else None,
                    level=1,
                    text=section_text,
                    page_start=page_number,
                    char_start=start,
                    char_end=next_start,
                ))
        return sections
