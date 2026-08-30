import sys; sys.path.insert(0, '.')
import inspect

from ml.datasets.synthetic_generator import SyntheticDatasetGenerator
gen = SyntheticDatasetGenerator(seed=42)
X_df, y_arr, scenarios = gen.generate_dataset()

from ml.training.trainer import ModelTrainer
t = ModelTrainer()
artifact = t.train_risk_classifier(X_df, y_arr)
print(f'TrainingArtifact type: {type(artifact)}')
print(f'TrainingArtifact attrs: {[x for x in dir(artifact) if not x.startswith("_")]}')

# SHAPExplainer
from ml.explainability.shap_explainer import SHAPExplainer
print('\nSHAPExplainer methods:')
for m in [x for x in dir(SHAPExplainer) if not x.startswith('_')]:
    try:
        print(f'  {m}: {inspect.signature(getattr(SHAPExplainer, m))}')
    except: pass
