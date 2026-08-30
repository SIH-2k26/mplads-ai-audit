import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, ShieldAlert, CheckCircle2, AlertTriangle, FileText, Clock, Building2, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ProjectDigitalTwinSection() {
  return (
    <section className="py-20 sm:py-28 bg-transparent border-b border-[#E5E3DC] font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-white px-3.5 py-1 rounded-full border border-[#E5E3DC] shadow-2xs inline-block">
              CHAPTER 04 • DIGITAL TWIN ARCHITECTURE
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002449] tracking-tight uppercase leading-tight font-sans">
              Every Project. <br />
              <span className="text-[#D99018]">One Digital Twin.</span>
            </h2>

            <p className="text-sm text-[#6B6B6B] leading-relaxed font-sans font-normal">
              Every sanctioned MPLADS asset is represented as an authoritative Digital Twin that tracks financial disbursements, physical milestone telemetry, contractor cartels, and statutory compliance in one unified operational cockpit.
            </p>

            <div className="space-y-2 pt-2 text-xs text-[#0E0E0E]">
              {[
                'Geographic coordinates & GIS layer verification',
                'Schedule of Rates (SoR) cost benchmarking',
                'Dual-axis financial vs physical slope analysis',
                'Full 10-tab statutory evidence dossier & UC logs',
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D] flex-shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link to="/projects/P-1023" state={{ fromLanding: true }}>
                <Button variant="default" size="sm" className="bg-[#002449] hover:bg-[#001B36] rounded-full text-white text-xs font-bold flex items-center gap-1.5 h-11 px-6 shadow-sm transition-colors cursor-pointer">
                  <span>Open Full Project Twin (P-1023)</span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/70" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Stylized Real Digital Twin Monitoring Artifact */}
          <div className="lg:col-span-7">
            <div className="rounded-[24px] border border-[#E5E3DC] bg-white p-6 sm:p-7 shadow-sm space-y-4">
              
              {/* Header Badge */}
              <div className="flex items-start justify-between border-b border-[#EAE8E2] pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#002449] block">
                    PROJECT DIGITAL TWIN ARTIFACT
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0E0E0E]">
                    COMMUNITY HALL & SKILL CENTRE
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mt-0.5 font-mono">
                    <MapPin className="h-3.5 w-3.5 text-[#002449]" />
                    <span>Ward 17 • Pune District • Maharashtra</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#6B6B6B] block">Risk Index</span>
                  <div className="text-2xl font-extrabold font-mono text-red-600">
                    86<span className="text-xs text-[#6B6B6B]">/100</span>
                  </div>
                </div>
              </div>

              {/* Core Outlay & Dual Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F1F0EC] p-4 rounded-[16px] border border-[#E5E3DC] text-xs">
                <div>
                  <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider block font-bold">Sanctioned Outlay</span>
                  <strong className="text-sm font-mono text-[#002449] mt-0.5 block">₹42.0 Lakhs</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider block font-bold">Physical Execution</span>
                  <strong className="text-sm font-mono text-[#002449] mt-0.5 block">82.0% Verified</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B6B6B] uppercase tracking-wider block font-bold">Disbursed Funds</span>
                  <strong className="text-sm font-mono text-red-600 mt-0.5 block">91.0% (₹38.2L)</strong>
                </div>
              </div>

              {/* 3 Diagnostic Signals */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#002449] uppercase tracking-wider block">
                  Diagnostic Signals Detected
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-xs">
                    <span className="text-[10px] font-mono text-red-700 font-bold block">COST DEVIATION</span>
                    <strong className="text-xs text-[#0E0E0E] block mt-0.5">+38.2% vs baseline</strong>
                    <span className="text-[10px] text-[#6B6B6B]">PWD SoR ₹1,270/sq.ft</span>
                  </div>

                  <div className="p-3 rounded-[14px] bg-amber-50 border border-amber-200 text-xs">
                    <span className="text-[10px] font-mono text-amber-800 font-bold block">DELAYED MILESTONE</span>
                    <strong className="text-xs text-[#0E0E0E] block mt-0.5">+14 Days Lag</strong>
                    <span className="text-[10px] text-[#6B6B6B]">Roof slab milestone</span>
                  </div>

                  <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-xs">
                    <span className="text-[10px] font-mono text-red-700 font-bold block">MISSING DOCUMENT</span>
                    <strong className="text-xs text-[#0E0E0E] block mt-0.5">UC-02 Overdue</strong>
                    <span className="text-[10px] text-[#6B6B6B]">GFR-12C Certificate</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#EAE8E2] flex items-center justify-between text-xs text-[#6B6B6B]">
                <span className="font-mono text-[10px]">Implementing Agency: Pune Zilla Parishad</span>
                <span className="text-[10px] font-bold text-[#15803D] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] animate-pulse" />
                  <span>Live Synchronized Ledger</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
