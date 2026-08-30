import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Users, ShieldAlert, CheckCircle2, ChevronRight, Search, Building2, AlertTriangle, Filter, ExternalLink } from "lucide-react";
import { Contractor } from "../types";
import { formatCurrencyINR } from "../lib/utils";
import { Link } from "react-router-dom";
import { getContractors } from "../services/api";

const COMPREHENSIVE_CONTRACTORS: Contractor[] = [
  {
    id: "cont-001",
    name: "Vindhya Infracon Ltd",
    pan: "ABCDP8841M",
    registrationDate: "2019-04-12",
    district: "Pune",
    state: "Maharashtra",
    totalProjects: 14,
    totalValueRupees: 827000000,
    delayRatePercentage: 78.5,
    completionRatePercentage: 21.5,
    cancellationRatePercentage: 0,
    riskScore: 88,
    districtConcentrationPercentage: 68.4,
    topAgencies: ["DRDA Pune", "PWD Maharashtra"],
    flagHistory: ["Cover Bidding Clustered Tender", "Progress Mismatch Anomaly"],
    activeProjects: 8,
  },
  {
    id: "cont-002",
    name: "Sahyadri Buildtech Infrastructure",
    pan: "ABCDS4412M",
    registrationDate: "2021-08-19",
    district: "Pune",
    state: "Maharashtra",
    totalProjects: 10,
    totalValueRupees: 642000000,
    delayRatePercentage: 45.0,
    completionRatePercentage: 55.0,
    cancellationRatePercentage: 10,
    riskScore: 78,
    districtConcentrationPercentage: 54.2,
    topAgencies: ["PWD Pune", "Irrigation Dept"],
    flagHistory: ["Delay SLA Breach", "Subcontracting Ratio Deviation"],
    activeProjects: 6,
  },
  {
    id: "cont-003",
    name: "Pragati Infratech Pvt Ltd",
    pan: "09AABCP9912K",
    registrationDate: "2020-02-11",
    district: "Varanasi",
    state: "Uttar Pradesh",
    totalProjects: 16,
    totalValueRupees: 945000000,
    delayRatePercentage: 82.0,
    completionRatePercentage: 18.0,
    cancellationRatePercentage: 5,
    riskScore: 94,
    districtConcentrationPercentage: 74.5,
    topAgencies: ["DRDA Varanasi", "Zilla Parishad Works"],
    flagHistory: ["Satellite SAR Ground Divergence", "Escrow Shell Disbursal"],
    activeProjects: 9,
  },
  {
    id: "cont-004",
    name: "Apex Infraworks Pvt Ltd",
    pan: "ABCDP8841M",
    registrationDate: "2022-06-15",
    district: "Varanasi",
    state: "Uttar Pradesh",
    totalProjects: 8,
    totalValueRupees: 412000000,
    delayRatePercentage: 62.5,
    completionRatePercentage: 37.5,
    cancellationRatePercentage: 0,
    riskScore: 86,
    districtConcentrationPercentage: 61.0,
    topAgencies: ["DRDA Varanasi", "PWD UP"],
    flagHistory: ["Common Director PAN Overlap with L1 Bidder", "IP Subnet Collusion"],
    activeProjects: 5,
  },
  {
    id: "cont-005",
    name: "Marathwada Watertech Solutions LLP",
    pan: "27AAECM4018P",
    registrationDate: "2018-11-04",
    district: "Beed",
    state: "Maharashtra",
    totalProjects: 12,
    totalValueRupees: 520000000,
    delayRatePercentage: 71.0,
    completionRatePercentage: 29.0,
    cancellationRatePercentage: 8,
    riskScore: 89,
    districtConcentrationPercentage: 79.2,
    topAgencies: ["Zilla Parishad Engineering Division", "Water Supply Dept"],
    flagHistory: ["Clustered Tender Win Rate >90%", "Missing GPS Coordinate Proof"],
    activeProjects: 7,
  },
  {
    id: "cont-006",
    name: "Apex Edutech Systems Pvt Ltd",
    pan: "29AAACA8841Q",
    registrationDate: "2020-09-27",
    district: "Bellary",
    state: "Karnataka",
    totalProjects: 9,
    totalValueRupees: 380000000,
    delayRatePercentage: 58.0,
    completionRatePercentage: 42.0,
    cancellationRatePercentage: 0,
    riskScore: 74,
    districtConcentrationPercentage: 48.6,
    topAgencies: ["PWD Karnataka", "Education Dept"],
    flagHistory: ["GeM Unit Cost Inflation >240%", "Delayed Equipment Handover"],
    activeProjects: 4,
  },
  {
    id: "cont-007",
    name: "Garhwal Hillways & Bridges Corp",
    pan: "05AAACG3312R",
    registrationDate: "2017-05-19",
    district: "Garhwal",
    state: "Uttarakhand",
    totalProjects: 7,
    totalValueRupees: 610000000,
    delayRatePercentage: 86.4,
    completionRatePercentage: 13.6,
    cancellationRatePercentage: 14,
    riskScore: 91,
    districtConcentrationPercentage: 82.0,
    topAgencies: ["Border Roads Task Force", "Uttarakhand PWD"],
    flagHistory: ["Zero Earth Movement on SAR", "SoR Cost Benchmark Breach"],
    activeProjects: 4,
  },
  {
    id: "cont-008",
    name: "Kavery Civil Works Consortium",
    pan: "33AAACK9011J",
    registrationDate: "2016-01-30",
    district: "Madurai",
    state: "Tamil Nadu",
    totalProjects: 22,
    totalValueRupees: 1140000000,
    delayRatePercentage: 22.0,
    completionRatePercentage: 78.0,
    cancellationRatePercentage: 0,
    riskScore: 32,
    districtConcentrationPercentage: 28.4,
    topAgencies: ["Madurai Municipal Corp", "TWAD Board"],
    flagHistory: ["Clean Regulatory Track Record"],
    activeProjects: 6,
  },
  {
    id: "cont-009",
    name: "Deccan Infra Developers Pvt",
    pan: "36AAACD1144L",
    registrationDate: "2021-03-14",
    district: "Hyderabad",
    state: "Telangana",
    totalProjects: 15,
    totalValueRupees: 780000000,
    delayRatePercentage: 35.0,
    completionRatePercentage: 65.0,
    cancellationRatePercentage: 0,
    riskScore: 45,
    districtConcentrationPercentage: 34.0,
    topAgencies: ["GHMC Urban Works", "TSSPDCL"],
    flagHistory: ["Minor Timeline Extension Approved"],
    activeProjects: 5,
  },
  {
    id: "cont-010",
    name: "Brahmputra Riverine Projects Ltd",
    pan: "18AAACB7722M",
    registrationDate: "2019-12-08",
    district: "Guwahati",
    state: "Assam",
    totalProjects: 11,
    totalValueRupees: 670000000,
    delayRatePercentage: 69.5,
    completionRatePercentage: 30.5,
    cancellationRatePercentage: 9,
    riskScore: 81,
    districtConcentrationPercentage: 63.8,
    topAgencies: ["Assam Water Resources", "Guwahati Municipal"],
    flagHistory: ["Embankment Slope Defect Flagged by Drone"],
    activeProjects: 6,
  },
];

