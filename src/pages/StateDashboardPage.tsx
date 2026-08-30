import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Landmark, ShieldAlert, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getDashboardSummary, DashboardSummaryResponse } from '../services/api';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';

export function StateDashboardPage() {
  const [data, setData] = useState<DashboardSummaryResponse | null>(null);

  useEffect(() => {
    getDashboardSummary().then((res) => {
      if (res.data) {
        setData(res.data);
      }
    });
  }, []);

  const totalWorks = data?.total_projects || 5000;
  const totalSanctionedCr = data?.total_sanctioned_cr || 1943.43;
  const totalExpendedCr = data?.total_expended_cr || 1807.87;
  const overallUtilisation = data?.overall_utilisation_percentage || 93.02;
  const criticalCount = data?.critical_count || 516;

  const stateBreakdown = (data as any)?.state_breakdown || [
    { state: 'Uttar Pradesh', works: 639, sanctioned: '₹253.6 Cr', util: '92.8%', critical: 69 },
    { state: 'Madhya Pradesh', works: 458, sanctioned: '₹159.7 Cr', util: '94.9%', critical: 54 },
    { state: 'Rajasthan', works: 384, sanctioned: '₹131.9 Cr', util: '92.6%', critical: 38 },
    { state: 'Bihar', works: 321, sanctioned: '₹121.3 Cr', util: '92.5%', critical: 23 },
    { state: 'Assam', works: 303, sanctioned: '₹126.0 Cr', util: '93.9%', critical: 30 },
    { state: 'Tamil Nadu', works: 302, sanctioned: '₹122.5 Cr', util: '92.3%', critical: 19 },
    { state: 'Gujarat', works: 277, sanctioned: '₹104.3 Cr', util: '96.2%', critical: 35 },
    { state: 'Maharashtra', works: 264, sanctioned: '₹101.6 Cr', util: '92.9%', critical: 25 },
    { state: 'Chhattisgarh', works: 262, sanctioned: '₹110.3 Cr', util: '92.4%', critical: 26 },
    { state: 'Odisha', works: 248, sanctioned: '₹105.3 Cr', util: '91.8%', critical: 26 },
  ];

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="STATE & NATIONAL COMMAND PORTAL"
        subtitle="Consolidated State Vigilance Telemetry and Escalation Registry"
        breadcrumbs={[
          {
            label: 'Home',
            path: '/',
          },
          {
            label: 'State & National Command',
          },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Total Works (All States)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-[#0E0E0E]">{totalWorks.toLocaleString()}</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Projects under active supervision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Average State Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-[#15803D]">{overallUtilisation.toFixed(1)}%</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">
              ₹{totalExpendedCr.toLocaleString()} Cr spent nationwide
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Critical Risk Anomaly Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{criticalCount.toLocaleString()}</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Risk score &ge; 85 (Forensic Hold)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Total Sanctioned Outlay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-[#0E0E0E]">₹{totalSanctionedCr.toLocaleString()} Cr</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Aggregate state allocations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold text-[#0E0E0E]">State Nodal Office Performance Registry (All India)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State Name</TableHead>
                <TableHead>Total Works</TableHead>
                <TableHead>Sanctioned Amount</TableHead>
                <TableHead>Utilisation %</TableHead>
                <TableHead>Critical Anomalies</TableHead>
                <TableHead>System Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stateBreakdown.map((row: any) => (
                <TableRow key={row.state}>
                  <TableCell className="font-semibold text-xs text-[#0E0E0E]">{row.state}</TableCell>
                  <TableCell className="text-xs font-mono">{row.works} works</TableCell>
                  <TableCell className="text-xs font-medium">{row.sanctioned}</TableCell>
                  <TableCell className="text-xs font-semibold text-[#15803D]">{row.util}</TableCell>
                  <TableCell className={row.critical >= 30 ? 'text-red-600 font-bold text-xs' : 'text-orange-600 font-bold text-xs'}>
                    {row.critical}
                  </TableCell>
                  <TableCell>
                    <span className="bg-[#15803D] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ACTIVE MONITORING
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
