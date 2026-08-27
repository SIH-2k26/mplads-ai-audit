// Alert types — frontend/src/types/alert.ts

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'NEW' | 'UNDER_REVIEW' | 'ESCALATED' | 'RESOLVED' | 'FALSE_POSITIVE';

export interface Alert {
  alertId: string;
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  alertType: string;
  severity: AlertSeverity;
  riskScore: number;
  trigger: string;
  agentId?: string;
  agentName?: string;
  evidence: string[];
  riskContribution: number;
  recommendedAction: string;
  status: AlertStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AlertFilters {
  severity?: AlertSeverity;
  alertType?: string;
  state?: string;
  district?: string;
  status?: AlertStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedAlerts {
  items: Alert[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
