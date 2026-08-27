// Project types — frontend/src/types/project.ts
// These interfaces mirror the planned backend response contracts.
// Do NOT add computed fields here; all calculations come from the backend.

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ProjectStatus =
  | 'RECOMMENDED'
  | 'SANCTIONED'
  | 'WORK_IN_PROGRESS'
  | 'COMPLETED'
  | 'LAPSED'
  | 'SUSPENDED'
  | 'TERMINATED';

export type ProjectCategory =
  | 'ROAD'
  | 'WATER'
  | 'SANITATION'
  | 'EDUCATION'
  | 'HEALTH'
  | 'HOUSING'
  | 'ELECTRIFICATION'
  | 'ENVIRONMENT'
  | 'OTHER';

export interface ProjectSummary {
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  constituency: string;
  agency: string;
  contractor?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  riskScore: number;           // 0–100, computed by backend
  riskLevel: RiskLevel;        // from backend
  sanctionedAmount: number;    // in INR
  expenditure: number;         // in INR
  physicalProgress: number;    // 0–100 %
  financialProgress: number;   // 0–100 %
  lastUpdated: string;         // ISO date string
}

export interface Project extends ProjectSummary {
  startDate?: string;
  expectedCompletion?: string;
  actualCompletion?: string;
  recommendationDate?: string;
  sanctionDate?: string;
  estimatedCost?: number;
  workOrderDate?: string;
  inspectionCount?: number;
  paymentCount?: number;
  lastInspectionDate?: string;
}

export interface ProjectFilters {
  state?: string;
  district?: string;
  status?: ProjectStatus;
  riskLevel?: RiskLevel;
  category?: ProjectCategory;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProjects {
  items: ProjectSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalProjects: number;
  totalSanctionedAmount: number;
  totalExpenditure: number;
  highRiskProjects: number;
  mediumRiskProjects: number;
  lowRiskProjects: number;
  activeAlerts: number;
  predictedDelays: number;
}
