import React, { useState } from 'react';
import { FileText, Table, Download, Sparkles, CheckCircle, ArrowRight, Moon, Sun } from 'lucide-react';
import Card from './common/Card';
import api from '../services/api';

type ComplianceStandard = 'ISO_27001' | 'GDPR' | 'HIPAA';
type ExportFormat = 'PDF' | 'EXCEL';

const ChecklistGenerator: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>('ISO_27001');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const standards = [
    { 
      value: 'ISO_27001', 
      label: 'ISO 27001:2022', 
      subtitle: 'Information Security',
      description: 'Information security management system requirements',
      icon: '🔒',
      color: 'from-blue-600 to-indigo-600',
      lightBg: 'from-blue-50 to-indigo-50'
    },
    { 
      value: 'GDPR', 
      label: 'GDPR', 
      subtitle: 'Data Protection',
      description: 'EU General Data Protection Regulation compliance',
      icon: '🛡️',
      color: 'from-green-600 to-emerald-600',
      lightBg: 'from-green-50 to-emerald-50'
    },
    { 
      value: 'HIPAA', 
      label: 'HIPAA', 
      subtitle: 'Healthcare Privacy',
      description: 'Health Insurance Portability and Accountability Act',
      icon: '🏥',
      color: 'from-purple-600 to-fuchsia-600',
      lightBg: 'from-purple-50 to-fuchsia-50'
    }
  ];

  const generateAndDownload = async (format: ExportFormat) => {
    try {
      setGenerating(true);
      setError(null);
      setSuccess(false);

      const response = await api.post('/api/checklists/generate-template', {
        standard: selectedStandard,
        format: format
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: format === 'EXCEL' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf'
      });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedStandard}_Checklist.${format.toLowerCase() === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      console.error('Error generating checklist:', err);
      setError('Failed to generate checklist. Please try again.');
    } finally {
      setGenerating(false);
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

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 sm:mb-10 text-center animate-fade-in">
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-2xl opacity-50 rounded-full animate-pulse"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 hover:rotate-6 transition-transform">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className={`text-3xl sm:text-4xl font-black mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            Generate Compliance Checklist
          </h1>
          <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Create downloadable compliance checklist templates for your audit needs
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
                    className="relative group cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${standard.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}></div>
                    
                    <div className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-300 ${
                      selectedStandard === standard.value
                        ? 'border-transparent shadow-xl bg-gradient-to-br ' + standard.color + ' text-white scale-105'
                        : `${darkMode ? 'border-gray-700 bg-gray-900 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300'} hover:shadow-lg`
                    }`}>
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">{standard.icon}</div>
                        <h3 className={`text-base sm:text-lg font-bold mb-1 ${
                          selectedStandard === standard.value ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {standard.label}
                        </h3>
                        <p className={`text-xs font-semibold mb-2 ${
                          selectedStandard === standard.value ? 'text-white/90' : darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {standard.subtitle}
                        </p>
                        <p className={`text-xs ${
                          selectedStandard === standard.value ? 'text-white/80' : darkMode ? 'text-gray-500' : 'text-gray-600'
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
                ))}
              </div>
            </div>

            {success && (
              <div className={`mb-6 p-3 sm:p-4 ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'} border-2 rounded-xl flex items-center gap-3 animate-bounce-in`}>
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-green-300' : 'text-green-800'}`}>✨ Checklist downloaded successfully!</p>
              </div>
            )}

            {error && (
              <div className={`mb-6 p-3 sm:p-4 ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border-2 rounded-xl animate-shake`}>
                <p className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-red-300' : 'text-red-800'}`}>{error}</p>
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <label className={`block text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <Download className="w-5 h-5 text-blue-600" />
                Choose Download Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div 
                  onClick={() => !generating && generateAndDownload('EXCEL')}
                  className="group cursor-pointer"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity rounded-2xl"></div>
                    <div className={`relative ${darkMode ? 'bg-gray-800/95 border-gray-700 group-hover:border-green-500' : 'bg-white/90 border-gray-200 group-hover:border-green-500'} backdrop-blur-xl border-2 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                          <Table className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Export to Excel</h3>
                          <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Download as .xlsx file</p>
                        </div>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => !generating && generateAndDownload('PDF')}
                  className="group cursor-pointer"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity rounded-2xl"></div>
                    <div className={`relative ${darkMode ? 'bg-gray-800/95 border-gray-700 group-hover:border-red-500' : 'bg-white/90 border-gray-200 group-hover:border-red-500'} backdrop-blur-xl border-2 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Export to PDF</h3>
                          <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Download as .pdf file</p>
                        </div>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {generating && (
              <div className={`mb-6 p-5 sm:p-6 ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'} border-2 rounded-2xl animate-bounce-in`}>
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 rounded-full animate-pulse"></div>
                  </div>
                  <p className={`${darkMode ? 'text-blue-300' : 'text-blue-800'} font-semibold text-sm sm:text-base`}>✨ Generating your checklist...</p>
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 sm:p-6 shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-20"></div>
              
              <div className="relative">
                <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  What's included in the checklist:
                </h4>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-white/90">
                  {[
                    'Complete list of compliance requirements',
                    'Detailed descriptions and guidance',
                    'Priority levels for each control',
                    'Evidence documentation sections',
                    'Progress tracking capabilities',
                    'Professional formatting for auditors'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
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

export default ChecklistGenerator;