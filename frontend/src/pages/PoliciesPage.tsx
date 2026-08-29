import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { BookOpen } from 'lucide-react';
import { PolicyRule } from '../types';

const MOCK_POLICIES: PolicyRule[] = [
  {
    id: 'PR-01',
    code: 'R-42',
    documentName: 'MPLADS Revised Guidelines 2023',
    section: 'Section 4.2',
    page: 37,
    title: 'PWD Schedule of Rates Adherence',
    effectiveDate: '2023-04-01',
    issuingAuthority: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    severity: 'CRITICAL',
    applicability: 'All MPLADS sanctioned civil works',
    summary: 'Estimates must not exceed 10% of prevailing PWD/CPWD Schedule of Rates without written committee justification.',
    textSnippet: 'The cost estimate prepared by the implementing agency must conform to the prevailing state PWD Schedule of Rates. Any markup exceeding 10% requires detailed technical rate justification and administrative sanction committee review.'
  },
  {
    id: 'PR-02',
    code: 'R-212',
    documentName: 'General Financial Rules 2017',
    section: 'Rule 212',
    page: 68,
    title: 'Utilisation Certificate Submission Timeline',
    effectiveDate: '2017-02-11',
    issuingAuthority: 'Ministry of Finance, Government of India',
    severity: 'HIGH',
    applicability: 'All central sector schemes and releases',
    summary: 'A Utilisation Certificate (Form GFR-12C) must be submitted within 90 days of phase completion and fund release.',
    textSnippet: 'Form GFR-12C of Utilisation Certificate must be uploaded to e-Sakshi portal within 90 days of subsequent installment drawdowns, signed by the executing authority and counter-signed by the district nodal officer.'
  }
];

export function PoliciesPage() {
  const [policies] = useState<PolicyRule[]>(MOCK_POLICIES);

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="STATUTORY POLICIES REGISTRY"
        subtitle="Monitored government guidelines, CVC circulars, and GFR financial rules"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Policies Registry' },
        ]}
      />

      <div className="space-y-4">
        {policies.map((p) => {
          const getSeverityBadge = (sev: string) => {
            switch (sev) {
              case 'CRITICAL':
                return 'bg-red-100 text-red-700 border-red-200';
              case 'HIGH':
                return 'bg-orange-100 text-orange-800 border-orange-200';
              default:
                return 'bg-amber-100 text-amber-800 border-amber-200';
            }
          };

          return (
            <Card key={p.id} className="p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#0E0E0E]" />
                  <h3 className="text-sm font-bold text-[#0E0E0E]">
                    {p.code}: {p.title}
                  </h3>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(p.severity)}`}>
                  {p.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Document Title</span>
                  <span className="text-[#0E0E0E] font-medium block mt-0.5">{p.documentName}</span>
                </div>
                <div>
                  <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Authority & Date</span>
                  <span className="text-[#0E0E0E] font-medium block mt-0.5">{p.issuingAuthority} ({p.effectiveDate})</span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Summary Summary</span>
                <p className="text-[#0E0E0E] mt-0.5 leading-relaxed">{p.summary}</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] text-xs italic text-[#6B6B6B] leading-relaxed">
                "{p.textSnippet}"
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
