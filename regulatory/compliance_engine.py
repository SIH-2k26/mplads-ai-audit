"""
regulatory/compliance_engine.py
Regulatory Compliance & Audit Observation Engine for MPLADS AI Audit.
Evaluates project data against normative rules and CAG audit patterns, producing a 0-100 compliance score,
structured violation objects, and traceable legal citations.
"""
from __future__ import annotations
import json
import os
import sys
from typing import Any, Dict, List, Optional
import pandas as pd


class RegulatoryComplianceEngine:
    def __init__(self, rules_path: str = "data/regulatory/rules/regulatory_rules.parquet", patterns_path: str = "data/regulatory/audit_patterns/cag_audit_patterns.parquet"):
        self.rules = []
        self.patterns = []

        if os.path.exists(rules_path):
            self.rules = pd.read_parquet(rules_path).to_dict(orient="records")
        if os.path.exists(patterns_path):
            self.patterns = pd.read_parquet(patterns_path).to_dict(orient="records")

    def evaluate_project_compliance(self, project_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates a single project dictionary against all normative rules and CAG audit patterns.
        """
        violations = []
        audit_signals = []
        total_penalty = 0.0

        # Extract normalized attributes
        sanctioned = float(project_dict.get("sanctioned_amount", 1000000.0))
        expenditure = float(project_dict.get("actual_expenditure", sanctioned))
        physical_prog = float(project_dict.get("physical_progress", 80.0))
        financial_prog = float(project_dict.get("financial_progress", (expenditure / max(1.0, sanctioned)) * 100.0))
        gap = financial_prog - physical_prog
        bid_count = int(project_dict.get("bid_count", 4))
        single_bid = 1 if (bid_count == 1 or project_dict.get("single_bid_flag") == 1) else 0
        missing_mb = int(project_dict.get("missing_mb_flag", 0))
        missing_uc = int(project_dict.get("missing_uc_flag", 0))
        missing_geotag = int(project_dict.get("missing_geotag_flag", 0))
        delay_days = int(project_dict.get("delay_days", 0))
        cost_ratio = expenditure / max(1.0, sanctioned)
        proc_channel = project_dict.get("procurement_channel", "STATE_TENDER")

        # 1. Evaluate Rule: DOE-COST-003 (Contract variation > 10%)
        if cost_ratio > 1.10:
            pen = 25.0 if cost_ratio > 1.25 else 15.0
            total_penalty += pen
            violations.append({
                "rule_id": "DOE-COST-003",
                "rule_name": "Contract Variation / Amendment Cap (10%)",
                "category": "COST_ESTIMATION",
                "severity": "HIGH" if cost_ratio > 1.25 else "MEDIUM",
                "description": f"Actual expenditure (Rs. {expenditure:,.0f}) exceeds approved sanction (Rs. {sanctioned:,.0f}) by {round((cost_ratio-1.0)*100, 1)}%.",
                "observed_value": round(cost_ratio, 3),
                "expected_value": "<= 1.10",
                "source": "GFR 2017 Rule 141 (DoE)",
            })

        # 2. Evaluate Rule: DOE-PROC-001 & DOE-PROC-002 (Single-bid tendering)
        if single_bid == 1 and sanctioned > 250000.0:
            total_penalty += 20.0
            violations.append({
                "rule_id": "DOE-PROC-002",
                "rule_name": "Single-Bid Tender Verification Norm",
                "category": "PROCUREMENT",
                "severity": "HIGH",
                "description": "Project awarded through single-bid tender without recorded verification of rate reasonableness against SOR.",
                "observed_value": 1,
                "expected_value": ">= 2 Bidders or formal rate reasonableness verification",
                "source": "DoE Public Procurement Manual & GFR Rule 161",
            })

        # 3. Evaluate Rule: MPLADS-EVIDENCE-004 (Measurement Book & Geotags)
        if missing_mb == 1:
            total_penalty += 30.0
            violations.append({
                "rule_id": "MPLADS-EVIDENCE-004",
                "rule_name": "Measurement Book (MB) Requirement",
                "category": "DOCUMENTATION",
                "severity": "HIGH",
                "description": "Payment disbursed without mandatory official Measurement Book (MB) verification record.",
                "observed_value": "Missing MB",
                "expected_value": "Verified MB Entry",
                "source": "MPLADS eSAKSHI Guidelines Section 4.2",
            })

        # 4. Evaluate CAG Pattern: CAG-OBS-001 (Progress-Payment Divergence)
        if gap > 30.0:
            total_penalty += 35.0
            audit_signals.append("PAYMENT_PROGRESS_MISMATCH")
            violations.append({
                "rule_id": "CAG-OBS-001",
                "rule_name": "Unwarranted Disbursement Against Lagging Physical Progress",
                "category": "PROGRESS_PAYMENT_MISMATCH",
                "severity": "CRITICAL",
                "description": f"Severe progress divergence: Financial progress ({financial_prog}%) leads physical progress ({physical_prog}%) by {gap:.1f}%.",
                "observed_value": f"Gap +{gap:.1f}%",
                "expected_value": "Progress Gap <= 15%",
                "source": "CAG Union Civil Audit Reports on MPLADS",
            })

        # 5. Evaluate CAG Pattern: CAG-OBS-003 (Ghost Asset / Missing Geotags)
        if financial_prog >= 95.0 and (missing_geotag == 1 or physical_prog < 10.0):
            total_penalty += 40.0
            audit_signals.append("GHOST_WORK_SIGNAL")
            violations.append({
                "rule_id": "CAG-OBS-003",
                "rule_name": "Completed Work Claim Without Physical Asset Evidence",
                "category": "GHOST_ASSET_RISK",
                "severity": "CRITICAL",
                "description": "Full payment disbursed but physical infrastructure unverified or missing stage geotagged photographs.",
                "observed_value": "Missing Asset Verification",
                "expected_value": "Stage-wise Geotagged Photographs and Asset Register Entry",
                "source": "CAG Compliance Audit on Scheme Asset Creation",
            })

        # 6. GeM SLA Check
        if proc_channel == "GEM" and delay_days > 30:
            total_penalty += 15.0
            violations.append({
                "rule_id": "GEM-GTC-001",
                "rule_name": "GeM Delivery & Liquidated Damages SLA",
                "category": "CONTRACT",
                "severity": "MEDIUM",
                "description": f"GeM procurement delivery overdue by {delay_days} days; requires Liquidated Damages (LD) assessment.",
                "observed_value": f"{delay_days} Days Delay",
                "expected_value": "On-time delivery within GeM Contract SLA",
                "source": "GeM General Terms and Conditions (GTC v4.0 Clause 14)",
            })

        # Compute Final 0-100 Compliance Score (100 = full compliance, 0 = severe non-compliance)
        compliance_score = max(0, min(100, int(100.0 - total_penalty)))

        critical_count = sum(1 for v in violations if v["severity"] == "CRITICAL")
        high_count = sum(1 for v in violations if v["severity"] == "HIGH")

        return {
            "project_id": project_dict.get("project_id", "UNKNOWN"),
            "compliance_score": compliance_score,
            "rule_violations": violations,
            "rule_violation_count": len(violations),
            "critical_violation_count": critical_count,
            "audit_signals": audit_signals if audit_signals else ["NO_CRITICAL_SIGNALS"],
            "is_fully_compliant": bool(len(violations) == 0),
        }
