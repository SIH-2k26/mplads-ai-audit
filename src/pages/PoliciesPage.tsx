import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { policyService } from '../services/policyService';
import { PolicyRule } from '../types';
import { Search, BookOpen, FileCheck, ShieldAlert } from 'lucide-react';

export function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    policyService.getPolicies(search).then((data) => {
      setPolicies(data);
      setLoading(false);
    });
  }, [search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="MPLADS Statutory Guidelines & Regulatory Repository"
        subtitle="Searchable codified rules, GFR mandates, CVC procurement circulars, and evidentiary standards"
        badge={<Badge variant="default">{policies.length} Codified Rules</Badge>}
      />

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#667085]" />
            <Input
              type="text"
              placeholder="Search by rule code, title, section, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {policies.map((pol) => (
          <Card key={pol.id} id={pol.id} className="border-l-4 border-l-[#18324A]">
            <CardHeader className="bg-[#FAFAF7]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#18324A]" />
                  <span className="font-bold text-[#18324A] text-sm">{pol.documentName}</span>
                  <span className="font-mono text-xs text-[#C98219] font-bold">
                    {pol.section} (Page {pol.page})
                  </span>
                </div>
                <Badge variant={pol.severity === 'CRITICAL' ? 'critical' : 'warning'}>
                  {pol.severity} ENFORCEMENT
                </Badge>
              </div>
              <CardTitle className="text-sm mt-1">{pol.title}</CardTitle>
              <CardDescription className="text-xs text-[#667085]">
                Issuing Authority: {pol.issuingAuthority} • Effective: {pol.effectiveDate} • Applicability: {pol.applicability}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-4 text-xs">
              <p className="text-[#1D2939] font-medium leading-relaxed">
                {pol.summary}
              </p>

              {pol.textSnippet && (
                <blockquote className="border-l-2 border-[#C98219] pl-3 py-1.5 text-[11px] italic text-[#667085] bg-[#FAFAF7] rounded-r leading-relaxed">
                  "{pol.textSnippet}"
                </blockquote>
              )}

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1.5">
                  Required Corroborating Evidence Checklist:
                </span>
                <div className="flex flex-wrap gap-2">
                  {pol.requiredEvidence.map((ev, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-[#EDE8DE] text-[#18324A] px-2 py-0.5 rounded text-[11px] font-medium"
                    >
                      <FileCheck className="h-3 w-3 text-[#2F7658]" />
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
