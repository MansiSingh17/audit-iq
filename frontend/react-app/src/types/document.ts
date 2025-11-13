export interface AuditDocument {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  extractedText?: string;
  standard: string;
  status: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadResponse {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Url: string;
  standard: string;
  status: string;
  uploadedBy: string;
  createdAt: string;
  message: string;
}
