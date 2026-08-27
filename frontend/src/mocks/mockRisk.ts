// Mock Risk Data — frontend/src/mocks/mockRisk.ts

import type {
  RiskResult, RiskHistory, ShapExplanation, EarlyWarnings,
  StateRiskSummary, RiskDistribution,
} from '../types/risk';

export const MOCK_RISK_RESULT: Record<string, RiskResult> = {
  'MPLADS/UP/2022/1042': {
    projectId: 'MPLADS/UP/2022/1042',
    overallRiskScore: 82,
    riskLevel: 'HIGH',
    currentRisk: 82,
    futureRisk: 88,
    systemicRisk: 71,
    fingerprint: {
      costInflation: 0.85,
      paymentProgressMismatch: 0.91,
      repeatedDelay: 0.72,
      contractorPattern: 0.55,
      documentationGap: 0.60,
      duplicateWork: 0.30,
      procurementIrregularity: 0.45,
      geographicCluster: 0.40,
    },
    explanation:
      'The project has utilized 92.5% of sanctioned funds while physical progress is only 37%. ' +
      'The project is 142 days overdue with no approved extension. ' +
      'Payment disbursements significantly exceed on-ground progress, ' +
      'indicating a high probability of financial irregularity.',
    computedAt: '2024-11-15T10:30:00Z',
  },
  'MPLADS/MP/2021/2204': {
    projectId: 'MPLADS/MP/2021/2204',
    overallRiskScore: 91,
    riskLevel: 'CRITICAL',
    currentRisk: 91,
    futureRisk: 95,
    systemicRisk: 88,
    fingerprint: {
      costInflation: 0.95,
      paymentProgressMismatch: 0.98,
      repeatedDelay: 0.90,
      contractorPattern: 0.75,
      documentationGap: 0.85,
      duplicateWork: 0.40,
      procurementIrregularity: 0.70,
      geographicCluster: 0.50,
    },
    explanation:
      'Project is lapsed with 98% financial progress but only 45% physical progress. ' +
      'Only 1 inspection recorded over 3 years. ' +
      'Contractor has flagged risk indicators on 3 other projects in the same district.',
    computedAt: '2024-11-15T10:30:00Z',
  },
};

export function getMockRisk(projectId: string): RiskResult {
  return (
    MOCK_RISK_RESULT[projectId] ?? {
      projectId,
      overallRiskScore: 45,
      riskLevel: 'MEDIUM',
      currentRisk: 45,
      futureRisk: 52,
      systemicRisk: 38,
      fingerprint: {
        costInflation: 0.40,
        paymentProgressMismatch: 0.38,
        repeatedDelay: 0.45,
        contractorPattern: 0.25,
        documentationGap: 0.35,
        duplicateWork: 0.15,
        procurementIrregularity: 0.20,
        geographicCluster: 0.18,
      },
      explanation: 'Moderate risk indicators detected. Requires monitoring.',
      computedAt: new Date().toISOString(),
    }
  );
}

export function getMockRiskHistory(projectId: string): RiskHistory {
  const base = projectId === 'MPLADS/UP/2022/1042'
    ? [22, 31, 48, 67, 75, 82]
    : [15, 22, 28, 35, 40, 45];

  const months = ['2024-06', '2024-07', '2024-08', '2024-09', '2024-10', '2024-11'];
  return {
    projectId,
    history: months.map((month, i) => ({
      month,
      riskScore: base[i],
      riskLevel: base[i] >= 75 ? 'HIGH' : base[i] >= 50 ? 'MEDIUM' : 'LOW',
    })),
  };
}

export function getMockShap(projectId: string): ShapExplanation {
  return {
    projectId,
    baselineRisk: 25,
    finalRisk: getMockRisk(projectId).overallRiskScore,
    features: [
      { feature: 'Progress Gap', contribution: 0.31, value: '55.5%' },
      { feature: 'Cost Deviation', contribution: 0.24, value: '₹1.85L / 2.0L' },
      { feature: 'Days Overdue', contribution: 0.18, value: '142 days' },
      { feature: 'Payment Pattern', contribution: 0.12, value: 'Irregular' },
      { feature: 'Contractor History', contribution: 0.08, value: '2 flagged projects' },
      { feature: 'Inspection Frequency', contribution: 0.05, value: '2 inspections' },
      { feature: 'Documentation', contribution: -0.03, value: 'Partial' },
      { feature: 'Agency Track Record', contribution: -0.05, value: 'Good' },
    ],
  };
}

export function getMockEarlyWarnings(projectId: string): EarlyWarnings {
  return {
    projectId,
    predictions: [
      {
        type: 'DELAY',
        label: 'High Probability of Delay',
        probability: 0.91,
        severity: 'HIGH',
        description: 'Project is unlikely to complete within the extended deadline.',
      },
      {
        type: 'COST_OVERRUN',
        label: 'High Cost Overrun Risk',
        probability: 0.85,
        severity: 'HIGH',
        description: 'Expenditure trajectory suggests cost overrun of 15-25%.',
      },
      {
        type: 'PAYMENT_MISMATCH',
        label: 'Payment/Progress Mismatch',
        probability: 0.93,
        severity: 'CRITICAL',
        description: 'Payments disbursed are disproportionate to recorded physical progress.',
      },
      {
        type: 'RISK_TRAJECTORY',
        label: 'Increasing Risk Trajectory',
        probability: 0.78,
        severity: 'MEDIUM',
        description: 'Risk score has increased by 60 points over the last 6 months.',
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

export const MOCK_STATE_RISK: StateRiskSummary[] = [
  { state: 'Uttar Pradesh', avgRiskScore: 64, highRiskCount: 48, totalProjects: 210 },
  { state: 'Bihar', avgRiskScore: 61, highRiskCount: 35, totalProjects: 165 },
  { state: 'Madhya Pradesh', avgRiskScore: 57, highRiskCount: 28, totalProjects: 142 },
  { state: 'West Bengal', avgRiskScore: 53, highRiskCount: 22, totalProjects: 130 },
  { state: 'Rajasthan', avgRiskScore: 51, highRiskCount: 20, totalProjects: 120 },
  { state: 'Odisha', avgRiskScore: 48, highRiskCount: 15, totalProjects: 98 },
  { state: 'Jharkhand', avgRiskScore: 46, highRiskCount: 12, totalProjects: 85 },
  { state: 'Maharashtra', avgRiskScore: 42, highRiskCount: 18, totalProjects: 175 },
  { state: 'Gujarat', avgRiskScore: 38, highRiskCount: 10, totalProjects: 110 },
  { state: 'Karnataka', avgRiskScore: 35, highRiskCount: 8, totalProjects: 95 },
];

export const MOCK_RISK_DISTRIBUTION: RiskDistribution = {
  low: 961,
  medium: 334,
  high: 154,
  critical: 33,
};

export const MOCK_RISK_TREND = [
  { month: 'Jun', avgRisk: 41 },
  { month: 'Jul', avgRisk: 44 },
  { month: 'Aug', avgRisk: 47 },
  { month: 'Sep', avgRisk: 51 },
  { month: 'Oct', avgRisk: 54 },
  { month: 'Nov', avgRisk: 57 },
];
