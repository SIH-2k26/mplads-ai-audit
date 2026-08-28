import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { projectService } from '../services/projectService';
import { useT } from '../i18n/useT';
import { formatCurrencyINR } from '../lib/utils';
import { Link } from 'react-router-dom';
import { Project } from '../types';

export function MpDashboardPage() {
  const t = useT();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const totalSanctioned = projects.reduce((acc, p) => acc + p.sanctionedAmount, 0);
  const totalExpended = projects.reduce((acc, p) => acc + p.expenditure, 0);

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title={t.mp.title}
        subtitle={t.mp.subtitle}
        breadcrumbs={[
          { label: t.common.home, path: '/' },
          { label: t.nav.mpOverview },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>{t.mp.cards.sanctioned}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(totalSanctioned)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.mp.cards.expenditure}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">₹{formatCurrencyINR(totalExpended)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>{t.mp.cards.activeWorks}</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{projects.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t.mp.table.title}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.mp.table.code}</TableHead>
                <TableHead>{t.mp.table.project}</TableHead>
                <TableHead>{t.mp.table.sanctioned}</TableHead>
                <TableHead>{t.mp.table.physical}</TableHead>
                <TableHead>{t.mp.table.financial}</TableHead>
                <TableHead>{t.mp.table.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-xs text-[#6B6B6B]">
                    {t.mp.table.loading}
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono">{p.code}</TableCell>
                    <TableCell>{p.title}</TableCell>
                    <TableCell>₹{formatCurrencyINR(p.sanctionedAmount)}</TableCell>
                    <TableCell>{p.physicalProgressPercentage}%</TableCell>
                    <TableCell>{p.financialProgressPercentage}%</TableCell>
                    <TableCell>
                      <Link to={`/projects/${p.id}`}>
                        <Button variant="outline" size="sm">{t.mp.table.inspect}</Button>
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
