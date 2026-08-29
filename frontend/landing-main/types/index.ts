export type UserRole = 'MP' | 'DISTRICT_AUTHORITY' | 'STATE_NODAL' | 'MINISTRY_DIID' | 'AUDITOR';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ProjectStatus = 
  | 'RECOMMENDED' 
  | 'SANCTIONED' 
  | 'TENDER_ISSUED' 
  | 'WORK_IN_PROGRESS' 
  | 'COMPLETED' 
  | 'HALTED' 
  | 'CANCELLED';

export interface RiskFingerprint {
  cost: number;
  financial: number;
  procurement: number;
  execution: number;
  delay: number;
  contractor: number;
  duplicate: number;
  compliance: number;
  historical: number;
}

export interface CostBenchmark {
  projectCost: number;
  peerMedian: number;
  peerMean: number;
  expectedRange: [number, number];
  deviationPercentage: number;
  peerPercentile: number;
  peerSampleCount: number;
}

export interface ApplicableRule {
  ruleId: string;
  documentTitle: string;
  section: string;
  page: number;
  summary: string;
  quote: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  url?: string;
}

export interface EvidenceItem {
  id: string;
  type: 'DATA' | 'BENCHMARK' | 'POLICY' | 'DOCUMENT' | 'MODEL';
  title: string;
  detail: string;
  sourceDoc?: string;
  pageSection?: string;
  verified: boolean;
  timestamp: string;
  confidenceScore?: number;
}

export interface TimelineMilestone {
  id: string;
  step: string;
  date: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'DELAYED' | 'PENDING';
  delayDays?: number;
  notes?: string;
  amount?: number;
}

export interface PaymentTransaction {
  id: string;
  installmentNo: number;
  amountRupees: number;
  date: string;
  payee: string;
  status: 'RELEASED' | 'PENDING_UC' | 'VERIFIED';
  ucSubmitted: boolean;
  ucReference?: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  type: 'SANCTION_ORDER' | 'TECHNICAL_ESTIMATE' | 'TENDER_NOTICE' | 'INSPECTION_REPORT' | 'UTILISATION_CERTIFICATE' | 'GEO_TAGGED_PHOTO';
  uploadedDate: string;
  fileSize: string;
  verifiedByAi: boolean;
  flagCount: number;
  hash: string;
}

export interface ProjectRelationship {
  targetId: string;
  targetName: string;
  targetType: 'MP' | 'CONTRACTOR' | 'AGENCY' | 'DISTRICT' | 'SIMILAR_PROJECT' | 'VENDOR';
  relationType: 'RECOMMENDED_BY' | 'EXECUTED_BY' | 'IMPLEMENTED_BY' | 'LOCATED_IN' | 'DUPLICATE_OF' | 'SUBCONTRACTOR_TO';
  weight: number;
  notes?: string;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  category: 'Education' | 'Roads' | 'Water' | 'Health' | 'Sanitation' | 'Community' | 'Energy' | 'Sports';
  sector: string;
  mpName: string;
  constituency: string;
  district: string;
  state: string;
  financialYear: string;
  
  sanctionedAmount: number;
  releasedAmount: number;
  expenditure: number;
  remainingBalance: number;
  utilisationPercentage: number;
  
  physicalProgressPercentage: number;
  financialProgressPercentage: number;
  progressMismatchGap: number;
  
  status: ProjectStatus;
  currentRiskScore: number;
  futureRiskScore: number;
  systemicRiskScore: number;
  confidenceScore: number;
  evidenceCoverage: number;
  
  whyFlagged: string[];
  riskFingerprint: RiskFingerprint;
  
  contractor: {
    id: string;
    name: string;
    panNumber: string;
    riskScore: number;
    activeContractsInDistrict: number;
  };
  
  implementingAgency: {
    id: string;
    name: string;
    department: string;
    delayRate: number;
  };
  
  location: {
    lat: number;
    lng: number;
    wardOrVillage: string;
    block: string;
    address: string;
  };
  
  timeline: TimelineMilestone[];
  payments: PaymentTransaction[];
  documents: ProjectDocument[];
  costBenchmark: CostBenchmark;
  applicableRules: ApplicableRule[];
  evidenceItems: EvidenceItem[];
  relationships: ProjectRelationship[];
  
