import React, { useState } from 'react';
import { Upload, AlertTriangle, Clock, TrendingUp, FileText, CheckCircle, Sparkles, Shield } from 'lucide-react';
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
      case 'CRITICAL': return 'status-critical';
      case 'HIGH': return 'status-high';
      case 'MEDIUM': return 'status-medium';
      case 'LOW': return 'status-low';
      default: return 'status-badge';
    }
  };

  const getSeverityIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <AlertTriangle className="w-5 h-5 text-red-700" strokeWidth={2.5} />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5 text-orange-700" strokeWidth={2.5} />;
      case 'MEDIUM': return <Clock className="w-5 h-5 text-amber-700" strokeWidth={2.5} />;
      case 'LOW': return <CheckCircle className="w-5 h-5 text-emerald-700" strokeWidth={2.5} />;
      default: return null;
    }
  };

  const renderFinding = (finding: AuditFinding, index: number) => (
    <div key={finding.id || Math.random()} className="card-corporate hover-lift-corporate border-l-4 border-amber-600 mb-6" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                finding.severity?.level === 'CRITICAL' ? 'bg-gradient-to-br from-red-700 to-red-800' :
                finding.severity?.level === 'HIGH' ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                finding.severity?.level === 'MEDIUM' ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                'bg-gradient-to-br from-emerald-600 to-green-600'
              }`}>
                <div className="text-white">
                  {getSeverityIcon(finding.severity?.level || 'MEDIUM')}
                </div>
              </div>
              <span className={`status-badge ${getSeverityColor(finding.severity?.level || 'MEDIUM')}`}>
                {finding.severity?.level || 'MEDIUM'}
              </span>
              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-2 border-blue-200 rounded-lg text-xs font-bold">
                Impact: {finding.impactScore || 5}/10
              </span>
            </div>
            <h3 className="text-corporate-primary text-2xl mb-3">{finding.title}</h3>
            <p className="text-corporate-secondary leading-relaxed text-lg">{finding.description}</p>
          </div>
        </div>

        {finding.evidence && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 mb-4">
            <div className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-sm">
                <FileText className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              Evidence:
            </div>
            <p className="text-sm text-amber-800 italic leading-relaxed">{finding.evidence}</p>
          </div>
        )}

        {finding.severity && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4">
              <div className="text-sm font-bold text-red-900 mb-2">Business Impact:</div>
              <p className="text-sm text-red-800 leading-relaxed">{finding.severity.businessImpact || 'Not specified'}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="text-sm font-bold text-amber-900 mb-2">Technical Impact:</div>
              <p className="text-sm text-amber-800 leading-relaxed">{finding.severity.technicalImpact || 'Not specified'}</p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="icon-container-gold w-10 h-10">
              <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-bold text-blue-900 mb-1">Remediation Timeline:</div>
              <p className="text-xl font-bold text-blue-800">{finding.recommendedTimeline || finding.remediationTimeline || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {finding.remediationSteps && finding.remediationSteps.length > 0 && (
          <div className="mb-4">
            <h4 className="text-corporate-primary text-lg mb-4">Remediation Steps:</h4>
            <div className="space-y-3">
              {finding.remediationSteps.map((step) => (
                <div key={step.stepNumber} className="group flex items-start gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-900 hover:shadow-md transition-all hover-lift-corporate">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-110 group-hover:shadow-gold transition-all">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">{step.action}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors flex-shrink-0" strokeWidth={2.5} />
                </div>
              ))}
            </div>
          </div>
        )}

        {finding.bestPractices && (
          <div className="mb-4">
            <h4 className="text-corporate-primary text-lg mb-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              Best Practices:
            </h4>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-4">
              <p className="text-sm text-emerald-800 leading-relaxed">{finding.bestPractices}</p>
            </div>
          </div>
        )}

        {finding.affectedControls && finding.affectedControls.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-slate-700">Affected Controls:</span>
            </div>
            {finding.affectedControls.map((control, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 border-2 border-slate-200 rounded-lg text-xs font-bold hover:border-blue-900 hover:bg-blue-50 hover:text-blue-900 transition-all">
                {control}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (report) {
    const criticalFindings = report.findings?.filter(f => f.severity?.level === 'CRITICAL') || [];
    const highFindings = report.findings?.filter(f => f.severity?.level === 'HIGH') || [];
    const mediumFindings = report.findings?.filter(f => f.severity?.level === 'MEDIUM') || [];
    const lowFindings = report.findings?.filter(f => f.severity?.level === 'LOW') || [];

    return (
      <div className="min-h-screen page-bg-corporate">
        <div className="absolute inset-0 bg-shield-pattern opacity-30 pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-corporate">
            <div>
              <h1 className="section-header-corporate !mb-2">
                Draft Audit Findings Report
              </h1>
              <p className="text-corporate-secondary">{report.documentName} • {report.complianceFramework}</p>
            </div>
            <Button onClick={() => setReport(null)} className="btn-corporate-accent">
              Generate New Report
            </Button>
          </div>

          {/* Executive Summary */}
          <div className="card-premium mb-8">
            <div className="p-8">
              <h2 className="section-header-corporate flex items-center gap-3 !mb-6">
                <div className="icon-container-corporate">
                  <Shield className="w-6 h-6 text-amber-400" strokeWidth={2.5} />
                </div>
                Executive Summary
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                  { label: 'Total Findings', value: report.totalFindings || 0, color: 'text-blue-900' },
                  { label: 'Compliance', value: `${report.compliancePercentage || report.complianceScore || 0}%`, color: 'text-emerald-600' },
                  { label: 'Risk Level', value: report.riskSummary ? report.riskSummary.split(':')[0] : 'Moderate', color: (report.criticalCount || 0) > 0 ? 'text-red-700' : 'text-amber-600' },
                  { label: 'Critical / High', value: `${report.criticalCount || 0} / ${report.highCount || 0}`, color: 'text-amber-600' }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="stat-card-corporate text-center"
                  >
                    <div className={`text-4xl font-black mb-2 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {report.executiveSummary && (
                <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm">
                  <h4 className="text-corporate-primary text-lg mb-3">Summary:</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{report.executiveSummary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Critical Findings */}
          {criticalFindings.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-800 flex items-center justify-center shadow-corporate">
                  <AlertTriangle className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                Critical Findings ({criticalFindings.length}) - Remediate within 24 Hours
              </h2>
              {criticalFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}

          {/* High Findings */}
          {highFindings.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-corporate">
                  <AlertTriangle className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                High Priority Findings ({highFindings.length}) - Remediate within 7 Days
              </h2>
              {highFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}

          {/* Medium Findings */}
          {mediumFindings.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-gold">
                  <Clock className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                Medium Priority Findings ({mediumFindings.length}) - Remediate within 30 Days
              </h2>
              {mediumFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}

          {/* Low Findings */}
          {lowFindings.length > 0 && (
            <div className="mb-8">
              <h2 className="section-header-corporate flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                Low Priority Findings ({lowFindings.length}) - Remediate within 90 Days
              </h2>
              {lowFindings.map((finding, index) => renderFinding(finding, index))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Input form view
  return (
    <div className="min-h-screen page-bg-corporate">
      <div className="absolute inset-0 bg-checklist-pattern opacity-40 pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Professional Header */}
        <div className="mb-8 text-center animate-fade-in-corporate">
          <div className="inline-block mb-4">
            <div className="icon-container-corporate w-20 h-20">
              <Shield className="w-10 h-10 text-amber-400" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="section-header-corporate text-center">
            Draft Audit Findings Generator
          </h1>
          <p className="text-corporate-secondary text-lg max-w-2xl mx-auto">
            Generate professional audit findings with severity levels, remediation timelines, and best practices
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
                      <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-slate-900" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input Mode Selection */}
            <div className="mb-8">
              <label className="block text-corporate-primary mb-4">
                Input Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setInputMode('text')}
                  className={`group p-6 border-2 rounded-2xl transition-all hover-lift-corporate ${
                    inputMode === 'text'
                      ? 'border-blue-900 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-corporate'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-center">
                    <FileText className={`w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform ${inputMode === 'text' ? 'text-blue-900' : 'text-slate-400'}`} strokeWidth={2.5} />
                    <div className={`font-bold mb-1 ${inputMode === 'text' ? 'text-blue-900' : 'text-slate-700'}`}>Paste Text</div>
                    <div className={`text-xs ${inputMode === 'text' ? 'text-blue-700' : 'text-slate-500'}`}>Quick analysis from copied text</div>
                  </div>
                </button>
                <button
                  onClick={() => setInputMode('file')}
                  className={`group p-6 border-2 rounded-2xl transition-all hover-lift-corporate ${
                    inputMode === 'file'
                      ? 'border-blue-900 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-corporate'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-center">
                    <Upload className={`w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform ${inputMode === 'file' ? 'text-blue-900' : 'text-slate-400'}`} strokeWidth={2.5} />
                    <div className={`font-bold mb-1 ${inputMode === 'file' ? 'text-blue-900' : 'text-slate-700'}`}>Upload File</div>
                    <div className={`text-xs ${inputMode === 'file' ? 'text-blue-700' : 'text-slate-500'}`}>Analyze document files</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Text Input */}
            {inputMode === 'text' && (
              <div className="mb-8">
                <label className="block text-corporate-primary mb-4">
                  Paste Policy/Procedure Text or Findings
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your policy document, procedure, or audit observations here..."
                  className="input-corporate h-96 font-mono text-sm resize-none"
                />
                <p className="text-xs text-slate-500 mt-3 font-medium">
                  Paste findings, observations, or policy text. The AI will analyze and generate professional audit findings.
                </p>
              </div>
            )}

            {/* File Upload */}
            {inputMode === 'file' && (
              <div className="mb-8">
                <label className="block text-corporate-primary mb-4">
                  Upload Policy/Procedure Document
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
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="icon-container-gold w-10 h-10">
                            <FileText className="w-5 h-5 text-white" strokeWidth={2.5} />
                          </div>
                          <span className="text-sm font-bold text-blue-900">{selectedFile.name}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-8 p-5 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 rounded-xl">
                <p className="text-sm font-bold text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-700" strokeWidth={2.5} />
                  {error}
                </p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating || (inputMode === 'file' && !selectedFile) || (inputMode === 'text' && !textInput.trim())}
              className="btn-corporate-primary w-full mb-8 flex items-center justify-center gap-3 text-lg py-4"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Audit Findings...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
                  Generate Draft Audit Findings
                </>
              )}
            </button>

            {/* Info Panel */}
            <div className="bg-corporate-gradient text-white rounded-2xl p-6 shadow-premium">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <Sparkles className="w-5 h-5 text-amber-400" strokeWidth={2.5} />
                What's included:
              </h4>
              <ul className="space-y-3 text-slate-100">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>🎯 Severity levels with impact scores (Critical, High, Medium, Low)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>⏱️ Remediation timelines (24hr, 7 days, 30 days, 90 days)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>📋 Grammar-corrected, audit-ready documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>✨ Industry best practices and benchmarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>🔗 Framework alignments (ISO, NIST, CIS, SOC 2)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>📝 Executive summary for leadership</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditFindings;