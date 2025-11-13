import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minute timeout for AI processing
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}:`, error.response.data);
      
      // Handle specific error cases
      if (error.response.status === 403) {
        console.error('🚫 Access Forbidden - Check CORS and authentication');
      } else if (error.response.status === 500) {
        console.error('💥 Server Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('📡 No Response from Server:', error.message);
    } else {
      console.error('⚠️ Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

// Audit Findings API
export const auditFindingsApi = {
  generateFromText: (documentText: string, framework: string, fileName: string) => {
    return api.post('/api/audit-findings/generate-from-text', {
      documentText,
      framework,
      fileName
    });
  },

  generateFromDocument: (documentId: number, framework: string) => {
    return api.post(`/api/audit-findings/generate?documentId=${documentId}&framework=${framework}`);
  },

  getRemediationGuidance: (documentId: number, findingDescription: string) => {
    return api.post('/api/audit-findings/remediation-guidance', {
      documentId,
      findingDescription
    });
  }
};

// Chat API
export const chatApi = {
  sendMessage: (message: string, conversationId?: number) => {
    return api.post('/api/chat/message', {
      message,
      conversationId
    });
  },

  getConversations: () => {
    return api.get('/api/chat/conversations');
  },

  getConversation: (conversationId: number) => {
    return api.get(`/api/chat/conversation/${conversationId}`);
  },

  deleteConversation: (conversationId: number) => {
    return api.delete(`/api/chat/conversation/${conversationId}`);
  },

  generatePolicy: (policyType: string, requirements: string, conversationId?: number) => {
    return api.post('/api/chat/generate-policy', {
      policyType,
      requirements,
      conversationId
    });
  },

  improvePolicy: (policyText: string, improvementGoals: string, conversationId?: number) => {
    return api.post('/api/chat/improve-policy', {
      policyText,
      improvementGoals,
      conversationId
    });
  },

  askAboutFinding: (findingDescription: string, documentContext: string, conversationId?: number) => {
    return api.post('/api/chat/ask-about-finding', {
      findingDescription,
      documentContext,
      conversationId
    });
  }
};