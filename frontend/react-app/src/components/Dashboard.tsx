import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Sparkles,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';
import { documentService, AuditDocument } from '../services/documentService';
import DocumentUpload from './DocumentUpload';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<AuditDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<AuditDocument | null>(null);

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
      icon: <FileText className="w-6 h-6" strokeWidth={2.5} />,
      change: '+12%'
    },
    { 
      label: 'Processed', 
      value: documents.filter(d => d.status === 'processed').length.toString(), 
      icon: <CheckCircle className="w-6 h-6" strokeWidth={2.5} />,
      change: '+8%'
    },
    { 
      label: 'Pending', 
      value: documents.filter(d => d.status === 'pending').length.toString(), 
      icon: <Clock className="w-6 h-6" strokeWidth={2.5} />,
      change: '-3%'
    },
    { 
      label: 'Efficiency', 
      value: '98%', 
      icon: <TrendingUp className="w-6 h-6" strokeWidth={2.5} />,
      change: '+5%'
    }
  ];

  return (
    <div className="min-h-screen page-bg-corporate">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 bg-audit-pattern opacity-50 pointer-events-none"></div>
      
      {/* Subtle corner accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-900/5 via-transparent to-transparent pointer-events-none"></div>

      {/* Professional Hero Header */}
      <div className="relative overflow-hidden bg-corporate-gradient shadow-corporate-xl border-b-2 border-slate-800/30">
        <div className="absolute inset-0 bg-shield-pattern opacity-5"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-8 left-8 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex-1 animate-fade-in-corporate">
              <div className="flex items-center gap-4 mb-3">
                <div className="icon-container-gold hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
                  Dashboard
                </h1>
              </div>
              <p className="text-slate-200 text-lg font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                AI-Powered Compliance Automation Platform
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="relative w-40 h-40 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center border-2 border-white/10 hover:scale-105 transition-transform shadow-premium">
                <Shield className="w-20 h-20 text-amber-400" strokeWidth={2} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8">
        {/* Professional Stats Grid */}
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
              <div className="text-4xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stat.label}
              </div>
              <div className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change} this week
              </div>
            </div>
          ))}
        </div>

        {/* Professional Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4 animate-fade-in-corporate" style={{ animationDelay: '400ms' }}>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-corporate-primary flex items-center gap-3 group"
          >
            <Upload className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            <span>Upload Documents</span>
          </button>
          
          {selectedDocument && (
            <>
              <button
                onClick={() => navigate(`/checklist/${selectedDocument.id}`)}
                className="btn-corporate-outline flex items-center gap-3 group"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span>View Checklist</span>
              </button>
              <button
                onClick={() => navigate(`/risk/${selectedDocument.id}`)}
                className="btn-corporate-outline flex items-center gap-3 group"
              >
                <TrendingUp className="w-5 h-5 text-blue-900 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span>Risk Assessment</span>
              </button>
            </>
          )}
        </div>

        {/* Professional Document Upload Section */}
        <div className="animate-slide-up-corporate" style={{ animationDelay: '500ms' }}>
          <div className="card-gold-accent hover-lift-corporate">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="icon-container-corporate">
                  <Upload className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="section-header-corporate !mb-0">
                    Document Management
                  </h2>
                  <p className="text-corporate-secondary text-sm">
                    Upload and manage your audit documents
                  </p>
                </div>
              </div>

              <DocumentUpload
                onUploadComplete={handleDocumentUpload}
                documents={documents}
                onDocumentSelect={handleDocumentSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;