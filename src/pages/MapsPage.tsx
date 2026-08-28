import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { InteractiveConstituencyExplorer } from '../components/InteractiveConstituencyExplorer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

export function MapsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="CONSTITUENCY VIGILANCE MAP"
        subtitle="Geographic distribution of composite trust scores and satellite ground deviations across Lok Sabha constituencies"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Vigilance Maps' },
        ]}
      />

      <InteractiveConstituencyExplorer
        onSelectState={(stateName) => {
          navigate('/projects');
        }}
      />
    </div>
  );
}
