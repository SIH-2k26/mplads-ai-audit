import React from 'react';
import { BookOpen, ExternalLink, ShieldAlert } from 'lucide-react';
import { ApplicableRule } from '../../types';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export function PolicyReferenceCard({
  rule,
  className,
}: {
  rule: ApplicableRule;
  className?: string;
}) {
  return (
    <div className={`rounded-[6px] border border-[#D9D5CC] bg-white p-4 shadow-card ${className || ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-[4px] bg-[#EDE8DE] text-[#18324A]">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#18324A]">{rule.documentTitle}</h4>
            <span className="text-[11px] font-mono text-[#C98219] font-semibold">
              {rule.section} • Page {rule.page}
            </span>
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-[2px] border ${
            rule.severity === 'CRITICAL'
              ? 'bg-red-50 text-[#B44343] border-[#B44343]/30'
              : 'bg-orange-50 text-[#C98219] border-[#C98219]/30'
          }`}
        >
          {rule.severity} RULE
        </span>
      </div>

      <p className="text-xs text-[#1D2939] font-medium mt-2.5 leading-relaxed">
        {rule.summary}
      </p>

      {rule.quote && (
        <blockquote className="mt-2.5 border-l-2 border-[#C98219] pl-3 py-1 text-[11px] italic text-[#667085] bg-[#F7F5F0] rounded-r">
          "{rule.quote}"
        </blockquote>
      )}

      <div className="mt-3 pt-2.5 border-t border-[#EDE8DE] flex items-center justify-between">
        <span className="text-[10px] text-[#667085] font-mono">
          Ref ID: {rule.ruleId}
        </span>
        <Link to={`/policies#${rule.ruleId}`}>
          <Button variant="ghost" size="sm" className="h-6 text-[11px] text-[#18324A] hover:underline flex items-center gap-1">
            Open Full Clause Text <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
