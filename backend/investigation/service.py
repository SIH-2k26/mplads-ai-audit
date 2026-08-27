"""
investigation/service.py
InvestigationService — the Part A Investigation Engine.
Receives InvestigationIntake from Part B's Risk Engine, manages case lifecycle.
"""
from __future__ import annotations
from datetime import datetime
from uuid import uuid4
from typing import Any, Optional
from models.investigation import (
    InvestigationIntake, InvestigationCase, CaseEvidence,
    InvestigatorVerdict, AuditEntry, InvestigationStatus,
)
from models.enums import RiskLevel, Verdict
from investigation.audit import AuditService
from app.utils.logging import get_logger

logger = get_logger("investigation_service")


def _priority_from_risk(risk_score: float, risk_level: RiskLevel) -> str:
    if risk_level == RiskLevel.CRITICAL or risk_score >= 80:
        return "CRITICAL"
    elif risk_level == RiskLevel.HIGH or risk_score >= 60:
        return "HIGH"
    elif risk_level == RiskLevel.MEDIUM or risk_score >= 40:
        return "MEDIUM"
    return "LOW"


class InvestigationService:
    """
    CONTRACT 5 processor.
    Receives InvestigationIntake, creates InvestigationCase, manages lifecycle.

    Note: This is a pure domain service — it does NOT hold state between calls.
    Persistence is handled by InvestigationRepository.
    """

    def __init__(self, repository=None, audit_service: Optional[AuditService] = None):
        self._repo = repository
        self._audit = audit_service or AuditService()

    def create_case(self, intake: InvestigationIntake, actor: str = "risk_engine") -> InvestigationCase:
        """
        CONTRACT 5 entry point.
        Creates an investigation case from InvestigationIntake.
        """
        case_id = str(uuid4())
        priority = _priority_from_risk(intake.risk_score, intake.risk_level)

        # Convert agent evidence to summary (lightweight)
        agent_summary = [
            {
                "agent_id": ae.agent_id,
                "agent_name": ae.agent_name,
                "score": ae.score,
                "severity": ae.severity.value,
                "status": ae.status.value,
                "signal_count": len(ae.signals),
            }
            for ae in intake.agent_evidence
        ]

        # Convert supporting documents to evidence items
        evidence_items = []
        for doc_id in intake.supporting_document_ids:
            evidence_items.append(CaseEvidence(
                case_id=case_id,
                evidence_type="DOCUMENT",
                description=f"Supporting document: {doc_id}",
                source="document_store",
                document_id=doc_id,
                confidence=0.9,
                added_by=actor,
            ))

        # Add agent-level evidence items
        for ae in intake.agent_evidence:
            if ae.is_flagged():
                for signal in ae.signals:
                    evidence_items.append(CaseEvidence(
                        case_id=case_id,
                        evidence_type="AGENT_SIGNAL",
                        description=signal.description,
                        source=f"agent:{ae.agent_id}",
                        agent_id=ae.agent_id,
                        confidence=signal.confidence,
                        added_by=actor,
                    ))

        case = InvestigationCase(
            case_id=case_id,
            project_id=intake.project_id,
            priority=priority,
            status=InvestigationStatus.NEW,
            risk_score_at_creation=intake.risk_score,
            risk_level_at_creation=intake.risk_level,
            risk_fingerprint=intake.risk_fingerprint,
            trigger_signals=intake.trigger_signals,
            evidence_items=evidence_items,
            policy_evidence=intake.policy_evidence,
            agent_evidence_summary=agent_summary,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

        # Audit trail
        audit = self._audit.record(
            case_id=case_id,
            actor=actor,
            action="CASE_CREATED",
            after_state={
                "status": case.status.value,
                "priority": case.priority,
                "risk_score": case.risk_score_at_creation,
            },
            details={"trigger_signals": intake.trigger_signals},
        )
        case.timeline.append(audit)

        logger.info(
            "investigation_case_created",
            case_id=case_id,
            project_id=intake.project_id,
            priority=priority,
            risk_score=intake.risk_score,
            evidence_count=len(evidence_items),
        )

        return case

    def add_evidence(
        self,
        case: InvestigationCase,
        evidence: CaseEvidence,
        actor: str = "system",
    ) -> InvestigationCase:
        """Add a piece of evidence to an open case."""
        if not case.is_open():
            raise ValueError(f"Case {case.case_id} is closed — cannot add evidence")

        evidence = evidence.model_copy(update={"case_id": case.case_id, "added_by": actor})
        updated_items = case.evidence_items + [evidence]

        audit = self._audit.record(
            case_id=case.case_id,
            actor=actor,
            action="EVIDENCE_ADDED",
            after_state={"evidence_type": evidence.evidence_type, "source": evidence.source},
        )

        return case.model_copy(update={
            "evidence_items": updated_items,
            "timeline": case.timeline + [audit],
            "updated_at": datetime.utcnow(),
        })

    def update_status(
        self,
        case: InvestigationCase,
        new_status: InvestigationStatus,
        actor: str,
        reason: Optional[str] = None,
    ) -> InvestigationCase:
        """Transition a case to a new status."""
        old_status = case.status

        audit = self._audit.record(
            case_id=case.case_id,
            actor=actor,
            action="STATUS_CHANGED",
            before_state={"status": old_status.value},
            after_state={"status": new_status.value},
            details={"reason": reason},
        )

        updates = {
            "status": new_status,
            "updated_at": datetime.utcnow(),
            "timeline": case.timeline + [audit],
        }
        if new_status in (
            InvestigationStatus.RESOLVED,
            InvestigationStatus.FALSE_POSITIVE,
            InvestigationStatus.INSUFFICIENT_EVIDENCE,
        ):
            updates["closed_at"] = datetime.utcnow()

        return case.model_copy(update=updates)

    def assign(
        self,
        case: InvestigationCase,
        assigned_to: str,
        actor: str,
    ) -> InvestigationCase:
        """Assign a case to an investigator."""
        audit = self._audit.record(
            case_id=case.case_id,
            actor=actor,
            action="CASE_ASSIGNED",
            after_state={"assigned_to": assigned_to},
        )
        return case.model_copy(update={
            "assigned_to": assigned_to,
            "assigned_at": datetime.utcnow(),
            "status": InvestigationStatus.UNDER_REVIEW,
            "timeline": case.timeline + [audit],
            "updated_at": datetime.utcnow(),
        })

    def record_verdict(
        self,
        case: InvestigationCase,
        verdict: InvestigatorVerdict,
        actor: str,
    ) -> InvestigationCase:
        """
        Record the human investigator's final verdict.
        IMPORTANT: This is the final determination. The system facilitates — humans decide.
        Do NOT automatically convert verdict to training labels.
        """
        if not case.is_open():
            raise ValueError(f"Case {case.case_id} is already closed")

        # Map verdict to case status
        status_map = {
            Verdict.CONFIRMED_ISSUE: InvestigationStatus.RESOLVED,
            Verdict.FALSE_POSITIVE: InvestigationStatus.FALSE_POSITIVE,
            Verdict.INSUFFICIENT_EVIDENCE: InvestigationStatus.INSUFFICIENT_EVIDENCE,
            Verdict.ESCALATE: InvestigationStatus.ESCALATED,
            Verdict.NO_ACTION_REQUIRED: InvestigationStatus.RESOLVED,
        }
        new_status = status_map.get(verdict.verdict, InvestigationStatus.RESOLVED)

        audit = self._audit.record(
            case_id=case.case_id,
            actor=actor,
            action="VERDICT_RECORDED",
            after_state={
                "verdict": verdict.verdict.value,
                "investigator": verdict.investigator_name,
            },
            details={"reason": verdict.reason[:200]},
        )

        return case.model_copy(update={
            "verdict": verdict,
            "status": new_status,
            "closed_at": datetime.utcnow(),
            "timeline": case.timeline + [audit],
            "updated_at": datetime.utcnow(),
        })
