import { useState, useEffect } from 'react';
import { documentService, Document } from '../services/documentService';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const refreshDocuments = () => {
    loadDocuments();
  };

  return { documents, loading, error, refreshDocuments };
};