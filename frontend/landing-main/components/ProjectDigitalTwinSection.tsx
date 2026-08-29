import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Clock, Building2, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ProjectDigitalTwinSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F8F6] border-b border-[#DDE2E5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D89425] bg-[#D89425]/10 px-3 py-1 rounded-full border border-[#D89425]/30">
              CHAPTER 04 • DIGITAL TWIN ARCHITECTURE
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#16324A] tracking-tight uppercase leading-tight font-sans">
              Every Project. <br />
              <span className="text-[#D89425]">One Digital Twin.</span>
            </h2>

            <p className="text-sm text-[#66727D] leading-relaxed">
              Every sanctioned MPLADS asset is represented as an authoritative Digital Twin that tracks financial disbursements, physical milestone telemetry, contractor cartels, and statutory compliance in one unified operational cockpit.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#16202A]">
              {[
                'Geographic coordinates & GIS layer verification',
                'Schedule of Rates (SoR) cost benchmarking',
                'Dual-axis financial vs physical slope analysis',
                'Full 10-tab statutory evidence dossier & UC logs',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#287A5A] flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link to="/projects/P-1023">
                <Button variant="default" size="sm" className="bg-[#16324A] text-white text-xs font-bold flex items-center gap-1.5 h-10 px-4 shadow-elevated">
                  <span>Open Full Project Twin (P-1023)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#E5B45A]" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Stylized Real Digital Twin Monitoring Artifact */}
          <div className="lg:col-span-7">
            <div className="rounded-[8px] border-2 border-[#16324A] bg-white p-6 shadow-2xl space-y-4">
              
              {/* Header Badge */}
              <div className="flex items-start justify-between border-b border-[#DDE2E5] pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D89425] block">
                    PROJECT DIGITAL TWIN ARTIFACT
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#16324A]">
                    COMMUNITY HALL & SKILL CENTRE
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#66727D] mt-0.5 font-mono">
                    <MapPin className="h-3.5 w-3.5 text-[#D89425]" />
                    <span>Ward 17 • Pune District • Maharashtra</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#66727D] block">Risk Index</span>
                  <div className="text-2xl font-extrabold font-mono text-[#C74747]">
                    86<span className="text-xs text-[#66727D]">/100</span>
                  </div>
                </div>
              </div>

              {/* Core Outlay & Dual Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F7F8F6] p-3.5 rounded border border-[#DDE2E5] text-xs">
                <div>
                  <span className="text-[10px] text-[#66727D] uppercase tracking-wider block">Sanctioned Outlay</span>
                  <strong className="text-sm font-mono text-[#16324A]">₹42.0 Lakhs</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#66727D] uppercase tracking-wider block">Physical Execution</span>
                  <strong className="text-sm font-mono text-[#16324A]">82.0% Verified</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#66727D] uppercase tracking-wider block">Disbursed Funds</span>
                  <strong className="text-sm font-mono text-[#C74747]">91.0% (₹38.2L)</strong>
                </div>
              </div>

              {/* 3 Diagnostic Signals */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#16324A] uppercase tracking-wider block">
                  Diagnostic Signals Detected
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded bg-red-50/80 border border-[#C74747]/30 text-xs">
                    <span className="text-[10px] font-mono text-[#C74747] font-bold block">COST DEVIATION</span>
                    <strong className="text-xs text-[#16202A] block mt-0.5">+38.2% vs baseline</strong>
                    <span className="text-[10px] text-[#66727D]">PWD SoR ₹1,270/sq.ft</span>
                  </div>

                  <div className="p-2.5 rounded bg-amber-50/80 border border-[#C98220]/30 text-xs">
                    <span className="text-[10px] font-mono text-[#C98220] font-bold block">DELAYED MILESTONE</span>
                    <strong className="text-xs text-[#16202A] block mt-0.5">+14 Days Lag</strong>
                    <span className="text-[10px] text-[#66727D]">Roof slab milestone</span>
                  </div>

                  <div className="p-2.5 rounded bg-red-50/80 border border-[#C74747]/30 text-xs">
                    <span className="text-[10px] font-mono text-[#C74747] font-bold block">MISSING DOCUMENT</span>
                    <strong className="text-xs text-[#16202A] block mt-0.5">UC-02 Overdue</strong>
                    <span className="text-[10px] text-[#66727D]">GFR-12C Certificate</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#DDE2E5] flex items-center justify-between text-xs text-[#66727D]">
                <span className="font-mono text-[10px]">Implementing Agency: Pune Zilla Parishad</span>
                <span className="text-[10px] font-bold text-[#287A5A]">● Live Synchronized Ledger</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
