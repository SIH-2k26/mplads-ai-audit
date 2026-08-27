"""
data/ingestion/csv_source.py + excel_source.py + json_source.py
Concrete data source implementations.
"""
from __future__ import annotations
import csv
import json
from pathlib import Path
from typing import Any, Iterator
import pandas as pd
from models.enums import SourceType
from .base import BaseDataSource, DataSourceConfig


class CSVDataSource(BaseDataSource):
    """Reads records from a CSV file."""

    def __init__(self, config: DataSourceConfig, delimiter: str = ",", encoding: str = "utf-8"):
        super().__init__(config)
        self.delimiter = delimiter
        self.encoding = encoding
        self._total: int | None = None

    def validate_source(self) -> bool:
        if not self.config.file_path:
            return False
        p = Path(self.config.file_path)
        return p.exists() and p.suffix.lower() == ".csv"

    def read(self) -> Iterator[dict[str, Any]]:
        with open(self.config.file_path, newline="", encoding=self.encoding) as f:
            reader = csv.DictReader(f, delimiter=self.delimiter)
            for i, row in enumerate(reader):
                record = dict(row)
                record["_provenance"] = self.build_provenance(row_index=i).model_dump()
                yield record

    def get_total_records(self) -> int | None:
        if self._total is None:
            try:
                with open(self.config.file_path, encoding=self.encoding) as f:
                    self._total = sum(1 for _ in f) - 1  # minus header
            except Exception:
                return None
        return self._total


class ExcelDataSource(BaseDataSource):
    """Reads records from an Excel file (xlsx)."""

    def __init__(
        self, config: DataSourceConfig,
        sheet_name: str | int = 0,
        header_row: int = 0,
    ):
        super().__init__(config)
        self.sheet_name = sheet_name
        self.header_row = header_row
        self._df: pd.DataFrame | None = None

    def _load(self) -> pd.DataFrame:
        if self._df is None:
            self._df = pd.read_excel(
                self.config.file_path,
                sheet_name=self.sheet_name,
                header=self.header_row,
                dtype=str,  # Read everything as string for safe normalization
            )
            self._df = self._df.where(pd.notna(self._df), None)
        return self._df

    def validate_source(self) -> bool:
        if not self.config.file_path:
            return False
        p = Path(self.config.file_path)
        return p.exists() and p.suffix.lower() in (".xlsx", ".xls")

    def read(self) -> Iterator[dict[str, Any]]:
        df = self._load()
        for i, (_, row) in enumerate(df.iterrows()):
            record = row.to_dict()
            record["_provenance"] = self.build_provenance(row_index=i).model_dump()
            yield record

    def get_total_records(self) -> int | None:
        return len(self._load())


class JSONDataSource(BaseDataSource):
    """Reads records from a JSON file (array of objects or newline-delimited JSON)."""

    def __init__(self, config: DataSourceConfig, records_key: str | None = None):
        super().__init__(config)
        self.records_key = records_key  # Key to extract array from top-level object

    def validate_source(self) -> bool:
        if not self.config.file_path:
            return False
        p = Path(self.config.file_path)
        return p.exists() and p.suffix.lower() in (".json", ".jsonl")

    def read(self) -> Iterator[dict[str, Any]]:
        path = Path(self.config.file_path)

        if path.suffix.lower() == ".jsonl":
            # Newline-delimited JSON
            with open(path, encoding="utf-8") as f:
                for i, line in enumerate(f):
                    line = line.strip()
                    if not line:
                        continue
                    record = json.loads(line)
                    record["_provenance"] = self.build_provenance(row_index=i).model_dump()
                    yield record
        else:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)

            if self.records_key and isinstance(data, dict):
                data = data[self.records_key]

            for i, record in enumerate(data):
                record["_provenance"] = self.build_provenance(row_index=i).model_dump()
                yield record

    def get_total_records(self) -> int | None:
        return None  # Would require reading full file
