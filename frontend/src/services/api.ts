/**
 * api.ts — Backend API Client
 *
 * Thin HTTP layer for calling the real backend endpoints.
 * Every method returns { data, error } so callers can
 * gracefully fall back to mock data when the backend is unreachable.
 */

const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || '/api/v1';

// ─── Role Mapping (Step 4) ───────────────────────────────────
// Frontend role names → backend role names.
// This is used ONLY when sending authenticated requests.
const ROLE_MAP_TO_BACKEND: Record<string, string> = {
  STATE_NODAL: 'STATE_AUTHORITY',
  MINISTRY_DIID: 'MINISTRY',
  AUDITOR: 'INVESTIGATOR',
  DISTRICT_AUTHORITY: 'DISTRICT_AUTHORITY',
  MP: 'MP',
};

export function mapRoleToBackend(frontendRole: string): string {
  return ROLE_MAP_TO_BACKEND[frontendRole] || frontendRole;
}

// ─── Generic Fetch Helper ────────────────────────────────────

interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const url = `${BASE_URL}${path}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      return { data: null, error: `HTTP ${res.status}: ${errText}` };
    }

    const data = (await res.json()) as T;
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: err?.message || 'Network error — backend unreachable',
    };
  }
}

// ─── Backend Response Types ──────────────────────────────────

export interface BackendRiskComponents {
  supervised_ml: number;
  rule_compliance: number;
  unsupervised_anomaly: number;
  contractor_risk: number;
  evidence_integrity: number;
}

export interface BackendModelProbabilities {
  catboost: number;
  xgboost: number;
  lightgbm: number;
  random_forest: number;
  isolation_forest_anomaly: number;
}

export interface BackendComplianceFinding {
  rule_id: string;
  rule_name: string;
  category: string;
  severity: string;
  status: string;
  description: string;
  statutory_reference: string;
}

export interface BackendRegulatoryEvidence {
  document_id: string;
  document_title: string;
  authority: string;
  chapter?: string;
  section?: string;
  paragraph?: string;
  page?: number;
  effective_date: string;
  citation_text: string;
  relevance_score: number;
  applicability_reason: string;
}

export interface BackendAnalysisResponse {
  project_id: string;
  project_title: string;
  risk_score: number;
  risk_level: string;
  model_probability: number;
  confidence: number;
  severity_label: string;
  model_probabilities: BackendModelProbabilities;
  risk_components: BackendRiskComponents;
  top_risk_factors: Array<Record<string, any>>;
  anomalies: string[];
  compliance_findings: BackendComplianceFinding[];
  regulatory_evidence: BackendRegulatoryEvidence[];
  recommended_actions: string[];
  feature_count: number;
  rag_status: string;
  ml_status: string;
  timestamp: string;
}

// ─── API Methods ─────────────────────────────────────────────

/**
 * POST /api/v1/analyze
 * Runs the full ML + RAG + compliance analysis pipeline.
 */
export async function analyzeProject(
  payload: Record<string, any>
): Promise<ApiResult<BackendAnalysisResponse>> {
  return apiFetch<BackendAnalysisResponse>('/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/v1/models/status
 * Health check for ML model registry.
 */
export async function getModelsStatus(): Promise<ApiResult<any>> {
  return apiFetch('/models/status');
}

/**
 * GET /api/v1/rag/status
 * Health check for RAG knowledge base.
 */
export async function getRagStatus(): Promise<ApiResult<any>> {
  return apiFetch('/rag/status');
}

/**
 * POST /api/v1/simulation/what-if
 * Runs What-If parameter simulation.
 */
export interface WhatIfRequest {
  project_id?: string;
  digital_twin?: Record<string, any>;
  delay_days_delta: number;
  expenditure_delta: number;
  physical_progress_delta: number;
}

export async function runWhatIf(
  payload: WhatIfRequest
): Promise<ApiResult<any>> {
  return apiFetch('/simulation/what-if', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
