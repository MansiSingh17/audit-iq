import api from './api';

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

export type Document = AuditDocument;

export const documentService = {
  uploadDocument: async (file: File, standard: string, uploadedBy: string = 'system') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('standard', standard);
    formData.append('uploadedBy', uploadedBy);

    const response = await api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getAllDocuments: async (): Promise<AuditDocument[]> => {
    const response = await api.get('/api/documents');
    return response.data;
  },

  getDocumentById: async (id: number): Promise<AuditDocument> => {
    const response = await api.get(`/api/documents/${id}`);
    return response.data;
  },

  analyzeDocument: async (id: number) => {
    const response = await api.post(`/api/documents/${id}/analyze`);
    return response.data;
  },

  deleteDocument: async (id: number) => {
    await api.delete(`/api/documents/${id}`);
  },

  // NEW: View document inline (opens in browser)
  viewDocument: async (id: number): Promise<Blob> => {
    const response = await api.get(`/api/documents/${id}/view`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Download document (forces download)
  downloadDocument: async (id: number): Promise<Blob> => {
    const response = await api.get(`/api/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  getDocumentsByStandard: async (standard: string): Promise<AuditDocument[]> => {
    const response = await api.get(`/api/documents/standard/${standard}`);
    return response.data;
  },

  getDocumentsByStatus: async (status: string): Promise<AuditDocument[]> => {
    const response = await api.get(`/api/documents/status/${status}`);
    return response.data;
  },

  getRecentDocuments: async (): Promise<AuditDocument[]> => {
    const response = await api.get('/api/documents/recent');
    return response.data;
  }
};