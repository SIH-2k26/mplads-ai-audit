"""
ml/ensemble.py
Hybrid Risk Ensemble Engine for Sanchay AI.
Fuses Supervised ML, Unsupervised Anomaly Detection, Rule Engine, Contractor Risk, and Evidence Integrity into a unified calibrated risk score.
Loads weights and thresholds dynamically from versioned risk policy configs/risk_policy_v1.yaml.
"""
from __future__ import annotations
import json
import os
import sys
from typing import Any, Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
import yaml

from ml.features.builder import FeatureBuilder
from ml.features.schema import CANONICAL_FEATURES


class HybridRiskEnsemble:
    def __init__(self, models_dir: str = "models", config_dir: str = "configs"):
        if not os.path.exists(os.path.join(models_dir, "best_overall_model.joblib")) and os.path.exists(os.path.join("..", models_dir, "best_overall_model.joblib")):
            models_dir = os.path.join("..", models_dir)
        if not os.path.exists(os.path.join(config_dir, "risk_policy_v1.yaml")) and os.path.exists(os.path.join("..", config_dir, "risk_policy_v1.yaml")):
            config_dir = os.path.join("..", config_dir)

        self.models_dir = models_dir
        self.config_dir = config_dir

        # Load Policy Configuration (Primary: risk_policy_v1.yaml, Fallback: risk_weights.yaml)
        policy_path = os.path.join(config_dir, "risk_policy_v1.yaml")
        if os.path.exists(policy_path):
            with open(policy_path, "r") as f:
                policy = yaml.safe_load(f)
                comp = policy.get("components", {})
                self.weights_config = {
                    "supervised_ml_probability": comp.get("supervised_ml_probability", {}).get("weight", 0.35),
                    "rule_engine_compliance": comp.get("rule_engine_compliance", {}).get("weight", 0.25),
                    "unsupervised_anomaly_score": comp.get("unsupervised_anomaly_score", {}).get("weight", 0.20),
                    "contractor_risk_factor": comp.get("contractor_risk_factor", {}).get("weight", 0.10),
                    "evidence_data_integrity": comp.get("evidence_data_integrity", {}).get("weight", 0.10),
                }
                self.thresholds_config = policy.get("thresholds", {})
                self.policy_version = policy.get("version", "1.0.0")
        else:
            w_path = os.path.join(config_dir, "risk_weights.yaml")
            with open(w_path, "r") as f:
                self.weights_config = yaml.safe_load(f).get("ensemble_weights", {})
            self.thresholds_config = {}
            self.policy_version = "legacy"

        # Load Feature Registry
        feat_path = os.path.join(models_dir, "feature_list.json")
        if os.path.exists(feat_path):
            with open(feat_path, "r") as f:
                raw_feat = json.load(f)
                self.feature_cols = raw_feat.get("features", raw_feat) if isinstance(raw_feat, dict) else raw_feat
        else:
            self.feature_cols = CANONICAL_FEATURES

        # Initialize Canonical Feature Builder
        self.builder = FeatureBuilder(feature_list=self.feature_cols)

        # Load models
        best_path = os.path.join(models_dir, "best_overall_model.joblib")
        self.best_model = joblib.load(best_path) if os.path.exists(best_path) else None

        iso_path = os.path.join(models_dir, "isolation_forest.joblib")
        self.iso_forest = joblib.load(iso_path) if os.path.exists(iso_path) else None

        scaler_path = os.path.join(models_dir, "robust_scaler.joblib")
        self.scaler = joblib.load(scaler_path) if os.path.exists(scaler_path) else None

        # Load domain models
        self.domain_models = {}
        for dom, fname in [
            ("cost", "cost_risk_model.joblib"),
            ("financial", "financial_risk_model.joblib"),
            ("procurement", "procurement_risk_model.joblib"),
            ("progress", "progress_risk_model.joblib"),
            ("contractor", "contractor_risk_model.joblib"),
            ("ghost_work", "ghost_work_risk_model.joblib"),
        ]:
            path = os.path.join(models_dir, fname)
            if os.path.exists(path):
                try:
                    self.domain_models[dom] = joblib.load(path)
                except Exception:
                    pass

        # Initialize Regulatory Compliance Engine
        try:
            from regulatory.compliance_engine import RegulatoryComplianceEngine
            self.compliance_engine = RegulatoryComplianceEngine()
        except Exception:
            self.compliance_engine = None

    def analyze_project(self, project_dict: Dict[str, Any], doc_dict: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Takes raw project features, extracts canonical signals via FeatureBuilder, runs rules + ML + anomaly detection,
        and outputs a unified explainable risk score and audit findings.
        """
        sanctioned = float(project_dict.get("sanctioned_amount", project_dict.get("sanction_amount", 1000000.0)))
        actual_exp = float(project_dict.get("actual_expenditure", project_dict.get("actual_cost", 500000.0)))
        physical_prog = float(project_dict.get("physical_progress", 50.0))
        financial_prog = float(project_dict.get("financial_progress", (actual_exp / max(1.0, sanctioned)) * 100.0))
        single_bid = int(project_dict.get("single_bid_flag", 1 if int(project_dict.get("bid_count", 4)) == 1 else 0))
        bid_count = int(project_dict.get("bid_count", 4))
        missing_mb = int(project_dict.get("missing_mb_flag", 0))
        missing_uc = int(project_dict.get("missing_uc_flag", 0))
        cont_irr_rate = float(project_dict.get("contractor_past_irregularity_rate", 0.05))

        # Extract deterministic canonical features via FeatureBuilder
        feat_dict = self.builder.extract_features_dict(project_dict, doc_dict)
        feat_df = pd.DataFrame([feat_dict])[self.feature_cols]
        feat_vector = self.scaler.transform(feat_df) if self.scaler is not None else feat_df.values

        # 2. Supervised ML Probability
        if self.best_model is not None:
            try:
                ml_prob = float(self.best_model.predict_proba(feat_vector)[0, 1])
            except Exception:
                ml_prob = 0.20
        else:
            ml_prob = 0.20

        # 3. Unsupervised Anomaly Score (Isolation Forest mapped to 0-1)
        if self.iso_forest is not None:
            try:
                raw_iso = float(self.iso_forest.decision_function(feat_vector)[0])
                anomaly_score = max(0.0, min(1.0, (0.2 - raw_iso) / 0.4))
            except Exception:
                anomaly_score = 0.15
        else:
            anomaly_score = 0.15

        # 4. Rule Engine Compliance Score & Red Flags
        rule_penalties = 0.0
        red_flags = []
        top_risk_factors = []

        if feat_dict["financial_physical_gap"] > 30.0:
            rule_penalties += 35.0
            red_flags.append(f"Severe Progress Desynchronization: Financial progress ({financial_prog:.1f}%) leads physical progress ({physical_prog:.1f}%) by {feat_dict['financial_physical_gap']:.1f}%.")
            top_risk_factors.append({
                "feature": "financial_physical_gap",
                "impact": 0.35,
                "direction": "increases_risk",
                "human_explanation": "Financial expenditure leads verified physical progress by >30%."
            })

        if feat_dict["cost_to_sanction_ratio"] > 1.25:
            rule_penalties += 30.0
            red_flags.append(f"Significant Cost Overrun: Expenditure exceeds approved sanction by {round((feat_dict['cost_to_sanction_ratio'] - 1.0) * 100, 1)}%.")
            top_risk_factors.append({
                "feature": "cost_to_sanction_ratio",
                "impact": 0.30,
                "direction": "increases_risk",
                "human_explanation": "Actual expenditure exceeds approved sanction ceiling."
            })

        if single_bid == 1:
            rule_penalties += 20.0
            red_flags.append("Procurement Integrity Alert: Project executed via Single-Bid tender with zero competitive price discovery.")
            top_risk_factors.append({
                "feature": "single_bid_flag",
                "impact": 0.20,
                "direction": "increases_risk",
                "human_explanation": "Contract awarded on a single-bid tender without required competitive spread."
            })

        if missing_mb == 1:
            rule_penalties += 25.0
            red_flags.append("Critical Documentation Gap: Missing official Measurement Book (MB) record for claimed milestones.")
            top_risk_factors.append({
                "feature": "missing_mb_flag",
                "impact": 0.25,
                "direction": "increases_risk",
                "human_explanation": "Mandatory physical Measurement Book (MB) record is missing from file."
            })

        if cont_irr_rate > 0.20:
            rule_penalties += 20.0
            red_flags.append(f"High-Risk Contractor History: Assigned contractor has a {round(cont_irr_rate * 100, 1)}% past audit irregularity rate.")
            top_risk_factors.append({
                "feature": "contractor_past_irregularity_rate",
                "impact": 0.20,
                "direction": "increases_risk",
                "human_explanation": "Assigned contractor has history of repeat audit non-compliance."
            })

        rule_score = min(100.0, rule_penalties) / 100.0

        # Run Regulatory Compliance Evaluation
        comp_res = self.compliance_engine.evaluate_project_compliance(project_dict) if self.compliance_engine else {
            "compliance_score": int(max(0, 100.0 - rule_penalties)),
            "rule_violations": [],
            "audit_signals": ["NO_CRITICAL_SIGNALS"],
        }

        # 5. Contractor Risk Score
        contractor_score = min(1.0, cont_irr_rate * 2.5)

        # 6. Evidence & Data Quality Score
        evidence_score = (missing_mb * 0.5) + (missing_uc * 0.3) + (1.0 if feat_dict.get("missing_geotag_flag", 0) == 1 else 0.0) * 0.2

        # 7. Weighted Ensemble Fusion from Versioned Policy
        w_ml = self.weights_config.get("supervised_ml_probability", 0.35)
        w_rule = self.weights_config.get("rule_engine_compliance", 0.25)
        w_anom = self.weights_config.get("unsupervised_anomaly_score", 0.20)
        w_cont = self.weights_config.get("contractor_risk_factor", 0.10)
        w_evid = self.weights_config.get("evidence_data_integrity", 0.10)

        base_composite = (w_ml * ml_prob) + (w_rule * rule_score) + (w_anom * anomaly_score) + (w_cont * contractor_score) + (w_evid * evidence_score)
        
        # Compounded risk escalation when multiple high-severity red flags co-occur
        severity_multiplier = 1.0
        if len(red_flags) >= 3 or rule_score >= 0.8:
            severity_multiplier = 1.35
        elif len(red_flags) >= 2 or rule_score >= 0.5:
            severity_multiplier = 1.20

        composite_risk = min(1.0, base_composite * severity_multiplier)
        overall_risk_score = round(max(5.0, min(99.0, composite_risk * 100.0)), 1)

        if overall_risk_score >= 85.0:
            risk_level = "CRITICAL"
            severity_label = "CRITICAL_RISK"
            audit_verdict = "REQUIRES_VIGILANCE_VERIFICATION"
            recommended_action = "Withhold subsequent disbursement, summon implementing agency, and refer to State Vigilance."
            anomaly_types = ["MILESTONE_DIVERGENCE", "DOCUMENTATION_DEFICIT", "HIGH_RISK_CONTRACTOR"]
        elif overall_risk_score >= 65.0:
            risk_level = "HIGH"
            severity_label = "FIELD_INSPECTION_REQUIRED"
            audit_verdict = "ON_SITE_VERIFICATION_RECOMMENDED"
            recommended_action = "Mandatory on-site physical inspection by District Technical Squad and Measurement Book verification."
            anomaly_types = ["COST_OVERRUN", "SINGLE_BID_DEPENDENCY"]
        elif overall_risk_score >= 40.0:
            risk_level = "MEDIUM"
            severity_label = "DESK_AUDIT_RECOMMENDED"
            audit_verdict = "DESK_REVIEW_RECOMMENDED"
            recommended_action = "Desk review of milestone invoices and procurement documentation before next tranche release."
            anomaly_types = ["TIMELINE_SLIPPAGE"]
        else:
            risk_level = "LOW"
            severity_label = "STANDARD_MONITORING"
            audit_verdict = "ROUTINE_MONITORING"
            recommended_action = "Standard quarterly monitoring; proceed with scheduled milestone disbursement."
            anomaly_types = ["NONE"]

        category_scores = {
            "cost_risk": round(min(100.0, feat_dict["cost_to_sanction_ratio"] * 50.0), 1),
            "financial_risk": round(min(100.0, max(0.0, feat_dict["financial_physical_gap"] * 2.0)), 1),
            "procurement_risk": round(85.0 if single_bid == 1 else 20.0, 1),
            "progress_risk": round(min(100.0, float(feat_dict.get("delay_days", 0)) * 0.5), 1),
            "contractor_risk": round(min(100.0, cont_irr_rate * 250.0), 1),
            "documentation_risk": round(evidence_score * 100.0, 1),
        }

        return {
            "project_id": str(project_dict.get("project_id", "UNKNOWN")),
            "risk_score": overall_risk_score,
            "risk_level": risk_level,
            "severity_label": severity_label,
            "audit_verdict": audit_verdict,
            "recommended_action": recommended_action,
            "category_scores": category_scores,
            "supervised_ml_probability": round(ml_prob, 4),
            "unsupervised_anomaly_score": round(anomaly_score, 4),
            "rule_compliance_score": round(rule_score, 4),
            "contractor_risk_factor": round(contractor_score, 4),
            "evidence_data_integrity": round(evidence_score, 4),
            "top_risk_factors": top_risk_factors,
            "red_flags": red_flags,
            "anomaly_types": anomaly_types,
            "compliance_score": comp_res.get("compliance_score", int(max(0, 100.0 - rule_penalties))),
            "policy_version": self.policy_version,
            "features": feat_dict,
        }
