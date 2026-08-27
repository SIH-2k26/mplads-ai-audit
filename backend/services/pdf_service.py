"""
services/pdf_service.py
FieldInspectionPDFService — Part B Reporting Layer.
Generates a 1-page printable Field Inspection Brief PDF using ReportLab.
Includes Header, Work Metadata, 3D Risk Badge, 8D Fingerprint Table,
Plain-Language NLP Triggers, QR Code Evidence placeholder, and Physical Verification Checklist.
"""
from __future__ import annotations
import io
from typing import Optional
from datetime import datetime

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

from models.digital_twin import ProjectDigitalTwin
from models.risk import RiskOutput, RiskFingerprint


class FieldInspectionPDFService:
    """
    Constructs a 1-page printable Field Inspection Brief PDF using ReportLab.
    Used by District Authorities for site inspections and audit verification.
    """

    def generate_field_inspection_brief(
        self,
        digital_twin: ProjectDigitalTwin,
        risk_output: RiskOutput,
        nlp_summary: Optional[str] = None,
    ) -> bytes:
        """
        Generate PDF binary bytes for the project field inspection brief.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=36,
            rightMargin=36,
            topMargin=36,
            bottomMargin=36,
        )

        styles = getSampleStyleSheet()
        
        # Custom Styles
        style_header_title = ParagraphStyle(
            "HeaderTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=16,
            textColor=colors.whitesmoke,
            alignment=TA_LEFT,
            spaceAfter=4,
        )
        style_header_sub = ParagraphStyle(
            "HeaderSub",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            textColor=colors.whitesmoke,
            alignment=TA_LEFT,
        )
        style_section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            textColor=colors.HexColor("#1A365D"),
            spaceBefore=8,
            spaceAfter=4,
        )
        style_body = ParagraphStyle(
            "BodyTextCustom",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#2D3748"),
        )
        style_bold = ParagraphStyle(
            "BoldTextCustom",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#1A202C"),
        )

        story = []

        # ── 1. Header Banner ──────────────────────────────────────────────────
        header_text = [
            Paragraph("MPLADS GUARDIAN — FIELD INSPECTION BRIEF", style_header_title),
            Paragraph("Ministry of Statistics & Programme Implementation | District Risk Audit Division", style_header_sub),
        ]
        header_table = Table([[header_text]], colWidths=[540])
        header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#1A365D")),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 8))

        # ── 2. Work & Location Metadata ───────────────────────────────────────
        sanctioned_amt = f"INR {float(digital_twin.sanctioned_amount):,.0f}" if digital_twin.sanctioned_amount else "N/A"
        expenditure_amt = f"INR {float(digital_twin.total_expenditure):,.0f}" if digital_twin.total_expenditure else "INR 0"
        district_state = f"{digital_twin.location.district}, {digital_twin.location.state}" if digital_twin.location else "N/A"

        meta_data = [
            [
                Paragraph("<b>Project ID:</b>", style_body),
                Paragraph(digital_twin.project_id, style_bold),
                Paragraph("<b>Category:</b>", style_body),
                Paragraph(digital_twin.category or "General", style_bold),
            ],
            [
                Paragraph("<b>Project Name:</b>", style_body),
                Paragraph(digital_twin.project_name[:45] + "..." if len(digital_twin.project_name) > 45 else digital_twin.project_name, style_bold),
                Paragraph("<b>Location:</b>", style_body),
                Paragraph(district_state, style_bold),
            ],
            [
                Paragraph("<b>Sanctioned Budget:</b>", style_body),
                Paragraph(sanctioned_amt, style_bold),
                Paragraph("<b>Total Expenditure:</b>", style_body),
                Paragraph(expenditure_amt, style_bold),
            ],
            [
                Paragraph("<b>Financial Progress:</b>", style_body),
                Paragraph(f"{digital_twin.financial_progress or 0:.1f}%", style_bold),
                Paragraph("<b>Physical Progress:</b>", style_body),
                Paragraph(f"{digital_twin.physical_progress or 0:.1f}%", style_bold),
            ],
        ]
        meta_table = Table(meta_data, colWidths=[110, 160, 110, 160])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F7FAFC")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 6))

        # ── 3. 3D Risk Assessment Badge ───────────────────────────────────────
        risk_color = self._get_risk_color(risk_output.risk_level.value)
        
        badge_cell = Paragraph(
            f"<font size=14 color=white><b>{risk_output.overall_risk_score:.1f} / 100</b></font><br/>"
            f"<font size=10 color=white><b>{risk_output.risk_level.value} RISK</b></font>",
            ParagraphStyle("BadgeStyle", alignment=TA_CENTER)
        )
        scores_cell = Paragraph(
            f"<b>3D Risk Breakdown:</b><br/>"
            f"• <b>Current Operational Risk:</b> {risk_output.current_risk:.1f} / 100<br/>"
            f"• <b>Future Delay Trajectory Risk:</b> {risk_output.future_risk:.1f} / 100<br/>"
            f"• <b>Systemic & Network Risk:</b> {risk_output.systemic_risk:.1f} / 100",
            style_body
        )

        risk_badge_table = Table([[badge_cell, scores_cell]], colWidths=[160, 380])
        risk_badge_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), risk_color),
            ('BACKGROUND', (1, 0), (1, 0), colors.HexColor("#EDF2F7")),
            ('ALIGN', (0, 0), (0, 0), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(risk_badge_table)
        story.append(Spacer(1, 6))

        # ── 4. 8D Risk Fingerprint Table ──────────────────────────────────────
        story.append(Paragraph("8D RISK FINGERPRINT DIMENSIONS", style_section_heading))
        fp = risk_output.fingerprint or RiskFingerprint()

        fp_data = [
            [
                Paragraph(f"Cost Inflation: <b>{fp.cost_inflation:.2f}</b>", style_body),
                Paragraph(f"Payment Mismatch: <b>{fp.payment_progress_mismatch:.2f}</b>", style_body),
                Paragraph(f"Repeated Delay: <b>{fp.repeated_delay:.2f}</b>", style_body),
                Paragraph(f"Contractor Pattern: <b>{fp.contractor_pattern:.2f}</b>", style_body),
            ],
            [
                Paragraph(f"Documentation Gap: <b>{fp.documentation_gap:.2f}</b>", style_body),
                Paragraph(f"Duplicate Work: <b>{fp.duplicate_work:.2f}</b>", style_body),
                Paragraph(f"Procurement Split: <b>{fp.procurement_irregularity:.2f}</b>", style_body),
                Paragraph(f"Geo Cluster: <b>{fp.geographic_cluster:.2f}</b>", style_body),
            ]
        ]
        fp_table = Table(fp_data, colWidths=[135, 135, 135, 135])
        fp_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F7FAFC")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ]))
        story.append(fp_table)
        story.append(Spacer(1, 6))

        # ── 5. Key Indicator Triggers ──────────────────────────────────────────
        story.append(Paragraph("KEY AUDIT INDICATORS & SIGNALS", style_section_heading))
        signals_text = []
        if risk_output.top_signals:
            for sig in risk_output.top_signals[:3]:
                signals_text.append(f"• {sig}")
        else:
            signals_text.append("• No high-severity risk signals identified.")

        signals_para = Paragraph("<br/>".join(signals_text), style_body)
        story.append(signals_para)
        story.append(Spacer(1, 8))

        # ── 6. Physical Verification Sign-off Checklist ──────────────────────
        story.append(Paragraph("PHYSICAL VERIFICATION & FIELD SIGN-OFF CHECKLIST", style_section_heading))
        
        checklist_data = [
            [
                Paragraph("<b>[  ] Physical Progress Verified:</b> ____%", style_body),
                Paragraph("<b>[  ] Measurement Book (MB) Entry Verified</b>", style_body),
            ],
            [
                Paragraph("<b>[  ] Site Geotagged Photo Proof Verified</b>", style_body),
                Paragraph("<b>[  ] Utilization Certificate (UC) Confirmed</b>", style_body),
            ],
        ]
        checklist_table = Table(checklist_data, colWidths=[270, 270])
        checklist_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F7FAFC")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E0")),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ]))
        story.append(checklist_table)
        story.append(Spacer(1, 10))

        # ── 7. Sign-off Footer & QR Placeholder ──────────────────────────────
        qr_box = Table([[Paragraph("<b>[ QR EVIDENCE LINK ]</b><br/>Scan for Digital Twin", ParagraphStyle("QR", fontSize=7, alignment=TA_CENTER))]], colWidths=[120], rowHeights=[35])
        qr_box.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EDF2F7")),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#A0AEC0")),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))

        sign_text = Paragraph(
            "<b>Inspecting Officer Signature:</b> ___________________________<br/>"
            "<b>Name & Designation:</b> _______________________________<br/>"
            "<b>Inspection Date & Stamp:</b> ____________________________",
            style_body
        )

        footer_table = Table([[qr_box, sign_text]], colWidths=[140, 400])
        footer_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(footer_table)

        doc.build(story)
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes

    def _get_risk_color(self, level_str: str) -> colors.Color:
        if level_str == "CRITICAL":
            return colors.HexColor("#E53E3E")  # Red
        elif level_str == "HIGH":
            return colors.HexColor("#DD6B20")  # Orange
        elif level_str == "MEDIUM":
            return colors.HexColor("#D69E2E")  # Yellow/Gold
        else:
            return colors.HexColor("#38A169")  # Green
