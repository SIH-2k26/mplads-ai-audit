import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { agencyService } from '../services/agencyService';
import { ImplementingAgency } from '../types';
import { formatCurrencyINR } from '../lib/utils';
import { Search, Building2 } from 'lucide-react';

export function AgenciesPage() {
  const [agencies, setAgencies] = useState<ImplementingAgency[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    agencyService.getAgencies(search).then((data) => {
      setAgencies(data);
      setLoading(false);
    });
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Implementing Agencies Telemetry"
        subtitle="Departmental execution performance, average delay days, and compliance ratings"
        badge={<Badge variant="secondary">{agencies.length} Agencies Monitored</Badge>}
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
            <Input
              type="text"
              placeholder="Search by agency name or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Implementing Agency</TableHead>
                <TableHead>Department & District</TableHead>
                <TableHead>Total Works</TableHead>
                <TableHead>Portfolio Value</TableHead>
                <TableHead>Avg Delay</TableHead>
                <TableHead>Completion Rate</TableHead>
                <TableHead>Compliance Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-[#667085]">
                    Loading agency records...
                  </TableCell>
                </TableRow>
              ) : agencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-[#667085]">
                    No agencies found.
                  </TableCell>
                </TableRow>
              ) : (
                agencies.map((agn) => (
                  <TableRow key={agn.id}>
                    <TableCell>
                      <div className="font-bold text-[#18324A]">{agn.name}</div>
                      <div className="text-[11px] text-[#667085]">{agn.flaggedWorksCount} flagged works</div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="text-[#1D2939] font-medium">{agn.department}</div>
                      <div className="text-[#667085]">{agn.district}, {agn.state}</div>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-[#18324A]">
                      {agn.totalWorks}
                    </TableCell>
                    <TableCell className="font-mono text-[#18324A]">
                      {formatCurrencyINR(agn.totalValueRupees)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#B44343]">
                      +{agn.avgDelayDays} days
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#2F7658] font-bold">
                      {agn.completionRatePercentage}%
                    </TableCell>
                    <TableCell>
                      <Badge variant={agn.complianceScorePercentage > 80 ? 'success' : 'warning'}>
                        {agn.complianceScorePercentage}% GFR Score
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
