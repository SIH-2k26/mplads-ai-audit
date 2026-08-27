import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ProjectAssessmentInput, RiskAssessmentResult } from '../types/riskAssessment';
import { SAMPLE_SCENARIOS } from '../data/riskScenarios';
import { ProjectIdentificationSection } from '../components/risk-assessment/ProjectIdentificationSection';
import { FinancialProfileSection } from '../components/risk-assessment/FinancialProfileSection';
import { ExecutionStatusSection } from '../components/risk-assessment/ExecutionStatusSection';
import { ProcurementSection } from '../components/risk-assessment/ProcurementSection';
import { ComplianceSection } from '../components/risk-assessment/ComplianceSection';
import { FieldInspectionSection } from '../components/risk-assessment/FieldInspectionSection';
import { LiveRiskPreview } from '../components/risk-assessment/LiveRiskPreview';
import { AnalysisPipelineAnimation } from '../components/risk-assessment/AnalysisPipelineAnimation';
import { AssessmentResultsView } from '../components/risk-assessment/AssessmentResultsView';
import { riskInferenceService } from '../services/risk/riskInferenceProvider';
import { toast } from 'sonner';

export function RiskAssessmentPage() {
  // Default to High Risk scenario for rich initial evaluation
  const [formData, setFormData] = useState<ProjectAssessmentInput>(SAMPLE_SCENARIOS[1].data);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('SCENARIO_B');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessmentResult | null>(null);

  const handleFieldChange = (field: keyof ProjectAssessmentInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setActiveScenarioId('CUSTOM');
  };

  const handleSelectScenario = (scenarioId: string) => {
    const found = SAMPLE_SCENARIOS.find((s) => s.id === scenarioId);
    if (found) {
      setFormData({ ...found.data });
      setActiveScenarioId(scenarioId);
      setAssessmentResult(null);
      toast.info(`Loaded ${found.name}`, {
        description: found.description,
      });
    }
  };

  const handleReset = () => {
    setFormData({ ...SAMPLE_SCENARIOS[0].data });
    setActiveScenarioId('SCENARIO_A');
    setAssessmentResult(null);
    toast.info('Form reset to clean baseline (Scenario A)');
  };

  const handleRunAssessment = async () => {
    if (!formData.projectId.trim() || !formData.projectName.trim()) {
      toast.error('Validation Error', {
        description: 'Please enter a valid Project ID and Project Title before proceeding.',
      });
      return;
    }

    setIsProcessing(true);
    setAssessmentResult(null);

    try {
      const result = await riskInferenceService.evaluateProject(formData);
      // Wait for pipeline animation step to trigger completion
      setPendingResult(result);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      toast.error('Inference Error', {
        description: 'Risk assessment could not be completed. Please check your inputs.',
      });
    }
  };

  const [pendingResult, setPendingResult] = useState<RiskAssessmentResult | null>(null);

  const handlePipelineComplete = () => {
    setIsProcessing(false);
    if (pendingResult) {
      setAssessmentResult(pendingResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="PROJECT RISK ASSESSMENT"
        subtitle="Enter project indicators to simulate how AGASTYA evaluates execution, procurement, and compliance risks"
        badge={
          <div className="flex items-center gap-1.5 rounded-[4px] bg-[#15324A] text-white px-2.5 py-1 text-xs font-mono font-bold shadow-subtle border border-[#0F2638]">
            <span className="h-2 w-2 rounded-full bg-[#E5B45A] animate-pulse" />
            <span>DEMO INFERENCE ENGINE</span>
          </div>
        }
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Intelligence Lab', path: '/intelligence' },
          { label: 'Project Risk Assessment' },
        ]}
      />

      {/* Prototype Inference Notice Banner */}
      <div className="rounded-[6px] border border-[#D9DFE3] bg-[#FAFAF7] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D99018] flex-shrink-0" />
          <span className="text-[#172B3A]">
            Current prototype uses <strong>transparent rule-based & statistical inference</strong>. A trained ML model can replace this layer via <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#D9DFE3]">RiskInferenceProvider</code> without changing the interface.
          </span>
        </div>
      </div>

      {/* SAMPLE SCENARIO SELECTOR (Hackathon Demo Acceleration) */}
      {!assessmentResult && !isProcessing && (
        <div className="rounded-[8px] border border-[#D9DFE3] bg-white p-4 shadow-subtle space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#15324A] uppercase tracking-wider block">
              Load Pre-Configured Benchmark Scenario:
            </span>
            <span className="text-[11px] text-[#647383]">
              Select a scenario to populate form indicators instantly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_SCENARIOS.map((sc) => {
              const isSelected = activeScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`p-3 rounded-[6px] border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#15324A] bg-[#15324A]/5 shadow-xs ring-1 ring-[#15324A]'
                      : 'border-[#D9DFE3] bg-[#FAFAF7] hover:border-[#15324A]/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#15324A]">{sc.name.split('—')[0]}</span>
                      <Badge variant={sc.badgeVariant as any} className="font-mono text-[9px]">
                        {sc.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#647383] leading-relaxed">
                      {sc.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[#D99018] font-bold mt-2 block">
                    {isSelected ? '● Active in Form' : 'Click to Load →'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PROCESSING STATE ANIMATION */}
      {isProcessing && (
        <AnalysisPipelineAnimation onComplete={handlePipelineComplete} />
      )}

      {/* RESULTS VIEW */}
      {!isProcessing && assessmentResult && (
        <AssessmentResultsView
          result={assessmentResult}
          onModify={() => setAssessmentResult(null)}
        />
      )}

      {/* TWO-COLUMN FORM & LIVE PREVIEW (When not showing results) */}
      {!isProcessing && !assessmentResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: 6-Section Form (~65% width) */}
          <div className="lg:col-span-2 space-y-6">
            <ProjectIdentificationSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <FinancialProfileSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <ExecutionStatusSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <ProcurementSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <ComplianceSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <FieldInspectionSection
              formData={formData}
              onChange={handleFieldChange}
            />
          </div>

          {/* Right Column: Sticky Live Risk Preview (~35% width) */}
          <div className="lg:col-span-1">
            <LiveRiskPreview
              formData={formData}
              onSubmit={handleRunAssessment}
              onReset={handleReset}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
}
