import React from 'react';

export function PublicSectorsStrip() {
  const sectors = [
    { title: 'Rural Connectivity', sector: 'Bituminous Roads', tag: 'PWD Division', gradient: 'from-[#002449] to-[#002449]' },
    { title: 'Digital Classrooms', sector: 'STEM Innovation Labs', tag: 'Education Cell', gradient: 'from-[#002449] to-[#996212]' },
    { title: 'Drinking Water', sector: 'Solar RO Plants', tag: 'MJP Sanitation', gradient: 'from-[#2F7658] to-[#1e523d]' },
    { title: 'Primary Health', sector: 'Sub-centres', tag: 'Public Health', gradient: 'from-[#B7791F] to-[#7d5214]' },
    { title: 'Community Halls', sector: 'Multipurpose Assets', tag: 'Zilla Parishad', gradient: 'from-[#002449] to-[#2a4d6e]' },
    { title: 'Field Inspections', sector: 'Geo-tagged Audits', tag: 'District IQM', gradient: 'from-[#002449] to-[#002449]' },
  ];

  return (
    <section className="bg-[#F7F5F0] border-t border-[#E5E3DC] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 text-xs text-[#6B6B6B]">
          <span className="font-bold uppercase tracking-wider text-[#002449] text-[11px]">
            Continuous Monitoring Across Public Sectors
          </span>
          <span className="font-mono text-[10px] hidden sm:inline">Rural Roads • STEM Labs • Drinking Water • Public Health</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectors.map((card, i) => (
            <div
              key={i}
              className="group relative h-28 rounded-[4px] border border-[#E5E3DC] bg-white shadow-subtle p-3 flex flex-col justify-between overflow-hidden hover:shadow-elevated transition-all"
            >
              <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${card.gradient}`} />
              <div>
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#002449] block">
                  {card.tag}
                </span>
                <h4 className="text-[11px] font-bold text-[#002449] leading-snug mt-0.5 group-hover:text-[#002449] transition-colors">
                  {card.title}
                </h4>
                <p className="text-[9px] text-[#6B6B6B] mt-0.5">{card.sector}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
