import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { projectService } from '../services/projectService';
import { useT } from '../i18n/useT';
import { useUiStore } from '../stores/useUiStore';
import { formatCurrencyINR } from '../lib/utils';
import { RiskTrendChartCard } from '../components/RiskTrendChartCard';
import { WiseHeroBalance } from '../components/WiseHeroBalance';
import { WiseCardsRow } from '../components/WiseCardsRow';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';

const STATE_CHART_DATA = [
  { name: 'Uttar Pradesh', sanctioned: 188.2, color: '#0E0E0E' },
  { name: 'Maharashtra',   sanctioned: 124.5, color: '#9FE870' },
  { name: 'Bihar',         sanctioned: 94.1,  color: '#EAE8E2' },
  { name: 'Karnataka',     sanctioned: 88.5,  color: '#E5E3DC' },
];

export function MinistryDashboardPage() {
  const t = useT();
  const { setAiAssistantOpen, openEvidenceDrawer } = useUiStore();
  const [summary, setSummary] = useState({
    totalCount: 0, activeCount: 0, completedCount: 0,
    atRiskCount: 0, criticalCount: 0,
    totalSanctioned: 0, totalExpended: 0, totalUtilisation: 0,
  });

  useEffect(() => {
    projectService.getProjectsSummary().then(setSummary);
  }, []);

  const handleAuditScan = () => {
    toast.success('Initiating full-spectrum Sanchay audit scan across all 28 State Nodal offices...');
    setAiAssistantOpen(true);
  };

  const handleFreezeTranche = () => {
    toast.warning('Provisional administrative freeze placed on high-risk tranches (P-1023).');
    openEvidenceDrawer({ title: 'Tranche Freeze Statutory Order #FRZ-2025-09' });
  };

  const handleSelectDirective = (directive: string) => {
    if (directive === 'satellite') {
      toast.info('ISRO Cartosat-3 SAR satellite tasking directive issued.');
    } else if (directive === 'subpoena') {
      toast.info('CAG Section 14 statutory show-cause subpoena issued.');
    } else {
      toast.success('Vigilance dossier PDF exported successfully.');
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title={t.ministry.title}
        subtitle={t.ministry.subtitle}
        breadcrumbs={[
          { label: t.common.home, path: '/' },
          { label: t.nav.ministryCommand },
        ]}
      />

      {/* Wise Hero Balance (Exact match to screenshot metrics) */}
      <WiseHeroBalance
        onAuditScan={handleAuditScan}
        onFreezeTranche={handleFreezeTranche}
        onSelectDirective={handleSelectDirective}
        onToggleAnalytics={() => openEvidenceDrawer({ title: 'National Scheme Compliance Reliability Score' })}
        trustScore={76.4}
        totalOutlayCr={4950.0}
      />

      {/* Wise Cards Row: Expanded Full-Width National Scheme Account Card with Sub-Balances + Flow Stream Telemetry */}
      <WiseCardsRow
        onOpenCardDetails={() => openEvidenceDrawer({ title: 'National Scheme Account Details' })}
        onOpenDoMoreAction={() => setAiAssistantOpen(true)}
        onSelectSubBalance={(type) => openEvidenceDrawer({ title: `Sub-balance Detail: ${type.toUpperCase()}` })}
        totalOutlayCr={4950.0}
        disbursedCr={3840.5}
        flaggedRiskCr={412.8}
        reconciledCr={3427.7}
        activeFreezesCount={2}
        hideDoMore={true}
      />

      {/* Additional Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>{t.ministry.cards.totalWorks}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{summary.totalCount || 48}</div>
            <p className="text-xs text-[#6B6B6B]">{t.ministry.cards.totalWorksDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.ministry.cards.utilisation}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{(summary.totalUtilisation || 67.6).toFixed(1)}%</div>
            <p className="text-xs text-[#6B6B6B]">₹{formatCurrencyINR(summary.totalExpended || 32800000)} spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.ministry.cards.critical}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{summary.criticalCount || 3}</div>
            <p className="text-xs text-[#6B6B6B]">{t.ministry.cards.criticalDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.ministry.cards.totalFunds}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(summary.totalSanctioned || 48500000)}</div>
            <p className="text-xs text-[#6B6B6B]">{t.ministry.cards.totalFundsDesc}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskTrendChartCard />

        <Card className="flex flex-col justify-between">
          <CardHeader><CardTitle>{t.ministry.charts.stateOutlay}</CardTitle></CardHeader>
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
                  {STATE_CHART_DATA.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* State table */}
      <Card>
        <CardHeader><CardTitle>{t.ministry.table.title}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.ministry.table.state}</TableHead>
                <TableHead>{t.ministry.table.totalWorks}</TableHead>
                <TableHead>{t.ministry.table.sanctioned}</TableHead>
                <TableHead>{t.ministry.table.utilisation}</TableHead>
                <TableHead>{t.ministry.table.critical}</TableHead>
                <TableHead>{t.ministry.table.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { state: 'Maharashtra', works: 148, sanctioned: '₹124.5 Cr', util: '72.4%', critical: 6 },
                { state: 'Uttar Pradesh', works: 212, sanctioned: '₹188.2 Cr', util: '68.1%', critical: 11 },
              ].map((row) => (
                <TableRow key={row.state}>
                  <TableCell className="font-semibold">{row.state}</TableCell>
                  <TableCell>{row.works}</TableCell>
                  <TableCell>{row.sanctioned}</TableCell>
                  <TableCell>{row.util}</TableCell>
                  <TableCell className={row.critical >= 10 ? 'text-red-600 font-bold' : 'text-orange-600 font-bold'}>
                    {row.critical}
                  </TableCell>
                  <TableCell>
                    <span className="bg-[#9FE870] text-[#0E0E0E] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {t.ministry.table.activeMonitoring}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
