import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe2, MapPin, ArrowRight, TrendingUp, ShieldAlert, Layers, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

export function NationalCoverageSection() {
  const statesData = [
    { state: 'Maharashtra', projects: '2,481 Works', value: '₹1,248 Cr', risk: '38 Flags', status: 'CRITICAL', color: 'text-[#C94B4B]' },
    { state: 'Uttar Pradesh', projects: '1,840 Works', value: '₹892 Cr', risk: '54 Flags', status: 'CRITICAL', color: 'text-[#C94B4B]' },
    { state: 'Karnataka', projects: '1,120 Works', value: '₹540 Cr', risk: '19 Flags', status: 'MONITORED', color: 'text-[#C98220]' },
    { state: 'NCT of Delhi', projects: '412 Works', value: '₹210 Cr', risk: '4 Flags', status: 'ON TRACK', color: 'text-[#2E8064]' },
    { state: 'Rajasthan', projects: '984 Works', value: '₹472 Cr', risk: '14 Flags', status: 'MONITORED', color: 'text-[#C98220]' },
    { state: 'Tamil Nadu', projects: '1,005 Works', value: '₹450 Cr', risk: '9 Flags', status: 'ON TRACK', color: 'text-[#2E8064]' },
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
    <section className="py-20 sm:py-28 bg-white border-b border-[#D9DFE3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Summary */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D99016] bg-[#D99016]/10 px-3 py-1 rounded-full border border-[#D99016]/30">
              CHAPTER 09 • ALL-INDIA JURISDICTION
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15324A] tracking-tight uppercase leading-tight font-sans">
              One National View. <br />
              <span className="text-[#D99016]">Thousands of Works.</span>
            </h2>

            <p className="text-sm text-[#647383] leading-relaxed">
              AGASTYA monitors all 543 Lok Sabha and 245 Rajya Sabha parliamentary recommendations across India, establishing a unified audit ledger from national ministry oversight down to the village level.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3]">
                <span className="text-[10px] font-mono text-[#647383] uppercase block">Total Monitored Outlay</span>
                <strong className="text-lg font-mono font-extrabold text-[#15324A]">₹3,812 Cr</strong>
              </div>
              <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3]">
                <span className="text-[10px] font-mono text-[#647383] uppercase block">Active Infrastructure</span>
                <strong className="text-lg font-mono font-extrabold text-[#15324A]">7,842 Works</strong>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/maps">
                <Button variant="default" size="sm" className="bg-[#15324A] text-white text-xs font-bold flex items-center gap-1.5 h-10 px-4 shadow-elevated">
                  <span>Open National Geographic Risk Maps</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#E5B45A]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Tabs Container */}
          <div className="lg:col-span-7 rounded-[8px] border-2 border-[#15324A] bg-[#FAFAF7] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#D99016]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#15324A]">
                  National Portfolio Directory
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#647383]">
                28 States • 8 UTs Active
              </span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-white border border-[#D9DFE3]">
                <TabsTrigger value="states" className="text-xs font-bold">States</TabsTrigger>
                <TabsTrigger value="regions" className="text-xs font-bold">Regions</TabsTrigger>
                <TabsTrigger value="risks" className="text-xs font-bold">Risk Patterns</TabsTrigger>
                <TabsTrigger value="sectors" className="text-xs font-bold">Sectors</TabsTrigger>
              </TabsList>

              {/* Tab 1: States */}
              <TabsContent value="states" className="space-y-2 pt-3">
                {statesData.map((reg) => (
                  <div
                    key={reg.state}
                    className="p-2.5 rounded bg-white border border-[#D9DFE3] flex items-center justify-between hover:border-[#15324A] transition-colors"
                  >
                    <div>
                      <span className="font-bold text-[#172B3A] block text-xs">
                        {reg.state}
                      </span>
                      <span className="text-[11px] text-[#647383] font-mono">
                        {reg.projects} • {reg.value}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${reg.color}`}>
                        {reg.risk}
                      </span>
                      <span className="text-[9px] text-[#647383] block font-mono">
                        Risk Signals
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 2: Regions */}
              <TabsContent value="regions" className="space-y-2 pt-3">
                {regionsData.map((r) => (
                  <div key={r.region} className="p-2.5 rounded bg-white border border-[#D9DFE3] flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-[#172B3A] block">{r.region}</strong>
                      <span className="text-[11px] text-[#647383] font-mono">{r.projects} • {r.value}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#15324A] bg-[#FAFAF7] px-2 py-1 rounded border border-[#D9DFE3]">
                      {r.riskRate}
                    </span>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 3: Risk Patterns */}
              <TabsContent value="risks" className="space-y-2 pt-3">
                {riskData.map((rk) => (
                  <div key={rk.category} className="p-2.5 rounded bg-white border border-[#D9DFE3] flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-[#172B3A] block">{rk.category}</strong>
                      <span className="text-[11px] text-[#C94B4B] font-mono">{rk.count} ({rk.impact})</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      rk.severity === 'HIGH' ? 'bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30' : 'bg-amber-50 text-[#C98220] border border-[#C98220]/30'
                    }`}>
                      {rk.severity}
                    </span>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 4: Sectors */}
              <TabsContent value="sectors" className="space-y-2 pt-3">
                {sectorsData.map((sec) => (
                  <div key={sec.name} className="p-2.5 rounded bg-white border border-[#D9DFE3] flex items-center justify-between">
                    <div>
                      <strong className="text-xs text-[#172B3A] block">{sec.name}</strong>
                      <span className="text-[11px] text-[#647383] font-mono">{sec.count} ({sec.value})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D99016]">
                      {sec.share} Share
                    </span>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            <div className="pt-2 border-t border-[#D9DFE3] flex items-center justify-between text-[10px] text-[#647383] font-mono">
              <span>Synchronized with MoSPI National Central Server</span>
              <span className="text-[#2E8064] font-bold">● Live Sync</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
