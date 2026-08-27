"""
agents/part_b/deterministic/asset_completion_agent.py
Asset & Completion Verification Agent — Part B.
Verifies handover documents, Utilization Certificate (UC), and Completion Certificate (CC) status.
"""
from __future__ import annotations

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity, ProjectStatus


class AssetCompletionAgent(BaseAgent):
    """
    Asset & Completion Verification Agent.

    Compliance Rules:
    1. Completion Certificate (CC): Mandatory when physical progress >= 100% or status = COMPLETED.
    2. Utilization Certificate (UC): Mandatory when financial disbursements exceed 75%.
    3. Asset Handover: Verified via inspection reports, photo evidence, and asset registry entries.
    """
    agent_id = "asset_completion_agent"
    agent_name = "Asset & Completion Verification Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        """
        Determines applicability based on digital twin presence.

        Args:
            context: Project execution context.

        Returns:
            bool: True if digital twin exists.
        """
        twin = context.digital_twin
        return twin is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        """
        Evaluates presence of mandatory UC/CC documents and asset handover evidence.

        Args:
            context: Execution context containing project digital twin documents.

        Returns:
            AgentEvidence: Compliance verification signals and document inventory evidence.
        """
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []
        score = 0.0

        # Retrieve present document types and physical progress state
        doc_types = twin.document_types_present or []
        status = twin.project_status
        phy_prog = twin.physical_progress or 0.0
        fin_prog = twin.financial_progress or 0.0
        assets = twin.assets or []

        # Flag mandatory document presence
        has_cc = "COMPLETION_CERTIFICATE" in doc_types
        has_uc = "UTILIZATION_CERTIFICATE" in doc_types
        has_inspection = "INSPECTION_REPORT" in doc_types or "PHOTO_EVIDENCE" in doc_types

        evidence.append(EvidenceDataPoint(
            label="Project Status",
            value=status.value if hasattr(status, "value") else str(status),
            source="digital_twin"
        ))
        evidence.append(EvidenceDataPoint(
            label="Present Document Types",
            value=doc_types,
            source="document_registry"
        ))
        evidence.append(EvidenceDataPoint(
            label="Recorded Assets Count",
            value=len(assets),
            source="asset_records"
        ))

        # Define compliance evaluation conditions
        is_physically_complete = (status == ProjectStatus.COMPLETED or phy_prog >= 100.0)
        is_high_financial_disbursement = (fin_prog >= 75.0)

        # ── 1. Completion Certificate (CC) Check ──────────────────────────────
        # Completed projects MUST have an official Completion Certificate on file
        if is_physically_complete and not has_cc:
            signals.append(AgentSignal(
                signal_type="MISSING_COMPLETION_CERTIFICATE",
                description="Project recorded as physically completed or Status=COMPLETED but lacks an official Completion Certificate",
                severity=Severity.HIGH,
                value="MISSING",
                expected_value="COMPLETION_CERTIFICATE",
                confidence=0.95,
            ))
            score += 35.0

        # ── 2. Utilization Certificate (UC) Check ─────────────────────────────
        # High financial disbursement (>75%) requires a Utilization Certificate (UC) per MPLADS rules
        if is_high_financial_disbursement and not has_uc:
            signals.append(AgentSignal(
                signal_type="MISSING_UTILIZATION_CERTIFICATE",
                description=f"Financial progress at {fin_prog:.1f}% but missing Utilization Certificate (UC)",
                severity=Severity.HIGH if is_physically_complete else Severity.MEDIUM,
                value="MISSING",
                expected_value="UTILIZATION_CERTIFICATE",
                confidence=0.90,
            ))
            score += 30.0

        # ── 3. Asset Handover & Inspection Verification ────────────────────────
        # Completed works require photo inspection evidence and registered asset entries
        if is_physically_complete:
            if not has_inspection:
                signals.append(AgentSignal(
                    signal_type="MISSING_PHYSICAL_INSPECTION",
                    description="Completed project lacks mandatory photo evidence or inspection report",
                    severity=Severity.MEDIUM,
                    value="MISSING",
                    expected_value="INSPECTION_REPORT or PHOTO_EVIDENCE",
                    confidence=0.85,
                ))
                score += 20.0

            if len(assets) == 0:
                signals.append(AgentSignal(
                    signal_type="UNREGISTERED_COMPLETED_ASSET",
                    description="Project is completed but has zero physical asset records created in the registry",
                    severity=Severity.MEDIUM,
                    value=0,
                    unit="count",
                    confidence=0.80,
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
            confidence=0.90,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["document_records", "asset_records", "digital_twin"],
        )
