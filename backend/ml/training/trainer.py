"""
ml/training/trainer.py
Production-grade ML Training Pipeline for MPLADS Guardian risk & anomaly models.
Trains IsolationForest, XGBoost/RandomForest classifiers, and GradientBoosting regressors with probability calibration.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import Any, Dict, Optional, Tuple
import joblib
import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import GradientBoostingRegressor, IsolationForest, RandomForestClassifier
from sklearn.model_selection import train_test_split

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

from app.utils.logging import get_logger
from ml.datasets.synthetic_generator import SyntheticDatasetGenerator
from ml.features.feature_engineer import FEATURE_NAMES

logger = get_logger("ml_trainer")


@dataclass
class TrainingArtifact:
    model_name: str
    model_type: str
    model_object: Any
    calibrated_model: Optional[Any]
    feature_names: list[str]
    metrics: Dict[str, float]
    dataset_size: int
    training_timestamp: str


class ModelTrainer:
    """
    Trains and calibrates ML models for anomaly detection, delay classification, and cost intelligence.
    """

    def __init__(self, random_state: int = 42):
        self.random_state = random_state

    def train_anomaly_model(self, X: pd.DataFrame) -> TrainingArtifact:
        """
        Trains IsolationForest for unsupervised operational anomaly detection.
        """
        model = IsolationForest(
            n_estimators=100,
            contamination=0.15,
            random_state=self.random_state,
            n_jobs=-1,
        )
        model.fit(X.values)

        # Anomaly scores: -1 (anomaly) vs 1 (normal)
        preds = model.predict(X.values)
        anomaly_ratio = float(np.mean(preds == -1))

        logger.info("ml_trainer.anomaly_trained", samples=len(X), anomaly_ratio=anomaly_ratio)

        return TrainingArtifact(
            model_name="mplads_isolation_forest",
            model_type="IsolationForest",
            model_object=model,
            calibrated_model=None,
            feature_names=FEATURE_NAMES,
            metrics={"contamination": 0.15, "detected_anomaly_ratio": anomaly_ratio},
            dataset_size=len(X),
            training_timestamp=pd.Timestamp.now("UTC").isoformat(),
        )

    def train_risk_classifier(self, X: pd.DataFrame, y: np.ndarray) -> TrainingArtifact:
        """
        Trains calibrated XGBoost (or RandomForest) risk classifier.
        """
        X_train, X_test, y_train, y_test = train_test_split(
            X.values, y, test_size=0.25, random_state=self.random_state, stratify=y
        )

        if HAS_XGBOOST:
            base_clf = XGBClassifier(
                n_estimators=100,
                max_depth=4,
                learning_rate=0.08,
                random_state=self.random_state,
                eval_metric="logloss",
            )
            model_type = "XGBClassifier"
        else:
            base_clf = RandomForestClassifier(
                n_estimators=100,
                max_depth=5,
                random_state=self.random_state,
            )
            model_type = "RandomForestClassifier"

        base_clf.fit(X_train, y_train)

        # Calibrate probabilities using Sigmoid / Platt scaling
        calibrated = CalibratedClassifierCV(estimator=base_clf, method="sigmoid", cv="prefit")
        calibrated.fit(X_test, y_test)

        # Evaluate on test set
        from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
        y_pred = calibrated.predict(X_test)
        y_prob = calibrated.predict_proba(X_test)[:, 1]

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        try:
            auc = float(roc_auc_score(y_test, y_prob))
        except Exception:
            auc = 0.5

        metrics = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "roc_auc": round(auc, 4),
        }
        logger.info("ml_trainer.risk_classifier_trained", **metrics)

        return TrainingArtifact(
            model_name="mplads_risk_classifier",
            model_type=model_type,
            model_object=base_clf,
            calibrated_model=calibrated,
            feature_names=FEATURE_NAMES,
            metrics=metrics,
            dataset_size=len(X),
            training_timestamp=pd.Timestamp.now("UTC").isoformat(),
        )

    def train_cost_regressor(self, X: pd.DataFrame, y_cost: np.ndarray) -> TrainingArtifact:
        """
        Trains GradientBoostingRegressor to predict expected project cost / budget deviations.
        """
        reg = GradientBoostingRegressor(
            n_estimators=80,
            max_depth=4,
            learning_rate=0.1,
            random_state=self.random_state,
        )
        reg.fit(X.values, y_cost)

        from sklearn.metrics import mean_absolute_error, r2_score
        preds = reg.predict(X.values)
        mae = float(mean_absolute_error(y_cost, preds))
        r2 = float(r2_score(y_cost, preds))

        return TrainingArtifact(
            model_name="mplads_cost_regressor",
            model_type="GradientBoostingRegressor",
            model_object=reg,
            calibrated_model=None,
            feature_names=FEATURE_NAMES,
            metrics={"mae": round(mae, 4), "r2": round(r2, 4)},
            dataset_size=len(X),
            training_timestamp=pd.Timestamp.now("UTC").isoformat(),
        )
