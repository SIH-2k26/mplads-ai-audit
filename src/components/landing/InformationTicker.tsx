import React from 'react';
import { Activity, ArrowRight } from 'lucide-react';

export function InformationTicker() {
  const alerts = [
    { state: 'Maharashtra', text: 'Cost deviation detected (+38.2% vs PWD SoR)' },
    { state: 'Uttar Pradesh', text: 'Delayed work flagged (+114 days lag)' },
    { state: 'Karnataka', text: 'Procurement anomaly (single-tender bid cluster)' },
    { state: 'Odisha', text: 'Field verification pending (UC-02 overdue)' },
    { state: 'Rajasthan', text: 'Expenditure velocity deviation detected' },
    { state: 'Tamil Nadu', text: 'Milestone SLA breach warning' },
    { state: 'NCT of Delhi', text: 'Single-bidder vendor concentration' },
    { state: 'Bihar', text: 'Geospatial proximity duplicate check required' },
  ];

  return (
    <div id="intelligence-ticker" className="w-full bg-[#102F45] text-white border-y border-[#15324B] py-2.5 overflow-hidden select-none">
      <div className="flex items-center">
        {/* Left Fixed Live Intelligence Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#0F2638] px-3.5 py-1 text-[10px] font-mono font-bold text-[#E5B45A] border-r border-[#214C68] flex-shrink-0 z-10">
          <span className="flex h-2 w-2 rounded-full bg-[#D99018] animate-pulse" />
          <span className="tracking-wider">LIVE INTELLIGENCE</span>
        </div>

        {/* Slow Scrolling Feed (35-45s full cycle) */}
        <div className="flex overflow-hidden whitespace-nowrap group">
          <div className="inline-flex animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {alerts.concat(alerts).map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center text-[11px] font-mono font-medium tracking-wide text-gray-200 mx-5"
              >
                <strong className="text-white font-bold">{item.state}</strong>
                <span className="text-gray-400 mx-1.5">·</span>
                <span className="text-gray-300">{item.text}</span>
                <ArrowRight className="h-3 w-3 text-[#D99018] ml-4 opacity-75 inline" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
