export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export interface MPLADSProject {
  id: string;
  code: string;
  title: string;
  category: 'Healthcare' | 'Education' | 'Sanitation' | 'Irrigation & Water' | 'Rural Roads' | 'Public Infrastructure';
  state: string;
  constituency: string;
  constituencyType: 'Lok Sabha' | 'Rajya Sabha';
  mpName: string;
  implementingAgency: string;
  contractorName: string;
  contractorGstin: string;
  sanctionedAmountCr: number;
  disbursedAmountCr: number;
  expendedAmountCr: number;
  sanctionDate: string;
  targetCompletionDate: string;
  physicalProgressPercent: number;
  reportedFinancialProgressPercent: number;
  discrepancyPercent: number;
  trustScore: number; // 0 - 100
  riskTier: RiskTier;
  primaryAnomaly: string;
  anomalyCategory: 'Vendor Collusion' | 'Satellite Mismatch' | 'Ghost Milestone' | 'Severe Cost Overrun' | 'UC Missing' | 'Timeline Stall';
  satelliteAuditStatus: 'Mismatch Confirmed' | 'Partial Trace' | 'Verified' | 'Pending Cloud Pass';
  status: 'Under Forensic Review' | 'Disbursal Frozen' | 'Show Cause Issued' | 'Field Team Dispatched' | 'Active Monitoring';
  flaggedDate: string;
  detailedAnalysis?: string;
  satelliteImageBefore?: string;
  satelliteImageAfter?: string;
  cagReference?: string;
}

export interface ConstituencyRiskSummary {
  id: string;
  name: string;
  state: string;
  mpName: string;
  party: string;
  totalProjects: number;
  flaggedProjects: number;
  totalSanctionedCr: number;
  trustIndex: number;
  riskTrend: 'worsening' | 'stable' | 'improving';
  highPriorityFlag: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  subValue?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'critical';
  benchmarkLabel?: string;
  benchmarkValue?: string;
}

export interface ColorTokenSpec {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
  wcagContrast: string;
}

export interface TypographySpec {
  role: string;
  fontFamily: string;
  weight: string;
  sample: string;
  rationale: string;
}
