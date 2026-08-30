import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  badge
}) => {
  return (
    <div className="flex flex-col gap-2 pb-4 border-b border-[#F1F0EC] select-none">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
          {breadcrumbs.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-[#8C8C8C]" />}
              {item.path ? (
                <Link
                  to={item.path}
                  className="hover:text-[#0E0E0E] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#8C8C8C]">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0E0E0E]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        
        {badge && (
          <div className="flex items-center self-start sm:self-auto">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
};
