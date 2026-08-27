import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
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
            // Ease out quart for smooth, elegant deceleration
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
    const nextSection = document.querySelector('#intelligence-ticker') || document.querySelector('#how-it-thinks');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-24 pb-12 lg:pt-28 lg:pb-14 bg-[#FAFAF7] border-b border-[#D9DFE3] overflow-hidden min-h-[58vh]">
      {/* Subtle, non-distracting dotted grid texture: 24px spacing, ~0.08 opacity */}
      <div className="absolute inset-0 bg-[radial-gradient(#15324A_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Statement, CTAs & Animated KPI Strip (approx 55% width) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Small Eyebrow: 12-13px */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-0.8 text-[12px] font-semibold text-[#15324A] border border-[#D9DFE3] shadow-2xs">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#D99018]" />
              <span className="font-extrabold font-mono text-[11px] uppercase tracking-wider text-[#15324A]">AGASTYA</span>
              <span className="text-[#98A2B3]">•</span>
              <span className="text-[12px] text-[#647383] font-medium">MPLADS INTELLIGENCE</span>
            </div>

            {/* Editorial Headline: 56-68px desktop, tight line-height 0.96 */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight text-[#15324A] leading-[0.98] uppercase font-sans">
              See the risk <br />
              before it becomes <br />
              <span className="text-[#D99018]">
                an audit.
              </span>
            </h1>

            {/* Body Copy: 17-18px, calm & institutional */}
            <p className="text-base sm:text-[17px] text-[#172B3A] leading-relaxed max-w-xl font-normal">
              AI-powered monitoring for MPLADS works, fund utilization and project execution — helping authorities identify anomalies before they become audit findings.
            </p>

            {/* Human-in-the-loop Trust Statement */}
            <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#647383]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#2E8064]" />
              <span>AI-ASSISTED • EVIDENCE-BACKED • HUMAN VERIFIED</span>
            </div>

            {/* Action CTA Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link to="/district">
                <Button
                  variant="default"
                  size="lg"
                  className="group bg-[#15324A] hover:bg-[#0F2638] text-white text-xs sm:text-sm font-bold flex items-center gap-2 px-6 h-11 shadow-elevated transition-colors"
                >
                  <span>ENTER INTELLIGENCE PLATFORM</span>
                  <ArrowRight className="h-4 w-4 text-[#E5B45A] transition-transform duration-200 group-hover:translate-x-1" />
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
                  className="bg-white hover:bg-[#F3F5F4] text-[#15324A] border-[#15324A] text-xs sm:text-sm font-semibold px-5 h-11 shadow-2xs transition-colors"
                >
                  EXPLORE HOW IT WORKS
                </Button>
              </a>
            </div>

            {/* KPI Row with Subtle Vertical Dividers & Single-run Count-up */}
            <div
              ref={kpiRef}
              className="pt-6 border-t border-[#D9DFE3] grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D9DFE3]"
            >
              {/* Metric 1 */}
              <div className="pt-2 sm:pt-0">
                <div className="text-2xl sm:text-[26px] font-extrabold font-mono tracking-tight text-[#15324A]">
                  {counts.projects.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-[#172B3A] uppercase tracking-wider mt-0.5">
                  Projects Monitored
                </div>
                <div className="text-[10px] text-[#647383] font-mono">
                  Active nationwide
                </div>
              </div>

              {/* Metric 2 */}
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <div className="text-2xl sm:text-[26px] font-extrabold font-mono tracking-tight text-[#15324A]">
                  ₹{counts.outlay.toLocaleString()} Cr
                </div>
                <div className="text-[11px] font-bold text-[#172B3A] uppercase tracking-wider mt-0.5">
                  Tracked Outlay
                </div>
                <div className="text-[10px] text-[#647383] font-mono">
                  Sanctioned project value
                </div>
              </div>

              {/* Metric 3 */}
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <div className="text-2xl sm:text-[26px] font-extrabold font-mono tracking-tight text-[#C94B4B]">
                  {counts.warnings.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-[#172B3A] uppercase tracking-wider mt-0.5">
                  Early Warnings
                </div>
                <div className="text-[10px] text-[#647383] font-mono">
                  Projects requiring attention
                </div>
              </div>

              {/* Metric 4 */}
              <div className="pt-2 sm:pt-0 sm:pl-4">
                <div className="text-2xl sm:text-[26px] font-extrabold font-mono tracking-tight text-[#15324A]">
                  {counts.states.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-[#172B3A] uppercase tracking-wider mt-0.5">
                  States & UTs
                </div>
                <div className="text-[10px] text-[#647383] font-mono">
                  National coverage
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Project Image Mosaic (approx 45% width) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ProjectMosaic />
          </div>

        </div>

        {/* Scroll To Explore Indicator */}
        <div className="mt-8 pt-2 flex justify-center">
          <button
            type="button"
            onClick={scrollToNext}
            className="group flex flex-col items-center gap-1 text-[10px] font-mono font-bold tracking-widest text-[#647383] hover:text-[#15324A] transition-colors"
          >
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#D99018] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
