"""
nlp/explanation.py
NLP Explanation Engine — Part B.
Converts RiskOutput, RiskFingerprint, and top AgentEvidence signals into a human-readable,
audit-compliant narrative using neutral language (avoiding autonomous "fraud" claims).
"""
from __future__ import annotations
from typing import Optional

from models.agent import AgentEvidence
from models.digital_twin import ProjectDigitalTwin
from models.enums import RiskLevel, Severity
from models.risk import RiskOutput, RiskFingerprint


class NLPExplanationEngine:
    """
    Generates human-readable, audit-compliant summary narratives for district authorities.
    Translates raw risk metrics, fingerprints, and agent signals into structured Markdown reports.
    Enforces neutral language guidelines: uses 'elevated risk indicator', 'anomaly', 'discrepancy'.
    """

    def generate_explanation(
        self,
        risk_output: RiskOutput,
        evidence_list: list[AgentEvidence],
        digital_twin: Optional[ProjectDigitalTwin] = None,
    ) -> str:
        """
        Generate structured Markdown narrative from RiskOutput and AgentEvidence list.
        """
        proj_name = digital_twin.project_name if digital_twin else risk_output.project_id
        proj_id = risk_output.project_id
        location_str = ""
        if digital_twin and digital_twin.location:
            location_str = f"{digital_twin.location.district}, {digital_twin.location.state}"

        sections: list[str] = []

        # ── 1. Executive Overview ──────────────────────────────────────────────
        sections.append(f"# Executive Risk Assessment Report")
        sections.append(f"**Project ID:** `{proj_id}`  ")
        sections.append(f"**Project Name:** {proj_name}  ")
        if location_str:
            sections.append(f"**Location:** {location_str}  ")
        sections.append(f"**Overall Risk Score:** **{risk_output.overall_risk_score}/100** ({risk_output.risk_level.value} Risk)  ")
        sections.append(f"**Assessment Date:** {risk_output.computed_at.strftime('%Y-%m-%d %H:%M UTC')}  \n")

        exec_summary = self._build_executive_summary(risk_output)
        sections.append(exec_summary)

        # ── 2. 3D Risk Breakdown Analysis ─────────────────────────────────────
        sections.append("\n## 1. Multi-Dimensional Risk Breakdown\n")
        sections.append(f"- **Current Risk Score ({risk_output.current_risk}/100):** Reflects immediate operational and financial indicators, such as payment-progress gaps, unverified disbursements, or cost overruns.")
        sections.append(f"- **Future Risk Score ({risk_output.future_risk}/100):** Evaluates forward-looking trajectory including predicted completion delay probability, physical pace stagnation, and schedule extensions.")
        sections.append(f"- **Systemic Risk Score ({risk_output.systemic_risk}/100):** Measures network-level indicators including contractor concentration, geographic clustering, and procurement patterns.")

        # ── 3. Risk Fingerprint Breakdown ─────────────────────────────────────
        if risk_output.fingerprint:
            sections.append("\n### Risk Fingerprint Dimensions\n")
            fp = risk_output.fingerprint
            sections.append(f"| Risk Dimension | Score (0-1.0) | Status |")
            sections.append(f"| :--- | :---: | :--- |")
            sections.append(f"| Cost Inflation | `{fp.cost_inflation:.2f}` | {self._format_fp_status(fp.cost_inflation)} |")
            sections.append(f"| Payment/Progress Mismatch | `{fp.payment_progress_mismatch:.2f}` | {self._format_fp_status(fp.payment_progress_mismatch)} |")
            sections.append(f"| Repeated Delay | `{fp.repeated_delay:.2f}` | {self._format_fp_status(fp.repeated_delay)} |")
            sections.append(f"| Contractor Pattern | `{fp.contractor_pattern:.2f}` | {self._format_fp_status(fp.contractor_pattern)} |")
            sections.append(f"| Documentation Gap | `{fp.documentation_gap:.2f}` | {self._format_fp_status(fp.documentation_gap)} |")
            sections.append(f"| Duplicate Work Risk | `{fp.duplicate_work:.2f}` | {self._format_fp_status(fp.duplicate_work)} |")
            sections.append(f"| Procurement Irregularity | `{fp.procurement_irregularity:.2f}` | {self._format_fp_status(fp.procurement_irregularity)} |")
            sections.append(f"| Geographic Cluster Risk | `{fp.geographic_cluster:.2f}` | {self._format_fp_status(fp.geographic_cluster)} |")

        # ── 4. Key Agent Findings & Signals ──────────────────────────────────
        sections.append("\n## 2. Key Indicator Findings\n")
        if risk_output.top_signals:
            for sig_text in risk_output.top_signals:
                sections.append(f"- {sig_text}")
        else:
            sections.append("- No high-severity risk signals detected across evaluated agent criteria.")

        # ── 5. Relevant Policy & Guideline References ─────────────────────────
        sections.append("\n## 3. Statutory & Guideline References\n")
        sections.append(self._get_policy_citations(evidence_list, digital_twin))

        # ── 6. Actionable Recommendations ─────────────────────────────────────
        sections.append("\n## 4. Actionable Recommendations for District Authority\n")
        recs = self._build_recommendations(risk_output, evidence_list)
        for i, rec in enumerate(recs, 1):
            sections.append(f"{i}. {rec}")

        sections.append("\n---\n*Notice: This report provides automated decision-support insights derived from data platform indicators. Final administrative determinations rest with authorized District Authorities.*")

        return "\n".join(sections)

    def _build_executive_summary(self, risk_output: RiskOutput) -> str:
        score = risk_output.overall_risk_score
        level = risk_output.risk_level.value

        if level == "CRITICAL" or score >= 80:
            return (
                f"**Executive Summary:** The project exhibits a **CRITICAL** risk score of {score:.1f}/100. "
                f"Significant anomalies have been identified across multiple operational dimensions, requiring immediate "
                f"administrative review and physical inspection prior to further financial disbursements."
            )
        elif level == "HIGH" or score >= 60:
            return (
                f"**Executive Summary:** The project exhibits a **HIGH** risk score of {score:.1f}/100. "
                f"Elevated indicators suggest notable physical-financial progress discrepancies or schedule delay risks "
                f"that warrant formal verification by the implementing agency."
            )
        elif level == "MEDIUM" or score >= 30:
            return (
                f"**Executive Summary:** The project exhibits a **MODERATE** risk score of {score:.1f}/100. "
                f"Minor variance indicators or documentation gaps were detected. Routine monitoring and periodic progress "
                f"reporting are recommended."
            )
        else:
            return (
                f"**Executive Summary:** The project presents a **LOW** risk profile ({score:.1f}/100). "
                f"Evaluated parameters align within standard administrative and financial parameters."
            )

    def _format_fp_status(self, score: float) -> str:
        if score >= 0.70:
            return "🔴 Elevated Indicator"
        elif score >= 0.35:
            return "🟡 Moderate Variance"
        else:
            return "🟢 Normal Range"

    def _get_policy_citations(
        self, evidence_list: list[AgentEvidence], digital_twin: Optional[ProjectDigitalTwin]
    ) -> str:
        citations = [
            "**MPLADS Guidelines 2023 (Section 3.2):** Mandates that all sanctioned works must undergo physical inspection by designated district engineers before final payment release.",
            "**MPLADS Guidelines 2023 (Section 4.1):** Requires submission of a formal Utilization Certificate (UC) upon completion of financial milestones prior to subsequent fund allocation.",
        ]

        # Add citations retrieved by RAGAgent if available
        for ev in evidence_list:
            if ev.agent_id == "rag_agent":
                for item in ev.evidence:
                    if item.label.startswith("Guideline Citation"):
                        citations.append(f"**{item.label}:** {item.value}")

        return "\n".join([f"- {c}" for c in citations[:4]])

    def _build_recommendations(
        self, risk_output: RiskOutput, evidence_list: list[AgentEvidence]
    ) -> list[str]:
        recs = []

        if risk_output.current_risk >= 40:
            recs.append(
                "Conduct an on-site physical measurement audit (Measurement Book check) to verify physical progress against recorded payments."
            )
        if risk_output.future_risk >= 40:
            recs.append(
                "Request an updated completion schedule and milestone recovery plan from the implementing agency."
            )
        if risk_output.systemic_risk >= 40:
            recs.append(
                "Review contractor registration history and verify cross-project allocation across district works."
            )

        # Check specific agent findings
        for ev in evidence_list:
            if ev.agent_id == "asset_completion_agent" and ev.score > 0:
                recs.append("Verify mandatory Completion Certificate (CC) and asset photo evidence in the digital registry.")
            if ev.agent_id == "payment_agent" and ev.score >= 35:
                recs.append("Examine payment vouchers for inactive periods exceeding 45 days to resolve potential fund parking.")

        if not recs:
            recs.append("Maintain routine quarterly progress reporting and standard document compliance verification.")

        return recs
