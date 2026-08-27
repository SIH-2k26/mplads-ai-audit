import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function Breadcrumbs({ customCrumbs }: { customCrumbs?: Array<{ label: string; path?: string }> }) {
  const location = useLocation();

  const generateCrumbs = () => {
    if (customCrumbs) return customCrumbs;

    const segments = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', path: '/' }];

    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === 'mp') label = 'MP Dashboard';
      if (segment === 'district') label = 'District Command Centre';
      if (segment === 'state') label = 'State Nodal Authority';
      if (segment === 'ministry') label = 'Ministry Oversight';
      if (segment === 'design-system') label = 'Design System';
      crumbs.push({ label, path: currentPath });
    }

    return crumbs;
  };

  const crumbs = generateCrumbs();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#667085] mb-3">
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="h-3 w-3 text-[#98A2B3] flex-shrink-0" />}
            {isLast || !crumb.path ? (
              <span className="font-semibold text-[#18324A] truncate">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-[#18324A] hover:underline flex items-center gap-1"
              >
                {idx === 0 && <Home className="h-3 w-3" />}
                <span>{crumb.label}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
