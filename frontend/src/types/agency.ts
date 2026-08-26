// Agency types — frontend/src/types/agency.ts

import { RiskLevel } from './project';

export interface Agency {
  agencyId: string;
  agencyName: string;
  agencyType: string;
  state: string;
  totalProjects: number;
  totalValue: number;
  avgRiskScore: number;
  riskLevel: RiskLevel;
  delayRate: number;
  costDeviation: number;
  highRiskProjects: number;
  activeProjects: number;
}

export interface AgencyFilters {
  state?: string;
  riskLevel?: RiskLevel;
  search?: string;
  page?: number;
  pageSize?: number;
}
