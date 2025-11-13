import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, TrendingUp, Shield, FileText, Sparkles, Moon, Sun } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import Alert from './common/Alert';
import { documentAnalysisService, AnalysisResult } from '../services/documentAnalysisService';

type ComplianceStandard = 'ISO_27001' | 'GDPR' | 'HIPAA';

const DocumentAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>('ISO_27001');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
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

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a document to analyze');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      
      const result = await documentAnalysisService.analyzeDocument(selectedFile, selectedStandard);
      setAnalysisResult(result);
      
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze document');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'MEDIUM':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'LOW':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (analysisResult) {
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
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          
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
                Document Analysis Results
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-lg`}>
                {analysisResult.documentName} • {selectedStandard.replace('_', ' ')}
              </p>
            </div>
            <Button onClick={handleReset} variant="gradient" className="hover:scale-105 transition-transform shadow-lg">
              Analyze Another Document
            </Button>
          </div>

          {/* Enhanced Overall Assessment Card */}
          <Card variant="glass" className={`mb-6 sm:mb-8 shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up hover:shadow-3xl transition-all hover:-translate-y-1`}>
            <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <div className="flex-1 w-full">
                  <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-3`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur-md opacity-50 animate-pulse"></div>
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                    Overall Assessment
                  </h2>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-6 text-base sm:text-lg leading-relaxed`}>
                    {analysisResult.overallAssessment.summary}
                  </p>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md group hover:scale-105 transition-transform">
                      <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                        {analysisResult.overallAssessment.score}
                      </div>
                      <div className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {analysisResult.overallAssessment.rating}
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md group hover:scale-105 transition-transform hover:shadow-xl">
                      <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-1 group-hover:scale-110 transition-transform">
                        {analysisResult.overallAssessment.criticalIssues}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Critical Issues</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md group hover:scale-105 transition-transform hover:shadow-xl">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 group-hover:scale-110 transition-transform">
                        {analysisResult.overallAssessment.warnings}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Warnings</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md group hover:scale-105 transition-transform hover:shadow-xl">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 group-hover:scale-110 transition-transform">
                        {analysisResult.overallAssessment.recommendations}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium`}>Recommendations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {analysisResult.criticalFlags && analysisResult.criticalFlags.length > 0 && (
            <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Critical Flags ({analysisResult.criticalFlags.length})
              </h2>
              <div className="space-y-4">
                {analysisResult.criticalFlags.map((flag, index) => (
                  <div key={flag.id} className="group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl"></div>
                      <Card variant="glass" className={`relative border-l-4 border-red-500 hover:shadow-2xl transition-all hover:-translate-y-1 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}`}>
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                            <div className="flex-1 w-full">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(flag.severity)}`}>
                                  {flag.severity}
                                </span>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>{flag.location}</span>
                              </div>
                              <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                                {flag.title}
                              </h3>
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-base`}>{flag.description}</p>
                            </div>
                          </div>
                          <div className={`${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} border-2 rounded-xl p-4 sm:p-5`}>
                            <div className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-2 flex items-center gap-2 text-sm sm:text-base`}>
                              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                              Recommendation:
                            </div>
                            <p className={`${darkMode ? 'text-blue-200' : 'text-blue-800'} leading-relaxed text-sm sm:text-base`}>{flag.recommendation}</p>
                          </div>
                          {flag.affectedControls && flag.affectedControls.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {flag.affectedControls.map((control, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold border border-purple-200 dark:border-purple-700">
                                  {control}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisResult.improvements && analysisResult.improvements.length > 0 && (
            <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Improvement Suggestions ({analysisResult.improvements.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {analysisResult.improvements.map((improvement, index) => (
                  <div key={improvement.id} className="group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl"></div>
                      <Card variant="glass" className={`relative h-full hover:shadow-2xl transition-all hover:-translate-y-1 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}`}>
                        <div className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-bold border border-blue-300 dark:border-blue-700">
                                  Priority {improvement.priority}
                                </span>
                                <span className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-bold">
                                  {improvement.category}
                                </span>
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                                  improvement.effort === 'LOW' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700' :
                                  improvement.effort === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700' :
                                  'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700'
                                }`}>
                                  {improvement.effort} Effort
                                </span>
                              </div>
                              <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                                {improvement.title}
                              </h3>
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-base`}>{improvement.description}</p>
                            </div>
                          </div>
                          <div className={`${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} border-2 rounded-xl p-3 sm:p-4`}>
                            <div className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-900'} mb-2 flex items-center gap-2 text-sm sm:text-base`}>
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              Benefit:
                            </div>
                            <p className={`${darkMode ? 'text-green-200' : 'text-green-800'} leading-relaxed text-sm sm:text-base`}>{improvement.benefit}</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar enhancements for Compliance Gaps and Risk Areas sections... */}
          {analysisResult.complianceGaps && analysisResult.complianceGaps.length > 0 && (
            <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Compliance Gaps ({analysisResult.complianceGaps.length})
              </h2>
              <div className="space-y-4">
                {analysisResult.complianceGaps.map((gap, index) => (
                  <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl"></div>
                      <Card variant="glass" className={`relative border-l-4 border-orange-500 hover:shadow-2xl transition-all hover:-translate-y-1 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}`}>
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                            <span className={`px-3 py-1 ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-200 text-gray-800 border-gray-300'} rounded-lg text-xs sm:text-sm font-bold font-mono border`}>
                              {gap.controlId}
                            </span>
                            <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {gap.controlName}
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div className={`p-3 sm:p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-white/80'} rounded-xl border-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                              <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-2`}>Current State:</div>
                              <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{gap.currentState}</p>
                            </div>
                            <div className={`p-3 sm:p-4 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'} rounded-xl border-2`}>
                              <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-2`}>Expected State:</div>
                              <p className={`text-xs sm:text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'} leading-relaxed`}>{gap.expectedState}</p>
                            </div>
                          </div>
                          <div className={`${darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300'} border-2 rounded-xl p-3 sm:p-4 mb-4`}>
                            <div className={`font-bold ${darkMode ? 'text-orange-300' : 'text-orange-900'} mb-2 flex items-center gap-2 text-sm sm:text-base`}>
                              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                              Gap:
                            </div>
                            <p className={`${darkMode ? 'text-orange-200' : 'text-orange-800'} leading-relaxed text-xs sm:text-sm`}>{gap.gap}</p>
                          </div>
                          {gap.remediationSteps && gap.remediationSteps.length > 0 && (
                            <div className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'} rounded-xl p-3 sm:p-4 border-2`}>
                              <div className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-3 text-sm sm:text-base`}>Remediation Steps:</div>
                              <ol className="list-decimal list-inside space-y-2">
                                {gap.remediationSteps.map((step, idx) => (
                                  <li key={idx} className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisResult.riskAreas && analysisResult.riskAreas.length > 0 && (
            <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <h2 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-3`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl blur-md opacity-50"></div>
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                    <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                Risk Areas ({analysisResult.riskAreas.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {analysisResult.riskAreas.map((risk, index) => (
                  <div key={risk.id} className="group animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl"></div>
                      <Card variant="glass" className={`relative h-full hover:shadow-2xl transition-all hover:-translate-y-1 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}`}>
                        <div className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(risk.riskLevel)}`}>
                                  {risk.riskLevel} RISK
                                </span>
                              </div>
                              <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                                {risk.title}
                              </h3>
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-sm sm:text-base`}>{risk.description}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                            <div className={`${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'} border-2 rounded-xl p-3 sm:p-4`}>
                              <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-red-300' : 'text-red-900'} mb-2`}>Impact:</div>
                              <p className={`text-xs sm:text-sm ${darkMode ? 'text-red-200' : 'text-red-800'}`}>{risk.impact}</p>
                            </div>
                            <div className={`${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'} border-2 rounded-xl p-3 sm:p-4`}>
                              <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-900'} mb-2`}>Likelihood:</div>
                              <p className={`text-xs sm:text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>{risk.likelihood}</p>
                            </div>
                          </div>
                          {risk.mitigationActions && risk.mitigationActions.length > 0 && (
                            <div className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white/80 border-gray-200'} rounded-xl p-3 sm:p-4 border-2`}>
                              <div className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-2 flex items-center gap-2 text-sm sm:text-base`}>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Mitigation Actions:
                              </div>
                              <ul className="list-disc list-inside space-y-1">
                                {risk.mitigationActions.map((action, idx) => (
                                  <li key={idx} className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
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
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        
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
            AI Document Analysis
          </h1>
          <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Upload your policy document to identify critical flags, improvement suggestions, compliance gaps, and risk areas
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
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center animate-bounce-in">
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
              <label className={`block text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Document
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
                    <div className="mt-6 inline-block animate-bounce-in">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 blur opacity-50 rounded-xl"></div>
                        <div className={`relative p-3 sm:p-4 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'} border-2 rounded-xl`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                              {selectedFile.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="error" className="mb-6 sm:mb-8 animate-shake">
                {error}
              </Alert>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!selectedFile || analyzing}
              variant="gradient"
              size="lg"
              loading={analyzing}
              className="w-full shadow-2xl hover:scale-105 transition-transform"
              icon={!analyzing ? <Sparkles className="w-5 h-5" /> : undefined}
            >
              {analyzing ? 'Analyzing Document...' : 'Analyze Document with AI'}
            </Button>

            <div className="mt-6 sm:mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 sm:p-6 shadow-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  What will be analyzed:
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/90">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>🚩 Critical security flags and missing requirements</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>💡 Actionable improvement suggestions</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>📋 Compliance gaps vs {selectedStandard.replace('_', ' ')} requirements</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span>⚠️ Potential risk areas and vulnerabilities</span>
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
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 25s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default DocumentAnalyzer;