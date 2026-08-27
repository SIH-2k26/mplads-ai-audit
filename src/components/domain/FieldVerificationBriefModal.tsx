import React, { useState } from 'react';
import { ShieldAlert, Printer, CheckCircle2, Camera, MapPin, QrCode, AlertTriangle, FileText, X, UploadCloud, Smartphone } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface FieldBriefProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: {
    id: string;
    title: string;
    location: string;
    outlay: string;
    riskScore: number;
    agency: string;
    contractor: string;
    reasons: string[];
    benchmarkCost: string;
    actualCost: string;
  };
}

export function FieldVerificationBriefModal({ open, onOpenChange, project }: FieldBriefProps) {
  const [activeMode, setActiveMode] = useState<'brief' | 'mobileSimulator'>('brief');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [geofencePassed, setGeofencePassed] = useState(true);
  const [observation, setObservation] = useState('');

  const proj = project || {
    id: 'P-1023',
    title: 'Community Hall & Skill Centre Ward 17',
    location: 'Hadapsar, Pune District · Maharashtra (18.4982° N, 73.9281° E)',
    outlay: '₹42.00 Lakhs',
    riskScore: 86,
    agency: 'Pune Zilla Parishad (Rural Works Div)',
    contractor: 'M/s Sahyadri Buildtech Infrastructure',
    reasons: [
      '+38.2% cost deviation above PWD Schedule of Rates',
      '+114 days milestone execution delay beyond SLA',
      'Potential duplicate overlap with MLALADS 2024 Samaj Mandir work within 150m',
      'Overdue Utilization Certificate (UC-02 GFR-12C)',
    ],
    benchmarkCost: '₹30.40 Lakhs (PWD SoR Rate: ₹1,270/sq.ft)',
    actualCost: '₹42.00 Lakhs (Rate: ₹1,755/sq.ft)',
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitMobileVerification = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Field Verification Submitted for ${proj.id}`, {
      description: 'Geotagged EXIF metadata, GPS coordinates, and inspection notes appended to immutable ledger.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-4xl p-0 overflow-hidden"
    >
      {/* Modal Top Header */}
      <div className="bg-[#15324A] text-white p-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-[#D99018] text-[#15324A] flex items-center justify-center font-bold">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase">
              Field Verification & Inspection Brief
            </h3>
            <span className="text-[10px] text-gray-300 font-mono">
              Ref: {proj.id} • Authorized Officer Docket
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded bg-[#0F2638] p-0.5 border border-[#234D6C]">
            <button
              type="button"
              onClick={() => setActiveMode('brief')}
              className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors ${
                activeMode === 'brief' ? 'bg-[#15324A] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Printable Brief
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('mobileSimulator')}
              className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors flex items-center gap-1 ${
                activeMode === 'mobileSimulator' ? 'bg-[#15324A] text-[#E5B45A]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="h-3 w-3" /> Field App Demo
            </button>
          </div>

          {activeMode === 'brief' && (
            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="bg-[#D99018] hover:bg-[#C98220] text-[#15324A] text-xs font-bold h-8 flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print 1-Page Brief</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mode 1: Official Printable 1-Page Brief */}
      {activeMode === 'brief' ? (
        <div className="p-6 bg-white space-y-5 text-[#172B3A] max-h-[80vh] overflow-y-auto print:p-0 print:max-h-none">
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-[#15324A] pb-3">
            <div className="text-[11px] font-bold font-mono tracking-widest text-[#15324A] uppercase">
              GOVERNMENT OF MAHARASHTRA • DISTRICT COLLECTORATE PUNE
            </div>
            <h2 className="text-base font-extrabold text-[#15324A] uppercase mt-0.5">
              MPLADS ON-SITE PHYSICAL VERIFICATION BRIEF & CHECKLIST
            </h2>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#647383] mt-2 pt-1 border-t border-[#D9DFE3]">
              <span>Docket ID: INSP-{proj.id}-2026</span>
              <span>Date Generated: 27 August 2026</span>
              <span className="font-bold text-[#C94B4B]">RISK INDEX: {proj.riskScore} / 100 (HIGH RISK)</span>
            </div>
          </div>

          {/* Section 1: Project Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF7] p-3.5 rounded border border-[#D9DFE3]">
            <div>
              <span className="text-[10px] font-mono text-[#647383] uppercase block">Work Title & ID</span>
              <strong className="text-xs text-[#15324A] block">{proj.title} ({proj.id})</strong>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#647383] uppercase block">Sanctioned Outlay</span>
              <strong className="text-xs text-[#15324A] block">{proj.outlay}</strong>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#647383] uppercase block">Geographic Location / Coordinates</span>
              <span className="text-xs text-[#172B3A] block">{proj.location}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#647383] uppercase block">Executing Agency & Contractor</span>
              <span className="text-xs text-[#172B3A] block">{proj.agency} | {proj.contractor}</span>
            </div>
          </div>

          {/* Section 2: Identified Risk Triggers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono uppercase text-[#15324A] flex items-center gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 text-[#C94B4B]" />
              <span>1. Specific Risk Triggers Identified by AI Anomaly Engine</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {proj.reasons.map((r, idx) => (
                <div key={idx} className="p-2 rounded bg-red-50/70 border border-[#C94B4B]/30 flex items-start gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#C94B4B] mt-0.5">#{idx + 1}</span>
                  <span className="text-xs text-[#172B3A] leading-snug">{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Cost Benchmark & Duplicate Comparison */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAFAF7] p-3 rounded border border-[#D9DFE3]">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">Cost Benchmark Evidence</span>
              <div className="text-xs text-[#647383] mt-1 space-y-0.5">
                <div>• Sanctioned Unit Rate: <strong className="text-[#C94B4B]">{proj.actualCost}</strong></div>
                <div>• PWD District Benchmark: <strong className="text-[#2E8064]">{proj.benchmarkCost}</strong></div>
                <div>• Variance: <strong className="text-[#C94B4B]">+38.2% Above Schedule of Rates</strong></div>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">Cross-Scheme Proximity Check</span>
              <div className="text-xs text-[#647383] mt-1 space-y-0.5">
                <div>• Co-located Scheme: <strong className="text-[#15324A]">MLALADS-2024-114 (Samaj Mandir)</strong></div>
                <div>• Distance Offset: <strong className="text-[#C94B4B]">150 meters</strong></div>
                <div>• Suspected Overlap: <strong className="text-[#C94B4B]">Dual Claim for same RCC Structure</strong></div>
              </div>
            </div>
          </div>

          {/* Section 4: Officer Physical Inspection Checklist */}
          <div className="space-y-2 border-t border-[#D9DFE3] pt-3">
            <h4 className="text-xs font-bold font-mono uppercase text-[#15324A]">
              2. Mandatory On-Site Verification Checklist
            </h4>
            <div className="space-y-1.5 text-xs text-[#172B3A]">
              {[
                'Verify foundation slab dimensions against sanctioned Architectural Drawing #PUN-1023-A.',
                'Confirm asset does not physically duplicate Samaj Mandir building sanctioned under MLALADS in 2024.',
                'Inspect quality of RCC column casting and verify steel reinforcement grade test certificates.',
                'Capture 4 GPS-geotagged photographs (North, South, Foundation detail, and MPLADS Scheme Display Board).',
                'Verify on-site Measurement Book (MB) entries matching contractor 2nd running bill voucher.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="h-3.5 w-3.5 border border-[#15324A] rounded-xs mt-0.5 flex-shrink-0" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Official Sign-off Box */}
          <div className="pt-4 border-t-2 border-[#15324A] grid grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#647383] block">Inspecting Officer Name & Designation:</span>
              <div className="h-8 border-b border-dashed border-[#647383] mt-2" />
            </div>
            <div>
              <span className="text-[10px] text-[#647383] block">Date of Field Inspection & GPS Lock:</span>
              <div className="h-8 border-b border-dashed border-[#647383] mt-2" />
            </div>
            <div>
              <span className="text-[10px] text-[#647383] block">Official Seal & Signature:</span>
              <div className="h-8 border-b border-dashed border-[#647383] mt-2" />
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Field Officer Mobile App Simulation */
        <div className="p-6 bg-[#F3F5F4] flex justify-center">
          <div className="w-full max-w-sm bg-white rounded-[16px] border-4 border-[#15324A] shadow-2xl overflow-hidden">
            {/* Mobile Top Bar */}
            <div className="bg-[#15324A] text-white p-3 text-center">
              <span className="text-[10px] font-mono text-[#E5B45A] font-bold block">AGASTYA FIELD OFFICER APP</span>
              <h4 className="text-xs font-bold">PROJECT VERIFICATION #1023</h4>
            </div>

            {/* Mobile Form */}
            <form onSubmit={handleSubmitMobileVerification} className="p-4 space-y-3.5 text-xs">
              {/* Geofence Status */}
              <div className="p-2.5 rounded bg-emerald-50 border border-[#2E8064]/30 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-[#2E8064] font-bold">
                  <MapPin className="h-4 w-4" />
                  <span>GPS Geofence Verified</span>
                </div>
                <span className="font-mono text-[10px] text-[#647383]">Accuracy ±3m</span>
              </div>

              {/* Work Details */}
              <div>
                <span className="text-[10px] font-mono text-[#647383] block">Sanctioned Work:</span>
                <strong className="text-xs text-[#172B3A]">{proj.title}</strong>
              </div>

              {/* Photo Upload Simulation */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-[#15324A] font-bold block">
                  Mandatory Geotagged Photographs (EXIF Verified):
                </span>
                
                <div
                  onClick={() => {
                    setPhotoUploaded(true);
                    toast.info('Simulated: 4 Geotagged HDR Photos Uploaded with EXIF GPS lock.');
                  }}
                  className={`p-4 border-2 border-dashed rounded-[6px] text-center cursor-pointer transition-colors ${
                    photoUploaded ? 'border-[#2E8064] bg-emerald-50/50' : 'border-[#D9DFE3] hover:border-[#15324A] bg-[#FAFAF7]'
                  }`}
                >
                  <Camera className={`h-6 w-6 mx-auto mb-1 ${photoUploaded ? 'text-[#2E8064]' : 'text-[#647383]'}`} />
                  <span className="text-[11px] font-bold block">
                    {photoUploaded ? '4 Geotagged Photos Attached ✓' : 'Tap to Capture Site Photos'}
                  </span>
                  <span className="text-[9px] text-[#647383] font-mono">
                    {photoUploaded ? 'EXIF: 18.4982° N, 73.9281° E • 27-Aug-2026' : 'Automatic GPS & Timestamp Embed'}
                  </span>
                </div>
              </div>

              {/* Observation Text */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#15324A] block">
                  Field Observations / Anomaly Assessment:
                </span>
                <textarea
                  rows={3}
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="e.g. Structure slab casting is 82% complete. Verified no overlap with municipal building. Cost variance due to additional retaining wall required on slope..."
                  className="w-full p-2 rounded border border-[#D9DFE3] text-xs text-[#172B3A] outline-none focus:border-[#15324A]"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                className="w-full bg-[#15324A] hover:bg-[#0F2638] text-white text-xs font-bold h-9"
              >
                Submit Signed Field Inspection
              </Button>
            </form>
          </div>
        </div>
      )}
    </Dialog>
  );
}
