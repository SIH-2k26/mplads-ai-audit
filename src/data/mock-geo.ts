import { DistrictGeoStat, StateGeoStat } from '../types';

export const mockDistricts: DistrictGeoStat[] = [
  {
    id: 'DIST-PUN',
    name: 'Pune',
    state: 'Maharashtra',
    totalProjects: 128,
    sanctionedAmountRupees: 485000000, // ₹48.5 Cr
    utilisationPercentage: 82.4,
    highRiskProjectsCount: 7,
    criticalRiskCount: 3,
    delayRatePercentage: 8.2,
    costAnomaliesCount: 4,
    compositeRiskScore: 31,
    coordinates: [18.5204, 73.8567]
  },
  {
    id: 'DIST-NSK',
    name: 'Nashik',
    state: 'Maharashtra',
    totalProjects: 142,
    sanctionedAmountRupees: 520000000,
    utilisationPercentage: 69.1,
    highRiskProjectsCount: 14,
    criticalRiskCount: 5,
    delayRatePercentage: 17.4,
    costAnomaliesCount: 11,
    compositeRiskScore: 47,
    coordinates: [19.9975, 73.7898]
  },
  {
    id: 'DIST-NGP',
    name: 'Nagpur',
    state: 'Maharashtra',
    totalProjects: 165,
    sanctionedAmountRupees: 610000000,
    utilisationPercentage: 54.3,
    highRiskProjectsCount: 22,
    criticalRiskCount: 8,
    delayRatePercentage: 29.1,
    costAnomaliesCount: 18,
    compositeRiskScore: 61,
    coordinates: [21.1458, 79.0882]
  },
  {
    id: 'DIST-STR',
    name: 'Satara',
    state: 'Maharashtra',
    totalProjects: 96,
    sanctionedAmountRupees: 340000000,
    utilisationPercentage: 88.0,
    highRiskProjectsCount: 4,
    criticalRiskCount: 1,
    delayRatePercentage: 5.1,
    costAnomaliesCount: 3,
    compositeRiskScore: 26,
    coordinates: [17.6805, 73.9997]
  },
  {
    id: 'DIST-THN',
    name: 'Thane',
    state: 'Maharashtra',
    totalProjects: 175,
    sanctionedAmountRupees: 680000000,
    utilisationPercentage: 74.5,
    highRiskProjectsCount: 16,
    criticalRiskCount: 4,
    delayRatePercentage: 14.8,
    costAnomaliesCount: 9,
    compositeRiskScore: 42,
    coordinates: [19.2183, 72.9781]
  },
  {
    id: 'DIST-AUR',
    name: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    totalProjects: 118,
    sanctionedAmountRupees: 430000000,
    utilisationPercentage: 63.8,
    highRiskProjectsCount: 18,
    criticalRiskCount: 6,
    delayRatePercentage: 22.0,
    costAnomaliesCount: 12,
    compositeRiskScore: 53,
    coordinates: [19.8762, 75.3433]
  }
];

export const mockStates: StateGeoStat[] = [
  {
    id: 'ST-MH',
    name: 'Maharashtra',
    code: 'MH',
    totalProjects: 2481,
    sanctionedAmountRupees: 12480000000, // ₹1,248 Cr
    utilisationPercentage: 71.6,
    highRiskCount: 184,
    criticalCount: 42,
    openCasesCount: 38,
    compositeRiskScore: 48,
    coordinates: [19.7515, 75.7139]
  },
  {
    id: 'ST-UP',
    name: 'Uttar Pradesh',
    code: 'UP',
    totalProjects: 3840,
    sanctionedAmountRupees: 18500000000,
    utilisationPercentage: 66.2,
    highRiskCount: 312,
    criticalCount: 78,
    openCasesCount: 54,
    compositeRiskScore: 58,
    coordinates: [26.8467, 80.9462]
  },
  {
    id: 'ST-KA',
    name: 'Karnataka',
    code: 'KA',
    totalProjects: 1890,
    sanctionedAmountRupees: 9400000000,
    utilisationPercentage: 78.4,
    highRiskCount: 112,
    criticalCount: 24,
    openCasesCount: 19,
    compositeRiskScore: 36,
    coordinates: [15.3173, 75.7139]
  },
  {
    id: 'ST-TN',
    name: 'Tamil Nadu',
    code: 'TN',
    totalProjects: 2150,
    sanctionedAmountRupees: 10800000000,
    utilisationPercentage: 83.2,
    highRiskCount: 94,
    criticalCount: 18,
    openCasesCount: 14,
    compositeRiskScore: 28,
    coordinates: [11.1271, 78.6569]
  },
  {
    id: 'ST-GJ',
    name: 'Gujarat',
    code: 'GJ',
    totalProjects: 1720,
    sanctionedAmountRupees: 8600000000,
    utilisationPercentage: 81.0,
    highRiskCount: 88,
    criticalCount: 19,
    openCasesCount: 16,
    compositeRiskScore: 32,
    coordinates: [22.2587, 71.1924]
  },
  {
    id: 'ST-WB',
    name: 'West Bengal',
    code: 'WB',
    totalProjects: 2280,
    sanctionedAmountRupees: 11200000000,
    utilisationPercentage: 62.4,
    highRiskCount: 226,
    criticalCount: 58,
    openCasesCount: 41,
    compositeRiskScore: 64,
    coordinates: [22.9868, 87.8550]
  },
  {
    id: 'ST-RJ',
    name: 'Rajasthan',
    code: 'RJ',
    totalProjects: 1940,
    sanctionedAmountRupees: 9650000000,
    utilisationPercentage: 70.1,
    highRiskCount: 145,
    criticalCount: 34,
    openCasesCount: 28,
    compositeRiskScore: 44,
    coordinates: [27.0238, 74.2179]
  }
];
