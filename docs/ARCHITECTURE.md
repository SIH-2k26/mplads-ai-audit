# MPLADS AI Audit — System Architecture & Integration (AGASTYA)

## 1. System Overview
AGASTYA (MPLADS AI Audit & Intelligence System) is a multi-tier governance decision-support platform designed to detect financial anomalies, procurement irregularities, progress desynchronization, contractor monopolies, and statutory non-compliance in MPLADS (Member of Parliament Local Area Development Scheme) project disbursements.

---

## 2. End-to-End Canonical Architecture Flow

```mermaid
flowchart TD
    subgraph UI_Layer ["Frontend React + Vite UI Layer"]
        A[User Project Input / Explorer] --> B[Real-time Client Preview]
        B --> C["api.analyzeProject(payload)"]
    end

    subgraph API_Layer ["FastAPI Service Layer (/api/v1)"]
        C --> D["POST /api/v1/analyze"]
        D --> E[Pydantic Normalization & Zero-Division Bounds]
    end

    subgraph Feature_Layer ["Feature Extraction & Alignment Engine"]
        E --> F[177 Deterministic Domain Features]
        F --> G[RobustScaler Normalization]
    end

    subgraph ML_Inference ["Multi-Model Classification & Anomaly Suite"]
        G --> H["CatBoost Calibrated Classifier (Primary, PR-AUC 0.9713)"]
        G --> I["XGBoost / LightGBM / Random Forest Suite"]
        G --> J["Isolation Forest Unsupervised Anomaly Engine"]
    end

    subgraph Regulatory_RAG ["Version-Aware Regulatory RAG Engine"]
        E --> K{Sanction Date >= 2023-04-01?}
        K -- Yes --> L[MPLADS Guidelines 2023 Revised]
        K -- No --> M[MPLADS Guidelines 2016 Legacy]
        E --> N[General Financial Rules 2017 & GeM GTC]
        E --> O[CAG Performance Audit Observation Patterns]
        L & M & N & O --> P[Exact Statutory Citations & Chapter/Para Evidence]
    end

    subgraph Fusion_Layer ["Hybrid Risk Fusion & Decision Calibration"]
        H & I & J & P --> Q[Weighted Risk Ensemble 0-100 Score]
        Q --> R[SHAP Feature Contributions & Remediation Actions]
    end

    Q & R & P --> S[Canonical JSON Response Payload]
    S --> UI_Layer
```

---

## 3. Tier Specifications

1. **Frontend (`src/`):**
   - React 18, TypeScript, Tailwind CSS, Lucide Icons, Sonner.
   - Live validation and interactive regulatory evidence drawer in `ProjectRiskSheet.tsx`.
2. **Backend API (`backend/`):**
   - FastAPI with OpenAPI documentation, asynchronous event-driven agents, and standardized endpoints (`/api/v1/analyze`, `/api/v1/models/status`, `/api/v1/rag/status`).
3. **ML & Feature Engineering (`ml/`):**
   - 177 high-dimensional signals extracted from financial, temporal, contractor, procurement, geospatial, and document tables.
   - Calibrated CatBoost, XGBoost, LightGBM, Random Forest, and Isolation Forest.
4. **Regulatory RAG Knowledge Base (`backend/rag/` & `data/regulatory/`):**
   - Date-aware statutory retrieval dynamically citing MPLADS 2023 vs 2016 Guidelines, GFR 2017 Rule 149/144, GeM, and CAG Audit Reports.
