// Agent types — frontend/src/types/agent.ts
// Backend runs multiple AI agents; frontend only displays their results.

export type AgentStatus = 'PASS' | 'FLAG' | 'WARN' | 'ERROR' | 'SKIPPED' | 'NOT_APPLICABLE';
export type AgentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AgentEvidence {
  label: string;
  value: string | number;
  unit?: string;
}

export interface AgentResult {
  agentId: string;
  agentName: string;
  status: AgentStatus;
  score: number;             // 0–100 from backend
  severity: AgentSeverity;
  confidence: number;        // 0–1 from backend
  applicability: boolean;
  signals: string[];         // text signals from backend
  evidence: AgentEvidence[]; // structured evidence from backend
  recommendation?: string;
  computedAt: string;
}

export interface AllAgentResults {
  projectId: string;
  agents: AgentResult[];
  computedAt: string;
}

// Known agent IDs (informational — backend defines canonical list)
export const KNOWN_AGENTS = [
  'data_quality',
  'eligibility',
  'budget',
  'deadline',
  'documentation',
  'procurement',
  'payment',
  'financial_progress',
  'physical_progress',
  'completion',
  'cost_intelligence',
  'anomaly_detection',
  'duplicate_work',
  'delay_prediction',
  'contractor_intelligence',
  'geographic_intelligence',
  'benchmark_trend',
  'fraud_pattern',
  'policy_evidence',
] as const;
