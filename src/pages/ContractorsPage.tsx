import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { contractorService } from '../services/contractorService';
import { Contractor } from '../types';
import { formatCurrencyINR } from '../lib/utils';
import { Search, Users, AlertTriangle, Briefcase, Building2, ShieldAlert, Scale, PieChart } from 'lucide-react';

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
        subtitle="Vendor concentration analysis, cartel syndicate diagnostics, and historical execution performance tracking."
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Contractor Intelligence' },
        ]}
      />

      {/* Top District Concentration Risk Banner */}
      <div className="bg-[#FAFAF7] p-5 rounded-[8px] border-2 border-[#15324A] shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DFE3] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#15324A] text-[#E5B45A]">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
                Pune District — Tender Award Concentration Matrix
              </h4>
              <span className="text-[11px] text-[#647383]">
                Analysis of 148 active works sanctioned across all parliamentary segments in Pune.
              </span>
            </div>
          </div>

          <Badge variant="warning">
            CONCENTRATION RISK REQUIRING REVIEW
          </Badge>
        </div>

        {/* Visual Concentration Strip */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-[#D9DFE3] rounded-full overflow-hidden flex font-mono text-[10px] text-white font-bold">
            <div style={{ width: '38.5%' }} className="bg-[#C94B4B] flex items-center justify-center truncate px-1" title="Sahyadri Buildtech: 38.5%">
              Sahyadri 38.5%
            </div>
            <div style={{ width: '31.2%' }} className="bg-[#C98220] flex items-center justify-center truncate px-1" title="Western Infra: 31.2%">
              Western 31.2%
            </div>
            <div style={{ width: '18.1%' }} className="bg-[#15324A] flex items-center justify-center truncate px-1" title="Om Sai Construction: 18.1%">
              Om Sai 18.1%
            </div>
            <div style={{ width: '12.2%' }} className="bg-[#2E8064] flex items-center justify-center truncate px-1" title="Others (9 vendors): 12.2%">
              Others 12.2%
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono pt-1">
            <span className="text-[#C94B4B] font-bold">● M/s Sahyadri Buildtech (₹18.4 Cr • 38.5%)</span>
            <span className="text-[#C98220] font-bold">● M/s Western Infra Projects (₹14.9 Cr • 31.2%)</span>
            <span className="text-[#15324A] font-bold">● M/s Om Sai Construction (₹8.6 Cr • 18.1%)</span>
            <span className="text-[#2E8064] font-bold">● Others (9 Vendors • 12.2%)</span>
          </div>
        </div>

        <div className="p-3 rounded bg-red-50/70 border border-[#C94B4B]/30 text-xs text-[#172B3A]">
          <span className="font-mono font-bold text-[#C94B4B] uppercase block">
            Vigilance Warning Flag:
          </span>
          <p className="text-[11px] text-[#172B3A] mt-0.5">
            <strong>69.7%</strong> of total sanctioned MPLADS outlay in the district is concentrated with just 2 contractor syndicates. Cross-director PAN linkages indicate shared registered addresses.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-[6px] border border-[#D9DFE3]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#647383]" />
          <Input
            type="text"
            placeholder="Search by contractor firm name, PAN, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Contractors Table */}
      <div className="bg-white rounded-[6px] border border-[#D9DFE3] shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FAFAF7] text-[11px] font-mono uppercase text-[#15324A]">
              <TableHead className="font-bold">Contractor Entity</TableHead>
              <TableHead className="font-bold">PAN / Registration</TableHead>
              <TableHead className="font-bold">Active / Total Works</TableHead>
              <TableHead className="font-bold">Award Value</TableHead>
              <TableHead className="font-bold">District Share</TableHead>
              <TableHead className="font-bold">Delay Rate</TableHead>
              <TableHead className="font-bold text-right">Risk Index</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-[#647383]">
                  Loading contractor profiles...
                </TableCell>
              </TableRow>
            ) : contractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-[#647383]">
                  No contractors found.
                </TableCell>
              </TableRow>
            ) : (
              contractors.map((cont) => (
                <TableRow key={cont.id} className="hover:bg-[#FAFAF7] transition-colors">
                  <TableCell>
                    <div className="font-bold text-xs text-[#15324A]">{cont.name}</div>
                    <div className="text-[10px] text-[#647383]">{cont.district}, {cont.state}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[#172B3A]">
                    {cont.pan}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <strong className="text-[#15324A]">{cont.activeProjects}</strong> / {cont.totalProjects}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-xs text-[#15324A]">
                    {formatCurrencyINR(cont.totalValueRupees)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className={cont.districtConcentrationPercentage > 35 ? 'font-bold text-[#C94B4B]' : 'text-[#172B3A]'}>
                      {cont.districtConcentrationPercentage}%
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-[#647383]">
                    {cont.delayRatePercentage}%
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-[3px] font-mono font-bold text-xs border ${
                        cont.riskScore >= 75
                          ? 'bg-red-50 text-[#C94B4B] border-[#C94B4B]/30'
                          : cont.riskScore >= 50
                          ? 'bg-amber-50 text-[#C98220] border-[#C98220]/30'
                          : 'bg-emerald-50 text-[#2E8064] border-[#2E8064]/30'
                      }`}
                    >
                      {cont.riskScore} / 100
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
