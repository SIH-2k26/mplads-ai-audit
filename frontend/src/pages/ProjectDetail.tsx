// Project Detail Page — frontend/src/pages/ProjectDetail.tsx
// The primary page for testing backend intelligence.
// Displays all backend-computed intelligence without any frontend calculations.

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Building2, User, Calendar } from 'lucide-react';

import {
  LoadingState, ErrorState, RiskBadge, StatusBadge,
  SectionCard, PageHeader,
} from '../components/common';
import RiskScoreCard from '../components/risk/RiskScoreCard';
import RiskFingerprintComponent from '../components/risk/RiskFingerprint';
import ShapExplainability from '../components/risk/ShapExplainability';
import EarlyWarning from '../components/risk/EarlyWarning';
import AgentCard from '../components/agents/AgentCard';
import EvidenceCard from '../components/evidence/EvidenceCard';
import ProjectTimeline from '../components/timeline/ProjectTimeline';
import {
  RiskTrajectoryChart, FinancialChart, ProgressChart,
} from '../components/charts';

import { useProject } from '../hooks/useProject';
import { useProjectRisk, useRiskHistory, useShapExplanation, useEarlyWarnings } from '../hooks/useRisk';
import { getProjectAgents } from '../api/agentApi';
import type { AllAgentResults } from '../types/agent';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const id = decodeURIComponent(projectId ?? '');

  const { project, loading: projLoading, error: projError, retry: retryProject } = useProject(id);
  const { risk, loading: riskLoading, error: riskError } = useProjectRisk(id);
  const { history, loading: histLoading } = useRiskHistory(id);
  const { shap, loading: shapLoading } = useShapExplanation(id);
  const { warnings, loading: warnLoading } = useEarlyWarnings(id);

  const [agents, setAgents] = useState<AllAgentResults | null>(null);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [agentsError, setAgentsError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setAgentsLoading(true);
    getProjectAgents(id)
      .then(setAgents)
      .catch((e) => setAgentsError(e instanceof Error ? e.message : 'Failed to load agent results'))
      .finally(() => setAgentsLoading(false));
  }, [id]);

  if (projLoading) return <LoadingState message="Loading project data..." />;
  if (projError) return <ErrorState message={projError} onRetry={retryProject} />;
  if (!project) return <ErrorState message="Project not found." />;

  const flaggedAgents = agents?.agents.filter((a) => a.status === 'FLAG' || a.status === 'WARN') ?? [];
  const passedAgents = agents?.agents.filter((a) => a.status === 'PASS') ?? [];
  const naAgents = agents?.agents.filter((a) => a.status === 'NOT_APPLICABLE' || a.status === 'SKIPPED') ?? [];

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </button>

      {/* Project Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-slate-400 mb-1">{project.projectId}</p>
            <h1 className="text-lg font-bold text-slate-900">{project.projectName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5" />
                {project.district}, {project.state}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Building2 className="w-3.5 h-3.5" />
                {project.agency}
              </span>
              {project.contractor && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5" />
                  {project.contractor}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                Updated: {formatDate(project.lastUpdated)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <RiskBadge level={project.riskLevel} />
          </div>
        </div>

        {/* Key stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Sanctioned Amount</p>
            <p className="text-base font-bold text-slate-800">{formatCurrency(project.sanctionedAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Expenditure</p>
            <p className="text-base font-bold text-slate-800">{formatCurrency(project.expenditure)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Financial Progress</p>
            <p className="text-base font-bold text-blue-600">{formatPercent(project.financialProgress)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Physical Progress</p>
            <p className="text-base font-bold text-green-600">{formatPercent(project.physicalProgress)}</p>
          </div>
        </div>
      </div>

      {/* RISK SUMMARY */}
      <SectionCard
        title="Risk Summary"
        subtitle="Computed by backend risk engine — not calculated in frontend"
      >
        {riskLoading ? (
          <LoadingState message="Loading risk assessment..." />
        ) : riskError ? (
          <ErrorState message={riskError} />
        ) : risk ? (
          <RiskScoreCard risk={risk} />
        ) : null}
      </SectionCard>

      {/* RISK EXPLANATION */}
      {risk?.explanation && (
        <SectionCard title="Risk Explanation" subtitle="Narrative generated by backend">
          <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4">
            <p className="text-sm text-red-800 leading-relaxed">{risk.explanation}</p>
          </div>
        </SectionCard>
      )}

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk Fingerprint */}
        <SectionCard
          title="Risk Fingerprint"
          subtitle="Backend-generated risk signals (0–100)"
        >
          {riskLoading ? (
            <LoadingState />
          ) : risk ? (
            <RiskFingerprintComponent fingerprint={risk.fingerprint} />
          ) : null}
        </SectionCard>

        {/* ML Explainability */}
        <SectionCard
          title="ML Explainability (SHAP)"
          subtitle="Feature contributions — backend ML model output"
        >
          {shapLoading ? (
            <LoadingState />
          ) : shap ? (
            <ShapExplainability shap={shap} />
          ) : null}
        </SectionCard>
      </div>

      {/* Early Warning */}
      <SectionCard
        title="Early Warning Predictions"
        subtitle="Backend ML predictions — not frontend logic"
      >
        {warnLoading ? (
          <LoadingState />
        ) : warnings ? (
          <EarlyWarning warnings={warnings} />
        ) : null}
      </SectionCard>

      {/* Agent Results */}
      <SectionCard
        title="AI Agent Results"
        subtitle={`${agents?.agents.length ?? 0} agents evaluated — results from backend`}
      >
        {agentsLoading ? (
          <LoadingState message="Running AI agents..." />
        ) : agentsError ? (
          <ErrorState message={agentsError} />
        ) : agents ? (
          <div className="space-y-4">
            {/* Flagged / Warnings */}
            {flaggedAgents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  ⚑ Flagged / Warnings ({flaggedAgents.length})
                </p>
                <div className="space-y-2">
                  {flaggedAgents.map((a) => <AgentCard key={a.agentId} agent={a} />)}
                </div>
              </div>
            )}

            {/* Passed */}
            {passedAgents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  ✓ Passed ({passedAgents.length})
                </p>
                <div className="space-y-2">
                  {passedAgents.map((a) => <AgentCard key={a.agentId} agent={a} />)}
                </div>
              </div>
            )}

            {/* N/A */}
            {naAgents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Not Applicable / Skipped ({naAgents.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {naAgents.map((a) => (
                    <div key={a.agentId} className="text-xs bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-slate-400">
                      {a.agentName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </SectionCard>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <SectionCard title="Project Timeline">
          <ProjectTimeline project={project} />
        </SectionCard>

        {/* Financial */}
        <SectionCard title="Financial Analysis" subtitle="₹ in Lakhs">
          <div className="space-y-3 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Sanctioned</span>
              <span className="font-medium text-slate-700">{formatCurrency(project.sanctionedAmount)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Expenditure</span>
              <span className="font-medium text-slate-700">{formatCurrency(project.expenditure)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Utilization</span>
              <span className="font-bold text-blue-600">
                {formatPercent((project.expenditure / project.sanctionedAmount) * 100)}
              </span>
            </div>
          </div>
          <FinancialChart
            sanctioned={project.sanctionedAmount}
            expenditure={project.expenditure}
            estimated={project.estimatedCost}
          />
        </SectionCard>

        {/* Progress */}
        <SectionCard title="Progress Analysis">
          <div className="space-y-3 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Financial Progress</span>
              <span className="font-bold text-blue-600">{formatPercent(project.financialProgress)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Physical Progress</span>
              <span className="font-bold text-green-600">{formatPercent(project.physicalProgress)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Progress Gap</span>
              <span className={`font-bold ${(project.financialProgress - project.physicalProgress) > 20 ? 'text-red-600' : 'text-slate-700'}`}>
                {formatPercent(Math.abs(project.financialProgress - project.physicalProgress))}
              </span>
            </div>
          </div>
          <ProgressChart
            financialProgress={project.financialProgress}
            physicalProgress={project.physicalProgress}
          />
        </SectionCard>
      </div>

      {/* Risk Trajectory */}
      <SectionCard
        title="Risk Trajectory"
        subtitle="Historical risk score — computed by backend"
      >
        {histLoading ? (
          <LoadingState />
        ) : history ? (
          <RiskTrajectoryChart history={history} />
        ) : null}
      </SectionCard>

      {/* Policy Evidence (from case data — shown if available) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Policy / RAG Evidence</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Retrieved by backend RAG engine from MPLADS policy documents
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 text-center text-sm text-slate-400">
          Policy evidence is retrieved from Investigation Cases.
          <br />
          <button
            onClick={() => navigate('/cases')}
            className="text-blue-600 hover:text-blue-800 text-xs mt-1 inline-block"
          >
            View Investigation Cases →
          </button>
        </div>
      </div>
    </div>
  );
}
