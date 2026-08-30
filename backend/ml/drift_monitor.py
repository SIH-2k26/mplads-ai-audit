"""
ml/drift_monitor.py
ML Model Drift Monitor for MPLADS Guardian.

Detects:
1. Feature drift: Population Stability Index (PSI) for each feature
2. Prediction drift: KS-test on prediction score distributions  
3. Accuracy drift: when labeled feedback data is available

Status flags:
- GREEN: No drift detected (PSI < 0.1, KS p-value > 0.05)
- YELLOW: Moderate drift (0.1 <= PSI < 0.25)  
- RED: Severe drift (PSI >= 0.25 or p-value <= 0.01) — triggers retraining alert
"""
from __future__ import annotations
import numpy as np
import pandas as pd
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

from app.utils.logging import get_logger

logger = get_logger("drift_monitor")


class DriftStatus(str, Enum):
    GREEN = "GREEN"    # No significant drift
    YELLOW = "YELLOW"  # Moderate drift — monitor closely
    RED = "RED"        # Severe drift — retrain recommended


@dataclass
class FeatureDriftResult:
    feature_name: str
    psi_score: float
    status: DriftStatus
    reference_mean: float
    current_mean: float
    shift_pct: float  # % change in mean


@dataclass
class PredictionDriftResult:
    ks_statistic: float
    ks_p_value: float
    status: DriftStatus
    reference_mean_score: float
    current_mean_score: float
    sample_size: int


@dataclass
class DriftReport:
    """Consolidated drift report for a single monitoring window."""
    report_id: str
    created_at: str
    overall_status: DriftStatus
    feature_drift: List[FeatureDriftResult]
    prediction_drift: Optional[PredictionDriftResult]
    drifted_features: List[str]
    recommendation: str
    metadata: Dict[str, Any] = field(default_factory=dict)


