"""
data/ingestion/base.py
Base interface for all data sources.
Every data source must implement this interface.
"""
from __future__ import annotations
from abc import ABC, abstractmethod
from datetime import datetime
from pathlib import Path
from typing import Any, Iterator
from models.enums import SourceType
from models.provenance import ProvenanceRecord
from app.utils.hashing import sha256_file, sha256_content


class RawRecord(dict):
    """A raw record from a data source — a dict with provenance attached."""
    provenance: ProvenanceRecord


class DataSourceConfig:
    def __init__(
        self,
        source_name: str,
        source_type: SourceType,
        source_id: str,
        file_path: str | None = None,
        api_url: str | None = None,
        metadata: dict[str, Any] | None = None,
    ):
        self.source_name = source_name
        self.source_type = source_type
        self.source_id = source_id
        self.file_path = file_path
        self.api_url = api_url
        self.metadata = metadata or {}
        self.ingestion_timestamp = datetime.utcnow()


class BaseDataSource(ABC):
    """
    Abstract interface for all data sources.
    Implementations: CSVDataSource, ExcelDataSource, JSONDataSource, APIDataSource.

    Contract:
    - read() yields raw records with provenance attached
    - Never overwrite raw data
    - Store checksum of source
    """

    def __init__(self, config: DataSourceConfig):
        self.config = config
        self._checksum: str | None = None

    @abstractmethod
    def validate_source(self) -> bool:
        """Verify that the source is accessible and readable."""
        ...

    @abstractmethod
    def read(self) -> Iterator[dict[str, Any]]:
        """Yield raw records from the source, one at a time."""
        ...

    @abstractmethod
    def get_total_records(self) -> int | None:
        """Return total record count if known, None otherwise."""
        ...

    def get_checksum(self) -> str:
        """Compute checksum of the source for provenance."""
        if self._checksum is None:
            if self.config.file_path and Path(self.config.file_path).exists():
                self._checksum = sha256_file(self.config.file_path)
            else:
                self._checksum = sha256_content(self.config.source_id)
        return self._checksum

    def build_provenance(self, row_index: int | None = None) -> ProvenanceRecord:
        return ProvenanceRecord(
            source_id=self.config.source_id,
            source_type=self.config.source_type,
            source_name=self.config.source_name,
            source_timestamp=None,
            ingestion_timestamp=self.config.ingestion_timestamp,
            checksum=self.get_checksum(),
            row=row_index,
            metadata=self.config.metadata,
        )
