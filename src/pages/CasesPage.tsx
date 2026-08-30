import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { FolderGit2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CaseInvestigation } from '../types';
import { getCases } from '../services/api';

export const MOCK_CASES: CaseInvestigation[] = [
  {
    id: 'CASE-2026-0182',
    caseNumber: 'CAG-2024-117',
    projectId: 'P-1023',
    projectCode: 'P-1023',
    projectTitle: 'Construction of Community Hall & Skill Centre Ward 17',
    district: 'Pune',
    state: 'Maharashtra',
    riskScore: 88,
    priority: 'CRITICAL',
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
      documentUrl: 'https://mospi.gov.in'
    },
    peerComparison: {
      expectedRange: '₹28.5 L - ₹32.0 L',
      actualAmount: '₹42.0 Lakhs',
      peerDeviation: '+38.2% above PWD SoR baseline',
      sampleSize: 18
    },
    evidenceList: [
      { title: 'Volumetric Satellite Divergence (ISRO Cartosat-3)', type: 'DATA', reference: 'SAR Pass #104 (18.5204° N, 73.8567° E)', timestamp: '2025-02-23', source: 'ISRO' },
      { title: 'Treasury DBT Drawdown vs Physical Log Discrepancy', type: 'FINANCIAL', reference: 'PFMS DBT Vouchers V-991 to V-994', timestamp: '2025-02-24', source: 'PFMS' },
      { title: 'IP Bid Linkage & Cartel Network Graph', type: 'MODEL', reference: 'MCA-21 Subnet Match #882 (Vindhya Infracon)', timestamp: '2025-02-21', source: 'MCA-21' },
      { title: 'Overdue GFR-12C Utilization Certificate', type: 'STATUTORY', reference: 'Stage 2 UC-02 Mandate Outstanding', timestamp: '2025-02-25', source: 'CAG Audit Core' }
    ],
    timeline: [
      { id: '1', timestamp: '2025-02-23 11:00 AM', user: 'System Sentinel', role: 'VIGILANCE_ENGINE', action: 'CASE_INITIALIZED', notes: 'Auto-initialized following +38.2% cost anomaly and 61.5% progress gap flag.' },
      { id: '2', timestamp: '2025-02-24 02:30 PM', user: 'Director Nodal Office', role: 'STATE_NODAL', action: 'ASSIGNED_INVESTIGATOR', notes: 'Assigned to Senior Vigilance Officer S. Patil for field verification directive.' },
      { id: '3', timestamp: '2025-02-25 10:15 AM', user: 'District Magistrate Office', role: 'DISTRICT_AUTHORITY', action: 'ADMINISTRATIVE_HOLD_PLACED', notes: 'Enforced administrative hold on remaining ₹3.6 Lakhs disbursement pending physical inspection.' }
    ]
  },
  {
    id: 'CASE-201',
    caseNumber: 'CAG-UP-VNS-24-001',
    projectId: 'P-0871',
    projectCode: 'P-0871',
    projectTitle: 'Construction of Solar Cold-Chain Hub & Grid',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    riskScore: 84,
    priority: 'CRITICAL',
    status: 'UNDER_INVESTIGATION',
    createdDate: '2025-02-20',
    lastUpdated: '2025-02-25',
    assignedInvestigator: 'Inspector R. K. Sharma',
    whyFlagged: 'Single-bidder cartel concentration across 4 contiguous blocks with 48 days milestone reporting lag.',
    evidenceCount: 3,
    applicableRule: {
      ruleId: 'R-42',
      title: 'MPLADS Revised Guidelines 2023 Section 4.2',
      section: 'Section 4.2',
      page: 37,
      documentUrl: 'https://mospi.gov.in'
    },
    peerComparison: {
      expectedRange: '₹35.0 L - ₹42.0 L',
      actualAmount: '₹58.0 Lakhs',
      peerDeviation: '+46% above median',
      sampleSize: 12
    },
    evidenceList: [
      { title: 'Tender Timeline Compression (6-day Notice)', type: 'PROCUREMENT', reference: 'CPPP e-Tender #2024-8841', timestamp: '2025-02-20', source: 'GeM/CPPP' },
      { title: 'GSTIN Cross-Directorship Linkage', type: 'MODEL', reference: 'MCA-21 Shared DIN #0849201', timestamp: '2025-02-21', source: 'MCA-21' }
    ],
    timeline: [
      { id: '1', timestamp: '2025-02-20 09:30 AM', user: 'System Sentinel', role: 'VIGILANCE_ENGINE', action: 'CASE_INITIALIZED', notes: 'Auto-initialized upon single-bidder cluster detection.' }
    ]
  }
];

