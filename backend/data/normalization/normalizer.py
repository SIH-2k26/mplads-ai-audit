"""
data/normalization/normalizer.py
Normalizes raw field values to canonical forms.
Includes state, district, agency, contractor name normalization.
"""
from __future__ import annotations
import re
import unicodedata
from typing import Optional

# ── Indian State Name Normalization ─────────────────────────────────────────
STATE_ALIASES: dict[str, str] = {
    "UP": "Uttar Pradesh",
    "MH": "Maharashtra",
    "MP": "Madhya Pradesh",
    "RJ": "Rajasthan",
    "GJ": "Gujarat",
    "TN": "Tamil Nadu",
    "KA": "Karnataka",
    "WB": "West Bengal",
    "AP": "Andhra Pradesh",
    "TS": "Telangana",
    "KL": "Kerala",
    "OR": "Odisha",
    "OD": "Odisha",
    "HR": "Haryana",
    "PB": "Punjab",
    "BR": "Bihar",
    "JH": "Jharkhand",
    "CG": "Chhattisgarh",
    "UK": "Uttarakhand",
    "UA": "Uttarakhand",
    "HP": "Himachal Pradesh",
    "JK": "Jammu and Kashmir",
    "SK": "Sikkim",
    "AR": "Arunachal Pradesh",
    "AS": "Assam",
    "MN": "Manipur",
    "ML": "Meghalaya",
    "MZ": "Mizoram",
    "NL": "Nagaland",
    "TR": "Tripura",
    "GA": "Goa",
    "DL": "Delhi",
    "CH": "Chandigarh",
    "DN": "Dadra and Nagar Haveli and Daman and Diu",
    "AN": "Andaman and Nicobar Islands",
    "LD": "Lakshadweep",
    "PY": "Puducherry",
}

CANONICAL_STATE_SET = {s.lower() for s in STATE_ALIASES.values()}

# Organizational suffixes to strip for normalization
ORG_SUFFIXES = [
    r"\bprivate\s+limited\b",
    r"\bpvt\.?\s*ltd\.?\b",
    r"\blimited\b",
    r"\bltd\.?\b",
    r"\bcorporation\b",
    r"\bcorp\.?\b",
    r"\benterprises?\b",
    r"\bconstruction\b",
    r"\bconstructions?\b",
    r"\binfrastructure\b",
    r"\binfra\b",
    r"\bbuilders?\b",
    r"\bworks?\b",
    r"\bco\.?\b",
    r"\bcompany\b",
]


def normalize_text(text: str) -> str:
    """Normalize to lowercase ASCII without accents."""
    nfkd = unicodedata.normalize("NFKD", text)
    ascii_str = nfkd.encode("ascii", "ignore").decode("ascii")
    return ascii_str.lower().strip()


def normalize_state(state: str) -> Optional[str]:
    """Normalize state name to canonical form."""
    if not state:
        return None
    s = state.strip()
    # Check alias (abbreviation) first
    upper = s.upper()
    if upper in STATE_ALIASES:
        return STATE_ALIASES[upper]
    # Try title case match
    title = s.title()
    if title.lower() in CANONICAL_STATE_SET:
        return title
    # Fuzzy: try to find closest canonical
    normalized = normalize_text(s)
    for canonical in STATE_ALIASES.values():
        if normalize_text(canonical) == normalized:
            return canonical
    return s.title()  # Return title-cased if no match found


def normalize_district(district: str) -> Optional[str]:
    """Normalize district name (title case, strip common suffixes)."""
    if not district:
        return None
    cleaned = re.sub(r"\s+dist\.?\s*$", "", district.strip(), flags=re.IGNORECASE)
    return cleaned.strip().title()


def normalize_entity_name(name: str) -> str:
    """
    Normalize contractor/agency name for entity resolution.
    Returns a consistent key suitable for comparison.
    """
    if not name:
        return ""
    result = name.lower().strip()
    # Remove organizational suffixes
    for pattern in ORG_SUFFIXES:
        result = re.sub(pattern, "", result, flags=re.IGNORECASE)
    # Remove special characters except spaces
    result = re.sub(r"[^\w\s]", " ", result)
    # Collapse whitespace
    result = re.sub(r"\s+", " ", result).strip()
    return result


