import React from 'react';
import { Landmark, TrendingUp, ShieldAlert, Globe } from 'lucide-react';

export function HeroStatsBar() {
  const stats = [
    {
      value: '7,842',
      label: 'PROJECTS MONITORED',
      subtext: 'Across all Parliamentary Constituencies',
      icon: Landmark,
    },
    {
      value: '₹3,812 Cr',
      label: 'FUNDS TRACKED',
      subtext: 'Annual sanctioned public outlays',
      icon: TrendingUp,
    },
    {
      value: '416',
      label: 'HIGH-RISK SIGNALS',
      subtext: 'Proactively flagged for early intervention',
      icon: ShieldAlert,
    },
    {
      value: '28',
      label: 'STATES & REGIONS',
      subtext: 'Synchronized on-ground telemetry',
      icon: Globe,
    },
  ];

  return (
    <section className="border-y border-[#D9D5CC] bg-white py-10 shadow-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#EDE8DE]">
          {stats.map((stat, i) => {
            const Icon = stat.icon;

            return (
              <div key={i} className={`pt-4 lg:pt-0 ${i > 0 ? 'lg:pl-8' : ''}`}>
                <div className="flex items-center gap-2 text-[#C98219] mb-1">
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#667085] uppercase">
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-[#18324A] tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs text-[#667085] mt-1 font-normal">
                  {stat.subtext}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
