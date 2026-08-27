import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { contractorService } from '../services/contractorService';
import { Contractor } from '../types';
import { formatCurrencyINR, getRiskColorClass } from '../lib/utils';
import { Search, Users, AlertTriangle, Briefcase } from 'lucide-react';

export function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    contractorService.getContractors(search).then((data) => {
      setContractors(data);
      setLoading(false);
    });
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contractor Risk & Cartelization Intelligence"
        subtitle="Vendor concentration analysis, historical delay rates, and cartel network diagnostics"
        badge={<Badge variant="secondary">{contractors.length} Entities Profiled</Badge>}
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
            <Input
              type="text"
              placeholder="Search by contractor firm name, PAN, or district..."
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
                <TableHead>Contractor Firm</TableHead>
                <TableHead>PAN / Registration</TableHead>
                <TableHead>Active / Total Works</TableHead>
                <TableHead>Total Award Value</TableHead>
                <TableHead>District Concentration</TableHead>
                <TableHead>Delay Rate</TableHead>
                <TableHead>Risk Index</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-[#667085]">
                    Loading contractor profiles...
                  </TableCell>
                </TableRow>
              ) : contractors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-[#667085]">
                    No contractors found.
                  </TableCell>
                </TableRow>
              ) : (
                contractors.map((cont) => {
                  const riskStyle = getRiskColorClass(cont.riskScore);

                  return (
                    <TableRow key={cont.id}>
                      <TableCell>
                        <div className="font-bold text-[#18324A]">{cont.name}</div>
                        <div className="text-[11px] text-[#667085]">{cont.district}, {cont.state}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#1D2939]">
                        {cont.pan}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <strong className="text-[#18324A]">{cont.activeProjects}</strong> / {cont.totalProjects}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-[#18324A]">
                        {formatCurrencyINR(cont.totalValueRupees)}
                      </TableCell>
                      <TableCell className="font-mono">
                        <span className={cont.districtConcentrationPercentage > 40 ? 'font-bold text-[#B44343]' : ''}>
                          {cont.districtConcentrationPercentage}%
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[#667085]">
                        {cont.delayRatePercentage}%
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-[3px] font-mono font-bold text-xs border ${riskStyle.badgeBg}`}>
                          {cont.riskScore} / 100
                        </span>
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
