import React, { useState } from 'react';
import { Upload, AlertTriangle, CheckCircle, TrendingUp, Shield, FileText, Sparkles } from 'lucide-react';
import Alert from './common/Alert';
import { documentAnalysisService, AnalysisResult } from '../services/documentAnalysisService';

type ComplianceStandard = 'ISO_27001' | 'GDPR' | 'HIPAA';

const DocumentAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>('ISO_27001');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const standards = [
    { value: 'ISO_27001', label: 'ISO 27001:2022', description: 'Information Security Management', icon: '🔒' },
    { value: 'GDPR', label: 'GDPR', description: 'EU Data Protection Regulation', icon: '🛡️' },
    { value: 'HIPAA', label: 'HIPAA', description: 'Healthcare Privacy & Security', icon: '🏥' }
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
        return 'status-critical';
      case 'MEDIUM':
        return 'status-high';
      case 'LOW':
        return 'status-low';
      default:
        return 'status-badge';
    }
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen page-bg-corporate">
        <div className="absolute inset-0 bg-shield-pattern opacity-30 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-corporate">
            <div>
              <h1 className="section-header-corporate !mb-2">
                Analysis Results
              </h1>
              <p className="text-corporate-secondary">
                {analysisResult.documentName} • {selectedStandard.replace('_', ' ')}
              </p>
            </div>
            <button onClick={handleReset} className="btn-corporate-accent">
              Analyze Another Document
            </button>
          </div>

          {/* Overall Assessment */}
          <div className="card-premium hover-lift-corporate mb-8">
            <div className="p-8">
              <h2 className="section-header-corporate flex items-center gap-3 !mb-6">
                <div className="icon-container-corporate">
                  <Shield className="w-6 h-6 text-amber-400" strokeWidth={2.5} />
                </div>
                Overall Assessment
              </h2>
              <p className="text-corporate-secondary text-lg mb-6 leading-relaxed">
                {analysisResult.overallAssessment.summary}
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card-corporate text-center">
                  <div className="text-5xl font-black text-slate-900 mb-2">
                    {analysisResult.overallAssessment.score}
                  </div>
                  <div className="text-sm font-semibold text-slate-600">
                    {analysisResult.overallAssessment.rating}
                  </div>
                </div>
                <div className="stat-card-corporate text-center">
                  <div className="text-3xl font-bold text-red-700 mb-1">
                    {analysisResult.overallAssessment.criticalIssues}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Critical Issues</div>
                </div>
                <div className="stat-card-corporate text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-1">
                    {analysisResult.overallAssessment.warnings}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Warnings</div>
                </div>
                <div className="stat-card-corporate text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {analysisResult.overallAssessment.recommendations}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">Recommendations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Flags */}
          {analysisResult.criticalFlags && analysisResult.criticalFlags.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center shadow-corporate">
                  <AlertTriangle className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                Critical Flags ({analysisResult.criticalFlags.length})
              </h2>
              <div className="space-y-4">
                {analysisResult.criticalFlags.map((flag) => (
                  <div key={flag.id} className="card-corporate hover-lift-corporate border-l-4 border-red-700">
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`status-badge ${getSeverityColor(flag.severity)}`}>
                          {flag.severity}
                        </span>
                        <span className="text-sm text-slate-500 font-medium">{flag.location}</span>
                      </div>
                      <h3 className="text-corporate-primary text-xl mb-3">
                        {flag.title}
                      </h3>
                      <p className="text-corporate-secondary leading-relaxed mb-4">{flag.description}</p>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                        <div className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                          </div>
                          Recommendation:
                        </div>
                        <p className="text-blue-800 leading-relaxed">{flag.recommendation}</p>
                      </div>
                      
                      {flag.affectedControls && flag.affectedControls.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {flag.affectedControls.map((control, idx) => (
                            <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 border-2 border-slate-200 rounded-lg text-xs font-bold">
                              {control}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {analysisResult.improvements && analysisResult.improvements.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="icon-container-gold">
                  <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                Improvement Suggestions ({analysisResult.improvements.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResult.improvements.map((improvement) => (
                  <div key={improvement.id} className="card-corporate hover-lift-corporate h-full">
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 border-2 border-blue-200 rounded-lg text-xs font-bold uppercase">
                          Priority {improvement.priority}
                        </span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 border-2 border-slate-200 rounded-lg text-xs font-bold">
                          {improvement.category}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${
                          improvement.effort === 'LOW' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          improvement.effort === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {improvement.effort} Effort
                        </span>
                      </div>
                      <h3 className="text-corporate-primary text-lg mb-3">
                        {improvement.title}
                      </h3>
                      <p className="text-corporate-secondary leading-relaxed mb-4">{improvement.description}</p>
                      
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4">
                        <div className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                          </div>
                          Benefit:
                        </div>
                        <p className="text-emerald-800 leading-relaxed">{improvement.benefit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Gaps */}
          {analysisResult.complianceGaps && analysisResult.complianceGaps.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-corporate">
                  <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                Compliance Gaps ({analysisResult.complianceGaps.length})
              </h2>
              <div className="space-y-4">
                {analysisResult.complianceGaps.map((gap, index) => (
                  <div key={index} className="card-corporate hover-lift-corporate border-l-4 border-amber-600">
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-lg text-sm font-bold font-mono">
                          {gap.controlId}
                        </span>
                        <h3 className="text-corporate-primary text-xl">
                          {gap.controlName}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
                          <div className="text-sm font-bold text-slate-900 mb-2">Current State:</div>
                          <p className="text-sm text-slate-700 leading-relaxed">{gap.currentState}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                          <div className="text-sm font-bold text-blue-900 mb-2">Expected State:</div>
                          <p className="text-sm text-blue-800 leading-relaxed">{gap.expectedState}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 mb-4">
                        <div className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                          </div>
                          Gap:
                        </div>
                        <p className="text-amber-800 leading-relaxed text-sm">{gap.gap}</p>
                      </div>
                      {gap.remediationSteps && gap.remediationSteps.length > 0 && (
                        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                          <div className="font-bold text-slate-900 mb-3">Remediation Steps:</div>
                          <ol className="list-decimal list-inside space-y-2">
                            {gap.remediationSteps.map((step, idx) => (
                              <li key={idx} className="text-sm text-slate-700 leading-relaxed">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Areas */}
          {analysisResult.riskAreas && analysisResult.riskAreas.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-gold">
                  <AlertTriangle className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                Risk Areas ({analysisResult.riskAreas.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResult.riskAreas.map((risk) => (
                  <div key={risk.id} className="card-corporate hover-lift-corporate h-full">
                    <div className="p-6">
                      <div className="mb-4">
                        <span className={`status-badge ${getSeverityColor(risk.riskLevel)}`}>
                          {risk.riskLevel} RISK
                        </span>
                      </div>
                      <h3 className="text-corporate-primary text-lg mb-3">
                        {risk.title}
                      </h3>
                      <p className="text-corporate-secondary leading-relaxed mb-4">{risk.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4">
                          <div className="text-sm font-bold text-red-900 mb-2">Impact:</div>
                          <p className="text-sm text-red-800">{risk.impact}</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
                          <div className="text-sm font-bold text-amber-900 mb-2">Likelihood:</div>
                          <p className="text-sm text-amber-800">{risk.likelihood}</p>
                        </div>
                      </div>
                      
                      {risk.mitigationActions && risk.mitigationActions.length > 0 && (
                        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
                          <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-sm">
                              <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                            </div>
                            Mitigation Actions:
                          </div>
                          <ul className="list-disc list-inside space-y-1">
                            {risk.mitigationActions.map((action, idx) => (
                              <li key={idx} className="text-sm text-slate-700 leading-relaxed">{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg-corporate">
      <div className="absolute inset-0 bg-audit-pattern opacity-50 pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Professional Header */}
        <div className="mb-8 text-center animate-fade-in-corporate">
          <div className="inline-block mb-4">
            <div className="icon-container-gold w-20 h-20">
              <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="section-header-corporate text-center">
            AI Document Analysis
          </h1>
          <p className="text-corporate-secondary text-lg max-w-2xl mx-auto">
            Upload your policy document to identify critical flags, improvement suggestions, compliance gaps, and risk areas
          </p>
        </div>

        <div className="card-premium shadow-premium">
          <div className="p-8">
            
            {/* Standard Selection */}
            <div className="mb-8">
              <label className="block text-corporate-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
                Select Compliance Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {standards.map((standard) => (
                  <div
                    key={standard.value}
                    onClick={() => setSelectedStandard(standard.value as ComplianceStandard)}
                    className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all hover-lift-corporate ${
                      selectedStandard === standard.value
                        ? 'bg-corporate-gradient text-white border-transparent shadow-premium'
                        : 'bg-white border-slate-200 hover:border-blue-900'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{standard.icon}</div>
                      <h3 className={`text-base font-bold mb-2 ${
                        selectedStandard === standard.value ? 'text-white' : 'text-slate-900'
                      }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {standard.label}
                      </h3>
                      <p className={`text-xs ${
                        selectedStandard === standard.value ? 'text-slate-200' : 'text-slate-600'
                      }`}>
                        {standard.description}
                      </p>
                    </div>
                    {selectedStandard === standard.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-gold">
                        <CheckCircle className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-corporate-primary mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-600" strokeWidth={2.5} />
                Upload Document
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-900 rounded-2xl p-10 text-center transition-all hover:bg-slate-50 cursor-pointer group">
                <Upload className="w-16 h-16 text-slate-400 group-hover:text-blue-900 mx-auto mb-4 group-hover:scale-110 transition-all" strokeWidth={2} />
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-blue-900 hover:text-amber-600 font-bold text-lg transition-colors">
                    Click to upload
                  </span>
                  <span className="text-slate-600"> or drag and drop</span>
                </label>
                <p className="text-sm text-slate-500 mt-3">
                  PDF, DOC, DOCX, or TXT (max 10MB)
                </p>
                {selectedFile && (
                  <div className="mt-6 inline-block">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="icon-container-gold w-10 h-10">
                          <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-blue-900">
                          {selectedFile.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-8">
                <Alert variant="error">{error}</Alert>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || analyzing}
              className="btn-corporate-primary w-full flex items-center justify-center gap-3 text-lg py-4"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing Document...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
                  Analyze Document with AI
                </>
              )}
            </button>

            {/* Info Panel */}
            <div className="mt-8 bg-corporate-gradient text-white rounded-2xl p-6 shadow-premium border border-white/10">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={2.5} />
                </div>
                What will be analyzed:
              </h4>
              <ul className="space-y-3 text-slate-100">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                  </div>
                  <span>🚩 Critical security flags and missing requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                  </div>
                  <span>💡 Actionable improvement suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                  </div>
                  <span>📋 Compliance gaps vs {selectedStandard.replace('_', ' ')} requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.5} />
                  </div>
                  <span>⚠️ Potential risk areas and vulnerabilities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalyzer;