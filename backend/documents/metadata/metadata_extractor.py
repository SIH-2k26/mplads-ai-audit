"""
documents/metadata/metadata_extractor.py
MetadataExtractor — extracts structured metadata from MPLADS document text.
Finds: project IDs, sanction numbers, dates, currency amounts, locations.
"""
from __future__ import annotations
import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class DocumentMetadata:
    document_id: str
    document_type: Optional[str] = None    # SANCTION_ORDER, WORK_ORDER, etc.
    project_ids_found: list[str] = field(default_factory=list)
    sanction_numbers: list[str] = field(default_factory=list)
    currency_amounts: list[float] = field(default_factory=list)
    dates_found: list[str] = field(default_factory=list)
    districts_found: list[str] = field(default_factory=list)
    states_found: list[str] = field(default_factory=list)
    mp_names_found: list[str] = field(default_factory=list)
    raw_fields: dict = field(default_factory=dict)


# MPLADS-specific regex patterns
SANCTION_NUMBER_RE = re.compile(
    r"(?:Sanction\s+(?:No|Number)\.?\s*:?\s*)([A-Z0-9/\-]{6,})",
    re.IGNORECASE,
)
MPLADS_PROJECT_ID_RE = re.compile(
    r"\b(?:MPLADS|PROJ|PROJECT)[/\-]\s*[A-Z]{2}[/\-]\s*\d{4}[/\-]\s*\d+\b",
    re.IGNORECASE,
)
CURRENCY_RE = re.compile(
    r"(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)",
    re.IGNORECASE,
)
DATE_RE = re.compile(
    r"\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}|"
    r"\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4})\b",
    re.IGNORECASE,
)

# Known Indian states for detection
INDIAN_STATES = [
    "Uttar Pradesh", "Maharashtra", "Bihar", "West Bengal", "Madhya Pradesh",
    "Tamil Nadu", "Rajasthan", "Karnataka", "Gujarat", "Andhra Pradesh",
    "Odisha", "Telangana", "Jharkhand", "Assam", "Punjab", "Haryana",
    "Chhattisgarh", "Delhi", "Uttarakhand", "Himachal Pradesh",
    "Jammu and Kashmir", "Goa", "Kerala", "Manipur", "Meghalaya",
    "Nagaland", "Sikkim", "Tripura", "Arunachal Pradesh", "Mizoram",
]

DOC_TYPE_KEYWORDS = {
    "SANCTION_ORDER": ["sanction order", "sanctioned amount", "letter of sanction"],
    "WORK_ORDER": ["work order", "letter of award", "contract agreement"],
    "COMPLETION_CERTIFICATE": ["completion certificate", "certificate of completion"],
    "UTILIZATION_CERTIFICATE": ["utilization certificate", "UC"],
    "INSPECTION_REPORT": ["inspection report", "field inspection", "site visit"],
    "PHOTO_EVIDENCE": ["photograph", "photo evidence"],
    "CONTRACTOR_AGREEMENT": ["contractor agreement", "agreement deed"],
    "ESTIMATE": ["detailed estimate", "technical sanction", "DPR"],
}


class MetadataExtractor:
    """
    Extracts structured metadata from MPLADS document text.
    Used to link document chunks back to project records.
    """

    def extract(self, document_id: str, text: str) -> DocumentMetadata:
        """Extract all detectable metadata from document text."""
        meta = DocumentMetadata(document_id=document_id)

        # Detect document type
        meta.document_type = self._detect_doc_type(text)

        # Extract project IDs
        meta.project_ids_found = list({
            m.group(0).upper()
            for m in MPLADS_PROJECT_ID_RE.finditer(text)
        })

        # Extract sanction numbers
        meta.sanction_numbers = list({
            m.group(1).strip()
            for m in SANCTION_NUMBER_RE.finditer(text)
        })

        # Extract currency amounts
        amounts = []
        for m in CURRENCY_RE.finditer(text):
            try:
                amount = float(m.group(1).replace(",", ""))
                amounts.append(amount)
            except ValueError:
                pass
        meta.currency_amounts = amounts

        # Extract dates
        meta.dates_found = list({m.group(0) for m in DATE_RE.finditer(text)})[:10]

        # Extract states
        text_lower = text.lower()
        meta.states_found = [s for s in INDIAN_STATES if s.lower() in text_lower]

        return meta

    def _detect_doc_type(self, text: str) -> Optional[str]:
        text_lower = text.lower()
        for doc_type, keywords in DOC_TYPE_KEYWORDS.items():
            if any(kw.lower() in text_lower for kw in keywords):
                return doc_type
        return None
