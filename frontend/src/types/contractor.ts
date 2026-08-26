// Contractor types — frontend/src/types/contractor.ts
// IMPORTANT: Never label contractors as "corrupt". Display "risk indicators" only.

import { RiskLevel } from './project';

export interface ContractorRiskIndicator {
  type: string;
  label: string;
  value: string | number;
  flagged: boolean;
}

export interface Contractor {
  contractorId: string;
  contractorName: string;
  registrationNumber?: string;
  totalProjects: number;
  totalProjectValue: number;
  avgRiskScore: number;
  riskLevel: RiskLevel;
  delayRate: number;          // 0–1 from backend
  costAnomalyRate: number;    // 0–1 from backend
  paymentAnomalyRate: number; // 0–1 from backend
  districtConcentration: number; // 0–1 from backend
  riskIndicators: ContractorRiskIndicator[];
  states: string[];
  districts: string[];
  activeProjects: number;
  completedProjects: number;
}

export interface ContractorFilters {
  state?: string;
  riskLevel?: RiskLevel;
  search?: string;
  page?: number;
  pageSize?: number;
}
