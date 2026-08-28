import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { RiskMap } from '../components/domain/RiskMap';
import { Badge } from '../components/ui/badge';

export function MapsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Geographic Risk Intelligence & GIS Telemetry"
        subtitle="Multi-level geospatial risk map: India National → Maharashtra State → Pune District & Constituency Works"
        badge={<Badge variant="secondary">Interactive GIS View</Badge>}
      />

      <RiskMap level="NATIONAL" />
    </div>
  );
}
