import React, { useState } from 'react';
import { mockMpProfiles, MpProfileData } from '../../data/mock-mps';
import { Check, ArrowRight, ShieldAlert, TrendingUp, AlertTriangle, Scale, CheckCircle2, UserCheck, Layers } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export function MpComparisonView() {
  const [selectedMpIds, setSelectedMpIds] = useState<string[]>(['MP-PUN-01', 'MP-BAR-02', 'MP-HAV-03', 'MP-DEL-04']);

  const toggleMp = (id: string) => {
    if (selectedMpIds.includes(id)) {
      if (selectedMpIds.length > 2) {
        setSelectedMpIds(selectedMpIds.filter((item) => item !== id));
      }
    } else {
      if (selectedMpIds.length < 4) {
        setSelectedMpIds([...selectedMpIds, id]);
      }
    }
  };

  const selectedMps = mockMpProfiles.filter((mp) => selectedMpIds.includes(mp.id));

  const chartData = selectedMps.map((mp) => ({
    name: `${mp.name.split(' ')[1] || mp.name} (${mp.constituency})`,
    Allocated: mp.financial.allocated,
    Utilized: mp.financial.utilized,
    Remaining: mp.financial.remaining,
  }));

  const completionChartData = selectedMps.map((mp) => ({
    name: mp.constituency,
    'Completion %': mp.execution.completionRate,
    'Utilization %': mp.financial.utilizationRate,
    'Compliance %': mp.compliance.score,
    'Risk Score': mp.aiMonitoring.portfolioRisk,
  }));

  return (
    <div className="space-y-6">
      {/* MP Selector Bar */}
      <div className="bg-white p-4 rounded-[6px] border border-[#D9DFE3] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
              Select MPs to Compare (Up to 4)
            </h4>
            <span className="text-[11px] text-[#647383]">
              Side-by-side performance benchmarking and anomaly risk divergence analysis.
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#D99018] bg-[#D99018]/10 px-2 py-0.5 rounded border border-[#D99018]/30">
            {selectedMpIds.length} of 4 Selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {mockMpProfiles.map((mp) => {
            const isSelected = selectedMpIds.includes(mp.id);
            return (
              <button
                key={mp.id}
                type="button"
                onClick={() => toggleMp(mp.id)}
                className={`px-3 py-1.5 rounded-[4px] text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#15324A] text-white border-[#15324A] shadow-xs'
                    : 'bg-[#FAFAF7] text-[#172B3A] border-[#D9DFE3] hover:border-[#15324A]'
                }`}
              >
                {isSelected && <Check className="h-3 w-3 text-[#D99018]" />}
                <span>{mp.name}</span>
                <span className="font-mono text-[10px] opacity-75">({mp.constituency})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider mb-1">
            Fund Allocation vs Utilization (₹ Crore)
          </h4>
          <p className="text-[11px] text-[#647383] mb-4">
            Total parliamentary entitlement vs actual executing agency disbursements.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#172B3A' }} />
                <YAxis tick={{ fontSize: 10, fill: '#647383' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#15324A', color: '#FFFFFF', borderRadius: 4, fontSize: 11 }}
                  formatter={(val: any) => [`₹${val} Cr`, '']}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="Allocated" fill="#15324A" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Utilized" fill="#2E8064" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Remaining" fill="#D99018" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[6px] border border-[#D9DFE3] shadow-card">
          <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider mb-1">
            Implementation Health Metrics (% & Risk)
          </h4>
          <p className="text-[11px] text-[#647383] mb-4">
            Comparison of completion rate, utilization, compliance score, and portfolio risk.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9DFE3" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#172B3A' }} />
                <YAxis tick={{ fontSize: 10, fill: '#647383' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#15324A', color: '#FFFFFF', borderRadius: 4, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="Completion %" fill="#2E8064" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Utilization %" fill="#15324A" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Compliance %" fill="#D99018" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Risk Score" fill="#C94B4B" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comprehensive Side-by-Side Comparison Matrix */}
      <div className="bg-white rounded-[6px] border border-[#D9DFE3] shadow-card overflow-hidden">
        <div className="p-4 bg-[#FAFAF7] border-b border-[#D9DFE3] flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
            Detailed Implementation & Anomaly Exposure Matrix
          </h4>
          <span className="text-[10px] font-mono text-[#647383]">
            Cross-Constituency Benchmarking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#D9DFE3] bg-[#FAFAF7] text-[11px] font-mono uppercase text-[#15324A]">
                <th className="p-3 font-bold">Metric / Indicator</th>
                {selectedMps.map((mp) => (
                  <th key={mp.id} className="p-3 font-bold border-l border-[#D9DFE3]">
                    <div>{mp.name}</div>
                    <span className="text-[10px] font-normal text-[#647383]">({mp.constituency} • {mp.state})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DFE3]">
              {/* Financial Section */}
              <tr className="bg-[#FAFAF7]/50 font-bold text-[10px] font-mono text-[#647383]">
                <td colSpan={selectedMps.length + 1} className="p-2">FINANCIAL PERFORMANCE</td>
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Total Funds Allocated</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono font-bold border-l border-[#D9DFE3]">₹{mp.financial.allocated} Cr</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Funds Utilized</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono font-bold text-[#2E8064] border-l border-[#D9DFE3]">₹{mp.financial.utilized} Cr</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Utilization Rate</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono font-bold border-l border-[#D9DFE3]">
                    <span className={`px-2 py-0.5 rounded ${mp.financial.utilizationRate >= 90 ? 'bg-emerald-50 text-[#2E8064]' : mp.financial.utilizationRate >= 70 ? 'bg-amber-50 text-[#C98220]' : 'bg-red-50 text-[#C94B4B]'}`}>
                      {mp.financial.utilizationRate}%
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Unutilized Funds Parked</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono border-l border-[#D9DFE3]">₹{mp.financial.unutilizedFunds} Cr</td>
                ))}
              </tr>

              {/* Execution Section */}
              <tr className="bg-[#FAFAF7]/50 font-bold text-[10px] font-mono text-[#647383]">
                <td colSpan={selectedMps.length + 1} className="p-2">WORK EXECUTION & SLAS</td>
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Works Recommended / Sanctioned</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono border-l border-[#D9DFE3]">{mp.recommendations.recommended} / {mp.recommendations.sanctioned}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Works Completed</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono font-bold text-[#15324A] border-l border-[#D9DFE3]">{mp.execution.completed} ({mp.execution.completionRate}%)</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Average Project Delay</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono border-l border-[#D9DFE3]">
                    <span className={mp.execution.avgDelayDays > 50 ? 'text-[#C94B4B] font-bold' : 'text-[#172B3A]'}>
                      +{mp.execution.avgDelayDays} Days
                    </span>
                  </td>
                ))}
              </tr>

              {/* AI Anomaly Section */}
              <tr className="bg-[#FAFAF7]/50 font-bold text-[10px] font-mono text-[#647383]">
                <td colSpan={selectedMps.length + 1} className="p-2">AI RISK & ANOMALY SIGNALS</td>
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">High-Risk Works Detected</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono font-bold text-[#C94B4B] border-l border-[#D9DFE3]">{mp.aiMonitoring.highRiskWorks} Works</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Cost Benchmark Outliers</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono border-l border-[#D9DFE3]">{mp.compliance.costOutliers} Alerts</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Duplicate Work Warnings</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono border-l border-[#D9DFE3]">{mp.compliance.duplicateAlerts} Alerts</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Contractor Concentration Rate</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono border-l border-[#D9DFE3]">{mp.aiMonitoring.contractorConcentrationRate}%</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Statutory Compliance Score</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono font-bold text-[#2E8064] border-l border-[#D9DFE3]">{mp.compliance.score} / 100</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 text-[#172B3A] font-medium">Composite Portfolio Risk</td>
                {selectedMps.map((mp) => (
                  <td key={mp.id} className="p-3 font-mono font-extrabold border-l border-[#D9DFE3]">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      mp.aiMonitoring.portfolioRisk >= 75
                        ? 'bg-red-50 text-[#C94B4B] border border-[#C94B4B]/30'
                        : mp.aiMonitoring.portfolioRisk >= 50
                        ? 'bg-amber-50 text-[#C98220] border border-[#C98220]/30'
                        : 'bg-emerald-50 text-[#2E8064] border border-[#2E8064]/30'
                    }`}>
                      {mp.aiMonitoring.portfolioRisk} / 100 ({mp.aiMonitoring.riskLevel})
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Comparison Summary: "Where does each constituency differ?" */}
      <div className="bg-[#FAFAF7] p-5 rounded-[6px] border border-[#D9DFE3] space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-[#D99018]" />
          <h4 className="text-xs font-bold text-[#15324A] uppercase tracking-wider">
            AI-Synthesized Comparison: "Where does each constituency differ?"
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {selectedMps.map((mp) => (
            <div key={mp.id} className="p-3 rounded bg-white border border-[#D9DFE3] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <strong className="text-xs text-[#15324A]">{mp.constituency}</strong>
                <Badge variant={mp.aiMonitoring.portfolioRisk >= 75 ? 'critical' : mp.aiMonitoring.portfolioRisk >= 50 ? 'warning' : 'success'}>
                  {mp.aiMonitoring.riskLevel}
                </Badge>
              </div>
              <p className="text-[11px] text-[#647383] leading-relaxed">
                {mp.id === 'MP-PUN-01'
                  ? 'Strong utilization (93.9%) and execution, but moderate SoR cost anomaly exposure in ward civic works.'
                  : mp.id === 'MP-BAR-02'
                  ? 'Moderate utilization (70.3%) with execution bottlenecks (+74 days lag) and unutilized fund parking in district accounts.'
                  : mp.id === 'MP-HAV-03'
                  ? 'Exemplary overall implementation with 95.3% fund utilization, 91.9% completion rate and negligible anomaly flags.'
                  : 'Low utilization (64.4%), high execution backlog, and high concentration of sub-10L project splitting tender anomalies.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
