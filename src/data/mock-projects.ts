import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'P-1023',
    code: 'P-1023',
    title: 'Construction of Community Hall Ward 17',
    category: 'Community',
    sector: 'Urban Development',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 48000000, // 4.80 Cr in raw Rupees or units? Wait!
    // Let's check formatCurrencyINR: in section 16, "₹{formatCurrencyINR(summary.totalSanctioned)}"
    // and under state-wise breakdown: "₹124.5 Cr".
    // Wait! Let's check formatCurrencyINR format.
    // If formatCurrencyINR formats raw numbers to lakhs/crores or formats them as currency, let's write formatCurrencyINR to handle it!
    // In section 8: projectService has getProjectsSummary which does:
    // "totalSanctioned = projects.reduce((acc, p) => acc + p.sanctionedAmount, 0)"
    // If sanctionedAmount is in Crores, totalSanctioned will be ~4.80 Cr, and formatCurrencyINR will print "4.80 Cr" or format it.
    // Wait! Let's look at section 16: "Maharashtra | 148 | ₹124.5 Cr | 72.4%"
    // and "totalSanctioned" is formatted as "₹{formatCurrencyINR(summary.totalSanctioned)}".
    // If sanctionedAmount is in raw Rupees, e.g. 4,80,00,000 (4.80 Cr), then formatCurrencyINR could format it as Indian Currency or Crores.
    // Wait! Let's see: in section 16: "Total Sanctioned Funds: ₹{formatCurrencyINR(summary.totalSanctioned)}".
    // If the mock projects have sanctionedAmount in Crores (like `4.80` or `48.50`), let's verify:
    // In section 17 (MpDashboardPage): "₹{formatCurrencyINR(totalSanctioned)}"
    // If sanctionedAmount is in raw Rupees, we can make formatCurrencyINR format it to Cr or Lakhs, or format it as currency.
    // Let's make sanctionedAmount raw Rupees (e.g. 48000000) and formatCurrencyINR format it beautifully.
    // Wait, let's see. Let's make sanctionedAmount in raw Rupees: 48000000 (4.80 Cr) or 4.80.
    // Wait! In section 8, projectService does:
    // "totalUtilisation = totalSanctioned > 0 ? (totalExpended / totalSanctioned) * 100 : 0;"
    // If both sanctionedAmount and expenditure are in the same units (e.g., both raw Rupees or both in Crores), the division works perfectly.
    // Let's use raw Rupees (e.g. 48000000) because it's standard, and write formatCurrencyINR to output formatted text (e.g. "4.80 Cr" or "4,80,00,000").
    // Wait, in section 16: "Total Sanctioned: ₹{formatCurrencyINR(summary.totalSanctioned)}" -> if it returns "4.80 Cr" or similar, or does standard formatting.
    // Let's check how formatCurrencyINR is defined or how we should write it. Let's make it support both or format raw Rupees to standard Indian formatting (Lakhs/Crores) or simple Lakhs/Crores formatting.
    // Wait! Let's check what the mockProjects sanctionedAmount should be. Let's use standard numbers like 48000000 (4.80 Cr) or 48.50 (in Crores).
    // Actually, let's use raw Rupees (e.g. 48000000) for standard, or wait, in section 22:
    // "128 active projects, 7 high risk flags, ₹48.5 Cr sanctioned." -> if it says ₹48.5 Cr, that means the sum of sanctioned amounts is 48.5 Cr.
    // Let's make sanctionedAmount represent raw Rupees so that formatCurrencyINR can format it nicely. Let's check:
    // sanctionedAmount: 48000000 (4.8 Crore)
    // releasedAmount: 42000000 (4.2 Crore)
    // expenditure: 44400000 (4.44 Crore)
    releasedAmount: 42000000,
    expenditure: 44400000,
    remainingBalance: 3600000,
    utilisationPercentage: 92.5,
    physicalProgressPercentage: 31,
    financialProgressPercentage: 92.5,
    progressMismatchGap: 61.5,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 88,
    futureRiskScore: 92,
    systemicRiskScore: 84,
    confidenceScore: 91,
    evidenceCoverage: 85,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 75,
      financial: 92,
      procurement: 40,
      execution: 88,
      delay: 90,
      contractor: 65,
      duplicate: 20,
      compliance: 80,
      historical: 30
    },
    contractor: {
      id: 'cont-001',
      name: 'Vindhya Infracon Ltd',
      panNumber: 'ABCDP8841M',
      riskScore: 85,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-001',
      name: 'DRDA Pune / Zilla Parishad',
      department: 'Rural Works',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ward 17',
      block: 'Haveli',
      address: 'Ward 17, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 48000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 120, notes: 'Stalled due to clearance delay' }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 24000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1029' },
      { id: 'p2', date: '2024-08-10', amount: 18000000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-1892' },
      { id: 'p3', date: '2024-11-05', amount: 2400000, type: 'Tranche 3 Release', status: 'PAID', reference: 'PFMS-VOUCH-2901' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Pune Community Hall', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' },
      { id: 'd2', title: 'Technical Sanction Memo', type: 'TECHNICAL_ESTIMATE', uploadedDate: '2024-04-18', fileSize: '2.8 MB', verifiedByAi: false, flagCount: 1, hash: 'SHA256-11f2d9' },
      { id: 'd3', title: 'Voucher Invoice Tranche 2', type: 'UTILISATION_CERTIFICATE', uploadedDate: '2024-08-12', fileSize: '1.1 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-99b3c4' }
    ],
    costBenchmark: {
      projectCost: 48000000,
      peerMedian: 32000000,
      peerMean: 34500000,
      expectedRange: [28000000, 38000000],
      deviationPercentage: 50,
      peerPercentile: 94,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed 10% of prevailing PWD/CPWD Schedule of Rates without written justification.', severity: 'CRITICAL' },
      { ruleId: 'R-212', documentTitle: 'General Financial Rules 2017', section: 'Rule 212', page: 68, summary: 'Utilisation Certificate submission timing', quote: 'A Utilisation Certificate must be submitted within 90 days of tranche release.', severity: 'HIGH' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass indicates only 31% physical volume completed vs 92.5% financial disbursement.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 },
      { id: 'e2', type: 'MODEL', title: 'Cover Bidding Detected', detail: 'Vindhya Infracon and Apex Infraworks submitted bids from identical IP address block.', verified: true, timestamp: '2025-02-21 14:15', confidenceScore: 89 }
    ],
    relationships: [
      { targetId: 'cont-001', targetName: 'Vindhya Infracon Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 },
      { targetId: 'agency-001', targetName: 'DRDA Pune', targetType: 'AGENCY', relationType: 'IMPLEMENTED_BY', weight: 80 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-0871',
    code: 'P-0871',
    title: 'Haveli Link Road Drainage & Pavement Works',
    category: 'Roads',
    sector: 'Rural Connectivity',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 25000000,
    releasedAmount: 22000000,
    expenditure: 19140000,
    remainingBalance: 2860000,
    utilisationPercentage: 87.0,
    physicalProgressPercentage: 51,
    financialProgressPercentage: 87.0,
    progressMismatchGap: 36.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 68,
    futureRiskScore: 75,
    systemicRiskScore: 62,
    confidenceScore: 88,
    evidenceCoverage: 78,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH'],
    riskFingerprint: {
      cost: 45,
      financial: 87,
      procurement: 50,
      execution: 70,
      delay: 55,
      contractor: 78,
      duplicate: 10,
      compliance: 50,
      historical: 40
    },
    contractor: {
      id: 'cont-002',
      name: 'Sahyadri Buildtech Infrastructure',
      panNumber: 'ABCDS4412M',
      riskScore: 78,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-002',
      name: 'Public Works Department (PWD Pune)',
      department: 'Roads & Bridges',
      delayRate: 45
    },
    location: {
      lat: 18.4504,
      lng: 73.9167,
      wardOrVillage: 'Haveli Block',
      block: 'Haveli',
      address: 'Haveli Block, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-03-01', status: 'COMPLETED', amount: 25000000 },
      { id: 't2', step: 'Tender Process', date: '2024-04-15', status: 'COMPLETED' },
      { id: 't3', step: 'Work Commenced', date: '2024-05-20', status: 'COMPLETED' }
    ],
    payments: [
      { id: 'p1', date: '2024-03-10', amount: 12500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-0891' },
      { id: 'p2', date: '2024-07-15', amount: 9500000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-1422' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Haveli Road', type: 'SANCTION_ORDER', uploadedDate: '2024-03-01', fileSize: '1.2 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-44c21a' }
    ],
    costBenchmark: {
      projectCost: 25000000,
      peerMedian: 24000000,
      peerMean: 24200000,
      expectedRange: [22000000, 26000000],
      deviationPercentage: 4,
      peerPercentile: 52,
      peerSampleCount: 22
    },
    applicableRules: [
      { ruleId: 'R-212', documentTitle: 'General Financial Rules 2017', section: 'Rule 212', page: 68, summary: 'Utilisation Certificate submission timing', quote: 'A Utilisation Certificate must be submitted within 90 days of tranche release.', severity: 'HIGH' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Physical Progress Divergence', detail: 'Actual physical progress is 51% against financial release of 87%.', verified: true, timestamp: '2025-02-22 11:20', confidenceScore: 88 }
    ],
    relationships: [
      { targetId: 'cont-002', targetName: 'Sahyadri Buildtech Infrastructure', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 95 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-26',
      financialDataAgeDays: 3,
      physicalDataAgeDays: 14,
      isStale: false
    }
  }
];
