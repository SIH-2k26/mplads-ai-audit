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
    sanctionedAmount: 48000000,
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
    systemicRiskScore: 82,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 93,
      financial: 96,
      procurement: 68,
      execution: 90,
      delay: 90,
      contractor: 73,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-1023',
      name: 'Vindhya Infracon Ltd',
      panNumber: 'ABCDP5706M',
      riskScore: 88,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-1023',
      name: 'DRDA Pune / Zilla Parishad',
      department: 'Urban Development',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ward 17, Haveli',
      block: 'Pune Central',
      address: 'Ward 17, Haveli, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 48000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 24000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-5706' },
      { id: 'p2', date: '2024-08-10', amount: 16800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-6706' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Construction of Community Hall Ward 17', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 48000000,
      peerMedian: 40800000,
      peerMean: 42240000,
      expectedRange: [36000000, 45600000],
      deviationPercentage: 30,
      peerPercentile: 93,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1023', targetName: 'Vindhya Infracon Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
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
    remainingBalance: 5860000,
    utilisationPercentage: 87.0,
    physicalProgressPercentage: 51,
    financialProgressPercentage: 87.0,
    progressMismatchGap: 36.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 68,
    futureRiskScore: 72,
    systemicRiskScore: 62,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH'],
    riskFingerprint: {
      cost: 73,
      financial: 76,
      procurement: 48,
      execution: 70,
      delay: 72,
      contractor: 53,
      duplicate: 10,
      compliance: 74,
      historical: 30
    },
    contractor: {
      id: 'cont-P-0871',
      name: 'Western Ghats Roadways Ltd',
      panNumber: 'ABCDP7574M',
      riskScore: 68,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-0871',
      name: 'PWD Pune Division',
      department: 'Rural Connectivity',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Haveli Block',
      block: 'Pune Central',
      address: 'Haveli Block, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 25000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7574' },
      { id: 'p2', date: '2024-08-10', amount: 8750000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8574' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Haveli Link Road Drainage & Pavement Works', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 25000000,
      peerMedian: 21250000,
      peerMean: 22000000,
      expectedRange: [18750000, 23750000],
      deviationPercentage: 18,
      peerPercentile: 73,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-0871', targetName: 'Western Ghats Roadways Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-0914',
    code: 'P-0914',
    title: 'Solar Street Lighting across 12 Gram Panchayats',
    category: 'Energy',
    sector: 'Renewable Energy',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 12000000,
    releasedAmount: 12000000,
    expenditure: 11800000,
    remainingBalance: 200000,
    utilisationPercentage: 98.3,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.3,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 14,
    futureRiskScore: 18,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 19,
      financial: 22,
      procurement: 20,
      execution: 16,
      delay: 18,
      contractor: 25,
      duplicate: 10,
      compliance: 20,
      historical: 15
    },
    contractor: {
      id: 'cont-P-0914',
      name: 'Maha Solar Grid Power LLP',
      panNumber: 'ABCDP2151M',
      riskScore: 14,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-0914',
      name: 'Zilla Parishad Energy Cell',
      department: 'Renewable Energy',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Khed & Junnar',
      block: 'Pune Central',
      address: 'Khed & Junnar, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 12000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 6000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2151' },
      { id: 'p2', date: '2024-08-10', amount: 4200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3151' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solar Street Lighting across 12 Gram Panchayats', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 12000000,
      peerMedian: 10200000,
      peerMean: 10560000,
      expectedRange: [9000000, 11400000],
      deviationPercentage: 0,
      peerPercentile: 19,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-0914', targetName: 'Maha Solar Grid Power LLP', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-0932',
    code: 'P-0932',
    title: 'Zilla Parishad High School Science & Robotics Lab',
    category: 'Education',
    sector: 'School Infrastructure',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 18500000,
    releasedAmount: 18500000,
    expenditure: 18100000,
    remainingBalance: 400000,
    utilisationPercentage: 97.8,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.8,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 18,
    futureRiskScore: 22,
    systemicRiskScore: 12,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 23,
      financial: 26,
      procurement: 20,
      execution: 20,
      delay: 22,
      contractor: 25,
      duplicate: 10,
      compliance: 24,
      historical: 15
    },
    contractor: {
      id: 'cont-P-0932',
      name: 'Apex Edutech Systems',
      panNumber: 'ABCDP7530M',
      riskScore: 18,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-0932',
      name: 'Education Dept Pune',
      department: 'School Infrastructure',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Baramati Rural',
      block: 'Pune Central',
      address: 'Baramati Rural, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 18500000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9250000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7530' },
      { id: 'p2', date: '2024-08-10', amount: 6475000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8530' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Zilla Parishad High School Science & Robotics Lab', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 18500000,
      peerMedian: 15725000,
      peerMean: 16280000,
      expectedRange: [13875000, 17575000],
      deviationPercentage: -1,
      peerPercentile: 23,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-0932', targetName: 'Apex Edutech Systems', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-0945',
    code: 'P-0945',
    title: 'Public Health Sub-Centre Diagnostic Wing Expansion',
    category: 'Health',
    sector: 'Public Health',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 31000000,
    releasedAmount: 28000000,
    expenditure: 26500000,
    remainingBalance: 4500000,
    utilisationPercentage: 85.5,
    physicalProgressPercentage: 75,
    financialProgressPercentage: 85.5,
    progressMismatchGap: 10.5,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 42,
    futureRiskScore: 46,
    systemicRiskScore: 36,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 47,
      financial: 50,
      procurement: 22,
      execution: 44,
      delay: 46,
      contractor: 27,
      duplicate: 10,
      compliance: 48,
      historical: 15
    },
    contractor: {
      id: 'cont-P-0945',
      name: 'Sahyadri Medi-Infra',
      panNumber: 'ABCDP7960M',
      riskScore: 42,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-0945',
      name: 'District Health Office',
      department: 'Public Health',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Daund Block',
      block: 'Pune Central',
      address: 'Daund Block, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 31000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 15500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7960' },
      { id: 'p2', date: '2024-08-10', amount: 10850000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8960' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Public Health Sub-Centre Diagnostic Wing Expansion', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 31000000,
      peerMedian: 26350000,
      peerMean: 27280000,
      expectedRange: [23250000, 29450000],
      deviationPercentage: 5,
      peerPercentile: 47,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-0945', targetName: 'Sahyadri Medi-Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-0960',
    code: 'P-0960',
    title: 'Drinking Water Reverse Osmosis Filtration Plants (8 Units)',
    category: 'Water',
    sector: 'Drinking Water',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 24000000,
    releasedAmount: 20000000,
    expenditure: 18900000,
    remainingBalance: 5100000,
    utilisationPercentage: 94.5,
    physicalProgressPercentage: 82,
    financialProgressPercentage: 94.5,
    progressMismatchGap: 12.5,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 38,
    futureRiskScore: 42,
    systemicRiskScore: 32,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 43,
      financial: 46,
      procurement: 20,
      execution: 40,
      delay: 42,
      contractor: 25,
      duplicate: 10,
      compliance: 44,
      historical: 15
    },
    contractor: {
      id: 'cont-P-0960',
      name: 'Nira Aqua Systems',
      panNumber: 'ABCDP4460M',
      riskScore: 38,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-0960',
      name: 'MJP Water Board',
      department: 'Drinking Water',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Purandar Rural',
      block: 'Pune Central',
      address: 'Purandar Rural, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 24000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4460' },
      { id: 'p2', date: '2024-08-10', amount: 8400000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5460' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Drinking Water Reverse Osmosis Filtration Plants (8 Units)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 24000000,
      peerMedian: 20400000,
      peerMean: 21120000,
      expectedRange: [18000000, 22800000],
      deviationPercentage: 6,
      peerPercentile: 43,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-0960', targetName: 'Nira Aqua Systems', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-0978',
    code: 'P-0978',
    title: 'Khadakwasla Canal Embankment & Culvert Strengthening',
    category: 'Water',
    sector: 'Water Resources',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 42000000,
    releasedAmount: 36000000,
    expenditure: 34200000,
    remainingBalance: 7800000,
    utilisationPercentage: 81.4,
    physicalProgressPercentage: 40,
    financialProgressPercentage: 81.4,
    progressMismatchGap: 41.4,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 84,
    futureRiskScore: 88,
    systemicRiskScore: 78,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 89,
      financial: 92,
      procurement: 64,
      execution: 86,
      delay: 88,
      contractor: 69,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-0978',
      name: 'Deccan Waterways Corp',
      panNumber: 'ABCDP6923M',
      riskScore: 84,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-0978',
      name: 'Irrigation Dept Pune',
      department: 'Water Resources',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Sinhagad Foothills',
      block: 'Pune Central',
      address: 'Sinhagad Foothills, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 42000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 21000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6923' },
      { id: 'p2', date: '2024-08-10', amount: 14699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7923' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Khadakwasla Canal Embankment & Culvert Strengthening', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 42000000,
      peerMedian: 35700000,
      peerMean: 36960000,
      expectedRange: [31500000, 39900000],
      deviationPercentage: 20,
      peerPercentile: 89,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-0978', targetName: 'Deccan Waterways Corp', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-1002',
    code: 'P-1002',
    title: 'Artisan Exhibition Complex & Training Centre',
    category: 'Community',
    sector: 'Livelihood',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 19000000,
    releasedAmount: 16000000,
    expenditure: 14800000,
    remainingBalance: 4200000,
    utilisationPercentage: 77.9,
    physicalProgressPercentage: 65,
    financialProgressPercentage: 77.9,
    progressMismatchGap: 12.9,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 55,
    futureRiskScore: 59,
    systemicRiskScore: 49,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 60,
      financial: 63,
      procurement: 35,
      execution: 57,
      delay: 59,
      contractor: 40,
      duplicate: 10,
      compliance: 61,
      historical: 15
    },
    contractor: {
      id: 'cont-P-1002',
      name: 'Kalyani Builders',
      panNumber: 'ABCDP4403M',
      riskScore: 55,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-1002',
      name: 'DIC Pune',
      department: 'Livelihood',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Hadapsar Ward 21',
      block: 'Pune Central',
      address: 'Hadapsar Ward 21, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 19000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4403' },
      { id: 'p2', date: '2024-08-10', amount: 6650000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5403' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Artisan Exhibition Complex & Training Centre', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 19000000,
      peerMedian: 16150000,
      peerMean: 16720000,
      expectedRange: [14250000, 18050000],
      deviationPercentage: 6,
      peerPercentile: 60,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1002', targetName: 'Kalyani Builders', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-1011',
    code: 'P-1011',
    title: 'Anganwadi Centre Smart Classrooms (15 Villages)',
    category: 'Education',
    sector: 'Child Development',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 15000000,
    releasedAmount: 15000000,
    expenditure: 14600000,
    remainingBalance: 400000,
    utilisationPercentage: 97.3,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.3,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 12,
    futureRiskScore: 16,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 17,
      financial: 20,
      procurement: 20,
      execution: 14,
      delay: 16,
      contractor: 25,
      duplicate: 10,
      compliance: 18,
      historical: 15
    },
    contractor: {
      id: 'cont-P-1011',
      name: 'Vikas Educational Supplies',
      panNumber: 'ABCDP1015M',
      riskScore: 12,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-1011',
      name: 'WCD Dept Pune',
      department: 'Child Development',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ambegaon Block',
      block: 'Pune Central',
      address: 'Ambegaon Block, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 15000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 7500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1015' },
      { id: 'p2', date: '2024-08-10', amount: 5250000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2015' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Anganwadi Centre Smart Classrooms (15 Villages)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 15000000,
      peerMedian: 12750000,
      peerMean: 13200000,
      expectedRange: [11250000, 14250000],
      deviationPercentage: -1,
      peerPercentile: 17,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1011', targetName: 'Vikas Educational Supplies', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-1035',
    code: 'P-1035',
    title: 'Solid Waste Segregation & Bio-Methanation Facility',
    category: 'Sanitation',
    sector: 'Swachh Bharat',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 38000000,
    releasedAmount: 30000000,
    expenditure: 28500000,
    remainingBalance: 9500000,
    utilisationPercentage: 75.0,
    physicalProgressPercentage: 58,
    financialProgressPercentage: 75.0,
    progressMismatchGap: 17.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 62,
    futureRiskScore: 66,
    systemicRiskScore: 56,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 67,
      financial: 70,
      procurement: 42,
      execution: 64,
      delay: 66,
      contractor: 47,
      duplicate: 10,
      compliance: 68,
      historical: 30
    },
    contractor: {
      id: 'cont-P-1035',
      name: 'Green Pune Envirotech',
      panNumber: 'ABCDP8902M',
      riskScore: 62,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-1035',
      name: 'PMC Solid Waste Division',
      department: 'Swachh Bharat',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Uruli Devachi',
      block: 'Pune Central',
      address: 'Uruli Devachi, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 38000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 19000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8902' },
      { id: 'p2', date: '2024-08-10', amount: 13300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9902' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solid Waste Segregation & Bio-Methanation Facility', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 38000000,
      peerMedian: 32300000,
      peerMean: 33440000,
      expectedRange: [28500000, 36100000],
      deviationPercentage: 8,
      peerPercentile: 67,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1035', targetName: 'Green Pune Envirotech', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-1044',
    code: 'P-1044',
    title: 'Rural Crematorium Electric Pyre Installation',
    category: 'Community',
    sector: 'Urban Infrastructure',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 16000000,
    releasedAmount: 16000000,
    expenditure: 15700000,
    remainingBalance: 300000,
    utilisationPercentage: 98.1,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.1,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 16,
    futureRiskScore: 20,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 21,
      financial: 24,
      procurement: 20,
      execution: 18,
      delay: 20,
      contractor: 25,
      duplicate: 10,
      compliance: 22,
      historical: 15
    },
    contractor: {
      id: 'cont-P-1044',
      name: 'Clean Energy Furnaces',
      panNumber: 'ABCDP8364M',
      riskScore: 16,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-1044',
      name: 'Zilla Parishad Works',
      department: 'Urban Infrastructure',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Shirur Rural',
      block: 'Pune Central',
      address: 'Shirur Rural, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 16000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 8000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8364' },
      { id: 'p2', date: '2024-08-10', amount: 5600000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9364' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Rural Crematorium Electric Pyre Installation', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 16000000,
      peerMedian: 13600000,
      peerMean: 14080000,
      expectedRange: [12000000, 15200000],
      deviationPercentage: 0,
      peerPercentile: 21,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1044', targetName: 'Clean Energy Furnaces', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-1052',
    code: 'P-1052',
    title: 'Multi-Purpose Sports Complex & Gymnasium Ward 24',
    category: 'Sports',
    sector: 'Youth Affairs',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 52000000,
    releasedAmount: 44000000,
    expenditure: 42100000,
    remainingBalance: 9900000,
    utilisationPercentage: 81.0,
    physicalProgressPercentage: 35,
    financialProgressPercentage: 81.0,
    progressMismatchGap: 46.0,
    status: 'HALTED',
    currentRiskScore: 91,
    futureRiskScore: 95,
    systemicRiskScore: 85,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 95,
      financial: 98,
      procurement: 71,
      execution: 93,
      delay: 90,
      contractor: 76,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-1052',
      name: 'Shivaji Sports Infra',
      panNumber: 'ABCDP1581M',
      riskScore: 91,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-1052',
      name: 'Sports Directorate MH',
      department: 'Youth Affairs',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kothrud Ward 24',
      block: 'Pune Central',
      address: 'Kothrud Ward 24, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 52000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 26000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1581' },
      { id: 'p2', date: '2024-08-10', amount: 18200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2581' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Multi-Purpose Sports Complex & Gymnasium Ward 24', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 52000000,
      peerMedian: 44200000,
      peerMean: 45760000,
      expectedRange: [39000000, 49400000],
      deviationPercentage: 23,
      peerPercentile: 96,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1052', targetName: 'Shivaji Sports Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-1068',
    code: 'P-1068',
    title: 'Village Connecting Concrete Causeway Bridge',
    category: 'Roads',
    sector: 'Rural Works',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 29000000,
    releasedAmount: 25000000,
    expenditure: 23400000,
    remainingBalance: 5600000,
    utilisationPercentage: 80.7,
    physicalProgressPercentage: 70,
    financialProgressPercentage: 80.7,
    progressMismatchGap: 10.7,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 48,
    futureRiskScore: 52,
    systemicRiskScore: 42,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 53,
      financial: 56,
      procurement: 28,
      execution: 50,
      delay: 52,
      contractor: 33,
      duplicate: 10,
      compliance: 54,
      historical: 15
    },
    contractor: {
      id: 'cont-P-1068',
      name: 'Mutha Bridges & Roads',
      panNumber: 'ABCDP2369M',
      riskScore: 48,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-1068',
      name: 'PWD Rural Pune',
      department: 'Rural Works',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Mulshi Block',
      block: 'Pune Central',
      address: 'Mulshi Block, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 29000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2369' },
      { id: 'p2', date: '2024-08-10', amount: 10150000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3369' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Village Connecting Concrete Causeway Bridge', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 29000000,
      peerMedian: 24650000,
      peerMean: 25520000,
      expectedRange: [21750000, 27550000],
      deviationPercentage: 5,
      peerPercentile: 53,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1068', targetName: 'Mutha Bridges & Roads', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-1080',
    code: 'P-1080',
    title: 'Veterinary Dispensary & Mobile Animal Clinic Unit',
    category: 'Health',
    sector: 'Animal Husbandry',
    mpName: 'Hon. Member LS-Pune',
    constituency: 'Pune Parliamentary Constituency',
    district: 'Pune',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 14000000,
    releasedAmount: 12000000,
    expenditure: 11400000,
    remainingBalance: 2600000,
    utilisationPercentage: 81.4,
    physicalProgressPercentage: 88,
    financialProgressPercentage: 81.4,
    progressMismatchGap: 0.0,
    status: 'SANCTIONED',
    currentRiskScore: 24,
    futureRiskScore: 28,
    systemicRiskScore: 18,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 29,
      financial: 32,
      procurement: 20,
      execution: 26,
      delay: 28,
      contractor: 25,
      duplicate: 10,
      compliance: 30,
      historical: 15
    },
    contractor: {
      id: 'cont-P-1080',
      name: 'Kisan Livestock Care',
      panNumber: 'ABCDP7372M',
      riskScore: 24,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-1080',
      name: 'Animal Husbandry Dept',
      department: 'Animal Husbandry',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Indapur Rural',
      block: 'Pune Central',
      address: 'Indapur Rural, Pune, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 14000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 7000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7372' },
      { id: 'p2', date: '2024-08-10', amount: 4900000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8372' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Veterinary Dispensary & Mobile Animal Clinic Unit', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 14000000,
      peerMedian: 11900000,
      peerMean: 12320000,
      expectedRange: [10500000, 13300000],
      deviationPercentage: -3,
      peerPercentile: 29,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-1080', targetName: 'Kisan Livestock Care', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2001',
    code: 'P-2001',
    title: 'Construction of 500 MT Agri Cold-Chain Hub & Solar Grid',
    category: 'Roads',
    sector: 'Agri Infrastructure',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 48000000,
    releasedAmount: 42000000,
    expenditure: 42000000,
    remainingBalance: 6000000,
    utilisationPercentage: 87.5,
    physicalProgressPercentage: 18,
    financialProgressPercentage: 87.5,
    progressMismatchGap: 69.5,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 94,
    futureRiskScore: 98,
    systemicRiskScore: 88,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 95,
      financial: 98,
      procurement: 74,
      execution: 95,
      delay: 90,
      contractor: 79,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-2001',
      name: 'Pragati Infratech Pvt Ltd',
      panNumber: 'ABCDP2133M',
      riskScore: 94,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-2001',
      name: 'DRDA Varanasi',
      department: 'Agri Infrastructure',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Varanasi North',
      block: 'Varanasi Central',
      address: 'Varanasi North, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 48000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 24000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2133' },
      { id: 'p2', date: '2024-08-10', amount: 16800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3133' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Construction of 500 MT Agri Cold-Chain Hub & Solar Grid', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 48000000,
      peerMedian: 40800000,
      peerMean: 42240000,
      expectedRange: [36000000, 45600000],
      deviationPercentage: 34,
      peerPercentile: 98,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2001', targetName: 'Pragati Infratech Pvt Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2002',
    code: 'P-2002',
    title: 'Kashi Ghat Solar Illumination & Smart Safety Railings',
    category: 'Energy',
    sector: 'Urban Heritage',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 35000000,
    releasedAmount: 35000000,
    expenditure: 34200000,
    remainingBalance: 800000,
    utilisationPercentage: 97.7,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.7,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 16,
    futureRiskScore: 20,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 21,
      financial: 24,
      procurement: 20,
      execution: 18,
      delay: 20,
      contractor: 25,
      duplicate: 10,
      compliance: 22,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2002',
      name: 'Kashi Solar Lightings',
      panNumber: 'ABCDP7282M',
      riskScore: 16,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2002',
      name: 'Varanasi Smart City Corp',
      department: 'Urban Heritage',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Assi to Dashashwamedh',
      block: 'Varanasi Central',
      address: 'Assi to Dashashwamedh, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 35000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 17500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7282' },
      { id: 'p2', date: '2024-08-10', amount: 12250000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8282' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Kashi Ghat Solar Illumination & Smart Safety Railings', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 35000000,
      peerMedian: 29750000,
      peerMean: 30800000,
      expectedRange: [26250000, 33250000],
      deviationPercentage: -1,
      peerPercentile: 21,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2002', targetName: 'Kashi Solar Lightings', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2003',
    code: 'P-2003',
    title: 'Sewage Interception Pipeline Ward 14-22 Link',
    category: 'Sanitation',
    sector: 'Namami Gange',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 62000000,
    releasedAmount: 54000000,
    expenditure: 51000000,
    remainingBalance: 11000000,
    utilisationPercentage: 82.3,
    physicalProgressPercentage: 42,
    financialProgressPercentage: 82.3,
    progressMismatchGap: 40.3,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 86,
    futureRiskScore: 90,
    systemicRiskScore: 80,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 91,
      financial: 94,
      procurement: 66,
      execution: 88,
      delay: 90,
      contractor: 71,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-2003',
      name: 'Ganga Clean Pipeline Ltd',
      panNumber: 'ABCDP7100M',
      riskScore: 86,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-2003',
      name: 'UP Jal Nigam Varanasi',
      department: 'Namami Gange',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ward 14-22',
      block: 'Varanasi Central',
      address: 'Ward 14-22, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 62000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 31000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7100' },
      { id: 'p2', date: '2024-08-10', amount: 21700000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8100' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Sewage Interception Pipeline Ward 14-22 Link', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 62000000,
      peerMedian: 52700000,
      peerMean: 54560000,
      expectedRange: [46500000, 58900000],
      deviationPercentage: 20,
      peerPercentile: 91,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2003', targetName: 'Ganga Clean Pipeline Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2004',
    code: 'P-2004',
    title: 'Weavers Common Facility Centre & Powerloom Sheds',
    category: 'Community',
    sector: 'Textile & Crafts',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 28000000,
    releasedAmount: 25000000,
    expenditure: 23800000,
    remainingBalance: 4200000,
    utilisationPercentage: 85.0,
    physicalProgressPercentage: 80,
    financialProgressPercentage: 85.0,
    progressMismatchGap: 5.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 34,
    futureRiskScore: 38,
    systemicRiskScore: 28,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 39,
      financial: 42,
      procurement: 20,
      execution: 36,
      delay: 38,
      contractor: 25,
      duplicate: 10,
      compliance: 40,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2004',
      name: 'Banaras Weavers Guild',
      panNumber: 'ABCDP6405M',
      riskScore: 34,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2004',
      name: 'Handloom Directorate UP',
      department: 'Textile & Crafts',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Chowkaghat',
      block: 'Varanasi Central',
      address: 'Chowkaghat, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 28000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6405' },
      { id: 'p2', date: '2024-08-10', amount: 9800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7405' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Weavers Common Facility Centre & Powerloom Sheds', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 28000000,
      peerMedian: 23800000,
      peerMean: 24640000,
      expectedRange: [21000000, 26600000],
      deviationPercentage: 2,
      peerPercentile: 39,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2004', targetName: 'Banaras Weavers Guild', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2005',
    code: 'P-2005',
    title: 'Smart High School Science Labs (10 Rural Schools)',
    category: 'Education',
    sector: 'Education',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 21000000,
    releasedAmount: 21000000,
    expenditure: 20500000,
    remainingBalance: 500000,
    utilisationPercentage: 97.6,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.6,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 12,
    futureRiskScore: 16,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 17,
      financial: 20,
      procurement: 20,
      execution: 14,
      delay: 16,
      contractor: 25,
      duplicate: 10,
      compliance: 18,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2005',
      name: 'Gyanodaya Tech Pvt Ltd',
      panNumber: 'ABCDP7607M',
      riskScore: 12,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2005',
      name: 'Basic Shiksha Parishad',
      department: 'Education',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Pindra Block',
      block: 'Varanasi Central',
      address: 'Pindra Block, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 21000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 10500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7607' },
      { id: 'p2', date: '2024-08-10', amount: 7349999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8607' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Smart High School Science Labs (10 Rural Schools)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 21000000,
      peerMedian: 17850000,
      peerMean: 18480000,
      expectedRange: [15750000, 19950000],
      deviationPercentage: -1,
      peerPercentile: 17,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2005', targetName: 'Gyanodaya Tech Pvt Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2006',
    code: 'P-2006',
    title: 'Rural Maternity Clinic & Neonatal Oxygen Facility',
    category: 'Health',
    sector: 'Public Health',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 39000000,
    releasedAmount: 32000000,
    expenditure: 30800000,
    remainingBalance: 8200000,
    utilisationPercentage: 79.0,
    physicalProgressPercentage: 65,
    financialProgressPercentage: 79.0,
    progressMismatchGap: 14.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 52,
    futureRiskScore: 56,
    systemicRiskScore: 46,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 57,
      financial: 60,
      procurement: 32,
      execution: 54,
      delay: 56,
      contractor: 37,
      duplicate: 10,
      compliance: 58,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2006',
      name: 'Kashi Health Solutions',
      panNumber: 'ABCDP4737M',
      riskScore: 52,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2006',
      name: 'Chief Medical Officer',
      department: 'Public Health',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Sevapuri Model Block',
      block: 'Varanasi Central',
      address: 'Sevapuri Model Block, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 39000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 19500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4737' },
      { id: 'p2', date: '2024-08-10', amount: 13650000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5737' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Rural Maternity Clinic & Neonatal Oxygen Facility', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 39000000,
      peerMedian: 33150000,
      peerMean: 34320000,
      expectedRange: [29250000, 37050000],
      deviationPercentage: 7,
      peerPercentile: 57,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2006', targetName: 'Kashi Health Solutions', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2007',
    code: 'P-2007',
    title: 'Submersible Tubewell & Water Distribution Hubs',
    category: 'Water',
    sector: 'Drinking Water',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 26000000,
    releasedAmount: 22000000,
    expenditure: 21200000,
    remainingBalance: 4800000,
    utilisationPercentage: 81.5,
    physicalProgressPercentage: 78,
    financialProgressPercentage: 81.5,
    progressMismatchGap: 3.5,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 40,
    futureRiskScore: 44,
    systemicRiskScore: 34,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 45,
      financial: 48,
      procurement: 20,
      execution: 42,
      delay: 44,
      contractor: 25,
      duplicate: 10,
      compliance: 46,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2007',
      name: 'Varuna Jal Seva',
      panNumber: 'ABCDP2351M',
      riskScore: 40,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2007',
      name: 'Rural Water Supply UP',
      department: 'Drinking Water',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Arajiline Block',
      block: 'Varanasi Central',
      address: 'Arajiline Block, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 26000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 13000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2351' },
      { id: 'p2', date: '2024-08-10', amount: 9100000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3351' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Submersible Tubewell & Water Distribution Hubs', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 26000000,
      peerMedian: 22100000,
      peerMean: 22880000,
      expectedRange: [19500000, 24700000],
      deviationPercentage: 1,
      peerPercentile: 45,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2007', targetName: 'Varuna Jal Seva', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2008',
    code: 'P-2008',
    title: 'Varanasi Outer Ring Road Feeder Drain Works',
    category: 'Roads',
    sector: 'Connectivity',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 54000000,
    releasedAmount: 46000000,
    expenditure: 43900000,
    remainingBalance: 10100000,
    utilisationPercentage: 81.3,
    physicalProgressPercentage: 30,
    financialProgressPercentage: 81.3,
    progressMismatchGap: 51.3,
    status: 'HALTED',
    currentRiskScore: 92,
    futureRiskScore: 96,
    systemicRiskScore: 86,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 95,
      financial: 98,
      procurement: 72,
      execution: 94,
      delay: 90,
      contractor: 77,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-2008',
      name: 'Purvanchal Roadways',
      panNumber: 'ABCDP2964M',
      riskScore: 92,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-2008',
      name: 'UP PWD Division 1',
      department: 'Connectivity',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Babatpur Airport Feeder',
      block: 'Varanasi Central',
      address: 'Babatpur Airport Feeder, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 54000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 27000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2964' },
      { id: 'p2', date: '2024-08-10', amount: 18900000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3964' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Varanasi Outer Ring Road Feeder Drain Works', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 54000000,
      peerMedian: 45900000,
      peerMean: 47520000,
      expectedRange: [40500000, 51300000],
      deviationPercentage: 25,
      peerPercentile: 97,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2008', targetName: 'Purvanchal Roadways', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2009',
    code: 'P-2009',
    title: 'Community Skill Centre for Silk Handicrafts',
    category: 'Community',
    sector: 'Skill Development',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 18000000,
    releasedAmount: 18000000,
    expenditure: 17500000,
    remainingBalance: 500000,
    utilisationPercentage: 97.2,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.2,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 15,
    futureRiskScore: 19,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 20,
      financial: 23,
      procurement: 20,
      execution: 17,
      delay: 19,
      contractor: 25,
      duplicate: 10,
      compliance: 21,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2009',
      name: 'Shri Ram Handicrafts',
      panNumber: 'ABCDP1185M',
      riskScore: 15,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2009',
      name: 'DIC Varanasi',
      department: 'Skill Development',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kotwa Rural',
      block: 'Varanasi Central',
      address: 'Kotwa Rural, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 18000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1185' },
      { id: 'p2', date: '2024-08-10', amount: 6300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2185' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Community Skill Centre for Silk Handicrafts', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 18000000,
      peerMedian: 15300000,
      peerMean: 15840000,
      expectedRange: [13500000, 17100000],
      deviationPercentage: -1,
      peerPercentile: 20,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2009', targetName: 'Shri Ram Handicrafts', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2010',
    code: 'P-2010',
    title: 'Electric Crematorium Phase II Harishchandra Ghat',
    category: 'Community',
    sector: 'Urban Development',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 32000000,
    releasedAmount: 28000000,
    expenditure: 27100000,
    remainingBalance: 4900000,
    utilisationPercentage: 84.7,
    physicalProgressPercentage: 90,
    financialProgressPercentage: 84.7,
    progressMismatchGap: 0.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 28,
    futureRiskScore: 32,
    systemicRiskScore: 22,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 33,
      financial: 36,
      procurement: 20,
      execution: 30,
      delay: 32,
      contractor: 25,
      duplicate: 10,
      compliance: 34,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2010',
      name: 'Varanasi Nagar Nigam',
      panNumber: 'ABCDP4737M',
      riskScore: 28,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2010',
      name: 'Municipal Corp Varanasi',
      department: 'Urban Development',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Harishchandra Ghat',
      block: 'Varanasi Central',
      address: 'Harishchandra Ghat, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 32000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 16000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4737' },
      { id: 'p2', date: '2024-08-10', amount: 11200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5737' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Electric Crematorium Phase II Harishchandra Ghat', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 32000000,
      peerMedian: 27200000,
      peerMean: 28160000,
      expectedRange: [24000000, 30400000],
      deviationPercentage: -2,
      peerPercentile: 33,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2010', targetName: 'Varanasi Nagar Nigam', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2011',
    code: 'P-2011',
    title: 'Village Solar Mini-Grid for Agro Irrigation',
    category: 'Energy',
    sector: 'Renewable Energy',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 29000000,
    releasedAmount: 25000000,
    expenditure: 24000000,
    remainingBalance: 5000000,
    utilisationPercentage: 82.8,
    physicalProgressPercentage: 72,
    financialProgressPercentage: 82.8,
    progressMismatchGap: 10.8,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 44,
    futureRiskScore: 48,
    systemicRiskScore: 38,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 49,
      financial: 52,
      procurement: 24,
      execution: 46,
      delay: 48,
      contractor: 29,
      duplicate: 10,
      compliance: 50,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2011',
      name: 'Surya Urja Nigam',
      panNumber: 'ABCDP9294M',
      riskScore: 44,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2011',
      name: 'UPNEDA Varanasi',
      department: 'Renewable Energy',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Cholapur Block',
      block: 'Varanasi Central',
      address: 'Cholapur Block, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 29000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9294' },
      { id: 'p2', date: '2024-08-10', amount: 10150000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10294' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Village Solar Mini-Grid for Agro Irrigation', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 29000000,
      peerMedian: 24650000,
      peerMean: 25520000,
      expectedRange: [21750000, 27550000],
      deviationPercentage: 5,
      peerPercentile: 49,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2011', targetName: 'Surya Urja Nigam', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2012',
    code: 'P-2012',
    title: 'Primary Health Centre Emergency Trauma Wing',
    category: 'Health',
    sector: 'Health',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 45000000,
    releasedAmount: 38000000,
    expenditure: 36500000,
    remainingBalance: 8500000,
    utilisationPercentage: 81.1,
    physicalProgressPercentage: 50,
    financialProgressPercentage: 81.1,
    progressMismatchGap: 31.1,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 78,
    futureRiskScore: 82,
    systemicRiskScore: 72,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH'],
    riskFingerprint: {
      cost: 83,
      financial: 86,
      procurement: 58,
      execution: 80,
      delay: 82,
      contractor: 63,
      duplicate: 20,
      compliance: 84,
      historical: 30
    },
    contractor: {
      id: 'cont-P-2012',
      name: 'Dhanwantari Lifecare',
      panNumber: 'ABCDP9664M',
      riskScore: 78,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-2012',
      name: 'Health Directorate UP',
      department: 'Health',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Shivpur Ward',
      block: 'Varanasi Central',
      address: 'Shivpur Ward, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 45000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 22500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9664' },
      { id: 'p2', date: '2024-08-10', amount: 15749999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10664' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Primary Health Centre Emergency Trauma Wing', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 45000000,
      peerMedian: 38250000,
      peerMean: 39600000,
      expectedRange: [33750000, 42750000],
      deviationPercentage: 15,
      peerPercentile: 83,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2012', targetName: 'Dhanwantari Lifecare', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2013',
    code: 'P-2013',
    title: 'Ganga Promenade Solid Waste Management Kiosks',
    category: 'Sanitation',
    sector: 'Sanitation',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 14000000,
    releasedAmount: 14000000,
    expenditure: 13600000,
    remainingBalance: 400000,
    utilisationPercentage: 97.1,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.1,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 11,
    futureRiskScore: 15,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 16,
      financial: 19,
      procurement: 20,
      execution: 13,
      delay: 15,
      contractor: 25,
      duplicate: 10,
      compliance: 17,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2013',
      name: 'Swachh Kashi Waste Tech',
      panNumber: 'ABCDP1832M',
      riskScore: 11,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2013',
      name: 'Varanasi Smart City',
      department: 'Sanitation',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kashi Vishwanath Corridor',
      block: 'Varanasi Central',
      address: 'Kashi Vishwanath Corridor, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 14000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 7000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1832' },
      { id: 'p2', date: '2024-08-10', amount: 4900000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2832' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Ganga Promenade Solid Waste Management Kiosks', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 14000000,
      peerMedian: 11900000,
      peerMean: 12320000,
      expectedRange: [10500000, 13300000],
      deviationPercentage: -1,
      peerPercentile: 16,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2013', targetName: 'Swachh Kashi Waste Tech', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2014',
    code: 'P-2014',
    title: 'District Sports Stadium Floodlighting & Track',
    category: 'Sports',
    sector: 'Youth',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 41000000,
    releasedAmount: 34000000,
    expenditure: 32400000,
    remainingBalance: 8600000,
    utilisationPercentage: 79.0,
    physicalProgressPercentage: 60,
    financialProgressPercentage: 79.0,
    progressMismatchGap: 19.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 58,
    futureRiskScore: 62,
    systemicRiskScore: 52,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 63,
      financial: 66,
      procurement: 38,
      execution: 60,
      delay: 62,
      contractor: 43,
      duplicate: 10,
      compliance: 64,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2014',
      name: 'Sampurnanand Sports Corp',
      panNumber: 'ABCDP7325M',
      riskScore: 58,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2014',
      name: 'UP Sports Directorate',
      department: 'Youth',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Sigra Stadium',
      block: 'Varanasi Central',
      address: 'Sigra Stadium, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 41000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 20500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7325' },
      { id: 'p2', date: '2024-08-10', amount: 14350000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8325' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order District Sports Stadium Floodlighting & Track', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 41000000,
      peerMedian: 34850000,
      peerMean: 36080000,
      expectedRange: [30750000, 38950000],
      deviationPercentage: 9,
      peerPercentile: 63,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2014', targetName: 'Sampurnanand Sports Corp', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2015',
    code: 'P-2015',
    title: 'Bridge Approach Road Strengthening Sindhaura',
    category: 'Roads',
    sector: 'Rural Works',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 33000000,
    releasedAmount: 28000000,
    expenditure: 26800000,
    remainingBalance: 6200000,
    utilisationPercentage: 81.2,
    physicalProgressPercentage: 70,
    financialProgressPercentage: 81.2,
    progressMismatchGap: 11.2,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 46,
    futureRiskScore: 50,
    systemicRiskScore: 40,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 51,
      financial: 54,
      procurement: 26,
      execution: 48,
      delay: 50,
      contractor: 31,
      duplicate: 10,
      compliance: 52,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2015',
      name: 'Gomti Civil Infra',
      panNumber: 'ABCDP5554M',
      riskScore: 46,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2015',
      name: 'PWD Rural Varanasi',
      department: 'Rural Works',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Sindhaura Market',
      block: 'Varanasi Central',
      address: 'Sindhaura Market, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 33000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 16500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-5554' },
      { id: 'p2', date: '2024-08-10', amount: 11550000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-6554' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Bridge Approach Road Strengthening Sindhaura', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 33000000,
      peerMedian: 28050000,
      peerMean: 29040000,
      expectedRange: [24750000, 31350000],
      deviationPercentage: 5,
      peerPercentile: 51,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2015', targetName: 'Gomti Civil Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2016',
    code: 'P-2016',
    title: 'Panchayat Bhavan Digital Service Common Kiosks',
    category: 'Community',
    sector: 'e-Governance',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 17000000,
    releasedAmount: 17000000,
    expenditure: 16600000,
    remainingBalance: 400000,
    utilisationPercentage: 97.6,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.6,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 14,
    futureRiskScore: 18,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 19,
      financial: 22,
      procurement: 20,
      execution: 16,
      delay: 18,
      contractor: 25,
      duplicate: 10,
      compliance: 20,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2016',
      name: 'e-Gram Digital UP',
      panNumber: 'ABCDP2381M',
      riskScore: 14,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2016',
      name: 'Panchayati Raj Varanasi',
      department: 'e-Governance',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: '20 Gram Panchayats',
      block: 'Varanasi Central',
      address: '20 Gram Panchayats, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 17000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 8500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2381' },
      { id: 'p2', date: '2024-08-10', amount: 5950000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3381' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Panchayat Bhavan Digital Service Common Kiosks', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 17000000,
      peerMedian: 14450000,
      peerMean: 14960000,
      expectedRange: [12750000, 16150000],
      deviationPercentage: -1,
      peerPercentile: 19,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2016', targetName: 'e-Gram Digital UP', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2017',
    code: 'P-2017',
    title: 'Water Reservoir Tank Deepening & Recharge Wells',
    category: 'Water',
    sector: 'Conservation',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 22000000,
    releasedAmount: 18000000,
    expenditure: 17100000,
    remainingBalance: 4900000,
    utilisationPercentage: 77.7,
    physicalProgressPercentage: 85,
    financialProgressPercentage: 77.7,
    progressMismatchGap: 0.0,
    status: 'SANCTIONED',
    currentRiskScore: 22,
    futureRiskScore: 26,
    systemicRiskScore: 16,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 27,
      financial: 30,
      procurement: 20,
      execution: 24,
      delay: 26,
      contractor: 25,
      duplicate: 10,
      compliance: 28,
      historical: 15
    },
    contractor: {
      id: 'cont-P-2017',
      name: 'Bhumi Jal Samrakshan',
      panNumber: 'ABCDP7383M',
      riskScore: 22,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-2017',
      name: 'Minor Irrigation Varanasi',
      department: 'Conservation',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Harhua Block',
      block: 'Varanasi Central',
      address: 'Harhua Block, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 22000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 11000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7383' },
      { id: 'p2', date: '2024-08-10', amount: 7699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8383' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Water Reservoir Tank Deepening & Recharge Wells', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 22000000,
      peerMedian: 18700000,
      peerMean: 19360000,
      expectedRange: [16500000, 20900000],
      deviationPercentage: -3,
      peerPercentile: 27,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2017', targetName: 'Bhumi Jal Samrakshan', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-2018',
    code: 'P-2018',
    title: 'Divyangjan Skill & Rehabilitation Centre',
    category: 'Community',
    sector: 'Social Justice',
    mpName: 'Hon. Member LS-Varanasi',
    constituency: 'Varanasi Parliamentary Constituency',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    financialYear: '2024-2025',
    sanctionedAmount: 25000000,
    releasedAmount: 20000000,
    expenditure: 19200000,
    remainingBalance: 5800000,
    utilisationPercentage: 76.8,
    physicalProgressPercentage: 45,
    financialProgressPercentage: 76.8,
    progressMismatchGap: 31.8,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 65,
    futureRiskScore: 69,
    systemicRiskScore: 59,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH'],
    riskFingerprint: {
      cost: 70,
      financial: 73,
      procurement: 45,
      execution: 67,
      delay: 69,
      contractor: 50,
      duplicate: 10,
      compliance: 71,
      historical: 30
    },
    contractor: {
      id: 'cont-P-2018',
      name: 'Samarthya Welfare Trust',
      panNumber: 'ABCDP3472M',
      riskScore: 65,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-2018',
      name: 'Social Welfare UP',
      department: 'Social Justice',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Pandeypur',
      block: 'Varanasi Central',
      address: 'Pandeypur, Varanasi, Uttar Pradesh'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 25000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3472' },
      { id: 'p2', date: '2024-08-10', amount: 8750000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4472' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Divyangjan Skill & Rehabilitation Centre', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 25000000,
      peerMedian: 21250000,
      peerMean: 22000000,
      expectedRange: [18750000, 23750000],
      deviationPercentage: 15,
      peerPercentile: 70,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-2018', targetName: 'Samarthya Welfare Trust', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3001',
    code: 'P-3001',
    title: 'Orange Growers Cold Storage Facility Kalmeshwar',
    category: 'Community',
    sector: 'Agro Logistics',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 45000000,
    releasedAmount: 40000000,
    expenditure: 38500000,
    remainingBalance: 6500000,
    utilisationPercentage: 85.6,
    physicalProgressPercentage: 85,
    financialProgressPercentage: 85.6,
    progressMismatchGap: 0.6,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 32,
    futureRiskScore: 36,
    systemicRiskScore: 26,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 37,
      financial: 40,
      procurement: 20,
      execution: 34,
      delay: 36,
      contractor: 25,
      duplicate: 10,
      compliance: 38,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3001',
      name: 'Vidarbha Cold Chain Corp',
      panNumber: 'ABCDP2302M',
      riskScore: 32,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3001',
      name: 'MSAMB Nagpur',
      department: 'Agro Logistics',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kalmeshwar MIDC',
      block: 'Nagpur Central',
      address: 'Kalmeshwar MIDC, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 45000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 22500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2302' },
      { id: 'p2', date: '2024-08-10', amount: 15749999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3302' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Orange Growers Cold Storage Facility Kalmeshwar', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 45000000,
      peerMedian: 38250000,
      peerMean: 39600000,
      expectedRange: [33750000, 42750000],
      deviationPercentage: 0,
      peerPercentile: 37,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3001', targetName: 'Vidarbha Cold Chain Corp', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3002',
    code: 'P-3002',
    title: 'Cement Concrete Pavement Ward 11 to Ring Road',
    category: 'Roads',
    sector: 'Urban Works',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 38000000,
    releasedAmount: 38000000,
    expenditure: 37200000,
    remainingBalance: 800000,
    utilisationPercentage: 97.9,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.9,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 14,
    futureRiskScore: 18,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 19,
      financial: 22,
      procurement: 20,
      execution: 16,
      delay: 18,
      contractor: 25,
      duplicate: 10,
      compliance: 20,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3002',
      name: 'Nagpur Infra Projects',
      panNumber: 'ABCDP6581M',
      riskScore: 14,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3002',
      name: 'NMC Nagpur',
      department: 'Urban Works',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ward 11 Dharampeth',
      block: 'Nagpur Central',
      address: 'Ward 11 Dharampeth, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 38000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 19000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6581' },
      { id: 'p2', date: '2024-08-10', amount: 13300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7581' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Cement Concrete Pavement Ward 11 to Ring Road', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 38000000,
      peerMedian: 32300000,
      peerMean: 33440000,
      expectedRange: [28500000, 36100000],
      deviationPercentage: -1,
      peerPercentile: 19,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3002', targetName: 'Nagpur Infra Projects', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3003',
    code: 'P-3003',
    title: 'Mihan Feeder Drainage & Flood Mitigation Channel',
    category: 'Sanitation',
    sector: 'Urban Infra',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 52000000,
    releasedAmount: 44000000,
    expenditure: 42000000,
    remainingBalance: 10000000,
    utilisationPercentage: 80.8,
    physicalProgressPercentage: 40,
    financialProgressPercentage: 80.8,
    progressMismatchGap: 40.8,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 84,
    futureRiskScore: 88,
    systemicRiskScore: 78,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 89,
      financial: 92,
      procurement: 64,
      execution: 86,
      delay: 88,
      contractor: 69,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-3003',
      name: 'Central India Drainage LLP',
      panNumber: 'ABCDP4600M',
      riskScore: 84,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-3003',
      name: 'NIT Nagpur',
      department: 'Urban Infra',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'MIHAN Ward 36',
      block: 'Nagpur Central',
      address: 'MIHAN Ward 36, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 52000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 26000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4600' },
      { id: 'p2', date: '2024-08-10', amount: 18200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5600' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Mihan Feeder Drainage & Flood Mitigation Channel', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 52000000,
      peerMedian: 44200000,
      peerMean: 45760000,
      expectedRange: [39000000, 49400000],
      deviationPercentage: 20,
      peerPercentile: 89,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3003', targetName: 'Central India Drainage LLP', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3004',
    code: 'P-3004',
    title: 'Zilla Parishad Digital Smart Schools (8 Clusters)',
    category: 'Education',
    sector: 'Education',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 22000000,
    releasedAmount: 22000000,
    expenditure: 21400000,
    remainingBalance: 600000,
    utilisationPercentage: 97.3,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.3,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 12,
    futureRiskScore: 16,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 17,
      financial: 20,
      procurement: 20,
      execution: 14,
      delay: 16,
      contractor: 25,
      duplicate: 10,
      compliance: 18,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3004',
      name: 'Vidya Smart Classrooms',
      panNumber: 'ABCDP1962M',
      riskScore: 12,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3004',
      name: 'ZP Education Nagpur',
      department: 'Education',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Umred Block',
      block: 'Nagpur Central',
      address: 'Umred Block, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 22000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 11000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1962' },
      { id: 'p2', date: '2024-08-10', amount: 7699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2962' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Zilla Parishad Digital Smart Schools (8 Clusters)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 22000000,
      peerMedian: 18700000,
      peerMean: 19360000,
      expectedRange: [16500000, 20900000],
      deviationPercentage: -1,
      peerPercentile: 17,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3004', targetName: 'Vidya Smart Classrooms', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3005',
    code: 'P-3005',
    title: 'Nag River Cleanliness & Aeration Fountains',
    category: 'Water',
    sector: 'Environment',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 31000000,
    releasedAmount: 26000000,
    expenditure: 24800000,
    remainingBalance: 6200000,
    utilisationPercentage: 80.0,
    physicalProgressPercentage: 65,
    financialProgressPercentage: 80.0,
    progressMismatchGap: 15.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 58,
    futureRiskScore: 62,
    systemicRiskScore: 52,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 63,
      financial: 66,
      procurement: 38,
      execution: 60,
      delay: 62,
      contractor: 43,
      duplicate: 10,
      compliance: 64,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3005',
      name: 'Nag River Rejuvenation',
      panNumber: 'ABCDP6496M',
      riskScore: 58,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3005',
      name: 'NMC Environment Cell',
      department: 'Environment',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Sitabuldi Stretch',
      block: 'Nagpur Central',
      address: 'Sitabuldi Stretch, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 31000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 15500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6496' },
      { id: 'p2', date: '2024-08-10', amount: 10850000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7496' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Nag River Cleanliness & Aeration Fountains', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 31000000,
      peerMedian: 26350000,
      peerMean: 27280000,
      expectedRange: [23250000, 29450000],
      deviationPercentage: 7,
      peerPercentile: 63,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3005', targetName: 'Nag River Rejuvenation', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3006',
    code: 'P-3006',
    title: 'Public Cancer Diagnostic Ward Medical College',
    category: 'Health',
    sector: 'Health',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 48000000,
    releasedAmount: 42000000,
    expenditure: 40200000,
    remainingBalance: 7800000,
    utilisationPercentage: 83.8,
    physicalProgressPercentage: 78,
    financialProgressPercentage: 83.8,
    progressMismatchGap: 5.8,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 42,
    futureRiskScore: 46,
    systemicRiskScore: 36,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 47,
      financial: 50,
      procurement: 22,
      execution: 44,
      delay: 46,
      contractor: 27,
      duplicate: 10,
      compliance: 48,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3006',
      name: 'Rastrasant Tukadoji Medi',
      panNumber: 'ABCDP6716M',
      riskScore: 42,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3006',
      name: 'GMC Nagpur',
      department: 'Health',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Medical Square',
      block: 'Nagpur Central',
      address: 'Medical Square, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 48000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 24000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6716' },
      { id: 'p2', date: '2024-08-10', amount: 16800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7716' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Public Cancer Diagnostic Ward Medical College', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 48000000,
      peerMedian: 40800000,
      peerMean: 42240000,
      expectedRange: [36000000, 45600000],
      deviationPercentage: 2,
      peerPercentile: 47,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3006', targetName: 'Rastrasant Tukadoji Medi', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3007',
    code: 'P-3007',
    title: 'Solar Roof Panels on Government ITI Buildings',
    category: 'Energy',
    sector: 'Renewable',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 18000000,
    releasedAmount: 18000000,
    expenditure: 17600000,
    remainingBalance: 400000,
    utilisationPercentage: 97.8,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.8,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 10,
    futureRiskScore: 14,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 15,
      financial: 18,
      procurement: 20,
      execution: 12,
      delay: 14,
      contractor: 25,
      duplicate: 10,
      compliance: 16,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3007',
      name: 'Solar Vidarbha Ltd',
      panNumber: 'ABCDP3738M',
      riskScore: 10,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3007',
      name: 'MEDA Nagpur',
      department: 'Renewable',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'ITI Hingna',
      block: 'Nagpur Central',
      address: 'ITI Hingna, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 18000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3738' },
      { id: 'p2', date: '2024-08-10', amount: 6300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4738' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solar Roof Panels on Government ITI Buildings', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 18000000,
      peerMedian: 15300000,
      peerMean: 15840000,
      expectedRange: [13500000, 17100000],
      deviationPercentage: -1,
      peerPercentile: 15,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3007', targetName: 'Solar Vidarbha Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3008',
    code: 'P-3008',
    title: 'Rural Bus Shelters & Passenger Waiting Halls (20 Sites)',
    category: 'Community',
    sector: 'Transport',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 16000000,
    releasedAmount: 16000000,
    expenditure: 15500000,
    remainingBalance: 500000,
    utilisationPercentage: 96.9,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 96.9,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 15,
    futureRiskScore: 19,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 20,
      financial: 23,
      procurement: 20,
      execution: 17,
      delay: 19,
      contractor: 25,
      duplicate: 10,
      compliance: 21,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3008',
      name: 'MSRTC Civil Division',
      panNumber: 'ABCDP2893M',
      riskScore: 15,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3008',
      name: 'MSRTC Nagpur',
      department: 'Transport',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Katol & Saoner',
      block: 'Nagpur Central',
      address: 'Katol & Saoner, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 16000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 8000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2893' },
      { id: 'p2', date: '2024-08-10', amount: 5600000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3893' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Rural Bus Shelters & Passenger Waiting Halls (20 Sites)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 16000000,
      peerMedian: 13600000,
      peerMean: 14080000,
      expectedRange: [12000000, 15200000],
      deviationPercentage: -1,
      peerPercentile: 20,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3008', targetName: 'MSRTC Civil Division', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3009',
    code: 'P-3009',
    title: 'District Library & Digital Competitive Exam Hub',
    category: 'Education',
    sector: 'Youth Affairs',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 29000000,
    releasedAmount: 24000000,
    expenditure: 23100000,
    remainingBalance: 5900000,
    utilisationPercentage: 79.7,
    physicalProgressPercentage: 70,
    financialProgressPercentage: 79.7,
    progressMismatchGap: 9.7,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 38,
    futureRiskScore: 42,
    systemicRiskScore: 32,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 43,
      financial: 46,
      procurement: 20,
      execution: 40,
      delay: 42,
      contractor: 25,
      duplicate: 10,
      compliance: 44,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3009',
      name: 'Prerna Knowledge Hub',
      panNumber: 'ABCDP3463M',
      riskScore: 38,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3009',
      name: 'Higher Education Dept',
      department: 'Youth Affairs',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Civil Lines',
      block: 'Nagpur Central',
      address: 'Civil Lines, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 29000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3463' },
      { id: 'p2', date: '2024-08-10', amount: 10150000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4463' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order District Library & Digital Competitive Exam Hub', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 29000000,
      peerMedian: 24650000,
      peerMean: 25520000,
      expectedRange: [21750000, 27550000],
      deviationPercentage: 4,
      peerPercentile: 43,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3009', targetName: 'Prerna Knowledge Hub', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3010',
    code: 'P-3010',
    title: 'Solid Waste Pelletization Plant Hingna MIDC',
    category: 'Sanitation',
    sector: 'Sanitation',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 36000000,
    releasedAmount: 30000000,
    expenditure: 28400000,
    remainingBalance: 7600000,
    utilisationPercentage: 78.9,
    physicalProgressPercentage: 30,
    financialProgressPercentage: 78.9,
    progressMismatchGap: 48.9,
    status: 'HALTED',
    currentRiskScore: 88,
    futureRiskScore: 92,
    systemicRiskScore: 82,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 93,
      financial: 96,
      procurement: 68,
      execution: 90,
      delay: 90,
      contractor: 73,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-3010',
      name: 'Vidarbha Waste Energy',
      panNumber: 'ABCDP6102M',
      riskScore: 88,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-3010',
      name: 'MIDC Nagpur',
      department: 'Sanitation',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Hingna MIDC Phase 2',
      block: 'Nagpur Central',
      address: 'Hingna MIDC Phase 2, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 36000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 18000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6102' },
      { id: 'p2', date: '2024-08-10', amount: 12600000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7102' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solid Waste Pelletization Plant Hingna MIDC', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 36000000,
      peerMedian: 30600000,
      peerMean: 31680000,
      expectedRange: [27000000, 34200000],
      deviationPercentage: 24,
      peerPercentile: 93,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3010', targetName: 'Vidarbha Waste Energy', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3011',
    code: 'P-3011',
    title: 'Integrated Animal Care & Veterinary Clinic',
    category: 'Health',
    sector: 'Veterinary',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 19000000,
    releasedAmount: 16000000,
    expenditure: 15100000,
    remainingBalance: 3900000,
    utilisationPercentage: 79.5,
    physicalProgressPercentage: 80,
    financialProgressPercentage: 79.5,
    progressMismatchGap: 0.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 25,
    futureRiskScore: 29,
    systemicRiskScore: 19,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 30,
      financial: 33,
      procurement: 20,
      execution: 27,
      delay: 29,
      contractor: 25,
      duplicate: 10,
      compliance: 31,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3011',
      name: 'Kamdhenu Seva Trust',
      panNumber: 'ABCDP6104M',
      riskScore: 25,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3011',
      name: 'Animal Husbandry ZP',
      department: 'Veterinary',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kamptee Road',
      block: 'Nagpur Central',
      address: 'Kamptee Road, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 19000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6104' },
      { id: 'p2', date: '2024-08-10', amount: 6650000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7104' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Integrated Animal Care & Veterinary Clinic', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 19000000,
      peerMedian: 16150000,
      peerMean: 16720000,
      expectedRange: [14250000, 18050000],
      deviationPercentage: 0,
      peerPercentile: 30,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3011', targetName: 'Kamdhenu Seva Trust', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-3012',
    code: 'P-3012',
    title: 'Community Hall for Backward Classes Kamptee',
    category: 'Community',
    sector: 'Social Welfare',
    mpName: 'Hon. Member LS-Nagpur',
    constituency: 'Nagpur Parliamentary Constituency',
    district: 'Nagpur',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 28000000,
    releasedAmount: 24000000,
    expenditure: 22800000,
    remainingBalance: 5200000,
    utilisationPercentage: 81.4,
    physicalProgressPercentage: 90,
    financialProgressPercentage: 81.4,
    progressMismatchGap: 0.0,
    status: 'SANCTIONED',
    currentRiskScore: 20,
    futureRiskScore: 24,
    systemicRiskScore: 14,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 25,
      financial: 28,
      procurement: 20,
      execution: 22,
      delay: 24,
      contractor: 25,
      duplicate: 10,
      compliance: 26,
      historical: 15
    },
    contractor: {
      id: 'cont-P-3012',
      name: 'Dr Ambedkar Smruti Trust',
      panNumber: 'ABCDP7437M',
      riskScore: 20,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-3012',
      name: 'Social Justice Dept',
      department: 'Social Welfare',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kamptee Town',
      block: 'Nagpur Central',
      address: 'Kamptee Town, Nagpur, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 28000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7437' },
      { id: 'p2', date: '2024-08-10', amount: 9800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8437' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Community Hall for Backward Classes Kamptee', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 28000000,
      peerMedian: 23800000,
      peerMean: 24640000,
      expectedRange: [21000000, 26600000],
      deviationPercentage: -4,
      peerPercentile: 25,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-3012', targetName: 'Dr Ambedkar Smruti Trust', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4001',
    code: 'P-4001',
    title: 'Creek Front Promenade & Mangrove Eco-Protection Wall',
    category: 'Water',
    sector: 'Urban Infra',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 48000000,
    releasedAmount: 40000000,
    expenditure: 38000000,
    remainingBalance: 10000000,
    utilisationPercentage: 79.2,
    physicalProgressPercentage: 50,
    financialProgressPercentage: 79.2,
    progressMismatchGap: 29.2,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 74,
    futureRiskScore: 78,
    systemicRiskScore: 68,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH'],
    riskFingerprint: {
      cost: 79,
      financial: 82,
      procurement: 54,
      execution: 76,
      delay: 78,
      contractor: 59,
      duplicate: 20,
      compliance: 80,
      historical: 30
    },
    contractor: {
      id: 'cont-P-4001',
      name: 'Kokan Coastal Infra',
      panNumber: 'ABCDP8624M',
      riskScore: 74,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-4001',
      name: 'TMC Thane',
      department: 'Urban Infra',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kalwa Creek',
      block: 'Thane Central',
      address: 'Kalwa Creek, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 48000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 24000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8624' },
      { id: 'p2', date: '2024-08-10', amount: 16800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9624' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Creek Front Promenade & Mangrove Eco-Protection Wall', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 48000000,
      peerMedian: 40800000,
      peerMean: 42240000,
      expectedRange: [36000000, 45600000],
      deviationPercentage: 14,
      peerPercentile: 79,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4001', targetName: 'Kokan Coastal Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4002',
    code: 'P-4002',
    title: 'Municipal Hospital Maternity OT Modernization',
    category: 'Health',
    sector: 'Public Health',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 36000000,
    releasedAmount: 36000000,
    expenditure: 35100000,
    remainingBalance: 900000,
    utilisationPercentage: 97.5,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.5,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 14,
    futureRiskScore: 18,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 19,
      financial: 22,
      procurement: 20,
      execution: 16,
      delay: 18,
      contractor: 25,
      duplicate: 10,
      compliance: 20,
      historical: 15
    },
    contractor: {
      id: 'cont-P-4002',
      name: 'Chhatrapati Shivaji Medi',
      panNumber: 'ABCDP4255M',
      riskScore: 14,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-4002',
      name: 'TMC Health Dept',
      department: 'Public Health',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kalwa Hospital',
      block: 'Thane Central',
      address: 'Kalwa Hospital, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 36000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 18000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4255' },
      { id: 'p2', date: '2024-08-10', amount: 12600000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5255' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Municipal Hospital Maternity OT Modernization', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 36000000,
      peerMedian: 30600000,
      peerMean: 31680000,
      expectedRange: [27000000, 34200000],
      deviationPercentage: -1,
      peerPercentile: 19,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4002', targetName: 'Chhatrapati Shivaji Medi', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4003',
    code: 'P-4003',
    title: 'Concrete Road Strengthening Mira-Bhayandar Link',
    category: 'Roads',
    sector: 'Connectivity',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 52000000,
    releasedAmount: 42000000,
    expenditure: 39800000,
    remainingBalance: 12200000,
    utilisationPercentage: 76.5,
    physicalProgressPercentage: 35,
    financialProgressPercentage: 76.5,
    progressMismatchGap: 41.5,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 86,
    futureRiskScore: 90,
    systemicRiskScore: 80,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 91,
      financial: 94,
      procurement: 66,
      execution: 88,
      delay: 90,
      contractor: 71,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-4003',
      name: 'MMRDA Coastal Roadways',
      panNumber: 'ABCDP6454M',
      riskScore: 86,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-4003',
      name: 'MBMC PWD',
      department: 'Connectivity',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Mira Road Ward 8',
      block: 'Thane Central',
      address: 'Mira Road Ward 8, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 52000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 26000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6454' },
      { id: 'p2', date: '2024-08-10', amount: 18200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7454' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Concrete Road Strengthening Mira-Bhayandar Link', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 52000000,
      peerMedian: 44200000,
      peerMean: 45760000,
      expectedRange: [39000000, 49400000],
      deviationPercentage: 20,
      peerPercentile: 91,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4003', targetName: 'MMRDA Coastal Roadways', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4004',
    code: 'P-4004',
    title: 'Solar Powered Street Lights Ghodbunder Stretch',
    category: 'Energy',
    sector: 'Renewable',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 24000000,
    releasedAmount: 24000000,
    expenditure: 23400000,
    remainingBalance: 600000,
    utilisationPercentage: 97.5,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.5,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 11,
    futureRiskScore: 15,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 16,
      financial: 19,
      procurement: 20,
      execution: 13,
      delay: 15,
      contractor: 25,
      duplicate: 10,
      compliance: 17,
      historical: 15
    },
    contractor: {
      id: 'cont-P-4004',
      name: 'Thane Green Solar',
      panNumber: 'ABCDP5436M',
      riskScore: 11,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-4004',
      name: 'TMC Electrical Dept',
      department: 'Renewable',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ghodbunder Road',
      block: 'Thane Central',
      address: 'Ghodbunder Road, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 24000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-5436' },
      { id: 'p2', date: '2024-08-10', amount: 8400000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-6436' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solar Powered Street Lights Ghodbunder Stretch', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 24000000,
      peerMedian: 20400000,
      peerMean: 21120000,
      expectedRange: [18000000, 22800000],
      deviationPercentage: -1,
      peerPercentile: 16,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4004', targetName: 'Thane Green Solar', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4005',
    code: 'P-4005',
    title: 'Drinking Water Pipe Network Expansion Diva Sector 4',
    category: 'Water',
    sector: 'Water Supply',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 39000000,
    releasedAmount: 32000000,
    expenditure: 30500000,
    remainingBalance: 8500000,
    utilisationPercentage: 78.2,
    physicalProgressPercentage: 60,
    financialProgressPercentage: 78.2,
    progressMismatchGap: 18.2,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 62,
    futureRiskScore: 66,
    systemicRiskScore: 56,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 67,
      financial: 70,
      procurement: 42,
      execution: 64,
      delay: 66,
      contractor: 47,
      duplicate: 10,
      compliance: 68,
      historical: 30
    },
    contractor: {
      id: 'cont-P-4005',
      name: 'Ulhas Water Supply Ltd',
      panNumber: 'ABCDP8874M',
      riskScore: 62,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-4005',
      name: 'MIDC Water Works',
      department: 'Water Supply',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Diva East',
      block: 'Thane Central',
      address: 'Diva East, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 39000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 19500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8874' },
      { id: 'p2', date: '2024-08-10', amount: 13650000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9874' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Drinking Water Pipe Network Expansion Diva Sector 4', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 39000000,
      peerMedian: 33150000,
      peerMean: 34320000,
      expectedRange: [29250000, 37050000],
      deviationPercentage: 9,
      peerPercentile: 67,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4005', targetName: 'Ulhas Water Supply Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4006',
    code: 'P-4006',
    title: 'Multi-Skill ITI Training Labs Wagle Estate',
    category: 'Education',
    sector: 'Skill',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 28000000,
    releasedAmount: 28000000,
    expenditure: 27200000,
    remainingBalance: 800000,
    utilisationPercentage: 97.1,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.1,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 15,
    futureRiskScore: 19,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 20,
      financial: 23,
      procurement: 20,
      execution: 17,
      delay: 19,
      contractor: 25,
      duplicate: 10,
      compliance: 21,
      historical: 15
    },
    contractor: {
      id: 'cont-P-4006',
      name: 'Thane ITI Skills',
      panNumber: 'ABCDP6068M',
      riskScore: 15,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-4006',
      name: 'DVET Maharashtra',
      department: 'Skill',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Wagle Estate',
      block: 'Thane Central',
      address: 'Wagle Estate, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 28000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6068' },
      { id: 'p2', date: '2024-08-10', amount: 9800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7068' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Multi-Skill ITI Training Labs Wagle Estate', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 28000000,
      peerMedian: 23800000,
      peerMean: 24640000,
      expectedRange: [21000000, 26600000],
      deviationPercentage: -1,
      peerPercentile: 20,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4006', targetName: 'Thane ITI Skills', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4007',
    code: 'P-4007',
    title: 'Tribal Ashrams School Building Shahapur Block',
    category: 'Education',
    sector: 'Tribal Welfare',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 32000000,
    releasedAmount: 26000000,
    expenditure: 24800000,
    remainingBalance: 7200000,
    utilisationPercentage: 77.5,
    physicalProgressPercentage: 40,
    financialProgressPercentage: 77.5,
    progressMismatchGap: 37.5,
    status: 'HALTED',
    currentRiskScore: 89,
    futureRiskScore: 93,
    systemicRiskScore: 83,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 94,
      financial: 97,
      procurement: 69,
      execution: 91,
      delay: 90,
      contractor: 74,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-4007',
      name: 'Sahyadri Tribal Builders',
      panNumber: 'ABCDP5661M',
      riskScore: 89,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-4007',
      name: 'Tribal Dept Thane',
      department: 'Tribal Welfare',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Shahapur Rural',
      block: 'Thane Central',
      address: 'Shahapur Rural, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 32000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 16000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-5661' },
      { id: 'p2', date: '2024-08-10', amount: 11200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-6661' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Tribal Ashrams School Building Shahapur Block', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 32000000,
      peerMedian: 27200000,
      peerMean: 28160000,
      expectedRange: [24000000, 30400000],
      deviationPercentage: 18,
      peerPercentile: 94,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4007', targetName: 'Sahyadri Tribal Builders', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4008',
    code: 'P-4008',
    title: 'Public Gymnasium & Badminton Court Mumbra',
    category: 'Sports',
    sector: 'Youth',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 21000000,
    releasedAmount: 18000000,
    expenditure: 17100000,
    remainingBalance: 3900000,
    utilisationPercentage: 81.4,
    physicalProgressPercentage: 80,
    financialProgressPercentage: 81.4,
    progressMismatchGap: 1.4,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 35,
    futureRiskScore: 39,
    systemicRiskScore: 29,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 40,
      financial: 43,
      procurement: 20,
      execution: 37,
      delay: 39,
      contractor: 25,
      duplicate: 10,
      compliance: 41,
      historical: 15
    },
    contractor: {
      id: 'cont-P-4008',
      name: 'Thane Sports Council',
      panNumber: 'ABCDP9370M',
      riskScore: 35,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-4008',
      name: 'TMC Sports Dept',
      department: 'Youth',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Mumbra Ward 14',
      block: 'Thane Central',
      address: 'Mumbra Ward 14, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 21000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 10500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9370' },
      { id: 'p2', date: '2024-08-10', amount: 7349999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10370' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Public Gymnasium & Badminton Court Mumbra', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 21000000,
      peerMedian: 17850000,
      peerMean: 18480000,
      expectedRange: [15750000, 19950000],
      deviationPercentage: 0,
      peerPercentile: 40,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4008', targetName: 'Thane Sports Council', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4009',
    code: 'P-4009',
    title: 'Solid Waste Transfer Station & Compactor Units',
    category: 'Sanitation',
    sector: 'Urban Sanitation',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 26000000,
    releasedAmount: 22000000,
    expenditure: 20800000,
    remainingBalance: 5200000,
    utilisationPercentage: 80.0,
    physicalProgressPercentage: 75,
    financialProgressPercentage: 80.0,
    progressMismatchGap: 5.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 42,
    futureRiskScore: 46,
    systemicRiskScore: 36,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 47,
      financial: 50,
      procurement: 22,
      execution: 44,
      delay: 46,
      contractor: 27,
      duplicate: 10,
      compliance: 48,
      historical: 15
    },
    contractor: {
      id: 'cont-P-4009',
      name: 'Kokan Eco Solutions',
      panNumber: 'ABCDP1852M',
      riskScore: 42,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-4009',
      name: 'TMC Sanitation',
      department: 'Urban Sanitation',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Balkum Ward 4',
      block: 'Thane Central',
      address: 'Balkum Ward 4, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 26000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 13000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1852' },
      { id: 'p2', date: '2024-08-10', amount: 9100000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2852' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solid Waste Transfer Station & Compactor Units', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 26000000,
      peerMedian: 22100000,
      peerMean: 22880000,
      expectedRange: [19500000, 24700000],
      deviationPercentage: 2,
      peerPercentile: 47,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4009', targetName: 'Kokan Eco Solutions', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-4010',
    code: 'P-4010',
    title: 'Senior Citizen Recreation Hall & Wellness Hub',
    category: 'Community',
    sector: 'Social',
    mpName: 'Hon. Member LS-Thane',
    constituency: 'Thane Parliamentary Constituency',
    district: 'Thane',
    state: 'Maharashtra',
    financialYear: '2024-2025',
    sanctionedAmount: 18000000,
    releasedAmount: 15000000,
    expenditure: 14200000,
    remainingBalance: 3800000,
    utilisationPercentage: 78.9,
    physicalProgressPercentage: 88,
    financialProgressPercentage: 78.9,
    progressMismatchGap: 0.0,
    status: 'SANCTIONED',
    currentRiskScore: 22,
    futureRiskScore: 26,
    systemicRiskScore: 16,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 27,
      financial: 30,
      procurement: 20,
      execution: 24,
      delay: 26,
      contractor: 25,
      duplicate: 10,
      compliance: 28,
      historical: 15
    },
    contractor: {
      id: 'cont-P-4010',
      name: 'Shree Ganesh Infracon',
      panNumber: 'ABCDP3835M',
      riskScore: 22,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-4010',
      name: 'Social Welfare Thane',
      department: 'Social',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Naupada Ward 2',
      block: 'Thane Central',
      address: 'Naupada Ward 2, Thane, Maharashtra'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 18000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3835' },
      { id: 'p2', date: '2024-08-10', amount: 6300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4835' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Senior Citizen Recreation Hall & Wellness Hub', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 18000000,
      peerMedian: 15300000,
      peerMean: 15840000,
      expectedRange: [13500000, 17100000],
      deviationPercentage: -4,
      peerPercentile: 27,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-4010', targetName: 'Shree Ganesh Infracon', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5001',
    code: 'P-5001',
    title: 'Paved Concrete Road & Drainage Link connecting 6 Gram Panchayats',
    category: 'Roads',
    sector: 'Rural Works',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 21000000,
    releasedAmount: 18000000,
    expenditure: 18000000,
    remainingBalance: 3000000,
    utilisationPercentage: 85.7,
    physicalProgressPercentage: 25,
    financialProgressPercentage: 85.7,
    progressMismatchGap: 60.7,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 92,
    futureRiskScore: 96,
    systemicRiskScore: 86,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 95,
      financial: 98,
      procurement: 72,
      execution: 94,
      delay: 90,
      contractor: 77,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-5001',
      name: 'Ganga Valley Infra',
      panNumber: 'ABCDP8918M',
      riskScore: 92,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-5001',
      name: 'RWD Bihar',
      department: 'Rural Works',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Danapur Block',
      block: 'Patna Central',
      address: 'Danapur Block, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 21000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 10500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8918' },
      { id: 'p2', date: '2024-08-10', amount: 7349999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9918' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Paved Concrete Road & Drainage Link connecting 6 Gram Panchayats', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 21000000,
      peerMedian: 17850000,
      peerMean: 18480000,
      expectedRange: [15750000, 19950000],
      deviationPercentage: 30,
      peerPercentile: 97,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5001', targetName: 'Ganga Valley Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5002',
    code: 'P-5002',
    title: 'Community High School Science Labs Danapur Block',
    category: 'Education',
    sector: 'Education',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 28000000,
    releasedAmount: 28000000,
    expenditure: 27400000,
    remainingBalance: 600000,
    utilisationPercentage: 97.9,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.9,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 14,
    futureRiskScore: 18,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 19,
      financial: 22,
      procurement: 20,
      execution: 16,
      delay: 18,
      contractor: 25,
      duplicate: 10,
      compliance: 20,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5002',
      name: 'Magadh Edutech Ltd',
      panNumber: 'ABCDP2970M',
      riskScore: 14,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5002',
      name: 'BSEIDC Patna',
      department: 'Education',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Danapur Cantt',
      block: 'Patna Central',
      address: 'Danapur Cantt, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 28000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2970' },
      { id: 'p2', date: '2024-08-10', amount: 9800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3970' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Community High School Science Labs Danapur Block', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 28000000,
      peerMedian: 23800000,
      peerMean: 24640000,
      expectedRange: [21000000, 26600000],
      deviationPercentage: -1,
      peerPercentile: 19,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5002', targetName: 'Magadh Edutech Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5003',
    code: 'P-5003',
    title: 'Drinking Water Arsenic Filtration Hubs (12 Sites)',
    category: 'Water',
    sector: 'Health & Water',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 38000000,
    releasedAmount: 32000000,
    expenditure: 30800000,
    remainingBalance: 7200000,
    utilisationPercentage: 81.1,
    physicalProgressPercentage: 40,
    financialProgressPercentage: 81.1,
    progressMismatchGap: 41.1,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 84,
    futureRiskScore: 88,
    systemicRiskScore: 78,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 89,
      financial: 92,
      procurement: 64,
      execution: 86,
      delay: 88,
      contractor: 69,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-5003',
      name: 'Patliputra Water Care',
      panNumber: 'ABCDP6061M',
      riskScore: 84,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-5003',
      name: 'PHED Bihar Patna',
      department: 'Health & Water',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Maner & Bihta',
      block: 'Patna Central',
      address: 'Maner & Bihta, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 38000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 19000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6061' },
      { id: 'p2', date: '2024-08-10', amount: 13300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7061' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Drinking Water Arsenic Filtration Hubs (12 Sites)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 38000000,
      peerMedian: 32300000,
      peerMean: 33440000,
      expectedRange: [28500000, 36100000],
      deviationPercentage: 20,
      peerPercentile: 89,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5003', targetName: 'Patliputra Water Care', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5004',
    code: 'P-5004',
    title: 'Ganga Ghat Paving & Passenger Amenities',
    category: 'Community',
    sector: 'Heritage',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 32000000,
    releasedAmount: 32000000,
    expenditure: 31200000,
    remainingBalance: 800000,
    utilisationPercentage: 97.5,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.5,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 12,
    futureRiskScore: 16,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 17,
      financial: 20,
      procurement: 20,
      execution: 14,
      delay: 16,
      contractor: 25,
      duplicate: 10,
      compliance: 18,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5004',
      name: 'Bihar Urban Infra BUIDCO',
      panNumber: 'ABCDP6750M',
      riskScore: 12,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5004',
      name: 'PMC Patna',
      department: 'Heritage',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Collectorate Ghat',
      block: 'Patna Central',
      address: 'Collectorate Ghat, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 32000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 16000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6750' },
      { id: 'p2', date: '2024-08-10', amount: 11200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7750' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Ganga Ghat Paving & Passenger Amenities', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 32000000,
      peerMedian: 27200000,
      peerMean: 28160000,
      expectedRange: [24000000, 30400000],
      deviationPercentage: -1,
      peerPercentile: 17,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5004', targetName: 'Bihar Urban Infra BUIDCO', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5005',
    code: 'P-5005',
    title: 'Primary Health Centre Cold Storage for Vaccines',
    category: 'Health',
    sector: 'Public Health',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 24000000,
    releasedAmount: 20000000,
    expenditure: 19200000,
    remainingBalance: 4800000,
    utilisationPercentage: 80.0,
    physicalProgressPercentage: 70,
    financialProgressPercentage: 80.0,
    progressMismatchGap: 10.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 48,
    futureRiskScore: 52,
    systemicRiskScore: 42,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 53,
      financial: 56,
      procurement: 28,
      execution: 50,
      delay: 52,
      contractor: 33,
      duplicate: 10,
      compliance: 54,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5005',
      name: 'Meditech Bihar Care',
      panNumber: 'ABCDP8694M',
      riskScore: 48,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5005',
      name: 'State Health Society',
      department: 'Public Health',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Phulwari Sharif',
      block: 'Patna Central',
      address: 'Phulwari Sharif, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 24000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8694' },
      { id: 'p2', date: '2024-08-10', amount: 8400000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9694' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Primary Health Centre Cold Storage for Vaccines', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 24000000,
      peerMedian: 20400000,
      peerMean: 21120000,
      expectedRange: [18000000, 22800000],
      deviationPercentage: 5,
      peerPercentile: 53,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5005', targetName: 'Meditech Bihar Care', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5006',
    code: 'P-5006',
    title: 'Solar Street Light Installation Fatuha Block',
    category: 'Energy',
    sector: 'Renewable',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 19000000,
    releasedAmount: 19000000,
    expenditure: 18500000,
    remainingBalance: 500000,
    utilisationPercentage: 97.4,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.4,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 15,
    futureRiskScore: 19,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 20,
      financial: 23,
      procurement: 20,
      execution: 17,
      delay: 19,
      contractor: 25,
      duplicate: 10,
      compliance: 21,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5006',
      name: 'BREDA Solar Patna',
      panNumber: 'ABCDP4595M',
      riskScore: 15,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5006',
      name: 'BREDA Bihar',
      department: 'Renewable',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Fatuha Rural',
      block: 'Patna Central',
      address: 'Fatuha Rural, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 19000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4595' },
      { id: 'p2', date: '2024-08-10', amount: 6650000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5595' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solar Street Light Installation Fatuha Block', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 19000000,
      peerMedian: 16150000,
      peerMean: 16720000,
      expectedRange: [14250000, 18050000],
      deviationPercentage: -1,
      peerPercentile: 20,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5006', targetName: 'BREDA Solar Patna', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5007',
    code: 'P-5007',
    title: 'Rural Grain Storage Godown Bakhtiyarpur',
    category: 'Community',
    sector: 'Agro Infra',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 44000000,
    releasedAmount: 36000000,
    expenditure: 34200000,
    remainingBalance: 9800000,
    utilisationPercentage: 77.7,
    physicalProgressPercentage: 30,
    financialProgressPercentage: 77.7,
    progressMismatchGap: 47.7,
    status: 'HALTED',
    currentRiskScore: 88,
    futureRiskScore: 92,
    systemicRiskScore: 82,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 93,
      financial: 96,
      procurement: 68,
      execution: 90,
      delay: 90,
      contractor: 73,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-5007',
      name: 'Kisan Storage Syndicate',
      panNumber: 'ABCDP8817M',
      riskScore: 88,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-5007',
      name: 'Bihar State Warehousing',
      department: 'Agro Infra',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Bakhtiyarpur',
      block: 'Patna Central',
      address: 'Bakhtiyarpur, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 44000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 22000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8817' },
      { id: 'p2', date: '2024-08-10', amount: 15399999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9817' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Rural Grain Storage Godown Bakhtiyarpur', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 44000000,
      peerMedian: 37400000,
      peerMean: 38720000,
      expectedRange: [33000000, 41800000],
      deviationPercentage: 23,
      peerPercentile: 93,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5007', targetName: 'Kisan Storage Syndicate', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5008',
    code: 'P-5008',
    title: 'Women Self-Help Group Production Centre',
    category: 'Community',
    sector: 'Livelihood',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 22000000,
    releasedAmount: 18000000,
    expenditure: 17100000,
    remainingBalance: 4900000,
    utilisationPercentage: 77.7,
    physicalProgressPercentage: 80,
    financialProgressPercentage: 77.7,
    progressMismatchGap: 0.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 35,
    futureRiskScore: 39,
    systemicRiskScore: 29,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 40,
      financial: 43,
      procurement: 20,
      execution: 37,
      delay: 39,
      contractor: 25,
      duplicate: 10,
      compliance: 41,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5008',
      name: 'Jeevika Bihar Works',
      panNumber: 'ABCDP1142M',
      riskScore: 35,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5008',
      name: 'BRLPS Jeevika',
      department: 'Livelihood',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Masaurhi Block',
      block: 'Patna Central',
      address: 'Masaurhi Block, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 22000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 11000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1142' },
      { id: 'p2', date: '2024-08-10', amount: 7699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2142' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Women Self-Help Group Production Centre', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 22000000,
      peerMedian: 18700000,
      peerMean: 19360000,
      expectedRange: [16500000, 20900000],
      deviationPercentage: -1,
      peerPercentile: 40,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5008', targetName: 'Jeevika Bihar Works', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5009',
    code: 'P-5009',
    title: 'Culvert Bridge on Punpun River Tributary',
    category: 'Roads',
    sector: 'Rural Works',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 35000000,
    releasedAmount: 29000000,
    expenditure: 27500000,
    remainingBalance: 7500000,
    utilisationPercentage: 78.6,
    physicalProgressPercentage: 65,
    financialProgressPercentage: 78.6,
    progressMismatchGap: 13.6,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 56,
    futureRiskScore: 60,
    systemicRiskScore: 50,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 61,
      financial: 64,
      procurement: 36,
      execution: 58,
      delay: 60,
      contractor: 41,
      duplicate: 10,
      compliance: 62,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5009',
      name: 'Ganga Pul Nirman',
      panNumber: 'ABCDP8571M',
      riskScore: 56,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5009',
      name: 'RWD Works Patna',
      department: 'Rural Works',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Punpun River Link',
      block: 'Patna Central',
      address: 'Punpun River Link, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 35000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 17500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8571' },
      { id: 'p2', date: '2024-08-10', amount: 12250000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9571' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Culvert Bridge on Punpun River Tributary', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 35000000,
      peerMedian: 29750000,
      peerMean: 30800000,
      expectedRange: [26250000, 33250000],
      deviationPercentage: 6,
      peerPercentile: 61,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5009', targetName: 'Ganga Pul Nirman', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5010',
    code: 'P-5010',
    title: 'Anganwadi Nutrition Centres Smart Upgrades (10 Units)',
    category: 'Education',
    sector: 'Child Welfare',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 16000000,
    releasedAmount: 16000000,
    expenditure: 15600000,
    remainingBalance: 400000,
    utilisationPercentage: 97.5,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.5,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 10,
    futureRiskScore: 14,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 15,
      financial: 18,
      procurement: 20,
      execution: 12,
      delay: 14,
      contractor: 25,
      duplicate: 10,
      compliance: 16,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5010',
      name: 'Bal Vikas Supplies',
      panNumber: 'ABCDP4808M',
      riskScore: 10,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5010',
      name: 'ICDS Patna',
      department: 'Child Welfare',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Sampatchak Block',
      block: 'Patna Central',
      address: 'Sampatchak Block, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 16000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 8000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4808' },
      { id: 'p2', date: '2024-08-10', amount: 5600000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5808' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Anganwadi Nutrition Centres Smart Upgrades (10 Units)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 16000000,
      peerMedian: 13600000,
      peerMean: 14080000,
      expectedRange: [12000000, 15200000],
      deviationPercentage: -1,
      peerPercentile: 15,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5010', targetName: 'Bal Vikas Supplies', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5011',
    code: 'P-5011',
    title: 'Solid Waste Collection Vehicles & Sheds',
    category: 'Sanitation',
    sector: 'Swachh Bharat',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 29000000,
    releasedAmount: 24000000,
    expenditure: 22800000,
    remainingBalance: 6200000,
    utilisationPercentage: 78.6,
    physicalProgressPercentage: 75,
    financialProgressPercentage: 78.6,
    progressMismatchGap: 3.6,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 42,
    futureRiskScore: 46,
    systemicRiskScore: 36,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 47,
      financial: 50,
      procurement: 22,
      execution: 44,
      delay: 46,
      contractor: 27,
      duplicate: 10,
      compliance: 48,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5011',
      name: 'Swachh Bihar Services',
      panNumber: 'ABCDP4216M',
      riskScore: 42,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5011',
      name: 'PMC Sanitation',
      department: 'Swachh Bharat',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kankarbagh Ward 30',
      block: 'Patna Central',
      address: 'Kankarbagh Ward 30, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 29000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4216' },
      { id: 'p2', date: '2024-08-10', amount: 10150000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5216' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solid Waste Collection Vehicles & Sheds', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 29000000,
      peerMedian: 24650000,
      peerMean: 25520000,
      expectedRange: [21750000, 27550000],
      deviationPercentage: 1,
      peerPercentile: 47,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5011', targetName: 'Swachh Bihar Services', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5012',
    code: 'P-5012',
    title: 'District Kabaddi & Athletics Training Ground',
    category: 'Sports',
    sector: 'Sports',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 25000000,
    releasedAmount: 20000000,
    expenditure: 19000000,
    remainingBalance: 6000000,
    utilisationPercentage: 76.0,
    physicalProgressPercentage: 85,
    financialProgressPercentage: 76.0,
    progressMismatchGap: 0.0,
    status: 'SANCTIONED',
    currentRiskScore: 25,
    futureRiskScore: 29,
    systemicRiskScore: 19,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 30,
      financial: 33,
      procurement: 20,
      execution: 27,
      delay: 29,
      contractor: 25,
      duplicate: 10,
      compliance: 31,
      historical: 15
    },
    contractor: {
      id: 'cont-P-5012',
      name: 'Patliputra Sports Club',
      panNumber: 'ABCDP7201M',
      riskScore: 25,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-5012',
      name: 'Sports Authority Bihar',
      department: 'Sports',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Moin-ul-Haq Annex',
      block: 'Patna Central',
      address: 'Moin-ul-Haq Annex, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 25000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7201' },
      { id: 'p2', date: '2024-08-10', amount: 8750000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8201' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order District Kabaddi & Athletics Training Ground', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 25000000,
      peerMedian: 21250000,
      peerMean: 22000000,
      expectedRange: [18750000, 23750000],
      deviationPercentage: -4,
      peerPercentile: 30,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5012', targetName: 'Patliputra Sports Club', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-5013',
    code: 'P-5013',
    title: 'Electric Crematorium Gulbi Ghat Patna',
    category: 'Community',
    sector: 'Civic Amenities',
    mpName: 'Hon. Member LS-Patna',
    constituency: 'Patna Sahib Parliamentary Constituency',
    district: 'Patna',
    state: 'Bihar',
    financialYear: '2024-2025',
    sanctionedAmount: 43000000,
    releasedAmount: 35000000,
    expenditure: 33100000,
    remainingBalance: 9900000,
    utilisationPercentage: 77.0,
    physicalProgressPercentage: 55,
    financialProgressPercentage: 77.0,
    progressMismatchGap: 22.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 65,
    futureRiskScore: 69,
    systemicRiskScore: 59,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 70,
      financial: 73,
      procurement: 45,
      execution: 67,
      delay: 69,
      contractor: 50,
      duplicate: 10,
      compliance: 71,
      historical: 30
    },
    contractor: {
      id: 'cont-P-5013',
      name: 'BUIDCO Cremation Div',
      panNumber: 'ABCDP8098M',
      riskScore: 65,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-5013',
      name: 'BUIDCO Bihar',
      department: 'Civic Amenities',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Gulbi Ghat',
      block: 'Patna Central',
      address: 'Gulbi Ghat, Patna, Bihar'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 43000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 21500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8098' },
      { id: 'p2', date: '2024-08-10', amount: 15049999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9098' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Electric Crematorium Gulbi Ghat Patna', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 43000000,
      peerMedian: 36550000,
      peerMean: 37840000,
      expectedRange: [32250000, 40850000],
      deviationPercentage: 11,
      peerPercentile: 70,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-5013', targetName: 'BUIDCO Cremation Div', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8001',
    code: 'P-8001',
    title: 'Smart Stormwater Drainage & Micro-Sewage Treatment Plant',
    category: 'Sanitation',
    sector: 'Urban Sanitation',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 54000000,
    releasedAmount: 50000000,
    expenditure: 49200000,
    remainingBalance: 4800000,
    utilisationPercentage: 91.1,
    physicalProgressPercentage: 90,
    financialProgressPercentage: 91.1,
    progressMismatchGap: 1.1,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 28,
    futureRiskScore: 32,
    systemicRiskScore: 22,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 33,
      financial: 36,
      procurement: 20,
      execution: 30,
      delay: 32,
      contractor: 25,
      duplicate: 10,
      compliance: 34,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8001',
      name: 'Gujarat Clean Drain LLP',
      panNumber: 'ABCDP8121M',
      riskScore: 28,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8001',
      name: 'AMC Ahmedabad',
      department: 'Urban Sanitation',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Odhav Industrial',
      block: 'Ahmedabad Central',
      address: 'Odhav Industrial, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 54000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 27000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8121' },
      { id: 'p2', date: '2024-08-10', amount: 18900000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9121' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Smart Stormwater Drainage & Micro-Sewage Treatment Plant', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 54000000,
      peerMedian: 45900000,
      peerMean: 47520000,
      expectedRange: [40500000, 51300000],
      deviationPercentage: 0,
      peerPercentile: 33,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8001', targetName: 'Gujarat Clean Drain LLP', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8002',
    code: 'P-8002',
    title: 'Solar Rooftop Grid for 24 Municipal Schools',
    category: 'Energy',
    sector: 'Renewable',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 32000000,
    releasedAmount: 32000000,
    expenditure: 31500000,
    remainingBalance: 500000,
    utilisationPercentage: 98.4,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.4,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 10,
    futureRiskScore: 14,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 15,
      financial: 18,
      procurement: 20,
      execution: 12,
      delay: 14,
      contractor: 25,
      duplicate: 10,
      compliance: 16,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8002',
      name: 'Surya Gujarat Power',
      panNumber: 'ABCDP9918M',
      riskScore: 10,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8002',
      name: 'GEDA Gandhinagar',
      department: 'Renewable',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: '24 AMC Schools',
      block: 'Ahmedabad Central',
      address: '24 AMC Schools, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 32000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 16000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9918' },
      { id: 'p2', date: '2024-08-10', amount: 11200000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10918' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solar Rooftop Grid for 24 Municipal Schools', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 32000000,
      peerMedian: 27200000,
      peerMean: 28160000,
      expectedRange: [24000000, 30400000],
      deviationPercentage: 0,
      peerPercentile: 15,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8002', targetName: 'Surya Gujarat Power', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8003',
    code: 'P-8003',
    title: 'Industrial Area Concrete Heavy Road Naroda',
    category: 'Roads',
    sector: 'Connectivity',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 46000000,
    releasedAmount: 46000000,
    expenditure: 45100000,
    remainingBalance: 900000,
    utilisationPercentage: 98.0,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.0,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 12,
    futureRiskScore: 16,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 17,
      financial: 20,
      procurement: 20,
      execution: 14,
      delay: 16,
      contractor: 25,
      duplicate: 10,
      compliance: 18,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8003',
      name: 'Sardar Patel Roadworks',
      panNumber: 'ABCDP9531M',
      riskScore: 12,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8003',
      name: 'GIDC Ahmedabad',
      department: 'Connectivity',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Naroda GIDC',
      block: 'Ahmedabad Central',
      address: 'Naroda GIDC, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 46000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 23000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9531' },
      { id: 'p2', date: '2024-08-10', amount: 16099999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10531' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Industrial Area Concrete Heavy Road Naroda', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 46000000,
      peerMedian: 39100000,
      peerMean: 40480000,
      expectedRange: [34500000, 43700000],
      deviationPercentage: -1,
      peerPercentile: 17,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8003', targetName: 'Sardar Patel Roadworks', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8004',
    code: 'P-8004',
    title: 'Dialysis Center & Cardiac ICU Wing Civil Hospital',
    category: 'Health',
    sector: 'Public Health',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 48000000,
    releasedAmount: 44000000,
    expenditure: 42800000,
    remainingBalance: 5200000,
    utilisationPercentage: 89.2,
    physicalProgressPercentage: 80,
    financialProgressPercentage: 89.2,
    progressMismatchGap: 9.2,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 35,
    futureRiskScore: 39,
    systemicRiskScore: 29,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 40,
      financial: 43,
      procurement: 20,
      execution: 37,
      delay: 39,
      contractor: 25,
      duplicate: 10,
      compliance: 41,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8004',
      name: 'Zydus Medi-Infra',
      panNumber: 'ABCDP7946M',
      riskScore: 35,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8004',
      name: 'Civil Hospital Asarwa',
      department: 'Public Health',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Asarwa Campus',
      block: 'Ahmedabad Central',
      address: 'Asarwa Campus, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 48000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 24000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7946' },
      { id: 'p2', date: '2024-08-10', amount: 16800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8946' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Dialysis Center & Cardiac ICU Wing Civil Hospital', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 48000000,
      peerMedian: 40800000,
      peerMean: 42240000,
      expectedRange: [36000000, 45600000],
      deviationPercentage: 4,
      peerPercentile: 40,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8004', targetName: 'Zydus Medi-Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8005',
    code: 'P-8005',
    title: 'Sabarmati Riverfront Biodiversity Community Park',
    category: 'Water',
    sector: 'Urban Environment',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 38000000,
    releasedAmount: 38000000,
    expenditure: 37200000,
    remainingBalance: 800000,
    utilisationPercentage: 97.9,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.9,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 14,
    futureRiskScore: 18,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 19,
      financial: 22,
      procurement: 20,
      execution: 16,
      delay: 18,
      contractor: 25,
      duplicate: 10,
      compliance: 20,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8005',
      name: 'Riverfront Dev Corp',
      panNumber: 'ABCDP1082M',
      riskScore: 14,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8005',
      name: 'SRFDCL Ahmedabad',
      department: 'Urban Environment',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Subhash Bridge',
      block: 'Ahmedabad Central',
      address: 'Subhash Bridge, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 38000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 19000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1082' },
      { id: 'p2', date: '2024-08-10', amount: 13300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2082' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Sabarmati Riverfront Biodiversity Community Park', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 38000000,
      peerMedian: 32300000,
      peerMean: 33440000,
      expectedRange: [28500000, 36100000],
      deviationPercentage: -1,
      peerPercentile: 19,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8005', targetName: 'Riverfront Dev Corp', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8006',
    code: 'P-8006',
    title: 'Robotics & AI Innovation Hub for Government Polytechnic',
    category: 'Education',
    sector: 'Higher Education',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 29000000,
    releasedAmount: 29000000,
    expenditure: 28400000,
    remainingBalance: 600000,
    utilisationPercentage: 97.9,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.9,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 11,
    futureRiskScore: 15,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 16,
      financial: 19,
      procurement: 20,
      execution: 13,
      delay: 15,
      contractor: 25,
      duplicate: 10,
      compliance: 17,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8006',
      name: 'Gujarat Tech Solutions',
      panNumber: 'ABCDP8012M',
      riskScore: 11,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8006',
      name: 'DTE Gujarat',
      department: 'Higher Education',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Ambawadi',
      block: 'Ahmedabad Central',
      address: 'Ambawadi, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 29000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8012' },
      { id: 'p2', date: '2024-08-10', amount: 10150000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9012' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Robotics & AI Innovation Hub for Government Polytechnic', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 29000000,
      peerMedian: 24650000,
      peerMean: 25520000,
      expectedRange: [21750000, 27550000],
      deviationPercentage: -1,
      peerPercentile: 16,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8006', targetName: 'Gujarat Tech Solutions', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8007',
    code: 'P-8007',
    title: 'Solid Waste Refuse Derived Fuel (RDF) Processing Shed',
    category: 'Sanitation',
    sector: 'Swachh Bharat',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 41000000,
    releasedAmount: 34000000,
    expenditure: 32800000,
    remainingBalance: 8200000,
    utilisationPercentage: 80.0,
    physicalProgressPercentage: 40,
    financialProgressPercentage: 80.0,
    progressMismatchGap: 40.0,
    status: 'HALTED',
    currentRiskScore: 86,
    futureRiskScore: 90,
    systemicRiskScore: 80,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 91,
      financial: 94,
      procurement: 66,
      execution: 88,
      delay: 90,
      contractor: 71,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-8007',
      name: 'Pirana Clean Waste Ltd',
      panNumber: 'ABCDP8306M',
      riskScore: 86,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-8007',
      name: 'AMC Solid Waste',
      department: 'Swachh Bharat',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Pirana',
      block: 'Ahmedabad Central',
      address: 'Pirana, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 41000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 20500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8306' },
      { id: 'p2', date: '2024-08-10', amount: 14350000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9306' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solid Waste Refuse Derived Fuel (RDF) Processing Shed', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 41000000,
      peerMedian: 34850000,
      peerMean: 36080000,
      expectedRange: [30750000, 38950000],
      deviationPercentage: 20,
      peerPercentile: 91,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8007', targetName: 'Pirana Clean Waste Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8008',
    code: 'P-8008',
    title: 'Public Electric Vehicle EV Fast Charging Stations (10 Hubs)',
    category: 'Energy',
    sector: 'Green Mobility',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 24000000,
    releasedAmount: 24000000,
    expenditure: 23600000,
    remainingBalance: 400000,
    utilisationPercentage: 98.3,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.3,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 9,
    futureRiskScore: 13,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 14,
      financial: 17,
      procurement: 20,
      execution: 11,
      delay: 13,
      contractor: 25,
      duplicate: 10,
      compliance: 15,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8008',
      name: 'Torrent EV Network',
      panNumber: 'ABCDP7689M',
      riskScore: 9,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8008',
      name: 'AMC Energy Cell',
      department: 'Green Mobility',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'SG Highway Hubs',
      block: 'Ahmedabad Central',
      address: 'SG Highway Hubs, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 24000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7689' },
      { id: 'p2', date: '2024-08-10', amount: 8400000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8689' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Public Electric Vehicle EV Fast Charging Stations (10 Hubs)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 24000000,
      peerMedian: 20400000,
      peerMean: 21120000,
      expectedRange: [18000000, 22800000],
      deviationPercentage: 0,
      peerPercentile: 14,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8008', targetName: 'Torrent EV Network', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8009',
    code: 'P-8009',
    title: 'Integrated Multi-Sports Complex Vatva',
    category: 'Sports',
    sector: 'Sports',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 36000000,
    releasedAmount: 30000000,
    expenditure: 28900000,
    remainingBalance: 7100000,
    utilisationPercentage: 80.3,
    physicalProgressPercentage: 70,
    financialProgressPercentage: 80.3,
    progressMismatchGap: 10.3,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 42,
    futureRiskScore: 46,
    systemicRiskScore: 36,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 47,
      financial: 50,
      procurement: 22,
      execution: 44,
      delay: 46,
      contractor: 27,
      duplicate: 10,
      compliance: 48,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8009',
      name: 'Gujarat Sports Infra',
      panNumber: 'ABCDP6210M',
      riskScore: 42,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8009',
      name: 'SAG Gandhinagar',
      department: 'Sports',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Vatva Ward 41',
      block: 'Ahmedabad Central',
      address: 'Vatva Ward 41, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 36000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 18000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6210' },
      { id: 'p2', date: '2024-08-10', amount: 12600000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7210' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Integrated Multi-Sports Complex Vatva', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 36000000,
      peerMedian: 30600000,
      peerMean: 31680000,
      expectedRange: [27000000, 34200000],
      deviationPercentage: 5,
      peerPercentile: 47,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8009', targetName: 'Gujarat Sports Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8010',
    code: 'P-8010',
    title: 'Women Entrepreneurship Craft Centre Maninagar',
    category: 'Community',
    sector: 'Livelihood',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 22000000,
    releasedAmount: 22000000,
    expenditure: 21400000,
    remainingBalance: 600000,
    utilisationPercentage: 97.3,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.3,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 12,
    futureRiskScore: 16,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 17,
      financial: 20,
      procurement: 20,
      execution: 14,
      delay: 16,
      contractor: 25,
      duplicate: 10,
      compliance: 18,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8010',
      name: 'Mahila Udyog Kendra',
      panNumber: 'ABCDP4529M',
      riskScore: 12,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8010',
      name: 'GLPC Gujarat',
      department: 'Livelihood',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Maninagar',
      block: 'Ahmedabad Central',
      address: 'Maninagar, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 22000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 11000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4529' },
      { id: 'p2', date: '2024-08-10', amount: 7699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5529' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Women Entrepreneurship Craft Centre Maninagar', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 22000000,
      peerMedian: 18700000,
      peerMean: 19360000,
      expectedRange: [16500000, 20900000],
      deviationPercentage: -1,
      peerPercentile: 17,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8010', targetName: 'Mahila Udyog Kendra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8011',
    code: 'P-8011',
    title: 'Drinking Water Booster Pumping Station Nikol',
    category: 'Water',
    sector: 'Water',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 35000000,
    releasedAmount: 30000000,
    expenditure: 28800000,
    remainingBalance: 6200000,
    utilisationPercentage: 82.3,
    physicalProgressPercentage: 75,
    financialProgressPercentage: 82.3,
    progressMismatchGap: 7.3,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 38,
    futureRiskScore: 42,
    systemicRiskScore: 32,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 43,
      financial: 46,
      procurement: 20,
      execution: 40,
      delay: 42,
      contractor: 25,
      duplicate: 10,
      compliance: 44,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8011',
      name: 'Nikol Jal Seva',
      panNumber: 'ABCDP5307M',
      riskScore: 38,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8011',
      name: 'AMC Water Works',
      department: 'Water',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Nikol Gam',
      block: 'Ahmedabad Central',
      address: 'Nikol Gam, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 35000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 17500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-5307' },
      { id: 'p2', date: '2024-08-10', amount: 12250000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-6307' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Drinking Water Booster Pumping Station Nikol', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 35000000,
      peerMedian: 29750000,
      peerMean: 30800000,
      expectedRange: [26250000, 33250000],
      deviationPercentage: 3,
      peerPercentile: 43,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8011', targetName: 'Nikol Jal Seva', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8012',
    code: 'P-8012',
    title: 'Crematorium Solar Gas Hybrid Furnace Odhav',
    category: 'Community',
    sector: 'Civic',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 19000000,
    releasedAmount: 19000000,
    expenditure: 18600000,
    remainingBalance: 400000,
    utilisationPercentage: 97.9,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.9,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 15,
    futureRiskScore: 19,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 20,
      financial: 23,
      procurement: 20,
      execution: 17,
      delay: 19,
      contractor: 25,
      duplicate: 10,
      compliance: 21,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8012',
      name: 'Green Cremation Corp',
      panNumber: 'ABCDP2225M',
      riskScore: 15,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8012',
      name: 'AMC Health',
      department: 'Civic',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Odhav Muktidham',
      block: 'Ahmedabad Central',
      address: 'Odhav Muktidham, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 19000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 9500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2225' },
      { id: 'p2', date: '2024-08-10', amount: 6650000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3225' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Crematorium Solar Gas Hybrid Furnace Odhav', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 19000000,
      peerMedian: 16150000,
      peerMean: 16720000,
      expectedRange: [14250000, 18050000],
      deviationPercentage: -1,
      peerPercentile: 20,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8012', targetName: 'Green Cremation Corp', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8013',
    code: 'P-8013',
    title: 'Anganwadi Model Centers across East Wards (12 Units)',
    category: 'Education',
    sector: 'Child Welfare',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 15000000,
    releasedAmount: 15000000,
    expenditure: 14600000,
    remainingBalance: 400000,
    utilisationPercentage: 97.3,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 97.3,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 10,
    futureRiskScore: 14,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 15,
      financial: 18,
      procurement: 20,
      execution: 12,
      delay: 14,
      contractor: 25,
      duplicate: 10,
      compliance: 16,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8013',
      name: 'Bhavnagar Crafts',
      panNumber: 'ABCDP2047M',
      riskScore: 10,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8013',
      name: 'WCD Gujarat',
      department: 'Child Welfare',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'East Zone Wards',
      block: 'Ahmedabad Central',
      address: 'East Zone Wards, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 15000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 7500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2047' },
      { id: 'p2', date: '2024-08-10', amount: 5250000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3047' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Anganwadi Model Centers across East Wards (12 Units)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 15000000,
      peerMedian: 12750000,
      peerMean: 13200000,
      expectedRange: [11250000, 14250000],
      deviationPercentage: -1,
      peerPercentile: 15,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8013', targetName: 'Bhavnagar Crafts', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-8014',
    code: 'P-8014',
    title: 'Mobile Medical Clinic Vans for Slum Settlements',
    category: 'Health',
    sector: 'Healthcare',
    mpName: 'Hon. Member LS-Ahmedabad',
    constituency: 'Ahmedabad East Parliamentary Constituency',
    district: 'Ahmedabad',
    state: 'Gujarat',
    financialYear: '2024-2025',
    sanctionedAmount: 26000000,
    releasedAmount: 22000000,
    expenditure: 21200000,
    remainingBalance: 4800000,
    utilisationPercentage: 81.5,
    physicalProgressPercentage: 85,
    financialProgressPercentage: 81.5,
    progressMismatchGap: 0.0,
    status: 'SANCTIONED',
    currentRiskScore: 20,
    futureRiskScore: 24,
    systemicRiskScore: 14,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 25,
      financial: 28,
      procurement: 20,
      execution: 22,
      delay: 24,
      contractor: 25,
      duplicate: 10,
      compliance: 26,
      historical: 15
    },
    contractor: {
      id: 'cont-P-8014',
      name: 'Arogya Vahini Ltd',
      panNumber: 'ABCDP5799M',
      riskScore: 20,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-8014',
      name: 'AMC Health Mission',
      department: 'Healthcare',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'East Zone Slums',
      block: 'Ahmedabad Central',
      address: 'East Zone Slums, Ahmedabad, Gujarat'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 26000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 13000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-5799' },
      { id: 'p2', date: '2024-08-10', amount: 9100000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-6799' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Mobile Medical Clinic Vans for Slum Settlements', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 26000000,
      peerMedian: 22100000,
      peerMean: 22880000,
      expectedRange: [19500000, 24700000],
      deviationPercentage: -1,
      peerPercentile: 25,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-8014', targetName: 'Arogya Vahini Ltd', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9001',
    code: 'P-9001',
    title: 'Storm Water Drain Macro Canal Desilting & Concrete Lining',
    category: 'Sanitation',
    sector: 'Urban Flood Defense',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 56000000,
    releasedAmount: 50000000,
    expenditure: 48900000,
    remainingBalance: 7100000,
    utilisationPercentage: 87.3,
    physicalProgressPercentage: 85,
    financialProgressPercentage: 87.3,
    progressMismatchGap: 2.3,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 30,
    futureRiskScore: 34,
    systemicRiskScore: 24,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 35,
      financial: 38,
      procurement: 20,
      execution: 32,
      delay: 34,
      contractor: 25,
      duplicate: 10,
      compliance: 36,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9001',
      name: 'Tamil Nadu Coastal Civil',
      panNumber: 'ABCDP1600M',
      riskScore: 30,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9001',
      name: 'GCC Chennai',
      department: 'Urban Flood Defense',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Velachery Macro Drain',
      block: 'Chennai Central',
      address: 'Velachery Macro Drain, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 56000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 28000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-1600' },
      { id: 'p2', date: '2024-08-10', amount: 19600000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-2600' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Storm Water Drain Macro Canal Desilting & Concrete Lining', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 56000000,
      peerMedian: 47600000,
      peerMean: 49280000,
      expectedRange: [42000000, 53200000],
      deviationPercentage: 1,
      peerPercentile: 35,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9001', targetName: 'Tamil Nadu Coastal Civil', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9002',
    code: 'P-9002',
    title: 'Solar Micro-Grids for 20 Government Higher Secondary Schools',
    category: 'Energy',
    sector: 'Renewable Energy',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 34000000,
    releasedAmount: 34000000,
    expenditure: 33500000,
    remainingBalance: 500000,
    utilisationPercentage: 98.5,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.5,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 9,
    futureRiskScore: 13,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 14,
      financial: 17,
      procurement: 20,
      execution: 11,
      delay: 13,
      contractor: 25,
      duplicate: 10,
      compliance: 15,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9002',
      name: 'TEDA Solar Power',
      panNumber: 'ABCDP2752M',
      riskScore: 9,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9002',
      name: 'TEDA Chennai',
      department: 'Renewable Energy',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: '20 Chennai Schools',
      block: 'Chennai Central',
      address: '20 Chennai Schools, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 34000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 17000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-2752' },
      { id: 'p2', date: '2024-08-10', amount: 11900000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-3752' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solar Micro-Grids for 20 Government Higher Secondary Schools', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 34000000,
      peerMedian: 28900000,
      peerMean: 29920000,
      expectedRange: [25500000, 32300000],
      deviationPercentage: 0,
      peerPercentile: 14,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9002', targetName: 'TEDA Solar Power', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9003',
    code: 'P-9003',
    title: 'Dialysis Center & Cardiac Emergency Ward Royapettah Hospital',
    category: 'Health',
    sector: 'Health',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 49000000,
    releasedAmount: 45000000,
    expenditure: 43800000,
    remainingBalance: 5200000,
    utilisationPercentage: 89.4,
    physicalProgressPercentage: 80,
    financialProgressPercentage: 89.4,
    progressMismatchGap: 9.4,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 34,
    futureRiskScore: 38,
    systemicRiskScore: 28,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 39,
      financial: 42,
      procurement: 20,
      execution: 36,
      delay: 38,
      contractor: 25,
      duplicate: 10,
      compliance: 40,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9003',
      name: 'Apollo Medi-Engineering',
      panNumber: 'ABCDP9858M',
      riskScore: 34,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9003',
      name: 'DMS Tamil Nadu',
      department: 'Health',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Royapettah Campus',
      block: 'Chennai Central',
      address: 'Royapettah Campus, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 49000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 24500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9858' },
      { id: 'p2', date: '2024-08-10', amount: 17150000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10858' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Dialysis Center & Cardiac Emergency Ward Royapettah Hospital', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 49000000,
      peerMedian: 41650000,
      peerMean: 43120000,
      expectedRange: [36750000, 46550000],
      deviationPercentage: 4,
      peerPercentile: 39,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9003', targetName: 'Apollo Medi-Engineering', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9004',
    code: 'P-9004',
    title: 'Beach Promenade Public Amenities & LED Floodlights',
    category: 'Community',
    sector: 'Heritage',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 28000000,
    releasedAmount: 28000000,
    expenditure: 27500000,
    remainingBalance: 500000,
    utilisationPercentage: 98.2,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.2,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 11,
    futureRiskScore: 15,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 16,
      financial: 19,
      procurement: 20,
      execution: 13,
      delay: 15,
      contractor: 25,
      duplicate: 10,
      compliance: 17,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9004',
      name: 'Marina Eco Works',
      panNumber: 'ABCDP4150M',
      riskScore: 11,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9004',
      name: 'GCC Works Dept',
      department: 'Heritage',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Besant Nagar Promenade',
      block: 'Chennai Central',
      address: 'Besant Nagar Promenade, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 28000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 14000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-4150' },
      { id: 'p2', date: '2024-08-10', amount: 9800000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-5150' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Beach Promenade Public Amenities & LED Floodlights', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 28000000,
      peerMedian: 23800000,
      peerMean: 24640000,
      expectedRange: [21000000, 26600000],
      deviationPercentage: 0,
      peerPercentile: 16,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9004', targetName: 'Marina Eco Works', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9005',
    code: 'P-9005',
    title: 'Adyar River Bank Bioremediation & Eco-Fencing',
    category: 'Water',
    sector: 'Environment',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 42000000,
    releasedAmount: 36000000,
    expenditure: 34800000,
    remainingBalance: 7200000,
    utilisationPercentage: 82.9,
    physicalProgressPercentage: 40,
    financialProgressPercentage: 82.9,
    progressMismatchGap: 42.9,
    status: 'HALTED',
    currentRiskScore: 88,
    futureRiskScore: 92,
    systemicRiskScore: 82,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['FINANCIAL / EXECUTION MISMATCH', 'STATUTORY DOCUMENTATION DEFICIT'],
    riskFingerprint: {
      cost: 93,
      financial: 96,
      procurement: 68,
      execution: 90,
      delay: 90,
      contractor: 73,
      duplicate: 20,
      compliance: 90,
      historical: 30
    },
    contractor: {
      id: 'cont-P-9005',
      name: 'Coromandel Green Tech',
      panNumber: 'ABCDP3560M',
      riskScore: 88,
      activeContractsInDistrict: 8
    },
    implementingAgency: {
      id: 'agency-P-9005',
      name: 'CRRT Chennai',
      department: 'Environment',
      delayRate: 65
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Kotturpuram',
      block: 'Chennai Central',
      address: 'Kotturpuram, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 42000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 21000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3560' },
      { id: 'p2', date: '2024-08-10', amount: 14699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4560' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Adyar River Bank Bioremediation & Eco-Fencing', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 42000000,
      peerMedian: 35700000,
      peerMean: 36960000,
      expectedRange: [31500000, 39900000],
      deviationPercentage: 21,
      peerPercentile: 93,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9005', targetName: 'Coromandel Green Tech', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9006',
    code: 'P-9006',
    title: 'Smart STEM Labs & Robotics Kiosks (15 Schools)',
    category: 'Education',
    sector: 'School Education',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 26000000,
    releasedAmount: 26000000,
    expenditure: 25500000,
    remainingBalance: 500000,
    utilisationPercentage: 98.1,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.1,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 12,
    futureRiskScore: 16,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 17,
      financial: 20,
      procurement: 20,
      execution: 14,
      delay: 16,
      contractor: 25,
      duplicate: 10,
      compliance: 18,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9006',
      name: 'Tamil Edutech Labs',
      panNumber: 'ABCDP3598M',
      riskScore: 12,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9006',
      name: 'School Education TN',
      department: 'School Education',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Saidapet & T Nagar',
      block: 'Chennai Central',
      address: 'Saidapet & T Nagar, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 26000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 13000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3598' },
      { id: 'p2', date: '2024-08-10', amount: 9100000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4598' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Smart STEM Labs & Robotics Kiosks (15 Schools)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 26000000,
      peerMedian: 22100000,
      peerMean: 22880000,
      expectedRange: [19500000, 24700000],
      deviationPercentage: 0,
      peerPercentile: 17,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9006', targetName: 'Tamil Edutech Labs', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9007',
    code: 'P-9007',
    title: 'Seawater Desalination Booster Distribution Pipelines',
    category: 'Water',
    sector: 'Water Supply',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 51000000,
    releasedAmount: 45000000,
    expenditure: 43500000,
    remainingBalance: 7500000,
    utilisationPercentage: 85.3,
    physicalProgressPercentage: 70,
    financialProgressPercentage: 85.3,
    progressMismatchGap: 15.3,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 45,
    futureRiskScore: 49,
    systemicRiskScore: 39,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 50,
      financial: 53,
      procurement: 25,
      execution: 47,
      delay: 49,
      contractor: 30,
      duplicate: 10,
      compliance: 51,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9007',
      name: 'MetroWater Civil Corp',
      panNumber: 'ABCDP5932M',
      riskScore: 45,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9007',
      name: 'CMWSSB Chennai',
      department: 'Water Supply',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Sholinganallur',
      block: 'Chennai Central',
      address: 'Sholinganallur, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 51000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 25500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-5932' },
      { id: 'p2', date: '2024-08-10', amount: 17850000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-6932' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Seawater Desalination Booster Distribution Pipelines', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 51000000,
      peerMedian: 43350000,
      peerMean: 44880000,
      expectedRange: [38250000, 48450000],
      deviationPercentage: 7,
      peerPercentile: 50,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9007', targetName: 'MetroWater Civil Corp', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9008',
    code: 'P-9008',
    title: 'Solid Waste Transfer Stations (8 Mechanized Units)',
    category: 'Sanitation',
    sector: 'Sanitation',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 35000000,
    releasedAmount: 30000000,
    expenditure: 29200000,
    remainingBalance: 5800000,
    utilisationPercentage: 83.4,
    physicalProgressPercentage: 75,
    financialProgressPercentage: 83.4,
    progressMismatchGap: 8.4,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 38,
    futureRiskScore: 42,
    systemicRiskScore: 32,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 43,
      financial: 46,
      procurement: 20,
      execution: 40,
      delay: 42,
      contractor: 25,
      duplicate: 10,
      compliance: 44,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9008',
      name: 'Urbaser Sumeet JV',
      panNumber: 'ABCDP3478M',
      riskScore: 38,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9008',
      name: 'GCC Sanitation',
      department: 'Sanitation',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Adyar Zone 13',
      block: 'Chennai Central',
      address: 'Adyar Zone 13, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 35000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 17500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3478' },
      { id: 'p2', date: '2024-08-10', amount: 12250000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4478' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Solid Waste Transfer Stations (8 Mechanized Units)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 35000000,
      peerMedian: 29750000,
      peerMean: 30800000,
      expectedRange: [26250000, 33250000],
      deviationPercentage: 4,
      peerPercentile: 43,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9008', targetName: 'Urbaser Sumeet JV', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9009',
    code: 'P-9009',
    title: 'Fishermen Community Cold Storage & Ice Flake Hub',
    category: 'Community',
    sector: 'Fisheries',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 38000000,
    releasedAmount: 32000000,
    expenditure: 30800000,
    remainingBalance: 7200000,
    utilisationPercentage: 81.1,
    physicalProgressPercentage: 65,
    financialProgressPercentage: 81.1,
    progressMismatchGap: 16.1,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 55,
    futureRiskScore: 59,
    systemicRiskScore: 49,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 60,
      financial: 63,
      procurement: 35,
      execution: 57,
      delay: 59,
      contractor: 40,
      duplicate: 10,
      compliance: 61,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9009',
      name: 'Kadal Meen Infra',
      panNumber: 'ABCDP7675M',
      riskScore: 55,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9009',
      name: 'Fisheries Dept TN',
      department: 'Fisheries',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Neelankarai Beach',
      block: 'Chennai Central',
      address: 'Neelankarai Beach, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 38000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 19000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-7675' },
      { id: 'p2', date: '2024-08-10', amount: 13300000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-8675' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Fishermen Community Cold Storage & Ice Flake Hub', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 38000000,
      peerMedian: 32300000,
      peerMean: 33440000,
      expectedRange: [28500000, 36100000],
      deviationPercentage: 8,
      peerPercentile: 60,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9009', targetName: 'Kadal Meen Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9010',
    code: 'P-9010',
    title: 'Public Library & Digital Competitive Exam Center',
    category: 'Education',
    sector: 'Youth Affairs',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 22000000,
    releasedAmount: 22000000,
    expenditure: 21600000,
    remainingBalance: 400000,
    utilisationPercentage: 98.2,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.2,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 10,
    futureRiskScore: 14,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 15,
      financial: 18,
      procurement: 20,
      execution: 12,
      delay: 14,
      contractor: 25,
      duplicate: 10,
      compliance: 16,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9010',
      name: 'Kalaignar Arivakam',
      panNumber: 'ABCDP8106M',
      riskScore: 10,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9010',
      name: 'Public Libraries TN',
      department: 'Youth Affairs',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Thiruvanmiyur',
      block: 'Chennai Central',
      address: 'Thiruvanmiyur, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 22000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 11000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-8106' },
      { id: 'p2', date: '2024-08-10', amount: 7699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-9106' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Public Library & Digital Competitive Exam Center', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 22000000,
      peerMedian: 18700000,
      peerMean: 19360000,
      expectedRange: [16500000, 20900000],
      deviationPercentage: 0,
      peerPercentile: 15,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9010', targetName: 'Kalaignar Arivakam', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9011',
    code: 'P-9011',
    title: 'Divyangjan Specialized Skill & Rehabilitation Center',
    category: 'Community',
    sector: 'Social Welfare',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 25000000,
    releasedAmount: 21000000,
    expenditure: 20200000,
    remainingBalance: 4800000,
    utilisationPercentage: 80.8,
    physicalProgressPercentage: 80,
    financialProgressPercentage: 80.8,
    progressMismatchGap: 0.8,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 32,
    futureRiskScore: 36,
    systemicRiskScore: 26,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 37,
      financial: 40,
      procurement: 20,
      execution: 34,
      delay: 36,
      contractor: 25,
      duplicate: 10,
      compliance: 38,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9011',
      name: 'Tamil Welfare Trust',
      panNumber: 'ABCDP9532M',
      riskScore: 32,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9011',
      name: 'Social Welfare Dept TN',
      department: 'Social Welfare',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Mylapore',
      block: 'Chennai Central',
      address: 'Mylapore, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 25000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 12500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9532' },
      { id: 'p2', date: '2024-08-10', amount: 8750000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10532' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Divyangjan Specialized Skill & Rehabilitation Center', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 25000000,
      peerMedian: 21250000,
      peerMean: 22000000,
      expectedRange: [18750000, 23750000],
      deviationPercentage: 0,
      peerPercentile: 37,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9011', targetName: 'Tamil Welfare Trust', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9012',
    code: 'P-9012',
    title: 'Paved Concrete Internal Roads in TNHB Colony',
    category: 'Roads',
    sector: 'Housing Works',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 31000000,
    releasedAmount: 26000000,
    expenditure: 25100000,
    remainingBalance: 5900000,
    utilisationPercentage: 81.0,
    physicalProgressPercentage: 90,
    financialProgressPercentage: 81.0,
    progressMismatchGap: 0.0,
    status: 'WORK_IN_PROGRESS',
    currentRiskScore: 25,
    futureRiskScore: 29,
    systemicRiskScore: 19,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 30,
      financial: 33,
      procurement: 20,
      execution: 27,
      delay: 29,
      contractor: 25,
      duplicate: 10,
      compliance: 31,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9012',
      name: 'TNHB Civil Contractors',
      panNumber: 'ABCDP3547M',
      riskScore: 25,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9012',
      name: 'TNHB Chennai',
      department: 'Housing Works',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Tharamani',
      block: 'Chennai Central',
      address: 'Tharamani, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 31000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 15500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-3547' },
      { id: 'p2', date: '2024-08-10', amount: 10850000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-4547' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Paved Concrete Internal Roads in TNHB Colony', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 31000000,
      peerMedian: 26350000,
      peerMean: 27280000,
      expectedRange: [23250000, 29450000],
      deviationPercentage: -4,
      peerPercentile: 30,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9012', targetName: 'TNHB Civil Contractors', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9013',
    code: 'P-9013',
    title: 'Anganwadi Model Centers across South Wards (10 Units)',
    category: 'Education',
    sector: 'Child Development',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 15000000,
    releasedAmount: 15000000,
    expenditure: 14700000,
    remainingBalance: 300000,
    utilisationPercentage: 98.0,
    physicalProgressPercentage: 100,
    financialProgressPercentage: 98.0,
    progressMismatchGap: 0.0,
    status: 'COMPLETED',
    currentRiskScore: 11,
    futureRiskScore: 15,
    systemicRiskScore: 10,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 16,
      financial: 19,
      procurement: 20,
      execution: 13,
      delay: 15,
      contractor: 25,
      duplicate: 10,
      compliance: 17,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9013',
      name: 'Kanchi Toys & Infra',
      panNumber: 'ABCDP9772M',
      riskScore: 11,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9013',
      name: 'ICDS Chennai',
      department: 'Child Development',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Guindy & Alandur',
      block: 'Chennai Central',
      address: 'Guindy & Alandur, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 15000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'COMPLETED', delayDays: 0 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 7500000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-9772' },
      { id: 'p2', date: '2024-08-10', amount: 5250000, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-10772' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Anganwadi Model Centers across South Wards (10 Units)', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 15000000,
      peerMedian: 12750000,
      peerMean: 13200000,
      expectedRange: [11250000, 14250000],
      deviationPercentage: -1,
      peerPercentile: 16,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9013', targetName: 'Kanchi Toys & Infra', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
  {
    id: 'P-9014',
    code: 'P-9014',
    title: 'Electric Crematorium Gas Furnaces Besant Nagar',
    category: 'Community',
    sector: 'Civic Amenities',
    mpName: 'Hon. Member LS-Chennai',
    constituency: 'Chennai South Parliamentary Constituency',
    district: 'Chennai',
    state: 'Tamil Nadu',
    financialYear: '2024-2025',
    sanctionedAmount: 22000000,
    releasedAmount: 18000000,
    expenditure: 17400000,
    remainingBalance: 4600000,
    utilisationPercentage: 79.1,
    physicalProgressPercentage: 85,
    financialProgressPercentage: 79.1,
    progressMismatchGap: 0.0,
    status: 'SANCTIONED',
    currentRiskScore: 18,
    futureRiskScore: 22,
    systemicRiskScore: 12,
    confidenceScore: 90,
    evidenceCoverage: 82,
    whyFlagged: ['NORMAL COMPLIANCE'],
    riskFingerprint: {
      cost: 23,
      financial: 26,
      procurement: 20,
      execution: 20,
      delay: 22,
      contractor: 25,
      duplicate: 10,
      compliance: 24,
      historical: 15
    },
    contractor: {
      id: 'cont-P-9014',
      name: 'Eco Cremation TN',
      panNumber: 'ABCDP6475M',
      riskScore: 18,
      activeContractsInDistrict: 3
    },
    implementingAgency: {
      id: 'agency-P-9014',
      name: 'GCC Health',
      department: 'Civic Amenities',
      delayRate: 35
    },
    location: {
      lat: 18.5204,
      lng: 73.8567,
      wardOrVillage: 'Besant Nagar Crematorium',
      block: 'Chennai Central',
      address: 'Besant Nagar Crematorium, Chennai, Tamil Nadu'
    },
    timeline: [
      { id: 't1', step: 'Sanction Order Issued', date: '2024-04-10', status: 'COMPLETED', amount: 22000000 },
      { id: 't2', step: 'Tender Awarded', date: '2024-05-12', status: 'COMPLETED' },
      { id: 't3', step: 'Foundation Level', date: '2024-07-20', status: 'COMPLETED', delayDays: 14 },
      { id: 't4', step: 'Superstructure Phase', date: '2024-11-15', status: 'DELAYED', delayDays: 90 }
    ],
    payments: [
      { id: 'p1', date: '2024-04-15', amount: 11000000, type: 'Tranche 1 Release', status: 'PAID', reference: 'PFMS-VOUCH-6475' },
      { id: 'p2', date: '2024-08-10', amount: 7699999, type: 'Tranche 2 Release', status: 'PAID', reference: 'PFMS-VOUCH-7475' }
    ],
    documents: [
      { id: 'd1', title: 'Sanction Order Electric Crematorium Gas Furnaces Besant Nagar', type: 'SANCTION_ORDER', uploadedDate: '2024-04-10', fileSize: '1.4 MB', verifiedByAi: true, flagCount: 0, hash: 'SHA256-88a7c2' }
    ],
    costBenchmark: {
      projectCost: 22000000,
      peerMedian: 18700000,
      peerMean: 19360000,
      expectedRange: [16500000, 20900000],
      deviationPercentage: -2,
      peerPercentile: 23,
      peerSampleCount: 14
    },
    applicableRules: [
      { ruleId: 'R-42', documentTitle: 'MPLADS Revised Guidelines 2023', section: 'Section 4.2', page: 37, summary: 'Technical Sanction limits vs Schedule of Rates', quote: 'Estimates must not exceed prevailing PWD/CPWD Schedule of Rates without justification.', severity: 'CRITICAL' }
    ],
    evidenceItems: [
      { id: 'e1', type: 'DATA', title: 'Volumetric Satellite Divergence', detail: 'ISRO Cartosat-3 pass validates milestone tracking.', verified: true, timestamp: '2025-02-23 10:30', confidenceScore: 94 }
    ],
    relationships: [
      { targetId: 'cont-P-9014', targetName: 'Eco Cremation TN', targetType: 'CONTRACTOR', relationType: 'EXECUTED_BY', weight: 99 }
    ],
    dataFreshness: {
      lastUpdated: '2025-02-27',
      financialDataAgeDays: 2,
      physicalDataAgeDays: 12,
      isStale: false
    }
  },
];
