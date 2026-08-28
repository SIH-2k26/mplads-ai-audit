"""
ml/ensemble.py
Hybrid Risk Ensemble Engine for MPLADS AI Audit.
Fuses Supervised ML, Unsupervised Anomaly Detection, Rule Engine, Contractor Risk, and Evidence Integrity into a unified calibrated risk score.
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


class HybridRiskEnsemble:
    def __init__(self, models_dir: str = "models", config_dir: str = "configs"):
        if not os.path.exists(os.path.join(models_dir, "best_overall_model.joblib")) and os.path.exists(os.path.join("..", models_dir, "best_overall_model.joblib")):
            models_dir = os.path.join("..", models_dir)
        if not os.path.exists(os.path.join(config_dir, "risk_weights.yaml")) and os.path.exists(os.path.join("..", config_dir, "risk_weights.yaml")):
            config_dir = os.path.join("..", config_dir)

        self.models_dir = models_dir
        self.config_dir = config_dir

        # Load configurations
        with open(os.path.join(config_dir, "risk_weights.yaml"), "r") as f:
            self.weights_config = yaml.safe_load(f).get("ensemble_weights", {})

        with open(os.path.join(config_dir, "risk_thresholds.yaml"), "r") as f:
            self.thresholds_config = yaml.safe_load(f).get("risk_level_thresholds", {})

        with open(os.path.join(models_dir, "feature_list.json"), "r") as f:
            raw_feat = json.load(f)
            self.feature_cols = raw_feat.get("features", raw_feat) if isinstance(raw_feat, dict) else raw_feat

        # Load models
        self.best_model = joblib.load(os.path.join(models_dir, "best_overall_model.joblib"))
        self.iso_forest = joblib.load(os.path.join(models_dir, "isolation_forest.joblib"))
        self.scaler = joblib.load(os.path.join(models_dir, "robust_scaler.joblib"))

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
                self.domain_models[dom] = joblib.load(path)

        # Initialize Regulatory Compliance Engine
        try:
            from regulatory.compliance_engine import RegulatoryComplianceEngine
            self.compliance_engine = RegulatoryComplianceEngine()
        except Exception:
            self.compliance_engine = None

    def analyze_project(self, project_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes raw project features, calculates derived signals, runs rules + ML + anomaly detection,
        and outputs a unified explainable risk score and audit decision.
        """
        sanctioned = float(project_dict.get("sanctioned_amount", 1000000.0))
        actual_exp = float(project_dict.get("actual_expenditure", 500000.0))
        physical_prog = float(project_dict.get("physical_progress", 50.0))
        financial_prog = float(project_dict.get("financial_progress", (actual_exp / max(1.0, sanctioned)) * 100.0))
        single_bid = int(project_dict.get("single_bid_flag", 0))
        bid_count = int(project_dict.get("bid_count", 4))
        missing_mb = int(project_dict.get("missing_mb_flag", 0))
        missing_uc = int(project_dict.get("missing_uc_flag", 0))
        delay_days = int(project_dict.get("delay_days", 0))
        cont_irr_rate = float(project_dict.get("contractor_past_irregularity_rate", 0.05))

        # Vector of features with realistic domain baseline defaults
        DEFAULT_BASELINES = {
            "planned_duration_days": 365.0,
            "actual_duration_days": 365.0,
            "required_document_count": 5.0,
            "available_document_count": 5.0,
            "district_population": 1500000.0,
            "population_density": 650.0,
            "literacy_rate": 78.0,
            "poverty_rate": 20.0,
            "infrastructure_gap_index": 0.45,
            "geo_cluster_density": 0.45,
            "contractor_district_distance_km": 12.5,
            "sanction_to_tender_days": 18.0,
            "tender_to_work_order_days": 14.0,
            "year_end_spending_ratio": 0.22,
            "contractor_total_projects": 12.0,
            "contractor_win_rate": 0.35,
            "contractor_market_share": 0.08,
            "agency_workload_ratio": 1.0,
            "agency_completion_rate": 85.0,
        }
        feat_dict = {col: DEFAULT_BASELINES.get(col, 0.0) for col in self.feature_cols}
        for k, v in project_dict.items():
            if k in feat_dict:
                try:
                    feat_dict[k] = float(v)
                except Exception:
                    pass

        # Derived overrides
        feat_dict["sanction_amount"] = sanctioned
        feat_dict["expenditure_amount"] = actual_exp
        feat_dict["cost_to_sanction_ratio"] = round(actual_exp / max(1.0, sanctioned), 4)
        feat_dict["financial_physical_gap"] = round(financial_prog - physical_prog, 2)
        feat_dict["single_bid_flag"] = single_bid
        feat_dict["bid_count"] = bid_count
        feat_dict["physical_progress"] = physical_prog
        feat_dict["financial_progress"] = financial_prog
        feat_dict["delay_days"] = delay_days
        feat_dict["missing_mb_flag"] = missing_mb
        feat_dict["missing_uc_flag"] = missing_uc
        feat_dict["contractor_past_irregularity_rate"] = cont_irr_rate

        feat_df = pd.DataFrame([feat_dict])[self.feature_cols]
        feat_vector = self.scaler.transform(feat_df) if self.scaler is not None else feat_df.values

        # 2. Supervised ML Probability
        ml_prob = float(self.best_model.predict_proba(feat_vector)[0, 1])

        # 3. Unsupervised Anomaly Score (Isolation Forest gives -1 to 1; map to 0 to 1)
        raw_iso = float(self.iso_forest.decision_function(feat_vector)[0])
        # lower raw_iso means more anomalous
        anomaly_score = max(0.0, min(1.0, (0.2 - raw_iso) / 0.4))

        # 4. Rule Engine Compliance Score & Red Flags
        rule_penalties = 0.0
        red_flags = []
        top_risk_factors = []

        if feat_dict["financial_physical_gap"] > 30.0:
            rule_penalties += 35.0
            red_flags.append(f"Severe Progress Desynchronization: Financial progress ({financial_prog}%) leads physical progress ({physical_prog}%) by {feat_dict['financial_physical_gap']}%.")
            top_risk_factors.append({"feature": "financial_physical_gap", "impact": 0.35, "direction": "increases risk"})

        if feat_dict["cost_to_sanction_ratio"] > 1.25:
            rule_penalties += 30.0
            red_flags.append(f"Significant Cost Overrun: Expenditure exceeds approved sanction by {round((feat_dict['cost_to_sanction_ratio'] - 1.0) * 100, 1)}%.")
            top_risk_factors.append({"feature": "cost_to_sanction_ratio", "impact": 0.30, "direction": "increases risk"})

        if single_bid == 1:
            rule_penalties += 20.0
            red_flags.append("Procurement Integrity Alert: Project executed via Single-Bid tender with zero competitive price discovery.")
            top_risk_factors.append({"feature": "single_bid_flag", "impact": 0.20, "direction": "increases risk"})

        if missing_mb == 1:
            rule_penalties += 25.0
            red_flags.append("Critical Documentation Gap: Missing official Measurement Book (MB) record for claimed milestones.")
            top_risk_factors.append({"feature": "missing_mb_flag", "impact": 0.25, "direction": "increases risk"})

        if cont_irr_rate > 0.20:
            rule_penalties += 20.0
            red_flags.append(f"High-Risk Contractor History: Assigned contractor has a {round(cont_irr_rate * 100, 1)}% past audit irregularity rate.")
            top_risk_factors.append({"feature": "contractor_past_irregularity_rate", "impact": 0.20, "direction": "increases risk"})

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

        # 7. Weighted Ensemble Fusion
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

        # Map to Risk Level
        if overall_risk_score >= 85.0:
            risk_level = "CRITICAL"
        elif overall_risk_score >= 65.0:
            risk_level = "HIGH"
        elif overall_risk_score >= 35.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Domain category scores (0-100)
        category_scores = {
            "cost": round(min(100.0, max(10.0, (feat_dict["cost_to_sanction_ratio"] - 0.8) * 120.0)), 1),
            "financial": round(min(100.0, max(10.0, ml_prob * 90.0 + (financial_prog / 100.0) * 10.0)), 1),
            "procurement": round(85.0 if single_bid else 22.0, 1),
            "execution": round(min(100.0, max(10.0, feat_dict["financial_physical_gap"] * 1.5 + 20.0)), 1),
            "delay": round(min(100.0, max(10.0, (delay_days / 180.0) * 80.0 + 15.0)), 1),
            "contractor": round(min(100.0, max(10.0, cont_irr_rate * 180.0 + 15.0)), 1),
            "compliance": round(rule_score * 100.0, 1),
        }

        # Anomaly types
        anomaly_types = []
        if category_scores["cost"] > 65.0:
            anomaly_types.append("COST")
        if category_scores["procurement"] > 65.0:
            anomaly_types.append("PROCUREMENT")
        if category_scores["execution"] > 65.0:
            anomaly_types.append("PROGRESS")
        if category_scores["contractor"] > 65.0:
            anomaly_types.append("CONTRACTOR")
        if not anomaly_types and risk_level in ["LOW", "MEDIUM"]:
            anomaly_types.append("NONE")

        # Top Recommended Action
        if risk_level == "CRITICAL":
            recommended_action = "Initiate immediate on-site technical audit and withhold subsequent fund disbursements."
        elif risk_level == "HIGH":
            recommended_action = "Schedule independent physical verification by District Technical Committee within 14 days."
        elif risk_level == "MEDIUM":
            recommended_action = "Request updated Measurement Book and stage-wise geotagged progress documentation."
        else:
            recommended_action = "Standard quarterly monitoring; proceed with scheduled disbursement."

        return {
            "project_id": project_dict.get("project_id", "MPLADS-SIM-001"),
            "risk_score": overall_risk_score,
            "risk_level": risk_level,
            "fraud_probability": round(ml_prob, 4),
            "anomaly_probability": round(anomaly_score, 4),
            "compliance_score": comp_res.get("compliance_score", int(max(0, 100.0 - rule_penalties))),
            "category_scores": category_scores,
            "anomaly_types": anomaly_types,
            "red_flags": red_flags,
            "rule_violations": comp_res.get("rule_violations", []),
            "audit_signals": comp_res.get("audit_signals", []),
            "top_risk_factors": top_risk_factors if top_risk_factors else [{"feature": "normal_variance", "impact": 0.05, "direction": "within bounds"}],
            "recommended_action": recommended_action,
            "model_version": "v1.0-ensemble",
            "rule_version": "v2023.4-esakshi-doe",
            "evaluated_at": pd.Timestamp.now().isoformat(),
        }
