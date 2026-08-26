// Investigation Case types — frontend/src/types/case.ts

import { RiskLevel } from './project';

export type CaseStatus =
  | 'OPEN'
  | 'UNDER_INVESTIGATION'
  | 'PENDING_REVIEW'
  | 'ESCALATED'
  | 'CLOSED'
  | 'ARCHIVED';

export type VerdictType =
  | 'CONFIRMED_ISSUE'
  | 'FALSE_POSITIVE'
  | 'INSUFFICIENT_EVIDENCE'
  | 'ESCALATED'
  | 'NO_ACTION_REQUIRED';

export interface HumanVerdict {
  verdictType: VerdictType;
  officerName: string;
  officerRole?: string;
  remarks: string;
  submittedAt: string;
}

export interface PolicyEvidenceItem {
  applicableRule: string;
  sourceDocument: string;
  section: string;
  page?: string;
  effectiveDate?: string;
  evidence: string;
  confidence: number;       // 0–1 from backend RAG
  sourceUrl?: string;
}

export interface InvestigationCase {
  caseId: string;
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryConcern: string;
  status: CaseStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  verdict?: HumanVerdict;
  policyEvidence?: PolicyEvidenceItem[];
  agencyHistory?: string;
  contractorHistory?: string;
  geographicInfo?: string;
}

export interface VerdictSubmission {
  caseId: string;
  verdictType: VerdictType;
  officerName: string;
  officerRole?: string;
  remarks: string;
}

export interface CaseFilters {
  status?: CaseStatus;
  riskLevel?: RiskLevel;
  state?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedCases {
  items: InvestigationCase[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
