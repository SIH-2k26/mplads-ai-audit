/**
 * backendTransforms.ts — Shape Conversion Layer
 *
 * Pure functions that convert between backend snake_case shapes
 * and frontend camelCase shapes. This is the ONLY place where
 * field renaming / reshaping happens.
 */

import type { ProjectAssessmentInput, RiskAssessmentResult, WhyFlaggedContributor, RiskFactorItem, CompareMetricItem } from '../types/riskAssessment';
import type { BackendAnalysisResponse } from './api';

// ─── Frontend → Backend ─────────────────────────────────────

/**
 * Converts a frontend `ProjectAssessmentInput` form state into the
 * backend `{ project: ProjectInputSchema, documents: DocumentChecklistSchema }` payload.
 */
export function toBackendProjectInput(form: ProjectAssessmentInput): Record<string, any> {
  return {
    project: {
      project_id: form.projectId || 'MPLADS-CUSTOM-001',
      title: form.projectName || 'Unregistered Civil Work',
      category: form.category || 'Community',
      state: form.state || 'Maharashtra',
      district: form.district || 'Pune',
      constituency: form.district || 'Pune',
      sanction_amount: form.sanctionedAmount,
      estimated_cost: form.estimatedProjectCost,
      fund_released: form.amountReleased,
      total_expenditure: form.amountUtilized,
      physical_progress: form.physicalProgress,
      financial_progress: form.financialProgress,
      planned_duration_days: form.plannedDurationDays,
      actual_duration_days: form.actualDurationDays,
      bid_count: form.eligibleBidderCount,
      tender_amount: form.estimatedTenderAmount,
      actual_cost: form.selectedBidAmount,
      contractor_past_irregularity_rate: form.repeatedContractor ? 0.35 : 0.05,
    },
    documents: {
      administrative_sanction: form.administrativeApprovalAvailable ?? true,
      technical_sanction: form.technicalSanctionAvailable ?? true,
      dpr: true,
      work_order: true,
      measurement_book: form.documentationComplete ?? true,
      utilization_certificate: form.documentationComplete ?? true,
      completion_certificate: true,
      geo_tagged_photos: form.geoLocationVerified ?? true,
    },
  };
}

// ─── Backend → Frontend ─────────────────────────────────────

/**
 * Converts a backend `AnalysisResponse` into the frontend `RiskAssessmentResult`
 * shape that `AssessmentResultsView` renders.
 */
