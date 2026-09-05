import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Download, FileSpreadsheet, BarChart2, ShieldCheck, FileText, UserCheck, Loader2 } from 'lucide-react';
import { useRoleStore } from '../stores/useRoleStore';
import { downloadReport } from '../services/api';
import { UserRole } from '../types';

interface ReportTemplate {
  title: string;
  detail: string;
  type: 'PDF' | 'CSV' | 'XLSX';
  badge?: string;
}

const ROLE_REPORTS_MAP: Record<UserRole, ReportTemplate[]> = {
  MP: [
    {
      title: 'Constituency Progress & Quota Utilization Dossier',
      detail: 'Complete breakdown of annual ₹5.00 Cr quota, recommendation-to-sanction timelines, and Ward/Panchayat delivery status.',
      type: 'PDF',
      badge: 'MP Mandate',
    },
    {
      title: 'Mandatory SC/ST & Priority Sector Allocation Ledger',
      detail: 'Audit record verifying statutory 15% SC and 7.5% ST habitation infrastructure compliance across constituency works.',
      type: 'CSV',
      badge: 'Statutory Quota',
    },
    {
      title: 'District Collector Pending Sanctions & Bottleneck Log',
      detail: 'Log of recommended projects awaiting Detailed Project Report (DPR) or Technical Sanction approvals.',
      type: 'PDF',
      badge: 'Sanction Pipeline',
    },
  ],

  DISTRICT_AUTHORITY: [
    {
      title: 'District Execution Integrity & Contractor Oversight Audit',
      detail: 'Operational audit of 124 district works, contractor concentration strain, and single-bidder tender flags.',
      type: 'PDF',
      badge: 'DM Oversight',
    },
    {
      title: 'Physical vs Financial Progress Discrepancy Matrix',
      detail: 'Dataset mapping expenditure percentages against ground physical inspection completion to catch premature billings.',
      type: 'CSV',
      badge: 'PFMS Reconciliation',
    },
    {
      title: 'ISRO Cartosat-3 SAR Telemetry Ground Validation Log',
      detail: 'Automated satellite radar telemetry reports tracking ground milestone progress across rural works.',
      type: 'XLSX',
      badge: 'Satellite Mesh',
    },
  ],

  STATE_NODAL: [
    {
      title: 'State Inter-District Performance & Fund Surrender Risk Audit',
      detail: 'Comprehensive ranking of all district administrations, unspent balances, and year-end fund surrender projections.',
      type: 'PDF',
      badge: 'SNA Review',
    },
    {
      title: 'State Vigilance Freeze Registry & Show-Cause Incident Log',
      detail: 'Consolidated incident ledger of active PFMS disbursal holds, show-cause dockets, and vigilance investigations.',
      type: 'CSV',
      badge: 'Vigilance Registry',
    },
    {
      title: 'Executing Agency Workload Strain & Capacity Matrix',
      detail: 'Workload distribution metrics across PWD, Rural Development, Water Supply, and Municipal executing bodies.',
      type: 'XLSX',
      badge: 'Capacity Matrix',
    },
  ],

  MINISTRY_DIID: [
    {
      title: 'National Macro Vigilance & Systemic Integrity Report',
      detail: 'Macro consolidation across all 543 Lok Sabha constituencies, national expenditure rates, and Cabinet briefing stats.',
      type: 'PDF',
      badge: 'MoSPI National',
    },
    {
      title: 'All-India 543 Constituencies Outlay & Utilization Master Sheet',
      detail: 'Full 5,000 project dataset export including sanctioned outlay, expenditure, utilization ratios, and risk bands.',
      type: 'CSV',
      badge: 'Master Dataset',
    },
    {
      title: 'Cross-State Contractor Nexus & Cartelization Analysis',
      detail: 'ARACHNE graph analysis of inter-state contractor collusion networks, shell entities, and repeated split-tenders.',
      type: 'PDF',
      badge: 'Graph Intelligence',
    },
  ],

  AUDITOR: [
    {
      title: 'CAG Statutory Forensic Audit & Anomaly Attribution Docket',
      detail: 'Official memorandum under CAG Vigilance Code Sec 14 with 5-dimension risk fusion breakdown for high-risk projects.',
      type: 'PDF',
      badge: 'CAG Forensic',
    },
    {
      title: '5,000 Monitored Works Risk Scoring & Violation Ledger',
      detail: 'Comprehensive audit dataset containing exact mathematical scores, cost deviations, and over-utilization flags.',
      type: 'CSV',
      badge: 'Audit Ledger',
    },
    {
      title: 'Measurement Book & Geo-Tagged Evidence Verification Audit',
      detail: 'Non-repudiation audit trail verifying geo-tagged photos, contractor invoices, and technical sanction logs.',
      type: 'PDF',
      badge: 'Evidence Trail',
    },
  ],
};

