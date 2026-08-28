# AGASTYA (MPLADS-Rakshak) Comprehensive Project & Architecture Audit
**Document**: `/docs/PROJECT_AUDIT.md`  
**Repository**: `SIH-2k26/mplads-ai-audit`  
**Branch**: `dummy---sukrut`  
**Date**: August 2026  
**System Classification**: AI-Powered Governance, Risk Intelligence & Early Warning Platform for MPLADS (PS-26102)

---

## 1. Executive Summary & Architectural Overview

AGASTYA is architected as an institutional-grade **Risk Intelligence, Early-Warning, and Audit Surveillance Layer** designed to sit atop the official MoSPI MPLADS, eSAKSHI, and DigiGov digital infrastructure. It does **not** replace official governmental approval workflows (e.g. MP recommendation, District Sanction, Line Agency Execution), but rather ingests and monitors continuous telemetric, procurement, and financial data streams to provide early risk signals, explainable diagnoses, and evidence-grounded decision support to constitutional authorities.

```
                                  AGASTYA RISK INTELLIGENCE PLATFORM
                                                  │
                ┌─────────────────────────────────┴─────────────────────────────────┐
                ▼                                                                   ▼
       EXISTING DATA INTELLIGENCE                                    PROJECT RISK SIMULATOR / WHAT-IF
   (Continuous Automated Surveillance)                             (Proactive Officer Assessment Lab)
                │                                                                   │
    ┌───────────┼───────────┐                                                       ▼
    ▼           ▼           ▼                                              Interactive 6-Section Input
Central     District       CAG /                                                    │
Dashboards  Command     Auditor View                                                ▼
(MP/State/  Centre      (Evidence                                           Derived Feature Engine
Ministry)   (SLA/Cases)  Ledgers)                                                   │
    │           │           │                                                       ▼
    └───────────┼───────────┘                                               Risk Inference Provider
                ▼                                                    (mockRiskInferenceProvider / FastAPI ML)
     Early Warning Pipeline                                                         │
 (01 Detect → 02 Explain → 03 Investigate → 04 Act)                                 ▼
                                                                        Diagnostic Dossier & Scorecard
                                                                      (Decomposition • Tolerance Matrix)
```

---

## 2. Comprehensive System Audit Findings (Sections A – V)

### A. Current Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Lucide Icons + Framer Motion (restrained physics) + Sonner Toasts + Zustand stores (`useRoleStore`, `useUiStore`).
- **Backend**: FastAPI Python architecture (`/backend`) with 19 Multi-Agent systems, LangGraph orchestration, Neo4j Graph Builders, PostgreSQL Repositories, Qdrant/FAISS Vector Stores, Sentence-Transformers, BGE Rerankers, and Isolation Forest ML models.
- **Pluggability Layer**: Decoupled `RiskInferenceProvider` interface allowing seamless switching between deterministic rules/statistical baselines and live FastAPI ML microservices.

### B. Current Pages
1. `/` — **Landing Page**: Institutional hero, ticker, operational governance pipeline (modal detail experience), Public Query & Capsule rail, digital twin preview, machine rules, early warnings, and audit table.
2. `/mp` — **MP Constituency Cockpit**: Recommendations, utilization velocity, SC/ST 15% quota compliance, priority sector progress, and delayed works queue.
3. `/district` — **District Authority Command Centre**: Financial vs physical mismatch detection, 45-day UC SLA alerts, contractor concentration index, and active case docket.
4. `/state` — **State Nodal Authority (SNA) Command**: Inter-district disparity metrics, treasury parking analysis, and cross-district contractor syndicates.
5. `/ministry` — **National Ministry (DIID/MoSPI) View**: All-India state heatmaps, policy violation heatmaps, and macro disbursement health.
6. `/cases` & `/cases/:caseId` — **Investigation Workspace**: Multi-stream evidence dockets, timeline reconstruction, and human decision recording.
7. `/risk-assessment` & `/simulate` — **Project Risk Assessment Lab**: 6-section structured assessment form, live sidebar gauge, 900ms pipeline animation, SHAP driver decomposition, in-place expandable risk factor cards, and tolerance matrix comparison.
8. `/projects` & `/projects/:id` — **Project Explorer & Digital Twin**: Work telemetry, GPS EXIF photos, PWD SoR variance, and milestone timelines.
9. `/contractors` — **Contractor Entity Intelligence**: Cartelization signals, single-bid tender patterns, and district concentration graphs.
10. `/compliance` — **Statutory Rule Engine**: Machine-readable rules codifying MPLADS 2023 Guidelines and GFR-12C.
11. `/reports` — **Vigilance & ML Performance Dashboard**: Isolation Forest metrics (Precision 87.4%, Recall 82.1%), feedback streams, and CAG audit packs.

