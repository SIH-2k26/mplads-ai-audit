/**
 * api.ts — Backend API Client
 *
 * Thin HTTP layer for calling the real backend endpoints.
 * Every method returns { data, error } so callers can
 * gracefully fall back to mock data when the backend is unreachable.
 */

import { toast } from 'sonner';

const BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:8000/api/v1';

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

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/csv') || contentType.includes('text/html') || contentType.includes('text/plain')) {
      const textData = (await res.text()) as unknown as T;
      return { data: textData, error: null };
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

export interface DashboardSummaryResponse {
  total_projects: number;
  total_sanctioned_amount: number;
  total_sanctioned_cr: number;
  total_expenditure: number;
  total_expended_cr: number;
  overall_utilisation_percentage: number;
  flagged_outlay: number;
  flagged_outlay_cr: number;
  flagged_projects_count: number;
  critical_count: number;
  composite_trust_score: number;
  trust_score_delta: number;
  risk_distribution: {
    low: { count: number; percent: number; label: string };
    medium: { count: number; percent: number; label: string };
    high: { count: number; percent: number; label: string };
    critical: { count: number; percent: number; label: string };
  };
  top_flagged_projects: any[];
  state_breakdown?: Array<{
    state: string;
    works: number;
    sanctioned: string;
    sanctioned_cr: number;
    expended_cr: number;
    util: string;
    util_pct: number;
    critical: number;
    flagged: number;
  }>;
  data_source: string;
}

/**
 * GET /api/v1/dashboard/summary
 * Returns real portfolio aggregates from DB (or resilient parquet file fallback).
 */
export async function getDashboardSummary(params?: {
  district?: string;
  state?: string;
}): Promise<ApiResult<DashboardSummaryResponse>> {
  const query = new URLSearchParams();
  if (params?.district) query.append('district', params.district);
  if (params?.state) query.append('state', params.state);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  return apiFetch<DashboardSummaryResponse>(`/dashboard/summary${qStr}`);
}

export async function getAlerts(): Promise<ApiResult<any[]>> {
  return apiFetch('/alerts');
}

export async function getCases(params?: { priority?: string; status_filter?: string }): Promise<ApiResult<any[]>> {
  const query = new URLSearchParams();
  if (params?.priority) query.append('priority', params.priority);
  if (params?.status_filter) query.append('status_filter', params.status_filter);
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiFetch(`/cases${queryString}`);
}

export async function getCaseDetails(caseId: string): Promise<ApiResult<any>> {
  return apiFetch(`/cases/${caseId}`);
}

export async function submitVerdict(caseId: string, payload: {
  verdict: string;
  reason: string;
  investigator_id?: string;
  investigator_name?: string;
  is_feedback_consented?: boolean;
}): Promise<ApiResult<any>> {
  return apiFetch(`/cases/${caseId}/verdict`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getContractors(): Promise<ApiResult<any[]>> {
  return apiFetch('/contractors');
}

export async function getAgencies(): Promise<ApiResult<any[]>> {
  return apiFetch('/agencies');
}

export async function getPolicies(): Promise<ApiResult<any[]>> {
  return apiFetch('/policies');
}

export { downloadReport, generateCsvReport, generateHtmlDossier } from './reportGenerator';