export function ReportsPage() {
  const { currentRole, userTitle, userJurisdiction } = useRoleStore();
  const [downloadingTitle, setDownloadingTitle] = React.useState<string | null>(null);

  const handleExport = async (format: string, title?: string) => {
    const reportKey = title || 'summary';
    setDownloadingTitle(reportKey);
    try {
      await downloadReport(reportKey, format, currentRole);
    } finally {
      setDownloadingTitle(null);
    }
  };

  const roleReports = ROLE_REPORTS_MAP[currentRole] || ROLE_REPORTS_MAP.AUDITOR;

  const leaderboardData = [
    { rank: 1, name: 'Kerala', score: 94.2, compliance: '99.1% Reconciled' },
    { rank: 2, name: 'Himachal Pradesh', score: 91.8, compliance: '97.4% Reconciled' },
    { rank: 3, name: 'Tamil Nadu', score: 89.5, compliance: '95.8% Reconciled' },
    { rank: 4, name: 'Andhra Pradesh', score: 83.2, compliance: '91.2% Reconciled' },
    { rank: 5, name: 'Gujarat', score: 81.0, compliance: '88.6% Reconciled' },
  ];

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="STATUTORY AUDIT & PERFORMANCE REPORTS"
        subtitle={`Role-Tailored Official Executive Summaries, CAG Audit Logs, and Scheme Dossiers for ${userTitle}`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Audit Reports' },
        ]}
      />

      {/* Role Context Bar */}
      <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#E5E3DC] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#15324A] text-white flex items-center justify-center font-bold text-xs">
            <UserCheck className="w-4 h-4 text-[#E5B45A]" />
          </div>
          <div>
            <div className="font-bold text-[#0E0E0E]">Active Officer Role: {userTitle}</div>
            <div className="text-[11px] text-[#6B6B6B]">Jurisdiction: {userJurisdiction} • Customized Reporting Package</div>
          </div>
        </div>
        <span className="bg-[#DCFCE7] text-[#15803D] font-bold text-[10px] px-2.5 py-1 rounded-full border border-[#86EFAC]">
          Direct File Download Enabled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Role-Specific Download templates */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0E0E0E] flex items-center justify-between">
                <span>Tailored Executive & Statutory Reports</span>
                <span className="text-[10px] font-mono text-[#6B6B6B] font-normal uppercase">
                  {currentRole} Format
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {roleReports.map((item, idx) => {
                const isDownloading = downloadingTitle === item.title;
                return (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-[#E5E3DC] hover:border-[#15324A]/40 transition-all flex items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0E0E0E]">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-xs bg-[#F1F0EC] text-[#15324A] border border-[#E5E3DC]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] leading-relaxed">{item.detail}</p>
                    </div>
                    <button
                      onClick={() => handleExport(item.type, item.title)}
                      disabled={isDownloading}
                      className="bg-[#15324A] hover:bg-[#0F2638] disabled:opacity-60 text-white text-[10px] font-bold px-3.5 py-2 rounded-full cursor-pointer flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-3.5 h-3.5 text-[#E5B45A] animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-[#E5B45A]" />
                      )}
                      <span>{isDownloading ? 'Generating...' : `Download ${item.type}`}</span>
                    </button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right: State Leaderboard */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-[#0E0E0E]">
                State Performance Integrity Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboardData.map((item) => (
                <div
                  key={item.rank}
                  className="p-3.5 bg-white rounded-2xl border border-[#E5E3DC] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F1F0EC] text-[#0E0E0E] font-bold flex items-center justify-center text-xs">
                      {item.rank}
                    </span>
                    <div>
                      <span className="font-semibold text-xs text-[#0E0E0E]">{item.name}</span>
                      <span className="text-[#6B6B6B] block text-[10px]">{item.compliance}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#16A34A]">{item.score} / 100</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