export function fromBackendAnalysisResponse(
  resp: BackendAnalysisResponse,
  originalInput: ProjectAssessmentInput
): RiskAssessmentResult {
  // Clip risk score to 5–99 range matching frontend display
  const riskScore = Math.min(99, Math.max(5, Math.round(resp.risk_score)));

  const riskLevel = (resp.risk_level || 'LOW') as RiskAssessmentResult['riskLevel'];

  // Map backend's 5 risk_components → frontend's 5 categoryScores
  // Backend dimensions:        supervised_ml, rule_compliance, unsupervised_anomaly, contractor_risk, evidence_integrity
  // Frontend display labels:   financial,     compliance,      execution,            procurement,     duplication
  const rc = resp.risk_components;
  const categoryScores = {
    financial: Math.min(100, Math.max(0, Math.round(rc.supervised_ml * 2.86))),        // scale ~0-35 → 0-100
    compliance: Math.min(100, Math.max(0, Math.round(rc.rule_compliance * 4.0))),       // scale ~0-25 → 0-100
    execution: Math.min(100, Math.max(0, Math.round(rc.unsupervised_anomaly * 5.0))),   // scale ~0-20 → 0-100
    procurement: Math.min(100, Math.max(0, Math.round(rc.contractor_risk * 4.0))),      // scale ~0-25 → 0-100
    duplication: Math.min(100, Math.max(0, Math.round(rc.evidence_integrity * 10.0))),   // scale ~0-10 → 0-100
  };

  // Compute derived metrics from original input (same as mock provider)
  const utilizationRate =
    originalInput.amountReleased > 0
      ? Math.min(100, Math.round((originalInput.amountUtilized / originalInput.amountReleased) * 100))
      : 0;

  const progressMismatchGap = Math.max(0, originalInput.financialProgress - originalInput.physicalProgress);

  const bidDeviationPercentage =
    originalInput.estimatedTenderAmount > 0
      ? Math.round(((originalInput.selectedBidAmount - originalInput.estimatedTenderAmount) / originalInput.estimatedTenderAmount) * 100)
      : 0;

  const costOverrunPotential =
    originalInput.estimatedProjectCost > 0
      ? Math.round(((originalInput.sanctionedAmount - originalInput.estimatedProjectCost) / originalInput.estimatedProjectCost) * 100)
      : 0;

  const timeOverrunDays = Math.max(0, originalInput.actualDurationDays - originalInput.plannedDurationDays);

  const derivedMetrics = {
    utilizationRate,
    progressMismatchGap,
    bidDeviationPercentage,
    costOverrunPotential,
    timeOverrunDays,
  };

  // Map compliance_findings → whyFlaggedContributors
  const whyFlaggedContributors: WhyFlaggedContributor[] =
    resp.compliance_findings.length > 0
      ? resp.compliance_findings.map((cf, idx) => ({
          id: cf.rule_id,
          index: String(idx + 1).padStart(2, '0'),
          title: cf.rule_name.toUpperCase(),
          summary: cf.description,
          observedLabel: 'Category',
          observedValue: cf.category,
          referenceLabel: 'Statutory Ref',
          referenceValue: cf.statutory_reference,
          riskContributionPoints: cf.severity === 'CRITICAL' ? 24 : cf.severity === 'HIGH' ? 18 : 12,
        }))
      : [
          {
            id: 'WF-OK',
            index: '01',
            title: 'BALANCED EXECUTION PROFILE',
            summary: 'Project parameters align with expected engineering tolerances and competitive guidelines.',
            observedLabel: 'Compliance',
            observedValue: 'All Passed',
            referenceLabel: 'Baseline',
            referenceValue: 'MPLADS Guidelines 2023',
            riskContributionPoints: 0,
          },
        ];

  // Map top_risk_factors + compliance_findings → riskFactors
  const riskFactors: RiskFactorItem[] =
    resp.compliance_findings.length > 0
      ? resp.compliance_findings.map((cf) => ({
          id: cf.rule_id,
          title: cf.rule_name,
          severity: (cf.severity as RiskFactorItem['severity']) || 'MEDIUM',
          category: cf.category.toUpperCase(),
          observedValue: cf.status,
          referenceValue: cf.statutory_reference,
          deviation: cf.status === 'VIOLATION' ? 'Non-compliant' : 'Warning',
          riskContribution: cf.severity === 'CRITICAL' ? 22 : cf.severity === 'HIGH' ? 16 : 10,
          whyItMatters: cf.description,
          recommendedVerification: resp.recommended_actions[0] || 'Conduct standard compliance review.',
        }))
      : [
          {
            id: 'RF-CLEAN',
            title: 'Standard Compliance Profile',
            severity: 'LOW' as const,
            category: 'COMPLIANCE',
            observedValue: 'All monitored metrics within statutory limits',
            referenceValue: 'MPLADS Guideline baseline',
            deviation: 'Nominal variance',
            riskContribution: 0,
            whyItMatters: 'Project demonstrates balanced disbursement, open competition, and verified documentation.',
            recommendedVerification: 'Continue standard quarterly milestone monitoring.',
          },
        ];

  // Build compareWithExpected from derived metrics (same logic as mock)
  const compareWithExpected: CompareMetricItem[] = [
    {
      label: 'Financial vs Physical Progress',
      observed: `${originalInput.financialProgress}% fin / ${originalInput.physicalProgress}% phy`,
      expected: '±10% delta',
      difference: `${progressMismatchGap} pts gap`,
      status: progressMismatchGap > 30 ? 'CRITICAL EXCEPTION' : progressMismatchGap > 15 ? 'SIGNIFICANT MISMATCH' : 'NORMAL',
      statusColor: progressMismatchGap > 30 ? 'red' : progressMismatchGap > 15 ? 'amber' : 'green',
    },
    {
      label: 'Tender Bid Markup',
      observed: `+${bidDeviationPercentage}%`,
      expected: '±5% PWD SoR',
      difference: `${bidDeviationPercentage > 0 ? '+' : ''}${bidDeviationPercentage}%`,
      status: bidDeviationPercentage > 25 ? 'SIGNIFICANT MISMATCH' : bidDeviationPercentage > 10 ? 'ELEVATED' : 'NORMAL',
      statusColor: bidDeviationPercentage > 25 ? 'red' : bidDeviationPercentage > 10 ? 'amber' : 'green',
    },
    {
      label: 'Tender Competition',
      observed: `${originalInput.eligibleBidderCount} bidder(s)`,
      expected: '≥ 3 eligible bidders',
      difference: originalInput.eligibleBidderCount < 3 ? `-${3 - originalInput.eligibleBidderCount}` : 'Compliant',
      status: originalInput.eligibleBidderCount <= 1 ? 'SIGNIFICANT MISMATCH' : 'NORMAL',
      statusColor: originalInput.eligibleBidderCount <= 1 ? 'amber' : 'green',
    },
    {
      label: 'Milestone Execution Delay',
      observed: `${timeOverrunDays} days overrun`,
      expected: '0 days',
      difference: `+${timeOverrunDays} days`,
      status: timeOverrunDays > 60 ? 'SIGNIFICANT MISMATCH' : timeOverrunDays > 20 ? 'ELEVATED' : 'NORMAL',
      statusColor: timeOverrunDays > 60 ? 'red' : timeOverrunDays > 20 ? 'amber' : 'green',
    },
    {
      label: 'Technical Sanction & Approvals',
      observed: originalInput.technicalSanctionAvailable ? 'Available' : 'Missing',
      expected: 'Mandatory',
      difference: originalInput.technicalSanctionAvailable ? 'Compliant' : 'Missing Prerequisite',
      status: originalInput.technicalSanctionAvailable ? 'NORMAL' : 'CRITICAL EXCEPTION',
      statusColor: originalInput.technicalSanctionAvailable ? 'green' : 'red',
    },
  ];

  return {
    assessmentId: `RA-${resp.timestamp.slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date(resp.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    projectId: resp.project_id,
    projectName: resp.project_title,
    category: originalInput.category,
    district: originalInput.district,
    state: originalInput.state,
    riskScore,
    riskLevel,
    demoConfidence: Math.round(resp.confidence * 100),
    modelType: `BACKEND_ML (${resp.ml_status})`,
    categoryScores,
    derivedMetrics,
    whyFlaggedContributors,
    riskFactors,
    compareWithExpected,
    recommendations: resp.recommended_actions,
    rawInputs: originalInput,
  };
}
