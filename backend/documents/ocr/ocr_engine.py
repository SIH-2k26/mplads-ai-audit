"""
documents/ocr/ocr_engine.py
OCREngine — applies pytesseract to low-quality/scanned pages.
Falls back gracefully if tesseract is not installed.
Only runs OCR when PyMuPDF extraction is insufficient (quality < threshold).
"""
from __future__ import annotations
import io
from dataclasses import dataclass
from typing import Optional


@dataclass
class OCRResult:
    page_number: int
    text: str
    confidence: float       # 0.0–1.0 estimated OCR confidence
    engine_used: str        # "tesseract" | "skipped" | "unavailable"
    error: Optional[str] = None


class OCREngine:
    """
    Tesseract-based OCR engine with graceful fallback.
    PaddleOCR integration stub for future GPU deployment.

    Usage:
        engine = OCREngine(lang="eng+hin")
        for page in parsed_doc.needs_ocr_pages:
            result = engine.ocr_page_from_pdf(pdf_path, page.page_number)
    """

    def __init__(
        self,
        lang: str = "eng",
        dpi: int = 300,
        psm: int = 3,
    ):
        self._lang = lang
        self._dpi = dpi
        self._psm = psm
        self._tesseract_available = self._check_tesseract()

    def _check_tesseract(self) -> bool:
        try:
            import pytesseract
            pytesseract.get_tesseract_version()
            return True
        except Exception:
            return False

    def ocr_page_from_pdf(self, pdf_path: str, page_number: int) -> OCRResult:
        """
        Extract text from a specific PDF page using OCR.
        page_number is 1-indexed.
        Renders the page to an image, then runs OCR.
        """
        if not self._tesseract_available:
            return OCRResult(
                page_number=page_number,
                text="",
                confidence=0.0,
                engine_used="unavailable",
                error="pytesseract/tesseract not installed or not in PATH",
            )

        try:
            import fitz
            import pytesseract
            from PIL import Image

            doc = fitz.open(pdf_path)
            page = doc[page_number - 1]  # convert to 0-indexed

            # Render at high DPI for better OCR
            mat = fitz.Matrix(self._dpi / 72, self._dpi / 72)
            pix = page.get_pixmap(matrix=mat)
            doc.close()

            img_bytes = pix.tobytes("png")
            img = Image.open(io.BytesIO(img_bytes))

            config = f"--psm {self._psm}"
            data = pytesseract.image_to_data(
                img, lang=self._lang, config=config,
                output_type=pytesseract.Output.DICT
            )

            # Extract text and confidence
            words = []
            confidences = []
            for i, word in enumerate(data["text"]):
                if word.strip() and data["conf"][i] > 0:
                    words.append(word)
                    confidences.append(float(data["conf"][i]) / 100.0)

            text = " ".join(words)
            avg_conf = sum(confidences) / max(len(confidences), 1) if confidences else 0.0

            return OCRResult(
                page_number=page_number,
                text=text,
                confidence=avg_conf,
                engine_used="tesseract",
            )

        except Exception as e:
            return OCRResult(
                page_number=page_number,
                text="",
                confidence=0.0,
                engine_used="tesseract",
                error=str(e),
            )

    def ocr_document(self, pdf_path: str, pages_to_ocr: list[int]) -> list[OCRResult]:
        """Run OCR on specified pages. Returns results in page order."""
        return [self.ocr_page_from_pdf(pdf_path, p) for p in pages_to_ocr]
