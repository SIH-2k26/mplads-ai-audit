"""
documents/chunking/semantic_chunker.py
SemanticChunker — section-aware chunking that preserves document structure.
Does NOT blindly split every N characters.
Respects section boundaries, headings, and max chunk size.
"""
from __future__ import annotations
import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class DocumentChunk:
    chunk_id: str           # "{document_id}-chunk-{n}"
    document_id: str
    text: str
    chunk_index: int
    page_number: Optional[int] = None
    section_heading: Optional[str] = None
    section_id: Optional[str] = None
    char_start: int = 0
    char_end: int = 0
    token_estimate: int = 0  # rough word count ≈ token count

    def __post_init__(self):
        self.token_estimate = len(self.text.split())


class SemanticChunker:
    """
    Chunks documents while preserving semantic boundaries.

    Strategy:
    1. If sections detected → chunk within each section (never split across sections)
    2. Within a section: split at paragraph boundaries first
    3. If a paragraph exceeds max_tokens → split at sentence boundaries
    4. Never produce chunks under min_tokens (merge with next)

    Overlap: each chunk repeats the first `overlap_tokens` words from the previous chunk
    for context continuity in retrieval.
    """

    def __init__(
        self,
        max_tokens: int = 400,
        min_tokens: int = 50,
        overlap_tokens: int = 50,
    ):
        self._max_tokens = max_tokens
        self._min_tokens = min_tokens
        self._overlap_tokens = overlap_tokens

    def chunk_document(
        self,
        document_id: str,
        text: str,
        sections: Optional[list] = None,  # list of DocumentSection
        page_number: Optional[int] = None,
    ) -> list[DocumentChunk]:
        """
        Chunk full document text. Uses sections if provided.
        """
        chunks: list[DocumentChunk] = []
        chunk_idx = 0

        if sections:
            for section in sections:
                section_chunks = self._chunk_text(
                    text=section.text,
                    document_id=document_id,
                    start_idx=chunk_idx,
                    page_number=section.page_start,
                    section_heading=section.heading,
                    section_id=section.section_id,
                )
                chunks.extend(section_chunks)
                chunk_idx += len(section_chunks)
        else:
            chunks = self._chunk_text(
                text=text,
                document_id=document_id,
                start_idx=0,
                page_number=page_number,
            )

        return chunks

    def _chunk_text(
        self,
        text: str,
        document_id: str,
        start_idx: int = 0,
        page_number: Optional[int] = None,
        section_heading: Optional[str] = None,
        section_id: Optional[str] = None,
    ) -> list[DocumentChunk]:
        """Split text into overlapping chunks respecting paragraph/sentence boundaries."""
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
        raw_chunks: list[str] = []
        current_words: list[str] = []

        for para in paragraphs:
            para_words = para.split()
            if len(current_words) + len(para_words) <= self._max_tokens:
                current_words.extend(para_words)
            else:
                if current_words:
                    raw_chunks.append(" ".join(current_words))
                # If single paragraph is too long, split at sentences
                if len(para_words) > self._max_tokens:
                    sentence_chunks = self._split_sentences(para)
                    raw_chunks.extend(sentence_chunks)
                    current_words = []
                else:
                    current_words = para_words

        if current_words:
            raw_chunks.append(" ".join(current_words))

        # Apply overlap and build DocumentChunk objects
        result: list[DocumentChunk] = []
        overlap_prefix: list[str] = []

        for i, chunk_text in enumerate(raw_chunks):
            if len(chunk_text.split()) < self._min_tokens and i < len(raw_chunks) - 1:
                # Too short — will be merged into the next chunk via overlap
                overlap_prefix = chunk_text.split()[-self._overlap_tokens:]
                continue

            if overlap_prefix and i > 0:
                chunk_text = " ".join(overlap_prefix) + " " + chunk_text

            chunk = DocumentChunk(
                chunk_id=f"{document_id}-chunk-{start_idx + i}",
                document_id=document_id,
                text=chunk_text.strip(),
                chunk_index=start_idx + i,
                page_number=page_number,
                section_heading=section_heading,
                section_id=section_id,
                char_start=0,
                char_end=len(chunk_text),
            )
            result.append(chunk)
            overlap_prefix = chunk_text.split()[-self._overlap_tokens:]

        return result

    def _split_sentences(self, text: str) -> list[str]:
        """Split oversized paragraphs at sentence boundaries."""
        sentences = re.split(r"(?<=[.!?])\s+", text)
        chunks: list[str] = []
        current: list[str] = []

        for sentence in sentences:
            words = sentence.split()
            if len(current) + len(words) <= self._max_tokens:
                current.extend(words)
            else:
                if current:
                    chunks.append(" ".join(current))
                current = words

        if current:
            chunks.append(" ".join(current))
        return chunks
