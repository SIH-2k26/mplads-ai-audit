// Cases / Investigation page — frontend/src/pages/Cases.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronDown, ChevronUp, CheckCircle, XCircle, AlertTriangle, ArrowUpRight, Minus } from 'lucide-react';
import {
  RiskBadge, StatusBadge, LoadingState, ErrorState, EmptyState, PageHeader,
} from '../components/common';
import EvidenceCard from '../components/evidence/EvidenceCard';
import { getCases, submitVerdict } from '../api/caseApi';
import { formatDate, formatDateTime } from '../utils/formatters';
import type { InvestigationCase, CaseStatus, VerdictType, VerdictSubmission } from '../types/case';

const CASE_STATUSES: CaseStatus[] = [
  'OPEN', 'UNDER_INVESTIGATION', 'PENDING_REVIEW', 'ESCALATED', 'CLOSED',
];

const VERDICT_OPTIONS: { type: VerdictType; label: string; icon: React.ComponentType<{className?: string}>; color: string }[] = [
  { type: 'CONFIRMED_ISSUE', label: 'Confirm Issue', icon: CheckCircle, color: 'bg-red-600 hover:bg-red-700 text-white' },
  { type: 'FALSE_POSITIVE', label: 'False Positive', icon: XCircle, color: 'bg-green-600 hover:bg-green-700 text-white' },
  { type: 'INSUFFICIENT_EVIDENCE', label: 'Insufficient Evidence', icon: Minus, color: 'bg-amber-600 hover:bg-amber-700 text-white' },
  { type: 'ESCALATED', label: 'Escalate', icon: ArrowUpRight, color: 'bg-purple-600 hover:bg-purple-700 text-white' },
  { type: 'NO_ACTION_REQUIRED', label: 'No Action', icon: Shield, color: 'bg-slate-600 hover:bg-slate-700 text-white' },
];

