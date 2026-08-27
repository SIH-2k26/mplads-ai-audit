# MPLADS Guardian — AI-Powered Government Risk Intelligence Platform

> **Problem Statement ID:** SIH26102  
> **Tagline:** DETECT → EXPLAIN → PREDICT → INVESTIGATE → LEARN

MPLADS Guardian is an AI-driven audit, early-warning, and investigation platform built to monitor Members of Parliament Local Area Development Scheme (MPLADS) works. Rather than functioning as a black-box fraud score generator, the platform combines deterministic rule checking, multi-agent machine learning, graph analytics, and policy-grounded RAG retrieval to provide explainable decision support for district authorities and oversight bodies.

---

## Core System Architecture

```text
                                MPLADS DATA
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
   Structured Data            Documents / PDFs          Historical Data
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                        DATA QUALITY & DIGITAL TWIN
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
    PostgreSQL (ORM)       pgvector (Embeddings)       Neo4j (Knowledge Graph)
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                    LANGGRAPH MULTI-AGENT ORCHESTRATOR
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       ▼                             ▼                             ▼
Deterministic Agents (10)     ML / Statistical Agents (8)     Policy RAG Agent (1)
       │                             │                             │
       └─────────────────────────────┼─────────────────────────────┘
                                     ▼
                         EVIDENCE FUSION & 3D RISK
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
     Current Risk               Future Risk              Systemic Risk
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                      EXPLAINABILITY & INVESTIGATION
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
 SHAP + Policy Evidence      1-Page Field PDF Brief     HITL Feedback Loop
```

---

## Key Capabilities

* **Project Digital Twin:** Tracks the complete lifecycle of works across recommendations, sanctions, fund releases, physical progress updates, and completion certificates.
* **19 Specialized Intelligence Agents:**
* **10 Deterministic Agents:** Data Quality, Eligibility, Budget, SLA/Deadline, Documentation, Procurement Compliance, Payment, Financial Progress, Physical Progress, Asset/Completion.
* **8 ML & Statistical Agents:** Cost Intelligence (Peer Distribution), Anomaly Detection (`IsolationForest`), Duplicate/Ghost Work, Delay Prediction, Contractor Intelligence, Geographic Intelligence, Trend Stagnation, Fraud Archetype Classifier ($K$-Means).
* **1 RAG Policy Agent:** Hybrid retrieval ($BM25 + \text{BGE-M3} + \text{BGE Reranker}$) mapping policy clauses from MoSPI guidelines and GFR rules.


* **Context-Aware Dynamic Risk Weighting:** Adjusts weights dynamically:

$$\text{Adjusted Weight}_i = \text{Base Weight}_i \times \text{Applicability}_i \times \text{Confidence}_i$$


* **Three-Dimensional Risk Breakdown:**
* **Current Risk:** Present financial utilization vs. physical progress gaps.
* **Future Risk:** Projected delay probabilities and pace stagnation.
* **Systemic Risk:** Network-level contractor concentration and split-tendering graph metrics.


* **8-Dimensional Fraud Fingerprinting:** Classifies projects across 8 normalized risk patterns: *Cost Inflation, Payment-Progress Mismatch, Repeated Delay, Contractor Pattern, Documentation Gap, Duplicate Work, Procurement Irregularity,* and *Geographic Cluster*.
* **Human-in-the-Loop Case Management:** Automatically converts high-risk findings ($\text{Score} \ge 70.0$) into actionable investigation cases with audit provenance and verdict tracking (`CONFIRMED_ISSUE`, `FALSE_POSITIVE`, etc.).
* **1-Page Printable Field Brief PDF:** Generates ReportLab inspection briefs complete with metadata tables, 3D risk badges, physical verification checklists, and QR links.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Language & Framework** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Orchestration & Workflow** | LangGraph, LangChain |
| **Databases** | PostgreSQL 16, `pgvector`, Neo4j 5.x, SQLAlchemy 2.0 (Async), Alembic |
| **Machine Learning & Stats** | Scikit-Learn (`IsolationForest`, $K$-Means), XGBoost, LightGBM, NumPy, Pandas |
| **Document AI & OCR** | PyMuPDF, Unstructured, PaddleOCR, Tesseract |
| **RAG & Retrieval** | `rank-bm25`, BGE-M3 Embeddings, BGE Reranker, RAGAS Evaluation |
| **Reporting & Utilities** | ReportLab (PDF Generation), Structlog, PyTest |
| **Frontend UI** | Next.js / React, Tailwind CSS |

---

## Repository Directory Layout

```text
mplads-ai-audit/
├── backend/
│   ├── app/
│   │   ├── agents/          # Multi-Agent Suite (Part A + Part B Agents)
│   │   │   ├── deterministic/
│   │   │   ├── intelligence/
│   │   │   └── part_b/      # 10 Part-B ML & Progress Agents
│   │   ├── api/             # FastAPI v1 Route Handlers & Controllers
│   │   ├── engine/          # Dynamic Weight Engine & Evidence Fusion
│   │   ├── nlp/             # Audit-Compliant Narrative Generator
│   │   ├── orchestration/   # LangGraph StateGraph & Execution Pipeline
│   │   ├── services/        # ReportLab PDF Generator
│   │   └── simulation/      # What-If Risk Delta Simulator
│   ├── models/              # Shared Pydantic Integration Contracts (100% Typed)
│   ├── db/                  # SQLAlchemy ORM Schemas & Repositories
│   ├── graph/               # Neo4j Graph Driver & Cypher Builders
│   ├── rag/                 # Hybrid Retriever & Embeddings Pipeline
│   ├── investigation/       # Case Intake, Verdicts & Audit Logging
│   └── main.py              # FastAPI Application Entrypoint
└── frontend/                # Next.js / React Dashboard Application
```

---

## Quickstart Guide

### 1. Prerequisites

Ensure you have the following installed locally:

* Python 3.11+
* PostgreSQL 16 (with `pgvector` extension)
* Neo4j 5.x
* Node.js 18+ (for frontend)

### 2. Environment Setup

Clone the repository and install backend dependencies:

```bash
git clone https://github.com/YourOrg/mplads-ai-audit.git
cd mplads-ai-audit/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run Database Infrastructure (Docker)

Start local PostgreSQL and Neo4j database containers:

```bash
docker compose up -d
```

Execute Alembic migrations:

```bash
alembic upgrade head
```

### 4. Launch the Backend Server

Start the Uvicorn development server:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

Access the interactive API documentation at:

* **Swagger UI:** `http://localhost:8000/docs`
* **ReDoc:** `http://localhost:8000/redoc`

---

## Core API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/projects/analyze` | Executes the 19-agent orchestrator, returning 3D risk scores, 8D fingerprints, and NLP narratives. |
| `POST` | `/api/v1/simulation/what-if` | Simulates project parameter deltas (delay, cost, progress) in-memory without DB persistence. |
| `GET` | `/api/v1/reports/pdf/{project_id}` | Streams a printable 1-page Field Inspection Brief PDF (`application/pdf`). |
| `POST` | `/api/v1/cases/{case_id}/verdict` | Ingests human investigator verdicts (`CONFIRMED_ISSUE`, `FALSE_POSITIVE`, etc.) for model calibration. |
| `GET` | `/health` | System health and database status check. |

---

## Testing

Run the automated test suite covering unit logic and mandatory integration contracts:

```bash
# Run contract integration tests
pytest backend/tests/contracts/

# Run unit tests
pytest backend/tests/unit/
```

---

## ⚖️ License & Compliance

Designed for official oversight and public infrastructure auditing. All explanations strictly adhere to neutral audit language standards and decision-support guidelines.
