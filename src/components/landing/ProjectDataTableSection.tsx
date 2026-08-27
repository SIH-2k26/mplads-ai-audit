import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronRight, Eye, ShieldAlert, CheckCircle2, FileText, Plus } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface ProjectRow {
  id: string;
  title: string;
  state: string;
  district: string;
  category: string;
  amount: string;
  physicalProgress: number;
  financialProgress: number;
  riskScore: number;
  riskStatus: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK' | 'ON TRACK';
  slaStatus: 'DELAYED' | 'ON TRACK' | 'CRITICAL';
}

export function ProjectDataTableSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const projects: ProjectRow[] = [
    {
      id: 'P-1023',
      title: 'Community Hall & Skill Centre Ward 17',
      state: 'Maharashtra',
      district: 'Pune',
      category: 'Community Infrastructure',
      amount: '₹42.00 L',
      physicalProgress: 31,
      financialProgress: 92.5,
      riskScore: 86,
      riskStatus: 'HIGH RISK',
      slaStatus: 'CRITICAL',
    },
    {
      id: 'P-0871',
      title: 'Bituminous Village Link Road KM 12/400',
      state: 'Maharashtra',
      district: 'Pune (Haveli)',
      category: 'Roads & Bridges',
      amount: '₹58.00 L',
      physicalProgress: 51,
      financialProgress: 87.0,
      riskScore: 82,
      riskStatus: 'HIGH RISK',
      slaStatus: 'DELAYED',
    },
    {
      id: 'P-0912',
      title: 'Primary Health Diagnostic Solar Unit',
      state: 'Maharashtra',
      district: 'Pune (Baramati)',
      category: 'Public Health',
      amount: '₹34.50 L',
      physicalProgress: 60,
      financialProgress: 75.0,
      riskScore: 72,
      riskStatus: 'MEDIUM RISK',
      slaStatus: 'DELAYED',
    },
    {
      id: 'P-0412',
      title: 'Digital Smart Classroom STEM Complex',
      state: 'NCT of Delhi',
      district: 'East Delhi',
      category: 'Education',
      amount: '₹24.50 L',
      physicalProgress: 95,
      financialProgress: 95.0,
      riskScore: 24,
      riskStatus: 'LOW RISK',
      slaStatus: 'ON TRACK',
    },
    {
      id: 'P-0889',
      title: 'Rural Drinking Water RO Plant Units',
      state: 'Karnataka',
      district: 'Bangalore Rural',
      category: 'Drinking Water',
      amount: '₹32.00 L',
      physicalProgress: 70,
      financialProgress: 70.0,
      riskScore: 68,
      riskStatus: 'MEDIUM RISK',
      slaStatus: 'DELAYED',
    },
    {
      id: 'P-0655',
      title: 'Zilla Parishad High School Science Wing',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      category: 'Education',
      amount: '₹48.00 L',
      physicalProgress: 88,
      financialProgress: 88.0,
      riskScore: 35,
      riskStatus: 'LOW RISK',
      slaStatus: 'ON TRACK',
    },
  ];

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.state.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'HIGH') return matchesSearch && p.riskScore >= 80;
    if (selectedFilter === 'MEDIUM') return matchesSearch && p.riskScore >= 60 && p.riskScore < 80;
    if (selectedFilter === 'LOW') return matchesSearch && p.riskScore < 60;
    return matchesSearch;
  });

  const handleQueueSimulation = (p: ProjectRow) => {
    toast.success(`Project ${p.id} added to Priority Investigation Docket`, {
      description: `Dispatched to ${p.district} District Authority audit queue.`,
    });
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF7] border-b border-[#D9DFE3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D99016] bg-[#D99016]/10 px-3 py-1 rounded-full border border-[#D99016]/30">
              NATIONAL PROJECT AUDIT DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#15324A] tracking-tight uppercase mt-2 font-sans">
              Monitored Works Explorer
            </h2>
            <p className="text-xs sm:text-sm text-[#647383] mt-1">
              Search and filter across live parliamentary recommendations and technical sanction milestones.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#647383]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, title, district..."
                className="pl-8 pr-3 py-1.5 rounded-[4px] border border-[#D9DFE3] bg-white text-xs text-[#172B3A] placeholder-[#647383] outline-none focus:border-[#15324A] w-64"
              />
            </div>

            <div className="flex rounded-[4px] border border-[#D9DFE3] bg-white p-0.5">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFilter(f)}
                  className={`px-2.5 py-1 rounded-[3px] text-[10px] font-mono font-bold transition-colors ${
                    selectedFilter === f
                      ? 'bg-[#15324A] text-white'
                      : 'text-[#647383] hover:text-[#172B3A]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Structured Table Card */}
        <div className="rounded-[8px] border-2 border-[#15324A] bg-white shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAF7] text-[11px] font-mono uppercase tracking-wider">
                  <TableHead className="font-bold text-[#15324A]">Project & Ref ID</TableHead>
                  <TableHead className="font-bold text-[#15324A]">State & District</TableHead>
                  <TableHead className="font-bold text-[#15324A]">Sector</TableHead>
                  <TableHead className="font-bold text-[#15324A]">Outlay</TableHead>
                  <TableHead className="font-bold text-[#15324A]">Progress (Phy / Fin)</TableHead>
                  <TableHead className="font-bold text-[#15324A]">Risk Index</TableHead>
                  <TableHead className="font-bold text-[#15324A] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="hover:bg-[#F3F5F4]/60 transition-colors">
                    <TableCell>
                      <div>
                        <span className="font-bold text-xs text-[#172B3A] block hover:text-[#D99016] transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#647383]">
                          Ref: {p.id}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-[#172B3A] block">{p.district}</span>
                      <span className="text-[10px] text-[#647383]">{p.state}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-[#647383]">{p.category}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono font-bold text-[#15324A]">{p.amount}</span>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#2E8064] font-semibold">{p.physicalProgress}% Phy</span>
                          <span className="text-[#C94B4B] font-semibold">{p.financialProgress}% Fin</span>
                        </div>
                        <div className="h-1.5 w-28 bg-[#D9DFE3] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#15324A] rounded-full"
                            style={{ width: `${p.physicalProgress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-mono font-extrabold px-1.5 py-0.5 rounded ${
                            p.riskScore >= 80
                              ? 'bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30'
                              : p.riskScore >= 60
                              ? 'bg-amber-50 text-[#C98220] border border-[#C98220]/30'
                              : 'bg-emerald-50 text-[#2E8064] border border-[#2E8064]/30'
                          }`}
                        >
                          {p.riskScore}
                        </span>
                        <span className="text-[10px] font-mono text-[#647383] font-bold">
                          {p.riskStatus}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQueueSimulation(p)}
                          className="h-7 px-2 text-[10px] text-[#647383] hover:text-[#15324A] hover:bg-[#D9DFE3]/50"
                          title="Add to Investigation Queue"
                        >
                          <Plus className="h-3 w-3 mr-0.5" /> Docket
                        </Button>

                        <Link to={`/projects/${p.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px] font-bold border-[#15324A] text-[#15324A] hover:bg-[#15324A] hover:text-white"
                          >
                            <Eye className="h-3 w-3 mr-1" /> View Twin
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-3 border-t border-[#D9DFE3] bg-[#FAFAF7] flex items-center justify-between text-xs text-[#647383]">
            <span>Showing {filtered.length} of {projects.length} sample works</span>
            <Link to="/projects" className="font-bold text-[#15324A] hover:underline flex items-center gap-1">
              Explore All 7,842 Projects <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
