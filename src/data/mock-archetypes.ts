export interface FraudArchetype {
  id: string;
  name: string;
  code: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  confidence: number;
  historicalMatches: number;
  triggerSignals: string[];
  recommendedAction: string;
  affectedProjectsCount: number;
  stateConcentration: string;
}

export const mockFraudArchetypes: FraudArchetype[] = [
  {
    id: 'arch-1',
    name: 'YEAR-END RUSH',
    code: 'ARCH-YER-01',
    description: 'Abnormally high sanction density in March (financial year end) coupled with fast-tracked approvals, single-bid procurement, and significant cost benchmark variance.',
    severity: 'HIGH',
    confidence: 84,
    historicalMatches: 47,
    triggerSignals: [
      'Sanction timestamp clustered in Q4 (March 15-31)',
      'Tender publication period compressed under 10 days',
      'Cost estimate at upper ceiling of technical sanction power',
      'High contractor concentration in executing division',
    ],
    recommendedAction: 'Mandate independent physical milestone verification before releasing 2nd installment and verify original e-tender notice publication date.',
    affectedProjectsCount: 18,
    stateConcentration: 'Maharashtra (12), Uttar Pradesh (6)',
  },
  {
    id: 'arch-2',
    name: 'PROJECT SPLITTING (TENDER BYPASS)',
    code: 'ARCH-SPL-02',
    description: 'Splitting large public works into multiple sub-projects valued at ₹9.8L - ₹9.95L (just under the ₹10.0L mandatory e-procurement / open tender threshold) awarded to the same vendor.',
    severity: 'CRITICAL',
    confidence: 91,
    historicalMatches: 62,
    triggerSignals: [
      'Contiguous geographic coordinates within 500 meters',
      'Identical scope of work partitioned into parts I, II, III',
      'Value clustered at ₹9.80L - ₹9.98L',
      'Awarded through direct nomination / quotation without open e-tender',
    ],
    recommendedAction: 'Consolidate works into single audit docket, issue inquiry notice to executing engineer, and review compliance with GFR 2017 Rule 149.',
    affectedProjectsCount: 24,
    stateConcentration: 'NCT of Delhi (14), Karnataka (10)',
  },
  {
    id: 'arch-3',
    name: 'ROLLING DUPLICATE OVERLAP',
    code: 'ARCH-DUP-03',
    description: 'Re-sanctioning an asset or road stretch previously constructed or maintained under state schemes (MLALADS, PWD, PMGSY, Municipal Funds) within a 36-month window.',
    severity: 'CRITICAL',
    confidence: 87,
    historicalMatches: 39,
    triggerSignals: [
      'Geospatial polygon overlap > 85%',
      'Semantic title similarity > 80%',
      'Existing asset completion certificate on record in state portal',
      'No structural demolition or widening justified in DPR',
    ],
    recommendedAction: 'Conduct on-site geofenced field inspection with GPS geotagged photo survey and cross-verify with PMGSY / MLALADS state asset registers.',
    affectedProjectsCount: 15,
    stateConcentration: 'Maharashtra (9), Bihar (6)',
  },
  {
    id: 'arch-4',
    name: 'FUND PARKING IN EXECUTING AGENCY',
    code: 'ARCH-FPK-04',
    description: 'Funds disbursed by District Authority to implementing agency accounts that remain unutilized and un-tendered for >180 days with no physical progress reported.',
    severity: 'MEDIUM',
    confidence: 78,
    historicalMatches: 115,
    triggerSignals: [
      'Disbursement done >6 months prior',
      'Zero physical progress milestones submitted',
      'No NIT (Notice Inviting Tender) published on GeM / Mahatenders',
      'Interest accrued on parked funds not remitted to Consolidated Fund',
    ],
    recommendedAction: 'Issue statutory recall notice under MPLADS Guidelines 2023 §5.2 or reallocate to active backlog works.',
    affectedProjectsCount: 32,
    stateConcentration: 'Maharashtra (16), Karnataka (11), Uttar Pradesh (5)',
  },
  {
    id: 'arch-5',
    name: 'CONTRACTOR CONCENTRATION & CARTEL CLUSTER',
    code: 'ARCH-CON-05',
    description: 'A single contractor or affiliated syndicate winning >40% of all MPLADS works across a block or district through rotating L1/L2 bid submissions.',
    severity: 'HIGH',
    confidence: 82,
    historicalMatches: 28,
    triggerSignals: [
      'Contractor group holds >35% district contract value',
      'Cross-bidding between same 3 entity directors / shared GSTN addresses',
      'Average winning margin < 1.5% below estimate',
      'Single-bid tenders without mandatory retender rounds',
    ],
    recommendedAction: 'Cross-examine bidder PAN/GSTN relationships in corporate registry and escalate to State Vigilance Commission.',
    affectedProjectsCount: 29,
    stateConcentration: 'Maharashtra (18), Uttar Pradesh (11)',
  },
];

