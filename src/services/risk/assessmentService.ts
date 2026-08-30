import {
  RiskAssessmentResult,
  SavedAssessmentSummary,
} from '../../types/riskAssessment';

const STORAGE_KEY =
  'sanchay_saved_risk_assessments';

export class AssessmentService {
  private inMemoryAssessments:
    SavedAssessmentSummary[] = [];

  private fullAssessments:
    Map<string, RiskAssessmentResult> =
    new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored =
        localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          this.inMemoryAssessments = parsed;
        }
      }
    } catch {
      // ignore localStorage error
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          this.inMemoryAssessments
        )
      );
    } catch {
      // ignore
    }
  }

  public getRecentAssessments():
    SavedAssessmentSummary[] {
    return [
      ...this.inMemoryAssessments,
    ];
  }

  public getAssessmentById(
    id: string
  ): RiskAssessmentResult | null {
    return (
      this.fullAssessments.get(id) ||
      null
    );
  }

  public saveAssessment(
    result: RiskAssessmentResult
  ): SavedAssessmentSummary {
    const summary:
      SavedAssessmentSummary = {
      assessmentId:
        result.assessmentId,

      timestamp:
        result.timestamp,

      projectId:
        result.projectId,

      projectName:
        result.projectName,

      category:
        result.category,

      district:
        result.district,

      riskScore:
        result.riskScore,

      riskLevel:
        result.riskLevel,

      topDriver:
        result
          .whyFlaggedContributors[0]
          ?.title ||
        'Multi-factor risk indicators',
    };

    this.fullAssessments.set(
      result.assessmentId,
      result
    );

    this.inMemoryAssessments = [
      summary,

      ...this.inMemoryAssessments.filter(
        (a) =>
          a.assessmentId !==
          summary.assessmentId
      ),
    ].slice(0, 20);

    this.saveToStorage();

    return summary;
  }
}

export const assessmentService =
  new AssessmentService();
