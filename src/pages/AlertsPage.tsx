import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { ShieldAlert, CheckCircle2, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert } from '../types';

const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-101',
    projectId: 'P-1023',
    projectCode: 'P-1023',
    projectTitle: 'Construction of Community Hall Ward 17',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'PROGRESS_MISMATCH',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    riskScore: 88,
    timestamp: '2025-02-23 10:30',
    deadline: '2025-03-05',
    whyFlagged: 'Financial progress of 92.5% is significantly ahead of 31% physical execution verified by Cartosat-3 SAR satellite radar.',
    evidenceCount: 2,
    applicableRuleId: 'R-42',
    applicableRuleTitle: 'MPLADS Revised Guidelines 2023 §4.2',
    assignedAuthority: 'District Magistrate & Collector, Pune',
    recommendedAction: 'Place provisional administrative hold on further payments and order field engineering physical verification.',
    slaDaysRemaining: 7
  },
  {
    id: 'ALT-102',
    projectId: 'P-0871',
    projectCode: 'P-0871',
    projectTitle: 'Haveli Link Road Drainage & Pavement Works',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'PROGRESS_MISMATCH',
    severity: 'HIGH',
    status: 'ACTIVE',
    riskScore: 68,
    timestamp: '2025-02-22 11:20',
    deadline: '2025-03-10',
    whyFlagged: 'Financial release of 87% vs physical progress of 51% on site.',
    evidenceCount: 1,
    applicableRuleId: 'R-212',
    applicableRuleTitle: 'General Financial Rules 2017 Rule 212',
    assignedAuthority: 'Superintending Engineer, PWD',
    recommendedAction: 'Reconcile Measurement Book records and verify contractor running bills.',
    slaDaysRemaining: 12
  },
  {
    id: 'ALT-103',
    projectId: 'P-1023',
    projectCode: 'P-1023',
    projectTitle: 'Construction of Community Hall Ward 17',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'CONTRACTOR_CONCENTRATION',
    severity: 'HIGH',
    status: 'ACTIVE',
    riskScore: 85,
    timestamp: '2025-02-21 14:15',
    deadline: '2025-03-07',
    whyFlagged: 'Entity network algorithm flagged common director PAN linkages between bidder and Apex Infraworks Pvt (cover bidding).',
    evidenceCount: 2,
    applicableRuleId: 'R-42',
    applicableRuleTitle: 'MPLADS Revised Guidelines 2023 §4.2',
    assignedAuthority: 'Director General, Ministry Command Nodal',
    recommendedAction: 'Issue Section 14 statutory show-cause subpoena to the bidding entities.',
    slaDaysRemaining: 9
  }
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  const handleUpdateStatus = (id: string, newStatus: Alert['status']) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="CRITICAL RISK ANOMALY FLAGS"
        subtitle="Real-time optical divergence, clustered contractor bidding, and SLA breaches"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Vigilance Alerts' },
        ]}
      />

      <div className="space-y-4">
        {alerts.map((alert) => {
          const getSeverityBadge = (sev: string) => {
            switch (sev) {
              case 'CRITICAL':
                return 'bg-red-100 text-red-700 border-red-200';
              case 'HIGH':
                return 'bg-orange-100 text-orange-800 border-orange-200';
              default:
                return 'bg-amber-100 text-amber-800 border-amber-200';
            }
          };

          return (
            <Card key={alert.id} className="p-5 select-none space-y-4">
              {/* Header Row */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAE8E2] flex items-center justify-center border border-[#E5E3DC]">
                    <ShieldAlert className="w-4 h-4 text-[#0E0E0E]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-[#6B6B6B]">{alert.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-bold bg-[#0E0E0E] text-white px-2 py-0.5 rounded-full">
                        {alert.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0E0E0E] mt-1">{alert.projectTitle}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono bg-[#F1F0EC] px-3 py-1.5 rounded-full border border-[#E5E3DC]">
                    Risk Score: {alert.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Why Flagged</span>
                  <p className="text-[#0E0E0E] leading-relaxed mt-0.5">{alert.whyFlagged}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">Rule Applicability</span>
                    <span className="text-[#0E0E0E] font-medium block mt-0.5">{alert.applicableRuleTitle}</span>
                  </div>
                  <div>
                    <span className="text-[#6B6B6B] block uppercase tracking-wider text-[9px] font-bold">SLA Deadline</span>
                    <span className="text-[#0E0E0E] font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-red-600" />
                      <span>{alert.deadline} ({alert.slaDaysRemaining} days remaining)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-[#EAE8E2] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {alert.status === 'ACTIVE' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                        className="bg-[#0E0E0E] hover:bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer transition-colors"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                        className="bg-[#9FE870] hover:bg-[#8ee05c] text-[#0E0E0E] text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer transition-colors"
                      >
                        Enforce Hold / Resolve
                      </button>
                    </>
                  )}
                  {alert.status !== 'ACTIVE' && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Action Logged Successfully</span>
                    </span>
                  )}
                </div>

                <Link to={`/projects/${alert.projectId}`}>
                  <button className="bg-white hover:bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC] text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer transition-colors flex items-center gap-1">
                    <span>Inspect Twin Cockpit</span>
                    <Play className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