export default function Cases() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');

  // Verdict form state
  const [verdictForm, setVerdictForm] = useState<{ caseId: string; officerName: string; remarks: string } | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<VerdictType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getCases(statusFilter ? { status: statusFilter } : undefined)
      .then((r) => setCases(r.items))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load cases'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleSubmitVerdict = async (c: InvestigationCase) => {
    if (!selectedVerdict || !verdictForm) return;
    setSubmitting(true);
    try {
      const sub: VerdictSubmission = {
        caseId: c.caseId,
        verdictType: selectedVerdict,
        officerName: verdictForm.officerName,
        remarks: verdictForm.remarks,
      };
      await submitVerdict(sub);
      setVerdictForm(null);
      setSelectedVerdict(null);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to submit verdict');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Investigation Cases" subtitle={`${cases.length} cases`} />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          {CASE_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <button onClick={() => setStatusFilter('')}
          className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Clear</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <LoadingState message="Loading investigation cases..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : !cases.length ? (
          <EmptyState title="No cases found" />
        ) : (
          <div className="divide-y divide-slate-50">
            {/* Header */}
            <div className="grid grid-cols-12 text-xs font-medium text-slate-400 uppercase tracking-wider bg-slate-50 px-5 py-3">
              <span className="col-span-2">Case ID</span>
              <span className="col-span-3">Project</span>
              <span className="col-span-2">Primary Concern</span>
              <span className="col-span-1 text-right">Risk</span>
              <span className="col-span-1">Level</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-1">Assigned</span>
              <span className="col-span-1 text-right">Created</span>
            </div>

            {cases.map((c) => (
              <div key={c.caseId}>
                <button
                  onClick={() => setExpanded(expanded === c.caseId ? null : c.caseId)}
                  className="w-full grid grid-cols-12 items-center gap-2 px-5 py-3 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="col-span-2 text-xs font-mono text-slate-500">{c.caseId}</span>
                  <div className="col-span-3">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.projectName}</p>
                    <p className="text-xs text-slate-400">{c.district}, {c.state}</p>
                  </div>
                  <p className="col-span-2 text-xs text-slate-600 truncate">{c.primaryConcern}</p>
                  <span className={`col-span-1 text-sm font-bold text-right ${
                    c.riskScore >= 80 ? 'text-rose-700' :
                    c.riskScore >= 60 ? 'text-red-600' :
                    c.riskScore >= 40 ? 'text-amber-600' : 'text-green-600'
                  }`}>{c.riskScore}</span>
                  <span className="col-span-1"><RiskBadge level={c.riskLevel} size="sm" /></span>
                  <span className="col-span-1"><StatusBadge status={c.status} /></span>
                  <span className="col-span-1 text-xs text-slate-400 truncate">{c.assignedTo?.split(',')[0] ?? '—'}</span>
                  <span className="col-span-1 text-xs text-slate-400 text-right">{formatDate(c.createdAt)}</span>
                </button>

                {/* Expanded */}
                {expanded === c.caseId && (
                  <div className="px-5 pb-5 bg-slate-50 border-t border-slate-100 space-y-4">
                    {/* Info row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      {c.agencyHistory && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Agency History</p>
                          <p className="text-xs text-slate-600">{c.agencyHistory}</p>
                        </div>
                      )}
                      {c.contractorHistory && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Contractor History</p>
                          <p className="text-xs text-slate-600">{c.contractorHistory}</p>
                        </div>
                      )}
                      {c.geographicInfo && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Geographic Information</p>
                          <p className="text-xs text-slate-600">{c.geographicInfo}</p>
                        </div>
                      )}
                    </div>

                    {/* Policy Evidence */}
                    {c.policyEvidence && c.policyEvidence.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                          Policy / RAG Evidence
                        </p>
                        <div className="space-y-2">
                          {c.policyEvidence.map((ev, i) => (
                            <EvidenceCard key={i} evidence={ev} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Existing verdict */}
                    {c.verdict && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-xs font-semibold text-green-700 mb-1">Human Verdict — {c.verdict.verdictType.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-green-800">"{c.verdict.remarks}"</p>
                        <p className="text-xs text-green-600 mt-1">
                          — {c.verdict.officerName}{c.verdict.officerRole ? `, ${c.verdict.officerRole}` : ''} · {formatDateTime(c.verdict.submittedAt)}
                        </p>
                      </div>
                    )}

                    {/* Verdict actions (only for open/under investigation) */}
                    {(c.status === 'OPEN' || c.status === 'UNDER_INVESTIGATION' || c.status === 'PENDING_REVIEW') && !c.verdict && (
                      <div className="border-t border-slate-200 pt-4">
                        <p className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">Human Verdict</p>

                        {verdictForm?.caseId === c.caseId ? (
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {VERDICT_OPTIONS.map((v) => {
                                const Icon = v.icon;
                                return (
                                  <button
                                    key={v.type}
                                    onClick={() => setSelectedVerdict(v.type)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                                      selectedVerdict === v.type ? v.color : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                    {v.label}
                                  </button>
                                );
                              })}
                            </div>
                            <input
                              type="text"
                              placeholder="Officer Name *"
                              value={verdictForm.officerName}
                              onChange={(e) => setVerdictForm({ ...verdictForm, officerName: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                              placeholder="Remarks / Justification *"
                              value={verdictForm.remarks}
                              onChange={(e) => setVerdictForm({ ...verdictForm, remarks: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSubmitVerdict(c)}
                                disabled={submitting || !selectedVerdict || !verdictForm.officerName || !verdictForm.remarks}
                                className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                              >
                                {submitting ? 'Submitting...' : 'Submit Verdict'}
                              </button>
                              <button
                                onClick={() => setVerdictForm(null)}
                                className="px-4 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setVerdictForm({ caseId: c.caseId, officerName: '', remarks: '' })}
                            className="px-4 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Record Verdict
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
