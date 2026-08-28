import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { formatCurrencyINR, getRiskColorClass } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Download, Plus } from 'lucide-react';

export function ProjectsExplorerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    projectService
      .getProjects({
        search,
        category: categoryFilter,
        riskLevel: riskFilter,
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, [search, categoryFilter, riskFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="MPLADS Projects Explorer"
        subtitle="Comprehensive register of sanctioned works, physical progress telemetry, and risk indices"
        badge={<Badge variant="secondary">{projects.length} Works Listed</Badge>}
      />

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
              <Input
                type="text"
                placeholder="Search by project code, title, contractor, or block..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-[4px] border border-[#D9D5CC] bg-white px-3 py-1.5 text-xs text-[#1D2939] focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Community">Community</option>
                <option value="Roads">Roads</option>
                <option value="Water">Water</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Sanitation">Sanitation</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="rounded-[4px] border border-[#D9D5CC] bg-white px-3 py-1.5 text-xs text-[#1D2939] focus:outline-none"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical Risk (80+)</option>
                <option value="HIGH">High Risk (60-79)</option>
                <option value="MEDIUM">Medium Risk (35-59)</option>
                <option value="LOW">Low Risk (0-34)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Code</TableHead>
                <TableHead>Work Title & Sector</TableHead>
                <TableHead>District & Block</TableHead>
                <TableHead>Sanctioned</TableHead>
                <TableHead>Fin / Phy</TableHead>
                <TableHead>Risk Index</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Digital Twin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-xs text-[#667085]">
                    Loading project records...
                  </TableCell>
                </TableRow>
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-xs text-[#667085]">
                    No projects found matching current search and filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((prj) => {
                  const riskStyle = getRiskColorClass(prj.currentRiskScore);

                  return (
                    <TableRow key={prj.id}>
                      <TableCell className="font-mono font-bold text-[#18324A]">
                        {prj.code}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-bold text-[#18324A] truncate">{prj.title}</div>
                        <div className="text-[11px] text-[#667085]">{prj.category} • {prj.contractor.name}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-semibold text-[#18324A]">{prj.district}</div>
                        <div className="text-[11px] text-[#667085] truncate">{prj.location.wardOrVillage}</div>
                      </TableCell>
                      <TableCell className="font-mono font-bold text-[#18324A]">
                        {formatCurrencyINR(prj.sanctionedAmount)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="text-[#18324A] font-semibold">{prj.financialProgressPercentage}% Fin</div>
                        <div className="text-[#2F7658] font-semibold">{prj.physicalProgressPercentage}% Phy</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-[3px] font-mono font-bold text-xs border ${riskStyle.badgeBg}`}>
                          {prj.currentRiskScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {prj.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/projects/${prj.id}`}>
                          <Button variant="default" size="sm" className="h-7 text-xs flex items-center gap-1">
                            Digital Twin <ArrowRight className="h-3 w-3" />
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
