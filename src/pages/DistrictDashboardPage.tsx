import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { projectService } from '../services/projectService';
import { useRoleStore } from '../stores/useRoleStore';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS_MAP: Record<string, string> = {
  'COMPLETED': '#9FE870',
  'WORK_IN_PROGRESS': '#EAE8E2',
  'SANCTIONED': '#E5E3DC',
  'HALTED': '#EF4444',
  'RECOMMENDED': '#C2C0B8',
};

export function DistrictDashboardPage() {
  const { selectedDistrict } = useRoleStore();

  const [districtSummary, setDistrictSummary] = useState({
    totalCount: 0,
    criticalCount: 0,
    totalSanctioned: 0,
    totalExpended: 0,
    totalUtilisation: 0,
    delayedCount: 0,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch summary
    projectService.getProjectsSummary(selectedDistrict).then((data) => {
      setDistrictSummary(data);
    });

    // Fetch projects list
    projectService.getProjects({ district: selectedDistrict }).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, [selectedDistrict]);

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value,
      color: COLORS_MAP[name] || '#D4D1C7',
    }));
  }, [projects]);

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title={`DISTRICT COMMAND DASHBOARD - ${selectedDistrict.toUpperCase()}`}
        subtitle="Vigilance metrics & localized project delays"
        breadcrumbs={[
          {
            label: 'Home',
            path: '/',
          },
          {
            label: 'District Command',
          },
        ]}
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>District Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{districtSummary.totalCount}</div>
            <p className="text-xs text-[#6B6B6B]">Total monitored works in district</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sanctioned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(districtSummary.totalSanctioned)}</div>
            <p className="text-xs text-[#6B6B6B]">Approved allocations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(districtSummary.totalExpended)}</div>
            <p className="text-xs text-[#6B6B6B]">Reconciled spending ({districtSummary.totalUtilisation.toFixed(1)}%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Overlaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{districtSummary.criticalCount}</div>
            <p className="text-xs text-[#6B6B6B]">Works with risk score &ge; 80</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Graphs Section */}
      {statusChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Works Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-56 flex flex-col justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0E0E0E', borderColor: 'transparent', borderRadius: '12px' }}
                    itemStyle={{ color: '#FFFFFF', fontSize: '11px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={8}
                    formatter={(value) => <span className="text-[10px] text-[#6B6B6B] font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Risk Matrix Status Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-[#6B6B6B]">
                Vigilance audit compliance monitoring for {selectedDistrict} district. Status of current anomalies:
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#6B6B6B] block uppercase tracking-wider font-bold">Low Risk Works</span>
                  <span className="text-lg font-bold text-emerald-700 block mt-1 font-mono">
                    {projects.filter((p) => p.currentRiskScore <= 29).length} works
                  </span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#6B6B6B] block uppercase tracking-wider font-bold">At-Risk Works</span>
                  <span className="text-lg font-bold text-red-600 block mt-1 font-mono">
                    {projects.filter((p) => p.currentRiskScore >= 60).length} works
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Works Under Inspection ({selectedDistrict})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Project Title</TableHead>
                <TableHead>Sanctioned Amount</TableHead>
                <TableHead>Physical Progress</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-xs text-[#6B6B6B]">
                    Loading portfolio...
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-xs text-[#6B6B6B]">
                    No works found for {selectedDistrict} district.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p) => {
                  const getRiskBadge = (score: number) => {
                    if (score >= 80) return 'bg-red-100 text-red-700 border-red-200';
                    if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
                    if (score >= 35) return 'bg-amber-100 text-amber-800 border-amber-200';
                    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  };

                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono">{p.code}</TableCell>
                      <TableCell>{p.title}</TableCell>
                      <TableCell>₹{formatCurrencyINR(p.sanctionedAmount)}</TableCell>
                      <TableCell>{p.physicalProgressPercentage}%</TableCell>
                      <TableCell>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(p.currentRiskScore)}`}>
                          {p.currentRiskScore}/100 Risk
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="bg-[#EAE8E2] text-[#0E0E0E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link to={`/projects/${p.id}`}>
                          <Button variant="outline" size="sm">
                            Inspect Digital Twin
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
