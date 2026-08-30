"""
tests/unit/test_ml_pipeline.py
Unit tests for FeatureEngineer, SyntheticDatasetGenerator, ModelTrainer, ModelRegistry, and SHAPExplainer.
"""
import pytest
import numpy as np

from ml.datasets.synthetic_generator import SyntheticDatasetGenerator
from ml.explainability.shap_explainer import SHAPExplainer
from ml.features.feature_engineer import FeatureEngineer, FEATURE_NAMES
from ml.registry.model_registry import ModelRegistry
from ml.training.trainer import ModelTrainer


def test_synthetic_generator_creates_valid_dataset():
    gen = SyntheticDatasetGenerator(seed=42)
    X, y, twins = gen.generate_dataset(n_samples=30)

    assert len(X) == 30
    assert len(y) == 30
    assert len(twins) == 30
    assert X.shape[1] == len(FEATURE_NAMES)
    assert not X.isnull().any().any()


def test_model_trainer_and_registry():
    gen = SyntheticDatasetGenerator(seed=42)
    X, y, _ = gen.generate_dataset(n_samples=60)

    trainer = ModelTrainer(random_state=42)
    art_anomaly = trainer.train_anomaly_model(X)
    art_clf = trainer.train_risk_classifier(X, y)

    assert art_anomaly.model_object is not None
    assert art_clf.calibrated_model is not None
    assert "accuracy" in art_clf.metrics

    # Test ModelRegistry caching and saving
    registry = ModelRegistry()
    path = registry.save_artifact(art_clf)
    assert path is not None

    loaded = registry.load_artifact("mplads_risk_classifier")
    assert loaded is not None
    assert loaded["model_name"] == "mplads_risk_classifier"


def test_shap_explainer_generates_contributions():
    gen = SyntheticDatasetGenerator(seed=42)
    X, y, _ = gen.generate_dataset(n_samples=40)

    trainer = ModelTrainer(random_state=42)
    art_clf = trainer.train_risk_classifier(X, y)

    explainer = SHAPExplainer(art_clf.model_object)
    sample_vec = X.values[0]

    explanation = explainer.explain_instance(sample_vec)
    assert explanation is not None
    assert len(explanation.contributions) > 0
    assert explanation.summary_statement is not None
