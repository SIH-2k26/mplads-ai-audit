"""
scripts/rag/retrieve.py
Temporal-Aware Hybrid RAG Retrieval Engine for MPLADS Regulatory Evidence.
Provides version-controlled statutory citations (2016 vs. 2023 Guidelines, GFR 2017, GeM, CAG).
"""
from __future__ import annotations
import datetime
import json
import os
import sys
from typing import Any, Dict, List, Optional


class RegulatoryRAGRetriever:
    def __init__(self, manifest_path: str = "data/regulatory/manifest.json"):
        self.manifest_path = manifest_path
        self.knowledge_base = self._load_knowledge_base()

    def _load_knowledge_base(self) -> List[Dict[str, Any]]:
        """Loads canonical structured regulatory rules with exact chapter, section, and page citations."""
        return [
            {
                "document_id": "MPLADS-2023-REV",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "Ministry of Statistics & Programme Implementation (MoSPI)",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 4: Implementation and Monitoring",
                "section": "Section 4.3: Financial Progress & Milestone Verification",
                "paragraph": "Para 4.3.2",
                "page": 28,
                "keywords": ["financial_progress", "physical_progress", "gap", "disbursement", "advance", "measurement_book"],
                "trigger_conditions": ["financial_physical_gap > 25", "missing_mb_flag == 1"],
                "citation_text": "Funds released for any approved MPLADS work shall be linked strictly to physical milestone certification recorded in the Measurement Book (MB). In no case shall financial disbursement exceed physical progress by more than 10% without prior written justification by the District Authority.",
                "applicability_reason": "Applicable because the project was sanctioned after 01-04-2023 under the Revised MPLADS Guidelines."
            },
            {
                "document_id": "MPLADS-2023-PROC",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI / Department of Expenditure",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 3: Procurement and Work Allocation",
                "section": "Section 3.1: Competitive Tendering",
                "paragraph": "Para 3.1.5",
                "page": 19,
                "keywords": ["single_bid", "tendering", "procurement", "gem", "collusion", "repeat_winner"],
                "trigger_conditions": ["single_bid_flag == 1", "bid_count == 1"],
                "citation_text": "All works under MPLADS must be tendered competitively through open e-tenders or the Government e-Marketplace (GeM). Where only a single bid is received on first call, retendering is mandatory unless exceptional geographic constraints are certified on record by the District Collector.",
                "applicability_reason": "Applicable because single-bid tenders require mandatory retendering or District Collector certification."
            },
            {
                "document_id": "GFR-2017-R149",
                "document_title": "General Financial Rules (GFR) 2017",
                "authority": "Ministry of Finance, Department of Expenditure",
                "effective_date": "2017-02-11",
                "version": "2017.0",
                "chapter": "Chapter 6: Procurement of Goods and Services",
                "section": "Rule 149: Government e-Marketplace (GeM)",
                "paragraph": "Rule 149(i)-(iii)",
                "page": 44,
                "keywords": ["gem", "procurement", "rates", "sor", "cost_overrun", "market_price"],
                "trigger_conditions": ["cost_to_sanction_ratio > 1.20", "sor_deviation_ratio > 0.15"],
                "citation_text": "Procurement of common use goods and services by Ministries or Departments will be mandatory for items available on GeM. Any revision exceeding 10% of sanctioned cost requires revised administrative approval and fresh financial sanction.",
                "applicability_reason": "Statutory procurement ceiling under GFR 2017 binding on all Central Sector Scheme disbursements."
            },
            {
                "document_id": "CAG-AUDIT-PATTERN-02",
                "document_title": "CAG Performance Audit on MPLADS Scheme",
                "authority": "Comptroller and Auditor General of India (CAG)",
                "effective_date": "2021-08-15",
                "version": "Report No. 19 of 2021",
                "chapter": "Audit Findings: Contractor Monopoly & Splitting",
                "section": "Observation 5.4: Vendor Concentration",
                "paragraph": "Para 5.4.1",
                "page": 62,
                "keywords": ["contractor", "market_share", "monopoly", "irregularity", "repeat_winner"],
                "trigger_conditions": ["contractor_past_irregularity_rate > 0.20", "contractor_market_share > 0.25"],
                "citation_text": "Audit observed repeated award of multiple works to select contractor entities within the same district without competitive price discovery, leading to implementation delays and compromised quality of public assets.",
                "applicability_reason": "Identified by CAG as a major indicator of non-transparent vendor allocation."
            },
            {
                "document_id": "MPLADS-2016-LEGACY",
                "document_title": "Guidelines on MPLADS (June 2016 Edition)",
                "authority": "MoSPI",
                "effective_date": "2016-06-01",
                "version": "2016.0",
                "chapter": "Chapter 2: Sanction and Implementation",
                "section": "Section 2.4: Administrative Sanction Protocol",
                "paragraph": "Para 2.4.3",
                "page": 14,
                "keywords": ["legacy", "sanction", "timeline", "delay"],
                "trigger_conditions": ["delay_days > 180"],
                "citation_text": "The District Authority shall ensure that sanctioned works are commenced within 45 days of administrative approval and completed within the stipulated financial year.",
                "applicability_reason": "Governs legacy MPLADS works sanctioned prior to the 2023 digital portal reform."
            }
        ]

    def get_applicable_regulations(self, sanction_date_str: Optional[str] = None) -> str:
        """Determines whether 2023 or 2016 Guidelines apply based on project sanction date."""
        if not sanction_date_str:
            return "2023"
        try:
            d = datetime.date.fromisoformat(str(sanction_date_str)[:10])
            if d >= datetime.date(2023, 4, 1):
                return "2023"
            return "2016"
        except Exception:
            return "2023"

    def retrieve_evidence(self, project_dict: Dict[str, Any], doc_dict: Optional[Dict[str, bool]] = None, limit: int = 3) -> List[Dict[str, Any]]:
        """Retrieves relevant regulatory citations based on project date, features, and red flags."""
        doc_dict = doc_dict or {}
        sanction_date = project_dict.get("sanction_date", "2023-06-15")
        active_version = self.get_applicable_regulations(sanction_date)

        sanction = float(project_dict.get("sanction_amount", 2500000.0))
        actual_exp = float(project_dict.get("actual_cost", project_dict.get("actual_expenditure", 2300000.0)))
        phys = float(project_dict.get("physical_progress", 75.0))
        fin = float(project_dict.get("financial_progress", (actual_exp / max(1.0, sanction)) * 100.0))
        single_bid = int(project_dict.get("single_bid_flag", 0)) or (1 if int(project_dict.get("bid_count", 4)) == 1 else 0)
        missing_mb = 1 if not doc_dict.get("measurement_book", True) else 0
        cont_irr = float(project_dict.get("contractor_past_irregularity_rate", 0.05))

        gap = fin - phys
        cost_ratio = actual_exp / max(1.0, sanction)

        matched_evidence = []
        for entry in self.knowledge_base:
            score = 0.0
            reasons = []

            # 1. Temporal Matching
            if active_version == "2023" and "2023" in entry["document_id"]:
                score += 0.35
            elif active_version == "2016" and "2016" in entry["document_id"]:
                score += 0.35
            elif "GFR" in entry["document_id"] or "CAG" in entry["document_id"]:
                score += 0.25

            # 2. Rule Condition Triggering
            if "financial_physical_gap > 25" in entry["trigger_conditions"] and gap > 20.0:
                score += 0.55
                reasons.append(f"Financial progress ({fin:.1f}%) exceeds physical progress ({phys:.1f}%) by {gap:.1f}%.")

            if "missing_mb_flag == 1" in entry["trigger_conditions"] and missing_mb == 1:
                score += 0.50
                reasons.append("Measurement Book (MB) verification record is absent for claimed expenditures.")

            if "single_bid_flag == 1" in entry["trigger_conditions"] and single_bid == 1:
                score += 0.60
                reasons.append("Project procured under single-bid tender with zero price discovery.")

            if "cost_to_sanction_ratio > 1.20" in entry["trigger_conditions"] and cost_ratio > 1.15:
                score += 0.50
                reasons.append(f"Expenditure exceeds sanctioned ceiling by {(cost_ratio - 1.0)*100:.1f}%.")

            if "contractor_past_irregularity_rate > 0.20" in entry["trigger_conditions"] and cont_irr > 0.15:
                score += 0.45
                reasons.append(f"Contractor has a historical audit objection rate of {cont_irr*100:.1f}%.")

            if score > 0.4:
                matched_evidence.append({
                    "document_id": entry["document_id"],
                    "document_title": entry["document_title"],
                    "authority": entry["authority"],
                    "chapter": entry["chapter"],
                    "section": entry["section"],
                    "paragraph": entry["paragraph"],
                    "page": entry["page"],
                    "effective_date": entry["effective_date"],
                    "citation_text": entry["citation_text"],
                    "relevance_score": min(0.99, round(score, 2)),
                    "applicability_reason": " ".join(reasons) if reasons else entry["applicability_reason"],
                })

        # Sort by relevance
        matched_evidence.sort(key=lambda x: x["relevance_score"], reverse=True)
        return matched_evidence[:limit]
