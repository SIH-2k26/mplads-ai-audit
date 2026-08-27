"""
data/validation/rules.py
Validation rules for MPLADS project data.
Rules generate structured errors — never silently fix suspicious data.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Optional
from models.enums import Severity


@dataclass
class ValidationError:
    field: str
    message: str
    severity: Severity
    value: Any = None
    expected: Optional[str] = None


@dataclass
class ValidationResult:
    record_id: Optional[str]
    is_valid: bool
    errors: list[ValidationError] = field(default_factory=list)
    warnings: list[ValidationError] = field(default_factory=list)

    def add_error(self, field: str, message: str, value: Any = None, expected: str | None = None):
        self.errors.append(ValidationError(field, message, Severity.HIGH, value, expected))
        self.is_valid = False

    def add_warning(self, field: str, message: str, value: Any = None):
        self.warnings.append(ValidationError(field, message, Severity.MEDIUM, value))


class ProjectValidationRules:
    """
    Validation rules for project records.
    Raises warnings for suspicious data, errors for definitively invalid data.
    """

    def validate(self, record: dict[str, Any]) -> ValidationResult:
        record_id = record.get("project_id") or record.get("id")
        result = ValidationResult(record_id=str(record_id) if record_id else None, is_valid=True)

        self._validate_required_fields(record, result)
        self._validate_amounts(record, result)
        self._validate_progress(record, result)
        self._validate_dates(record, result)
        self._validate_percentages(record, result)
        self._validate_relationships(record, result)

        return result

    def _validate_required_fields(self, record: dict, result: ValidationResult):
        for field in ("project_name",):
            if not record.get(field):
                result.add_error(field, f"Required field '{field}' is missing or empty")

    def _validate_amounts(self, record: dict, result: ValidationResult):
        amount_fields = ["sanctioned_amount", "approved_budget", "estimated_cost", "total_expenditure"]
        for f in amount_fields:
            val = record.get(f)
            if val is None:
                continue
            try:
                d = Decimal(str(val))
                if d < 0:
                    result.add_error(f, f"Amount '{f}' cannot be negative", value=val)
                if d > Decimal("1e12"):
                    result.add_warning(f, f"Amount '{f}' is unusually large (> 1 trillion)", value=val)
            except (InvalidOperation, TypeError):
                result.add_error(f, f"Amount '{f}' is not a valid number", value=val)

        # Cross-validation: expenditure should not exceed sanctioned amount significantly
        sanctioned = self._to_decimal(record.get("sanctioned_amount"))
        expenditure = self._to_decimal(record.get("total_expenditure"))
        if sanctioned and expenditure and expenditure > sanctioned * Decimal("1.2"):
            result.add_warning(
                "total_expenditure",
                f"Expenditure ({expenditure}) exceeds sanctioned amount ({sanctioned}) by >20%",
                value=float(expenditure),
            )

    def _validate_progress(self, record: dict, result: ValidationResult):
        for f in ("financial_progress", "physical_progress"):
            val = record.get(f)
            if val is None:
                continue
            try:
                p = float(val)
                if p < 0 or p > 100:
                    result.add_error(f, f"Progress '{f}' must be between 0 and 100", value=val)
            except (ValueError, TypeError):
                result.add_error(f, f"Progress '{f}' is not a valid number", value=val)

        # Cross-validation: payment vs. physical progress mismatch
        fin = record.get("financial_progress")
        phy = record.get("physical_progress")
        if fin is not None and phy is not None:
            try:
                f_val, p_val = float(fin), float(phy)
                if f_val > 90 and p_val < 30:
                    result.add_warning(
                        "physical_progress",
                        f"High financial progress ({f_val}%) with very low physical progress ({p_val}%) — requires attention",
                        value={"financial": f_val, "physical": p_val},
                    )
            except (ValueError, TypeError):
                pass

    def _validate_dates(self, record: dict, result: ValidationResult):
        start = self._to_date(record.get("start_date"))
        expected = self._to_date(record.get("expected_completion_date"))
        actual = self._to_date(record.get("actual_completion_date"))

        if start and expected and expected < start:
            result.add_error(
                "expected_completion_date",
                "Expected completion date is before start date",
                value={"start": str(start), "expected": str(expected)},
            )

        if start and actual and actual < start:
            result.add_error(
                "actual_completion_date",
                "Actual completion date is before start date",
                value={"start": str(start), "actual": str(actual)},
            )

        if expected and expected > date(2050, 1, 1):
            result.add_warning("expected_completion_date", "Expected completion date is far in the future", value=str(expected))

    def _validate_percentages(self, record: dict, result: ValidationResult):
        # Already covered by _validate_progress
        pass

    def _validate_relationships(self, record: dict, result: ValidationResult):
        # Both contractor and agency should be present if project is IN_PROGRESS
        status = record.get("project_status", "")
        if status == "IN_PROGRESS":
            if not record.get("agency_name") and not record.get("agency_id"):
                result.add_warning(
                    "agency_name",
                    "Project is IN_PROGRESS but no implementing agency is specified"
                )

    @staticmethod
    def _to_decimal(val: Any) -> Decimal | None:
        if val is None:
            return None
        try:
            return Decimal(str(val))
        except (InvalidOperation, TypeError):
            return None

    @staticmethod
    def _to_date(val: Any) -> date | None:
        if val is None:
            return None
        if isinstance(val, date):
            return val
        try:
            return datetime.strptime(str(val), "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return None

    def validate_record(self, record: dict[str, Any]) -> ValidationResult:
        """Alias for validate."""
        return self.validate(record)


# Alias for backward compatibility
ValidationEngine = ProjectValidationRules

