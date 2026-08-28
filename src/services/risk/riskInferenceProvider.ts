import { ProjectAssessmentInput, RiskAssessmentResult, RiskInferenceProvider } from '../../types/riskAssessment';
import { mockRiskInferenceProvider } from './mockRiskInferenceProvider';

/**
 * Pluggable Inference Provider Interface.
 * In the current prototype, this defaults to `mockRiskInferenceProvider`.
 * Once the ML/FastAPI backend is deployed, simply swap with `mlRiskInferenceProvider`
 * without touching any UI components.
 */
class RiskInferenceService {
  private provider: RiskInferenceProvider = mockRiskInferenceProvider;

  public setProvider(provider: RiskInferenceProvider) {
    this.provider = provider;
  }

  public async evaluateProject(data: ProjectAssessmentInput): Promise<RiskAssessmentResult> {
    return this.provider.evaluateProject(data);
  }
}

export const riskInferenceService = new RiskInferenceService();
