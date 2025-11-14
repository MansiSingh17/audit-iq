import React, { useState } from 'react';
import { FileText, Table, Download, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';

type ComplianceStandard = 'ISO_27001' | 'GDPR' | 'HIPAA';
type ExportFormat = 'PDF' | 'EXCEL';

const ChecklistGenerator: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>('ISO_27001');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const standards = [
    { 
      value: 'ISO_27001', 
      label: 'ISO 27001:2022', 
      subtitle: 'Information Security',
      description: 'Information security management system requirements',
      icon: '🔒',
    },
    { 
      value: 'GDPR', 
      label: 'GDPR', 
      subtitle: 'Data Protection',
      description: 'EU General Data Protection Regulation compliance',
      icon: '🛡️',
    },
    { 
      value: 'HIPAA', 
      label: 'HIPAA', 
      subtitle: 'Healthcare Privacy',
      description: 'Health Insurance Portability and Accountability Act',
      icon: '🏥',
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
    <div className="min-h-screen page-bg-corporate">
      <div className="absolute inset-0 bg-checklist-pattern opacity-40 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-10 text-center animate-fade-in-corporate">
          <div className="inline-block mb-4">
            <div className="icon-container-gold w-20 h-20">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="section-header-corporate text-center">
            Generate Compliance Checklist
          </h1>
          <p className="text-corporate-secondary text-lg max-w-2xl mx-auto">
            Create downloadable compliance checklist templates for your audit needs
          </p>
        </div>

        <div className="card-premium shadow-premium">
          <div className="p-8">
            {/* Standard Selection */}
            <div className="mb-8">
              <label className="block text-corporate-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                Select Compliance Standard
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {standards.map((standard) => (
                  <div
                    key={standard.value}
                    onClick={() => setSelectedStandard(standard.value as ComplianceStandard)}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all hover-lift-corporate ${
                      selectedStandard === standard.value
                        ? 'bg-corporate-gradient text-white border-transparent shadow-premium'
                        : 'bg-white border-slate-200 hover:border-blue-900'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{standard.icon}</div>
                      <h3 className={`text-lg font-bold mb-1 ${
                        selectedStandard === standard.value ? 'text-white' : 'text-slate-900'
                      }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {standard.label}
                      </h3>
                      <p className={`text-xs font-semibold mb-2 ${
                        selectedStandard === standard.value ? 'text-amber-300' : 'text-slate-500'
                      }`}>
                        {standard.subtitle}
                      </p>
                      <p className={`text-xs ${
                        selectedStandard === standard.value ? 'text-slate-200' : 'text-slate-600'
                      }`}>
                        {standard.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
                <CheckCircle className="w-6 h-6 text-emerald-600" strokeWidth={2.5} />
                <p className="text-sm font-bold text-emerald-800">✨ Checklist downloaded successfully!</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl">
                <p className="text-sm font-bold text-red-800">{error}</p>
              </div>
            )}

            {/* Export Options */}
            <div className="mb-8">
              <label className="block text-corporate-primary mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-600" />
                Choose Download Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div 
                  onClick={() => !generating && generateAndDownload('EXCEL')}
                  className="card-corporate hover-lift-corporate cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Table className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-corporate-primary text-lg mb-1">Export to Excel</h3>
                        <p className="text-corporate-secondary text-sm">Download as .xlsx file</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => !generating && generateAndDownload('PDF')}
                  className="card-corporate hover-lift-corporate cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-corporate-primary text-lg mb-1">Export to PDF</h3>
                        <p className="text-corporate-secondary text-sm">Download as .pdf file</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {generating && (
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin"></div>
                  <p className="text-blue-900 font-bold">✨ Generating your checklist...</p>
                </div>
              </div>
            )}

            {/* Info Panel */}
            <div className="bg-corporate-gradient text-white rounded-2xl p-6 shadow-premium">
              <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <Sparkles className="w-5 h-5 text-amber-400" />
                What's included in the checklist:
              </h4>
              <ul className="space-y-3 text-slate-100">
                {[
                  'Complete list of compliance requirements',
                  'Detailed descriptions and guidance',
                  'Priority levels for each control',
                  'Evidence documentation sections',
                  'Progress tracking capabilities',
                  'Professional formatting for auditors'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistGenerator;