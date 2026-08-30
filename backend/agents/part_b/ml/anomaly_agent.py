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
    """
    Isolation Forest Anomaly Agent.

    Evaluates multidimensional project features using scikit-learn IsolationForest.
    
    Feature Vector Dimensions (7):
    1. Log Cost: log(max(1, expenditure/sanctioned))
    2. Financial Progress %: (0-100)
    3. Physical Progress %: (0-100)
    4. Delay Days: Days past expected completion
    5. Extension Count: Approved deadline extensions
    6. Document Count: Registered document IDs
    7. Data Quality Flags Count: Number of active data flags
    """
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
        # Synthetic baseline distribution matching typical normal project parameters
        # Features: [log_cost, fin_prog, phy_prog, delay_days, ext_count, doc_count, data_quality_flags_count]
        synthetic_normal = np.column_stack([
            np.random.normal(14.5, 0.8, 200),   # Feature 1: Log cost (~2M INR baseline)
            np.random.uniform(10, 90, 200),    # Feature 2: Financial progress %
            np.random.uniform(10, 90, 200),    # Feature 3: Physical progress %
            np.random.exponential(15, 200),    # Feature 4: Delay days
            np.random.poisson(0.5, 200),       # Feature 5: Approved extension count
            np.random.poisson(4, 200),         # Feature 6: Document count
            np.random.poisson(0.3, 200),       # Feature 7: Data quality flags count
        ])
        # Initialize IsolationForest with 50 trees and 8% expected contamination rate
        self.model = IsolationForest(n_estimators=50, contamination=0.08, random_state=42)
        self.model.fit(synthetic_normal)

    def is_applicable(self, context: AgentContext) -> bool:
        """
        Checks applicability for digital twin.

        Args:
            context: Execution context.

        Returns:
            bool: True if digital twin is available.
        """
        twin = context.digital_twin
        return twin is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        """
        Extracts 7D feature vector, computes IsolationForest decision score, and maps to risk score.

        Args:
            context: Execution context containing project digital twin metrics.

        Returns:
            AgentEvidence: Calculated anomaly score, decision score evidence, and signals.
        """
        twin = context.digital_twin
        signals: list[AgentSignal] = []
        evidence: list[EvidenceDataPoint] = []

        # ── Construct Feature Vector ───────────────────────────────────────────
        # Extract features into normalized numerical representation
        cost = float(twin.total_expenditure or twin.sanctioned_amount or 100000)
        log_cost = math.log(max(1.0, cost))
        fin_prog = float(twin.financial_progress or 0.0)
        phy_prog = float(twin.physical_progress or 0.0)
        delay_days = float(twin.delay_days)
        ext_count = float(twin.approved_extensions or 0)
        doc_count = float(len(twin.document_ids or []))
        dq_flags = float(len(twin.data_quality_flags or []))

        # Assemble 1x7 feature array for inference
        feature_vector = np.array([[
            log_cost, fin_prog, phy_prog, delay_days, ext_count, doc_count, dq_flags
        ]])

        # ── Predict Anomaly Score ──────────────────────────────────────────────
        # decision_function yields negative values for anomalies, positive for normal instances
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
