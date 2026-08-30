import React from 'react';
import { AlertTriangle, TrendingUp, Clock, Copy, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function EarlyWarningSection() {
  const signals = [
    {
      title: 'Cost Overrun Probability',
      score: 78,
      status: 'HIGH RISK',
      desc: 'Material price inflation & SoR deviation detected early in execution.',
      icon: TrendingUp,
      barColor: 'bg-[#C74747]',
      textColor: 'text-[#C74747]',
    },
    {
      title: 'Milestone Delay Risk',
      score: 64,
      status: 'MODERATE RISK',
      desc: 'Execution velocity suggests +45 day completion delay beyond statutory SLA.',
      icon: Clock,
      barColor: 'bg-[#C98220]',
      textColor: 'text-[#C98220]',
    },
    {
      title: 'Duplicate Work Flag',
      score: 74,
      status: 'HIGH SIMILARITY',
      desc: '74% spatial and title overlap with state budget community hall work.',
      icon: Copy,
      barColor: 'bg-[#C74747]',
      textColor: 'text-[#C74747]',
    },
    {
      title: 'Tender Concentration Risk',
      score: 52,
      status: 'WATCHLIST',
      desc: 'Contractor concentration approaching CVC single-vendor threshold in block.',
      icon: ShieldAlert,
      barColor: 'bg-[#C98220]',
      textColor: 'text-[#C98220]',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF9] border-b border-[#E5E3DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3 py-1 rounded-full border border-[#002449]/30">
            CHAPTER 06 • PREDICTIVE RISK SIGNALS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002449] tracking-tight uppercase leading-tight font-sans">
            Warn Before <br />
            <span className="text-[#D89425]">The Loss Occurs.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
            Continuous trajectory monitoring flags emerging project bottlenecks and fiscal variances before funds are irrevocably disbursed.
          </p>
        </div>

        {/* 4 Risk Signal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.title}
                className="rounded-[6px] border border-[#E5E3DC] bg-white p-5 shadow-card flex flex-col justify-between hover:shadow-elevated transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono font-bold ${s.textColor}`}>
                      {s.status}
                    </span>
                    <Icon className={`h-4 w-4 ${s.textColor}`} />
                  </div>

                  <h3 className="text-sm font-bold text-[#002449] mb-1">
                    {s.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl font-extrabold font-mono ${s.textColor}`}>
                      {s.score}%
                    </span>
                    <span className="text-[10px] text-[#6B6B6B] font-mono">confidence index</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-[#E5E3DC] rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${s.barColor} rounded-full`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-[#6B6B6B] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E3DC] text-[10px] font-mono text-[#6B6B6B] flex items-center justify-between">
                  <span>Early Warning Signal</span>
                  <span className="text-[#002449] font-bold">● Active Watch</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
