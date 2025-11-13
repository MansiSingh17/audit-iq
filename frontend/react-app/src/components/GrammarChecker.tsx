import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Sparkles, Copy, RotateCcw, Zap, Moon, Sun } from 'lucide-react';
import { grammarService, GrammarCorrection } from '../services/grammarService';
import Card from './common/Card';
import Button from './common/Button';
import toast from 'react-hot-toast';

const GrammarChecker: React.FC = () => {
  const [originalText, setOriginalText] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [corrections, setCorrections] = useState<GrammarCorrection[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
      toast.success(`✨ Found ${response.corrections?.length || 0} improvements!`, {
        icon: '🎯',
        style: {
          borderRadius: '12px',
          background: '#1e40af',
          color: '#fff',
        },
      });
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
    toast.success('✅ Copied to clipboard!', {
      icon: '📋',
      style: {
        borderRadius: '12px',
        background: '#059669',
        color: '#fff',
      },
    });
  };

  const getCorrectionTypeColor = (type: string) => {
    if (darkMode) {
      const typeMap: Record<string, string> = {
        GRAMMAR: 'bg-red-900/30 text-red-300 border-red-700',
        SPELLING: 'bg-orange-900/30 text-orange-300 border-orange-700',
        STYLE: 'bg-blue-900/30 text-blue-300 border-blue-700',
        PUNCTUATION: 'bg-purple-900/30 text-purple-300 border-purple-700',
      };
      return typeMap[type] || 'bg-gray-700 text-gray-300 border-gray-600';
    } else {
      const typeMap: Record<string, string> = {
        GRAMMAR: 'bg-red-100 text-red-800 border-red-300',
        SPELLING: 'bg-orange-100 text-orange-800 border-orange-300',
        STYLE: 'bg-blue-100 text-blue-800 border-blue-300',
        PUNCTUATION: 'bg-purple-100 text-purple-800 border-purple-300',
      };
      return typeMap[type] || 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} relative overflow-hidden transition-colors duration-500`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white/90 shadow-lg hover:scale-110 transition-all backdrop-blur-xl border-2 border-gray-200"
      >
        {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
      </button>

      {/* Enhanced Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        
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

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 hover:rotate-6 transition-transform">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            Grammar & Style Checker
          </h1>
          <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            AI-powered grammar correction for professional audit reports
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <Card variant="glass" className={`shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up`}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-md">
                    <span className="text-white text-xs sm:text-sm">📝</span>
                  </div>
                  Original Text
                </h3>
                <span className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'} px-2 sm:px-3 py-1 rounded-full`}>
                  {originalText.length} chars
                </span>
              </div>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste your text here to check for grammar and spelling errors...

Example:
The security policy need to be updated and their should be more controls for data protection."
                className={`w-full h-64 sm:h-96 p-3 sm:p-4 border-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white/80'} rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all backdrop-blur-sm text-xs sm:text-sm`}
                disabled={loading}
              />
            </div>
          </Card>

          <Card variant="glass" className={`shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up`} style={{ animationDelay: '100ms' }}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-md">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Corrected Text
                </h3>
                {hasChecked && correctedText && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Copy className="w-4 h-4" />}
                    onClick={handleCopyCorrected}
                    className="hover:scale-105 transition-transform"
                  >
                    Copy
                  </Button>
                )}
              </div>
              <div className={`w-full h-64 sm:h-96 p-3 sm:p-4 border-2 ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'} rounded-xl overflow-y-auto scroll-smooth`}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-pulse" />
                    </div>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium text-sm sm:text-base`}>Analyzing with AI...</span>
                  </div>
                ) : hasChecked ? (
                  <p className={`whitespace-pre-wrap ${darkMode ? 'text-gray-200' : 'text-gray-800'} leading-relaxed text-xs sm:text-sm`}>{correctedText}</p>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'} text-center`}>
                      <Sparkles className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                      <span className="text-xs sm:text-sm">Corrected text will appear here</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            onClick={handleCheck}
            variant="gradient"
            size="lg"
            disabled={!originalText.trim() || loading}
            loading={loading}
            icon={<Zap className="w-5 h-5" />}
            className="flex-1 shadow-2xl hover:scale-105 transition-transform"
          >
            {loading ? 'Checking Grammar...' : 'Check Grammar'}
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="lg"
            disabled={loading}
            icon={<RotateCcw className="w-5 h-5" />}
            className="hover:scale-105 transition-transform"
          >
            Clear
          </Button>
        </div>

        {hasChecked && !loading && (
          <div className="animate-fade-in-up">
            {corrections.length === 0 ? (
              <Card variant="gradient" className={`${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} border-2`}>
                <div className="p-5 sm:p-6 flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${darkMode ? 'text-green-300' : 'text-green-900'} text-base sm:text-lg`}>Perfect! No errors found! 🎉</h4>
                    <p className={`${darkMode ? 'text-green-200' : 'text-green-700'} text-xs sm:text-sm`}>Your text looks great. No grammar or spelling issues detected.</p>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <Card variant="glass" className={`mb-4 sm:mb-6 shadow-xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="p-5 sm:p-6 flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'} text-base sm:text-lg`}>
                        Found {corrections.length} issue{corrections.length !== 1 ? 's' : ''}
                      </h4>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>Review the corrections below</p>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {corrections.length}
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className={`shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="p-4 sm:p-6">
                    <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 sm:mb-6 flex items-center gap-2`}>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm">🔍</span>
                      </div>
                      Detected Issues ({corrections.length})
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {corrections.map((correction, index) => (
                        <div
                          key={index}
                          className={`group p-4 sm:p-5 ${darkMode ? 'bg-gray-700/50' : 'bg-gradient-to-br from-white to-gray-50'} rounded-xl border-2 ${darkMode ? 'border-gray-600 hover:border-blue-500' : 'border-gray-200 hover:border-blue-300'} hover:shadow-lg transition-all animate-fade-in-up hover:-translate-y-0.5`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex flex-wrap items-start justify-between mb-3 gap-2">
                            <span className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-full border-2 ${getCorrectionTypeColor(correction.type)}`}>
                              {correction.type || 'GRAMMAR'}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-mono`}>Position: {correction.position}</span>
                          </div>
                          
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-semibold text-red-600">❌</span>
                              <div className="flex-1">
                                <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Original: </span>
                                <span className={`text-xs sm:text-sm text-red-600 line-through ${darkMode ? 'bg-red-900/30' : 'bg-red-50'} px-2 py-1 rounded`}>{correction.original}</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-semibold text-green-600">✅</span>
                              <div className="flex-1">
                                <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Corrected: </span>
                                <span className={`text-xs sm:text-sm text-green-600 font-semibold ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} px-2 py-1 rounded`}>{correction.corrected}</span>
                              </div>
                            </div>
                            {correction.suggestion && (
                              <div className={`pt-2 sm:pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                <p className={`text-xs sm:text-sm ${darkMode ? 'text-blue-300 bg-blue-900/30 border-blue-700' : 'text-gray-600 bg-blue-50 border-blue-500'} italic p-2 sm:p-3 rounded-lg border-l-4`}>
                                  💡 {correction.suggestion}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-2xl hover:shadow-3xl transition-shadow">
          <div className="p-5 sm:p-6">
            <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              AI-Powered Grammar Checking
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-blue-100">
              {[
                'Advanced grammar and spelling detection',
                'Punctuation and style improvements',
                'Context-aware suggestions',
                'Powered by LanguageTool AI'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
        .scroll-smooth::-webkit-scrollbar { width: 6px; }
        .scroll-smooth::-webkit-scrollbar-track { background: transparent; }
        .scroll-smooth::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #60a5fa, #818cf8); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default GrammarChecker;