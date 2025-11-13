import api from './api';

// TypeScript interfaces matching backend DTOs
export interface AuditFinding {
  id?: string;
  title: string;
  description: string;
  severity: {
    level: string;
    impactScore: number;
    remediationTimeframe: string;
    businessImpact?: string;
    technicalImpact?: string;
    color?: string;
  };
  impactScore: number;
  remediationTimeline?: string;
  recommendedTimeline?: string;
  dueDate?: string;
  status?: string;
  controlReference?: string;
  standard?: string;
  grammarCorrectedDescription?: string;
  executiveSummary?: string;
  auditReadyDocumentation?: string;
  industryBestPractices?: string[];
  benchmarkComparisons?: string[];
  frameworkAlignments?: string[];
  remediationSteps?: Array<{
    stepNumber: number;
    action: string;
    owner?: string;
    deadline?: string;
    status?: string;
    resources?: string[];
  }>;
  assignedTo?: string;
  estimatedEffort?: number;
  priority?: string;
  evidence?: string;
  affectedControls?: string[];
  bestPractices?: string;
}

export interface AuditFindingsReport {
  documentId?: number;
  documentName: string;
  documentType?: string;
  complianceFramework: string;
  frameworkVersion?: string;
  
  findings: AuditFinding[];
  
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  
  executiveSummary: string;
  overallRiskLevel?: string;
  complianceStatus?: string;
  complianceScore?: number;
  compliancePercentage?: number;
  riskSummary?: string;
  
  generatedAt: string;
  generatedBy?: string;
  nextReviewDate?: string;
  
  priorityRecommendations?: string[];
  quickWins?: string[];
  actionPlan?: string;
  
  analysisQuality?: string;
  totalControlsReviewed?: number;
  controlsCompliant?: number;
  controlsPartiallyCompliant?: number;
  controlsNonCompliant?: number;
}

class AuditFindingsService {
  /**
   * Generate audit findings from uploaded file
   */
  async generateFindings(file: File, standard: string): Promise<AuditFindingsReport> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('standard', standard);
    
    const response = await api.post<{ data: AuditFindingsReport }>(
      `/api/audit-findings/upload-and-generate`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.data;
  }

  /**
   * Generate audit findings from pasted text
   */
  async generateFindingsFromText(
    text: string,
    standard: string,
    documentName: string
  ): Promise<AuditFindingsReport> {
    console.log('🔍 Generating findings from text...', {
      textLength: text.length,
      standard,
      documentName
    });

    const response = await api.post<{ data: AuditFindingsReport; status: string; message: string }>(
      `/api/audit-findings/generate-from-text`,
      {
        documentText: text,        // Backend expects 'documentText'
        framework: standard,       // Backend expects 'framework'
        fileName: documentName,    // Backend expects 'fileName'
      }
    );
    
    console.log('✅ Findings generated successfully:', response.data);
    
    // Backend returns: { data: {...}, status: "success", message: "..." }
    return response.data.data;
  }

  /**
   * Generate findings for existing document by ID
   */
  async generateFindingsForDocument(
    documentId: number,
    framework: string
  ): Promise<AuditFindingsReport> {
    const response = await api.post<{ data: AuditFindingsReport }>(
      `/api/audit-findings/generate?documentId=${documentId}&framework=${framework}`
    );
    
    return response.data.data;
  }

  /**
   * Get remediation guidance for a specific finding
   */
  async getRemediationGuidance(
    documentId: number,
    findingDescription: string
  ): Promise<string> {
    const response = await api.post<{ status: string; guidance: string }>(
      `/api/audit-findings/remediation-guidance`,
      {
        documentId,
        findingDescription,
      }
    );
    
    return response.data.guidance;
  }
}

export const auditFindingsService = new AuditFindingsService();