"""
agents/base.py
BaseAgent — CONTRACT 1.
All Part A and Part B agents must inherit from this class.

Development Guide:
    class MyAgent(BaseAgent):
        agent_id = "my_agent"
        agent_name = "My Agent Name"
        version = "1.0.0"

        def is_applicable(self, context: AgentContext) -> bool:
            # Return True if this agent should run for this project
            return context.digital_twin.project_status != ProjectStatus.PROPOSED

        def analyze(self, context: AgentContext) -> AgentEvidence:
            # Perform analysis and return AgentEvidence
            # NEVER raise exceptions — return AgentEvidence.failed() instead
            try:
                signals = self._compute_signals(context)
                return AgentEvidence(
                    agent_id=self.agent_id,
                    agent_name=self.agent_name,
                    agent_version=self.version,
                    status=AgentStatus.COMPLETED,
                    score=calculated_score,
                    severity=determined_severity,
                    confidence=0.9,
                    signals=signals,
                    ...
                )
            except Exception as e:
                return AgentEvidence.failed(self.agent_id, self.agent_name, str(e))

    # LANGUAGE POLICY:
    # ❌ Never say: "contractor is corrupt", "fraud confirmed", "officer committed fraud"
    # ✅ Always say: "elevated risk indicator", "anomaly detected", "requires investigation"
"""
from __future__ import annotations
import time
from abc import ABC, abstractmethod
from typing import Optional
from models.agent import AgentEvidence, AgentContext
from models.enums import AgentStatus, Severity
from app.utils.logging import get_logger


class BaseAgent(ABC):
    """
    Abstract base class for all agents in the MPLADS Guardian system.
    CONTRACT 1: BaseAgent → AgentEvidence

    Subclasses must define:
    - agent_id: str (unique identifier, snake_case)
    - agent_name: str (human-readable)
    - version: str (semver)
    - is_applicable(context): bool
    - analyze(context): AgentEvidence
    """

    agent_id: str
    agent_name: str
    version: str = "1.0.0"

    def __init__(self):
        if not hasattr(self, "agent_id") or not hasattr(self, "agent_name"):
            raise NotImplementedError("Agents must define agent_id and agent_name")
        self.logger = get_logger(
            f"agent.{self.agent_id}",
            agent_id=self.agent_id,
        )

    @abstractmethod
    def is_applicable(self, context: AgentContext) -> bool:
        """
        Determine if this agent is applicable to the given project context.
        Return False if the agent cannot meaningfully analyze this project.
        """
        ...

    @abstractmethod
    def analyze(self, context: AgentContext) -> AgentEvidence:
        """
        Perform analysis and return structured AgentEvidence.
        MUST NOT raise exceptions — return AgentEvidence.failed() on error.
        MUST use neutral language in all signal descriptions.
        """
        ...

    def run(self, context: AgentContext) -> AgentEvidence:
        """
        Entry point: checks applicability, times execution, validates output.
        Do not override this method.
        """
        start_time = time.perf_counter()
        self.logger.info("agent_started", project_id=context.project_id)

        try:
            if not self.is_applicable(context):
                result = AgentEvidence.not_applicable(
                    self.agent_id, self.agent_name,
                    "Agent determined not applicable for this project"
                )
            else:
                result = self.analyze(context)

        except Exception as e:
            self.logger.exception("agent_unexpected_error", error=str(e))
            result = AgentEvidence.failed(self.agent_id, self.agent_name, str(e))

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        result = result.model_copy(update={"execution_time_ms": elapsed_ms})

        self._log_result(result, context.project_id)
        return self.validate_output(result)

    def validate_output(self, result: AgentEvidence) -> AgentEvidence:
        """
        Validate agent output against CONTRACT 1 constraints.
        Raises ValueError if output is structurally invalid.
        """
        assert result.agent_id == self.agent_id, (
            f"Agent ID mismatch: expected {self.agent_id}, got {result.agent_id}"
        )
        assert 0.0 <= result.score <= 100.0, f"Score out of range: {result.score}"
        assert 0.0 <= result.confidence <= 1.0, f"Confidence out of range: {result.confidence}"
        assert 0.0 <= result.applicability <= 1.0, f"Applicability out of range: {result.applicability}"
        return result

    def _determine_severity(self, score: float) -> Severity:
        """Convert a 0-100 score to a Severity level."""
        if score >= 80:
            return Severity.CRITICAL
        elif score >= 60:
            return Severity.HIGH
        elif score >= 30:
            return Severity.MEDIUM
        else:
            return Severity.LOW

    def _log_result(self, result: AgentEvidence, project_id: str) -> None:
        self.logger.info(
            "agent_completed",
            project_id=project_id,
            status=result.status.value,
            score=result.score,
            severity=result.severity.value,
            confidence=result.confidence,
            signal_count=len(result.signals),
            execution_ms=round(result.execution_time_ms or 0, 2),
        )
