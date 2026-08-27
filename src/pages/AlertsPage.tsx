import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ActionQueue } from '../components/domain/ActionQueue';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { alertService } from '../services/alertService';
import { Alert, AlertSeverity } from '../types';
import { ShieldAlert, Clock, Filter, AlertTriangle } from 'lucide-react';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    alertService.getAlerts({ severity: severityFilter }).then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, [severityFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Risk Intelligence & Regulatory Alerts"
        subtitle="Prioritized diagnostic flags, SLA breach warnings, and procurement bypass notices"
        badge={<Badge variant="critical">{alerts.length} Active Alerts</Badge>}
      />

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[#D9D5CC] bg-white p-3 shadow-card">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#667085]" />
          <span className="text-xs font-semibold text-[#18324A]">Filter Severity:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`rounded-[3px] px-3 py-1 text-xs font-bold transition-all ${
                severityFilter === sev
                  ? 'bg-[#18324A] text-white shadow-subtle'
                  : 'bg-[#EDE8DE] text-[#18324A] hover:bg-[#e2dbcd]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Action Queue Component */}
      <ActionQueue alerts={alerts} />
    </div>
  );
}
