// Simulation page — frontend/src/pages/Simulation.tsx
// Frontend only sends parameters. All calculations done by backend.

import { useState } from 'react';
import { FlaskConical, ArrowRight } from 'lucide-react';
import { PageHeader, LoadingState } from '../components/common';
import { runSimulation } from '../api/simulationApi';
import type { SimulationRequest, SimulationResult } from '../types/simulation';
import { formatPercent } from '../utils/formatters';
import { MOCK_PROJECTS } from '../mocks/mockProjects';

export default function Simulation() {
  const [params, setParams] = useState<Omit<SimulationRequest, 'projectId'>>({
    additionalDelayDays: 0,
    costIncreasePercent: 0,
    progressChangePercent: 0,
    paymentDelayDays: 0,
    completionDelayDays: 0,
  });
  const [projectId, setProjectId] = useState(MOCK_PROJECTS[0].projectId);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await runSimulation({ projectId, ...params });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const RiskDelta = ({ delta }: { delta: number }) => (
    <span className={`font-bold ${delta > 0 ? 'text-red-600' : 'text-green-600'}`}>
      {delta > 0 ? '+' : ''}{delta}
    </span>
  );

  const ProbabilityBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{formatPercent(value * 100)}</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="What-If Simulation"
        subtitle="Send parameters to backend. Backend computes all risk projections."
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Backend-Driven:</strong> This form sends scenario parameters to the backend.
        All risk calculations, probabilities, and projections are computed by the backend ML model.
        {import.meta.env.VITE_USE_MOCK_API === 'true' && (
          <span className="ml-2 text-amber-700 font-medium">
            [Mock mode: simplified placeholder calculation — backend will provide accurate ML-based results]
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
          <h2 className="text-sm font-semibold text-slate-800">Scenario Parameters</h2>

          {/* Project selection */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Select Project</label>
            <select value={projectId} onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {MOCK_PROJECTS.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} — {p.projectName.substring(0, 45)}
                </option>
              ))}
            </select>
          </div>

          {/* Sliders */}
          {[
            { key: 'additionalDelayDays', label: 'Additional Delay (days)', min: 0, max: 365, step: 1, unit: 'days' },
            { key: 'costIncreasePercent', label: 'Cost Increase (%)', min: 0, max: 100, step: 1, unit: '%' },
            { key: 'progressChangePercent', label: 'Progress Change (%)', min: -50, max: 50, step: 1, unit: '%' },
            { key: 'paymentDelayDays', label: 'Payment Delay (days)', min: 0, max: 180, step: 1, unit: 'days' },
            { key: 'completionDelayDays', label: 'Completion Delay (days)', min: 0, max: 365, step: 1, unit: 'days' },
          ].map(({ key, label, min, max, step, unit }) => (
            <div key={key}>
              <div className="flex justify-between text-xs mb-1.5">
                <label className="font-medium text-slate-600">{label}</label>
                <span className="font-bold text-slate-800">
                  {params[key as keyof typeof params]} {unit}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key as keyof typeof params]}
                onChange={(e) => setParams({ ...params, [key]: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-300">
                <span>{min}</span><span>{max}</span>
              </div>
            </div>
          ))}

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>
                <FlaskConical className="w-4 h-4" />
                Run Simulation
              </>
            )}
          </button>

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}
        </div>

        {/* Result Panel */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <LoadingState message="Backend computing simulation..." />
            </div>
          ) : result ? (
            <>
              {/* Risk comparison */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h2 className="text-sm font-semibold text-slate-800 mb-4">Risk Projection</h2>
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Current Risk</p>
                    <p className={`text-5xl font-bold ${result.currentRisk >= 60 ? 'text-red-600' : 'text-amber-600'}`}>
                      {result.currentRisk}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-6 h-6 text-slate-300" />
                    <RiskDelta delta={result.riskDelta} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Projected Risk</p>
                    <p className={`text-5xl font-bold ${result.projectedRisk >= 60 ? 'text-red-600' : 'text-amber-600'}`}>
                      {result.projectedRisk}
                    </p>
                  </div>
                </div>
              </div>

              {/* Probabilities */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h2 className="text-sm font-semibold text-slate-800">Outcome Probabilities</h2>
                <ProbabilityBar label="Completion Probability" value={result.completionProbability} color="#16a34a" />
                <ProbabilityBar label="Cost Overrun Probability" value={result.costOverrunProbability} color="#d97706" />
                <ProbabilityBar label="Delay Probability" value={result.delayProbability} color="#dc2626" />
              </div>

              {/* Narrative */}
              {result.scenarioNarrative && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Backend Scenario Analysis</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{result.scenarioNarrative}</p>
                  <p className="text-xs text-slate-400 mt-2">Computed at: {new Date(result.computedAt).toLocaleString()}</p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center text-slate-400">
              <FlaskConical className="w-12 h-12 mb-3 text-slate-200" />
              <p className="text-sm font-medium">Configure parameters and run simulation</p>
              <p className="text-xs mt-1">Results will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
