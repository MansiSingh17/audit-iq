export interface Document {
  id: number;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  status: DocumentStatus;
  standard: ComplianceStandard;
  extractedText?: string;
  summary?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  analyzedAt?: string;
}

export enum DocumentStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  ANALYZED = 'ANALYZED',
  FAILED = 'FAILED',
}

export enum ComplianceStandard {
  ISO_27001 = 'ISO_27001',
  GDPR = 'GDPR',
  HIPAA = 'HIPAA',
  SOC2 = 'SOC2',
  CUSTOM = 'CUSTOM',
}

export interface DocumentUploadResponse {
  documentId: number;
  fileName: string;
  s3Url: string;
  status: string;
  message: string;
}