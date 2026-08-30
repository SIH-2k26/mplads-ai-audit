import { RiskLevel } from './index';

export type AssessmentRiskLevel = RiskLevel;

export interface ProjectAssessmentInput {
  projectId: string;
  projectName: string;
  category: string;
  district: string;
  state: string;
  amountReleased: number;
  amountUtilized: number;
  physicalProgress: number;
  financialProgress: number;
  paymentCount: number;
  estimatedTenderAmount: number;
  selectedBidAmount: number;
  estimatedProjectCost: number;
  sanctionedAmount: number;
  actualDurationDays: number;
  plannedDurationDays: number;
  currentStatus: string;
  eligibleBidderCount: number;
  contractorConcentrationPercentage: number;
  tenderType: string;
  technicalSanctionAvailable: boolean;
  administrativeApprovalAvailable: boolean;
  documentationComplete: boolean;
  geoLocationVerified: boolean;
  duplicateWorkSuspected: boolean;
  nearbySimilarWork: boolean;
  repeatedContractor: boolean;
}

export interface WhyFlaggedContributor {
  id: string;
  index: string;
  title: string;
  summary: string;
  observedLabel: string;
  observedValue: string;
  referenceLabel: string;
  referenceValue: string;
  riskContributionPoints: number;
}

export interface RiskFactorItem {
  id: string;
  title: string;
  severity: RiskLevel;
  category: string;
  observedValue: string;
  referenceValue: string;
  deviation: string;
  riskContribution: number;
  whyItMatters: string;
  recommendedVerification: string;
}

export interface CompareMetricItem {
  label: string;
  observed: string;
  expected: string;
  difference: string;
  status: string;
  statusColor: 'red' | 'amber' | 'green';
}

export interface RiskAssessmentResult {
  assessmentId: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  category: string;
  district: string;
  state: string;
  riskScore: number;
  riskLevel: AssessmentRiskLevel;
  demoConfidence: number;
  modelType: string;
  categoryScores: {
    financial: number;
    execution: number;
    procurement: number;
    compliance: number;
    duplication: number;
  };
  derivedMetrics: {
    utilizationRate: number;
    progressMismatchGap: number;
    bidDeviationPercentage: number;
    costOverrunPotential: number;
    timeOverrunDays: number;
  };
  whyFlaggedContributors: WhyFlaggedContributor[];
  riskFactors: RiskFactorItem[];
  compareWithExpected: CompareMetricItem[];
  recommendations: string[];
  rawInputs: ProjectAssessmentInput;
}

export interface SavedAssessmentSummary {
  assessmentId: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  category: string;
  district: string;
  riskScore: number;
  riskLevel: AssessmentRiskLevel;
  topDriver: string;
}
