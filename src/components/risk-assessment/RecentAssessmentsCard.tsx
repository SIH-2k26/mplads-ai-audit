import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { assessmentService } from '../../services/risk/assessmentService';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function RecentAssessmentsCard() {
  const recentList = assessmentService.getRecentAssessments().slice(0, 3);

  return (
    <div className="rounded-[6px] border border-[#D9DFE3] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#D9DFE3] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-[4px] bg-[#15324A] text-white">
            <Sparkles className="h-4 w-4 text-[#E5B45A]" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-[#15324A] uppercase tracking-wider">
              Recent Manual Risk Assessments
            </h3>
            <p className="text-[11px] text-[#647383]">
              Proactive what-if assessments executed by District & State Authorities
            </p>
          </div>
        </div>

        <Link to="/risk-assessment">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold border-[#15324A] text-[#15324A] hover:bg-[#15324A] hover:text-white flex items-center gap-1"
          >
            <span>Assess Project Risk</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-[#D9DFE3]">
        {recentList.map((item) => (
          <div
            key={item.assessmentId}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#15324A]">{item.projectId}</span>
                <Badge
                  variant={
                    item.riskLevel === 'CRITICAL'
                      ? 'critical'
                      : item.riskLevel === 'HIGH'
                      ? 'saffron'
                      : 'success'
                  }
                  className="font-mono text-[9px]"
                >
                  {item.riskScore}/100 • {item.riskLevel}
                </Badge>
              </div>
              <div className="font-bold text-[#172B3A]">{item.projectName}</div>
              <p className="text-[11px] text-[#647383]">
                Top Driver: <strong className="text-[#15324A]">{item.topDriver}</strong>
              </p>
            </div>

            <div className="text-right flex-shrink-0 font-mono text-[10px] text-[#647383]">
              <div>{item.timestamp}</div>
              <div className="text-[#15324A] font-semibold">{item.district} District</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