def normalize_amount(value: str | float | None) -> Optional[float]:
    """Parse amount strings like '₹25,00,000' to float."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    cleaned = re.sub(r"[₹,$,\s]", "", str(value).strip())
    try:
        return float(cleaned)
    except ValueError:
        return None


def normalize_percentage(value: str | float | None) -> Optional[float]:
    """Parse percentage strings like '75%' to float."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        v = float(value)
        return v if 0 <= v <= 100 else None
    cleaned = str(value).strip().rstrip("%")
    try:
        v = float(cleaned)
        return v if 0 <= v <= 100 else None
    except ValueError:
        return None


def normalize_date(value: str | None) -> Optional[str]:
    """Try to parse date strings into ISO 8601 format (YYYY-MM-DD)."""
    if not value:
        return None
    from datetime import datetime
    formats = [
        "%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d", "%m/%d/%Y",
        "%d %b %Y", "%d %B %Y", "%B %d, %Y",
        "%Y/%m/%d", "%d.%m.%Y",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(str(value).strip(), fmt).date().isoformat()
        except ValueError:
            continue
    return None  # Unrecognized format


class ProjectNormalizer:
    """
    Normalizes a raw project record into a clean, consistent dict.
    Does NOT fix invalid data silently — only normalizes format/encoding.
    """

    FIELD_MAPPINGS: dict[str, list[str]] = {
        # canonical_name: [possible raw field names]
        "project_id": ["project_id", "ProjectID", "project_code", "MPLADS_ID"],
        "project_name": ["project_name", "ProjectName", "name", "work_name"],
        "state": ["state", "State", "state_name", "StateName"],
        "district": ["district", "District", "district_name"],
        "sanctioned_amount": ["sanctioned_amount", "SanctionedAmount", "sanction_amount", "amount_sanctioned"],
        "total_expenditure": ["total_expenditure", "expenditure", "Expenditure", "amount_spent"],
        "financial_progress": ["financial_progress", "FinancialProgress", "financial_progress_pct"],
        "physical_progress": ["physical_progress", "PhysicalProgress", "work_progress"],
        "project_status": ["project_status", "ProjectStatus", "status", "Status"],
        "agency_name": ["agency_name", "AgencyName", "implementing_agency", "ImplementingAgency"],
        "contractor_name": ["contractor_name", "ContractorName", "contractor", "Contractor"],
        "start_date": ["start_date", "StartDate", "commencement_date"],
        "expected_completion_date": ["expected_completion_date", "ExpectedCompletionDate", "due_date"],
        "actual_completion_date": ["actual_completion_date", "ActualCompletionDate", "completion_date"],
        "mp_name": ["mp_name", "MPName", "mp", "MP"],
        "category": ["category", "Category", "project_category", "work_category"],
    }

    def normalize(self, raw: dict) -> dict:
        normalized = {}

        # Map field aliases
        for canonical, aliases in self.FIELD_MAPPINGS.items():
            for alias in aliases:
                if alias in raw and raw[alias] is not None:
                    normalized[canonical] = raw[alias]
                    break

        # Apply type-specific normalization
        if "state" in normalized:
            normalized["state"] = normalize_state(normalized["state"] or "")
        if "district" in normalized:
            normalized["district"] = normalize_district(normalized["district"] or "")
        if "sanctioned_amount" in normalized:
            normalized["sanctioned_amount"] = normalize_amount(normalized["sanctioned_amount"])
        if "total_expenditure" in normalized:
            normalized["total_expenditure"] = normalize_amount(normalized["total_expenditure"])
        if "financial_progress" in normalized:
            normalized["financial_progress"] = normalize_percentage(normalized["financial_progress"])
        if "physical_progress" in normalized:
            normalized["physical_progress"] = normalize_percentage(normalized["physical_progress"])
        for date_field in ("start_date", "expected_completion_date", "actual_completion_date"):
            if date_field in normalized:
                normalized[date_field] = normalize_date(normalized[date_field])

        # Preserve provenance
        if "_provenance" in raw:
            normalized["_provenance"] = raw["_provenance"]

        return normalized