class DriftMonitor:
    """
    Monitors ML model drift using statistical tests.
    
    PSI (Population Stability Index):
        < 0.1    → No significant change (GREEN)
        0.1-0.25 → Moderate change (YELLOW)
        >= 0.25  → Significant change (RED) — retrain
        
    KS Test (Kolmogorov-Smirnov):
        p-value > 0.05  → Distributions similar (GREEN)
        0.01-0.05       → Borderline (YELLOW)
        <= 0.01         → Significantly different (RED)
    """

    def __init__(
        self,
        psi_green_threshold: float = 0.1,
        psi_red_threshold: float = 0.25,
        ks_green_threshold: float = 0.05,
        ks_red_threshold: float = 0.01,
        n_bins: int = 10,
    ):
        self.psi_green = psi_green_threshold
        self.psi_red = psi_red_threshold
        self.ks_green = ks_green_threshold
        self.ks_red = ks_red_threshold
        self.n_bins = n_bins

    def compute_psi(
        self,
        reference: np.ndarray,
        current: np.ndarray,
    ) -> float:
        """
        Compute Population Stability Index between reference and current distributions.
        
        Args:
            reference: Reference (training) distribution values.
            current: Current (production) distribution values.
            
        Returns:
            PSI score (0 = identical distributions).
        """
        if len(reference) == 0 or len(current) == 0:
            return 0.0

        # Clip to avoid log(0)
        eps = 1e-6

        # Use reference distribution quantiles as bin edges
        breakpoints = np.unique(np.nanpercentile(reference, np.linspace(0, 100, self.n_bins + 1)))

        # Count observations per bin
        ref_counts, _ = np.histogram(reference, bins=breakpoints)
        cur_counts, _ = np.histogram(current, bins=breakpoints)

        # Convert to proportions
        ref_pct = ref_counts / (len(reference) + eps)
        cur_pct = cur_counts / (len(current) + eps)

        # Clip to avoid log(0)
        ref_pct = np.clip(ref_pct, eps, None)
        cur_pct = np.clip(cur_pct, eps, None)

        # PSI formula
        psi = np.sum((cur_pct - ref_pct) * np.log(cur_pct / ref_pct))
        return float(np.clip(psi, 0.0, 10.0))

    def _psi_status(self, psi: float) -> DriftStatus:
        if psi < self.psi_green:
            return DriftStatus.GREEN
        elif psi < self.psi_red:
            return DriftStatus.YELLOW
        else:
            return DriftStatus.RED

    def _ks_status(self, p_value: float) -> DriftStatus:
        if p_value > self.ks_green:
            return DriftStatus.GREEN
        elif p_value > self.ks_red:
            return DriftStatus.YELLOW
        else:
            return DriftStatus.RED

    def detect_feature_drift(
        self,
        reference_df: pd.DataFrame,
        current_df: pd.DataFrame,
        feature_names: Optional[List[str]] = None,
    ) -> List[FeatureDriftResult]:
        """
        Detects drift for each feature using PSI.
        
        Args:
            reference_df: Reference (training) feature DataFrame.
            current_df: Current (production) feature DataFrame.
            feature_names: Optional subset of features to check.
            
        Returns:
            List of FeatureDriftResult per feature.
        """
        features = feature_names or list(reference_df.columns)
        results = []

        for feat in features:
            if feat not in reference_df.columns or feat not in current_df.columns:
                logger.warning("drift_monitor.missing_feature", feature=feat)
                continue

            ref_vals = reference_df[feat].dropna().values
            cur_vals = current_df[feat].dropna().values

            if len(ref_vals) == 0 or len(cur_vals) == 0:
                continue

            psi = self.compute_psi(ref_vals, cur_vals)
            status = self._psi_status(psi)
            ref_mean = float(np.mean(ref_vals))
            cur_mean = float(np.mean(cur_vals))
            shift_pct = ((cur_mean - ref_mean) / (abs(ref_mean) + 1e-6)) * 100.0

            results.append(FeatureDriftResult(
                feature_name=feat,
                psi_score=round(psi, 4),
                status=status,
                reference_mean=round(ref_mean, 4),
                current_mean=round(cur_mean, 4),
                shift_pct=round(shift_pct, 2),
            ))

        return sorted(results, key=lambda r: r.psi_score, reverse=True)

    def detect_prediction_drift(
        self,
        reference_predictions: np.ndarray,
        current_predictions: np.ndarray,
    ) -> PredictionDriftResult:
        """
        Detects drift in model prediction distributions using KS test.
        
        Args:
            reference_predictions: Reference prediction scores (probabilities [0,1]).
            current_predictions: Current production prediction scores.
            
        Returns:
            PredictionDriftResult with KS statistic and status.
        """
        from scipy import stats
        
        if len(reference_predictions) == 0 or len(current_predictions) == 0:
            return PredictionDriftResult(
                ks_statistic=0.0,
                ks_p_value=1.0,
                status=DriftStatus.GREEN,
                reference_mean_score=0.0,
                current_mean_score=0.0,
                sample_size=0,
            )

        ks_stat, p_value = stats.ks_2samp(reference_predictions, current_predictions)
        status = self._ks_status(p_value)

        return PredictionDriftResult(
            ks_statistic=round(float(ks_stat), 4),
            ks_p_value=round(float(p_value), 6),
            status=status,
            reference_mean_score=round(float(np.mean(reference_predictions)), 4),
            current_mean_score=round(float(np.mean(current_predictions)), 4),
            sample_size=len(current_predictions),
        )

    def generate_drift_report(
        self,
        reference_df: pd.DataFrame,
        current_df: pd.DataFrame,
        reference_predictions: Optional[np.ndarray] = None,
        current_predictions: Optional[np.ndarray] = None,
        feature_names: Optional[List[str]] = None,
        report_id: Optional[str] = None,
    ) -> DriftReport:
        """
        Generates a consolidated drift report.
        
        Args:
            reference_df: Training feature data (baseline).
            current_df: Recent production feature data.
            reference_predictions: Optional baseline prediction scores.
            current_predictions: Optional recent production scores.
            feature_names: Optional subset of features to monitor.
            report_id: Optional identifier for this report.
            
        Returns:
            DriftReport with overall status, feature-level and prediction-level drift.
        """
        import uuid
        rid = report_id or str(uuid.uuid4())

        feature_results = self.detect_feature_drift(reference_df, current_df, feature_names)

        prediction_result = None
        if reference_predictions is not None and current_predictions is not None:
            prediction_result = self.detect_prediction_drift(
                reference_predictions, current_predictions
            )

        # Determine overall status
        statuses = [r.status for r in feature_results]
        if prediction_result:
            statuses.append(prediction_result.status)

        if DriftStatus.RED in statuses:
            overall = DriftStatus.RED
            recommendation = (
                "SEVERE DRIFT DETECTED: Immediate model retraining recommended. "
                f"{len([s for s in statuses if s == DriftStatus.RED])} RED indicators. "
                "Check data pipeline for anomalies before retraining."
            )
        elif DriftStatus.YELLOW in statuses:
            overall = DriftStatus.YELLOW
            recommendation = (
                "MODERATE DRIFT DETECTED: Monitor closely. "
                f"{len([s for s in statuses if s == DriftStatus.YELLOW])} YELLOW indicators. "
                "Consider retraining if drift persists for 2+ monitoring windows."
            )
        else:
            overall = DriftStatus.GREEN
            recommendation = "No significant drift detected. Model performance is stable."

        drifted_features = [
            r.feature_name for r in feature_results
            if r.status in (DriftStatus.YELLOW, DriftStatus.RED)
        ]

        logger.info(
            "drift_monitor.report_generated",
            report_id=rid,
            overall_status=overall,
            drifted_features=len(drifted_features),
        )

        return DriftReport(
            report_id=rid,
            created_at=datetime.now(timezone.utc).isoformat(),
            overall_status=overall,
            feature_drift=feature_results,
            prediction_drift=prediction_result,
            drifted_features=drifted_features,
            recommendation=recommendation,
            metadata={
                "reference_samples": len(reference_df),
                "current_samples": len(current_df),
                "features_checked": len(feature_results),
            },
        )
