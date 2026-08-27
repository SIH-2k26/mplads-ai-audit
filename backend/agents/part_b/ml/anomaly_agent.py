"""
agents/part_b/ml/anomaly_agent.py
Isolation Forest Anomaly Agent — Part B ML.
Runs Isolation Forest scoring on multidimensional project feature vectors.
"""
from __future__ import annotations
import math
import numpy as np
from sklearn.ensemble import IsolationForest

from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal, EvidenceDataPoint
from models.enums import AgentStatus, Severity


class AnomalyAgent(BaseAgent):
    agent_id = "anomaly_agent"
    agent_name = "Isolation Forest Anomaly Agent"
    version = "1.0.0"

    def __init__(self):
        super().__init__()
        # Pre-fit a reference baseline model on background baseline distribution
        self._init_baseline_model()

    def _init_baseline_model(self):
        """Fit IsolationForest on a representative baseline dataset of normal project feature vectors."""
        np.random.seed(42)
        # Features: [log_cost, fin_prog, phy_prog, delay_days, ext_count, doc_count, data_quality_flags_count]
        synthetic_normal = np.column_stack([
            np.random.normal(14.5, 0.8, 200),   # log cost (~2M)
            np.random.uniform(10, 90, 200),    # financial progress %
            np.random.uniform(10, 90, 200),    # physical progress %
            np.random.exponential(15, 200),    # delay days
            np.random.poisson(0.5, 200),       # extension count
            np.random.poisson(4, 200),         # doc count
            np.random.poisson(0.3, 200),       # data quality flags
        ])
        self.model = IsolationForest(n_estimators=50, contamination=0.08, random_state=42)
        self.model.fit(synthetic_normal)

    def is_applicable(self, context: AgentContext) -> bool:
        twin = context.digital_twin
        return twin is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []

        # ── Construct Feature Vector ───────────────────────────────────────────
        cost = float(twin.total_expenditure or twin.sanctioned_amount or 100000)
        log_cost = math.log(max(1.0, cost))
        fin_prog = float(twin.financial_progress or 0.0)
        phy_prog = float(twin.physical_progress or 0.0)
        delay_days = float(twin.delay_days)
        ext_count = float(twin.approved_extensions or 0)
        doc_count = float(len(twin.document_ids or []))
        dq_flags = float(len(twin.data_quality_flags or []))

        feature_vector = np.array([[
            log_cost, fin_prog, phy_prog, delay_days, ext_count, doc_count, dq_flags
        ]])

        # ── Predict Anomaly Score ──────────────────────────────────────────────
        # decision_function gives negative score for outliers, positive for inliers
        raw_score = self.model.decision_function(feature_vector)[0]
        prediction = self.model.predict(feature_vector)[0]  # -1 for anomaly, 1 for normal

        # Map raw decision score to 0–100 risk score scale (raw_score range ~ -0.3 to +0.3)
        # Lower decision_function -> higher anomaly risk
        risk_score = max(0.0, min(100.0, (0.25 - raw_score) * 160.0))

        evidence.append(EvidenceDataPoint(
            label="Isolation Forest Decision Score",
            value=round(float(raw_score), 4),
            source="isolation_forest_model"
        ))
        evidence.append(EvidenceDataPoint(
            label="Multivariate Feature Dimension",
            value=feature_vector.shape[1],
            source="feature_vector_builder"
        ))
        evidence.append(EvidenceDataPoint(
            label="Computed Anomaly Risk Score",
            value=round(risk_score, 2),
            source="isolation_forest_model"
        ))

        # ── Signal Generation ──────────────────────────────────────────────────
        if prediction == -1 or risk_score >= 65.0:
            if risk_score >= 80.0:
                signals.append(AgentSignal(
                    signal_type="MULTIVARIATE_ANOMALY_CRITICAL",
                    description=f"Isolation Forest identified critical multidimensional feature anomaly (Score: {raw_score:.3f}, Risk: {risk_score:.1f})",
                    severity=Severity.CRITICAL,
                    value=round(float(raw_score), 3),
                    unit="decision_score",
                    confidence=0.91,
                ))
            else:
                signals.append(AgentSignal(
                    signal_type="MULTIVARIATE_ANOMALY_DETECTED",
                    description=f"Isolation Forest detected anomalous project parameter combination (Score: {raw_score:.3f}, Risk: {risk_score:.1f})",
                    severity=Severity.HIGH,
                    value=round(float(raw_score), 3),
                    unit="decision_score",
                    confidence=0.85,
                ))

        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            agent_version=self.version,
            status=AgentStatus.COMPLETED,
            score=risk_score,
            severity=self._determine_severity(risk_score),
            confidence=0.88,
            applicability=1.0,
            signals=signals,
            evidence=evidence,
            data_sources=["digital_twin", "isolation_forest_model"],
        )
