import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Sparkles,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { documentService, AuditDocument } from '../services/documentService';
import DocumentUpload from './DocumentUpload';
import Card from './common/Card';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<AuditDocument | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents');
    }
  };

  const handleDocumentUpload = () => {
    loadDocuments();
  };

  const handleDocumentSelect = (doc: AuditDocument) => {
    setSelectedDocument(doc);
    navigate(`/checklist/${doc.id}`);
  };

  // Stats calculation
  const stats = [
    { 
      label: 'Total Documents', 
      value: documents.length.toString(), 
      icon: <FileText className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      change: '+12%'
    },
    { 
      label: 'Processed', 
      value: documents.filter(d => d.status === 'processed').length.toString(), 
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      change: '+8%'
    },
    { 
      label: 'Pending', 
      value: documents.filter(d => d.status === 'pending').length.toString(), 
      icon: <Clock className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      change: '-3%'
    },
    { 
      label: 'Efficiency', 
      value: '98%', 
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-600',
      change: '+5%'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'} relative overflow-hidden transition-colors duration-500`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-20 right-6 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800 shadow-lg hover:scale-110 transition-all backdrop-blur-xl border-2 border-gray-200"
      >
        {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
      </button>

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
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

      {/* Enhanced Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')] opacity-10"></div>
        
        {/* Floating decorations */}
        <div className="absolute top-8 left-8 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float-delayed"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin-slow" />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                  AuditIQ Dashboard
                </h1>
              </div>
              <p className="text-blue-100 text-base sm:text-lg animate-fade-in-delay">
                AI-Powered Compliance Automation Platform
              </p>
            </div>
            <div className="hidden lg:block animate-fade-in-delay">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20 hover:scale-105 transition-transform shadow-2xl">
                  <Shield className="w-16 h-16 lg:w-20 lg:h-20 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Section - New */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}></div>
              <div className={`relative ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 hover:border-blue-300`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {stat.label}
                </div>
                <div className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change} this week
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Upload className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Upload Documents</span>
            <Zap className="w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {selectedDocument && (
            <>
              <button
                onClick={() => navigate(`/checklist/${selectedDocument.id}`)}
                className={`group relative px-6 py-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} ${darkMode ? 'text-gray-200' : 'text-gray-800'} rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-400`}
              >
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>View Checklist</span>
              </button>
              <button
                onClick={() => navigate(`/risk/${selectedDocument.id}`)}
                className={`group relative px-6 py-3 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} ${darkMode ? 'text-gray-200' : 'text-gray-800'} rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-purple-400`}
              >
                <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Risk Assessment</span>
              </button>
            </>
          )}
        </div>

        {/* Enhanced Document Upload Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <Card className={`shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:border-blue-400 transition-all hover:shadow-3xl`}>
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-transform">
                  <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className={`text-2xl sm:text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Document Management
                </h2>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>
                  Upload and manage your audit documents
                </p>
              </div>
            </div>

            <DocumentUpload
              onUploadComplete={handleDocumentUpload}
              documents={documents}
              onDocumentSelect={handleDocumentSelect}
            />
          </Card>
        </div>
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-delay {
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
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-delay { animation: fade-in-delay 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Dashboard;