import React, { useState, useEffect } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertCircle, CheckCircle2, RotateCcw, Play, Sparkles, Activity, ShieldCheck, HelpCircle } from 'lucide-react';
import { ProjectAssessmentInput, RiskAssessmentResult } from '../types/riskAssessment';
import { mockRiskInferenceProvider } from '../services/risk/mockRiskInferenceProvider';
import { assessmentService } from '../services/risk/assessmentService';
import { analyzeProject } from '../services/api';
import { toBackendProjectInput, fromBackendAnalysisResponse } from '../services/backendTransforms';
import { formatCurrencyINR } from '../lib/utils';
import { toast } from 'sonner';

export const SAMPLE_SCENARIOS = [
  {
    id: 'SCENARIO_A',
    name: 'Scenario A: Balanced Baseline (Low Risk)',
    data: {
      projectId: 'MPLADS-LOW-001',
      projectName: 'Paved Link Road connecting 4 Habitations',
      category: 'Roads',
      district: 'Pune',
      state: 'Maharashtra',
      amountReleased: 25000000,
      amountUtilized: 18000000,
      physicalProgress: 75,
      financialProgress: 72,
      paymentCount: 3,
      estimatedTenderAmount: 24000000,
      selectedBidAmount: 24500000,
      estimatedProjectCost: 25000000,
      sanctionedAmount: 25000000,
      actualDurationDays: 120,
      plannedDurationDays: 120,
      currentStatus: 'On Schedule',
      eligibleBidderCount: 4,
      contractorConcentrationPercentage: 15,
      tenderType: 'Open',
      technicalSanctionAvailable: true,
      administrativeApprovalAvailable: true,
      documentationComplete: true,
      geoLocationVerified: true,
      duplicateWorkSuspected: false,
      nearbySimilarWork: false,
      repeatedContractor: false
    }
  },
  {
    id: 'SCENARIO_B',
    name: 'Scenario B: Severe Progress Mismatch & Cover Bidding (Critical)',
    data: {
      projectId: 'P-1023',
      projectName: 'Construction of Community Hall Ward 17',
      category: 'Community',
      district: 'Pune',
      state: 'Maharashtra',
      amountReleased: 42000000,
      amountUtilized: 39000000,
      physicalProgress: 31,
      financialProgress: 92,
      paymentCount: 5,
      estimatedTenderAmount: 32000000,
      selectedBidAmount: 48000000,
      estimatedProjectCost: 32000000,
      sanctionedAmount: 48000000,
      actualDurationDays: 240,
      plannedDurationDays: 120,
      currentStatus: 'Delayed',
      eligibleBidderCount: 1,
      contractorConcentrationPercentage: 68,
      tenderType: 'Nomination',
      technicalSanctionAvailable: false,
      administrativeApprovalAvailable: true,
      documentationComplete: false,
      geoLocationVerified: true,
      duplicateWorkSuspected: true,
      nearbySimilarWork: true,
      repeatedContractor: true
    }
  }
];

// Subcomponent: Pipeline loading animation simulating checks
function AnalysisPipelineAnimation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    'Initializing audit validation matrix...',
    'Querying PFMS treasury disbursement ledgers...',
    'Analyzing ISRO Cartosat-3 SAR elevation models...',
    'Cross-referencing MCA-21 director PAN networks...',
    'Compiling SHAP feature importance attributions...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="max-w-md mx-auto p-8 select-none text-center space-y-6">
      <div className="w-12 h-12 rounded-full bg-[#15803D]/15 border border-[#15803D]/30 flex items-center justify-center mx-auto text-[#0E0E0E]">
        <Activity className="w-6 h-6 animate-spin text-[#0E0E0E]" />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[#0E0E0E]">Forensic Neural Simulation Active</h3>
        <p className="text-xs text-[#6B6B6B] font-mono animate-pulse">{steps[step]}</p>
      </div>
      <div className="w-full bg-[#E5E3DC] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#0E0E0E] h-full transition-all duration-500 rounded-full"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </Card>
  );
}

