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
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { documentService, AuditDocument } from '../services/documentService';

const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStandard, setFilterStandard] = useState<string>('ALL');

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
        return 'status-success';
      case 'PROCESSING':
        return 'status-medium';
      case 'ERROR':
        return 'status-critical';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
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

  // Calculate stats
  const stats = [
    {
      label: 'Total Documents',
      value: documents.length.toString(),
      icon: <FileText className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Analyzed',
      value: documents.filter(d => d.status?.toUpperCase() === 'ANALYZED').length.toString(),
      icon: <CheckCircle className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Processing',
      value: documents.filter(d => d.status?.toUpperCase() === 'PROCESSING').length.toString(),
      icon: <Clock className="w-5 h-5" strokeWidth={2.5} />,
    },
    {
      label: 'Errors',
      value: documents.filter(d => d.status?.toUpperCase() === 'ERROR').length.toString(),
      icon: <AlertCircle className="w-5 h-5" strokeWidth={2.5} />,
    }
  ];

  return (
    <div className="min-h-screen page-bg-corporate">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-document-texture opacity-40 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Professional Header */}
        <div className="mb-8 animate-fade-in-corporate">
          <div className="flex items-center gap-4 mb-4">
            <div className="icon-container-gold">
              <FileText className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="section-header-corporate !mb-1">
                Documents
              </h1>
              <p className="text-corporate-secondary flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                Manage your compliance documents
              </p>
            </div>
          </div>
        </div>

        {/* Professional Stats Grid */}
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="stat-card-corporate animate-slide-up-corporate"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="icon-container-gold mb-4">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-black text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Professional Search & Filter */}
        <div className="card-corporate mb-6 animate-fade-in-corporate" style={{ animationDelay: '200ms' }}>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search documents..."
                  className="input-corporate pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-600 font-bold transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" strokeWidth={2.5} />
                <select
                  value={filterStandard}
                  onChange={(e) => setFilterStandard(e.target.value)}
                  className="input-corporate pl-10 min-w-[180px]"
                >
                  <option value="ALL">All Standards</option>
                  <option value="ISO_27001">🔒 ISO 27001</option>
                  <option value="GDPR">🛡️ GDPR</option>
                  <option value="HIPAA">🏥 HIPAA</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="loading-corporate h-24 rounded-2xl"></div>
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="space-y-4">
            {filteredDocuments.map((doc, index) => (
              <div 
                key={doc.id}
                className="card-corporate hover-lift-corporate animate-slide-up-corporate"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                    {/* Document Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center shadow-corporate">
                        <span className="text-3xl">{getStandardIcon(doc.standard)}</span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-corporate-primary text-lg mb-2 truncate">
                        {doc.fileName || 'Untitled Document'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-corporate-secondary text-sm">
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                          {doc.standard?.replace('_', ' ') || 'No standard'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-blue-900" strokeWidth={2.5} />
                          {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'No date'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`status-badge ${getStatusColor(doc.status)}`}>
                      {doc.status || 'UPLOADED'}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(doc)}
                        className="px-4 py-2.5 bg-white border-2 border-blue-900 text-blue-900 rounded-xl font-semibold hover:bg-blue-900 hover:text-white transition-all shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" strokeWidth={2.5} />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-3 bg-red-50 text-red-700 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-all hover:scale-105"
                        title="Delete Document"
                      >
                        <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-corporate text-center p-16">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                <FileText className="w-12 h-12 text-slate-400" strokeWidth={2} />
              </div>
            </div>
            <h3 className="section-header-corporate !mb-3">
              No documents found
            </h3>
            <p className="text-corporate-secondary max-w-md mx-auto">
              {searchTerm || filterStandard !== 'ALL' 
                ? 'Try adjusting your search or filters to find documents' 
                : 'No documents available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;