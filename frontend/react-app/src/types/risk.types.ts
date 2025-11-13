export interface RiskAssessment {
  id: number;
  documentId: number;
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  findings: RiskFinding[];
  summary: string;
  recommendations: string;
  assessedBy: string;
  assessedAt: string;
}

export interface RiskFinding {
  id: string;
  category: string;
  issue: string;
  impact: string;
  recommendation: string;
  severity: RiskLevel;
  riskScore: number;
  affectedControl: string;
  priority: RemediationPriority;
}

export enum RiskLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  MINIMAL = 'MINIMAL',
}

export enum RemediationPriority {
  IMMEDIATE = 'IMMEDIATE',
  SHORT_TERM = 'SHORT_TERM',
  MEDIUM_TERM = 'MEDIUM_TERM',
  LONG_TERM = 'LONG_TERM',
}