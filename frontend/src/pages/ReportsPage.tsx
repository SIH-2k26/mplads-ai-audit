import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Download, FileSpreadsheet, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';

import { downloadReport } from '../services/api';

export function ReportsPage() {
  const handleExport = (format: string, title?: string) => {
    downloadReport(title || 'summary', format);
  };

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
        subtitle="Download official executive summaries, CAG audit logs, and regional compliance scores"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Audit Reports' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Download templates */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Executive Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'National MPLADS Composite Compliance Summary', detail: 'Consolidated overview of all 543 constituencies. Includes financial outruns, delay summaries, and anomaly logs.', type: 'PDF' },
                { title: 'State Escalation Holds & Freeze Registry', detail: 'Incident log of show-cause notices and active disbursal freezes in Maharashtra, Uttar Pradesh, and Bihar.', type: 'CSV' },
                { title: 'Geotagged Volumetric SAR Validation Audit Log', detail: 'ISRO radar telemetry validation reports tracking ground milestone discrepancy gaps.', type: 'XLSX' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-2xl border border-[#E5E3DC] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#0E0E0E]">{item.title}</span>
                    <p className="text-[11px] text-[#6B6B6B] leading-relaxed">{item.detail}</p>
                  </div>
                  <button
                    onClick={() => handleExport(item.type, item.title)}
                    className="bg-[#0E0E0E] hover:bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{item.type}</span>
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: State Leaderboard */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>State Performance Integrity Index</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboardData.map((item) => (
                <div key={item.rank} className="p-3.5 bg-white rounded-2xl border border-[#E5E3DC] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#F1F0EC] text-[#0E0E0E] font-bold flex items-center justify-center text-xs">
                      {item.rank}
                    </span>
                    <div>
                      <span className="font-semibold text-xs text-[#0E0E0E]">{item.name}</span>
                      <span className="text-[#6B6B6B] block text-[10px]">{item.compliance}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0E0E0E]">{item.score} / 100</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
