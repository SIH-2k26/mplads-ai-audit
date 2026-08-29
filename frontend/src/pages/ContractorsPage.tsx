import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Users, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { Contractor } from '../types';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';
import { getContractors } from '../services/api';

const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: 'cont-001',
    name: 'Vindhya Infracon Ltd',
    pan: 'ABCDP8841M',
    registrationDate: '2019-04-12',
    district: 'Pune',
    state: 'Maharashtra',
    totalProjects: 14,
    totalValueRupees: 827000000,
    delayRatePercentage: 78.5,
    completionRatePercentage: 21.5,
    cancellationRatePercentage: 0,
    riskScore: 85,
    districtConcentrationPercentage: 68.4,
    topAgencies: ['DRDA Pune', 'PWD Maharashtra'],
    flagHistory: ['Cover Bidding Clustered Tender', 'Progress Mismatch Anomaly'],
    activeProjects: 8
  },
  {
    id: 'cont-002',
    name: 'Sahyadri Buildtech Infrastructure',
    pan: 'ABCDS4412M',
    registrationDate: '2021-08-19',
    district: 'Pune',
    state: 'Maharashtra',
    totalProjects: 10,
    totalValueRupees: 642000000,
    delayRatePercentage: 45.0,
    completionRatePercentage: 55.0,
    cancellationRatePercentage: 10,
    riskScore: 78,
    districtConcentrationPercentage: 54.2,
    topAgencies: ['PWD Pune', 'Irrigation Dept'],
    flagHistory: ['Delay SLA Breach'],
    activeProjects: 8
  }
];

export function ContractorsPage() {
  const [contractors] = useState<Contractor[]>(MOCK_CONTRACTORS);

  return (
    <div className="space-y-6">
      <PageHeader
        title="CONTRACTORS REGISTRY"
        subtitle="Cross-entity director PAN linkages, contract volume concentration, and delay rates"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Contractors Registry' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Monitored Civil Contractors Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contractor Name</TableHead>
                <TableHead>Director PAN</TableHead>
                <TableHead>Active Projects</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>District Concentration</TableHead>
                <TableHead>Delay Rate</TableHead>
                <TableHead>Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.map((c) => {
                const getRiskColor = (score: number) => {
                  if (score >= 80) return 'text-red-600 font-bold';
                  if (score >= 60) return 'text-orange-600 font-semibold';
                  return 'text-emerald-700';
                };

                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-semibold text-[#0E0E0E]">{c.name}</div>
                      <div className="text-[10px] text-[#6B6B6B]">
                        Registered: {c.registrationDate} • {c.district}, {c.state}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{c.pan}</TableCell>
                    <TableCell>{c.activeProjects}</TableCell>
                    <TableCell>₹{formatCurrencyINR(c.totalValueRupees)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span>{c.districtConcentrationPercentage}%</span>
                        {c.districtConcentrationPercentage > 50 && (
                          <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                            CONCENTRATED
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{c.delayRatePercentage}%</TableCell>
                    <TableCell className={getRiskColor(c.riskScore)}>
                      {c.riskScore}/100
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