### C. Current Components
- `components/dashboard/modal/`: `DetailModal`, `DetectModal`, `ExplainModal`, `InvestigateModal`, `ActModal`.
- `components/landing/`: `LandingNavbar`, `HeroSection`, `FromDataToDecisionSection`, `PublicQuerySection`, `IntelligenceCapsuleRail`, `IntelligenceModal`.
- `components/risk-assessment/`: `ProjectIdentificationSection`, `FinancialProfileSection`, `ExecutionStatusSection`, `ProcurementSection`, `ComplianceSection`, `FieldInspectionSection`, `LiveRiskPreview`, `AnalysisPipelineAnimation`, `RiskFactorCard`, `AssessmentResultsView`, `RecentAssessmentsCard`.
- `components/domain/`: `AskAiAssistant`, `EvidenceDrawer`, `ProjectRiskSheet`.
- `components/layout/`: `TopHeader`, `AppSidebar`, `AppShell`, `ScrollToTop`.

### D. Current Data Flow
- **State Management**: Centralized role-based authority (`useRoleStore`) managing 5 constitutional roles (`MP`, `DISTRICT_AUTHORITY`, `STATE_NODAL`, `MINISTRY_DIID`, `AUDITOR`).
- **Persistence**: `assessmentService` for simulated risk assessments (localStorage + memory buffer); `caseService` for case workflows and model feedback logging.

### E. Current AI/ML Flow
1. **Raw Telemetry & Vouchers** $\to$ Feature Normalization $\to$ Derived Ratios (Utilization %, Progress Gap, Bid Deviation %).
2. **Rule Engine**: Hard constraint evaluation against codified MoSPI 2023 guidelines.
3. **Statistical & Scoring Engine**: Multi-category weighted scoring (Financial 25%, Execution 25%, Procurement 20%, Compliance 15%, Field/Duplication 15%).
4. **Explainable AI (XAI)**: SHAP-like factor contribution attribution (`+32 pts Cost`, `+28 pts Progress Gap`, `+22 pts Single Bid`).
5. **Continuous Model Feedback**: Audit outcomes log false positives vs confirmed irregularities into the feedback loop.

### F. Current API Flow
- Decoupled `RiskInferenceService` consuming `RiskInferenceProvider`.
- Production REST API contract defined: `POST /api/v1/risk/assess-project`.

---

## 3. Prioritized Audit Matrix (P0 – P3)

