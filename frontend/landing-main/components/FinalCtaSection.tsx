import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Landmark, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useUiStore } from '../../src/stores/useUiStore';

export function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#002449] text-white relative overflow-hidden border-t border-white/20">
      {/* Engineering Dots Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-mono font-bold text-white border border-white/20">
          <Landmark className="h-3.5 w-3.5" />
          <span>SMART INDIA HACKATHON 2026 • PROBLEM STATEMENT PS-26102</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight font-sans">
          Building a More <br />
          <span className="text-[#D89425]">Accountable MPLADS.</span>
        </h2>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          From project recommendation to physical completion, SANCHAY helps authorities see risk earlier, understand evidence faster and act with confidence.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/district"
            state={{ fromLanding: true }}
            onClick={() => useUiStore.getState().startPlatformLoading('District Command Cockpit')}
          >
            <Button
              variant="default"
              size="lg"
              className="bg-white hover:bg-white/90 text-[#002449] rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 px-7 h-11 shadow-elevated"
            >
              <span>OPEN SANCHAY DASHBOARD</span>
              <ArrowRight className="h-4 w-4 text-[#002449]/70" />
            </Button>
          </Link>

          <Link to="/design-system">
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent hover:bg-white/10 text-white border-white/40 rounded-full text-xs sm:text-sm font-semibold px-6 h-11"
            >
              EXPLORE THE SYSTEM
            </Button>
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 pt-4 font-mono">
          Decoupled frontend simulation • Ministry of Statistics & Programme Implementation (MoSPI)
        </p>
      </div>
    </section>
  );
}
