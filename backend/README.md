# SANCHAY — Backend Architecture & Developer Guide

## Overview

The **SANCHAY Backend** forms the robust, production-grade **Risk Intelligence and Audit Platform** for MPLADS oversight (Smart India Hackathon SIH-26102).

Part A is responsible for:
- Data Ingestion, Validation, Normalization, Entity Resolution & Provenance Tracing
- Canonical Project Digital Twin state representation
- Immutably Logged Event System
- PostgreSQL + pgvector (Vector Store) & Neo4j (Knowledge Graph)
- Document AI (PDF, PyMuPDF, PaddleOCR, Tesseract, Unstructured)
- Hybrid RAG Pipeline (BM25 + Dense + BGE Reranker)
- Versioned Policy Engine & Rule Evaluator
- 9 Part-A Agents (Data Quality, Eligibility, Budget, Deadline, Documentation, Procurement, Contractor Intelligence, Geographic Intelligence, Duplicate/Ghost Work)
- Investigation Engine (Case creation, evidence intake, verdicts, immutable audit trail)

Part B will consume Part A via **5 mandatory integration contracts**.

---

## Repository Structure

```
backend/
├── app/
│   ├── config/           ← Centralized Pydantic BaseSettings
│   ├── database/         ← PostgreSQL (async SQLAlchemy) & Neo4j driver client
│   └── utils/            ← Logging (structlog), Hashing, Provenance utilities
├── models/               ← SHARED PYDANTIC CONTRACTS (Part A ↔ Part B interface)
│   ├── enums.py          ← Standardized status, severity, risk, verdict enums
│   ├── project.py        ← Core domain entities
│   ├── digital_twin.py   ← ProjectDigitalTwin canonical application model
│   ├── event.py          ← Event schema (CONTRACT 2)
│   ├── agent.py          ← BaseAgent & AgentEvidence schema (CONTRACT 1)
│   ├── evidence.py       ← EvidenceItem & PolicyEvidence
│   ├── document.py       ← Document & DocumentChunk schemas
│   ├── policy.py         ← Versioned Policy & RuleEvaluation schemas
│   ├── graph.py          ← GraphResult schema (CONTRACT 4)
│   ├── risk.py           ← RiskFingerprint & RiskOutput stubs
│   └── investigation.py  ← InvestigationIntake (CONTRACT 5) & Case schemas
├── data/
│   ├── ingestion/        ← CSV, Excel, JSON data source pipelines
│   ├── validation/       ← Rules & validation engine (structured errors)
│   ├── normalization/    ← State/district/entity name normalizer
│   ├── entity_resolution/← Exact, normalized & fuzzy matching (rapidfuzz)
│   ├── deduplication/    ← Record deduplication
│   └── provenance/       ← Source lineage & checksum tracking
├── db/
│   ├── models/           ← SQLAlchemy ORM database models & pgvector columns
│   └── repositories/     ← Repository layer hiding persistence details
├── documents/
│   ├── parsing/          ← PyMuPDF PDF extraction & quality checker
│   ├── ocr/              ← PaddleOCR & Tesseract fallback engine
│   ├── extraction/       ← Unstructured partitioner
│   └── chunking/         ← Semantic document chunker
├── rag/
│   ├── embeddings/       ← EmbeddingProvider abstraction (BGE-M3 1024-dim)
│   ├── retrieval/        ← Lexical BM25 & Dense Vector Retrievers
│   ├── reranking/        ← BGE Reranker v2
│   ├── retriever.py      ← RAGRetriever interface (CONTRACT 3)
│   └── evaluation/       ← RAGAS evaluation runner
├── policy/               ← Versioned Policy Engine, Resolver & Evaluator
├── graph/
│   ├── client.py         ← Neo4jClient driver
│   ├── builders/         ← Idempotent Graph Builders (Project, Contractor, Agency, etc.)
│   └── repositories.py   ← GraphQueryService interface (CONTRACT 4)
├── agents/
│   ├── base.py           ← BaseAgent abstract class (CONTRACT 1)
│   ├── deterministic/    ← 6 Deterministic Agents
│   └── intelligence/     ← 3 Statistical & Graph Intelligence Agents
├── events/               ← PostgreSQL-backed EventPublisher & Subscriber (Kafka-replaceable)
├── investigation/        ← Case creation, intake, evidence management, verdicts & audit trail
├── migrations/           ← Alembic database migrations (001_initial_schema)
├── scripts/
│   ├── init_db.py        ← DB setup
│   ├── seed_data.py      ← Synthetic data generator
│   ├── build_graph.py    ← Neo4j graph population
│   └── demo_e2e.py       ← End-to-end pipeline verification
├── tests/
│   └── contracts/        ← Automated contract verification tests for all 5 contracts
├── docker-compose.yml    ← PostgreSQL + pgvector & Neo4j setup
└── requirements.txt
```

---

## The 5 Mandatory Integration Contracts

| Contract | Interface | Description |
|---|---|---|
| **CONTRACT 1** | `BaseAgent` → `AgentEvidence` | Every agent inherits `BaseAgent` and outputs standardized `AgentEvidence` (scores 0–100, neutral fraud language). |
| **CONTRACT 2** | `DigitalTwin` → `Event` | Canonical `ProjectDigitalTwin` represents complete project state; changes produce immutable, serializable `Event` objects. |
| **CONTRACT 3** | `RAGRetriever` → `RetrievalResponse` | Part B queries policy/document evidence strictly through `RAGRetriever.retrieve()`. |
| **CONTRACT 4** | `GraphQueryService` → `GraphResult` | Part B queries knowledge graph relationships strictly via `GraphQueryService` (no raw Cypher in agents). |
| **CONTRACT 5** | `InvestigationIntake` → `InvestigationCase` | Boundary where Part B's Risk Engine submits risk outputs to Part A's Investigation Engine to open/manage cases. |

---

## Quickstart & Verification

### 1. Run All Contract Tests
```bash
cd backend
python -m pytest tests/contracts/
```
*Expected Output: `22 passed in ~0.11s`*

### 2. Run End-to-End Pipeline Demonstration
```bash
python scripts/demo_e2e.py
```
*Executes the full raw data → normalization → digital twin → 9 agents → RAG/Graph → Investigation Case & Verdict pipeline.*

---

## Infrastructure Setup (Docker)

To run local PostgreSQL (pgvector) and Neo4j instances:
```bash
cd backend
docker compose up -d
```

### Apply Migrations
```bash
alembic upgrade head
```

---

## Agent Development Guide

To add a new Part A or Part B agent:

```python
from agents.base import BaseAgent
from models.agent import AgentContext, AgentEvidence, AgentSignal
from models.enums import AgentStatus, Severity

class MyCustomAgent(BaseAgent):
    agent_id = "my_custom_agent"
    agent_name = "My Custom Agent"
    version = "1.0.0"

    def is_applicable(self, context: AgentContext) -> bool:
        return context.digital_twin.project_id is not None

    def analyze(self, context: AgentContext) -> AgentEvidence:
        # Perform logic...
        # NEUTRAL LANGUAGE RULE: Use "elevated risk indicator" — NEVER "corrupt" or "fraud"
        return AgentEvidence(
            agent_id=self.agent_id,
            agent_name=self.agent_name,
            status=AgentStatus.COMPLETED,
            score=45.0,
            severity=Severity.MEDIUM,
            confidence=0.9,
            signals=[
                AgentSignal(
                    signal_type="CUSTOM_INDICATOR",
                    description="Elevated variance detected in execution timeframe",
                    severity=Severity.MEDIUM,
                    confidence=0.9
                )
            ]
        )
```
