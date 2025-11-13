import { useState, useEffect } from 'react';
import { riskService, RiskAssessment } from '../services/riskService';

export const useRiskAssessment = () => {
  const [risks, setRisks] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRisks = async () => {
    try {
      setLoading(true);
      const data = await riskService.getAllAssessments();
      setRisks(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load risk assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  return { risks, loading, error, refetch: loadRisks };
};
