import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { FileSpreadsheet, Download, FileText, Printer } from 'lucide-react';

export function ReportsPage() {
  const reports = [
    {
      title: 'District Quarterly Anomaly & Variance Audit (Q2 FY 26-27)',
      desc: 'Summary of 128 works in Pune District, including 7 flagged cost overruns and 3 UC overdue notices.',
      date: '24 Aug 2026',
      size: '3.4 MB',
    },
    {
      title: 'Contractor Cartelization & Syndicate Network Report',
      desc: 'Top 5 vendor clusters in Maharashtra with >40% single-block concentration.',
      date: '18 Aug 2026',
      size: '5.1 MB',
    },
    {
      title: 'Pre-Sanction Statutory Compliance & Duplication Audit',
      desc: 'De-duplication cross-match report against PMGSY, Jal Jeevan Mission, and State PWD works.',
      date: '12 Aug 2026',
      size: '2.8 MB',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statutory Audit Reports & Dossiers"
        subtitle="Downloadable executive briefs, CAG audit preparations, and PAC inquiry dossiers"
        badge={<Badge variant="secondary">Official Output</Badge>}
      />

      <div className="space-y-4">
        {reports.map((r, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#EDE8DE] text-[#18324A]">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">{r.title}</CardTitle>
                  <CardDescription>{r.desc}</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1.5"
                onClick={() => window.print()}
              >
                <Download className="h-3.5 w-3.5" />
                Export PDF
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
