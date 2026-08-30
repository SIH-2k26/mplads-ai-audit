# MPLADS AI Audit — Full System Audit & Integration Map (Phase 0)

## 1. Executive Summary
This document provides a comprehensive end-to-end audit of the **`mplads-ai-audit`** codebase across frontend React components, FastAPI backend endpoints, machine learning pipelines, compliance engines, and RAG knowledge bases.

The goal is to eliminate hardcoded mock numbers, repair broken communication links, connect all 177 engineered features from live inputs into the trained CatBoost/XGBoost/LightGBM/RF models, bind the regulatory compliance engine and RAG evidence retrieval, and establish a single source of truth.

---

## 2. Inventory of Current Modules & Dependencies

```mermaid
flowchart LR
    subgraph Frontend (React + Vite)
        UI[ProjectRiskSheet / Dashboard] --> API_SVC[src/services/api.ts]
    end

    subgraph Backend (FastAPI)
        API_SVC --> ENDPOINT["POST /api/v1/analyze"]
        ENDPOINT --> NORM[Input Normalizer & Validator]
        NORM --> FEAT[177-Feature Engine ml/features.py]
        FEAT --> ML_INF[ML Inference Service ml/inference.py]
        FEAT --> COMP[Regulatory Engine regulatory/compliance_engine.py]
        FEAT --> RAG_RET[RAG Retriever scripts/rag/retrieve.py]
        ML_INF --> ENS[Hybrid Risk Ensemble ml/ensemble.py]
        COMP --> ENS
        RAG_RET --> ENS
        ENS --> RESP[Unified Canonical JSON Response]
    end

    RESP --> UI
```

### Component Status Audit:
1. **Frontend (`src/`):**
   - React + TypeScript + Vite + Tailwind CSS + Lucide Icons + Sonner.
   - Key UI Components: `src/components/domain/ProjectRiskSheet.tsx`, `src/pages/`, `src/services/api.ts`.
   - Audit Finding: Evidence clicks currently display static toast notices instead of loading full Chapter/Section/Page citations from the RAG store.
2. **Backend API (`backend/`):**
   - FastAPI with routers for Health (`/health`, `/api/v1/health`), Analytics, and Deduplication.
   - Needs formal standardized `POST /api/v1/analyze` accepting raw project input and returning real ML predictions, anomaly scores, rule findings, and RAG citations.
3. **Machine Learning Layer (`ml/` & `models/`):**
   - Trained Models: `models/best_overall_model.joblib` (Calibrated CatBoost), `models/isolation_forest.joblib`, `models/robust_scaler.joblib`.
   - Verified Benchmark: 95.97% test accuracy, 97.27% precision, 83.68% high-risk recall, 0.9713 PR-AUC.
   - Needs: Deterministic feature manifest `ml/feature_manifest.json` and standalone inference wrapper `ml/inference.py`.
4. **Compliance & RAG Layer (`regulatory/` & `scripts/rag/`):**
   - Regulatory sources cataloged in `data/regulatory/manifest.json`.
   - Needs: Full RAG pipeline with temporal filtering (2016 Guidelines vs. 2023 Guidelines based on `sanction_date`) and hybrid Dense + BM25 retrieval.
5. **Data & Validation (`data/`):**
   - 25,000 relational synthetic projects in `data/synthetic/relational/`.
   - 15-point referential integrity validator in `data/validate.py` passing 100%.
   - Anti-leakage scanner in `scripts/check_leakage.py` passing 100%.

---

## 3. Canonical Execution Roadmap

| Phase | Target Module | Scope |
|---|---|---|
| **Phase 1 & 2** | `backend/schemas/` & `src/types/` | Strict Pydantic and TypeScript API contracts for `/api/v1/analyze`. |
| **Phase 3 & 4** | `ml/features.py`, `ml/preprocessing.py`, `ml/feature_manifest.json` | 177 deterministic feature extraction with safe division. |
| **Phase 5 & 6** | `ml/inference.py`, `ml/ensemble.py` | Multi-model scoring (CatBoost, XGB, LGBM, RF, IsoForest) + calibrated fusion. |
| **Phase 7 & 8** | `regulatory/compliance_engine.py`, `scripts/rag/` | Regulatory rule checking + hybrid Dense/BM25 retrieval. |
| **Phase 9 & 10** | Temporal filter & RAG citations | Version-aware guidelines (2016 vs 2023) + structured citation objects. |
| **Phase 11 & 12** | `src/services/api.ts` & `ProjectRiskSheet.tsx` | Real backend integration + interactive regulatory evidence drawer. |
| **Phase 13 & 14** | Error handling, CORS, Health checks | `/api/v1/models/status`, `/api/v1/rag/status`, non-crashing UI states. |
| **Phase 15–20** | Tests & Validation | E2E integration test `tests/test_end_to_end_pipeline.py`, `pytest`, `npm run build`. |
