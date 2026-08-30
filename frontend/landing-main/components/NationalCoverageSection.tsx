import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe2, MapPin, ArrowRight, TrendingUp, ShieldAlert, Layers, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

export function NationalCoverageSection() {
  const statesData = [
    { state: 'Maharashtra', projects: '2,481 Works', value: '₹1,248 Cr', risk: '38 Flags', status: 'CRITICAL', color: 'text-red-700' },
    { state: 'Uttar Pradesh', projects: '1,840 Works', value: '₹892 Cr', risk: '54 Flags', status: 'CRITICAL', color: 'text-red-700' },
    { state: 'Karnataka', projects: '1,120 Works', value: '₹540 Cr', risk: '19 Flags', status: 'MONITORED', color: 'text-orange-700' },
    { state: 'NCT of Delhi', projects: '412 Works', value: '₹210 Cr', risk: '4 Flags', status: 'ON TRACK', color: 'text-emerald-700' },
    { state: 'Rajasthan', projects: '984 Works', value: '₹472 Cr', risk: '14 Flags', status: 'MONITORED', color: 'text-orange-700' },
    { state: 'Tamil Nadu', projects: '1,005 Works', value: '₹450 Cr', risk: '9 Flags', status: 'ON TRACK', color: 'text-emerald-700' },
  ];

  const regionsData = [
    { region: 'Western Region (MH, GJ, GA)', projects: '3,120 Works', value: '₹1,560 Cr', riskRate: '3.4% Flagged' },
    { region: 'Northern Region (UP, DL, RJ, HR, PB)', projects: '3,840 Works', value: '₹1,820 Cr', riskRate: '4.8% Flagged' },
    { region: 'Southern Region (KA, TN, AP, TS, KL)', projects: '2,890 Works', value: '₹1,340 Cr', riskRate: '2.1% Flagged' },
    { region: 'Eastern & North-Eastern Region', projects: '1,992 Works', value: '₹992 Cr', riskRate: '3.9% Flagged' },
  ];

  const riskData = [
    { category: 'Cost Deviation >20% above SoR', count: '142 Projects', impact: '₹184 Cr at risk', severity: 'HIGH' },
    { category: 'Disbursement Gap >30% vs Physical', count: '118 Projects', impact: '₹142 Cr at risk', severity: 'HIGH' },
    { category: 'Single-Bid Tender Concentration', count: '94 Projects', impact: '₹98 Cr at risk', severity: 'MEDIUM' },
    { category: 'Geospatial Duplicate Overlap', count: '62 Projects', impact: '₹64 Cr at risk', severity: 'MEDIUM' },
  ];

  const sectorsData = [
    { name: 'Rural Roads & Causeways', share: '38.4%', count: '3,011 Works', value: '₹1,460 Cr' },
    { name: 'Drinking Water & Sanitation', share: '24.2%', count: '1,897 Works', value: '₹922 Cr' },
    { name: 'Education & Smart Labs', share: '18.6%', count: '1,458 Works', value: '₹710 Cr' },
    { name: 'Public Health Sub-Centres', share: '11.8%', count: '925 Works', value: '₹450 Cr' },
    { name: 'Community Facilities & Halls', share: '7.0%', count: '551 Works', value: '₹270 Cr' },
  ];

  const [activeTab, setActiveTab] = useState('states');

  return (
    <section className="py-20 sm:py-28 bg-[#002449] text-white border-b border-[#001B36] relative overflow-hidden font-sans">
      {/* Subtle Grid Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Summary */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/80 bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block">
              CHAPTER 09 • ALL-INDIA JURISDICTION
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight font-sans">
              One National View. <br />
              <span className="text-[#D99018]">Thousands of Works.</span>
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed font-sans font-normal">
              SANCHAY monitors all 543 Lok Sabha and 245 Rajya Sabha parliamentary recommendations across India, establishing a unified audit ledger from national ministry oversight down to the village level.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-[16px] bg-white/5 border border-white/15 backdrop-blur-xs">
                <span className="text-[10px] font-mono text-white/60 uppercase block font-bold">Total Monitored Outlay</span>
                <strong className="text-xl font-mono font-extrabold text-white mt-0.5 block">₹3,812 Cr</strong>
              </div>
              <div className="p-3.5 rounded-[16px] bg-white/5 border border-white/15 backdrop-blur-xs">
                <span className="text-[10px] font-mono text-white/60 uppercase block font-bold">Active Infrastructure</span>
                <strong className="text-xl font-mono font-extrabold text-white mt-0.5 block">7,842 Works</strong>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/maps">
                <Button variant="default" size="sm" className="bg-white hover:bg-gray-100 text-[#002449] rounded-full text-xs font-bold flex items-center gap-1.5 h-11 px-6 shadow-md transition-colors">
                  <span>Open National Geographic Risk Maps</span>
                  <ArrowRight className="h-4 w-4 text-[#002449]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Tabs Container (Clean White Card in Navy Section) */}
          <div className="lg:col-span-7 rounded-[24px] border border-[#E5E3DC] bg-white text-[#0E0E0E] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE8E2] pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#002449]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#002449] font-sans">
                  National Portfolio Directory
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#6B6B6B] bg-[#F1F0EC] px-2.5 py-0.5 rounded-full border border-[#E5E3DC]">
                28 States • 8 UTs Active
              </span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-[#F1F0EC] p-1 rounded-full border border-[#E5E3DC]">
                <TabsTrigger value="states" className="text-xs font-semibold rounded-full data-[state=active]:bg-[#002449] data-[state=active]:text-white transition-all">States</TabsTrigger>
                <TabsTrigger value="regions" className="text-xs font-semibold rounded-full data-[state=active]:bg-[#002449] data-[state=active]:text-white transition-all">Regions</TabsTrigger>
                <TabsTrigger value="risks" className="text-xs font-semibold rounded-full data-[state=active]:bg-[#002449] data-[state=active]:text-white transition-all">Risk Patterns</TabsTrigger>
                <TabsTrigger value="sectors" className="text-xs font-semibold rounded-full data-[state=active]:bg-[#002449] data-[state=active]:text-white transition-all">Sectors</TabsTrigger>
              </TabsList>

              {/* Tab 1: States */}
              <TabsContent value="states" className="space-y-2 pt-3">
                {statesData.map((reg) => (
                  <div
                    key={reg.state}
                    className="p-3 rounded-[14px] bg-[#F1F0EC] border border-[#E5E3DC] flex items-center justify-between hover:border-[#002449] hover:bg-white transition-all shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-[#0E0E0E] block text-xs">
                        {reg.state}
                      </span>
                      <span className="text-[11px] text-[#6B6B6B] font-mono">
                        {reg.projects} • {reg.value}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${reg.color}`}>
                        {reg.risk}
                      </span>
                      <span className="text-[9px] text-[#6B6B6B] block font-mono">
                        Risk Signals
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 2: Regions */}
              <TabsContent value="regions" className="space-y-2 pt-3">
                {regionsData.map((r) => (
                  <div key={r.region} className="p-3 rounded-[14px] bg-[#F1F0EC] border border-[#E5E3DC] flex items-center justify-between hover:bg-white transition-all shadow-2xs">
                    <div>
                      <strong className="text-xs text-[#0E0E0E] block font-semibold">{r.region}</strong>
                      <span className="text-[11px] text-[#6B6B6B] font-mono">{r.projects} • {r.value}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#002449] bg-white px-2.5 py-1 rounded-full border border-[#E5E3DC]">
                      {r.riskRate}
                    </span>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 3: Risk Patterns */}
              <TabsContent value="risks" className="space-y-2 pt-3">
                {riskData.map((rk) => (
                  <div key={rk.category} className="p-3 rounded-[14px] bg-[#F1F0EC] border border-[#E5E3DC] flex items-center justify-between hover:bg-white transition-all shadow-2xs">
                    <div>
                      <strong className="text-xs text-[#0E0E0E] block font-semibold">{rk.category}</strong>
                      <span className="text-[11px] text-red-700 font-mono font-medium">{rk.count} ({rk.impact})</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      rk.severity === 'HIGH' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {rk.severity}
                    </span>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 4: Sectors */}
              <TabsContent value="sectors" className="space-y-2 pt-3">
                {sectorsData.map((sec) => (
                  <div key={sec.name} className="p-3 rounded-[14px] bg-[#F1F0EC] border border-[#E5E3DC] flex items-center justify-between hover:bg-white transition-all shadow-2xs">
                    <div>
                      <strong className="text-xs text-[#0E0E0E] block font-semibold">{sec.name}</strong>
                      <span className="text-[11px] text-[#6B6B6B] font-mono">{sec.count} ({sec.value})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#002449] bg-white px-2.5 py-1 rounded-full border border-[#E5E3DC]">
                      {sec.share} Share
                    </span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="pt-2 border-t border-[#EAE8E2] flex items-center justify-between text-[10px] text-[#6B6B6B] font-mono">
              <span>Synchronized with MoSPI National Central Server</span>
              <span className="text-[#15803D] font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] animate-pulse" />
                <span>Live Sync</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
