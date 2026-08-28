import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserCheck,
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  QrCode,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FieldVerificationBriefModal } from '../components/domain/FieldVerificationBriefModal';
import { toast } from 'sonner';

interface EarlyWarningAlert {
  id: string;
  projectId: string;
  projectName: string;
  district: string;
  state: string;
  riskScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'WATCHLIST' | 'RESOLVED';
  exposure: string;
  daysDelayed: number;
  archetype: string;
  triggers: string[];
  recommendedAction: string;
  assignedOfficer?: string;
  status: 'PENDING INQUIRY' | 'OFFICER ASSIGNED' | 'RESOLVED' | 'UNDER AUDIT';
}

export function AlertsPage() {
  const [activeTab, setActiveTab] = useState<'CRITICAL' | 'HIGH' | 'WATCHLIST' | 'RESOLVED'>('CRITICAL');
  const [searchTerm, setSearchTerm] = useState('');
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [selectedAlertForBrief, setSelectedAlertForBrief] = useState<any>(null);

  const alerts: EarlyWarningAlert[] = [
    {
      id: 'ALT-2026-0841',
      projectId: 'P-1023',
      projectName: 'Construction of Community Hall & Skill Centre Ward 17',
      district: 'Pune',
      state: 'Maharashtra',
      riskScore: 87,
      severity: 'CRITICAL',
      exposure: '₹42.00 Lakhs',
      daysDelayed: 114,
      archetype: 'COST INFLATION & DUPLICATE OVERLAP',
      triggers: [
        '+38.2% cost deviation above PWD Schedule of Rates benchmark',
        '63 days execution delay past statutory milestone deadline',
        '87% description & geographic similarity with MLALADS 2024 work (150m)',
        'Contractor concentration: holds 38.5% of total ward public works',
        'Missing mandatory GFR-12C Utilisation Certificate (UC-02 overdue)',
      ],
      recommendedAction: 'Verify structural estimate, inspect site for duplicate MLALADS claim, and withhold 2nd fund disbursement.',
      assignedOfficer: 'Shri R. K. Patil (District Auditor)',
      status: 'UNDER AUDIT',
    },
    {
      id: 'ALT-2026-0842',
      projectId: 'P-0871',
      projectName: 'Bituminous Village Link Road Connectivity KM 12/400',
      district: 'Pune (Haveli)',
      state: 'Maharashtra',
      riskScore: 82,
      severity: 'CRITICAL',
      exposure: '₹58.00 Lakhs',
      daysDelayed: 88,
      archetype: 'ROLLING DUPLICATE OVERLAP',
      triggers: [
        '88% geospatial polygon alignment with PMGSY Batch III completed in Nov 2023',
        'Single-bid tender award with compressed 8-day notice period',
        '+24.5% unit rate inflation on bitumen grade VG-30',
      ],
      recommendedAction: 'Execute GPS geofenced road inspection survey to verify new pavement vs pre-existing PMGSY carpet.',
      assignedOfficer: 'Smt. Ananya Deshmukh (Field Auditor)',
      status: 'OFFICER ASSIGNED',
    },
    {
      id: 'ALT-2026-0843',
      projectId: 'P-0912',
      projectName: 'Primary Health Diagnostic Solar Unit & Cold Chain',
      district: 'Pune (Baramati)',
      state: 'Maharashtra',
      riskScore: 74,
      severity: 'HIGH',
      exposure: '₹34.50 Lakhs',
      daysDelayed: 45,
      archetype: 'COST INFLATION',
      triggers: [
        '+42.0% cost deviation on 15kVA solar panels vs GeM direct purchase rate',
        'Unverified contractor GST status at time of work order issue',
      ],
      recommendedAction: 'Reconcile bill of quantities with GeM standard product rate cards and demand contractor explanation.',
      status: 'PENDING INQUIRY',
    },
    {
      id: 'ALT-2026-0844',
      projectId: 'P-0655',
      projectName: 'Zilla Parishad High School Science & STEM Wing',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      riskScore: 68,
      severity: 'HIGH',
      exposure: '₹48.00 Lakhs',
      daysDelayed: 32,
      archetype: 'YEAR-END RUSH',
      triggers: [
        'Sanction accorded on March 28 with zero physical milestone reporting for 120 days',
        'Fund parking detected in executing agency bank ledger',
      ],
      recommendedAction: 'Issue formal milestone submission notice to executing engineer.',
      status: 'PENDING INQUIRY',
    },
    {
      id: 'ALT-2026-0845',
      projectId: 'P-0412',
      projectName: 'Digital Smart Classroom STEM Complex',
      district: 'East Delhi',
      state: 'NCT of Delhi',
      riskScore: 48,
      severity: 'WATCHLIST',
      exposure: '₹24.50 Lakhs',
      daysDelayed: 14,
      archetype: 'TENDER CONCENTRATION',
      triggers: [
        'Sub-10L project splitting pattern suspected across adjoining school wards',
      ],
      recommendedAction: 'Monitor remaining installment releases for consolidated procurement compliance.',
      status: 'PENDING INQUIRY',
    },
  ];

  const filtered = alerts.filter((a) => {
    const matchesTab = a.severity === activeTab;
    const matchesSearch =
      a.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.district.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAssignOfficer = (alert: EarlyWarningAlert) => {
    toast.success(`Investigating Officer Assigned to ${alert.projectId}`, {
      description: `Dispatched to District Vigilance Officer queue with statutory SLA 14 days.`,
    });
  };

  const handleOpenBrief = (alert: EarlyWarningAlert) => {
    setSelectedAlertForBrief({
      id: alert.projectId,
      title: alert.projectName,
      location: `${alert.district} District · ${alert.state}`,
      outlay: alert.exposure,
      riskScore: alert.riskScore,
      agency: 'District Implementing Agency',
      contractor: 'Awarded Contractor Group',
      reasons: alert.triggers,
      benchmarkCost: '₹30.40 Lakhs (PWD SoR Baseline)',
      actualCost: alert.exposure,
    });
    setBriefModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <PageHeader
        title="Early Warning Center"
        subtitle="Signature operational cockpit identifying anomalies, cost outliers, and potential irregularities before payments are disbursed."
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: 'Early Warning Center' },
        ]}
      />

      {/* Top Warning Banner / Severity Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('CRITICAL')}
          className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
            activeTab === 'CRITICAL'
              ? 'bg-red-50/80 border-[#C94B4B] ring-2 ring-[#C94B4B]/30'
              : 'bg-white border-[#D9DFE3] hover:border-[#C94B4B]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#C94B4B] uppercase">CRITICAL ALERTS</span>
            <ShieldAlert className="h-4 w-4 text-[#C94B4B]" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#C94B4B] mt-1">7 Works</div>
          <span className="text-[11px] text-[#647383]">Require immediate payment freeze</span>
        </div>

        <div
          onClick={() => setActiveTab('HIGH')}
          className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
            activeTab === 'HIGH'
              ? 'bg-amber-50/80 border-[#C98220] ring-2 ring-[#C98220]/30'
              : 'bg-white border-[#D9DFE3] hover:border-[#C98220]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#C98220] uppercase">HIGH RISK</span>
            <AlertTriangle className="h-4 w-4 text-[#C98220]" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#C98220] mt-1">21 Works</div>
          <span className="text-[11px] text-[#647383]">Under active field review</span>
        </div>

        <div
          onClick={() => setActiveTab('WATCHLIST')}
          className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
            activeTab === 'WATCHLIST'
              ? 'bg-blue-50/80 border-[#15324A] ring-2 ring-[#15324A]/30'
              : 'bg-white border-[#D9DFE3] hover:border-[#15324A]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase">WATCHLIST</span>
            <Clock className="h-4 w-4 text-[#15324A]" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#15324A] mt-1">48 Works</div>
          <span className="text-[11px] text-[#647383]">Abnormal trajectory patterns</span>
        </div>

        <div
          onClick={() => setActiveTab('RESOLVED')}
          className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
            activeTab === 'RESOLVED'
              ? 'bg-emerald-50/80 border-[#2E8064] ring-2 ring-[#2E8064]/30'
              : 'bg-white border-[#D9DFE3] hover:border-[#2E8064]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#2E8064] uppercase">RESOLVED / VERIFIED</span>
            <CheckCircle2 className="h-4 w-4 text-[#2E8064]" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-[#2E8064] mt-1">142 Works</div>
          <span className="text-[11px] text-[#647383]">Closed with audit trail</span>
        </div>
      </div>

      {/* Main Alert Cards Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9DFE3] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
              {activeTab} Risk Queue ({filtered.length} Projects Flagged)
            </span>
          </div>

          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#647383]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search alert by Project ID, title, district..."
              className="pl-8 pr-3 py-1 rounded-[4px] border border-[#D9DFE3] bg-white text-xs text-[#172B3A] placeholder-[#647383] outline-none focus:border-[#15324A] w-64"
            />
          </div>
        </div>

        {/* Structured Alert Cards */}
        <div className="space-y-4">
          {filtered.map((alert) => (
            <div
              key={alert.id}
              className="rounded-[8px] border-2 border-[#15324A] bg-white p-5 shadow-elevated space-y-4 transition-all hover:shadow-2xl"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-[#D9DFE3] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-[#D99018] bg-[#D99018]/10 px-2 py-0.5 rounded border border-[#D99018]/30">
                      {alert.projectId}
                    </span>
                    <h3 className="text-sm font-bold text-[#15324A]">{alert.projectName}</h3>
                  </div>
                  <div className="text-xs text-[#647383] mt-1 font-mono">
                    {alert.district} District · {alert.state} • Outlay: <strong className="text-[#15324A]">{alert.exposure}</strong> • Delay: <strong className="text-[#C94B4B]">+{alert.daysDelayed} Days</strong>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                  <span className="text-[10px] font-mono text-[#647383] uppercase">AI RISK INDEX</span>
                  <div className="text-2xl font-mono font-extrabold text-[#C94B4B]">
                    {alert.riskScore}<span className="text-xs text-[#647383]">/100</span>
                  </div>
                </div>
              </div>

              {/* Detected Triggers */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#D99018]" />
                  <span>Identified Anomaly Triggers ({alert.archetype}):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {alert.triggers.map((trig, idx) => (
                    <div key={idx} className="p-2 rounded bg-red-50/70 border border-[#C94B4B]/30 flex items-start gap-1.5">
                      <span className="text-[#C94B4B] font-bold mt-0.5">•</span>
                      <span className="text-xs text-[#172B3A]">{trig}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-3 rounded bg-[#FAFAF7] border border-[#D9DFE3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#15324A] uppercase block">
                    RECOMMENDED ADMINISTRATIVE ACTION:
                  </span>
                  <p className="text-xs text-[#172B3A] font-medium mt-0.5">
                    {alert.recommendedAction}
                  </p>
                </div>

                {alert.assignedOfficer && (
                  <div className="text-right font-mono text-[10px] text-[#647383] flex-shrink-0">
                    <span>Officer in charge:</span>
                    <strong className="block text-[#15324A]">{alert.assignedOfficer}</strong>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#D9DFE3] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-[#647383]">
                  Alert Reference: {alert.id} • SHA-256 Verified
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignOfficer(alert)}
                    className="h-8 text-xs font-semibold border-[#D9DFE3] hover:border-[#15324A]"
                  >
                    <UserCheck className="h-3.5 w-3.5 mr-1 text-[#15324A]" />
                    Assign Officer
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenBrief(alert)}
                    className="h-8 text-xs font-semibold border-[#D9DFE3] hover:border-[#15324A]"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1 text-[#D99018]" />
                    Generate Inspection Brief
                  </Button>

                  <Link to={`/cases/CASE-2026-0182`}>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[#15324A] hover:bg-[#0F2638] text-white text-xs font-bold h-8 px-3.5 flex items-center gap-1.5 shadow-card"
                    >
                      <span>Open Investigation</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#E5B45A]" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Inspection Brief Modal Simulator */}
      <FieldVerificationBriefModal
        open={briefModalOpen}
        onOpenChange={setBriefModalOpen}
        project={selectedAlertForBrief}
      />
    </div>
  );
}
