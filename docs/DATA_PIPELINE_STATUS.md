# MPLADS AI Audit — Data & ML Pipeline Status

## 1. Existing System Context
- **Frontend Architecture:** 
  - Institutional React + Vite application (port 3000) containing the AGASTYA brand, editorial hero, 4-stage risk pipeline ("From Data To Decision"), 22 Eighth Schedule Indian languages with RTL support, Project Digital Twin, What-If Simulation UI, and role dashboards.
  - Domain components consuming risk data: `ProjectRiskSheet.tsx`, `VerdictPanel.tsx`, `EvidenceDrawer.tsx`, `WhyFlaggedBox.tsx`.
- **Backend Architecture:**
  - FastAPI application in `backend/` with modular routing (`backend/api/v1`), domain models (`backend/models/`), and rule/trajectory calculation stubs (`backend/engine/`).
- **Current Data & ML Gap:**
  - Data ingestion currently uses static sample JSONs and lightweight stubs.
  - No end-to-end synthetic relational database generator with referential integrity.
  - No trained machine learning models with feature registries and probability calibration.

## 2. Target Data & ML Execution Pipeline
```
[Synthetic Generators (Faker + Statistical Engine)]
                 │
                 ▼
[Canonical Relational Tables (18 core normalized tables)]
                 │
                 ▼
[Data Quality Validator (15 referential & business rule checks)]
                 │
                 ▼
[Leakage-Free Feature Engineering (features.py + config registries)]
                 │
                 ▼
[Multi-Model Classifiers & Anomaly Detectors (RF, XGBoost, LightGBM, IsolationForest)]
                 │
                 ▼
[Calibrated Risk Ensemble & SHAP Explainability Engine]
                 │
                 ▼
[FastAPI Endpoint: POST /api/risk/analyze]
                 │
                 ▼
[AGASTYA Frontend Domain Components]
```

## 3. Preservation & Modification Boundaries
- **Files Preserved Strictly:**
  - All existing React components (`src/components/`, `src/pages/`, `src/i18n/`, `src/styles/`).
  - Existing backend authentication and base database definitions.
- **New & Enhanced Modules:**
  - `data/`: Core synthetic generator, validation script, relational CSV & Parquet outputs.
  - `ml/`: Feature pipeline, model training, evaluation, ensemble, explainability, CLI prediction.
  - `configs/`: `data.yaml`, `model.yaml`, `features.yaml`, `targets.yaml`, `risk_thresholds.yaml`.
  - `docs/`: `DATASET_MAPPING.md`, `ML_MODEL_REPORT.md`, `DATA_PIPELINE_STATUS.md`.
  - `models/`: Saved model binaries (`.joblib`), scalers, metadata, feature importance, metrics.
  - `backend/api/v1/endpoints/risk.py`: Upgraded to call the real hybrid risk engine.
