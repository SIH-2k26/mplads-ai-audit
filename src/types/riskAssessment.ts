export type AssessmentRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WorkCategoryType = 
  | 'Road Infrastructure'
  | 'Water Infrastructure'
  | 'Education Infrastructure'
  | 'Public Health'
  | 'Sanitation & Drainage'
  | 'Community Assets'
  | 'Civil Works'
  | 'Other';

export type ProjectExecutionStatus = 
  | 'Proposed'
  | 'Sanctioned'
  | 'In Progress'
  | 'Delayed'
  | 'Completed'
  | 'Closed';

export type TenderType = 
  | 'Open Tender'
  | 'Limited Tender'
  | 'Nomination'
  | 'Other';

export type FieldInspectionStatus = 
  | 'Not Inspected'
  | 'Scheduled'
  | 'Inspected'
  | 'Issue Identified'
  | 'Verified';

export interface ProjectAssessmentInput {
  // SECTION 01: Project Identification
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  constituency: string;
  implementingAgency: string;
  category: WorkCategoryType;
  sanctionDate: string;
  expectedCompletionDate: string;

  // SECTION 02: Financial Profile
  sanctionedAmount: number; // in Rupees
  estimatedProjectCost: number;
  amountReleased: number;
  amountUtilized: number;
  paymentCount: number;
  latestPaymentAmount: number;

  // SECTION 03: Execution Status
  physicalProgress: number; // 0 - 100%
  financialProgress: number; // 0 - 100%
  daysSinceSanction: number;
  daysSinceLastPayment: number;
  plannedDurationDays: number;
  actualDurationDays: number;
  currentStatus: ProjectExecutionStatus;

  // SECTION 04: Procurement / Contract Profile
  bidderCount: number;
  eligibleBidderCount: number;
  selectedBidAmount: number;
  estimatedTenderAmount: number;
  contractorCount: number;
  contractorConcentrationPercentage: number;
  tenderType: TenderType;

  // SECTION 05: Compliance / Duplicate Indicators
  duplicateWorkSuspected: boolean;
  nearbySimilarWork: boolean;
  repeatedContractor: boolean;
  documentationComplete: boolean;
  geoLocationVerified: boolean;
  administrativeApprovalAvailable: boolean;
  technicalSanctionAvailable: boolean;

  // SECTION 06: Field Inspection Data
  lastInspectionDate?: string;
  inspectionStatus: FieldInspectionStatus;
  photoEvidenceAvailable: boolean;
  geoTaggedEvidenceAvailable: boolean;
  independentQualityMonitorStatus: string;
}

export interface DerivedMetrics {
  utilizationRate: number; // % (amountUtilized / amountReleased * 100)
  progressMismatchGap: number; // financialProgress - physicalProgress
  bidDeviationPercentage: number; // (selectedBid - estimatedTender) / estimatedTender * 100
  costOverrunPotential: number; // sanctionedAmount vs estimatedProjectCost
  timeOverrunDays: number; // actualDurationDays - plannedDurationDays
}

export interface RiskCategoryScores {
  financial: number; // 0 - 100
  execution: number; // 0 - 100
  procurement: number; // 0 - 100
  compliance: number; // 0 - 100
  duplication: number; // 0 - 100
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
  severity: AssessmentRiskLevel;
  category: 'FINANCIAL' | 'EXECUTION' | 'PROCUREMENT' | 'COMPLIANCE' | 'DUPLICATION';
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
  status: 'NORMAL' | 'ELEVATED' | 'SIGNIFICANT MISMATCH' | 'CRITICAL EXCEPTION';
  statusColor: 'green' | 'amber' | 'red';
}

export interface RiskAssessmentResult {
  assessmentId: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  category: WorkCategoryType;
  district: string;
  state: string;

  riskScore: number; // 0 - 100
  riskLevel: AssessmentRiskLevel;
  demoConfidence: number; // e.g. 91%
  modelType: 'RULE_BASED_PROTOTYPE' | 'ML_INFERENCE_SERVICE';

  categoryScores: RiskCategoryScores;
  derivedMetrics: DerivedMetrics;
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

export interface RiskInferenceProvider {
  evaluateProject(data: ProjectAssessmentInput): Promise<RiskAssessmentResult>;
}
