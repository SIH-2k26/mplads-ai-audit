import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { COLOR_TOKENS, TYPOGRAPHY_SPECS } from '../data/mockData';

export function DesignSystemPage() {
  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="VIGILANCE DESIGN SYSTEM SPECIFICATION"
        subtitle="Visual design tokens, typography scales, contrast scores, and component rationale"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Design System' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colors Spec */}
        <Card>
          <CardHeader>
            <CardTitle>Color Token Palette Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {COLOR_TOKENS.map((token, idx) => (
              <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg border border-[#E5E3DC] shrink-0"
                  style={{ backgroundColor: token.hex }}
                />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0E0E0E]">{token.name}</span>
                    <span className="font-mono text-[#6B6B6B]">{token.hex}</span>
                  </div>
                  <p className="text-[11px] text-[#6B6B6B] mt-0.5">{token.usage}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Typography Spec */}
        <Card>
          <CardHeader>
            <CardTitle>Typography System Hierarchy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {TYPOGRAPHY_SPECS.map((spec, idx) => (
              <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] text-xs space-y-1">
                <div className="flex justify-between font-bold text-[#0E0E0E]">
                  <span>{spec.role}</span>
                </div>
                <div className="font-mono text-[#6B6B6B] text-[11px]">{spec.fontFamily} • {spec.weight}</div>
                <div className="p-2 bg-[#F1F0EC] rounded-lg mt-1 text-[#0E0E0E] font-medium border border-[#E5E3DC]">
                  {spec.sample}
                </div>
                <p className="text-[11px] text-[#6B6B6B] leading-relaxed pt-1">{spec.rationale}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
