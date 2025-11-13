import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Shield, AlertCircle, BarChart3 } from 'lucide-react';
import { riskService, RiskAssessment } from '../services/riskService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './common/Card';
import Button from './common/Button';
import Loader from './common/Loader';
import toast from 'react-hot-toast';

const RISK_COLORS = {
  CRITICAL: '#DC2626',
  HIGH: '#EA580C',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
};

const RiskDashboard: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (documentId) {
      loadRiskAssessment();
    }
  }, [documentId]);

  const loadRiskAssessment = async () => {
    if (!documentId) return;
    
    try {
      setLoading(true);
      const data = await riskService.assessRisk(Number(documentId));
      setAssessment(data);
    } catch (error) {
      toast.error('Failed to load risk assessment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!assessment) return <div>No risk assessment found</div>;

  const riskData = [
    { name: 'Critical', value: assessment.findings.filter(f => f.riskLevel === 'CRITICAL').length },
    { name: 'High', value: assessment.findings.filter(f => f.riskLevel === 'HIGH').length },
    { name: 'Medium', value: assessment.findings.filter(f => f.riskLevel === 'MEDIUM').length },
    { name: 'Low', value: assessment.findings.filter(f => f.riskLevel === 'LOW').length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Consistent Blue Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Risk Assessment Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive risk analysis and mitigation strategies</p>
        </div>

        <Card variant="glass" className="shadow-2xl mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Risk Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-xl"></div>
                <div className="relative p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Overall Risk</p>
                      <p className="text-3xl font-black text-orange-600">{assessment.overallRiskLevel}</p>
                    </div>
                    <AlertTriangle className="w-12 h-12 text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-xl"></div>
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Risk Score</p>
                      <p className="text-3xl font-black text-blue-600">{assessment.overallRiskScore.toFixed(1)}</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-blue-500" />
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-xl"></div>
                <div className="relative p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border-2 border-red-200 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold mb-1">Total Findings</p>
                      <p className="text-3xl font-black text-red-600">{assessment.findings.length}</p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-red-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Risk Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label
                      outerRadius={80}
                      dataKey="value"
                    >
                      {riskData.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={Object.values(RISK_COLORS)[idx]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Findings by Risk Level
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="shadow-2xl">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              Risk Findings ({assessment.findings.length})
            </h3>
            <div className="space-y-4">
              {assessment.findings.map((finding, idx) => (
                <div
                  key={finding.id}
                  className="p-5 border-l-4 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all"
                  style={{ 
                    borderColor: RISK_COLORS[finding.riskLevel as keyof typeof RISK_COLORS],
                    animationDelay: `${idx * 0.05}s`
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-gray-900 text-lg">{finding.category}</h4>
                    <span className="px-3 py-1.5 text-xs font-bold rounded-full shadow-md" style={{
                      backgroundColor: RISK_COLORS[finding.riskLevel as keyof typeof RISK_COLORS],
                      color: 'white'
                    }}>
                      {finding.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">{finding.finding}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-bold text-red-900 mb-1">Impact:</p>
                      <p className="text-sm text-red-800">{finding.impact}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-bold text-blue-900 mb-1">Mitigation:</p>
                      <p className="text-sm text-blue-800">{finding.mitigation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button onClick={() => navigate('/dashboard')} variant="gradient">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.05); }
          50% { transform: translate(-15px, 15px) scale(0.95); }
          75% { transform: translate(15px, 10px) scale(1.02); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-25px, 20px) scale(1.08); }
          50% { transform: translate(20px, -15px) scale(0.92); }
          75% { transform: translate(-10px, -20px) scale(1.05); }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default RiskDashboard;