export function CasesPage() {
  const [cases, setCases] = useState<CaseInvestigation[]>(MOCK_CASES);

  useEffect(() => {
    getCases().then(({ data, error }) => {
      if (data && !error && Array.isArray(data) && data.length > 0) {
        const mapped: CaseInvestigation[] = data.map((c: any) => ({
          id: c.case_id,
          caseNumber: c.case_id,
          projectId: c.project_id,
          projectCode: c.project_id,
          projectTitle: `Investigation Docket ${c.case_id}`,
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          riskScore: Math.round(c.risk_score_at_creation || 85),
          priority: c.priority as any,
          status: (c.status === 'VERDICT_RECORDED' ? 'CLOSED' : 'UNDER_INVESTIGATION') as any,
          createdDate: c.created_at ? c.created_at.slice(0, 10) : '2025-02-23',
          lastUpdated: '2025-02-26',
          assignedInvestigator: 'Vigilance Inspector Officer',
          whyFlagged: c.trigger_signals?.[0] || 'High risk discrepancy flag triggered by Sentinel AI Engine.',
          evidenceCount: 3,
          applicableRule: {
            ruleId: 'R-42',
            title: 'MPLADS Revised Guidelines Section 4.2',
            section: 'Section 4.2',
            page: 37,
            documentUrl: 'https://mospi.gov.in'
          },
          peerComparison: {
            expectedRange: '₹2.8 Cr - ₹3.8 Cr',
            actualAmount: '₹4.8 Cr',
            peerDeviation: '+50% above median',
            sampleSize: 14
          },
          evidenceList: [],
          timeline: []
        }));
        setCases(mapped);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="STATUTORY AUDIT CASES DIRECTORATE"
        subtitle="Formal CAG / MoSPI prosecution dockets, forensic logs, and summons records"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Cases Directorate' },
        ]}
      />

      <div className="space-y-4">
        {cases.map((c) => {
          const getPriorityBadge = (prio: string) => {
            switch (prio) {
              case 'CRITICAL':
                return 'bg-red-100 text-red-700 border-red-200';
              case 'HIGH':
                return 'bg-orange-100 text-orange-800 border-orange-200';
              default:
                return 'bg-amber-100 text-amber-800 border-amber-200';
            }
          };

          return (
            <Card key={c.id} className="p-5 select-none space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAE8E2] flex items-center justify-center border border-[#E5E3DC]">
                    <FolderGit2 className="w-4 h-4 text-[#0E0E0E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#6B6B6B]">{c.caseNumber}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(c.priority)}`}>
                        {c.priority}
                      </span>
                      <span className="text-[10px] font-bold bg-[#0E0E0E] text-white px-2 py-0.5 rounded-full">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0E0E0E] mt-1">{c.projectTitle}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
                  <span>Risk Score: {c.riskScore}/100</span>
                </div>
              </div>

              <div className="text-xs text-[#6B6B6B] leading-relaxed">
                <span className="font-bold text-[#0E0E0E] block uppercase tracking-wider text-[9px] mb-0.5">Brief Investigation Analysis</span>
                {c.whyFlagged}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1 border-t border-[#F1F0EC]">
                <div>
                  <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Investigator</span>
                  <span className="text-[#0E0E0E] font-medium block mt-0.5">{c.assignedInvestigator}</span>
                </div>
                <div>
                  <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Created Date</span>
                  <span className="text-[#0E0E0E] font-mono block mt-0.5">{c.createdDate}</span>
                </div>
                <div>
                  <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Last Updated</span>
                  <span className="text-[#0E0E0E] font-mono block mt-0.5">{c.lastUpdated}</span>
                </div>
                <div>
                  <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Evidence Count</span>
                  <span className="text-[#0E0E0E] font-semibold block mt-0.5">{c.evidenceCount} verified nodes</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE8E2] flex justify-end">
                <Link to={`/cases/${c.id}`}>
                  <button className="bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer flex items-center gap-1">
                    <span>Inspect Investigation Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
