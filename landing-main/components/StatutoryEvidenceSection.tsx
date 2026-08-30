import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, CheckCircle2, ShieldCheck, ExternalLink, Download, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function StatutoryEvidenceSection() {
  return (
    <section id="evidence" className="py-24 bg-[#F7F5F0] border-b border-[#E5E3DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#002449] bg-[#002449]/10 px-3 py-1 rounded-full border border-[#002449]/30">
            Legal & Regulatory Traceability
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002449] tracking-tight uppercase">
            Every Alert Has Verifiable Evidence.
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
            Flags are cross-referenced against codified Government of India guidelines, General Financial Rules (GFR), and verified on-ground inspection records.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statutory Policy Citation */}
          <Card className="border-l-4 border-l-[#002449] flex flex-col justify-between">
            <CardHeader className="bg-[#FAFAF9]">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#002449]" />
                <CardTitle className="text-xs uppercase font-bold text-[#002449]">
                  Codified Policy Reference
                </CardTitle>
              </div>
              <CardDescription>Direct citation from official MoSPI guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded bg-[#FAFAF9] border border-[#F1F0EC] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002449]">MPLADS Revised Guidelines 2023</span>
                  <Badge variant="warning">Section 4.2</Badge>
                </div>
                <span className="text-[11px] font-mono text-[#002449] font-bold block">Page 37 • Schedule of Rates (SoR) Compliance</span>
                <blockquote className="border-l-2 border-[#002449] pl-3 py-1 text-[11px] italic text-[#6B6B6B] leading-relaxed">
                  "No item of work shall be approved with rates inflated beyond 10% of standard PWD baseline unless accompanied by a written geotechnical justification."
                </blockquote>
              </div>
              <Link to="/policies">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-[#002449] hover:underline flex items-center gap-1 p-0">
                  Open Complete Codified Clause <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Treasury & Payment Ledger Evidence */}
          <Card className="border-l-4 border-l-[#002449] flex flex-col justify-between">
            <CardHeader className="bg-[#FAFAF9]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#002449]" />
                <CardTitle className="text-xs uppercase font-bold text-[#002449]">
                  Treasury Voucher & Payment Log
                </CardTitle>
              </div>
              <CardDescription>Cryptographically verified disbursement trail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded bg-[#FAFAF9] border border-[#F1F0EC] space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Voucher No:</span>
                  <strong className="text-[#002449]">PUN/2026/V-991</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Installment #2:</span>
                  <strong className="text-[#002449]">₹17,85,000 (42.5%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Cumulative Released:</span>
                  <strong className="text-[#B44343]">92.5% of Sanction</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">GFR-12C UC Status:</span>
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
            <CardHeader className="bg-[#FAFAF9]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2F7658]" />
                <CardTitle className="text-xs uppercase font-bold text-[#002449]">
                  On-Ground Physical Inspection
                </CardTitle>
              </div>
              <CardDescription>Verified geotagged field telemetry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="p-3.5 rounded bg-[#FAFAF9] border border-[#F1F0EC] space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Field Inspection Date:</span>
                  <strong className="text-[#002449] font-mono">25 June 2026</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">GPS Coordinates:</span>
                  <strong className="text-[#002449] font-mono">18.5204° N, 73.8567° E</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Reported Execution:</span>
                  <strong className="text-[#B44343]">Plinth stage (31.0%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6B6B]">Super-structure / Roof:</span>
                  <strong className="text-[#B44343]">Zero construction</strong>
                </div>
              </div>
              <div className="text-[11px] text-[#6B6B6B]">
                Independent Quality Monitor (IQM) photographic dossier confirms disbursement ahead of physical progress.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
