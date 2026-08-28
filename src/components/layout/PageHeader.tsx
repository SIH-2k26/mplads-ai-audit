import React from 'react';
import { Download, Filter, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Breadcrumbs } from './Breadcrumbs';

export function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  onRefresh,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  actions?: React.ReactNode;
  onRefresh?: () => void;
}) {
  return (
    <div className="mb-6 border-b border-[#D9D5CC] pb-5">
      <Breadcrumbs customCrumbs={breadcrumbs} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18324A]">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-[#667085] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Sync Ledger
            </Button>
          )}
          {actions || (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1.5"
                onClick={() => window.print()}
              >
                <Download className="h-3.5 w-3.5" />
                Export Audit PDF
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
