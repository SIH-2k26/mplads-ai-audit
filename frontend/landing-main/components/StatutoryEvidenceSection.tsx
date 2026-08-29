import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, CheckCircle2, ShieldCheck, ExternalLink, Download, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function StatutoryEvidenceSection() {
  return (
    <section id="evidence" className="py-24 bg-[#F7F5F0] border-b border-[#D9D5CC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C98219] bg-[#C98219]/10 px-3 py-1 rounded-full border border-[#C98219]/30">
            Legal & Regulatory Traceability
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18324A] tracking-tight uppercase">
            Every Alert Has Verifiable Evidence.
          </h2>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
            Flags are cross-referenced against codified Government of India guidelines, General Financial Rules (GFR), and verified on-ground inspection records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statutory Policy Citation */}
          <Card className="border-l-4 border-l-[#18324A] flex flex-col justify-between">
            <CardHeader className="bg-[#FAFAF7]">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#18324A]" />
                <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
                  Codified Policy Reference
                </CardTitle>
              </div>
              <CardDescription>Direct citation from official MoSPI guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded bg-[#FAFAF7] border border-[#EDE8DE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#18324A]">MPLADS Revised Guidelines 2023</span>
                  <Badge variant="warning">Section 4.2</Badge>
                </div>
                <span className="text-[11px] font-mono text-[#C98219] font-bold block">Page 37 • Schedule of Rates (SoR) Compliance</span>
                <blockquote className="border-l-2 border-[#C98219] pl-3 py-1 text-[11px] italic text-[#667085] leading-relaxed">
                  "No item of work shall be approved with rates inflated beyond 10% of standard PWD baseline unless accompanied by a written geotechnical justification."
                </blockquote>
              </div>
              <Link to="/policies#POL-001">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-[#18324A] hover:underline flex items-center gap-1 p-0">
                  Open Complete Codified Clause <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Treasury & Payment Ledger Evidence */}
          <Card className="border-l-4 border-l-[#C98219] flex flex-col justify-between">
            <CardHeader className="bg-[#FAFAF7]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#C98219]" />
                <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
                  Treasury Voucher & Payment Log
                </CardTitle>
              </div>
              <CardDescription>Cryptographically verified disbursement trail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded bg-[#FAFAF7] border border-[#EDE8DE] space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Voucher No:</span>
                  <strong className="text-[#18324A]">PUN/2026/V-991</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Installment #2:</span>
                  <strong className="text-[#18324A]">₹17,85,000 (42.5%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Cumulative Released:</span>
                  <strong className="text-[#B44343]">92.5% of Sanction</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">GFR-12C UC Status:</span>
                  <strong className="text-[#B44343]">NOT FURNISHED</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#2F7658] text-[11px] font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Digitally signed SHA-256 ledger integrity</span>
              </div>
            </CardContent>
          </Card>

          {/* On-ground Geo-tagged Photo Inspection */}
          <Card className="border-l-4 border-l-[#2F7658] flex flex-col justify-between">
            <CardHeader className="bg-[#FAFAF7]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2F7658]" />
                <CardTitle className="text-xs uppercase font-bold text-[#18324A]">
                  On-Ground Physical Inspection
                </CardTitle>
              </div>
              <CardDescription>Verified geotagged field telemetry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded bg-[#FAFAF7] border border-[#EDE8DE] space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#667085]">Field Inspection Date:</span>
                  <strong className="text-[#18324A] font-mono">25 June 2026</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">GPS Coordinates:</span>
                  <strong className="text-[#18324A] font-mono">18.5204° N, 73.8567° E</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Reported Execution:</span>
                  <strong className="text-[#B44343]">Plinth stage (31.0%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667085]">Super-structure / Roof:</span>
                  <strong className="text-[#B44343]">Zero construction</strong>
                </div>
              </div>
              <div className="text-[11px] text-[#667085]">
                Independent Quality Monitor (IQM) photographic dossier confirms disbursement ahead of physical progress.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
