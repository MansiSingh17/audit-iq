import { useState, useEffect } from 'react';
import { checklistService, Checklist } from '../services/checklistService';

export const useChecklists = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      const data = await checklistService.getAllChecklists();
      setChecklists(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load checklists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecklists();
  }, []);

  const refreshChecklists = () => {
    loadChecklists();
  };

  return { checklists, loading, error, refreshChecklists };
};