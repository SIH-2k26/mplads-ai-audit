import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Activity, Layers, Globe2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function FourViewsSection() {
  const views = [
    {
      role: '01. MEMBER OF PARLIAMENT (MP)',
      headline: 'Understand Your Constituency.',
      subtext: 'Summary-oriented view tailored for elected representatives. Track fund utilisation quotas, sector-wise asset portfolios, and plain-language project milestones.',
      path: '/mp',
      icon: Landmark,
      metrics: ['128 Works Sanctioned', '76.4% Fund Utilised', '13 Needs Attention'],
      previewLabel: 'Pune Parliamentary Constituency',
      color: 'border-l-[#C98219]',
    },
    {
      role: '02. DISTRICT AUTHORITY / COLLECTOR',
      headline: 'Act on What Needs Attention.',
      subtext: 'Operational command centre for District Collectors. Actionable queues for SLA breaches, AI pre-sanction risk checks, and financial vs physical progress mismatch watchlists.',
      path: '/district',
      icon: Activity,
      metrics: ['21 Require Decision', '3 SLA Breaches', '12 Pending Sanctions'],
      previewLabel: 'Pune District Command Centre',
      color: 'border-l-[#18324A]',
    },
    {
      role: '03. STATE NODAL AUTHORITY (SNA)',
      headline: 'See Systemic Statewide Patterns.',
      subtext: 'Cross-district risk heatmap, contractor concentration syndicates, and duplicate work clusters across the entire State of Maharashtra.',
      path: '/state',
      icon: Layers,
      metrics: ['2,481 Statewide Works', '₹1,248 Cr Portfolio', '12 Contractor Cartel Flags'],
      previewLabel: 'Government of Maharashtra',
      color: 'border-l-[#B7791F]',
    },
    {
      role: '04. MINISTRY / DIID DIRECTORATE',
      headline: 'Understand the National Picture.',
      subtext: 'Strategic executive oversight for MoSPI. 12-month longitudinal risk trajectories, all-India risk heatmaps, and national investigation queues.',
      path: '/ministry',
      icon: Globe2,
      metrics: ['7,842 Total Projects', '₹3,812 Cr Tracked', '192 Open Inquiries'],
      previewLabel: 'All India Executive Oversight',
      color: 'border-l-[#B44343]',
    },
  ];

  return (
    <section id="views" className="py-24 bg-white border-b border-[#D9D5CC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C98219] bg-[#C98219]/10 px-3 py-1 rounded-full border border-[#C98219]/30">
            Four Governance Lenses
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18324A] tracking-tight uppercase">
            Tailored Cockpits for Every Level of Authority
          </h2>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            Different statutory roles have distinct mandates. Sanchay delivers role-specific intelligence lenses over the same unified data foundation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {views.map((v) => {
            const Icon = v.icon;

            return (
              <Card
                key={v.role}
                className={`flex flex-col justify-between border-l-4 ${v.color} hover:shadow-elevated transition-all`}
              >
                <CardHeader className="bg-[#FAFAF7] pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-[#667085]">
                      {v.role}
                    </span>
                    <div className="p-1.5 rounded bg-[#EDE8DE] text-[#18324A]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-[#18324A]">
                    {v.headline}
                  </CardTitle>
                  <CardDescription className="text-xs text-[#667085] leading-relaxed mt-1.5">
                    {v.subtext}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-xs">
                  <div className="flex flex-wrap gap-2">
                    {v.metrics.map((m, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-[#FAFAF7] border border-[#D9D5CC] px-2.5 py-1 text-[11px] font-mono font-semibold text-[#18324A]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#EDE8DE] flex items-center justify-between">
                    <span className="text-[10px] text-[#667085] font-mono">
                      {v.previewLabel}
                    </span>
                    <Link to={v.path}>
                      <Button variant="default" size="sm" className="text-xs flex items-center gap-1.5 font-bold">
                        <span>Enter Dashboard</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
