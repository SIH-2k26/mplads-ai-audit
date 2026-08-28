export const mockPortfolioDistribution = [
  { name: 'Education', count: 28, value: 50400000, color: '#18324A' },
  { name: 'Roads', count: 24, value: 139200000, color: '#C98219' },
  { name: 'Water', count: 19, value: 61750000, color: '#2F7658' },
  { name: 'Health', count: 15, value: 36000000, color: '#B7791F' },
  { name: 'Sanitation', count: 9, value: 13500000, color: '#7E57C2' },
  { name: 'Community', count: 28, value: 117600000, color: '#E7A943' },
  { name: 'Other', count: 5, value: 6550000, color: '#667085' },
];

export const mockNationalRiskTrend = [
  { month: 'Sep 25', nationalAvg: 38, highRiskProjects: 820, resolvedCases: 45 },
  { month: 'Oct 25', nationalAvg: 39, highRiskProjects: 850, resolvedCases: 52 },
  { month: 'Nov 25', nationalAvg: 42, highRiskProjects: 910, resolvedCases: 48 },
  { month: 'Dec 25', nationalAvg: 44, highRiskProjects: 960, resolvedCases: 61 },
  { month: 'Jan 26', nationalAvg: 49, highRiskProjects: 1020, resolvedCases: 70 },
  { month: 'Feb 26', nationalAvg: 53, highRiskProjects: 1090, resolvedCases: 65 },
  { month: 'Mar 26', nationalAvg: 58, highRiskProjects: 1140, resolvedCases: 88 },
  { month: 'Apr 26', nationalAvg: 55, highRiskProjects: 1110, resolvedCases: 95 },
  { month: 'May 26', nationalAvg: 52, highRiskProjects: 1080, resolvedCases: 80 },
  { month: 'Jun 26', nationalAvg: 50, highRiskProjects: 1060, resolvedCases: 75 },
  { month: 'Jul 26', nationalAvg: 48, highRiskProjects: 1040, resolvedCases: 82 },
  { month: 'Aug 26', nationalAvg: 47, highRiskProjects: 1104, resolvedCases: 92 },
];

export const mockFinancialVsPhysicalTrajectory = [
  { month: 'Apr 25', financial: 15, physical: 12 },
  { month: 'May 25', financial: 30, physical: 22 },
  { month: 'Jun 25', financial: 45, physical: 28 },
  { month: 'Jul 25', financial: 60, physical: 31 },
  { month: 'Aug 25', financial: 75, physical: 31 },
  { month: 'Sep 25', financial: 92.5, physical: 31 },
];

export const mockSystemicRiskCategories = [
  { rank: '01', category: 'Cost Benchmark Deviations (>25%)', count: 184, trend: '+12%', severity: 'HIGH' },
  { rank: '02', category: 'Tender & e-Procurement Compliance Gaps', count: 121, trend: '-4%', severity: 'HIGH' },
  { rank: '03', category: 'Fund Utilisation / Stalled Allocations', count: 97, trend: '+6%', severity: 'MEDIUM' },
  { rank: '04', category: 'Duplicate Geographic / Asset Work Clusters', count: 63, trend: '+18%', severity: 'CRITICAL' },
  { rank: '05', category: 'Severe Financial vs Physical Progress Mismatch', count: 58, trend: '+9%', severity: 'CRITICAL' },
];
