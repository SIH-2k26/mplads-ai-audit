import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, AlertTriangle, FileCheck, ShieldAlert } from 'lucide-react';
import { Progress } from '../components/ui/progress';

export function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Statutory Scheme Compliance & SLA Monitoring"
        subtitle="Mandatory GFR rules, Utilisation Certificate reconciliation, and SC/ST allocation tracking"
        badge={<Badge variant="default">Audit Protocol Active</Badge>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SC/ST Allocation Compliance */}
        <Card className="border-l-4 border-l-[#2F7658]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#667085]">Statutory Quota §2.3</span>
              <Badge variant="success">Compliant</Badge>
            </div>
            <CardTitle className="text-base mt-1">SC / ST Area Outlays</CardTitle>
            <CardDescription>Target: 15% SC / 7.5% ST allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>SC Population Area Works</span>
                <strong>16.4% (Target: 15%)</strong>
              </div>
              <Progress value={100} indicatorClassName="bg-[#2F7658]" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>ST Population Area Works</span>
                <strong>8.2% (Target: 7.5%)</strong>
              </div>
              <Progress value={100} indicatorClassName="bg-[#2F7658]" />
            </div>
          </CardContent>
        </Card>

        {/* UC Submission SLA */}
        <Card className="border-l-4 border-l-[#B44343]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#667085]">GFR 12-C Reconciliation</span>
              <Badge variant="critical">3 Overdue UCs</Badge>
            </div>
            <CardTitle className="text-base mt-1">Utilisation Certificates</CardTitle>
            <CardDescription>Mandatory within 90 days of release</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-red-50 text-[#B44343] font-medium">
              Overdue UCs totaling <strong>₹48.5 Lakhs</strong> pending from Pune ZP & Haveli block.
            </div>
            <p className="text-[#667085] text-[11px]">
              Next year administrative sanctions held until reconciliation is verified.
            </p>
          </CardContent>
        </Card>

        {/* Geotagging Compliance */}
        <Card className="border-l-4 border-l-[#C98219]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#667085]">Asset Tagging §3.8</span>
              <Badge variant="warning">94.2% Tagged</Badge>
            </div>
            <CardTitle className="text-base mt-1">GIS & Geotag Verification</CardTitle>
            <CardDescription>Pre, mid, and post-construction photos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-amber-50 text-[#B7791F] font-medium">
              7 completed assets pending barcode installation and GIS coordinate registration.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
