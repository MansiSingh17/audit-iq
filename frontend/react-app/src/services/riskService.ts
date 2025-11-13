import api from './api';

export interface RiskAssessment {
  id: number;
  overallRiskScore: number;
  overallRiskLevel: string;
  summary: string;
  recommendations: string;
  assessedBy: string;
  findings: RiskFinding[];
  createdAt: string;
  updatedAt: string;
}

export interface RiskFinding {
  id: number;
  category: string;
  finding: string;
  riskScore: number;
  riskLevel: string;
  impact: string;
  mitigation: string;
}

export const riskService = {
  assessRisk: async (documentId: number): Promise<RiskAssessment> => {
    const response = await api.post(`/api/risk-assessments/assess/${documentId}`);
    return response.data;
  },

  getRiskAssessmentById: async (id: number): Promise<RiskAssessment> => {
    const response = await api.get(`/api/risk-assessments/${id}`);
    return response.data;
  },

  getAssessmentsByDocument: async (documentId: number): Promise<RiskAssessment[]> => {
    const response = await api.get(`/api/risk-assessments/document/${documentId}`);
    return response.data;
  },

  getAllAssessments: async (): Promise<RiskAssessment[]> => {
    const response = await api.get('/api/risk-assessments');
    return response.data;
  },

  deleteAssessment: async (id: number) => {
    await api.delete(`/api/risk-assessments/${id}`);
  }
};