export function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>(COMPREHENSIVE_CONTRACTORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "CRITICAL" | "MODERATE" | "CLEAN">("ALL");

  useEffect(() => {
    getContractors().then(({ data, error }) => {
      if (data && !error && Array.isArray(data) && data.length > 0) {
        setContractors(data as Contractor[]);
      }
    });
  }, []);

  const filteredContractors = useMemo(() => {
    return contractors.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.state.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (riskFilter === "CRITICAL") return c.riskScore >= 80;
      if (riskFilter === "MODERATE") return c.riskScore >= 50 && c.riskScore < 80;
      if (riskFilter === "CLEAN") return c.riskScore < 50;
      return true;
    });
  }, [contractors, searchQuery, riskFilter]);

  const stats = useMemo(() => {
    const total = contractors.length;
    const critical = contractors.filter((c) => c.riskScore >= 80).length;
    const totalExposure = contractors.reduce((acc, c) => acc + c.totalValueRupees, 0);
    const avgDelay = Math.round(
      contractors.reduce((acc, c) => acc + c.delayRatePercentage, 0) / (contractors.length || 1)
    );
    return { total, critical, totalExposure, avgDelay };
  }, [contractors]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="CONTRACTORS REGISTRY"
        subtitle="Cross-entity director PAN linkages, contract volume concentration, and delay rates"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Contractors Registry" },
        ]}
      />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Monitored Entities</span>
              <Building2 className="h-4 w-4 text-[#002449]" />
            </div>
            <div className="text-2xl font-bold text-[#0E0E0E] mt-2">{stats.total}</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Across 8 State Registries</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">High Risk / Cartel Nodes</span>
              <ShieldAlert className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600 mt-2">{stats.critical}</div>
            <p className="text-[11px] text-red-600/80 mt-1">Risk Score &gt; 80 / 100</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Aggregate Exposure</span>
              <span className="text-xs font-mono font-bold text-[#002449]">INR</span>
            </div>
            <div className="text-2xl font-bold text-[#0E0E0E] mt-2">
              ₹{(stats.totalExposure / 10000000).toFixed(1)} Cr
            </div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Total Active Portfolio</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Avg Delay Rate</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-[#0E0E0E] mt-2">{stats.avgDelay}%</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">SLA Milestone Deviation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-[#E5E3DC]">
        <CardHeader className="pb-3 border-b border-[#EAE8E2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-[#0E0E0E]">
              Civil Contractor Entities ({filteredContractors.length})
            </CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contractor, PAN, district..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E5E3DC] rounded-full text-xs text-[#0E0E0E] placeholder-gray-400 focus:outline-none focus:border-[#002449]"
                />
              </div>

              {/* Risk Filter Buttons */}
              <div className="flex items-center gap-1 bg-[#F1F0EC] p-1 rounded-full border border-[#E5E3DC] text-[11px]">
                <button
                  onClick={() => setRiskFilter("ALL")}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    riskFilter === "ALL" ? "bg-[#002449] text-white shadow-2xs" : "text-[#6B6B6B] hover:text-[#0E0E0E]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setRiskFilter("CRITICAL")}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    riskFilter === "CRITICAL"
                      ? "bg-red-600 text-white shadow-2xs"
                      : "text-[#6B6B6B] hover:text-red-600"
                  }`}
                >
                  Critical Risk
                </button>
                <button
                  onClick={() => setRiskFilter("MODERATE")}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    riskFilter === "MODERATE"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "text-[#6B6B6B] hover:text-amber-600"
                  }`}
                >
                  Moderate
                </button>
                <button
                  onClick={() => setRiskFilter("CLEAN")}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    riskFilter === "CLEAN"
                      ? "bg-[#15803D] text-white shadow-2xs"
                      : "text-[#6B6B6B] hover:text-emerald-700"
                  }`}
                >
                  Clean
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F9F8F6]">
              <TableRow>
                <TableHead className="text-xs font-bold text-[#002449]">Contractor Firm</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Director PAN</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Active Works</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Total Value</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Concentration</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Delay Rate</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Anomaly Flags</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Risk Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContractors.map((c) => {
                const getRiskColor = (score: number) => {
                  if (score >= 80) return "text-red-700 font-bold bg-red-50 border-red-200";
                  if (score >= 60) return "text-amber-700 font-semibold bg-amber-50 border-amber-200";
                  return "text-emerald-700 font-medium bg-emerald-50 border-emerald-200";
                };

                return (
                  <TableRow key={c.id} className="hover:bg-[#FAF9F7] transition-colors">
                    <TableCell>
                      <div className="font-semibold text-xs text-[#0E0E0E]">{c.name}</div>
                      <div className="text-[10px] text-[#6B6B6B]">
                        Reg: {c.registrationDate} • {c.district}, {c.state}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-[#002449]">{c.pan}</TableCell>
                    <TableCell className="text-xs font-bold">{c.activeProjects}</TableCell>
                    <TableCell className="text-xs font-semibold">₹{formatCurrencyINR(c.totalValueRupees)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium">{c.districtConcentrationPercentage}%</span>
                        {c.districtConcentrationPercentage > 50 && (
                          <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold border border-red-200">
                            CARTEL
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[#0E0E0E]">{c.delayRatePercentage}%</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {c.flagHistory?.map((f, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-[#F1F0EC] text-[#0E0E0E] px-1.5 py-0.5 rounded border border-[#E5E3DC]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${getRiskColor(c.riskScore)}`}>
                        {c.riskScore} / 100
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
