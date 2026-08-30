import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#002449] text-gray-300 border-t border-[#002449] text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#002449] text-white border border-white/30">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-extrabold text-white text-base tracking-wider">SANCHAY</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              AI-Powered Risk Intelligence & Investigation Decision Support for MPLADS.
            </p>
            <span className="inline-block rounded bg-white/10 px-2 py-0.5 text-[9px] font-mono font-bold text-white border border-white/20">
              GOVERNMENT OF INDIA • MoSPI
            </span>
          </div>

          {/* Operational Cockpits */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Operational Cockpits
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <Link to="/mp" className="hover:text-white transition-colors">
                  Member of Parliament (MP) View
                </Link>
              </li>
              <li>
                <Link to="/district" className="hover:text-white transition-colors">
                  District Command Centre
                </Link>
              </li>
              <li>
                <Link to="/state" className="hover:text-white transition-colors">
                  State Nodal Authority (SNA)
                </Link>
              </li>
              <li>
                <Link to="/ministry" className="hover:text-white transition-colors">
                  Ministry / DIID National Centre
                </Link>
              </li>
              <li>
                <Link to="/projects/P-1023" className="hover:text-white transition-colors">
                  Project Digital Twin (P-1023)
                </Link>
              </li>
            </ul>
          </div>

          {/* Audits & Evidence */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Audits & Evidence
            </h4>
            <ul className="space-y-1.5 text-gray-400">
              <li>
                <Link to="/alerts" className="hover:text-white transition-colors">
                  Active Risk Alerts Feed
                </Link>
              </li>
              <li>
                <Link to="/cases" className="hover:text-white transition-colors">
                  Case Investigation Workspace
                </Link>
              </li>
              <li>
                <Link to="/policies" className="hover:text-white transition-colors">
                  Codified Guidelines Repository
                </Link>
              </li>
              <li>
                <Link to="/contractors" className="hover:text-white transition-colors">
                  Contractor Cartel Profiler
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-white transition-colors">
                  Official Audit PDF Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Institutional Governance
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Compliant with Government of India Guidelines for Websites (GIGW) and WCAG 2.1 AA accessibility standards.
            </p>
            <div className="pt-2 text-[10px] font-mono text-gray-400 border-t border-[#002449] space-y-1">
              <div>• Human Decisions Authoritative</div>
              <div>• Non-Overriding Advisory AI</div>
              <div>• Deterministic Audit Ledger</div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-[#002449] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div>
            © 2026 Government of India • Ministry of Statistics and Programme Implementation (MoSPI).
          </div>
          <div className="flex items-center gap-4 font-mono">
            <Link to="/design-system" className="hover:text-white">
              Design System
            </Link>
            <span>•</span>
            <a href="#how-it-thinks" className="hover:text-white">
              Architecture
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
