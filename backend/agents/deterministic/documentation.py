"""
agents/deterministic/documentation.py
Documentation Agent — checks whether required documents exist.

IMPORTANT: "Document not in database" ≠ "Document does not exist"
Status: PRESENT | MISSING | NOT_INGESTED | NOT_REQUIRED | UNCERTAIN
"""
from __future__ import annotations
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, DocumentType, ProjectStatus, Severity

# Required documents per project status
REQUIRED_DOCS_BY_STATUS: dict[str, list[DocumentType]] = {
    "SANCTIONED": [DocumentType.SANCTION_ORDER],
    "IN_PROGRESS": [DocumentType.SANCTION_ORDER, DocumentType.WORK_ORDER],
    "COMPLETED": [
        DocumentType.SANCTION_ORDER,
        DocumentType.WORK_ORDER,
        DocumentType.COMPLETION_CERTIFICATE,
        DocumentType.UTILIZATION_CERTIFICATE,
    ],
    "DELAYED": [DocumentType.SANCTION_ORDER, DocumentType.WORK_ORDER],
}


class DocumentationAgent(BaseAgent):
    agent_id = "documentation_agent"
    agent_name = "Documentation Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return twin.project_status not in (ProjectStatus.PROPOSED, ProjectStatus.UNKNOWN)

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        status_str = twin.project_status.value if twin.project_status else "UNKNOWN"
        required_types = REQUIRED_DOCS_BY_STATUS.get(status_str, [])
        present_types = set(twin.document_types_present or [])
        document_count = len(twin.document_ids)

        evidence.append(EvidenceDataPoint(
            label="Documents Ingested",
            value=document_count,
            source="document_store",
        ))
        evidence.append(EvidenceDataPoint(
            label="Document Types Present",
            value=list(present_types),
            source="document_store",
        ))
        evidence.append(EvidenceDataPoint(
            label="Required Document Types (for status)",
            value=[d.value for d in required_types],
            source="documentation_agent",
        ))

        # ── Check each required document ──────────────────────────────────────
        for doc_type in required_types:
            if doc_type.value in present_types:
                # Document present and ingested
                evidence.append(EvidenceDataPoint(
                    label=f"{doc_type.value}: Status",
                    value="PRESENT",
                    source="document_store",
                ))
            elif document_count == 0:
                # No documents at all — could be not yet uploaded (NOT_INGESTED)
                signals.append(AgentSignal(
                    signal_type="DOCUMENT_NOT_INGESTED",
                    description=f"Required document '{doc_type.value}' not found in system. Note: absence in database does not confirm document does not exist.",
                    severity=Severity.MEDIUM,
                    value=doc_type.value,
                    confidence=0.5,  # Low confidence — data may be incomplete
                    metadata={"status": "NOT_INGESTED", "note": "System may not have received all documents"},
                ))
                score += 10.0
            else:
                # Documents exist for project, but this specific type is missing
                signals.append(AgentSignal(
                    signal_type="REQUIRED_DOCUMENT_MISSING",
                    description=f"Required document '{doc_type.value}' is not present in the document store",
                    severity=Severity.HIGH if doc_type == DocumentType.COMPLETION_CERTIFICATE else Severity.MEDIUM,
                    value=doc_type.value,
                    confidence=0.75,  # Moderate confidence — may not be uploaded yet
                    metadata={"status": "MISSING"},
                ))
                score += 15.0

        # ── Completion without completion certificate ─────────────────────────
        if (twin.project_status == ProjectStatus.COMPLETED
                and DocumentType.COMPLETION_CERTIFICATE.value not in present_types):
            signals.append(AgentSignal(
                signal_type="COMPLETION_WITHOUT_CERTIFICATE",
                description="Project marked as completed but no completion certificate found",
                severity=Severity.HIGH,
                value=None,
                confidence=0.85,
                metadata={"status": "UNCERTAIN"},
            ))
            score += 25.0

        # ── Utilization certificate check ─────────────────────────────────────
        if (twin.total_expenditure and float(twin.total_expenditure or 0) > 0
                and DocumentType.UTILIZATION_CERTIFICATE.value not in present_types
                and twin.project_status == ProjectStatus.COMPLETED):
            signals.append(AgentSignal(
                signal_type="MISSING_UTILIZATION_CERTIFICATE",
                description="Expenditure recorded but no utilization certificate found",
                severity=Severity.MEDIUM,
                value=None,
                confidence=0.75,
            ))
            score += 15.0

        score = min(100.0, score)
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=0.75,  # Document data may be incomplete
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["document_store", "project_record"],
            recommendation=(
                "Verify document availability through direct inquiry before flagging."
                if score > 20 else None
            ),
        )
