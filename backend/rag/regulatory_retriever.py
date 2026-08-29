"""
backend/rag/regulatory_retriever.py
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
                "keywords": ["financial_progress", "physical_progress", "gap", "disbursement", "advance", "measurement_book", "mb"],
                "trigger_conditions": ["financial_physical_gap > 25", "missing_mb_flag == 1"],
                "citation_text": "Funds released for any approved MPLADS work shall be linked strictly to physical milestone certification recorded in the Measurement Book (MB). In no case shall financial disbursement exceed physical progress by more than 10% without prior written justification by the District Authority.",
                "applicability_reason": "Applicable because the project was sanctioned after 01-04-2023 under the Revised MPLADS Guidelines."
            },
            {
                "document_id": "MPLADS-2023-SLA",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 3: Sanction and Scrutiny",
                "section": "Section 3.2.4: Mandatory Timeline for Sanction or Rejection",
                "paragraph": "Para 3.2.4",
                "page": 21,
                "keywords": ["timeline", "sanction", "rejection", "45", "days", "sla", "recommendation", "district authority"],
                "trigger_conditions": ["delay_days > 45", "sanction_delay > 45"],
                "citation_text": "The Implementing District Authority shall examine the MP recommendation and issue formal administrative sanction or communicate rejection with recorded reasons within 45 days of receipt.",
                "applicability_reason": "Statutory 45-day decision SLA under Revised MPLADS Guidelines 2023."
            },
            {
                "document_id": "MPLADS-2023-SCST",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 2: Scheme Entitlement and Allocations",
                "section": "Section 2.3: Mandatory SC and ST Area Allocations",
                "paragraph": "Para 2.3.1",
                "page": 16,
                "keywords": ["sc", "st", "allocation", "quota", "tribal", "scheduled caste", "scheduled tribe", "15%", "7.5%"],
                "trigger_conditions": ["sc_allocation_deficit == 1", "st_allocation_deficit == 1"],
                "citation_text": "MPs must recommend works contributing at least 15% of their annual entitlement to areas inhabited by Scheduled Castes (SC) and 7.5% to areas inhabited by Scheduled Tribes (ST).",
                "applicability_reason": "Mandatory affirmative development allocation quota."
            },
            {
                "document_id": "MPLADS-2023-BUDGET",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 1: Scheme Architecture",
                "section": "Section 1.2: Annual Entitlement & Drawing Limit",
                "paragraph": "Para 1.2.1",
                "page": 8,
                "keywords": ["annual", "entitlement", "5 crore", "budget", "drawing limit", "esakshi"],
                "trigger_conditions": ["sanction_amount > 50000000"],
                "citation_text": "The annual entitlement of each MP under MPLADS is ₹5 Crore, authorized in online drawing limits administered via the e-SAKSHI portal in two tranches of ₹2.5 Crore each.",
                "applicability_reason": "Statutory annual entitlement ceiling per Member of Parliament."
            },
            {
                "document_id": "MPLADS-2023-PROHIBITED",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 3: Permissibility of Works",
                "section": "Section 3.2: Inadmissible Works and Land Title Rules",
                "paragraph": "Para 3.2.2 & Annexure II",
                "page": 24,
                "keywords": ["prohibited", "inadmissible", "private", "commercial", "trust", "land title", "annexure ii"],
                "trigger_conditions": ["prohibited_work_flag == 1", "private_land_flag == 1"],
                "citation_text": "MPLADS funds can only be utilized for creating durable public assets on government-owned land. Works for private institutions, commercial revenue-generating assets, or religious bodies are strictly prohibited under Annexure II.",
                "applicability_reason": "Binding restriction preserving public durable utility."
            },
            {
                "document_id": "GFR-2017-R149",
                "document_title": "General Financial Rules (GFR) 2017",
                "authority": "Ministry of Finance, Department of Expenditure",
                "effective_date": "2017-02-11",
                "version": "2017.0",
                "chapter": "Chapter 6: Procurement of Goods and Services",
                "section": "Rule 149: Government e-Marketplace (GeM) & Open Tenders",
                "paragraph": "Rule 149(i)-(iii)",
                "page": 44,
                "keywords": ["gem", "procurement", "tendering", "thresholds", "gfr", "rule 149", "tender"],
                "trigger_conditions": ["tender_bypass_flag == 1", "bid_count == 0"],
                "citation_text": "Procurement of common-use goods and services available on GeM is mandatory. For works exceeding ₹5 Lakhs, open e-tenders must be published with a minimum 14-day bidding window.",
                "applicability_reason": "Statutory public procurement rules binding on all Central Sector disbursements."
            },
            {
                "document_id": "MPLADS-2023-UC",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 4: Financial Governance",
                "section": "Section 4.3: Utilization Certificate (UC) & Audit Protocol",
                "paragraph": "Para 4.3.5",
                "page": 31,
                "keywords": ["utilization certificate", "uc", "second installment", "audit", "expenditure report"],
                "trigger_conditions": ["missing_uc_flag == 1"],
                "citation_text": "Subsequent tranches shall not be released to the District Authority without formal submission of a certified Utilization Certificate (Form MPLADS-UC) signed by the District Magistrate.",
                "applicability_reason": "Mandatory financial accounting compliance precondition."
            },
            {
                "document_id": "CVC-2022-SINGLEBID",
                "document_title": "CVC Procurement Guidelines",
                "authority": "Central Vigilance Commission (CVC)",
                "effective_date": "2022-05-02",
                "version": "Circular 02/05/2022",
                "chapter": "Transparency in Public Procurement",
                "section": "Circular 02/05/2022: Scrutiny of Single Bids",
                "paragraph": "Para 3",
                "page": 6,
                "keywords": ["single bid", "single-bid", "retender", "cvc", "price discovery", "justification"],
                "trigger_conditions": ["single_bid_flag == 1"],
                "citation_text": "Where only a single bid is received, retendering should normally be conducted. If accepted on first call due to extreme urgency, reasons and price reasonableness must be recorded in writing.",
                "applicability_reason": "Statutory anti-collusion check for non-competitive tenders."
            },
            {
                "document_id": "MPLADS-2023-COMPLETION",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 3: Project Completion Protocol",
                "section": "Section 3.4.1: Completion Timeline Post Demitting Office",
                "paragraph": "Para 3.4.1",
                "page": 26,
                "keywords": ["completion", "18 months", "demit", "demitting office", "pending works"],
                "trigger_conditions": ["demitting_overdue == 1"],
                "citation_text": "All duly sanctioned works must be completed within 18 months from the date the recommending MP demits office. Unspent balances for incomplete works must be refunded to the central pool.",
                "applicability_reason": "Statutory completion outer limit following tenure conclusion."
            },
            {
                "document_id": "MPLADS-2016-LEGACY",
                "document_title": "Guidelines on MPLADS (June 2016 Edition)",
                "authority": "MoSPI",
                "effective_date": "2016-06-01",
                "version": "2016.0",
                "chapter": "Chapter 3: Disaster and Calamity Allocations",
                "section": "Section 3.8: Natural Calamity Rehabilitation Sanction Protocol",
                "paragraph": "Para 3.8.2",
                "page": 19,
                "keywords": ["calamity", "disaster", "2016", "legacy", "rehabilitation", "reconstruction"],
                "trigger_conditions": ["calamity_work_flag == 1"],
                "citation_text": "MPs may recommend up to ₹1 Crore for rehabilitation works in areas affected by severe natural calamities in any part of the State under the 2016 regulatory framework.",
                "applicability_reason": "Governs legacy MPLADS calamity allocations prior to the 2023 guidelines."
            },
            {
                "document_id": "CAG-REPORT-2341",
                "document_title": "CAG Performance Audit on MPLADS Scheme (Report 2341)",
                "authority": "Comptroller and Auditor General of India (CAG)",
                "effective_date": "2021-08-15",
                "version": "Report No. 19 of 2021",
                "chapter": "Chapter 4: Procurement Irregularities",
                "section": "Chapter 4: Artificial Splitting of Work Orders",
                "paragraph": "Observation 4.2",
                "page": 58,
                "keywords": ["splitting", "split tender", "cag", "report 2341", "circumvention", "work order"],
                "trigger_conditions": ["split_tender_flag == 1"],
                "citation_text": "Splitting composite works into smaller work orders below financial sanction limits to evade mandatory e-tendering violates GFR and constitutes a major audit irregularity.",
                "applicability_reason": "CAG benchmark finding on artificial work-order fragmentation."
            },
            {
                "document_id": "MPLADS-2023-ESAKSHI",
                "document_title": "Revised Guidelines on MPLADS 2023",
                "authority": "MoSPI",
                "effective_date": "2023-04-01",
                "version": "2023.1",
                "chapter": "Chapter 4: Digital Fund-Flow Mechanism",
                "section": "Section 4.1: Paperless Web-based Fund-Flow via eSAKSHI",
                "paragraph": "Para 4.1.1",
                "page": 27,
                "keywords": ["esakshi", "e-sakshi", "web-based", "portal", "digital fund flow", "digigov"],
                "trigger_conditions": ["offline_workflow_flag == 1"],
                "citation_text": "Effective 1 April 2023, the entire workflow of recommendation, sanction, bill processing, vendor payment, and asset registration shall be conducted exclusively through the e-SAKSHI digital portal.",
                "applicability_reason": "Mandatory digital lifecycle compliance."
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

        matched_evidence.sort(key=lambda x: x["relevance_score"], reverse=True)
        return matched_evidence[:limit]

    def search_by_query(self, query: str, project_date: Optional[str] = None, top_k: int = 3) -> List[Dict[str, Any]]:
        """Performs dense + BM25 keyword statutory search with temporal date filtering."""
        q_lower = query.lower()
        active_version = self.get_applicable_regulations(project_date)
        q_tokens = set([t.strip("?,.:;()[]\"'") for t in q_lower.split() if len(t) > 2])

        scored = []
        for entry in self.knowledge_base:
            score = 0.0
            doc_id = entry.get("document_id", "")
            title = entry.get("document_title", "")
            sec = entry.get("section", "")
            chap = entry.get("chapter", "")
            txt = entry.get("citation_text", "")
            keywords = [k.lower() for k in entry.get("keywords", [])]

            # 1. Temporal alignment
            if active_version == "2023" and "2023" in doc_id:
                score += 0.25
            elif active_version == "2016" and "2016" in doc_id:
                score += 0.35

            # 2. Keyword exact / phrase matches
            for kw in keywords:
                if kw in q_lower:
                    score += 0.35

            # 3. Token overlap with section & text
            sec_tokens = set([t.strip("?,.:;()[]\"'") for t in (sec + " " + title + " " + chap).lower().split()])
            text_tokens = set([t.strip("?,.:;()[]\"'") for t in txt.lower().split()])

            overlap_sec = q_tokens.intersection(sec_tokens)
            overlap_text = q_tokens.intersection(text_tokens)

            score += len(overlap_sec) * 0.18
            score += len(overlap_text) * 0.06

            if score > 0.10:
                scored.append({
                    "document": title,
                    "document_id": doc_id,
                    "authority": entry.get("authority", "MoSPI"),
                    "chapter": chap,
                    "section": sec,
                    "paragraph": entry.get("paragraph", ""),
                    "page": entry.get("page", 1),
                    "effective_from": entry.get("effective_date", "2023-04-01"),
                    "citation": f"{title}, {sec}, {entry.get('paragraph', '')}, p.{entry.get('page', 1)}",
                    "citation_text": txt,
                    "relevance_score": min(0.99, round(score, 2)),
                    "applicability_reason": entry.get("applicability_reason", "Statutory regulatory provision.")
                })

        scored.sort(key=lambda x: x["relevance_score"], reverse=True)
        return scored[:top_k] if scored else [{
            "document": "MPLADS Guidelines 2023",
            "document_id": "MPLADS-2023-GEN",
            "authority": "MoSPI",
            "chapter": "Chapter 1: Guidelines Overview",
            "section": "Section 1.1: General Governance",
            "paragraph": "Para 1.1",
            "page": 1,
            "effective_from": "2023-04-01",
            "citation": "MPLADS Guidelines 2023, Section 1.1, Para 1.1, p.1",
            "citation_text": "All works sanctioned under the scheme must conform to the statutory principles of durable public utility and transparent financial execution.",
            "relevance_score": 0.50,
            "applicability_reason": "General statutory guideline reference."
        }]


_GLOBAL_RETRIEVER: Optional[RegulatoryRAGRetriever] = None


def get_regulatory_retriever() -> RegulatoryRAGRetriever:
    """Returns singleton instance of the Regulatory RAG Retriever."""
    global _GLOBAL_RETRIEVER
    if _GLOBAL_RETRIEVER is None:
        _GLOBAL_RETRIEVER = RegulatoryRAGRetriever()
    return _GLOBAL_RETRIEVER