// Subcomponent: Results panel View
function AssessmentResultsView({
  result,
  onReassess
}: {
  result: RiskAssessmentResult;
  onReassess: () => void;
}) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'HIGH':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'MEDIUM':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      default:
        return 'text-emerald-800 bg-emerald-100 border-emerald-200';
    }
  };

  const handleSave = () => {
    assessmentService.saveAssessment(result);
    toast.success('Simulation Saved', {
      description: 'The simulated risk assessment docket was successfully committed to local history.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F1F0EC] pb-4 mb-4">
          <div>
            <span className="text-[10px] text-[#6B6B6B] uppercase font-bold tracking-wider font-mono">
              Audit ID: {result.assessmentId} • {result.timestamp}
            </span>
            <h2 className="text-lg font-bold text-[#0E0E0E] mt-0.5">{result.projectName}</h2>
            <p className="text-xs text-[#6B6B6B]">{result.projectId} • {result.district}, {result.state}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono bg-[#0E0E0E] text-white px-4 py-2 rounded-2xl shadow-2xs">
              {result.riskScore}/99
            </span>
            <span className={`text-xs font-bold px-3 py-2 rounded-2xl border ${getRiskColor(result.riskLevel)}`}>
              {result.riskLevel}
            </span>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {Object.entries(result.categoryScores).map(([category, score]) => (
            <div key={category} className="p-3 bg-[#F1F0EC] rounded-xl border border-[#E5E3DC] text-center">
              <span className="text-[9px] text-[#6B6B6B] uppercase tracking-wider block font-bold">
                {category} Risk
              </span>
              <span className="text-sm font-bold text-[#0E0E0E] block mt-1">
                {score}/100
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Flagged Contributors & Expected Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Why Flagged Contributors */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Risk Attribution Drivers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.whyFlaggedContributors.map((c) => (
              <div key={c.id} className="p-4 bg-white rounded-2xl border border-[#E5E3DC] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0E0E0E]">
                    {c.index}. {c.title}
                  </span>
                  <Badge variant="destructive">+{c.riskContributionPoints} pts</Badge>
                </div>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{c.summary}</p>
                <div className="grid grid-cols-2 gap-4 pt-1 border-t border-[#F1F0EC] text-[10px] text-[#6B6B6B]">
                  <div>
                    Observed: <strong className="text-[#0E0E0E]">{c.observedValue}</strong>
                  </div>
                  <div>
                    Reference: <strong className="text-[#0E0E0E]">{c.referenceValue}</strong>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Comparison Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Statutory Metrics Tolerance Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Observed</TableHead>
                  <TableHead>Tolerance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.compareWithExpected.map((m, idx) => {
                  const getStatusColor = (col: string) => {
                    if (col === 'red') return 'text-red-600 font-bold';
                    if (col === 'amber') return 'text-orange-600 font-semibold';
                    return 'text-emerald-700';
                  };

                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-xs text-[#0E0E0E]">{m.label}</TableCell>
                      <TableCell className="text-xs font-mono">{m.observed}</TableCell>
                      <TableCell className="text-xs text-[#6B6B6B]">{m.expected}</TableCell>
                      <TableCell className={`text-[10px] ${getStatusColor(m.statusColor)}`}>
                        {m.status}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Composite Risk Factors Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.riskFactors.map((rf) => (
            <div key={rf.id} className="p-4 bg-white rounded-2xl border border-[#E5E3DC] space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-[#0E0E0E]">{rf.title}</h4>
                <Badge variant={rf.severity === 'CRITICAL' ? 'destructive' : 'secondary'}>
                  {rf.severity}
                </Badge>
              </div>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">{rf.whyItMatters}</p>
              <div className="p-3 bg-[#F1F0EC] rounded-xl text-xs space-y-1 text-[#6B6B6B]">
                <div>
                  <strong className="text-[#0E0E0E] font-semibold">Recommended Verification:</strong> {rf.recommendedVerification}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Statutory Recommendations Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-xs text-[#6B6B6B] space-y-2 leading-relaxed">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="text-[#0E0E0E]">{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex justify-end gap-3 select-none">
        <button
          onClick={onReassess}
          className="bg-white hover:bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC] text-xs font-semibold px-5 py-2.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Modify Inputs</span>
        </button>

        <button
          onClick={handleSave}
          className="bg-[#0E0E0E] hover:bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          <span>Save Simulation Log</span>
        </button>
      </div>
    </div>
  );
}

export function RiskAssessmentPage() {
  const [formData, setFormData] = useState<ProjectAssessmentInput>(SAMPLE_SCENARIOS[1].data);
  const [activeScenarioId, setActiveScenarioId] = useState<string>('SCENARIO_B');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<RiskAssessmentResult | null>(null);
  const [pendingResult, setPendingResult] = useState<RiskAssessmentResult | null>(null);

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
      toast.info(`Loaded Preset: ${found.name}`);
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
        description: 'Please enter a valid Project ID and Project Title before proceeding.'
      });
      return;
    }

    setIsProcessing(true);
    setAssessmentResult(null);

    try {
      // Try real backend API first
      const backendPayload = toBackendProjectInput(formData);
      const { data: backendResponse, error: backendError } = await analyzeProject(backendPayload);

      if (backendResponse && !backendError) {
        // Backend succeeded — transform response to frontend shape
        const result = fromBackendAnalysisResponse(backendResponse, formData);
        setPendingResult(result);
        toast.success('Backend Analysis Complete', {
          description: `ML pipeline returned risk score ${backendResponse.risk_score}/100 (${backendResponse.ml_status})`
        });
      } else {
        // Backend unreachable — graceful fallback to local mock inference
        console.warn('Backend unavailable, falling back to mock inference:', backendError);
        const result = await mockRiskInferenceProvider.evaluateProject(formData);
        setPendingResult(result);
        toast.info('Using Local Simulation', {
          description: 'Backend unreachable — results generated from rule-based prototype.'
        });
      }
    } catch (err) {
      // Unexpected error — still try mock as last resort
      try {
        const result = await mockRiskInferenceProvider.evaluateProject(formData);
        setPendingResult(result);
        toast.info('Using Local Simulation', {
          description: 'Backend error — results generated from rule-based prototype.'
        });
      } catch {
        setIsProcessing(false);
        toast.error('Inference Error', {
          description: 'Both backend and local simulation failed.'
        });
      }
    }
  };

  const handlePipelineComplete = () => {
    setIsProcessing(false);
    if (pendingResult) {
      setAssessmentResult(pendingResult);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <PageHeader
        title="RISK ASSESSMENT FORENSIC SIMULATOR"
        subtitle="Simulate tender bids deviation, progress mismatch triggers, and documentation deficit scores"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Risk Assessment Simulator' },
        ]}
      />

      {/* Conditionally render: Form, Pipeline Animation, or Results */}
      {!assessmentResult && !isProcessing && (
        <div className="space-y-6">
          {/* Preset Selectors */}
          <Card className="p-4 bg-[#F1F0EC]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                Simulation Presets:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto">
                {SAMPLE_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleSelectScenario(scenario.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      activeScenarioId === scenario.id
                        ? 'bg-[#0E0E0E] text-white'
                        : 'bg-white hover:bg-[#F1F0EC] border border-[#E5E3DC] text-[#0E0E0E]'
                    }`}
                  >
                    {scenario.name.split(':')[0]}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Form Inputs Grid */}
          <Card className="p-6">
            <h3 className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mb-4 border-b border-[#F1F0EC] pb-2">
              Forensic Variable Configurator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Section 1: Identification */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-[#0E0E0E] uppercase tracking-wider">
                  Project Identification
                </h4>
                
                <div className="space-y-1 text-xs">
                  <label className="text-[#6B6B6B] font-medium">Project ID / Code</label>
                  <input
                    type="text"
                    value={formData.projectId}
                    onChange={(e) => handleFieldChange('projectId', e.target.value)}
                    className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[#6B6B6B] font-medium">Project Title / Name</label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => handleFieldChange('projectName', e.target.value)}
                    className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[#6B6B6B] font-medium">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleFieldChange('category', e.target.value)}
                    className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                  />
                </div>
              </div>

              {/* Section 2: Financials & Status */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-[#0E0E0E] uppercase tracking-wider">
                  Financials & Performance
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Sanctioned Outlay (₹)</label>
                    <input
                      type="number"
                      value={formData.sanctionedAmount}
                      onChange={(e) => handleFieldChange('sanctionedAmount', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Estimated Cost (₹)</label>
                    <input
                      type="number"
                      value={formData.estimatedProjectCost}
                      onChange={(e) => handleFieldChange('estimatedProjectCost', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Funds Released (₹)</label>
                    <input
                      type="number"
                      value={formData.amountReleased}
                      onChange={(e) => handleFieldChange('amountReleased', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Funds Utilized (₹)</label>
                    <input
                      type="number"
                      value={formData.amountUtilized}
                      onChange={(e) => handleFieldChange('amountUtilized', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Financial Prog (%)</label>
                    <input
                      type="number"
                      value={formData.financialProgress}
                      onChange={(e) => handleFieldChange('financialProgress', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Physical Prog (%)</label>
                    <input
                      type="number"
                      value={formData.physicalProgress}
                      onChange={(e) => handleFieldChange('physicalProgress', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Bidding & Checks */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-[#0E0E0E] uppercase tracking-wider">
                  Tendering & Statutory Compliance
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Estimated Tender (₹)</label>
                    <input
                      type="number"
                      value={formData.estimatedTenderAmount}
                      onChange={(e) => handleFieldChange('estimatedTenderAmount', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Awarded Bid (₹)</label>
                    <input
                      type="number"
                      value={formData.selectedBidAmount}
                      onChange={(e) => handleFieldChange('selectedBidAmount', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Eligible Bidders</label>
                    <input
                      type="number"
                      value={formData.eligibleBidderCount}
                      onChange={(e) => handleFieldChange('eligibleBidderCount', Number(e.target.value))}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#6B6B6B] font-medium">Tender Type</label>
                    <input
                      type="text"
                      value={formData.tenderType}
                      onChange={(e) => handleFieldChange('tenderType', e.target.value)}
                      className="w-full bg-[#F1F0EC] border border-[#E5E3DC] rounded-full px-3.5 py-2 text-xs focus:outline-none focus:border-[#0E0E0E]"
                    />
                  </div>
                </div>

                {/* Checklist variables */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.technicalSanctionAvailable}
                      onChange={(e) => handleFieldChange('technicalSanctionAvailable', e.target.checked)}
                      className="accent-[#0E0E0E]"
                    />
                    <span>Tech Sanction OK</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.duplicateWorkSuspected}
                      onChange={(e) => handleFieldChange('duplicateWorkSuspected', e.target.checked)}
                      className="accent-[#0E0E0E]"
                    />
                    <span>Overlap Suspected</span>
                  </label>
                </div>
              </div>

            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 select-none">
            <button
              onClick={handleReset}
              className="bg-white hover:bg-[#F1F0EC] text-[#0E0E0E] border border-[#E5E3DC] text-xs font-semibold px-5 py-2.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Configuration</span>
            </button>

            <button
              onClick={handleRunAssessment}
              className="bg-[#0E0E0E] hover:bg-black text-white text-xs font-semibold px-6 py-2.5 rounded-full cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 text-[#15803D]" />
              <span>Simulate Risk Profile</span>
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <AnalysisPipelineAnimation onComplete={handlePipelineComplete} />
      )}

      {assessmentResult && !isProcessing && (
        <AssessmentResultsView
          result={assessmentResult}
          onReassess={() => setAssessmentResult(null)}
        />
      )}
    </div>
  );
}
