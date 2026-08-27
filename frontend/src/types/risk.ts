// Risk types — frontend/src/types/risk.ts
// All risk values are computed by backend. Frontend only displays.

import { RiskLevel } from './project';

export interface RiskFingerprint {
  costInflation: number;           // 0–1
  paymentProgressMismatch: number; // 0–1
  repeatedDelay: number;           // 0–1
  contractorPattern: number;       // 0–1
  documentationGap: number;        // 0–1
  duplicateWork: number;           // 0–1
  procurementIrregularity: number; // 0–1
  geographicCluster: number;       // 0–1
}

export interface RiskResult {
  projectId: string;
  overallRiskScore: number;     // 0–100
  riskLevel: RiskLevel;
  currentRisk: number;          // 0–100
  futureRisk: number;           // 0–100
  systemicRisk: number;         // 0–100
  fingerprint: RiskFingerprint;
  explanation: string;          // human-readable explanation from backend
  computedAt: string;           // ISO datetime
}

export interface RiskHistoryPoint {
  month: string;         // e.g. "2024-01"
  riskScore: number;     // 0–100
  riskLevel: RiskLevel;
}

export interface RiskHistory {
  projectId: string;
  history: RiskHistoryPoint[];
}

export interface ShapFeature {
  feature: string;       // feature name
  contribution: number;  // positive or negative float
  value?: string;        // raw feature value for context
}

export interface ShapExplanation {
  projectId: string;
  features: ShapFeature[];
  baselineRisk: number;
  finalRisk: number;
}

export interface EarlyWarningPrediction {
  type: string;
  label: string;
  probability: number;  // 0–1
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description?: string;
}

export interface EarlyWarnings {
  projectId: string;
  predictions: EarlyWarningPrediction[];
  generatedAt: string;
}

export interface StateRiskSummary {
  state: string;
  avgRiskScore: number;
  highRiskCount: number;
  totalProjects: number;
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}
