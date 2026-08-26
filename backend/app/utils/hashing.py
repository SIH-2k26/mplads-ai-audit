"""
app/utils/hashing.py
Checksums and content hashing for provenance.
"""
import hashlib
from pathlib import Path
from typing import Union


def sha256_content(content: Union[str, bytes]) -> str:
    """Compute SHA-256 checksum of string or bytes content."""
    if isinstance(content, str):
        content = content.encode("utf-8")
    return hashlib.sha256(content).hexdigest()


def sha256_file(file_path: Union[str, Path]) -> str:
    """Compute SHA-256 checksum of a file."""
    h = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def short_id(content: str, length: int = 8) -> str:
    """Generate a short hash-based ID from content."""
    return hashlib.sha256(content.encode()).hexdigest()[:length]
