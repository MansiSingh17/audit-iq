import api from './api';

export interface CriticalFlag {
  id: string;
  severity: string;
  title: string;
  description: string;
  location: string;
  recommendation: string;
  affectedControls: string[];
}

export interface ImprovementSuggestion {
  id: string;
  category: string;
  title: string;
  description: string;
  benefit: string;
  effort: string;
  priority: number;
}

export interface ComplianceGap {
  controlId: string;
  controlName: string;
  requirement: string;
  currentState: string;
  expectedState: string;
  gap: string;
  remediationSteps: string[];
}

export interface RiskArea {
  id: string;
  riskLevel: string;
  title: string;
  description: string;
  impact: string;
  likelihood: string;
  mitigationActions: string[];
}

export interface OverallAssessment {
  score: string;
  rating: string;
  summary: string;
  criticalIssues: number;
  warnings: number;
  recommendations: number;
}

export interface AnalysisResult {
  documentId: string;
  documentName: string;
  standard: string;
  analyzedAt: string;
  overallAssessment: OverallAssessment;
  criticalFlags: CriticalFlag[];
  improvements: ImprovementSuggestion[];
  complianceGaps: ComplianceGap[];
  riskAreas: RiskArea[];
}

export const documentAnalysisService = {
  analyzeDocument: async (file: File, standard: string): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('standard', standard);

    const response = await api.post('/api/analysis/analyze-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};