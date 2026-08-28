import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { projectService } from '../services/projectService';
import { formatCurrencyINR } from '../lib/utils';
import { RiskTrendChartCard } from '../components/RiskTrendChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATE_CHART_DATA = [
  { name: 'Uttar Pradesh', sanctioned: 188.2, color: '#0E0E0E' },
  { name: 'Maharashtra', sanctioned: 124.5, color: '#9FE870' },
  { name: 'Bihar', sanctioned: 94.1, color: '#EAE8E2' },
  { name: 'Karnataka', sanctioned: 88.5, color: '#E5E3DC' },
];

export function MinistryDashboardPage() {
  const [summary, setSummary] = useState({
    totalCount: 0,
    activeCount: 0,
    completedCount: 0,
    atRiskCount: 0,
    criticalCount: 0,
    totalSanctioned: 0,
    totalExpended: 0,
    totalUtilisation: 0,
  });

  useEffect(() => {
    projectService.getProjectsSummary().then((data) => {
      setSummary(data);
    });
  }, []);

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="NATIONAL AUDIT TELEMETRY"
        subtitle="Ministry of Statistics & Programme Implementation (MoSPI) Command Centre"
        breadcrumbs={[
          {
            label: 'Home',
            path: '/',
          },
          {
            label: 'Ministry Command Nodal',
          },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Monitored Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{summary.totalCount}</div>
            <p className="text-xs text-[#6B6B6B]">Projects under supervision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisation Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{summary.totalUtilisation.toFixed(1)}%</div>
            <p className="text-xs text-[#6B6B6B]">
              ₹{formatCurrencyINR(summary.totalExpended)} spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Risk Anomaly Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{summary.criticalCount}</div>
            <p className="text-xs text-[#6B6B6B]">Risk score &ge; 80</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sanctioned Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(summary.totalSanctioned)}</div>
            <p className="text-xs text-[#6B6B6B]">Aggregate allocations</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendChartCard />

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>State-wise Sanctioned Outlay (₹ Crores)</CardTitle>
          </CardHeader>
          <CardContent className="h-60 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STATE_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F0EC" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B6B6B' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6B6B6B' }} tickLine={false} axisLine={false} unit=" Cr" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0E0E0E', borderColor: 'transparent', borderRadius: '12px' }}
                  labelStyle={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#9FE870', fontSize: '11px' }}
                />
                <Bar dataKey="sanctioned" radius={[8, 8, 0, 0]}>
                  {STATE_CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>State-wise Telemetry Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State Nodal Office</TableHead>
                <TableHead>Total Works</TableHead>
                <TableHead>Sanctioned Amount</TableHead>
                <TableHead>Utilisation %</TableHead>
                <TableHead>Critical Anomalies</TableHead>
                <TableHead>Oversight Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Maharashtra</TableCell>
                <TableCell>148</TableCell>
                <TableCell>₹124.5 Cr</TableCell>
                <TableCell>72.4%</TableCell>
                <TableCell className="text-orange-600 font-bold">6</TableCell>
                <TableCell>
                  <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-transparent shadow-2xs">
                    ACTIVE MONITORING
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Uttar Pradesh</TableCell>
                <TableCell>212</TableCell>
                <TableCell>₹188.2 Cr</TableCell>
                <TableCell>68.1%</TableCell>
                <TableCell className="text-red-600 font-bold">11</TableCell>
                <TableCell>
                  <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-transparent shadow-2xs">
                    ACTIVE MONITORING
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
