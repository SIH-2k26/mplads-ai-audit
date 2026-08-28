import { Project } from '../types';

export interface MpProfileData {
  id: string;
  name: string;
  constituency: string;
  state: string;
  house: 'Lok Sabha' | 'Rajya Sabha';
  term: string;
  party: string;
  photoUrl?: string;
  financial: {
    annualEntitlement: number; // in Cr
    allocated: number;
    released: number;
    utilized: number;
    remaining: number;
    utilizationRate: number; // percentage
    unutilizedFunds: number;
    fundsAtLapseRisk: number;
    avgReleaseToExpenseDays: number;
    yearWiseExpense: { year: string; allocated: number; utilized: number }[];
  };
  recommendations: {
    recommended: number;
    sanctioned: number;
    rejected: number;
    pendingApproval: number;
    sanctionRate: number;
    avgSanctionDays: number;
    categoryDistribution: { category: string; count: number; outlay: number }[];
  };
  execution: {
    completed: number;
    underExecution: number;
    delayed: number;
    pending: number;
    completionRate: number;
    avgCompletionDays: number;
    avgDelayDays: number;
    maxDelayDays: number;
    approachingDeadline: number;
  };
  compliance: {
    score: number; // 0-100
    preSanctionFailures: number;
    tenderExceptions: number;
    missingDocs: number;
    delayedReporting: number;
    paymentIrregularities: number;
    duplicateAlerts: number;
    costOutliers: number;
    fundParkingAlerts: number;
    crossSchemeAlerts: number;
  };
  aiMonitoring: {
    portfolioRisk: number; // 0-100
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    highRiskWorks: number;
    mediumRiskWorks: number;
    lowRiskWorks: number;
    activeAlerts: number;
    unresolvedAlerts: number;
    confirmedIssues: number;
    falsePositiveRate: number;
    contractorConcentrationRate: number; // %
    costDeviationVsBenchmark: number; // %
    topArchetypes: string[];
    riskContributors: { factor: string; delta: number; desc: string }[];
    aiExecutiveSummary: string;
    riskTrajectory: { month: string; score: number }[];
  };
}

