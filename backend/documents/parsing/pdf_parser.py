"""
documents/parsing/pdf_parser.py
PDFParser — extracts text from PDFs using PyMuPDF (fitz).
Assesses text quality per page to decide whether OCR is needed.
"""
from __future__ import annotations
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


@dataclass
class ParsedPage:
    page_number: int        # 1-indexed
    text: str
    char_count: int
    word_count: int
    text_quality: float     # 0.0 (bad) to 1.0 (good), used to decide OCR
    needs_ocr: bool
    image_count: int = 0


@dataclass
class ParsedDocument:
    document_id: str
    source_path: str
    total_pages: int
    pages: list[ParsedPage] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)
    parse_error: Optional[str] = None

    @property
    def full_text(self) -> str:
        return "\n\n".join(p.text for p in self.pages if p.text.strip())

    @property
    def needs_ocr_pages(self) -> list[ParsedPage]:
        return [p for p in self.pages if p.needs_ocr]


class PDFParser:
    """
    Extracts text from PDFs using PyMuPDF.
    Assesses quality per page to identify which pages need OCR fallback.

    Text quality heuristics:
    - Pages with < 50 chars/page → scanned/image-only → needs OCR
    - High non-ASCII ratio (> 0.3) with no known script → likely garbled → needs OCR
    - Normal text with paragraphs and words → quality ~ 1.0
    """

    OCR_CHAR_THRESHOLD = 50          # chars per page below which OCR is triggered
    OCR_QUALITY_THRESHOLD = 0.4      # quality score below which OCR is triggered

    def __init__(self, ocr_threshold: float = OCR_QUALITY_THRESHOLD):
        self._ocr_threshold = ocr_threshold

    def parse(self, file_path: str, document_id: str) -> ParsedDocument:
        """
        Parse a PDF file. Returns ParsedDocument with per-page quality.
        Never raises — captures errors in parse_error field.
        """
        try:
            import fitz  # PyMuPDF
        except ImportError:
            return ParsedDocument(
                document_id=document_id,
                source_path=file_path,
                total_pages=0,
                parse_error="PyMuPDF (fitz) not installed. Install with: pip install PyMuPDF",
            )

        try:
            doc = fitz.open(file_path)
        except Exception as e:
            return ParsedDocument(
                document_id=document_id,
                source_path=file_path,
                total_pages=0,
                parse_error=f"Failed to open PDF: {e}",
            )

        pages: list[ParsedPage] = []
        metadata: dict = {}

        # Extract document-level metadata
        try:
            meta = doc.metadata or {}
            metadata = {k: v for k, v in meta.items() if v}
        except Exception:
            pass

        for page_num in range(len(doc)):
            try:
                page = doc[page_num]
                text = page.get_text("text")
                image_list = page.get_images(full=False)

                quality = self._assess_quality(text)
                char_count = len(text)
                word_count = len(text.split())
                needs_ocr = (char_count < self.OCR_CHAR_THRESHOLD or
                             quality < self._ocr_threshold)

                pages.append(ParsedPage(
                    page_number=page_num + 1,
                    text=text,
                    char_count=char_count,
                    word_count=word_count,
                    text_quality=quality,
                    needs_ocr=needs_ocr,
                    image_count=len(image_list),
                ))
            except Exception as e:
                # Don't fail on a single bad page
                pages.append(ParsedPage(
                    page_number=page_num + 1,
                    text="",
                    char_count=0,
                    word_count=0,
                    text_quality=0.0,
                    needs_ocr=True,
                    image_count=0,
                ))

        doc.close()

        return ParsedDocument(
            document_id=document_id,
            source_path=file_path,
            total_pages=len(pages),
            pages=pages,
            metadata=metadata,
        )

    def _assess_quality(self, text: str) -> float:
        """
        Returns a quality score 0.0–1.0 for extracted text.
        Low score → image/scanned page → OCR needed.
        """
        if not text or len(text.strip()) < 10:
            return 0.0

        # Ratio of alphanumeric + common punctuation
        printable = sum(1 for c in text if c.isalnum() or c in ' \n.,;:()\'-')
        ratio = printable / max(len(text), 1)

        # Word length heuristic: real text has avg word len 3–12
        words = [w for w in text.split() if w.isalpha()]
        if not words:
            return ratio * 0.3  # no real words = very low quality
        avg_word_len = sum(len(w) for w in words) / len(words)
        word_quality = 1.0 if 2 < avg_word_len < 15 else 0.4

        return min(1.0, ratio * 0.6 + word_quality * 0.4)
