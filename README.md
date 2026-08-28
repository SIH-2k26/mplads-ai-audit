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

* Python 3.11+
* Node.js 18+ & npm
* Git

### 2. Environment & Dependencies Setup

Clone the repository and install all dependencies:

```bash
git clone https://github.com/SIH-2k26/mplads-ai-audit.git
cd mplads-ai-audit

# Python Virtual Environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt

# Frontend Dependencies
npm install
```

### 3. One-Command Full System Verification

Execute the complete multi-tier data validation, anti-leakage audit, ML evaluation, pytest suite, and frontend build:

```bash
make all
```

### 4. Launch the Applications

**Launch FastAPI Backend Server (Port 8000):**
```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
* **Interactive OpenAPI Docs:** `http://localhost:8000/docs`
* **ReDoc Documentation:** `http://localhost:8000/redoc`

**Launch React / Vite Frontend Dashboard (Port 5173):**
```bash
npm run dev
```
* **Web Portal:** `http://localhost:5173`

---

## Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/analyze` | Canonical endpoint executing 176-feature ML inference, rule compliance checks, and temporal RAG retrieval. |
| `GET` | `/api/v1/models/status` | Real-time health, loaded classifier versions, and feature counts. |
| `GET` | `/api/v1/rag/status` | Vector index status and temporal regulatory filter health. |
| `POST` | `/api/v1/cases/{case_id}/verdict` | Ingests human investigator verdicts (`CONFIRMED_ISSUE`, `FALSE_POSITIVE`, `INSUFFICIENT_EVIDENCE`). |
| `GET` | `/health` | System health check and API latency monitoring. |

---

## Automated Testing Suite

```bash
# Run complete test suite (170+ unit, integration, and security tests)
pytest -v

# Run 8-scenario deterministic end-to-end integration tests
pytest tests/test_end_to_end_pipeline.py -v

# Run 100-query statutory RAG evaluation
python scripts/rag/evaluate.py
```

---

## ⚖️ License & Compliance

Designed for official oversight and public infrastructure auditing. All explanations strictly adhere to neutral audit language standards and decision-support guidelines.
