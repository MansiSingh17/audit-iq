import React, { useState } from 'react';
import { Upload, AlertTriangle, Clock, TrendingUp, FileText, CheckCircle, Sparkles, Shield, Moon, Sun } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { auditFindingsService, AuditFindingsReport, AuditFinding } from '../services/auditFindingsService';

type ComplianceStandard = 'ISO_27001' | 'GDPR' | 'HIPAA';
type InputMode = 'file' | 'text';

const AuditFindings: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>('ISO_27001');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<AuditFindingsReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const standards = [
    { value: 'ISO_27001', label: 'ISO 27001:2022', description: 'Information Security Management', icon: '🔒', color: 'from-blue-600 to-indigo-600' },
    { value: 'GDPR', label: 'GDPR', description: 'EU Data Protection Regulation', icon: '🛡️', color: 'from-green-600 to-emerald-600' },
    { value: 'HIPAA', label: 'HIPAA', description: 'Healthcare Privacy & Security', icon: '🏥', color: 'from-purple-600 to-fuchsia-600' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (inputMode === 'file' && !selectedFile) {
      setError('Please select a document');
      return;
    }

    if (inputMode === 'text' && !textInput.trim()) {
      setError('Please enter or paste text');
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      
      let result: AuditFindingsReport;
      
      if (inputMode === 'file' && selectedFile) {
        result = await auditFindingsService.generateFindings(selectedFile, selectedStandard);
      } else {
        result = await auditFindingsService.generateFindingsFromText(textInput, selectedStandard, 'Pasted Text');
      }
      
      setReport(result);
      
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate findings');
    } finally {
      setGenerating(false);
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return darkMode ? 'bg-red-900/30 text-red-300 border-red-700' : 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH': return darkMode ? 'bg-orange-900/30 text-orange-300 border-orange-700' : 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM': return darkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW': return darkMode ? 'bg-green-900/30 text-green-300 border-green-700' : 'bg-green-100 text-green-800 border-green-300';
      default: return darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'MEDIUM': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'LOW': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return null;
    }
  };

  const renderFinding = (finding: AuditFinding, index: number) => (
    <div key={finding.id || Math.random()} className="group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="relative">
        <div className={`absolute inset-0 ${
          finding.severity?.level === 'CRITICAL' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
          finding.severity?.level === 'HIGH' ? 'bg-gradient-to-r from-orange-500 to-amber-600' :
          finding.severity?.level === 'MEDIUM' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
          'bg-gradient-to-r from-green-500 to-emerald-600'
        } opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}></div>
        
        <Card 
          variant="glass" 
          className={`relative mb-4 sm:mb-6 border-l-4 ${
            finding.severity?.level === 'CRITICAL' ? 'border-red-500' :
            finding.severity?.level === 'HIGH' ? 'border-orange-500' :
            finding.severity?.level === 'MEDIUM' ? 'border-yellow-500' :
            'border-green-500'
          } hover:shadow-2xl transition-all hover:-translate-y-1 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}`}
        >
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <div className="group/icon">
                    {getSeverityIcon(finding.severity?.level || 'MEDIUM')}
                  </div>
                  <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold border-2 ${getSeverityColor(finding.severity?.level || 'MEDIUM')}`}>
                    {finding.severity?.level || 'MEDIUM'}
                  </span>
                  <span className={`px-2 sm:px-3 py-1 ${darkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'} rounded-full text-xs font-bold border`}>
                    Impact: {finding.impactScore || 5}/10
                  </span>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>{finding.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-lg`}>{finding.description}</p>
              </div>
            </div>

            {finding.evidence && (
              <div className={`${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'} border-2 rounded-xl p-3 sm:p-4 mb-4`}>
                <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-900'} mb-2 flex items-center gap-2`}>
                  <FileText className="w-4 h-4" />
                  Evidence:
                </div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'} italic leading-relaxed`}>{finding.evidence}</p>
              </div>
            )}

            {finding.severity && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div className={`${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'} border-2 rounded-xl p-3 sm:p-4`}>
                  <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-red-300' : 'text-red-900'} mb-2`}>Business Impact:</div>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-red-200' : 'text-red-800'} leading-relaxed`}>{finding.severity.businessImpact || 'Not specified'}</p>
                </div>
                <div className={`${darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'} border-2 rounded-xl p-3 sm:p-4`}>
                  <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-orange-300' : 'text-orange-900'} mb-2`}>Technical Impact:</div>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-orange-200' : 'text-orange-800'} leading-relaxed`}>{finding.severity.technicalImpact || 'Not specified'}</p>
                </div>
              </div>
            )}

            <div className={`${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} border-2 rounded-xl p-4 sm:p-5 mb-4`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1`}>Remediation Timeline:</div>
                  <p className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>{finding.recommendedTimeline || finding.remediationTimeline || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {finding.remediationSteps && finding.remediationSteps.length > 0 && (
              <div className="mb-4">
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 sm:mb-4 text-base sm:text-lg`}>Remediation Steps:</h4>
                <div className="space-y-2 sm:space-y-3">
                  {finding.remediationSteps.map((step) => (
                    <div key={step.stepNumber} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'} backdrop-blur-sm rounded-xl border-2 hover:border-blue-400 hover:shadow-md transition-all`}>
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} leading-relaxed`}>{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {finding.bestPractices && (
              <div className="mb-4">
                <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-2 text-base sm:text-lg`}>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Best Practices:
                </h4>
                <div className={`${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} border-2 rounded-xl p-3 sm:p-4`}>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-green-200' : 'text-green-800'} leading-relaxed`}>{finding.bestPractices}</p>
                </div>
              </div>
            )}

            {finding.affectedControls && finding.affectedControls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Affected Controls:</span>
                {finding.affectedControls.map((control, idx) => (
                  <span key={idx} className={`px-2 sm:px-3 py-1 ${darkMode ? 'bg-purple-900/30 text-purple-300 border-purple-700' : 'bg-purple-100 text-purple-700 border-purple-200'} rounded-lg text-xs font-bold border`}>
                    {control}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  if (report) {
    const criticalFindings = report.findings?.filter(f => f.severity?.level === 'CRITICAL') || [];
    const highFindings = report.findings?.filter(f => f.severity?.level === 'HIGH') || [];
    const mediumFindings = report.findings?.filter(f => f.severity?.level === 'MEDIUM') || [];
    const lowFindings = report.findings?.filter(f => f.severity?.level === 'LOW') || [];

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} relative overflow-hidden transition-colors duration-500`}>
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white/90 shadow-lg hover:scale-110 transition-all backdrop-blur-xl border-2 border-gray-200"
        >
          {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
        </button>

        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-40"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
          
          {/* More Floating Particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
                Draft Audit Findings Report
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-lg`}>{report.documentName} • {report.complianceFramework}</p>
            </div>
            <Button onClick={() => setReport(null)} variant="gradient" className="hover:scale-105 transition-transform shadow-lg">
              Generate New Report
            </Button>
          </div>

          <Card variant="glass" className={`mb-6 sm:mb-8 shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} animate-fade-in-up hover:shadow-3xl transition-all hover:-translate-y-1`}>
            <div className={`p-6 sm:p-8 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} rounded-xl`}>
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur-md opacity-50 animate-pulse"></div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Executive Summary
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
                {[
                  { label: 'Total Findings', value: report.totalFindings || 0, color: 'blue' },
                  { label: 'Compliance', value: `${report.compliancePercentage || report.complianceScore || 0}%`, color: 'green' },
                  { label: 'Risk Level', value: report.riskSummary ? report.riskSummary.split(':')[0] : 'Moderate', color: (report.criticalCount || 0) > 0 ? 'red' : 'yellow' },
                  { label: 'Critical / High', value: `${report.criticalCount || 0} / ${report.highCount || 0}`, color: 'purple' }
                ].map((stat, idx) => (
                  <div key={stat.label} className={`group text-center p-4 sm:p-5 ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'} backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 animate-fade-in-up`} style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className={`text-3xl sm:text-4xl font-black text-${stat.color}-600 mb-2 group-hover:scale-110 transition-transform`}>{stat.value}</div>
                    <div className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {report.executiveSummary && (
                <div className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'} backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border-2`}>
                  <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 text-base sm:text-lg`}>Summary:</h4>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-line leading-relaxed`}>{report.executiveSummary}</p>
                </div>
              )}
            </div>
          </Card>

          {criticalFindings.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3 animate-fade-in`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg animate-pulse hover:scale-110 hover:rotate-6 transition-transform">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Critical Findings ({criticalFindings.length}) - Remediate within 24 Hours
              </h2>
              {criticalFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}

          {highFindings.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3 animate-fade-in`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                High Priority Findings ({highFindings.length}) - Remediate within 7 Days
              </h2>
              {highFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}

          {mediumFindings.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3 animate-fade-in`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Medium Priority Findings ({mediumFindings.length}) - Remediate within 30 Days
              </h2>
              {mediumFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}

          {lowFindings.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3 animate-fade-in`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Low Priority Findings ({lowFindings.length}) - Remediate within 90 Days
              </h2>
              {lowFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}
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
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-float { animation: float 20s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
          .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
          .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        `}</style>
      </div>
    );
  }

  // Input form view
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} relative overflow-hidden transition-colors duration-500`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white/90 shadow-lg hover:scale-110 transition-all backdrop-blur-xl border-2 border-gray-200"
      >
        {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
      </button>

      {/* Enhanced Background with particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 hover:rotate-6 transition-transform">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            Draft Audit Findings Generator
          </h1>
          <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Generate professional audit findings with severity levels, remediation timelines, and best practices
          </p>
        </div>

        <Card variant="glass" className={`shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up`}>
          <div className="p-6 sm:p-8">
            <div className="mb-6 sm:mb-8">
              <label className={`block text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5 text-blue-600" />
                Select Compliance Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {standards.map((standard) => (
                  <div
                    key={standard.value}
                    onClick={() => setSelectedStandard(standard.value as ComplianceStandard)}
                    className="group cursor-pointer"
                  >
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${standard.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}></div>
                      <div className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
                        selectedStandard === standard.value
                          ? 'border-transparent shadow-xl bg-gradient-to-br ' + standard.color + ' text-white scale-105'
                          : `${darkMode ? 'border-gray-700 bg-gray-900 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'} hover:shadow-lg`
                      }`}>
                        <div className="text-center">
                          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">{standard.icon}</div>
                          <h3 className={`text-sm sm:text-base font-bold mb-1 sm:mb-2 ${
                            selectedStandard === standard.value ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {standard.label}
                          </h3>
                          <p className={`text-xs ${
                            selectedStandard === standard.value ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {standard.description}
                          </p>
                        </div>
                        {selectedStandard === standard.value && (
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 sm:mb-8">
              <label className={`block text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Input Method
              </label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => setInputMode('text')}
                  className={`p-4 sm:p-6 border-2 rounded-2xl transition-all duration-300 ${
                    inputMode === 'text'
                      ? `${darkMode ? 'border-blue-500 bg-blue-900/30' : 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'} shadow-lg scale-105`
                      : `${darkMode ? 'border-gray-700 bg-gray-900 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'} hover:shadow-md`
                  }`}
                >
                  <div className="text-center">
                    <FileText className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${inputMode === 'text' ? 'text-blue-600' : darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <div className={`font-bold mb-1 text-sm sm:text-base ${inputMode === 'text' ? (darkMode ? 'text-blue-300' : 'text-blue-900') : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Paste Text</div>
                    <div className={`text-xs ${inputMode === 'text' ? (darkMode ? 'text-blue-400' : 'text-blue-700') : (darkMode ? 'text-gray-500' : 'text-gray-500')}`}>Quick analysis from copied text</div>
                  </div>
                </button>
                <button
                  onClick={() => setInputMode('file')}
                  className={`p-4 sm:p-6 border-2 rounded-2xl transition-all duration-300 ${
                    inputMode === 'file'
                      ? `${darkMode ? 'border-blue-500 bg-blue-900/30' : 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'} shadow-lg scale-105`
                      : `${darkMode ? 'border-gray-700 bg-gray-900 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'} hover:shadow-md`
                  }`}
                >
                  <div className="text-center">
                    <Upload className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${inputMode === 'file' ? 'text-blue-600' : darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <div className={`font-bold mb-1 text-sm sm:text-base ${inputMode === 'file' ? (darkMode ? 'text-blue-300' : 'text-blue-900') : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Upload File</div>
                    <div className={`text-xs ${inputMode === 'file' ? (darkMode ? 'text-blue-400' : 'text-blue-700') : (darkMode ? 'text-gray-500' : 'text-gray-500')}`}>Analyze document files</div>
                  </div>
                </button>
              </div>
            </div>

            {inputMode === 'text' && (
              <div className="mb-6 sm:mb-8">
                <label className={`block text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Paste Policy/Procedure Text or Findings
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your policy document, procedure, or audit observations here..."
                  className={`w-full h-64 sm:h-96 px-4 sm:px-5 py-3 sm:py-4 border-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white/80'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs sm:text-sm transition-all backdrop-blur-sm shadow-lg`}
                />
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-3 font-medium`}>
                  Paste findings, observations, or policy text. The AI will analyze and generate professional audit findings.
                </p>
              </div>
            )}

            {inputMode === 'file' && (
              <div className="mb-6 sm:mb-8">
                <label className={`block text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Upload Policy/Procedure Document
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-2xl"></div>
                  <div className={`relative border-2 border-dashed ${darkMode ? 'border-gray-600 group-hover:border-blue-500 bg-gray-900' : 'border-gray-300 group-hover:border-blue-400 bg-white/80'} rounded-2xl p-8 sm:p-10 text-center transition-all backdrop-blur-sm`}>
                    <Upload className={`w-12 h-12 sm:w-16 sm:h-16 ${darkMode ? 'text-gray-500 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-500'} mx-auto mb-4 transition-all group-hover:scale-110`} />
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-bold text-base sm:text-lg">
                        Click to upload
                      </span>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}> or drag and drop</span>
                    </label>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-3`}>
                      PDF, DOC, DOCX, or TXT (max 10MB)
                    </p>
                    {selectedFile && (
                      <div className="mt-6 inline-block">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 blur opacity-50 rounded-xl"></div>
                          <div className={`relative p-3 sm:p-4 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'} border-2 rounded-xl`}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>{selectedFile.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className={`mb-6 sm:mb-8 p-4 sm:p-5 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'} border-2 rounded-xl`}>
                <p className={`text-sm font-bold ${darkMode ? 'text-red-300' : 'text-red-800'} flex items-center gap-2`}>
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={generating || (inputMode === 'file' && !selectedFile) || (inputMode === 'text' && !textInput.trim())}
              variant="gradient"
              size="lg"
              loading={generating}
              className="w-full shadow-2xl mb-6 sm:mb-8 hover:scale-105 transition-transform"
              icon={!generating ? <Sparkles className="w-5 h-5" /> : undefined}
            >
              {generating ? 'Generating Audit Findings...' : 'Generate Draft Audit Findings'}
            </Button>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 sm:p-6 shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  What's included:
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/90">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>🎯 Severity levels with impact scores (Critical, High, Medium, Low)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>⏱️ Remediation timelines (24hr, 7 days, 30 days, 90 days)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>📋 Grammar-corrected, audit-ready documentation</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>✨ Industry best practices and benchmarks</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>🔗 Framework alignments (ISO, NIST, CIS, SOC 2)</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>📝 Executive summary for leadership</span>
                  </li>
                </ul>
              </div>
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
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AuditFindings;