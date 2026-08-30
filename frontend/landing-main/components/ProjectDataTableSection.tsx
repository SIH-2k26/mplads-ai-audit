import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, ChevronRight, Eye, ShieldAlert, CheckCircle2, FileText, Plus, ShieldQuestion } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ProjectRiskSheet, ProjectRiskData } from './domain/ProjectRiskSheet';
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
  reasons: string[];
  recommendedAction: string;
}

export function ProjectDataTableSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedProjectForSheet, setSelectedProjectForSheet] = useState<ProjectRiskData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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
      reasons: [
        '+38.2% cost deviation above prevailing PWD Schedule of Rates 2024-25 baseline',
        '+51.5% progress gap: 92.5% funds disbursed vs only 31.0% physical execution',
        'Single-bid tender award with compressed 8-day notice period',
        'Contractor concentration: firm holds 38.5% of total ward public works',
        'Missing mandatory GFR-12C Utilisation Certificate (UC-02 overdue by 45 days)',
      ],
      recommendedAction: 'Verify structural estimate, inspect site for duplicate MLALADS claim, and withhold 2nd fund disbursement.',
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
      reasons: [
        '88% geospatial polygon alignment with PMGSY Batch III completed in Nov 2023',
        'Single-bid tender award with compressed 8-day notice period',
        '+24.5% unit rate inflation on bitumen grade VG-30 against State PWD SoR',
      ],
      recommendedAction: 'Execute GPS geofenced road inspection survey to verify new pavement vs pre-existing PMGSY carpet.',
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
      reasons: [
        '+42.0% cost deviation on 15kVA solar panels vs GeM direct purchase rate',
        'Unverified contractor GST status at time of work order issue',
      ],
      recommendedAction: 'Reconcile bill of quantities with GeM standard product rate cards and demand contractor explanation.',
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
      reasons: [
        'All milestone deliverables submitted on schedule',
        'Direct GeM procurement with transparent manufacturer warranty',
      ],
      recommendedAction: 'Routine final completion inspection prior to asset handover.',
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
      reasons: [
        '32 days delay in electrical grid transformer connection approval',
        'Water quality lab certification pending from State Nodal Agency',
      ],
      recommendedAction: 'Follow up with DISCOM for statutory grid energization certificate.',
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
      reasons: [
        'Physical progress aligned with approved architectural drawings',
        'All three installment vouchers verified with Treasury DBT logs',
      ],
      recommendedAction: 'Final verification brief generation for district archival.',
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

  const handleOpenRiskSheet = (p: ProjectRow) => {
    setSelectedProjectForSheet({
      id: p.id,
      title: p.title,
      category: p.category,
      location: `${p.district}, ${p.state}`,
      state: p.state,
      district: p.district,
      sanctionedAmount: p.amount,
      expenditure: p.amount,
      physicalProgress: p.physicalProgress,
      financialProgress: p.financialProgress,
      expectedCompletion: '30 Oct 2026',
      riskScore: p.riskScore,
      severity: p.riskScore >= 80 ? 'CRITICAL' : p.riskScore >= 60 ? 'HIGH' : 'LOW',
      reasons: p.reasons,
      evidenceDocuments: [
        { name: `Technical Sanction (${p.id}-TS.pdf)`, type: 'Estimate', status: 'VERIFIED', date: '14 Feb 2025' },
        { name: `e-Tender Bid Comparative Statement`, type: 'Procurement', status: p.riskScore >= 80 ? 'FLAGGED' : 'VERIFIED', date: '28 Feb 2025' },
        { name: `Treasury DBT Vouchers (V-991 to V-994)`, type: 'Disbursement', status: 'AVAILABLE', date: '12 May 2025' },
        { name: `Geotagged Foundation Excavation Photo`, type: 'Site EXIF', status: 'VERIFIED', date: '20 Jun 2025' },
        { name: `GFR-12C Utilisation Certificate Stage 2`, type: 'Statutory', status: p.riskScore >= 80 ? 'FLAGGED' : 'PENDING', date: '15 Jul 2025' },
      ],
      recommendedAction: p.recommendedAction,
      executingAgency: 'District Implementing Agency',
      contractor: 'Awarded Contractor Entity',
    });
    setSheetOpen(true);
  };

  return (
    <section className="py-20 sm:py-28 bg-transparent border-b border-[#E5E3DC] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3.5 py-1 rounded-full border border-[#002449]/30 inline-block">
              CHAPTER 10 • NATIONAL PROJECT AUDIT DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#002449] tracking-tight uppercase mt-2 font-sans">
              Monitored Works Explorer
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1 font-sans">
              Search and filter across live parliamentary recommendations, technical sanction milestones, and explainable risk scores.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, title, district..."
                className="pl-10 pr-4 py-2 rounded-full border border-[#E5E3DC] bg-[#F1F0EC] text-xs text-[#0E0E0E] placeholder-[#6B6B6B] outline-none focus:border-[#002449] focus:bg-white w-64 transition-all"
              />
            </div>

            <div className="flex rounded-full border border-[#E5E3DC] bg-[#F1F0EC] p-1">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFilter(f)}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    selectedFilter === f
                      ? 'bg-[#002449] text-white shadow-xs'
                      : 'text-[#6B6B6B] hover:text-[#0E0E0E]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Structured Table Card */}
        <div className="rounded-[20px] border border-[#E5E3DC] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAFAF9] text-[11px] font-mono uppercase tracking-wider">
                  <TableHead className="font-bold text-[#002449]">Project & Ref ID</TableHead>
                  <TableHead className="font-bold text-[#002449]">State & District</TableHead>
                  <TableHead className="font-bold text-[#002449]">Sector</TableHead>
                  <TableHead className="font-bold text-[#002449]">Outlay</TableHead>
                  <TableHead className="font-bold text-[#002449]">Progress (Phy / Fin)</TableHead>
                  <TableHead className="font-bold text-[#002449]">Risk Index</TableHead>
                  <TableHead className="font-bold text-[#002449] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    onClick={() => handleOpenRiskSheet(p)}
                    className="hover:bg-[#F1F0EC]/60 transition-colors cursor-pointer"
                  >
                    <TableCell>
                      <div>
                        <span className="font-bold text-xs text-[#0E0E0E] block hover:text-[#002449] transition-colors">
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#6B6B6B]">
                          Ref: {p.id}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-[#0E0E0E] block">{p.district}</span>
                      <span className="text-[10px] text-[#6B6B6B]">{p.state}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-[#6B6B6B]">{p.category}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-mono font-bold text-[#002449]">{p.amount}</span>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#2E8064] font-semibold">{p.physicalProgress}% Phy</span>
                          <span className="text-[#C94B4B] font-semibold">{p.financialProgress}% Fin</span>
                        </div>
                        <div className="h-1.5 w-28 bg-[#E5E3DC] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#002449] rounded-full"
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
                        <span className="text-[10px] font-mono text-[#6B6B6B] font-bold">
                          {p.riskStatus}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenRiskSheet(p)}
                          className="h-7 px-2 text-[10px] font-semibold text-[#002449] hover:bg-[#E5E3DC]/50"
                          title="Open Risk Drawer"
                        >
                          <ShieldAlert className="h-3 w-3 mr-1 text-[#002449]" />
                          Inspect Risk
                        </Button>

                        <Link to={`/projects/${p.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[10px] font-bold border-[#002449] text-[#002449] hover:bg-[#002449] rounded-full hover:text-white"
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

          <div className="p-3 border-t border-[#E5E3DC] bg-[#FAFAF9] flex items-center justify-between text-xs text-[#6B6B6B]">
            <span>Showing {filtered.length} of {projects.length} sample works (Click any row to open Risk Sheet)</span>
            <Link to="/projects" className="font-bold text-[#002449] hover:underline flex items-center gap-1">
              Explore All 7,842 Projects <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* REUSABLE PROJECT RISK SHEET DRAWER */}
      <ProjectRiskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        project={selectedProjectForSheet}
      />
    </section>
  );
}
