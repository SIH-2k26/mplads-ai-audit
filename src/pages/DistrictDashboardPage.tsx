import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { projectService } from '../services/projectService';
import { useRoleStore } from '../stores/useRoleStore';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Project } from '../types';

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

  return (
    <div className="space-y-6">
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
                  const getRiskColor = (score: number) => {
                    if (score >= 80) return 'text-red-600 font-bold';
                    if (score >= 60) return 'text-orange-600 font-semibold';
                    if (score >= 35) return 'text-amber-600';
                    return 'text-emerald-700';
                  };

                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono">{p.code}</TableCell>
                      <TableCell>{p.title}</TableCell>
                      <TableCell>₹{formatCurrencyINR(p.sanctionedAmount)}</TableCell>
                      <TableCell>{p.physicalProgressPercentage}%</TableCell>
                      <TableCell className={getRiskColor(p.currentRiskScore)}>
                        {p.currentRiskScore}/100
                      </TableCell>
                      <TableCell>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.currentRiskScore >= 80 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.status}
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
