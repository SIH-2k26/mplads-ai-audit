import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Landmark, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { projectService } from '../services/projectService';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';

export function StateDashboardPage() {
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
          <CardHeader>
            <CardTitle>Total Works (All States)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{summary.totalCount}</div>
            <p className="text-xs text-[#6B6B6B]">Projects under supervision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average State Utilisation</CardTitle>
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
            <CardTitle>Total Sanctioned Outlay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(summary.totalSanctioned)}</div>
            <p className="text-xs text-[#6B6B6B]">Aggregate state allocations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>State Nodal Office Performance Registry</CardTitle>
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
              <TableRow>
                <TableCell className="font-semibold">Maharashtra</TableCell>
                <TableCell>148</TableCell>
                <TableCell>₹124.5 Cr</TableCell>
                <TableCell>72.4%</TableCell>
                <TableCell className="text-orange-600 font-bold">6</TableCell>
                <TableCell>
                  <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                  <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ACTIVE MONITORING
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Karnataka</TableCell>
                <TableCell>94</TableCell>
                <TableCell>₹88.5 Cr</TableCell>
                <TableCell>79.2%</TableCell>
                <TableCell className="text-amber-600 font-bold">3</TableCell>
                <TableCell>
                  <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ACTIVE MONITORING
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Bihar</TableCell>
                <TableCell>118</TableCell>
                <TableCell>₹94.1 Cr</TableCell>
                <TableCell>62.3%</TableCell>
                <TableCell className="text-red-600 font-bold">8</TableCell>
                <TableCell>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ESCATED HOLDS
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
