import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0E0E0E] flex flex-col justify-center items-center px-4 sm:px-6 select-none font-sans">
      <div className="absolute top-0 inset-0 bg-[radial-gradient(#E5E3DC_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="relative max-w-xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-[#F1F0EC] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#E5E3DC]">
          <div className="w-2 h-2 rounded-full bg-[#9FE870] animate-pulse" />
          <span>Statutory Audit Nodal Portal</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight lowercase">
            sentinel
          </h1>
          <p className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wider">
            MPLADS Forensic Auditing & Risk Intelligence
          </p>
        </div>

        <p className="text-sm text-[#6B6B6B] leading-relaxed">
          Continuous cross-reference of Public Financial Management System (PFMS) treasury drawdowns, ISRO Cartosat-3 SAR elevation models, and MCA-21 director registries for statutory compliance monitoring.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/district"
            className="bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] text-sm font-semibold px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <span>Enter Command Nodal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/design-system"
            className="bg-[#EAE8E2] hover:bg-[#E0DDD5] text-[#0E0E0E] text-sm font-medium px-6 py-2.5 rounded-full transition-colors flex items-center justify-center"
          >
            Design Spec
          </Link>
        </div>
      </div>
    </div>
  );
}
