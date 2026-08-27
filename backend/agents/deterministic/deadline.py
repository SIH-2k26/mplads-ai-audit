"""
agents/deterministic/deadline.py
Deadline Agent — calculates delay and compliance with timeline requirements.
"""
from __future__ import annotations
from datetime import datetime, timezone
UTC = timezone.utc
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, ProjectStatus, Severity


class DeadlineAgent(BaseAgent):
    agent_id = "deadline_agent"
    agent_name = "Deadline Agent"
    version = "1.0.0"

    MILD_DELAY_DAYS = 30
    MODERATE_DELAY_DAYS = 90
    SEVERE_DELAY_DAYS = 180
    CRITICAL_DELAY_DAYS = 365

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return (
            twin.start_date is not None
            or twin.expected_completion_date is not None
        )

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0
        # Use naive UTC datetime for comparison - twin dates are stored as naive datetimes
        today = datetime.now(UTC).replace(tzinfo=None)

        start = twin.start_date
        expected = twin.expected_completion_date
        actual = twin.actual_completion_date
        extensions = twin.approved_extensions
        extension_days = twin.extension_days

        # ── Effective deadline (accounting for extensions) ─────────────────────
        effective_deadline = expected
        if expected and extension_days > 0:
            from datetime import timedelta, timezone
            effective_deadline = expected + timedelta(days=extension_days)

        # ── Evidence datapoints ────────────────────────────────────────────────
        if start:
            evidence.append(EvidenceDataPoint(label="Start Date", value=str(start), source="project_record"))
        if expected:
            evidence.append(EvidenceDataPoint(label="Expected Completion", value=str(expected), source="project_record"))
        if effective_deadline and effective_deadline != expected:
            evidence.append(EvidenceDataPoint(label="Effective Deadline (with extensions)", value=str(effective_deadline), source="project_record"))
        if actual:
            evidence.append(EvidenceDataPoint(label="Actual Completion", value=str(actual), source="project_record"))
        evidence.append(EvidenceDataPoint(label="Approved Extensions", value=extensions, source="project_record"))

        # ── If already completed — check if completed on time ─────────────────
        if actual and effective_deadline:
            if actual > effective_deadline:
                delay = (actual - effective_deadline).days
                evidence.append(EvidenceDataPoint(label="Delay Days (at completion)", value=delay, unit="days"))
                signals.append(AgentSignal(
                    signal_type="COMPLETED_LATE",
                    description=f"Project completed {delay} days after effective deadline",
                    severity=self._delay_severity(delay),
                    value=delay,
                    unit="days",
                    confidence=1.0,
                ))
                score = self._delay_score(delay)
            return self._build_evidence(signals, evidence, score, "project_timeline")

        # ── Active project — check against today ──────────────────────────────
        if twin.project_status in (ProjectStatus.COMPLETED, ProjectStatus.CANCELLED):
            return self._build_evidence(signals, evidence, 0.0, "project_timeline")

        if effective_deadline:
            if today > effective_deadline:
                delay_days = twin.delay_days or (today - effective_deadline).days
                evidence.append(EvidenceDataPoint(label="Current Delay Days", value=delay_days, unit="days"))
                signals.append(AgentSignal(
                    signal_type="PROJECT_OVERDUE",
                    description=f"Project is {delay_days} days past effective deadline with no completion recorded",
                    severity=self._delay_severity(delay_days),
                    value=delay_days,
                    unit="days",
                    confidence=0.95,
                ))
                score = self._delay_score(delay_days)

                # Excessive extensions
                if extensions > 2:
                    signals.append(AgentSignal(
                        signal_type="MULTIPLE_EXTENSIONS",
                        description=f"Project has received {extensions} timeline extensions",
                        severity=Severity.MEDIUM,
                        value=extensions,
                        unit="count",
                        confidence=0.9,
                    ))
                    score += 10.0

            else:
                # Not yet overdue — warn if approaching deadline
                days_remaining = (effective_deadline - today).days
                if days_remaining <= 30:
                    signals.append(AgentSignal(
                        signal_type="APPROACHING_DEADLINE",
                        description=f"Project deadline in {days_remaining} days",
                        severity=Severity.LOW,
                        value=days_remaining,
                        unit="days",
                        confidence=1.0,
                    ))
                    score += 5.0

        # ── Missing timeline information ───────────────────────────────────────
        if not expected and twin.project_status == ProjectStatus.IN_PROGRESS:
            signals.append(AgentSignal(
                signal_type="MISSING_DEADLINE",
                description="Active project has no expected completion date recorded",
                severity=Severity.MEDIUM,
                value=None,
                confidence=0.9,
            ))
            score += 15.0

        score = min(100.0, score)
        return self._build_evidence(signals, evidence, score, "project_timeline")

    def _delay_severity(self, days: int) -> Severity:
        if days >= self.CRITICAL_DELAY_DAYS:
            return Severity.CRITICAL
        elif days >= self.SEVERE_DELAY_DAYS:
            return Severity.HIGH
        elif days >= self.MODERATE_DELAY_DAYS:
            return Severity.MEDIUM
        return Severity.LOW

    def _delay_score(self, days: int) -> float:
        if days >= self.CRITICAL_DELAY_DAYS:
            return 80.0
        elif days >= self.SEVERE_DELAY_DAYS:
            return 60.0
        elif days >= self.MODERATE_DELAY_DAYS:
            return 40.0
        elif days >= self.MILD_DELAY_DAYS:
            return 20.0
        return 10.0

    def _build_evidence(self, signals, evidence, score, source) -> AgentEvidence:
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=0.95,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=[source],
        )
