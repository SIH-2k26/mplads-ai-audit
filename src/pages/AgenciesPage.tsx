import React, { useState, useEffect, useMemo } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/table";
import { ImplementingAgency } from "../types";
import { formatCurrencyINR } from "../lib/utils";
import { Briefcase, Building, ShieldCheck, AlertTriangle, Search, Filter } from "lucide-react";
import { getAgencies } from "../services/api";

const COMPREHENSIVE_AGENCIES: ImplementingAgency[] = [
  {
    id: "agency-001",
    name: "District Rural Development Agency (DRDA)",
    department: "Rural Works / Panchayati Raj",
    district: "Pune",
    state: "Maharashtra",
    totalWorks: 42,
    totalValueRupees: 1840000000,
    avgDelayDays: 65,
    completionRatePercentage: 72.4,
    costOverrunRatePercentage: 18.2,
    complianceScorePercentage: 88.5,
    riskLevel: "MEDIUM",
    activeContractorCount: 9,
    flaggedWorksCount: 3,
  },
  {
    id: "agency-002",
    name: "Public Works Department (PWD Pune)",
    department: "Roads & Bridges Division",
    district: "Pune",
    state: "Maharashtra",
    totalWorks: 28,
    totalValueRupees: 1250000000,
    avgDelayDays: 45,
    completionRatePercentage: 79.2,
    costOverrunRatePercentage: 4.5,
    complianceScorePercentage: 92.0,
    riskLevel: "LOW",
    activeContractorCount: 5,
    flaggedWorksCount: 1,
  },
  {
    id: "agency-003",
    name: "DRDA Varanasi Executing Division",
    department: "Rural Development & Sanitation",
    district: "Varanasi",
    state: "Uttar Pradesh",
    totalWorks: 36,
    totalValueRupees: 1620000000,
    avgDelayDays: 98,
    completionRatePercentage: 54.0,
    costOverrunRatePercentage: 28.5,
    complianceScorePercentage: 64.2,
    riskLevel: "CRITICAL",
    activeContractorCount: 11,
    flaggedWorksCount: 8,
  },
  {
    id: "agency-004",
    name: "Zilla Parishad Works Division (Beed)",
    department: "Water Resources & Rural Engineering",
    district: "Beed",
    state: "Maharashtra",
    totalWorks: 31,
    totalValueRupees: 890000000,
    avgDelayDays: 84,
    completionRatePercentage: 61.5,
    costOverrunRatePercentage: 22.0,
    complianceScorePercentage: 71.0,
    riskLevel: "HIGH",
    activeContractorCount: 8,
    flaggedWorksCount: 5,
  },
  {
    id: "agency-005",
    name: "PWD Karnataka (Bellary Circle)",
    department: "Education & Public Infrastructure",
    district: "Bellary",
    state: "Karnataka",
    totalWorks: 24,
    totalValueRupees: 740000000,
    avgDelayDays: 52,
    completionRatePercentage: 76.8,
    costOverrunRatePercentage: 12.0,
    complianceScorePercentage: 83.5,
    riskLevel: "MEDIUM",
    activeContractorCount: 6,
    flaggedWorksCount: 2,
  },
  {
    id: "agency-006",
    name: "Uttarakhand Border Roads Directorate",
    department: "High Altitude Infrastructure",
    district: "Garhwal",
    state: "Uttarakhand",
    totalWorks: 19,
    totalValueRupees: 980000000,
    avgDelayDays: 112,
    completionRatePercentage: 48.0,
    costOverrunRatePercentage: 34.2,
    complianceScorePercentage: 58.0,
    riskLevel: "CRITICAL",
    activeContractorCount: 5,
    flaggedWorksCount: 6,
  },
  {
    id: "agency-007",
    name: "Greater Hyderabad Municipal Corp (GHMC)",
    department: "Urban Civic Assets",
    district: "Hyderabad",
    state: "Telangana",
    totalWorks: 55,
    totalValueRupees: 2450000000,
    avgDelayDays: 28,
    completionRatePercentage: 88.4,
    costOverrunRatePercentage: 3.1,
    complianceScorePercentage: 96.0,
    riskLevel: "LOW",
    activeContractorCount: 14,
    flaggedWorksCount: 1,
  },
  {
    id: "agency-008",
    name: "Madurai Municipal Corporation",
    department: "Public Health & Drainage",
    district: "Madurai",
    state: "Tamil Nadu",
    totalWorks: 38,
    totalValueRupees: 1410000000,
    avgDelayDays: 32,
    completionRatePercentage: 84.5,
    costOverrunRatePercentage: 5.2,
    complianceScorePercentage: 94.2,
    riskLevel: "LOW",
    activeContractorCount: 7,
    flaggedWorksCount: 0,
  },
  {
    id: "agency-009",
    name: "Assam Water Resources Department",
    department: "Flood Control & Embankment Division",
    district: "Guwahati",
    state: "Assam",
    totalWorks: 26,
    totalValueRupees: 1120000000,
    avgDelayDays: 79,
    completionRatePercentage: 66.0,
    costOverrunRatePercentage: 19.8,
    complianceScorePercentage: 76.5,
    riskLevel: "HIGH",
    activeContractorCount: 8,
    flaggedWorksCount: 4,
  },
  {
    id: "agency-010",
    name: "Jaipur Smart City Development SPV",
    department: "Urban Technology & Heritage Works",
    district: "Jaipur",
    state: "Rajasthan",
    totalWorks: 34,
    totalValueRupees: 1530000000,
    avgDelayDays: 39,
    completionRatePercentage: 81.2,
    costOverrunRatePercentage: 8.4,
    complianceScorePercentage: 90.5,
    riskLevel: "LOW",
    activeContractorCount: 9,
    flaggedWorksCount: 1,
  },
];

