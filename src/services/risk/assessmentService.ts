import { RiskAssessmentResult, SavedAssessmentSummary } from '../../types/riskAssessment';

const STORAGE_KEY = 'agastya_saved_risk_assessments';

const INITIAL_SAVED_ASSESSMENTS: SavedAssessmentSummary[] = [
  {
    assessmentId: 'RA-20260827-814',
    timestamp: '27 Aug 2026, 11:30 AM',
    projectId: 'MPLADS-MH-PUN-2025-1023',
    projectName: 'Ward 17 Community Multi-Purpose Hall Complex',
    category: 'Community Assets',
    district: 'Pune',
    riskScore: 78,
    riskLevel: 'HIGH',
    topDriver: 'Financial (82%) vs Physical (40%) progress mismatch',
  },
  {
    assessmentId: 'RA-20260826-402',
    timestamp: '26 Aug 2026, 04:15 PM',
    projectId: 'MPLADS-MH-PUN-2024-0419',
    projectName: 'Rural Drinking Water Overhead Reservoir Network',
    category: 'Water Infrastructure',
    district: 'Pune',
    riskScore: 92,
    riskLevel: 'CRITICAL',
    topDriver: 'Suspected duplicate overlap & missing Technical Sanction',
  },
  {
    assessmentId: 'RA-20260825-119',
    timestamp: '25 Aug 2026, 02:45 PM',
    projectId: 'MPLADS-MH-PUN-2025-0811',
    projectName: 'Upgradation of Primary Health Centre & Solar Cold Chain',
    category: 'Public Health',
    district: 'Pune',
    riskScore: 18,
    riskLevel: 'LOW',
    topDriver: 'Balanced milestone progress & open competitive bidding',
  },
];

class AssessmentService {
  private inMemoryAssessments: SavedAssessmentSummary[] = [...INITIAL_SAVED_ASSESSMENTS];
  private fullAssessments: Map<string, RiskAssessmentResult> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.inMemoryAssessments = parsed;
        }
      }
    } catch {
      // ignore localStorage error
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryAssessments));
    } catch {
      // ignore localStorage error
    }
  }

  public getRecentAssessments(): SavedAssessmentSummary[] {
    return [...this.inMemoryAssessments];
  }

  public getAssessmentById(id: string): RiskAssessmentResult | null {
    return this.fullAssessments.get(id) || null;
  }

  public saveAssessment(result: RiskAssessmentResult): SavedAssessmentSummary {
    const summary: SavedAssessmentSummary = {
      assessmentId: result.assessmentId,
      timestamp: result.timestamp,
      projectId: result.projectId,
      projectName: result.projectName,
      category: result.category,
      district: result.district,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      topDriver: result.whyFlaggedContributors[0]?.title || 'Multi-factor risk indicators',
    };

    this.fullAssessments.set(result.assessmentId, result);

    // Add to front, deduplicate by assessmentId
    this.inMemoryAssessments = [
      summary,
      ...this.inMemoryAssessments.filter((a) => a.assessmentId !== summary.assessmentId),
    ].slice(0, 20);

    this.saveToStorage();
    return summary;
  }
}

export const assessmentService = new AssessmentService();