| Code | Severity | Classification | Finding & Current Status | Resolution |
| :--- | :---: | :--- | :--- | :--- |
| **P0-1** | **P0** | Architectural | **Zero Layout Reflow Requirement** in Early Warning blocks (`DETECT`, `EXPLAIN`, `INVESTIGATE`, `ACT`). | ✅ **RESOLVED**: Converted from inline layout resizing to centered `DetailModal` overlay with backdrop blur. |
| **P0-2** | **P0** | Governance | **Role-Switching Cockpit Divergence**: Ensure Acting Authority dropdown completely swaps dashboards. | ✅ **RESOLVED**: Distinct dashboards implemented for MP, District, State, Ministry, and Auditor. |
| **P0-3** | **P0** | AI Integrity | **Language Restraint**: Absolute prevention of automated "fraud accusations". | ✅ **RESOLVED**: Enforced non-accusatory language ("Potential anomaly detected", "Requires verification"). |
| **P1-1** | **P1** | Feature | **Manual What-If Risk Simulator (`/risk-assessment`)**: Enable testing of suspicious proposals. | ✅ **RESOLVED**: 6-section wizard, real-time live preview, pipeline animation, and dossier report. |
| **P1-2** | **P1** | UX/UI | **Public Query & Intelligence Capsules on Landing Page**: Scannable capsule rail with hover preview. | ✅ **RESOLVED**: `PublicQuerySection` + `IntelligenceCapsuleRail` + `IntelligenceModal` implemented. |
| **P1-3** | **P1** | UX/UI | **Toast Notification Controls**: Missing dismiss button on notifications. | ✅ **RESOLVED**: Added `closeButton` across all Sonner `<Toaster />` instances. |
| **P2-1** | **P2** | Data Model | **Derived Feature Automatic Calculation**: Never force users to compute ratios manually. | ✅ **RESOLVED**: Real-time automatic computation of utilization %, progress delta, and bid markup. |
| **P2-2** | **P2** | Backend Sync | **Branch Synchronization**: Merge latest backend updates from `origin/main`. | ✅ **RESOLVED**: Merged `origin/main` into `dummy---sukrut` with 0 build errors. |
| **P3-1** | **P3** | Polish | **Accessibility & Reduced Motion**: Keyboard Escape navigation and dialog focus management. | ✅ **RESOLVED**: Focus trapping, Escape listeners, and ARIA roles added across all modals. |

---

## 4. Risk Engine Architecture & ML Integration Strategy

### Multi-Stage Inference Flow:
```
[ RAW PROJECT ATTRIBUTES ]
           │
           ▼
[ DERIVED FEATURE CALCULATIONS ]
  ├── utilizationRate = (amountUtilized / amountReleased) * 100
  ├── progressMismatchGap = financialProgress - physicalProgress
  ├── bidDeviationPercentage = ((selectedBid - estimatedTender) / estimatedTender) * 100
  ├── costOverrunPotential = sanctionedAmount - estimatedCost
  └── timeOverrunDays = actualDurationDays - plannedDurationDays
           │
           ▼
[ MULTI-CATEGORY SCORING ENGINES ]
  ├── 1. Financial Anomaly Engine (Weight: 25%)
  ├── 2. Execution & Telemetry Engine (Weight: 25%)
  ├── 3. Procurement & Tender Engine (Weight: 20%)
  ├── 4. Statutory Compliance Engine (Weight: 15%)
  └── 5. Field Evidence & Duplication Engine (Weight: 15%)
           │
           ▼
[ COMPOSITE RISK SCORE (0 – 100) ]
  ├── 0 – 30: LOW RISK (Routine Monitoring)
  ├── 31 – 65: MODERATE RISK (Departmental Clarification)
  ├── 66 – 84: HIGH RISK (Executive Engineer Verification)
  └── 85 – 100: CRITICAL RISK (Immediate Audit & Fund Freeze Review)
           │
           ▼
[ EXPLAINABLE REASONING & DECISION SUPPORT ]
  ├── Top Contributing SHAP-Style Factor Cards
  ├── Tolerance Matrix Comparison (Observed vs Benchmark)
  └── Actionable Decision Support Recommendations
```

---

## 5. Summary & Verification Status

- **Frontend Compilation**: `npm run build` passes with **0 TypeScript and bundling errors** in 467ms.
- **Git Synchronization**: Fully merged with `origin/main` and pushed to [`https://github.com/SIH-2k26/mplads-ai-audit/tree/dummy---sukrut`](https://github.com/SIH-2k26/mplads-ai-audit/tree/dummy---sukrut).
- **Interactive Verification**: Both **Continuous Monitoring** and **Manual Risk Assessment Lab** are operational and accessible via local dev server.
