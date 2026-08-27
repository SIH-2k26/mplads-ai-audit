"""
agents/deterministic/data_quality.py
Data Quality Agent — detects missing, stale, invalid, and conflicting data.
"""
from __future__ import annotations
from datetime import datetime, date, timezone
UTC = timezone.utc
from decimal import Decimal
from typing import Any
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, DataQualityIssueType, Severity


# Fields required for meaningful analysis and their human-readable names
REQUIRED_FIELDS = {
    "project_name": "Project Name",
    "state": "State",
    "district": "District",
    "project_status": "Project Status",
}

IMPORTANT_FIELDS = {
    "sanctioned_amount": "Sanctioned Amount",
    "total_expenditure": "Total Expenditure",
    "financial_progress": "Financial Progress",
    "physical_progress": "Physical Progress",
    "start_date": "Start Date",
    "expected_completion_date": "Expected Completion Date",
    "agency_name": "Implementing Agency",
    "category": "Project Category",
}

# Days after which a progress record is considered stale
STALE_PROGRESS_DAYS = 90
STALE_STATUS_DAYS = 60


class DataQualityAgent(BaseAgent):
    """
    Detects data quality issues in the Digital Twin.
    Returns a risk signal proportional to the severity of missing/stale data.
    """
    agent_id = "data_quality_agent"
    agent_name = "Data Quality Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        return True  # Always applicable

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        total_penalty = 0.0

        # ── Missing required fields ────────────────────────────────────────────
        for field, label in REQUIRED_FIELDS.items():
            val = self._get_field(twin, field)
            if val is None or (isinstance(val, str) and not val.strip()):
                signals.append(AgentSignal(
                    signal_type="MISSING_REQUIRED_FIELD",
                    description=f"Required field '{label}' is missing",
                    severity=Severity.HIGH,
                    value=None,
                    confidence=1.0,
                    metadata={"field": field},
                ))
                total_penalty += 15.0

        # ── Missing important fields ───────────────────────────────────────────
        for field, label in IMPORTANT_FIELDS.items():
            val = self._get_field(twin, field)
            if val is None or (isinstance(val, str) and not val.strip()):
                signals.append(AgentSignal(
                    signal_type="MISSING_IMPORTANT_FIELD",
                    description=f"Important field '{label}' is not available",
                    severity=Severity.MEDIUM,
                    value=None,
                    confidence=1.0,
                    metadata={"field": field},
                ))
                total_penalty += 5.0

        # ── Stale progress data ────────────────────────────────────────────────
        if twin.latest_progress:
            age_days = (datetime.now(UTC).date() - twin.latest_progress.as_of_date).days
            if age_days > STALE_PROGRESS_DAYS:
                signals.append(AgentSignal(
                    signal_type="STALE_PROGRESS_DATA",
                    description=f"Progress data is {age_days} days old — not updated recently",
                    severity=Severity.MEDIUM if age_days < 180 else Severity.HIGH,
                    value=age_days,
                    unit="days",
                    confidence=1.0,
                    metadata={"last_updated": str(twin.latest_progress.as_of_date)},
                ))
                total_penalty += min(20.0, age_days / 10)
        else:
            signals.append(AgentSignal(
                signal_type="NO_PROGRESS_RECORDS",
                description="No progress records found for this project",
                severity=Severity.HIGH,
                value=None,
                confidence=1.0,
            ))
            total_penalty += 20.0

        # ── Conflicting financial data ─────────────────────────────────────────
        if twin.expenditure and twin.budget:
            exp = twin.total_expenditure
            budget = twin.budget.approved_budget
            if exp and budget and budget > 0:
                ratio = float(exp / budget)
                if ratio > 1.05 and not twin.budget.revised_budget:
                    signals.append(AgentSignal(
                        signal_type="EXPENDITURE_EXCEEDS_BUDGET",
                        description=f"Expenditure ({ratio:.1%} of budget) exceeds approved budget without revision",
                        severity=Severity.HIGH,
                        value=ratio,
                        unit="ratio",
                        confidence=0.9,
                    ))
                    total_penalty += 25.0

        # ── Data completeness from twin ────────────────────────────────────────
        if twin.data_quality_flags:
            for flag in twin.data_quality_flags:
                total_penalty += 2.0  # Existing flag
                evidence.append(EvidenceDataPoint(
                    label=f"Existing flag: {flag.field_name}",
                    value=flag.description,
                    source="digital_twin_flags",
                ))

        # ── Summary evidence ───────────────────────────────────────────────────
        evidence.append(EvidenceDataPoint(
            label="Data Completeness Score",
            value=twin.data_completeness_score,
            unit="0-1 scale",
            source="digital_twin",
        ))
        evidence.append(EvidenceDataPoint(
            label="Total Missing/Stale Fields",
            value=len(signals),
            source="data_quality_agent",
        ))

        score = min(100.0, total_penalty)
        severity = self._determine_severity(score)

        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=severity,
            confidence=0.95,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["digital_twin", "progress_records"],
            recommendation=(
                "Improve data completeness to enable accurate risk assessment."
                if score > 30 else None
            ),
        )

    def _get_field(self, twin: Any, field: str) -> Any:
        """Safely get a field from the digital twin (handles nested)."""
        if field == "sanctioned_amount":
            return twin.sanctioned_amount
        if field == "total_expenditure":
            return twin.total_expenditure
        if field == "financial_progress":
            return twin.financial_progress
        if field == "physical_progress":
            return twin.physical_progress
        if field == "agency_name":
            return twin.implementing_agency.agency_name if twin.implementing_agency else None
        if field == "start_date":
            return twin.start_date
        if field == "expected_completion_date":
            return twin.expected_completion_date
        return getattr(twin, field, None)
