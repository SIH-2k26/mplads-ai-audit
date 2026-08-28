import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Landmark, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { projectService } from '../services/projectService';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';

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
    <div className="space-y-6">
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
            <div className="text-2xl font-bold font-mono">{summary.criticalCount}</div>
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
                <TableCell>Maharashtra</TableCell>
                <TableCell>148</TableCell>
                <TableCell>₹124.5 Cr</TableCell>
                <TableCell>72.4%</TableCell>
                <TableCell>6</TableCell>
                <TableCell>
                  <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ACTIVE MONITORING
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Uttar Pradesh</TableCell>
                <TableCell>212</TableCell>
                <TableCell>₹188.2 Cr</TableCell>
                <TableCell>68.1%</TableCell>
                <TableCell>11</TableCell>
                <TableCell>
                  <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2 py-0.5 rounded-full">
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