export const mockMpProfiles: MpProfileData[] = [
  {
    id: 'MP-PUN-01',
    name: 'Shri Murlidhar Mohol',
    constituency: 'Pune',
    state: 'Maharashtra',
    house: 'Lok Sabha',
    term: '18th Lok Sabha',
    party: 'BJP',
    financial: {
      annualEntitlement: 5.0,
      allocated: 15.0,
      released: 14.7,
      utilized: 13.8,
      remaining: 0.9,
      utilizationRate: 93.9,
      unutilizedFunds: 0.9,
      fundsAtLapseRisk: 0.25,
      avgReleaseToExpenseDays: 48,
      yearWiseExpense: [
        { year: '2021-22', allocated: 5.0, utilized: 4.8 },
        { year: '2022-23', allocated: 5.0, utilized: 4.6 },
        { year: '2023-24', allocated: 5.0, utilized: 4.4 },
      ],
    },
    recommendations: {
      recommended: 54,
      sanctioned: 48,
      rejected: 2,
      pendingApproval: 4,
      sanctionRate: 88.9,
      avgSanctionDays: 32,
      categoryDistribution: [
        { category: 'Roads & Bridges', count: 18, outlay: 5.4 },
        { category: 'Community Halls', count: 12, outlay: 3.8 },
        { category: 'Public Health', count: 10, outlay: 2.6 },
        { category: 'Drinking Water & Sanitation', count: 8, outlay: 2.0 },
      ],
    },
    execution: {
      completed: 38,
      underExecution: 12,
      delayed: 6,
      pending: 4,
      completionRate: 79.2,
      avgCompletionDays: 245,
      avgDelayDays: 21,
      maxDelayDays: 114,
      approachingDeadline: 3,
    },
    compliance: {
      score: 94,
      preSanctionFailures: 1,
      tenderExceptions: 2,
      missingDocs: 2,
      delayedReporting: 1,
      paymentIrregularities: 0,
      duplicateAlerts: 2,
      costOutliers: 1,
      fundParkingAlerts: 0,
      crossSchemeAlerts: 1,
    },
    aiMonitoring: {
      portfolioRisk: 52,
      riskLevel: 'MODERATE',
      highRiskWorks: 4,
      mediumRiskWorks: 8,
      lowRiskWorks: 36,
      activeAlerts: 5,
      unresolvedAlerts: 2,
      confirmedIssues: 1,
      falsePositiveRate: 12.5,
      contractorConcentrationRate: 38.5,
      costDeviationVsBenchmark: 14.2,
      topArchetypes: ['COST INFLATION', 'CONTRACTOR CONCENTRATION', 'YEAR-END RUSH'],
      riskContributors: [
        { factor: 'Cost deviation vs PWD SoR', delta: 18, desc: 'P-1023 Community Hall shows +38.2% variance vs district median' },
        { factor: 'Milestone execution delay', delta: 16, desc: '6 works currently delayed beyond statutory SLA limits' },
        { factor: 'Tender contractor concentration', delta: 14, desc: 'M/s Sahyadri Buildtech holds 38.5% of total ward outlay' },
        { factor: 'Spatial duplicate proximity', delta: 11, desc: '2 road works within 2.1km of existing PMGSY assets' },
      ],
      aiExecutiveSummary: 'Portfolio health is overall robust with 93.9% fund utilization. Anomaly engine flags 4 high-risk works primarily driven by SoR cost variances in Ward 17 and tender concentration with M/s Sahyadri Buildtech.',
      riskTrajectory: [
        { month: 'Jan', score: 38 },
        { month: 'Feb', score: 41 },
        { month: 'Mar', score: 48 },
        { month: 'Apr', score: 56 },
        { month: 'May', score: 52 },
      ],
    },
  },
  {
    id: 'MP-BAR-02',
    name: 'Smt. Supriya Sule',
    constituency: 'Baramati',
    state: 'Maharashtra',
    house: 'Lok Sabha',
    term: '18th Lok Sabha',
    party: 'NCP-SP',
    financial: {
      annualEntitlement: 5.0,
      allocated: 15.0,
      released: 14.5,
      utilized: 10.2,
      remaining: 4.3,
      utilizationRate: 70.3,
      unutilizedFunds: 4.3,
      fundsAtLapseRisk: 1.8,
      avgReleaseToExpenseDays: 78,
      yearWiseExpense: [
        { year: '2021-22', allocated: 5.0, utilized: 4.1 },
        { year: '2022-23', allocated: 5.0, utilized: 3.5 },
        { year: '2023-24', allocated: 5.0, utilized: 2.6 },
      ],
    },
    recommendations: {
      recommended: 51,
      sanctioned: 41,
      rejected: 4,
      pendingApproval: 6,
      sanctionRate: 80.4,
      avgSanctionDays: 52,
      categoryDistribution: [
        { category: 'Drinking Water & Sanitation', count: 20, outlay: 6.2 },
        { category: 'Roads & Bridges', count: 15, outlay: 4.8 },
        { category: 'Education', count: 10, outlay: 2.5 },
        { category: 'Public Health', count: 6, outlay: 1.5 },
      ],
    },
    execution: {
      completed: 29,
      underExecution: 14,
      delayed: 11,
      pending: 6,
      completionRate: 56.9,
      avgCompletionDays: 310,
      avgDelayDays: 74,
      maxDelayDays: 180,
      approachingDeadline: 8,
    },
    compliance: {
      score: 82,
      preSanctionFailures: 3,
      tenderExceptions: 5,
      missingDocs: 4,
      delayedReporting: 3,
      paymentIrregularities: 1,
      duplicateAlerts: 3,
      costOutliers: 5,
      fundParkingAlerts: 2,
      crossSchemeAlerts: 2,
    },
    aiMonitoring: {
      portfolioRisk: 72,
      riskLevel: 'HIGH',
      highRiskWorks: 7,
      mediumRiskWorks: 14,
      lowRiskWorks: 20,
      activeAlerts: 9,
      unresolvedAlerts: 6,
      confirmedIssues: 2,
      falsePositiveRate: 10.0,
      contractorConcentrationRate: 47.0,
      costDeviationVsBenchmark: 28.6,
      topArchetypes: ['FUND PARKING', 'REPEATED DELAY', 'TENDER BYPASS'],
      riskContributors: [
        { factor: 'Unutilized fund parking in district accounts', delta: 24, desc: '₹4.3 Cr unspent for >180 days with executing agencies' },
        { factor: 'Execution delays in rural water works', delta: 22, desc: 'Average project completion lag of +74 days' },
        { factor: 'Single-bid tender awards', delta: 18, desc: '5 tenders awarded with single bidder participation' },
        { factor: 'Cost outlier deviations', delta: 14, desc: 'Solar RO water units pricing +42% higher than state median' },
      ],
      aiExecutiveSummary: 'Portfolio risk has risen to 72/100 HIGH RISK. Slow execution velocity (+74 days average lag) combined with substantial unutilized fund parking (₹4.3 Cr) and single-bid procurement anomalies require priority district audit attention.',
      riskTrajectory: [
        { month: 'Jan', score: 54 },
        { month: 'Feb', score: 62 },
        { month: 'Mar', score: 68 },
        { month: 'Apr', score: 75 },
        { month: 'May', score: 72 },
      ],
    },
  },
  {
    id: 'MP-HAV-03',
    name: 'Shri Shrirang Barne',
    constituency: 'Maval',
    state: 'Maharashtra',
    house: 'Lok Sabha',
    term: '18th Lok Sabha',
    party: 'SHS',
    financial: {
      annualEntitlement: 5.0,
      allocated: 15.0,
      released: 14.8,
      utilized: 14.1,
      remaining: 0.7,
      utilizationRate: 95.3,
      unutilizedFunds: 0.7,
      fundsAtLapseRisk: 0.1,
      avgReleaseToExpenseDays: 38,
      yearWiseExpense: [
        { year: '2021-22', allocated: 5.0, utilized: 4.9 },
        { year: '2022-23', allocated: 5.0, utilized: 4.7 },
        { year: '2023-24', allocated: 5.0, utilized: 4.5 },
      ],
    },
    recommendations: {
      recommended: 37,
      sanctioned: 35,
      rejected: 1,
      pendingApproval: 1,
      sanctionRate: 94.6,
      avgSanctionDays: 24,
      categoryDistribution: [
        { category: 'Roads & Bridges', count: 16, outlay: 6.8 },
        { category: 'Education', count: 11, outlay: 4.2 },
        { category: 'Public Health', count: 8, outlay: 3.1 },
      ],
    },
    execution: {
      completed: 34,
      underExecution: 3,
      delayed: 1,
      pending: 1,
      completionRate: 91.9,
      avgCompletionDays: 198,
      avgDelayDays: 18,
      maxDelayDays: 35,
      approachingDeadline: 1,
    },
    compliance: {
      score: 98,
      preSanctionFailures: 0,
      tenderExceptions: 1,
      missingDocs: 1,
      delayedReporting: 0,
      paymentIrregularities: 0,
      duplicateAlerts: 1,
      costOutliers: 0,
      fundParkingAlerts: 0,
      crossSchemeAlerts: 0,
    },
    aiMonitoring: {
      portfolioRisk: 22,
      riskLevel: 'LOW',
      highRiskWorks: 1,
      mediumRiskWorks: 3,
      lowRiskWorks: 31,
      activeAlerts: 1,
      unresolvedAlerts: 0,
      confirmedIssues: 0,
      falsePositiveRate: 20.0,
      contractorConcentrationRate: 21.0,
      costDeviationVsBenchmark: 5.4,
      topArchetypes: [],
      riskContributors: [
        { factor: 'Minor milestone delay on culvert', delta: 8, desc: '1 road bridge work delayed by 35 days due to monsoons' },
      ],
      aiExecutiveSummary: 'Strong overall implementation with exemplary 95.3% fund utilization, 91.9% completion rate and robust compliance score (98/100). Anomaly exposure is negligible.',
      riskTrajectory: [
        { month: 'Jan', score: 28 },
        { month: 'Feb', score: 25 },
        { month: 'Mar', score: 23 },
        { month: 'Apr', score: 22 },
        { month: 'May', score: 22 },
      ],
    },
  },
  {
    id: 'MP-DEL-04',
    name: 'Shri Harsh Malhotra',
    constituency: 'East Delhi',
    state: 'NCT of Delhi',
    house: 'Lok Sabha',
    term: '18th Lok Sabha',
    party: 'BJP',
    financial: {
      annualEntitlement: 5.0,
      allocated: 15.0,
      released: 13.5,
      utilized: 8.7,
      remaining: 4.8,
      utilizationRate: 64.4,
      unutilizedFunds: 4.8,
      fundsAtLapseRisk: 2.1,
      avgReleaseToExpenseDays: 92,
      yearWiseExpense: [
        { year: '2021-22', allocated: 5.0, utilized: 3.2 },
        { year: '2022-23', allocated: 5.0, utilized: 2.8 },
        { year: '2023-24', allocated: 5.0, utilized: 2.7 },
      ],
    },
    recommendations: {
      recommended: 63,
      sanctioned: 44,
      rejected: 8,
      pendingApproval: 11,
      sanctionRate: 69.8,
      avgSanctionDays: 68,
      categoryDistribution: [
        { category: 'Community Facilities', count: 25, outlay: 6.0 },
        { category: 'Education & STEM', count: 18, outlay: 4.5 },
        { category: 'Sanitation', count: 15, outlay: 3.0 },
      ],
    },
    execution: {
      completed: 31,
      underExecution: 16,
      delayed: 14,
      pending: 11,
      completionRate: 49.2,
      avgCompletionDays: 340,
      avgDelayDays: 103,
      maxDelayDays: 220,
      approachingDeadline: 12,
    },
    compliance: {
      score: 71,
      preSanctionFailures: 5,
      tenderExceptions: 8,
      missingDocs: 7,
      delayedReporting: 4,
      paymentIrregularities: 2,
      duplicateAlerts: 6,
      costOutliers: 8,
      fundParkingAlerts: 4,
      crossSchemeAlerts: 3,
    },
    aiMonitoring: {
      portfolioRisk: 84,
      riskLevel: 'CRITICAL',
      highRiskWorks: 11,
      mediumRiskWorks: 18,
      lowRiskWorks: 15,
      activeAlerts: 14,
      unresolvedAlerts: 9,
      confirmedIssues: 4,
      falsePositiveRate: 8.0,
      contractorConcentrationRate: 54.0,
      costDeviationVsBenchmark: 36.8,
      topArchetypes: ['PROJECT SPLITTING', 'COST INFLATION', 'ROLLING DUPLICATE'],
      riskContributors: [
        { factor: 'Project splitting below statutory tender limits', delta: 28, desc: '8 works sanctioned at ₹9.95 Lakhs to bypass e-tender rules' },
        { factor: 'Cost outliers vs Delhi PWD Schedule of Rates', delta: 24, desc: 'Smart classroom electronics priced +36.8% above GeM rates' },
        { factor: 'High project backlog & execution delays', delta: 20, desc: '14 delayed projects with average +103 days overdue' },
        { factor: 'Duplicate works across municipal wards', delta: 16, desc: '6 community centres flagged for municipal fund overlap' },
      ],
      aiExecutiveSummary: 'Critical risk profile (84/100). Low utilization (64.4%), high backlog, and significant anomaly clustering around project splitting below ₹10 Lakhs and tender bypass.',
      riskTrajectory: [
        { month: 'Jan', score: 68 },
        { month: 'Feb', score: 74 },
        { month: 'Mar', score: 79 },
        { month: 'Apr', score: 82 },
        { month: 'May', score: 84 },
      ],
    },
  },
];
