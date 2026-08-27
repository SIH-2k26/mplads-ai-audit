import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { caseService } from '../services/caseService';
import { CaseInvestigation, CaseStatus } from '../types';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { Input } from '../components/ui/input';

export function CasesPage() {
  const [cases, setCases] = useState<CaseInvestigation[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    caseService
      .getCases({
        search,
        status: statusFilter,
      })
      .then((data) => {
        setCases(data);
        setLoading(false);
      });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Investigation & Case Management"
        subtitle="Auditable investigations, formal inquiry dossiers, and statutory human decision records"
        badge={<Badge variant="default">{cases.length} Open Inquiries</Badge>}
      />

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
              <Input
                type="text"
                placeholder="Search by case number, project title, or investigator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-[4px] border border-[#D9D5CC] bg-white px-3 py-1.5 text-xs text-[#1D2939] focus:outline-none"
            >
              <option value="ALL">All Inquiry Statuses</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="CONFIRMED_ISSUE">Confirmed Irregularity</option>
              <option value="RESOLVED">Resolved / Rectified</option>
              <option value="FALSE_POSITIVE">Dismissed False Positive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case File No.</TableHead>
                <TableHead>Project Under Inquiry</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Assigned Investigator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Workspace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-[#667085]">
                    Loading investigation files...
                  </TableCell>
                </TableRow>
              ) : cases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-[#667085]">
                    No case files found.
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-bold text-[#18324A]">
                      {c.caseNumber}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-bold text-[#18324A] truncate">{c.projectTitle}</div>
                      <div className="text-[11px] text-[#667085] truncate">{c.whyFlagged}</div>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-[#18324A]">
                      {c.district}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 rounded-[3px] font-mono font-bold text-xs bg-red-50 text-[#B44343] border border-[#B44343]/30">
                        {c.riskScore}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-[#1D2939]">
                      {c.assignedInvestigator}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'RESOLVED' ? 'success' : 'saffron'}>
                        {c.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/cases/${c.id}`}>
                        <Button variant="default" size="sm" className="h-7 text-xs flex items-center gap-1">
                          Inquiry Dossier <ArrowRight className="h-3 w-3" />
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
