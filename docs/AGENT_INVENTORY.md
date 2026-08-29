# Sanchay AI — Agent Inventory & LangGraph Mapping

This inventory documents all specialized agents and services across the codebase, identifying their core implementation type (Deterministic Rule, Statistical/ML Engine, or LLM-Reasoning Agent), input/output contracts, dependencies, and their mapping into the LangGraph stateful orchestration pipeline.

---

## 1. Agent Inventory Table

| Agent Name | Current File Path | Nature | Key Inputs | Key Outputs | Dependencies | Target LangGraph Node |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Data Quality Agent** | `backend/agents/deterministic/data_quality.py` | Deterministic Rule | `ProjectDigitalTwin`, field presence, value ranges | `DataQualityScore`, missing field errors | Pydantic data schemas | `data_quality` |
| **Eligibility Agent** | `backend/agents/deterministic/eligibility.py` | Deterministic Rule | Work category, permissible works list | `EligibilityVerdict`, rule citations | MPLADS Guidelines 2023 | `compliance` |
| **Budget Agent** | `backend/agents/deterministic/budget.py` | Deterministic Rule | Sanction amount, estimated cost, ceilings | `BudgetDeviationScore`, ceiling flags | GFR 2017 & MPLADS 2023 | `financial` |
| **Deadline Agent** | `backend/agents/deterministic/deadline.py` | Deterministic Rule | Sanction date, start date, completion date | `TimelineSlippageDays`, delay flags | Statutory timelines | `progress` |
| **Documentation Agent** | `backend/agents/deterministic/documentation.py` | Deterministic Rule | Required doc list (`MB`, `UC`, `Geotag`) | `MissingDocFlags`, evidence score | Document registry | `data_quality` / `evidence` |
| **Procurement Agent** | `backend/agents/deterministic/procurement.py` | Deterministic Rule | Tender amount, bid count, single-bid flag | `ProcurementRiskScore`, L1-L2 spread | GeM & GFR Rule 149 | `procurement` |
| **Contractor Intelligence** | `backend/agents/intelligence/contractor_intelligence.py` | Graph / Heuristic | Contractor PAN/GSTIN, award counts | `ContractorRiskScore`, repeat wins | Neo4j / in-memory graph | `contractor` |
| **Geographic Intelligence** | `backend/agents/intelligence/geographic_intelligence.py` | Spatial Heuristic | Lat/Long coordinates, constituency boundary | `GeographicRiskScore`, boundary check | Spatial GIS bounding | `data_quality` / `anomaly` |
| **Duplicate / Ghost Work** | `backend/agents/intelligence/duplicate_ghost_work.py` | S-BERT / Text Match | Title, description, location coordinates | `DuplicateSimilarityScore`, ghost flag | RapidFuzz / S-BERT | `anomaly` |
| **Payment Agent** | `backend/agents/part_b/deterministic/payment_agent.py` | Deterministic Rule | Payment tranches, invoice dates, amounts | `PaymentVelocityAnomaly`, tranche flags | Financial ledger records | `financial` |
| **Financial Progress** | `backend/agents/part_b/deterministic/financial_progress_agent.py` | Deterministic Rule | Financial progress %, sanctioned budget | `ExpenditureRateScore` | Financial records | `financial` |
| **Physical Progress** | `backend/agents/part_b/deterministic/physical_progress_agent.py` | Deterministic Rule | Physical progress %, milestone inspection dates | `PhysicalProgressScore`, stagnation flag | Measurement Book entries | `progress` |
| **Asset Completion** | `backend/agents/part_b/deterministic/asset_completion_agent.py` | Deterministic Rule | Completion certificate, geotagged photos | `AssetVerificationScore` | Asset registry | `evidence` |
| **Cost Intelligence** | `backend/agents/part_b/ml/cost_intelligence_agent.py` | Statistical / ML | Peer district unit costs, variance z-scores | `CostOverrunProbability`, z-score | Canonical ML Feature Engine | `financial` |
| **Anomaly Agent** | `backend/agents/part_b/ml/anomaly_agent.py` | ML / Outlier | 176 Canonical Features, Isolation Forest | `AnomalyVector`, outlier score | `models/isolation_forest.joblib` | `anomaly` |
| **Delay Prediction** | `backend/agents/part_b/ml/delay_prediction_agent.py` | Statistical / ML | Progress velocity, historical district delays | `ProjectedDelayDays`, delay risk | Gradient boosting models | `progress` |
| **Trend Benchmark** | `backend/agents/part_b/ml/trend_benchmark_agent.py` | Statistical | District/State aggregate performance metrics | `BenchmarkDeviationScore` | Aggregation repositories | `financial` / `progress` |
| **Fraud Archetype** | `backend/agents/part_b/ml/fraud_archetype_agent.py` | ML Classification | Supervised Random Forest / CatBoost | `FraudProbability`, archetype flags | `models/best_overall_model.joblib` | `ml_analysis` |
| **Regulatory RAG Agent** | `backend/agents/part_b/rag_agent.py` | Hybrid RAG (BM25+Vec) | Project category, identified anomalies | `RegulatoryCitations`, guideline clauses | BM25 / Vector Index | `evidence` |
| **NLP Explanation** | `backend/nlp/` | LLM / Heuristic | SHAP values, risk scores, rule violations | `StructuredMarkdownExplanation` | Prompt templates | `explanation` |
| **Investigation Service** | `backend/investigation/service.py` | Structured Workflow | Critical risk findings, evidence pack | `InvestigationChecklist`, auditor guide | Investigation intake | `investigation` |

