import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { ProjectMosaic } from './ProjectMosaic';

export function HeroSection() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    projects: 0,
    outlay: 0,
    warnings: 0,
    states: 0,
  });

  const kpiRef = useRef<HTMLDivElement>(null);

  // Single-run animated counter on viewport entry
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCounts({ projects: 7842, outlay: 3812, warnings: 416, states: 28 });
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2200; // Slower, smooth institutional count-up
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            setCounts({
              projects: Math.floor(ease * 7842),
              outlay: Math.floor(ease * 3812),
              warnings: Math.floor(ease * 416),
              states: Math.floor(ease * 28),
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts({ projects: 7842, outlay: 3812, warnings: 416, states: 28 });
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (kpiRef.current) observer.observe(kpiRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const scrollToNext = () => {
    const nextSection = document.querySelector('#from-data-to-decision') || document.querySelector('#how-it-thinks');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-20 pb-8 lg:pt-24 lg:pb-10 bg-[#FAFAF9] border-b border-[#E5E3DC] overflow-hidden min-h-[75vh] flex flex-col justify-center">
      {/* Subtle, non-distracting technical grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#002449_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* 2-Column Desktop Grid: 50% Text Left + 50% Masonry Gallery Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Fixed Textual Hero (50% width / 6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-0.5 text-[11px] font-semibold text-[#002449] border border-[#E5E3DC] shadow-2xs">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#D99018]" />
              <span className="font-extrabold font-mono uppercase tracking-wider text-[#002449]">SANCHAY</span>
              <span className="text-[#98A2B3]">•</span>
              <span className="text-[11px] text-[#6B6B6B] font-medium tracking-wide">MPLADS INTELLIGENCE</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#002449] leading-[1.0] uppercase font-sans">
              See the risk <br />
              before it becomes <br />
              <span className="text-[#D99018]">
                an audit.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#0E0E0E] leading-relaxed max-w-lg font-normal">
              AI-powered monitoring for MPLADS works, fund utilization and project execution, helping authorities identify anomalies before they become audit findings.
            </p>

            {/* Human-in-the-loop Trust Statement */}
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#6B6B6B] pt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#15803D]" />
              <span>AI-ASSISTED • EVIDENCE-BACKED • HUMAN VERIFIED</span>
            </div>

            {/* Two Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/district">
                <Button
                  variant="default"
                  size="lg"
                  className="group bg-[#002449] hover:bg-[#001B36] text-white text-xs sm:text-sm font-bold flex items-center gap-2 px-6 h-11 shadow-elevated transition-colors rounded-full"
                >
                  <span>OPEN SANCHAY DASHBOARD</span>
                  <ArrowRight className="h-4 w-4 text-white/70 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>

              <a
                href="#how-it-thinks"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#how-it-thinks')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-[#F1F0EC] text-[#0E0E0E] border-[#E5E3DC] text-xs sm:text-sm font-semibold px-5 h-11 shadow-2xs transition-colors rounded-full"
                >
                  EXPLORE HOW IT WORKS
                </Button>
              </a>
            </div>

            {/* KPI Stat Row with Vertical Dividers */}
            <div
              ref={kpiRef}
              className="pt-5 border-t border-[#E5E3DC] grid grid-cols-2 sm:grid-cols-4 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E3DC]"
            >
              {/* Stat 1 */}
              <div className="pt-2 sm:pt-0">
                <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-[#002449]">
                  {counts.projects.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold text-[#0E0E0E] uppercase tracking-wider mt-0.5">
                  Projects Monitored
                </div>
                <div className="text-[10px] text-[#6B6B6B] font-mono">
                  Active nationwide
                </div>
              </div>

              {/* Stat 2 */}
              <div className="pt-2 sm:pt-0 sm:pl-3">
                <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-[#002449]">
                  ₹{counts.outlay.toLocaleString()} Cr
                </div>
                <div className="text-[10px] font-bold text-[#0E0E0E] uppercase tracking-wider mt-0.5">
                  Tracked Outlay
                </div>
                <div className="text-[10px] text-[#6B6B6B] font-mono">
                  Sanctioned value
                </div>
              </div>

              {/* Stat 3 (Emphasis) */}
              <div className="pt-2 sm:pt-0 sm:pl-3">
                <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-[#C94B4B]">
                  {counts.warnings.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold text-[#0E0E0E] uppercase tracking-wider mt-0.5">
                  Early Warnings
                </div>
                <div className="text-[10px] text-[#6B6B6B] font-mono">
                  Requiring review
                </div>
              </div>

              {/* Stat 4 */}
              <div className="pt-2 sm:pt-0 sm:pl-3">
                <div className="text-xl sm:text-2xl font-extrabold font-mono tracking-tight text-[#002449]">
                  {counts.states.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold text-[#0E0E0E] uppercase tracking-wider mt-0.5">
                  States & UTs
                </div>
                <div className="text-[10px] text-[#6B6B6B] font-mono">
                  National coverage
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Asymmetric Masonry Image Gallery (50% width / 6 cols) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ProjectMosaic />
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="mt-6 pt-2 flex justify-center">
          <button
            type="button"
            onClick={scrollToNext}
            className="group flex flex-col items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-[#6B6B6B] hover:text-[#002449] transition-colors"
          >
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown className="h-3 w-3 text-[#D99018] group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
