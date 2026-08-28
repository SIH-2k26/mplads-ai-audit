import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Shield } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const PIPELINE_STAGES = [
  'Validating project inputs & statutory metadata',
  'Calculating financial indicators & utilization velocity',
  'Comparing execution progress & milestone timelines',
  'Evaluating procurement signals & tender variances',
  'Checking compliance indicators & duplication overlaps',
  'Synthesizing composite risk assessment & recommendations',
];

export function AnalysisPipelineAnimation({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PIPELINE_STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 200);
          return prev;
        }
      });
    }, 160);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[420px] p-8 rounded-[8px] border border-[#D9DFE3] bg-white shadow-card max-w-xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
      {/* Central Emblem & Pulse */}
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-[#15324A]/10 flex items-center justify-center animate-pulse">
          <Shield className="h-8 w-8 text-[#15324A]" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold font-mono text-[#15324A] uppercase tracking-wider">
          Executing Analytical Pipeline
        </h3>
        <p className="text-xs text-[#647383]">
          Grounded evaluation across financial, execution, procurement, and compliance dimensions
        </p>
      </div>

      {/* Sequential Pipeline Stages */}
      <div className="w-full space-y-2.5 bg-[#FAFAF7] p-4 rounded-[6px] border border-[#D9DFE3]">
        {PIPELINE_STAGES.map((stage, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-opacity duration-150 ${
                isDone || isCurrent ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-[#2E8064] flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 text-[#D99018] animate-spin flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-gray-300 flex-shrink-0" />
              )}
              <span
                className={`font-mono text-xs ${
                  isCurrent ? 'font-bold text-[#15324A]' : isDone ? 'text-[#172B3A]' : 'text-[#647383]'
                }`}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
