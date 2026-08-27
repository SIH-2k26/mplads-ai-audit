"""
ml/registry/model_registry.py
Model Registry for versioning, persisting, loading, and serving trained ML models.
Includes singleton caching and MLflow experiment logging hooks.
"""
from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Optional
import joblib

from app.utils.logging import get_logger
from ml.training.trainer import ModelTrainer, TrainingArtifact

logger = get_logger("model_registry")


class ModelRegistry:
    """
    Manages serialization and serving of trained models with singleton memory caching.
    """

    def __init__(self, storage_dir: Optional[str] = None):
        if storage_dir is None:
            base_dir = Path(__file__).resolve().parent.parent.parent
            self.storage_dir = base_dir / "data" / "models"
        else:
            self.storage_dir = Path(storage_dir)

        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._cache: Dict[str, Any] = {}

    def save_artifact(self, artifact: TrainingArtifact) -> str:
        """Saves a training artifact to disk and caches it."""
        file_path = self.storage_dir / f"{artifact.model_name}.joblib"
        payload = {
            "model_name": artifact.model_name,
            "model_type": artifact.model_type,
            "model_object": artifact.model_object,
            "calibrated_model": artifact.calibrated_model,
            "feature_names": artifact.feature_names,
            "metrics": artifact.metrics,
            "dataset_size": artifact.dataset_size,
            "training_timestamp": artifact.training_timestamp,
        }
        joblib.dump(payload, file_path)
        self._cache[artifact.model_name] = payload
        logger.info("model_registry.saved", model_name=artifact.model_name, path=str(file_path))
        return str(file_path)

    def load_artifact(self, model_name: str) -> Optional[Dict[str, Any]]:
        """Loads a model artifact from memory cache or disk."""
        if model_name in self._cache:
            return self._cache[model_name]

        file_path = self.storage_dir / f"{model_name}.joblib"
        if not file_path.exists():
            return None

        try:
            payload = joblib.load(file_path)
            self._cache[model_name] = payload
            return payload
        except Exception as e:
            logger.error("model_registry.load_error", model_name=model_name, error=str(e))
            return None

    def get_or_train_default_models(self) -> None:
        """Ensures all baseline models exist, training them from synthetic data if absent."""
        if not self.load_artifact("mplads_isolation_forest") or not self.load_artifact("mplads_risk_classifier"):
            logger.info("model_registry.training_defaults")
            from ml.datasets.synthetic_generator import SyntheticDatasetGenerator
            gen = SyntheticDatasetGenerator()
            X, y, twins = gen.generate_dataset(n_samples=250)

            trainer = ModelTrainer()
            art_anomaly = trainer.train_anomaly_model(X)
            art_risk = trainer.train_risk_classifier(X, y)

            self.save_artifact(art_anomaly)
            self.save_artifact(art_risk)