export function AgenciesPage() {
  const [agencies, setAgencies] = useState<ImplementingAgency[]>(COMPREHENSIVE_AGENCIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("ALL");

  useEffect(() => {
    getAgencies().then(({ data, error }) => {
      if (data && !error && Array.isArray(data) && data.length > 0) {
        setAgencies(data as ImplementingAgency[]);
      }
    });
  }, []);

  const filteredAgencies = useMemo(() => {
    return agencies.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.state.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (riskFilter === "CRITICAL") return a.riskLevel === "CRITICAL";
      if (riskFilter === "HIGH") return a.riskLevel === "HIGH";
      if (riskFilter === "MEDIUM") return a.riskLevel === "MEDIUM";
      if (riskFilter === "LOW") return a.riskLevel === "LOW";
      return true;
    });
  }, [agencies, searchQuery, riskFilter]);

  const stats = useMemo(() => {
    const total = agencies.length;
    const critical = agencies.filter((a) => a.riskLevel === "CRITICAL" || a.riskLevel === "HIGH").length;
    const totalOutlay = agencies.reduce((acc, a) => acc + a.totalValueRupees, 0);
    const avgCompliance = Math.round(
      agencies.reduce((acc, a) => acc + a.complianceScorePercentage, 0) / (agencies.length || 1)
    );
    return { total, critical, totalOutlay, avgCompliance };
  }, [agencies]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="IMPLEMENTING AGENCIES OFFICE"
        subtitle="Oversight of executing departments, compliance indexes, and average milestone delays"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Agencies Registry" },
        ]}
      />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Executing Agencies</span>
              <Building className="h-4 w-4 text-[#002449]" />
            </div>
            <div className="text-2xl font-bold text-[#0E0E0E] mt-2">{stats.total}</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Across 8 State Planning Offices</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Critical / High Risk</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600 mt-2">{stats.critical}</div>
            <p className="text-[11px] text-red-600/80 mt-1">High Milestone Delays</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Sanctioned Outlay</span>
              <span className="text-xs font-mono font-bold text-[#002449]">INR</span>
            </div>
            <div className="text-2xl font-bold text-[#0E0E0E] mt-2">
              ₹{(stats.totalOutlay / 10000000).toFixed(1)} Cr
            </div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">Under Departmental Execution</p>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E3DC]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Avg Compliance</span>
              <ShieldCheck className="h-4 w-4 text-[#15803D]" />
            </div>
            <div className="text-2xl font-bold text-[#15803D] mt-2">{stats.avgCompliance}%</div>
            <p className="text-[11px] text-[#6B6B6B] mt-1">GFR-12C Utilization Standard</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Table Card */}
      <Card className="border border-[#E5E3DC]">
        <CardHeader className="pb-3 border-b border-[#EAE8E2]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-bold text-[#0E0E0E]">
              Registered Implementing Agencies ({filteredAgencies.length})
            </CardTitle>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agency, dept, district..."
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E5E3DC] rounded-full text-xs text-[#0E0E0E] placeholder-gray-400 focus:outline-none focus:border-[#002449]"
                />
              </div>

              {/* Risk Level Filter Buttons */}
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
                    riskFilter === "CRITICAL" ? "bg-red-600 text-white shadow-2xs" : "text-[#6B6B6B] hover:text-red-600"
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setRiskFilter("HIGH")}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    riskFilter === "HIGH" ? "bg-amber-600 text-white shadow-2xs" : "text-[#6B6B6B] hover:text-amber-600"
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => setRiskFilter("LOW")}
                  className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                    riskFilter === "LOW" ? "bg-[#15803D] text-white shadow-2xs" : "text-[#6B6B6B] hover:text-emerald-700"
                  }`}
                >
                  Low Risk
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F9F8F6]">
              <TableRow>
                <TableHead className="text-xs font-bold text-[#002449]">Agency Name</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Department</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Total Works</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Sanctioned Outlay</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Avg Delay</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Completion Rate</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Compliance</TableHead>
                <TableHead className="text-xs font-bold text-[#002449]">Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgencies.map((a) => {
                const getRiskLevelBadge = (level: string) => {
                  switch (level) {
                    case "CRITICAL":
                      return "bg-red-50 text-red-700 border-red-200";
                    case "HIGH":
                      return "bg-orange-50 text-orange-700 border-orange-200";
                    case "MEDIUM":
                      return "bg-amber-50 text-amber-700 border-amber-200";
                    default:
                      return "bg-emerald-50 text-emerald-800 border-emerald-200";
                  }
                };

                return (
                  <TableRow key={a.id} className="hover:bg-[#FAF9F7] transition-colors">
                    <TableCell>
                      <div className="font-semibold text-xs text-[#0E0E0E]">{a.name}</div>
                      <div className="text-[10px] text-[#6B6B6B]">
                        Jurisdiction: {a.district}, {a.state}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-[#0E0E0E]">{a.department}</TableCell>
                    <TableCell className="text-xs font-bold">{a.totalWorks}</TableCell>
                    <TableCell className="text-xs font-semibold">₹{formatCurrencyINR(a.totalValueRupees)}</TableCell>
                    <TableCell className="text-xs text-[#0E0E0E]">{a.avgDelayDays} days</TableCell>
                    <TableCell className="text-xs text-[#0E0E0E]">{a.completionRatePercentage}%</TableCell>
                    <TableCell className="text-xs font-semibold text-[#15803D]">
                      {a.complianceScorePercentage}%
                    </TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getRiskLevelBadge(a.riskLevel)}`}>
                        {a.riskLevel}
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
