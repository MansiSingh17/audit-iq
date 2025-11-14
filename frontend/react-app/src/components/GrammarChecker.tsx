import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Sparkles, Copy, RotateCcw, Zap } from 'lucide-react';
import { grammarService, GrammarCorrection } from '../services/grammarService';
import Button from './common/Button';
import toast from 'react-hot-toast';

const GrammarChecker: React.FC = () => {
  const [originalText, setOriginalText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<GrammarCorrection[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = async () => {
    if (!originalText.trim()) {
      toast.error('Please enter some text to check');
      return;
    }

    setLoading(true);
    try {
      const response = await grammarService.correctGrammar(originalText);
      setCorrectedText(response.correctedText);
      setCorrections(response.corrections || []);
      setHasChecked(true);
      toast.success(`✨ Found ${response.corrections?.length || 0} improvements!`);
    } catch (error: any) {
      toast.error('Failed to check grammar');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setOriginalText('');
    setCorrectedText('');
    setCorrections([]);
    setHasChecked(false);
  };

  const handleCopyCorrected = () => {
    navigator.clipboard.writeText(correctedText);
    toast.success('✅ Copied to clipboard!');
  };

  const getCorrectionTypeColor = (type: string) => {
    const typeMap: Record<string, string> = {
      GRAMMAR: 'status-critical',
      SPELLING: 'status-high',
      STYLE: 'status-badge bg-blue-50 text-blue-800 border-blue-200',
      PUNCTUATION: 'status-badge bg-purple-50 text-purple-800 border-purple-200',
    };
    return typeMap[type] || 'status-badge';
  };

  return (
    <div className="min-h-screen page-bg-corporate">
      <div className="absolute inset-0 bg-document-texture opacity-40 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Professional Header */}
        <div className="mb-8 text-center animate-fade-in-corporate">
          <div className="inline-block mb-4">
            <div className="icon-container-gold w-20 h-20">
              <Sparkles className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="section-header-corporate text-center">
            Grammar & Style Checker
          </h1>
          <p className="text-corporate-secondary text-lg">
            AI-powered grammar correction for professional audit reports
          </p>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Original Text */}
          <div className="card-corporate">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-corporate-primary text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm">📝</span>
                  </div>
                  Original Text
                </h3>
                <span className="status-badge bg-slate-100 text-slate-700 border-slate-300">
                  {originalText.length} chars
                </span>
              </div>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste your text here to check for grammar and spelling errors...

Example:
The security policy need to be updated and their should be more controls for data protection."
                className="input-corporate h-96 resize-none font-mono text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Corrected Text */}
          <div className="card-premium">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-corporate-primary text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  Corrected Text
                </h3>
                {hasChecked && correctedText && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Copy className="w-4 h-4" />}
                    onClick={handleCopyCorrected}
                    className="btn-corporate-outline"
                  >
                    Copy
                  </Button>
                )}
              </div>
              <div className="w-full h-96 p-4 border-2 border-slate-200 bg-white rounded-xl overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-900 rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-slate-600 font-semibold">Analyzing with Claude AI...</span>
                  </div>
                ) : hasChecked ? (
                  <p className="whitespace-pre-wrap text-slate-900 leading-relaxed text-sm font-mono">{correctedText}</p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-slate-400">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <span className="text-sm">Corrected text will appear here</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={handleCheck}
            variant="gradient"
            size="lg"
            disabled={!originalText.trim() || loading}
            loading={loading}
            icon={<Zap className="w-5 h-5" />}
            className="btn-corporate-primary flex-1"
          >
            {loading ? 'Checking Grammar...' : 'Check Grammar'}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            disabled={loading}
            icon={<RotateCcw className="w-5 h-5" />}
            className="btn-corporate-outline"
          >
            Clear
          </Button>
        </div>

        {/* Results Section */}
        {hasChecked && !loading && (
          <div className="animate-fade-in-corporate">
            {corrections.length === 0 ? (
              <div className="card-corporate border-l-4 border-emerald-600">
                <div className="p-6 flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-green-50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                    <CheckCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>Perfect! No errors found! 🎉</h4>
                    <p className="text-emerald-700 text-sm">Your text looks great. No grammar or spelling issues detected.</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="card-gold-accent mb-6">
                  <div className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-gold">
                      <AlertCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-corporate-primary text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Found {corrections.length} issue{corrections.length !== 1 ? 's' : ''}
                      </h4>
                      <p className="text-corporate-secondary text-sm">Review the corrections below</p>
                    </div>
                    <div className="text-3xl font-black text-amber-600">
                      {corrections.length}
                    </div>
                  </div>
                </div>

                <div className="card-corporate">
                  <div className="p-6">
                    <h3 className="text-corporate-primary text-xl mb-6 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="icon-container-corporate w-8 h-8">
                        <span className="text-white text-sm">🔍</span>
                      </div>
                      Detected Issues ({corrections.length})
                    </h3>
                    <div className="space-y-4">
                      {corrections.map((correction, index) => (
                        <div
                          key={index}
                          className="card-corporate hover-lift-corporate p-5"
                        >
                          <div className="flex flex-wrap items-start justify-between mb-3 gap-2">
                            <span className={`status-badge ${getCorrectionTypeColor(correction.type)}`}>
                              {correction.type || 'GRAMMAR'}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">Position: {correction.position}</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-semibold text-red-600">❌</span>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-slate-700">Original: </span>
                                <span className="text-sm text-red-700 line-through bg-red-50 px-2 py-1 rounded border-2 border-red-200">{correction.original}</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-semibold text-green-600">✅</span>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-slate-700">Corrected: </span>
                                <span className="text-sm text-green-700 font-semibold bg-green-50 px-2 py-1 rounded border-2 border-green-200">{correction.corrected}</span>
                              </div>
                            </div>
                            {correction.suggestion && (
                              <div className="pt-3 border-t-2 border-slate-200">
                                <p className="text-sm text-slate-600 italic p-3 rounded-lg bg-blue-50 border-l-4 border-blue-600">
                                  💡 {correction.suggestion}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Panel */}
        <div className="card-corporate border-l-4 border-amber-600">
          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50">
            <h3 className="text-corporate-primary text-xl mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Sparkles className="w-6 h-6 text-amber-600" strokeWidth={2.5} />
              Powered by Claude AI
            </h3>
            <ul className="space-y-3 text-slate-700">
              {[
                'Advanced grammar and spelling detection',
                'Punctuation and style improvements',
                'Context-aware suggestions',
                'Professional audit report quality'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarChecker;