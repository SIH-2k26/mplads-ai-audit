# MPLADS AI Audit — Frontend ↔ Backend Integration & Single Source of Truth

## 1. Role Separation & Source of Truth Boundary
* **Backend (`FastAPI`):** Single source of truth for 177-feature extraction, ML model predictions, Isolation Forest anomaly scoring, compliance rule evaluation, RAG statutory evidence retrieval, and calibrated 0–100 risk score calculation.
* **Frontend (`React + Vite`):** Responsible for user interaction, input capture, instant client preview indicators (for responsive UX), communicating with `api.analyzeProject(payload)`, and rendering explainable risk dossiers in `ProjectRiskSheet.tsx`.

---

## 2. Real-time Analysis Workflow
1. User enters or modifies project parameters (Sanction Amount, Disbursed Amount, Physical %, Financial %, Bid Count, Document Availability).
2. Frontend immediately computes client-side preview indicators (Cost Ratios, Gap %, Single Bid Flag) for immediate visual feedback.
3. Upon clicking **"Analyze Project"** or opening a risk dossier, the frontend calls `POST /api/v1/analyze`.
4. FastAPI normalizes data, extracts all 177 features, scores through CatBoost/XGBoost/LightGBM/RandomForest/IsoForest, queries the temporal RAG store, and returns the canonical response.
5. `ProjectRiskSheet.tsx` displays the calibrated risk score, individual component contributions, why the project was flagged, and allows clicking any evidence item to inspect the exact statutory citation with Chapter/Para/Page references.
