import React from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { InformationTicker } from './components/InformationTicker';
import { FromDataToDecisionSection } from './components/FromDataToDecisionSection';
import { PublicQuerySection } from './components/PublicQuerySection';
import { IntelligenceFlowSection } from './components/IntelligenceFlowSection';
import { ProjectDigitalTwinSection } from './components/ProjectDigitalTwinSection';
import { GovernanceRulesSection } from './components/GovernanceRulesSection';
import { EarlyWarningSection } from './components/EarlyWarningSection';
import { DocumentIntelligenceSection } from './components/DocumentIntelligenceSection';
import { InvestigationTimelineSection } from './components/InvestigationTimelineSection';
import { NationalCoverageSection } from './components/NationalCoverageSection';
import { ProjectDataTableSection } from './components/ProjectDataTableSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { LandingFooter } from './components/LandingFooter';
import { AskAiAssistant } from './components/domain/AskAiAssistant';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Toaster } from 'sonner';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#172B3A] font-sans antialiased selection:bg-[#D99018]/20 selection:text-[#15324A]">
      {/* Toast Notification Provider with Close (X) Button */}
      <Toaster position="top-right" richColors closeButton />

      {/* Sticky Streamlined Institutional Navbar */}
      <LandingNavbar />

      {/* CHAPTER 01: Hero with Editorial Statement & Living Infrastructure Mosaic */}
      <HeroSection />

      {/* CONTINUOUS LIVE INTELLIGENCE TICKER BAND */}
      <InformationTicker />

      {/* CHAPTER 02: Dark Navy Section — From Data to Decision */}
      <div id="from-data-to-decision">
        <FromDataToDecisionSection />
      </div>

      {/* CHAPTER 03: Public Query & Transparency Capsule Rail */}
      <div id="public-query">
        <PublicQuerySection />
      </div>

      {/* CHAPTER 04: How SANCHAY Thinks — 7-Stage Intelligence Pipeline */}
      <div id="how-it-thinks">
        <IntelligenceFlowSection />
      </div>

      {/* CHAPTER 04: Every Project. One Digital Twin. */}
      <div id="digital-twin">
        <ProjectDigitalTwinSection />
      </div>

      {/* CHAPTER 05: Rules Should Become Machine-Readable */}
      <div id="rules">
        <GovernanceRulesSection />
      </div>

      {/* CHAPTER 06: Warn Before The Loss Occurs */}
      <div id="early-warning">
        <EarlyWarningSection />
      </div>

      {/* CHAPTER 07: From PDF Documents to Structured Intelligence */}
      <DocumentIntelligenceSection />

      {/* CHAPTER 08: Investigate With Corroborated Evidence */}
      <InvestigationTimelineSection />

      {/* CHAPTER 09: One National View. Thousands of Works. */}
      <div id="national">
        <NationalCoverageSection />
      </div>

      {/* INTERACTIVE AUDIT DIRECTORY TABLE */}
      <div id="directory">
        <ProjectDataTableSection />
      </div>

      {/* CHAPTER 10: Final Institutional Call to Action */}
      <FinalCtaSection />

      {/* Institutional Footer */}
      <LandingFooter />

      {/* Persistent AI Query Modal & Scroll-to-top */}
      <AskAiAssistant />
      <ScrollToTop />
    </div>
  );
}
