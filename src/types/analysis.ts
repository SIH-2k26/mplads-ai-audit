/**
 * src/types/analysis.ts
 * Standardized TypeScript Types matching FastAPI /api/v1/analyze schemas.
 */

export interface ProjectInputPayload {
  project_id: string;
  title: string;
  category: string;
  state: string;
  district: string;
  constituency: string;
  sanction_amount: number;
  estimated_cost: number;
  revised_cost?: number;
  tender_amount?: number;
  actual_cost: number;
  fund_released: number;
  total_expenditure: number;
  physical_progress: number;
  financial_progress: number;
  planned_duration_days: number;
  actual_duration_days: number;
  bid_count: number;
  extension_count: number;
  contractor_id?: string;
  agency_id?: string;
  latitude?: number;
  longitude?: number;
  sanction_date?: string;
}

export interface DocumentChecklistPayload {
  administrative_sanction: boolean;
  technical_sanction: boolean;
  dpr: boolean;
  work_order: boolean;
  measurement_book: boolean;
  utilization_certificate: boolean;
  completion_certificate: boolean;
  geo_tagged_photos: boolean;
}

export interface AnalysisRequestPayload {
  project: ProjectInputPayload;
  documents?: DocumentChecklistPayload;
  analysis_options?: {
    include_rag: boolean;
    include_explanations: boolean;
    include_feature_values: boolean;
  };
}

export interface RegulatoryEvidenceItem {
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

export interface ComplianceFindingItem {
  rule_id: string;
  rule_name: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'COMPLIANT' | 'WARNING' | 'VIOLATION';
  description: string;
  statutory_reference: string;
}

export interface RiskComponentBreakdown {
  supervised_ml: number;
  rule_compliance: number;
  unsupervised_anomaly: number;
  contractor_risk: number;
  evidence_integrity: number;
}

export interface ModelProbabilityBreakdown {
  catboost: number;
  xgboost: number;
  lightgbm: number;
  random_forest: number;
  isolation_forest_anomaly: number;
}

export interface AnalysisResponseData {
  project_id: string;
  project_title: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  model_probability: number;
  confidence: number;
  severity_label: string;
  model_probabilities: ModelProbabilityBreakdown;
  risk_components: RiskComponentBreakdown;
  top_risk_factors: Array<{
    feature: string;
    impact: number;
    direction: string;
    description?: string;
  }>;
  anomalies: string[];
  compliance_findings: ComplianceFindingItem[];
  regulatory_evidence: RegulatoryEvidenceItem[];
  recommended_actions: string[];
  feature_count: number;
  rag_status: string;
  ml_status: string;
  timestamp: string;
}