---

## 2. Architectural Separation of Concerns

```
                  ┌─────────────────────────────────────────────────────────────┐
                  │                 SANCHAY SUPERVISOR NODE                     │
                  │   - Inspects data presence & determines active subgraphs     │
                  └──────────────────────────────┬──────────────────────────────┘
                                                 │
                  ┌──────────────────────────────┴──────────────────────────────┐
                  ▼                                                             ▼
 ┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
 │       DETERMINISTIC TOOLS & NODES       │   │           LLM REASONING AGENTS          │
 │  - Budget & Ceiling Checks              │   │  - Regulatory Interpretation            │
 │  - Milestone Arithmetic & Date Diff     │   │  - Cross-Domain Anomaly Synthesis       │
 │  - 176 Feature Extraction               │   │  - Plain-Language Audit Explanations    │
 │  - ML Probability & Calibration         │   │  - Investigation Planning               │
 │  - Isolation Forest Outlier Scores      │   │  - Evidence Grounding & Citations       │
 │  - Neo4j Graph Traversal                │   │  - Auditor Checklist Generation         │
 │  - Risk Fusion & Multiplier Engine      │   │                                         │
 └─────────────────────────────────────────┘   └─────────────────────────────────────────┘
```

---

## 3. LangGraph Orchestration Topology
- **Step 1: `normalize_data`** — Validates incoming JSON/DigitalTwin payload and constructs `FeatureBuilder` dict.
- **Step 2: `data_quality`** — Validates field completeness and sets baseline data confidence.
- **Step 3: `supervisor`** — Determines which domain nodes execute based on data presence.
- **Step 4: Domain Specialists (`financial`, `procurement`, `contractor`, `progress`, `compliance`)** — Run deterministic tools and synthesize domain findings.
- **Step 5: `ml_analysis` & `anomaly`** — Generates calibrated model probabilities, Isolation Forest scores, and SHAP attributions.
- **Step 6: `risk_fusion`** — Deterministically computes composite 0-100 score according to `configs/risk_policy_v1.yaml`.
- **Step 7: `evidence`** — Retrieves relevant statutory clauses from MPLADS Guidelines 2023, GFR 2017, and CAG reports.
- **Step 8: `explanation`** — Generates auditor-facing plain-language explanations without hallucinations.
- **Step 9: `investigation`** — Compiles action checklists and inspection guides.
- **Step 10: `human_review` & `finalize`** — Pauses for human decision if risk score >= 70; saves checkpoint state.
