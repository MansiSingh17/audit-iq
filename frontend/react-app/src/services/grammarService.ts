import api from './api';

// Interface for individual grammar correction
export interface GrammarCorrection {
  original: string;
  corrected: string;
  type: string;
  message: string;
  offset: number;
  length: number;
  position?: number;
  suggestion?: string;
}

// Interface for grammar correction request
export interface GrammarCorrectionRequest {
  text: string;
  language?: string;
  returnSuggestions?: boolean;
}

// Interface for grammar correction response
export interface GrammarCorrectionResponse {
  originalText: string;
  correctedText: string;
  corrections: GrammarCorrection[];
  language: string;
  processingTimeMs: number;
}

class GrammarService {
  async correctGrammar(text: string, language: string = 'en'): Promise<GrammarCorrectionResponse> {
    try {
      const request: GrammarCorrectionRequest = {
        text,
        language,
        returnSuggestions: true,
      };

      const response = await api.post<GrammarCorrectionResponse>(
        '/api/grammar/correct',  // Changed: removed ${API_URL}
        request
      );

      return response.data;
    } catch (error: any) {
      console.error('Error correcting grammar:', error);
      throw new Error(error.response?.data?.message || 'Failed to correct grammar');
    }
  }

  async batchCorrectGrammar(
    texts: string[],
    language: string = 'en'
  ): Promise<GrammarCorrectionResponse[]> {
    try {
      const requests = texts.map((text) => ({
        text,
        language,
        returnSuggestions: true,
      }));

      const response = await api.post<GrammarCorrectionResponse[]>(
        '/api/grammar/batch-correct',  // Changed: removed ${API_URL}
        requests
      );

      return response.data;
    } catch (error: any) {
      console.error('Error in batch grammar correction:', error);
      throw new Error(error.response?.data?.message || 'Failed to batch correct grammar');
    }
  }

  async getSupportedLanguages(): Promise<string[]> {
    try {
      const response = await api.get<string[]>('/api/grammar/languages');  // Changed
      return response.data;
    } catch (error: any) {
      console.error('Error fetching supported languages:', error);
      return ['en', 'es', 'fr', 'de', 'it'];
    }
  }

  async checkServiceHealth(): Promise<boolean> {
    try {
      const response = await api.get('/api/grammar/health');  // Changed
      return response.status === 200;
    } catch (error) {
      console.error('Grammar service health check failed:', error);
      return false;
    }
  }
}

export const grammarService = new GrammarService();
export default grammarService;