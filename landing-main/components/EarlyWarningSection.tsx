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
      barColor: 'bg-red-600',
      textColor: 'text-red-700',
      statusBadge: 'bg-red-100 text-red-700 border-red-200',
    },
    {
      title: 'Milestone Delay Risk',
      score: 64,
      status: 'MODERATE RISK',
      desc: 'Execution velocity suggests +45 day completion delay beyond statutory SLA.',
      icon: Clock,
      barColor: 'bg-orange-500',
      textColor: 'text-orange-700',
      statusBadge: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    {
      title: 'Duplicate Work Flag',
      score: 74,
      status: 'HIGH SIMILARITY',
      desc: '74% spatial and title overlap with state budget community hall work.',
      icon: Copy,
      barColor: 'bg-red-600',
      textColor: 'text-red-700',
      statusBadge: 'bg-red-100 text-red-700 border-red-200',
    },
    {
      title: 'Tender Concentration Risk',
      score: 52,
      status: 'WATCHLIST',
      desc: 'Contractor concentration approaching CVC single-vendor threshold in block.',
      icon: ShieldAlert,
      barColor: 'bg-orange-500',
      textColor: 'text-orange-700',
      statusBadge: 'bg-orange-100 text-orange-800 border-orange-200',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-transparent border-b border-[#E5E3DC] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-white px-3.5 py-1 rounded-full border border-[#E5E3DC] shadow-2xs inline-block">
            CHAPTER 06 • PREDICTIVE RISK SIGNALS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002449] tracking-tight uppercase leading-tight font-sans">
            Warn Before <br />
            <span className="text-[#D99018]">The Loss Occurs.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed font-sans font-normal">
            Continuous trajectory monitoring flags emerging project bottlenecks and fiscal variances before funds are irrevocably disbursed.
          </p>
        </div>

        {/* 4 Risk Signal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {signals.map((s) => {
            const Icon = s.icon;

            return (
              <div
                key={s.title}
                className="rounded-[20px] border border-[#E5E3DC] bg-white p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${s.statusBadge}`}>
                      {s.status}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#F1F0EC] flex items-center justify-center">
                      <Icon className={`h-3.5 w-3.5 ${s.textColor}`} />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#0E0E0E] mb-1 font-sans">
                    {s.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-2xl font-extrabold font-mono ${s.textColor}`}>
                      {s.score}%
                    </span>
                    <span className="text-[10px] text-[#6B6B6B] font-mono">confidence index</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-[#F1F0EC] rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${s.barColor} rounded-full`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE8E2] text-[10px] font-mono text-[#6B6B6B] flex items-center justify-between">
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
