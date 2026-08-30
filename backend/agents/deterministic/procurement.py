"""
agents/deterministic/procurement.py
Procurement Agent — analyzes available procurement information for risk indicators.
Returns neutral risk signals — never conclusions.
"""
from __future__ import annotations
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, DocumentType, ProjectStatus, Severity


class ProcurementAgent(BaseAgent):
    agent_id = "procurement_agent"
    agent_name = "Procurement Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return (
            twin.project_status not in (ProjectStatus.PROPOSED, ProjectStatus.UNKNOWN)
            and twin.sanctioned_amount is not None
            and float(twin.sanctioned_amount or 0) > 0
        )

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        has_contractor = twin.contractor is not None
        has_tender_doc = DocumentType.TENDER_DOCUMENT.value in (twin.document_types_present or [])
        has_agreement = DocumentType.AGREEMENT.value in (twin.document_types_present or [])
        has_work_order = DocumentType.WORK_ORDER.value in (twin.document_types_present or [])
        sanctioned = float(twin.sanctioned_amount or 0)

        evidence.extend([
            EvidenceDataPoint(label="Contractor Present", value=has_contractor, source="project_record"),
            EvidenceDataPoint(label="Tender Document Present", value=has_tender_doc, source="document_store"),
            EvidenceDataPoint(label="Agreement Present", value=has_agreement, source="document_store"),
            EvidenceDataPoint(label="Work Order Present", value=has_work_order, source="document_store"),
            EvidenceDataPoint(label="Sanctioned Amount (INR)", value=sanctioned, source="sanction_record"),
        ])

        # ── Contractor without procurement documentation ───────────────────────
        if has_contractor and not has_work_order:
            signals.append(AgentSignal(
                signal_type="CONTRACTOR_WITHOUT_WORK_ORDER",
                description="Contractor is associated with project but no work order document found",
                severity=Severity.MEDIUM,
                value=twin.contractor.contractor_name if twin.contractor else None,
                confidence=0.7,
                metadata={"note": "Work order may exist but not yet ingested"},
            ))
            score += 20.0

        if has_contractor and not has_agreement and sanctioned > 500_000:
            signals.append(AgentSignal(
                signal_type="NO_AGREEMENT_DOCUMENT",
                description="No agreement/contract document found for project with significant sanctioned amount",
                severity=Severity.MEDIUM,
                value=sanctioned,
                unit="INR",
                confidence=0.65,
            ))
            score += 15.0

        # ── No contractor for active project ──────────────────────────────────
        if (not has_contractor
                and twin.project_status == ProjectStatus.IN_PROGRESS
                and sanctioned > 0):
            signals.append(AgentSignal(
                signal_type="NO_CONTRACTOR_FOR_ACTIVE_PROJECT",
                description="Active project has no contractor recorded",
                severity=Severity.MEDIUM,
                value=None,
                confidence=0.8,
            ))
            score += 15.0

        # ── High value with minimal documentation ─────────────────────────────
        doc_count = len(twin.document_ids or [])
        if sanctioned > 2_000_000 and doc_count < 2:
            signals.append(AgentSignal(
                signal_type="HIGH_VALUE_LOW_DOCUMENTATION",
                description=f"High-value project (₹{sanctioned:,.0f}) has only {doc_count} documents ingested",
                severity=Severity.HIGH,
                value={"sanctioned": sanctioned, "doc_count": doc_count},
                confidence=0.7,
                metadata={"threshold": "₹20,00,000"},
            ))
            score += 25.0

        # ── Graph-based: Contractor used by same agency repeatedly ────────────
        if context.graph_data:
            repeat_relationships = context.graph_data.get("repeat_contractor_agency", 0)
            if repeat_relationships > 3:
                signals.append(AgentSignal(
                    signal_type="REPEATED_CONTRACTOR_AGENCY_RELATIONSHIP",
                    description=f"Contractor-agency pair has {repeat_relationships} prior project relationships",
                    severity=Severity.LOW,
                    value=repeat_relationships,
                    unit="count",
                    confidence=0.8,
                    metadata={"threshold": 3},
                ))
                score += 10.0

        score = min(100.0, score)
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=score,
            severity=self._determine_severity(score),
            confidence=0.75,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["project_record", "document_store", "graph_data"],
        )
