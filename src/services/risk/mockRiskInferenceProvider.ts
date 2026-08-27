import {
  ProjectAssessmentInput,
  RiskAssessmentResult,
  RiskInferenceProvider,
  DerivedMetrics,
  RiskCategoryScores,
  WhyFlaggedContributor,
  RiskFactorItem,
  CompareMetricItem,
  AssessmentRiskLevel,
} from '../../types/riskAssessment';

export const riskThresholds = {
  low: 29,
  medium: 59,
  high: 79,
};

export function getRiskLevelFromScore(score: number): AssessmentRiskLevel {
  if (score <= riskThresholds.low) return 'LOW';
  if (score <= riskThresholds.medium) return 'MEDIUM';
  if (score <= riskThresholds.high) return 'HIGH';
  return 'CRITICAL';
}

export const mockRiskInferenceProvider: RiskInferenceProvider = {
  async evaluateProject(input: ProjectAssessmentInput): Promise<RiskAssessmentResult> {
    // Simulate brief analytical pipeline execution (e.g. 50ms internal latency)
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 1. Calculate Derived Metrics
    const utilizationRate =
      input.amountReleased > 0
        ? Math.min(100, Math.round((input.amountUtilized / input.amountReleased) * 100))
        : 0;

    const progressMismatchGap = Math.max(0, input.financialProgress - input.physicalProgress);

    const bidDeviationPercentage =
      input.estimatedTenderAmount > 0
        ? Math.round(
            ((input.selectedBidAmount - input.estimatedTenderAmount) / input.estimatedTenderAmount) *
              100
          )
        : 0;

    const costOverrunPotential =
      input.estimatedProjectCost > 0
        ? Math.round(
            ((input.sanctionedAmount - input.estimatedProjectCost) / input.estimatedProjectCost) *
              100
          )
        : 0;

    const timeOverrunDays = Math.max(0, input.actualDurationDays - input.plannedDurationDays);

    const derivedMetrics: DerivedMetrics = {
      utilizationRate,
      progressMismatchGap,
      bidDeviationPercentage,
      costOverrunPotential,
      timeOverrunDays,
    };

    // 2. Compute Category Risk Scores (0 - 100 scale)
    // A. Financial Risk
    let financialScore = 15;
    if (utilizationRate > 85 && input.physicalProgress < 50) financialScore += 35;
    if (input.financialProgress > 80 && input.paymentCount > 4) financialScore += 20;
    if (costOverrunPotential > 20) financialScore += 20;
    financialScore = Math.min(100, Math.max(10, financialScore));

    // B. Execution Risk
    let executionScore = 10;
    if (progressMismatchGap > 30) executionScore += 45;
    else if (progressMismatchGap > 15) executionScore += 25;
    if (timeOverrunDays > 60) executionScore += 25;
    if (input.currentStatus === 'Delayed') executionScore += 15;
    executionScore = Math.min(100, Math.max(10, executionScore));

    // C. Procurement Risk
    let procurementScore = 12;
    if (input.eligibleBidderCount === 1) procurementScore += 35;
    else if (input.eligibleBidderCount === 2) procurementScore += 18;
    if (bidDeviationPercentage > 25) procurementScore += 30;
    else if (bidDeviationPercentage > 10) procurementScore += 15;
    if (input.contractorConcentrationPercentage > 40) procurementScore += 20;
    if (input.tenderType === 'Nomination') procurementScore += 30;
    procurementScore = Math.min(100, Math.max(8, procurementScore));

    // D. Compliance Risk
    let complianceScore = 10;
    if (!input.technicalSanctionAvailable) complianceScore += 40;
    if (!input.administrativeApprovalAvailable) complianceScore += 25;
    if (!input.documentationComplete) complianceScore += 20;
    if (!input.geoLocationVerified) complianceScore += 15;
    complianceScore = Math.min(100, Math.max(5, complianceScore));

    // E. Duplication Risk
    let duplicationScore = 8;
    if (input.duplicateWorkSuspected) duplicationScore += 55;
    if (input.nearbySimilarWork) duplicationScore += 25;
    if (input.repeatedContractor) duplicationScore += 20;
    duplicationScore = Math.min(100, Math.max(5, duplicationScore));

    const categoryScores: RiskCategoryScores = {
      financial: financialScore,
      execution: executionScore,
      procurement: procurementScore,
      compliance: complianceScore,
      duplication: duplicationScore,
    };

    // 3. Composite Weighted Risk Score
    // Weights: Execution (30%), Financial (25%), Procurement (20%), Compliance (15%), Duplication (10%)
    const rawWeighted =
      executionScore * 0.3 +
      financialScore * 0.25 +
      procurementScore * 0.2 +
      complianceScore * 0.15 +
      duplicationScore * 0.1;

    const riskScore = Math.min(99, Math.max(12, Math.round(rawWeighted)));
    const riskLevel = getRiskLevelFromScore(riskScore);

    // 4. Synthesize "Why Flagged?" explainable driver cards
    const whyFlaggedContributors: WhyFlaggedContributor[] = [];

    if (progressMismatchGap > 15) {
      whyFlaggedContributors.push({
        id: 'WF-01',
        index: '01',
        title: 'FINANCIAL / EXECUTION MISMATCH',
        summary:
          'Financial disbursement is significantly ahead of verified physical execution on site.',
        observedLabel: 'Financial Progress',
        observedValue: `${input.financialProgress}%`,
        referenceLabel: 'Physical Progress',
        referenceValue: `${input.physicalProgress}%`,
        riskContributionPoints: progressMismatchGap > 35 ? 24 : 16,
      });
    }

    if (bidDeviationPercentage > 15) {
      whyFlaggedContributors.push({
        id: 'WF-02',
        index: String(whyFlaggedContributors.length + 1).padStart(2, '0'),
        title: 'PROCUREMENT TENDER DEVIATION',
        summary:
          'Selected contract bid exceeds the engineer estimate beyond standard statutory tolerance.',
        observedLabel: 'Selected Bid',
        observedValue: `₹${(input.selectedBidAmount / 100000).toFixed(1)}L`,
        referenceLabel: 'Estimated Tender',
        referenceValue: `₹${(input.estimatedTenderAmount / 100000).toFixed(1)}L`,
        riskContributionPoints: bidDeviationPercentage > 30 ? 18 : 12,
      });
    }

    if (input.eligibleBidderCount <= 1 || input.tenderType === 'Nomination') {
      whyFlaggedContributors.push({
        id: 'WF-03',
        index: String(whyFlaggedContributors.length + 1).padStart(2, '0'),
        title: 'LOW BIDDER PARTICIPATION / NOMINATION',
        summary:
          input.tenderType === 'Nomination'
            ? 'Work was awarded via direct nomination without competitive bidding.'
            : 'Single eligible bidder recorded, indicating lack of competitive market discovery.',
        observedLabel: 'Eligible Bidders',
        observedValue: `${input.eligibleBidderCount} bidder`,
        referenceLabel: 'Statutory Norm',
        referenceValue: '≥ 3 competitive bids',
        riskContributionPoints: input.tenderType === 'Nomination' ? 18 : 14,
      });
    }

    if (input.duplicateWorkSuspected || input.nearbySimilarWork) {
      whyFlaggedContributors.push({
        id: 'WF-04',
        index: String(whyFlaggedContributors.length + 1).padStart(2, '0'),
        title: 'POTENTIAL SCHEME OVERLAP / DUPLICATION',
        summary:
          'Work scope and location indicate potential overlap with existing state or central infrastructure assets.',
        observedLabel: 'Duplication Flag',
        observedValue: input.duplicateWorkSuspected ? 'Suspected' : 'Nearby Similar',
        referenceLabel: 'Sanction Requirement',
        referenceValue: 'Non-duplication Certificate',
        riskContributionPoints: input.duplicateWorkSuspected ? 22 : 12,
      });
    }

    if (!input.technicalSanctionAvailable || !input.documentationComplete) {
      whyFlaggedContributors.push({
        id: 'WF-05',
        index: String(whyFlaggedContributors.length + 1).padStart(2, '0'),
        title: 'STATUTORY DOCUMENTATION DEFICIT',
        summary:
          'Mandatory Technical Sanction (TS) or Administrative Approval (AA) records are incomplete.',
        observedLabel: 'Technical Sanction',
        observedValue: input.technicalSanctionAvailable ? 'Available' : 'Missing',
        referenceLabel: 'MPLADS Guideline',
        referenceValue: 'Mandatory Pre-requisite',
        riskContributionPoints: 15,
      });
    }

    // Default driver if clean
    if (whyFlaggedContributors.length === 0) {
      whyFlaggedContributors.push({
        id: 'WF-OK',
        index: '01',
        title: 'BALANCED EXECUTION PROFILE',
        summary:
          'Project parameters align with expected engineering tolerances and competitive guidelines.',
        observedLabel: 'Progress Ratio',
        observedValue: 'Balanced (1.0)',
        referenceLabel: 'Tender Competition',
        referenceValue: `${input.eligibleBidderCount} Bidders`,
        riskContributionPoints: 0,
      });
    }

    // 5. Detailed In-Place Expandable RiskFactorItems
    const riskFactors: RiskFactorItem[] = [];

    if (progressMismatchGap > 10) {
      riskFactors.push({
        id: 'RF-EXP-01',
        title: 'Financial vs Physical Progress Mismatch',
        severity: progressMismatchGap > 30 ? 'CRITICAL' : 'HIGH',
        category: 'EXECUTION',
        observedValue: `${input.financialProgress}% financial / ${input.physicalProgress}% physical`,
        referenceValue: '±10% allowable progress delta',
        deviation: `+${progressMismatchGap} percentage points gap`,
        riskContribution: progressMismatchGap > 30 ? 24 : 14,
        whyItMatters:
          'Significant fund outflow before commensurate on-ground physical milestone completion introduces risk of idle funds or unverified advance disbursements.',
        recommendedVerification:
          'Inspect Measurement Book (MB) recordings and reconcile stage-wise milestone physical completion certificates.',
      });
    }

    if (bidDeviationPercentage > 10) {
      riskFactors.push({
        id: 'RF-PROC-01',
        title: 'Selected Bid Premium Over Estimated Cost',
        severity: bidDeviationPercentage > 25 ? 'HIGH' : 'MEDIUM',
        category: 'PROCUREMENT',
        observedValue: `+${bidDeviationPercentage}% over estimated tender`,
        referenceValue: 'PWD Schedule of Rates tolerance (±5%)',
        deviation: `+${bidDeviationPercentage}% deviation`,
        riskContribution: 16,
        whyItMatters:
          'Awarding contracts significantly above standard engineering estimates without technical rate justification leads to premature fund depletion.',
        recommendedVerification:
          'Review the Technical Sanction justification memo and comparative bid evaluation matrix.',
      });
    }

    if (input.eligibleBidderCount <= 1) {
      riskFactors.push({
        id: 'RF-PROC-02',
        title: 'Single-Bidder / Low Competition Tender',
        severity: 'HIGH',
        category: 'PROCUREMENT',
        observedValue: `${input.eligibleBidderCount} eligible bidder`,
        referenceValue: 'Minimum 3 competitive bids recommended',
        deviation: 'Single source participation',
        riskContribution: 15,
        whyItMatters:
          'Absence of multiple competitive bidders restricts fair price discovery and elevates risk of localized cartelization.',
        recommendedVerification:
          'Verify tender notice publication period and evaluate whether re-tendering was formally considered.',
      });
    }

    if (input.contractorConcentrationPercentage > 35) {
      riskFactors.push({
        id: 'RF-PROC-03',
        title: 'Contractor Volume Concentration',
        severity: input.contractorConcentrationPercentage > 60 ? 'CRITICAL' : 'HIGH',
        category: 'PROCUREMENT',
        observedValue: `${input.contractorConcentrationPercentage}% of sector works`,
        referenceValue: '< 25% recommended single-vendor cap',
        deviation: `+${input.contractorConcentrationPercentage - 25}% above norm`,
        riskContribution: 12,
        whyItMatters:
          'High concentration of multiple concurrent civil contracts with a single vendor increases execution bottleneck and default vulnerability.',
        recommendedVerification:
          'Check vendor active workload capacity and past performance delivery across other district line departments.',
      });
    }

    if (!input.technicalSanctionAvailable || !input.documentationComplete) {
      riskFactors.push({
        id: 'RF-COMP-01',
        title: 'Statutory Documentation & Pre-Check Deficit',
        severity: 'CRITICAL',
        category: 'COMPLIANCE',
        observedValue: input.technicalSanctionAvailable ? 'Missing documentation' : 'Missing Technical Sanction',
        referenceValue: 'Mandatory Technical Sanction & Land NOC',
        deviation: 'Non-compliant statutory prerequisite',
        riskContribution: 20,
        whyItMatters:
          'MPLADS Revised Guidelines strictly prohibit fund disbursement prior to formal Technical Sanction by a competent engineering authority.',
        recommendedVerification:
          'Issue compliance hold on further installments until formal Technical Sanction is submitted to District Planning Office.',
      });
    }

    if (input.duplicateWorkSuspected) {
      riskFactors.push({
        id: 'RF-DUP-01',
        title: 'Suspected Cross-Scheme Asset Duplication',
        severity: 'CRITICAL',
        category: 'DUPLICATION',
        observedValue: 'Potential overlap flagged with existing asset',
        referenceValue: 'Distinct non-duplicated civil asset',
        deviation: 'Spatial/asset duplication risk',
        riskContribution: 22,
        whyItMatters:
          'Double-charging civil works against both MPLADS and Central/State schemes (e.g. PMGSY, Jal Jeevan Mission) represents a major audit para.',
        recommendedVerification:
          'Conduct immediate physical site demarcation and compare GPS coordinates against State Asset GIS Registry.',
      });
    }

    if (riskFactors.length === 0) {
      riskFactors.push({
        id: 'RF-CLEAN',
        title: 'Standard Compliance Profile',
        severity: 'LOW',
        category: 'COMPLIANCE',
        observedValue: 'All monitored metrics within statutory limits',
        referenceValue: 'MPLADS Guideline baseline',
        deviation: 'Nominal variance',
        riskContribution: 0,
        whyItMatters:
          'Project demonstrates balanced disbursement, open competition, and verified documentation.',
        recommendedVerification:
          'Continue standard quarterly milestone monitoring and require GFR-12C Utilisation Certificate upon phase completion.',
      });
    }

    // 6. Compare With Expected Table
    const compareWithExpected: CompareMetricItem[] = [
      {
        label: 'Financial vs Physical Progress',
        observed: `${input.financialProgress}% fin / ${input.physicalProgress}% phy`,
        expected: '±10% delta',
        difference: `${progressMismatchGap} pts gap`,
        status:
          progressMismatchGap > 30
            ? 'CRITICAL EXCEPTION'
            : progressMismatchGap > 15
            ? 'SIGNIFICANT MISMATCH'
            : 'NORMAL',
        statusColor:
          progressMismatchGap > 30 ? 'red' : progressMismatchGap > 15 ? 'amber' : 'green',
      },
      {
        label: 'Tender Bid Markup',
        observed: `+${bidDeviationPercentage}%`,
        expected: '±5% PWD SoR',
        difference: `${bidDeviationPercentage > 0 ? '+' : ''}${bidDeviationPercentage}%`,
        status:
          bidDeviationPercentage > 25
            ? 'SIGNIFICANT MISMATCH'
            : bidDeviationPercentage > 10
            ? 'ELEVATED'
            : 'NORMAL',
        statusColor:
          bidDeviationPercentage > 25 ? 'red' : bidDeviationPercentage > 10 ? 'amber' : 'green',
      },
      {
        label: 'Tender Competition',
        observed: `${input.eligibleBidderCount} bidder(s)`,
        expected: '≥ 3 eligible bidders',
        difference: `${input.eligibleBidderCount < 3 ? '-' + (3 - input.eligibleBidderCount) : 'Compliant'}`,
        status: input.eligibleBidderCount <= 1 ? 'SIGNIFICANT MISMATCH' : 'NORMAL',
        statusColor: input.eligibleBidderCount <= 1 ? 'amber' : 'green',
      },
      {
        label: 'Milestone Execution Delay',
        observed: `${timeOverrunDays} days overrun`,
        expected: '0 days',
        difference: `+${timeOverrunDays} days`,
        status:
          timeOverrunDays > 60
            ? 'SIGNIFICANT MISMATCH'
            : timeOverrunDays > 20
            ? 'ELEVATED'
            : 'NORMAL',
        statusColor: timeOverrunDays > 60 ? 'red' : timeOverrunDays > 20 ? 'amber' : 'green',
      },
      {
        label: 'Technical Sanction & Approvals',
        observed: input.technicalSanctionAvailable ? 'Available' : 'Missing',
        expected: 'Mandatory',
        difference: input.technicalSanctionAvailable ? 'Compliant' : 'Missing Prerequisite',
        status: input.technicalSanctionAvailable ? 'NORMAL' : 'CRITICAL EXCEPTION',
        statusColor: input.technicalSanctionAvailable ? 'green' : 'red',
      },
    ];

    // 7. Non-accusatory Decision-Support Recommendations
    const recommendations: string[] = [];

    if (progressMismatchGap > 20) {
      recommendations.push(
        'Conduct physical field inspection by an Executive Engineer to verify actual on-site progress before approving subsequent payment installments.'
      );
      recommendations.push(
        'Request certified Measurement Book (MB) extracts and contractor running account (RA) bills from the Implementing Agency.'
      );
    }

    if (bidDeviationPercentage > 20 || input.eligibleBidderCount <= 1) {
      recommendations.push(
        'Review the tender evaluation committee proceedings to ascertain if adequate publicity was given prior to contract award.'
      );
    }

    if (input.duplicateWorkSuspected) {
      recommendations.push(
        'Verify geo-coordinates against PMGSY, Jal Jeevan Mission, and State PWD asset databases to prevent dual funding.'
      );
    }

    if (!input.technicalSanctionAvailable || !input.documentationComplete) {
      recommendations.push(
        'Place a provisional administrative hold on further disbursements until formal Technical Sanction and Land Availability NOC are furnished.'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Continue standard quarterly monitoring and ensure GFR-12C Utilisation Certificate is submitted within 45 days of milestone completion.'
      );
      recommendations.push(
        'Ensure geo-tagged high-resolution stage photographs are uploaded to the eSAKSHI repository.'
      );
    }

    return {
      assessmentId: `RA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        100 + Math.random() * 900
      )}`,
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      projectId: input.projectId || 'MPLADS-CUSTOM-001',
      projectName: input.projectName || 'Unregistered Civil Work',
      category: input.category,
      district: input.district,
      state: input.state,

      riskScore,
      riskLevel,
      demoConfidence: 91,
      modelType: 'RULE_BASED_PROTOTYPE',

      categoryScores,
      derivedMetrics,
      whyFlaggedContributors,
      riskFactors,
      compareWithExpected,
      recommendations,

      rawInputs: input,
    };
  },
};
