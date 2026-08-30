"""
documents/ingestion/document_pipeline.py
DocumentPipeline — full document processing pipeline.
PDF → Parse → OCR (if needed) → Clean → Structure → Metadata → Chunk → Embed → Store.
"""
from __future__ import annotations
import os
import sys

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import hashlib
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

from documents.parsing.pdf_parser import PDFParser, ParsedDocument
from documents.ocr.ocr_engine import OCREngine
from documents.cleaning.text_cleaner import TextCleaner
from documents.extraction.structure_extractor import StructureExtractor
from documents.metadata.metadata_extractor import MetadataExtractor, DocumentMetadata
from documents.chunking.semantic_chunker import SemanticChunker, DocumentChunk
from app.utils.logging import get_logger

logger = get_logger("document_pipeline")


@dataclass
class DocumentIngestionResult:
    document_id: str
    source_path: str
    project_id: Optional[str]
    total_pages: int
    total_chunks: int
    chunks: list[DocumentChunk] = field(default_factory=list)
    metadata: Optional[DocumentMetadata] = None
    ocr_pages: int = 0
    success: bool = True
    errors: list[str] = field(default_factory=list)
    checksum: Optional[str] = None


class DocumentPipeline:
    """
    End-to-end document processing pipeline.

    Steps:
    1. Compute checksum (detect duplicate documents)
    2. Parse PDF with PyMuPDF
    3. For low-quality pages: apply OCR via pytesseract
    4. Clean extracted text
    5. Extract structure (sections, headings)
    6. Extract metadata (project IDs, sanction numbers, amounts)
    7. Chunk into semantic chunks
    8. Return chunks for embedding + storage

    Note: Embedding and vector storage are handled by the caller
    (DocumentIndexer) so this pipeline remains pure/testable.
    """

    def __init__(
        self,
        max_tokens_per_chunk: int = 400,
        ocr_lang: str = "eng",
        ocr_threshold: float = 0.4,
    ):
        self._parser = PDFParser(ocr_threshold=ocr_threshold)
        self._ocr = OCREngine(lang=ocr_lang)
        self._cleaner = TextCleaner()
        self._structure = StructureExtractor()
        self._metadata = MetadataExtractor()
        self._chunker = SemanticChunker(
            max_tokens=max_tokens_per_chunk,
            min_tokens=50,
            overlap_tokens=50,
        )

    def process(
        self,
        file_path: str,
        project_id: Optional[str] = None,
        document_id: Optional[str] = None,
    ) -> DocumentIngestionResult:
        """
        Process a PDF document through the full pipeline.
        Returns DocumentIngestionResult with all chunks ready for embedding.
        """
        path = Path(file_path)
        if not path.exists():
            return DocumentIngestionResult(
                document_id=document_id or str(uuid.uuid4()),
                source_path=file_path,
                project_id=project_id,
                total_pages=0,
                total_chunks=0,
                success=False,
                errors=[f"File not found: {file_path}"],
            )

        # Step 1: Compute SHA-256 checksum for duplicate detection
        checksum = self._compute_checksum(file_path)
        doc_id = document_id or f"doc-{checksum[:16]}"

        logger.info("document_pipeline.start", document_id=doc_id, path=file_path)

        # Step 2: Parse PDF
        parsed: ParsedDocument = self._parser.parse(file_path, doc_id)
        if parsed.parse_error:
            logger.warning("document_pipeline.parse_error", error=parsed.parse_error)
            return DocumentIngestionResult(
                document_id=doc_id,
                source_path=file_path,
                project_id=project_id,
                total_pages=0,
                total_chunks=0,
                success=False,
                errors=[parsed.parse_error],
                checksum=checksum,
            )

        errors: list[str] = []
        ocr_count = 0

        # Step 3: Apply OCR to low-quality pages
        for page in parsed.pages:
            if page.needs_ocr:
                ocr_result = self._ocr.ocr_page_from_pdf(file_path, page.page_number)
                if ocr_result.text.strip():
                    page.text = ocr_result.text
                    ocr_count += 1
                if ocr_result.error:
                    errors.append(f"OCR page {page.page_number}: {ocr_result.error}")

        # Step 4: Clean all page texts
        for page in parsed.pages:
            page.text = self._cleaner.clean_for_chunking(page.text)

        # Step 5: Extract structure from full document
        full_text = "\n\n".join(
            f"[Page {p.page_number}]\n{p.text}"
            for p in parsed.pages if p.text.strip()
        )
        structure = self._structure.extract(doc_id, full_text)

        # Step 6: Extract metadata
        metadata = self._metadata.extract(doc_id, full_text)
        if project_id and project_id not in metadata.project_ids_found:
            metadata.project_ids_found.insert(0, project_id)

        # Step 7: Chunk into semantic chunks
        all_chunks: list[DocumentChunk] = []
        if structure.sections:
            all_chunks = self._chunker.chunk_document(
                document_id=doc_id,
                text=full_text,
                sections=structure.sections,
            )
        else:
            all_chunks = self._chunker.chunk_document(
                document_id=doc_id,
                text=full_text,
            )

        logger.info(
            "document_pipeline.complete",
            document_id=doc_id,
            pages=parsed.total_pages,
            chunks=len(all_chunks),
            ocr_pages=ocr_count,
        )

        return DocumentIngestionResult(
            document_id=doc_id,
            source_path=file_path,
            project_id=project_id,
            total_pages=parsed.total_pages,
            total_chunks=len(all_chunks),
            chunks=all_chunks,
            metadata=metadata,
            ocr_pages=ocr_count,
            success=True,
            errors=errors,
            checksum=checksum,
        )

    @staticmethod
    def _compute_checksum(file_path: str) -> str:
        """SHA-256 checksum for duplicate document detection."""
        sha256 = hashlib.sha256()
        with open(file_path, "rb") as f:
            for block in iter(lambda: f.read(65536), b""):
                sha256.update(block)
        return sha256.hexdigest()


if __name__ == "__main__":
    import os
    import sys
    backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    print("=" * 60)
    print("[DOCUMENT PIPELINE] Initializing Document Ingestion & Chunking Pipeline")
    print("=" * 60)
    pipe = DocumentPipeline()
    print(" [OK] DocumentPipeline parser, OCR engine, and semantic chunker initialized successfully.")
    print("=" * 60)