export interface CrossSchemeOverlap {
  id: string;
  mpladsProject: {
    id: string;
    title: string;
    outlay: string;
    location: string;
    agency: string;
    sanctionDate: string;
  };
  overlappingScheme: {
    schemeName: 'PMGSY' | 'MGNREGA' | 'MLALADS' | 'Smart Cities Mission' | 'State PWD';
    referenceId: string;
    title: string;
    outlay: string;
    completionDate: string;
    agency: string;
  };
  similarityScore: number;
  proximityDistanceKm: number;
  riskStatus: 'POTENTIAL DUPLICATE' | 'CONFIRMED OVERLAP' | 'UNDER FIELD INQUIRY';
  notes: string;
}

export const mockCrossSchemeOverlaps: CrossSchemeOverlap[] = [
  {
    id: 'CSO-001',
    mpladsProject: {
      id: 'P-0871',
      title: 'Bituminous Village Link Road KM 12/400',
      outlay: '₹58.00 Lakhs',
      location: 'Haveli Taluka, Pune (18.5204° N, 73.8567° E)',
      agency: 'Pune Zilla Parishad (Rural Works Div)',
      sanctionDate: '12 Jan 2025',
    },
    overlappingScheme: {
      schemeName: 'PMGSY',
      referenceId: 'PMGSY-MH-PUN-2023-88',
      title: 'Upgradation of Haveli Village Connect Road Stretch',
      outlay: '₹1.24 Crore',
      completionDate: '18 Nov 2023',
      agency: 'Maharashtra Rural Road Dev Agency (MRRDA)',
    },
    similarityScore: 88,
    proximityDistanceKm: 0.4,
    riskStatus: 'POTENTIAL DUPLICATE',
    notes: 'Spatial polygon mapping indicates 88% alignment with road carpet completed under PMGSY Batch III in Nov 2023. Field verification required before releasing final 25% payment.',
  },
  {
    id: 'CSO-002',
    mpladsProject: {
      id: 'P-1023',
      title: 'Community Hall & Skill Centre Ward 17',
      outlay: '₹42.00 Lakhs',
      location: 'Hadapsar Ward 17, Pune (18.4982° N, 73.9281° E)',
      agency: 'Pune Zilla Parishad',
      sanctionDate: '18 Jun 2025',
    },
    overlappingScheme: {
      schemeName: 'MLALADS',
      referenceId: 'MLA-MH-PUN-2024-114',
      title: 'Samaj Mandir & Skill Center Construction Hadapsar',
      outlay: '₹35.00 Lakhs',
      completionDate: '24 Feb 2025',
      agency: 'Pune Municipal Corporation (PMC)',
    },
    similarityScore: 92,
    proximityDistanceKm: 0.15,
    riskStatus: 'UNDER FIELD INQUIRY',
    notes: 'Building footprints overlap within 150m radius. Possible double-claiming of civil works structure under both MP and MLA local area development funds.',
  },
  {
    id: 'CSO-003',
    mpladsProject: {
      id: 'P-0912',
      title: 'Primary Health Diagnostic Solar Unit',
      outlay: '₹34.50 Lakhs',
      location: 'Baramati Rural, Pune (18.1521° N, 74.5772° E)',
      agency: 'Health Dept, Zilla Parishad',
      sanctionDate: '04 Mar 2025',
    },
    overlappingScheme: {
      schemeName: 'State PWD',
      referenceId: 'PWD-MH-ELEC-2024-49',
      title: 'Rooftop Solar Electrification of Rural PHCs',
      outlay: '₹28.00 Lakhs',
      completionDate: '15 Oct 2024',
      agency: 'Maharashtra State PWD Electrical Div',
    },
    similarityScore: 84,
    proximityDistanceKm: 0.05,
    riskStatus: 'POTENTIAL DUPLICATE',
    notes: 'PHC facility already sanctioned 15kVA rooftop solar under state budget. MPLADS sanction specifies identical rooftop installation.',
  },
];
