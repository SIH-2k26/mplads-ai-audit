import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { ImplementingAgency } from '../types';
import { formatCurrencyINR } from '../lib/utils';
import { Briefcase } from 'lucide-react';
import { getAgencies } from '../services/api';

const MOCK_AGENCIES: ImplementingAgency[] = [
  {
    id: 'agency-001',
    name: 'District Rural Development Agency (DRDA)',
    department: 'Rural Works / Panchayati Raj',
    district: 'Pune',
    state: 'Maharashtra',
    totalWorks: 42,
    totalValueRupees: 1840000000,
    avgDelayDays: 65,
    completionRatePercentage: 72.4,
    costOverrunRatePercentage: 18.2,
    complianceScorePercentage: 88.5,
    riskLevel: 'MEDIUM',
    activeContractorCount: 9,
    flaggedWorksCount: 3
  },
  {
    id: 'agency-002',
    name: 'Public Works Department (PWD Pune)',
    department: 'Roads & Public Infrastructure',
    district: 'Pune',
    state: 'Maharashtra',
    totalWorks: 28,
    totalValueRupees: 1250000000,
    avgDelayDays: 45,
    completionRatePercentage: 79.2,
    costOverrunRatePercentage: 4.5,
    complianceScorePercentage: 92.0,
    riskLevel: 'LOW',
    activeContractorCount: 5,
    flaggedWorksCount: 1
  }
];

export function AgenciesPage() {
  const [agencies] = useState<ImplementingAgency[]>(MOCK_AGENCIES);

  return (
    <div className="space-y-6">
      <PageHeader
        title="IMPLEMENTING AGENCIES OFFICE"
        subtitle="Oversight of executing departments, compliance indexes, and average milestone delays"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Agencies Registry' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Registered Implementing Agencies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Total Works</TableHead>
                <TableHead>Sanctioned Outlay</TableHead>
                <TableHead>Avg Delay</TableHead>
                <TableHead>Compliance Rate</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencies.map((a) => {
                const getRiskLevelBadge = (level: string) => {
                  switch (level) {
                    case 'CRITICAL':
                    case 'HIGH':
                      return 'bg-red-100 text-red-700 border-red-200';
                    case 'MEDIUM':
                      return 'bg-orange-100 text-orange-800 border-orange-200';
                    default:
                      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  }
                };

                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-semibold text-[#0E0E0E]">{a.name}</div>
                      <div className="text-[10px] text-[#6B6B6B]">
                        Jurisdiction: {a.district}, {a.state}
                      </div>
                    </TableCell>
                    <TableCell>{a.department}</TableCell>
                    <TableCell>{a.totalWorks}</TableCell>
                    <TableCell>₹{formatCurrencyINR(a.totalValueRupees)}</TableCell>
                    <TableCell>{a.avgDelayDays} days</TableCell>
                    <TableCell>{a.complianceScorePercentage}%</TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskLevelBadge(a.riskLevel)}`}>
                        {a.riskLevel}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
