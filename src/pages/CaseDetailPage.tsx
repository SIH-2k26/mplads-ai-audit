import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { ArrowLeft, Landmark, ShieldCheck, ClipboardCheck, Sparkles } from 'lucide-react';
import { MOCK_CASES } from './CasesPage';
import { mockProjects } from '../data/mock-projects';
import { CaseInvestigation, CaseStatus } from '../types';
import { getCaseDetails } from '../services/api';
import { toast } from 'sonner';

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caseItem, setCaseItem] = useState<CaseInvestigation | null>(null);
  const [status, setStatus] = useState<CaseStatus>('UNDER_INVESTIGATION');
  const [verdictNotes, setVerdictNotes] = useState('');
  const [timeline, setTimeline] = useState<CaseInvestigation['timeline']>([]);

  useEffect(() => {
    // 1. Try local mock cases
    const found = MOCK_CASES.find(
      (c) =>
        c.id.toLowerCase() === id?.toLowerCase() ||
        c.caseNumber.toLowerCase() === id?.toLowerCase() ||
        c.projectId.toLowerCase() === id?.toLowerCase()
    );

    if (found) {
      setCaseItem(found);
      setStatus(found.status);
      setVerdictNotes(found.verdictNotes || '');
      setTimeline(found.timeline);
      return;
    }

    // 2. Try fetching from real backend API
    if (id) {
      getCaseDetails(id).then(({ data, error }) => {
        if (data && !error) {
          const apiCase: CaseInvestigation = {
            id: data.case_id || id,
            caseNumber: data.case_id || id,
            projectId: data.project_id || 'P-1023',
            projectCode: data.project_id || 'P-1023',
            projectTitle: data.project_title || `Investigation Docket ${id}`,
            district: data.district || 'Pune',
            state: data.state || 'Maharashtra',
            riskScore: Math.round(data.risk_score_at_creation || 88),
            priority: (data.priority || 'CRITICAL') as any,
            status: (data.status === 'VERDICT_RECORDED' ? 'CLOSED' : 'UNDER_INVESTIGATION') as any,
            createdDate: data.created_at ? data.created_at.slice(0, 10) : '2025-02-23',
            lastUpdated: '2025-02-26',
            assignedInvestigator: 'Senior Vigilance & Forensic Audit Officer',
            whyFlagged: data.trigger_signals?.[0] || '+38.2% cost anomaly detected above PWD SoR baseline and GFR-12C compliance gap.',
            evidenceCount: 4,
            applicableRule: {
              ruleId: 'R-54',
              title: 'MPLADS Revised Guidelines 2023 Section 5.4',
              section: 'Section 5.4',
              page: 42,
              documentUrl: 'https://mospi.gov.in',
            },
            peerComparison: {
              expectedRange: '₹28.5 L - ₹32.0 L',
              actualAmount: '₹42.0 Lakhs',
              peerDeviation: '+38.2% above baseline',
              sampleSize: 18,
            },
            evidenceList: [
              { title: 'Volumetric Satellite Divergence', type: 'DATA', reference: 'SAR Pass #104', timestamp: '2025-02-23', source: 'ISRO' },
              { title: 'Treasury DBT Drawdown vs Physical Log Discrepancy', type: 'FINANCIAL', reference: 'PFMS DBT Vouchers V-991 to V-994', timestamp: '2025-02-24', source: 'PFMS' },
            ],
            timeline: [
              { id: '1', timestamp: '2025-02-23 11:00 AM', user: 'System Sentinel', role: 'VIGILANCE_ENGINE', action: 'CASE_INITIALIZED', notes: 'Auto-initialized following critical risk flag trigger.' },
            ],
          };
          setCaseItem(apiCase);
          setStatus(apiCase.status);
          setTimeline(apiCase.timeline);
          return;
        }

        // 3. Fallback: match from mockProjects
        const relatedProject = mockProjects.find((p) => p.id === id || p.code === id) || mockProjects[0];
        const synthesizedCase: CaseInvestigation = {
          id: id || 'CASE-2026-0182',
          caseNumber: 'CAG-2024-117',
          projectId: relatedProject.id,
          projectCode: relatedProject.code,
          projectTitle: relatedProject.title,
          district: relatedProject.district,
          state: relatedProject.state,
          riskScore: relatedProject.currentRiskScore || 88,
          priority: relatedProject.currentRiskScore >= 80 ? 'CRITICAL' : 'HIGH',
          status: 'UNDER_INVESTIGATION',
          createdDate: '2025-02-23',
          lastUpdated: '2025-02-26',
          assignedInvestigator: 'Vigilance Officer S. Patil, IA&AS',
          whyFlagged: '+38.2% cost deviation above State PWD SoR baseline, 92.5% fund disbursement vs 31% verified physical completion (61.5% discrepancy gap), and missing GFR-12C Utilization Certificate Stage 2.',
          evidenceCount: 4,
          applicableRule: {
            ruleId: 'R-54',
            title: 'MPLADS Revised Guidelines 2023 Section 5.4 & GFR-12C',
            section: 'Section 5.4',
            page: 42,
            documentUrl: 'https://mospi.gov.in',
          },
          peerComparison: {
            expectedRange: '₹28.5 L - ₹32.0 L',
            actualAmount: '₹42.0 Lakhs',
            peerDeviation: '+38.2% above baseline',
            sampleSize: 18,
          },
          evidenceList: [
            { title: 'Volumetric Satellite Divergence (ISRO Cartosat-3)', type: 'DATA', reference: 'SAR Pass #104 (18.5204° N, 73.8567° E)', timestamp: '2025-02-23', source: 'ISRO' },
            { title: 'Treasury DBT Drawdown vs Physical Log Discrepancy', type: 'FINANCIAL', reference: 'PFMS DBT Vouchers V-991 to V-994', timestamp: '2025-02-24', source: 'PFMS' },
            { title: 'IP Bid Linkage & Cartel Network Graph', type: 'MODEL', reference: 'MCA-21 Subnet Match #882', timestamp: '2025-02-21', source: 'MCA-21' },
            { title: 'Overdue GFR-12C Utilization Certificate', type: 'STATUTORY', reference: 'Stage 2 UC-02 Mandate Outstanding', timestamp: '2025-02-25', source: 'CAG Audit Core' },
          ],
          timeline: [
            { id: '1', timestamp: '2025-02-23 11:00 AM', user: 'System Sentinel', role: 'VIGILANCE_ENGINE', action: 'CASE_INITIALIZED', notes: 'Auto-initialized following +38.2% cost anomaly and 61.5% progress gap flag.' },
            { id: '2', timestamp: '2025-02-24 02:30 PM', user: 'Director Nodal Office', role: 'STATE_NODAL', action: 'ASSIGNED_INVESTIGATOR', notes: 'Assigned to Senior Vigilance Officer for field verification directive.' },
          ],
        };

        setCaseItem(synthesizedCase);
        setStatus(synthesizedCase.status);
        setTimeline(synthesizedCase.timeline);
      });
    }
  }, [id]);

  if (!caseItem) {
    return (
      <div className="p-8 text-center bg-[#F1F0EC] rounded-[20px] select-none text-xs text-[#6B6B6B]">
        Case brief record not found for: {id}
        <div className="mt-4">
          <Link to="/cases">
            <Button variant="default" size="sm">Back to Cases</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveVerdict = () => {
    if (!verdictNotes.trim()) {
      toast.error('Validation Error', {
        description: 'Please input verdict rationale before logging decision.'
      });
      return;
    }

    const newAudit = {
      id: String(timeline.length + 1),
      timestamp: new Date().toLocaleString('en-IN'),
      user: 'Senior Vigilance & Audit Officer',
      role: 'AUDITOR',
      action: `LOGGED_VERDICT_${status}`,
      notes: verdictNotes
    };

    setTimeline([...timeline, newAudit]);
    toast.success('Verdict Logged', {
      description: `Case marked as ${status.replace(/_/g, ' ')} successfully.`
    });
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex items-center gap-2">
        <Link to="/cases" className="text-xs text-[#6B6B6B] hover:text-[#0E0E0E] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directorate
        </Link>
      </div>

      <PageHeader
        title={`INVESTIGATION DOSSIER: ${caseItem.caseNumber}`}
        subtitle={`${caseItem.projectTitle} (${caseItem.projectCode})`}
        badge={
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
            Priority: {caseItem.priority}
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Details & Evidence */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Anomaly Brief */}
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Attributions Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-[#0E0E0E] leading-relaxed">{caseItem.whyFlagged}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] space-y-1">
                  <span className="text-[#6B6B6B] block font-bold text-[9px] uppercase tracking-wider">Estimated Outlay</span>
                  <span className="font-bold text-[#0E0E0E]">{caseItem.peerComparison.expectedRange}</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] space-y-1">
                  <span className="text-[#6B6B6B] block font-bold text-[9px] uppercase tracking-wider">Sanctioned Amount</span>
                  <span className="font-bold text-[#0E0E0E]">{caseItem.peerComparison.actualAmount}</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] space-y-1">
                  <span className="text-[#6B6B6B] block font-bold text-[9px] uppercase tracking-wider">Cost Overrun Deviation</span>
                  <span className="font-bold text-red-600">{caseItem.peerComparison.peerDeviation}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evidence List */}
          <Card>
            <CardHeader>
              <CardTitle>Case File Evidence Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {caseItem.evidenceList.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-[#E5E3DC] flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0E0E0E]">{item.title}</span>
                        <span className="text-[9px] font-mono bg-[#F1F0EC] px-1.5 py-0.5 rounded border border-[#E5E3DC] text-[#6B6B6B]">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B]">Reference ID: {item.reference} • Timestamp: {item.timestamp}</p>
                    </div>
                    <span className="bg-[#15803D]/15 text-[#15803D] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#15803D]/30 shadow-2xs">
                      <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                      <span>Verified ({item.source})</span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Case Action Timeline / Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle>Statutory Action Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((entry) => (
                  <div key={entry.id} className="relative pl-6 border-l border-[#E5E3DC] pb-2 last:pb-0">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#0E0E0E] border-2 border-white" />
                    <div className="text-xs">
                      <div className="flex items-center gap-2 flex-wrap font-semibold text-[#0E0E0E]">
                        <span>{entry.action.replace(/_/g, ' ')}</span>
                        <span className="text-[9px] font-mono bg-[#F1F0EC] px-1 rounded text-[#6B6B6B]">
                          {entry.role} ({entry.user})
                        </span>
                        <span className="text-[10px] font-mono text-[#6B6B6B] ml-auto">{entry.timestamp}</span>
                      </div>
                      <p className="text-[#6B6B6B] mt-1 text-[11px] leading-relaxed">{entry.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Case Disposition / Verdict Form */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Case Disposition & Summons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2 text-xs">
                <label className="text-[#6B6B6B] block font-bold text-[9px] uppercase tracking-wider">
                  Select Statutory Action Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CaseStatus)}
                  className="w-full bg-white border border-[#E5E3DC] rounded-full px-3 py-2 text-xs text-[#0E0E0E] focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="UNDER_INVESTIGATION">Under Investigation</option>
                  <option value="CONFIRMED_ISSUE">Confirmed Anomaly (GFR Breach)</option>
                  <option value="FALSE_POSITIVE">Dismiss / False Positive</option>
                  <option value="INSUFFICIENT_EVIDENCE">Insufficient Evidence</option>
                  <option value="RESOLVED">Resolved / Recovered</option>
                  <option value="ESCALATED">Escalated to CAG Nodal</option>
                </select>
              </div>

              <div className="space-y-2 text-xs">
                <label className="text-[#6B6B6B] block font-bold text-[9px] uppercase tracking-wider">
                  Statutory Verdict Rationale
                </label>
                <textarea
                  value={verdictNotes}
                  onChange={(e) => setVerdictNotes(e.target.value)}
                  placeholder="Record formal statutory findings, show-cause reference numbers, and recovery instructions..."
                  rows={6}
                  className="w-full bg-white border border-[#E5E3DC] rounded-2xl p-3 text-xs text-[#0E0E0E] placeholder-[#9E9E9E] focus:outline-none focus:border-[#0E0E0E] resize-none"
                />
              </div>

              <button
                onClick={handleSaveVerdict}
                className="w-full py-2.5 rounded-full bg-[#0E0E0E] text-white text-xs font-semibold hover:bg-black cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-none"
              >
                <ClipboardCheck className="w-4 h-4 text-[#15803D]" />
                <span>Log Statutory Verdict</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