  dataFreshness: {
    lastUpdated: string;
    financialDataAgeDays: number;
    physicalDataAgeDays: number;
    isStale: boolean;
  };
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AlertType = 
  | 'COST_ANOMALY' 
  | 'PROGRESS_MISMATCH' 
  | 'TENDER_BYPASS' 
  | 'CONTRACTOR_CONCENTRATION' 
  | 'DUPLICATE_WORK' 
  | 'SLA_BREACH' 
  | 'MISSING_UC' 
  | 'FUND_LAPSE_RISK';

export interface Alert {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  district: string;
  state: string;
  type: AlertType;
  severity: AlertSeverity;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'ESCALATED_TO_CASE' | 'RESOLVED';
  riskScore: number;
  timestamp: string;
  deadline: string;
  whyFlagged: string;
  evidenceCount: number;
  applicableRuleId: string;
  applicableRuleTitle: string;
  assignedAuthority: string;
  recommendedAction: string;
  slaDaysRemaining: number;
}

export type CaseStatus = 
  | 'UNDER_INVESTIGATION' 
  | 'CONFIRMED_ISSUE' 
  | 'FALSE_POSITIVE' 
  | 'INSUFFICIENT_EVIDENCE' 
  | 'RESOLVED' 
  | 'ESCALATED';

export interface CaseAuditEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  notes: string;
}

export interface CaseInvestigation {
  id: string;
  caseNumber: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  district: string;
  state: string;
  riskScore: number;
  priority: AlertSeverity;
  status: CaseStatus;
  createdDate: string;
  lastUpdated: string;
  assignedInvestigator: string;
  whyFlagged: string;
  evidenceCount: number;
  
  applicableRule: {
    ruleId: string;
    title: string;
    section: string;
    page: number;
    documentUrl: string;
  };
  
  peerComparison: {
    expectedRange: string;
    actualAmount: string;
    peerDeviation: string;
    sampleSize: number;
  };
  
  evidenceList: Array<{
    title: string;
    type: string;
    reference: string;
    timestamp: string;
    source: string;
  }>;
  
  verdictNotes?: string;
  verdictDate?: string;
  verdictBy?: string;
  timeline: CaseAuditEntry[];
}

export interface Contractor {
  id: string;
  name: string;
  pan: string;
  registrationDate: string;
  district: string;
  state: string;
  totalProjects: number;
  totalValueRupees: number;
  delayRatePercentage: number;
  completionRatePercentage: number;
  cancellationRatePercentage: number;
  riskScore: number;
  districtConcentrationPercentage: number;
  topAgencies: string[];
  flagHistory: string[];
  activeProjects: number;
}

export interface ImplementingAgency {
  id: string;
  name: string;
  department: string;
  district: string;
  state: string;
  totalWorks: number;
  totalValueRupees: number;
  avgDelayDays: number;
  completionRatePercentage: number;
  costOverrunRatePercentage: number;
  complianceScorePercentage: number;
  riskLevel: RiskLevel;
  activeContractorCount: number;
  flaggedWorksCount: number;
}

export interface PolicyRule {
  id: string;
  code: string;
  documentName: string;
  section: string;
  page: number;
  title: string;
  effectiveDate: string;
  issuingAuthority: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  applicability: string;
  summary: string;
  textSnippet: string;
  requiredEvidence: string[];
}

export interface DistrictGeoStat {
  id: string;
  name: string;
  state: string;
  totalProjects: number;
  sanctionedAmountRupees: number;
  utilisationPercentage: number;
  highRiskProjectsCount: number;
  criticalRiskCount: number;
  delayRatePercentage: number;
  costAnomaliesCount: number;
  compositeRiskScore: number;
  coordinates: [number, number]; // [lat, lng]
}

export interface StateGeoStat {
  id: string;
  name: string;
  code: string;
  totalProjects: number;
  sanctionedAmountRupees: number;
  utilisationPercentage: number;
  highRiskCount: number;
  criticalCount: number;
  openCasesCount: number;
  compositeRiskScore: number;
  coordinates: [number, number];
}
