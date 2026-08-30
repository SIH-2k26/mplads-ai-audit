import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ComplianceTrendlineChart } from '../components/ComplianceTrendlineChart';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ShieldCheck, Landmark, FileCheck } from 'lucide-react';

export function CompliancePage() {
  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="STATUTORY COMPLIANCE MONITORING"
        subtitle="Verification index of e-Sakshi ledgers and administrative sanction documentation audits"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Compliance Office' },
        ]}
      />

      <ComplianceTrendlineChart />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compliance Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>MPLADS Statutory Pre-requisites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs text-[#6B6B6B] leading-relaxed">
            <div className="p-3 bg-white rounded-xl border border-[#E5E3DC]">
              <span className="font-bold text-[#0E0E0E] flex items-center gap-1.5 mb-1">
                <Landmark className="w-4 h-4 text-[#0E0E0E]" />
                <span>Technical Sanction (TS)</span>
              </span>
              Revised Guidelines 2023 require a formal Technical Sanction from a competent state engineering department prior to any fund disbursement.
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E5E3DC]">
              <span className="font-bold text-[#0E0E0E] flex items-center gap-1.5 mb-1">
                <FileCheck className="w-4 h-4 text-[#0E0E0E]" />
                <span>Utilisation Certificate (UC)</span>
              </span>
              General Financial Rules (GFR) Rule 212 mandates submission of Utilisation Certificate (GFR-12C) within 90 days of phase tranche release.
            </div>
          </CardContent>
        </Card>

        {/* Audit Compliance Index */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>State Audit Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold text-[#0E0E0E]">
                  <span>Vouchers Reconciled via e-Sakshi</span>
                  <span className="text-emerald-700">92.4%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                  <div className="h-full bg-[#9FE870] rounded-full" style={{ width: '92.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-[#0E0E0E]">
                  <span>Physically Geotagged Milestones</span>
                  <span className="text-emerald-700">88.5%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                  <div className="h-full bg-[#9FE870] rounded-full" style={{ width: '88.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold text-[#0E0E0E]">
                  <span>Escrow Account Audits Completed</span>
                  <span className="text-orange-600">76.0%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5E3DC] overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '76.0%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
