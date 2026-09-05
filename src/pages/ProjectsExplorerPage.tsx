import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Search, ChevronRight, X, Filter } from 'lucide-react';
import { projectService } from '../services/projectService';
import { formatCurrencyINR } from '../lib/utils';
import { useT } from '../i18n/useT';
import { Link, useSearchParams } from 'react-router-dom';
import { Project } from '../types';

export function ProjectsExplorerPage() {
  const t = useT();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialRisk = searchParams.get('risk')?.toUpperCase() || 'ALL';
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialStatus = searchParams.get('status')?.toUpperCase() || 'ALL';
  const initialDistrict = searchParams.get('district') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedRisk, setSelectedRisk] = useState(initialRisk);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);

  // Sync state when URL searchParams change
  useEffect(() => {
    const r = searchParams.get('risk')?.toUpperCase() || 'ALL';
    const c = searchParams.get('category') || 'ALL';
    const s = searchParams.get('status')?.toUpperCase() || 'ALL';
    const d = searchParams.get('district') || 'ALL';
    const q = searchParams.get('search') || '';

    setSelectedRisk(r);
    setSelectedCategory(c);
    setSelectedStatus(s);
    setSelectedDistrict(d);
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    projectService
      .getProjects({
        search: searchQuery,
        category: selectedCategory,
        status: selectedStatus,
        riskLevel: selectedRisk,
        district: selectedDistrict !== 'ALL' ? selectedDistrict : undefined,
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, [searchQuery, selectedCategory, selectedStatus, selectedRisk, selectedDistrict]);

  const categories = ['ALL', 'Education', 'Roads', 'Water', 'Health', 'Sanitation', 'Community', 'Energy', 'Sports'];
  const statuses = ['ALL', 'RECOMMENDED', 'SANCTIONED', 'TENDER_ISSUED', 'WORK_IN_PROGRESS', 'COMPLETED', 'HALTED', 'CANCELLED'];
  const riskLevels = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const handleClearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSelectedRisk('ALL');
    setSelectedDistrict('ALL');
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 font-bold';
    if (score >= 60) return 'text-orange-600 font-semibold';
    if (score >= 30) return 'text-amber-600';
    return 'text-emerald-700';
  };

  const hasActiveFilters = selectedRisk !== 'ALL' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedDistrict !== 'ALL' || Boolean(searchQuery);

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
      <Card className="p-4 bg-[#F1F0EC] border border-[#E5E3DC] rounded-[20px] select-none space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C8C8C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder={t.projects.filter.search}
              className="w-full bg-white border border-[#E5E3DC] rounded-full pl-9 pr-4 py-2 text-xs text-[#0E0E0E] placeholder-[#8C8C8C] focus:outline-none focus:border-[#0E0E0E]"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchParams(prev => {
                const n = new URLSearchParams(prev);
                if (e.target.value === 'ALL') n.delete('category');
                else n.set('category', e.target.value);
                return n;
              });
            }}
            className="w-full bg-white border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs text-[#0E0E0E] focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.projects.filter.category}</option>
            {categories.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setSearchParams(prev => {
                const n = new URLSearchParams(prev);
                if (e.target.value === 'ALL') n.delete('status');
                else n.set('status', e.target.value);
                return n;
              });
            }}
            className="w-full bg-white border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs text-[#0E0E0E] focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t.projects.filter.status}</option>
            {statuses.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Risk Level */}
          <select
            value={selectedRisk}
            onChange={(e) => {
              setSelectedRisk(e.target.value);
              setSearchParams(prev => {
                const n = new URLSearchParams(prev);
                if (e.target.value === 'ALL') n.delete('risk');
                else n.set('risk', e.target.value);
                return n;
              });
            }}
            className="w-full bg-white border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs text-[#0E0E0E] focus:outline-none cursor-pointer font-medium"
          >
            <option value="ALL">{t.projects.filter.risk}</option>
            {riskLevels.slice(1).map((r) => <option key={r} value={r}>{r} RISK</option>)}
          </select>

          {/* Clear */}
          <button
            onClick={handleClearFilters}
            className="w-full bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] text-xs font-semibold py-2 rounded-full cursor-pointer transition-colors flex items-center justify-center gap-1.5"
          >
            {hasActiveFilters && <X className="w-3.5 h-3.5" />}
            <span>{t.projects.filter.clear}</span>
          </button>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E5E3DC] text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] flex items-center gap-1">
              <Filter className="w-3 h-3" /> Active Filter:
            </span>
            {selectedRisk !== 'ALL' && (
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                selectedRisk === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-200' :
                selectedRisk === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                selectedRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                Risk: {selectedRisk}
              </span>
            )}
            {selectedDistrict !== 'ALL' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#0E0E0E] border border-[#E5E3DC]">
                District: {selectedDistrict}
              </span>
            )}
            {selectedCategory !== 'ALL' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#0E0E0E] border border-[#E5E3DC]">
                Category: {selectedCategory}
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#0E0E0E] border border-[#E5E3DC]">
                Status: {selectedStatus}
              </span>
            )}
            {searchQuery && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white text-[#0E0E0E] border border-[#E5E3DC]">
                Search: "{searchQuery}"
              </span>
            )}
          </div>
        )}
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
                          <div className="h-full bg-[#15803D] rounded-full" style={{ width: `${p.physicalProgressPercentage}%` }} />
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
