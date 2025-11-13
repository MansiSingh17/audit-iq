import api from './api';

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  timestamp: string;
  context?: string;
  suggestedQuestions?: SuggestedQuestion[];
}

export interface SuggestedQuestion {
  question: string;
  category: string;
  icon: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: number | null;  // ✅ Changed to number to match backend
  context?: string;
  standard?: string;
  documentContext?: string;
}

// ✅ NEW: Matches actual backend response
export interface ChatResponse {
  conversationId: number;  // Backend returns number, not string
  message: string;         // Backend returns "message", not "response"
  timestamp: string;
}

// Old interface for backward compatibility
export interface LegacyChatResponse {
  response: string;
  conversationId: string;
  suggestedQuestions: SuggestedQuestion[];
  relatedControls: string[];
  confidence: string;
}

export const chatService = {
  /**
   * Send chat message and get AI response
   */
  sendMessage: async (
    message: string,
    conversationId: number | null = null,
    context: string = '',
    standard: string = ''
  ): Promise<ChatResponse> => {
    console.log('📤 Sending chat message:', { message, conversationId, context, standard });
    
    const request: ChatRequest = {
      message,
      conversationId,
      context,
      standard,
    };

    const response = await api.post<ChatResponse>('/api/chat/message', request);
    
    console.log('📥 Received chat response:', response.data);
    
    return response.data;
  },

  /**
   * Get conversation history
   */
  getConversationHistory: async (conversationId: number): Promise<ChatMessage[]> => {
    const response = await api.get<{ conversationId: number; messages: any[] }>(
      `/api/chat/conversation/${conversationId}`
    );
    return response.data.messages || [];
  },

  /**
   * Get all conversations
   */
  getConversations: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/api/chat/conversations');
    return response.data;
  },

  /**
   * Delete conversation
   */
  deleteConversation: async (conversationId: number): Promise<void> => {
    await api.delete(`/api/chat/conversation/${conversationId}`);
  },

  /**
   * Generate policy
   */
  generatePolicy: async (
    policyType: string,
    requirements: string,
    conversationId?: number | null
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat/generate-policy', {
      policyType,
      requirements,
      conversationId,
    });
    return response.data;
  },

  /**
   * Improve policy
   */
  improvePolicy: async (
    policyText: string,
    improvementGoals: string,
    conversationId?: number | null
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat/improve-policy', {
      policyText,
      improvementGoals,
      conversationId,
    });
    return response.data;
  },

  /**
   * Ask about finding
   */
  askAboutFinding: async (
    findingDescription: string,
    documentContext: string,
    conversationId?: number | null
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat/ask-about-finding', {
      findingDescription,
      documentContext,
      conversationId,
    });
    return response.data;
  },

  /**
   * Get contextual suggested questions (mock implementation)
   */
  getSuggestions: async (_context?: string, _standard?: string): Promise<SuggestedQuestion[]> => {
    // This is a frontend-only feature, return mock data
    return [
      { question: 'What are the key requirements?', category: 'Requirements', icon: '📋' },
      { question: 'How do I implement this control?', category: 'Implementation', icon: '🔧' },
      { question: 'What are the best practices?', category: 'Best Practices', icon: '✨' },
    ];
  },
};