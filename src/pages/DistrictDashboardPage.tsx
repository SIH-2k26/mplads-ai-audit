import React, { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { projectService } from '../services/projectService';
import { useRoleStore } from '../stores/useRoleStore';
import { useT } from '../i18n/useT';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#9FE870',
  WORK_IN_PROGRESS: '#EAE8E2',
  SANCTIONED: '#E5E3DC',
  HALTED: '#EF4444',
  RECOMMENDED: '#C2C0B8',
};

export function DistrictDashboardPage() {
  const t = useT();
  const { selectedDistrict } = useRoleStore();

  const [summary, setSummary] = useState({
    totalCount: 0, criticalCount: 0, totalSanctioned: 0,
    totalExpended: 0, totalUtilisation: 0, delayedCount: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    projectService.getProjectsSummary(selectedDistrict).then(setSummary);
    projectService.getProjects({ district: selectedDistrict }).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, [selectedDistrict]);

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => { counts[p.status] = (counts[p.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value,
      color: STATUS_COLORS[name] || '#D4D1C7',
    }));
  }, [projects]);

  const getRiskBadge = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-700 border-red-200';
    if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (score >= 35) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title={`${t.district.title} - ${selectedDistrict.toUpperCase()}`}
        subtitle={t.district.subtitle}
        breadcrumbs={[
          { label: t.common.home, path: '/' },
          { label: t.nav.districtCommand },
        ]}
      />

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>{t.district.cards.works}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{summary.totalCount}</div>
            <p className="text-xs text-[#6B6B6B]">{t.district.cards.worksDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.district.cards.sanctioned}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(summary.totalSanctioned)}</div>
            <p className="text-xs text-[#6B6B6B]">{t.district.cards.sanctionedDesc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.district.cards.expenditure}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(summary.totalExpended)}</div>
            <p className="text-xs text-[#6B6B6B]">{t.district.cards.expenditureDesc} ({summary.totalUtilisation.toFixed(1)}%)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.district.cards.criticalOverlaps}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-red-600">{summary.criticalCount}</div>
            <p className="text-xs text-[#6B6B6B]">{t.district.cards.criticalOverlapsDesc}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {statusChartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle>{t.district.charts.statusDistribution}</CardTitle></CardHeader>
            <CardContent className="h-56 flex flex-col justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                    {statusChartData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0E0E0E', borderColor: 'transparent', borderRadius: '12px' }}
                    itemStyle={{ color: '#FFFFFF', fontSize: '11px' }}
                  />
                  <Legend verticalAlign="bottom" iconSize={8} formatter={(v) => <span className="text-[10px] text-[#6B6B6B] font-medium">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>{t.district.charts.riskMatrix}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-[#6B6B6B]">
                Vigilance audit compliance monitoring for {selectedDistrict} district.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-white rounded-2xl border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#6B6B6B] block uppercase tracking-wider font-bold">{t.district.charts.lowRisk}</span>
                  <span className="text-lg font-bold text-emerald-700 block mt-1 font-mono">
                    {projects.filter((p) => p.currentRiskScore <= 29).length} works
                  </span>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#6B6B6B] block uppercase tracking-wider font-bold">{t.district.charts.atRisk}</span>
                  <span className="text-lg font-bold text-red-600 block mt-1 font-mono">
                    {projects.filter((p) => p.currentRiskScore >= 60).length} works
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.district.table.title} ({selectedDistrict})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.district.table.code}</TableHead>
                <TableHead>{t.district.table.project}</TableHead>
                <TableHead>{t.district.table.sanctioned}</TableHead>
                <TableHead>{t.district.table.physical}</TableHead>
                <TableHead>{t.district.table.risk}</TableHead>
                <TableHead>{t.district.table.status}</TableHead>
                <TableHead>{t.district.table.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-xs text-[#6B6B6B]">
                    {t.district.table.loading}
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-xs text-[#6B6B6B]">
                    {t.district.table.noResults} {selectedDistrict} {t.district.table.district}
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">{p.code}</TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>₹{formatCurrencyINR(p.sanctionedAmount)}</TableCell>
                    <TableCell>{p.physicalProgressPercentage}%</TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(p.currentRiskScore)}`}>
                        {p.currentRiskScore}/100
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="bg-[#EAE8E2] text-[#0E0E0E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {p.status.replace(/_/g, ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/projects/${p.id}`}>
                        <Button variant="outline" size="sm">{t.district.table.inspect}</Button>
                      </Link>
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
