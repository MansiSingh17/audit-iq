import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Calendar,
  Shield,
  BarChart3,
  Moon,
  Sun,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import Card from './common/Card';
import { documentService, AuditDocument } from '../services/documentService';

const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStandard, setFilterStandard] = useState<string>('ALL');
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
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        console.log('🗑️ Attempting to delete document ID:', docId);
        
        try {
          await documentService.deleteDocument(docId);
          console.log('✅ Document deleted from backend');
        } catch (backendError: any) {
          console.warn('⚠️ Backend delete failed (404), removing from UI only:', backendError.message);
        }
        
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
        toast.success('Document removed!');
        
      } catch (error: any) {
        console.error('❌ Failed to delete document:', error);
        toast.error(`Failed to delete: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleView = async (doc: AuditDocument) => {
    console.log('👁️ Opening document:', doc);
    
    if (doc.fileType === 'application/pdf') {
      try {
        toast.loading('Opening PDF...');
        
        const blob = await documentService.viewDocument(doc.id);
        const url = URL.createObjectURL(blob);
        
        console.log('✅ PDF blob created:', url);
        
        const newWindow = window.open(url, '_blank');
        
        if (!newWindow) {
          toast.dismiss();
          toast.error('Please allow pop-ups to view PDFs');
        } else {
          toast.dismiss();
          toast.success(`Opening ${doc.fileName}...`);
        }
        
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } catch (error) {
        console.error('❌ Failed to open PDF:', error);
        toast.dismiss();
        toast.error('Failed to open PDF');
      }
    } else {
      navigate(`/document/${doc.id}`);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStandard === 'ALL' || doc.standard === filterStandard;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ANALYZED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'ERROR':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStandardIcon = (standard?: string) => {
    switch (standard) {
      case 'ISO_27001':
        return '🔒';
      case 'GDPR':
        return '🛡️';
      case 'HIPAA':
        return '🏥';
      default:
        return '📄';
    }
  };

  const getStandardColor = (standard?: string) => {
    switch (standard) {
      case 'ISO_27001':
        return 'from-blue-500 to-indigo-600';
      case 'GDPR':
        return 'from-purple-500 to-pink-600';
      case 'HIPAA':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  // Calculate stats
  const stats = [
    {
      label: 'Total Documents',
      value: documents.length.toString(),
      icon: <FileText className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'Analyzed',
      value: documents.filter(d => d.status?.toUpperCase() === 'ANALYZED').length.toString(),
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-600'
    },
    {
      label: 'Processing',
      value: documents.filter(d => d.status?.toUpperCase() === 'PROCESSING').length.toString(),
      icon: <Clock className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-600'
    },
    {
      label: 'Errors',
      value: documents.filter(d => d.status?.toUpperCase() === 'ERROR').length.toString(),
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'from-red-500 to-rose-600'
    }
  ];

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
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent rounded-full blur-3xl animate-float-delayed"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-black mb-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
                Documents
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2 text-sm sm:text-base`}>
                <Shield className="w-4 h-4" />
                Manage your compliance documents
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-xl`}></div>
                <div className={`relative ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 hover:border-blue-300`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2 sm:mb-3 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Search & Filter Bar */}
        <Card className={`mb-6 shadow-xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Enhanced Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search documents..."
                  className={`w-full pl-10 pr-4 py-3 border-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white/80'} rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Enhanced Filter */}
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                <select
                  value={filterStandard}
                  onChange={(e) => setFilterStandard(e.target.value)}
                  className={`pl-10 pr-8 py-3 border-2 ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white/80'} rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer min-w-[180px]`}
                >
                  <option value="ALL">All Standards</option>
                  <option value="ISO_27001">🔒 ISO 27001</option>
                  <option value="GDPR">🛡️ GDPR</option>
                  <option value="HIPAA">🏥 HIPAA</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Documents Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl animate-pulse`}>
                <div className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredDocuments.map((doc, index) => (
              <div 
                key={doc.id}
                className="group animate-fade-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="relative">
                  {/* Hover Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getStandardColor(doc.standard)} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`}></div>
                  
                  {/* Enhanced Card */}
                  <div className={`relative ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-2 ${darkMode ? 'border-gray-700 group-hover:border-blue-500' : 'border-gray-200 group-hover:border-blue-400'} rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      {/* Document Icon */}
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-br ${getStandardColor(doc.standard)} blur-md opacity-50 rounded-xl`}></div>
                        <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${getStandardColor(doc.standard)} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                          <span className="text-2xl sm:text-3xl">{getStandardIcon(doc.standard)}</span>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} text-base sm:text-lg mb-2 transition-colors truncate`}>
                          {doc.fileName || 'Untitled Document'}
                        </h3>
                        <div className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="flex items-center gap-1.5">
                            <Shield className="w-4 h-4" />
                            {doc.standard?.replace('_', ' ') || 'No standard'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold border-2 ${getStatusColor(doc.status)} flex-shrink-0`}>
                        {doc.status || 'UPLOADED'}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                        <button
                          onClick={() => handleView(doc)}
                          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 ${darkMode ? 'bg-gray-900 border-blue-500 text-blue-400 hover:bg-gray-700' : 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50'} border-2 rounded-xl transition-all font-medium text-xs sm:text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn`}
                        >
                          <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                        <button
                          onClick={() => navigate('/analyze')}
                          className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-medium text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn hover:scale-105"
                        >
                          <BarChart3 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span className="hidden sm:inline">Analyze</span>
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 sm:p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all group/btn hover:scale-105"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className={`shadow-2xl ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-xl border-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="p-12 sm:p-16 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur-2xl opacity-30 animate-pulse"></div>
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${darkMode ? 'from-blue-900 to-indigo-900' : 'from-blue-100 to-indigo-100'} rounded-2xl flex items-center justify-center`}>
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                </div>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                No documents found
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto text-sm sm:text-base`}>
                {searchTerm || filterStandard !== 'ALL' 
                  ? 'Try adjusting your search or filters to find documents' 
                  : 'No documents available at the moment'}
              </p>
            </div>
          </Card>
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
};

export default DocumentList;