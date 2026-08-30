import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Search, ChevronRight } from 'lucide-react';
import { projectService } from '../services/projectService';
import { formatCurrencyINR } from '../lib/utils';
import { useT } from '../i18n/useT';
import { Link } from 'react-router-dom';
import { Project } from '../types';

export function ProjectsExplorerPage() {
  const t = useT();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    projectService
      .getProjects({ search: searchQuery, category: selectedCategory, status: selectedStatus, riskLevel: selectedRisk })
      .then((data) => { setProjects(data); setLoading(false); });
  }, [searchQuery, selectedCategory, selectedStatus, selectedRisk]);

  const categories = ['ALL', 'Education', 'Roads', 'Water', 'Health', 'Sanitation', 'Community', 'Energy', 'Sports'];
  const statuses = ['ALL', 'RECOMMENDED', 'SANCTIONED', 'TENDER_ISSUED', 'WORK_IN_PROGRESS', 'COMPLETED', 'HALTED', 'CANCELLED'];
  const riskLevels = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 font-bold';
    if (score >= 60) return 'text-orange-600 font-semibold';
    if (score >= 35) return 'text-amber-600';
    return 'text-emerald-700';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.projects.title}
        subtitle={t.projects.subtitle}
        breadcrumbs={[
          { label: t.common.home, path: '/' },
          { label: t.nav.projectsExplorer },
        ]}
      />

      {/* Filter Toolbar */}
      <Card className="p-4 bg-[#F1F0EC] border border-[#E5E3DC] rounded-[20px] select-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8C8C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.projects.filter.search}
              className="w-full bg-white border border-[#E5E3DC] rounded-full pl-9 pr-4 py-2 text-xs text-[#0E0E0E] placeholder-[#8C8C8C] focus:outline-none focus:border-[#0E0E0E]"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs text-[#0E0E0E] focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.projects.filter.category}</option>
            {categories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs text-[#0E0E0E] focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.projects.filter.status}</option>
            {statuses.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Risk Level */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full bg-white border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs text-[#0E0E0E] focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.projects.filter.risk}</option>
            {riskLevels.slice(1).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Clear */}
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setSelectedStatus('ALL'); setSelectedRisk('ALL'); }}
            className="w-full bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] text-xs font-semibold py-2 rounded-full cursor-pointer transition-colors"
          >
            {t.projects.filter.clear}
          </button>
        </div>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.projects.table.title} ({projects.length} {t.nav.projectsExplorer.toLowerCase()})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.projects.table.code}</TableHead>
                <TableHead>{t.projects.table.project}</TableHead>
                <TableHead>{t.projects.table.category}</TableHead>
                <TableHead>{t.projects.table.sanctioned}</TableHead>
                <TableHead>{t.projects.table.physical}</TableHead>
                <TableHead>{t.projects.table.risk}</TableHead>
                <TableHead>{t.projects.table.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-xs text-[#6B6B6B]">
                    {t.projects.table.loading}
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-xs text-[#6B6B6B]">
                    {t.projects.table.noResults}
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">{p.code}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-[#0E0E0E]">{p.title}</div>
                      <div className="text-[10px] text-[#6B6B6B]">
                        {t.common.contractor}: {p.contractor.name} • {p.district}, {p.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-[#EAE8E2] text-[#0E0E0E] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {p.category}
                      </span>
                    </TableCell>
                    <TableCell>₹{formatCurrencyINR(p.sanctionedAmount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold">{p.physicalProgressPercentage}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-black/5 overflow-hidden hidden sm:block">
                          <div className="h-full bg-[#9FE870] rounded-full" style={{ width: `${p.physicalProgressPercentage}%` }} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={getRiskColor(p.currentRiskScore)}>
                      {p.currentRiskScore}/100
                    </TableCell>
                    <TableCell>
                      <Link to={`/projects/${p.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <span>{t.projects.table.inspectTwin}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
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
