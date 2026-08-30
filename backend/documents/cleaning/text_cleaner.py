"""
documents/cleaning/text_cleaner.py
TextCleaner — cleans and normalizes extracted text from PDF/OCR.
Handles Hindi/English mixed text, removes artifacts, normalizes whitespace.
"""
from __future__ import annotations
import re
import unicodedata


class TextCleaner:
    """
    Cleans raw extracted text from PDFs or OCR engines.

    Operations:
    1. Unicode normalization (NFC) — handles mixed Devanagari/Latin
    2. Remove page headers/footers (repeated patterns)
    3. Remove excessive whitespace and blank lines
    4. Normalize hyphens, quotes, dashes
    5. Remove control characters
    6. Preserve paragraph structure
    """

    # Patterns for common PDF artifacts
    PAGE_NUMBER_RE = re.compile(r"^\s*(?:page\s+)?\d+\s*$", re.IGNORECASE | re.MULTILINE)
    REPEATED_DASH_RE = re.compile(r"[-─═]{5,}")
    MULTIPLE_NEWLINE_RE = re.compile(r"\n{3,}")
    MULTIPLE_SPACE_RE = re.compile(r"[ \t]{2,}")

    def clean(self, text: str) -> str:
        """
        Full cleaning pipeline. Returns cleaned text.
        Preserves paragraph breaks and meaningful structure.
        """
        if not text:
            return ""

        # 1. Unicode normalization
        text = unicodedata.normalize("NFC", text)

        # 2. Remove control characters (but keep newlines and tabs)
        text = "".join(
            c for c in text
            if unicodedata.category(c)[0] != "C" or c in "\n\t"
        )

        # 3. Normalize Unicode hyphens/dashes/quotes to ASCII equivalents
        text = text.replace("\u2013", "-").replace("\u2014", "--")
        text = text.replace("\u2018", "'").replace("\u2019", "'")
        text = text.replace("\u201c", '"').replace("\u201d", '"')
        text = text.replace("\u00a0", " ")  # non-breaking space

        # 4. Remove page number lines (lines that are only digits)
        text = self.PAGE_NUMBER_RE.sub("", text)

        # 5. Remove repeated separator lines
        text = self.REPEATED_DASH_RE.sub("", text)

        # 6. Normalize multiple spaces to single
        text = self.MULTIPLE_SPACE_RE.sub(" ", text)

        # 7. Normalize multiple blank lines to max 2 (preserve paragraph breaks)
        text = self.MULTIPLE_NEWLINE_RE.sub("\n\n", text)

        return text.strip()

    def clean_for_chunking(self, text: str) -> str:
        """
        Additional cleaning for embedding/chunking:
        - Remove extremely short lines (< 3 chars) that are artifacts
        - Normalize line endings
        """
        text = self.clean(text)
        lines = text.split("\n")
        filtered = [
            line for line in lines
            if len(line.strip()) >= 3 or line.strip() == ""
        ]
        return "\n".join(filtered)

    @staticmethod
    def extract_numbers(text: str) -> list[str]:
        """Extract numeric values (amounts, percentages, etc.) from text."""
        return re.findall(r"\b\d+(?:[,\d]*\.\d+)?\b", text)

    @staticmethod
    def extract_dates(text: str) -> list[str]:
        """Extract date-like strings from text."""
        pattern = re.compile(
            r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b"
        )
        return pattern.findall(text)
