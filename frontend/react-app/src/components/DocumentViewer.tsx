import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Calendar, 
  Shield, 
  Database,
  BarChart3,
  Loader2
} from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { documentService, AuditDocument } from '../services/documentService';
import toast from 'react-hot-toast';

const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<AuditDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadDocument(parseInt(id));
    }
  }, [id]);

  const loadDocument = async (docId: number) => {
    try {
      setLoading(true);
      const doc = await documentService.getDocumentById(docId);
      setDocument(doc);
      console.log('📄 Loaded document:', doc);
      console.log('📄 S3 URL:', doc.s3Url);
      console.log('📄 File Type:', doc.fileType);
      console.log('📄 Extracted Text Length:', doc.extractedText?.length || 0);
    } catch (error) {
      console.error('Failed to load document:', error);
      toast.error('Failed to load document');
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    try {
      toast.loading('Downloading document...');
      
      // Try using the download API first
      try {
        const blob = await documentService.downloadDocument(document.id);
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.fileName;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success('Document downloaded!');
        return;
      } catch (apiError) {
        console.log('API download failed, trying direct S3 download...');
      }
      
      // Fallback: Use S3 URL if API fails
      if (document.s3Url) {
        const a = window.document.createElement('a');
        a.href = document.s3Url;
        a.download = document.fileName;
        a.target = '_blank';
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        toast.dismiss();
        toast.success('Document downloaded!');
      } else {
        toast.dismiss();
        toast.error('Download URL not available');
      }
    } catch (error) {
      console.error('Failed to download:', error);
      toast.dismiss();
      toast.error('Failed to download document');
    }
  };

  const getStandardIcon = (standard?: string) => {
    switch (standard) {
      case 'ISO_27001': return '🔒';
      case 'GDPR': return '🛡️';
      case 'HIPAA': return '🏥';
      default: return '📄';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'ANALYZED': return 'bg-green-100 text-green-700 border-green-300';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'ERROR': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Document Not Found</h2>
          <Button onClick={() => navigate('/documents')}>Back to Documents</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={() => navigate('/documents')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Documents
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/analyze')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <BarChart3 className="w-4 h-4" />
              Analyze
            </Button>
          </div>
        </div>

        {/* Document Info Card */}
        <Card className="mb-6 bg-white/95 backdrop-blur-xl shadow-xl">
          <div className="p-6">
            <div className="flex items-start gap-6">
              {/* Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur opacity-50 rounded-xl"></div>
                <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <span className="text-3xl">{getStandardIcon(document.standard)}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.fileName}</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>{document.standard?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>{document.fileType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-pink-600" />
                    <span>{new Date(document.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(document.status)}`}>
                    {document.status || 'UPLOADED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Document Content */}
        <div className="space-y-6">
          {/* PDF Preview */}
          {document.s3Url && document.fileType === 'application/pdf' && (
            <Card className="bg-white/95 backdrop-blur-xl shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">PDF Document</h2>
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="text-center py-8">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 blur-xl opacity-30"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                        <FileText className="w-12 h-12 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{document.fileName}</h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Size: {(document.fileSize / 1024 / 1024).toFixed(2)} MB • Type: PDF
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3"
                      >
                        <Download className="w-5 h-5" />
                        Download to View Full PDF
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => window.open(document.s3Url, '_blank')}
                        className="flex items-center gap-2 px-6 py-3"
                      >
                        <FileText className="w-5 h-5" />
                        Open in New Tab
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Note: Direct PDF preview may require authentication. Download or open in new tab to view.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Image Preview */}
          {document.s3Url && document.fileType?.includes('image') && (
            <Card className="bg-white/95 backdrop-blur-xl shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Image Preview</h2>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <img
                    src={document.s3Url}
                    alt={document.fileName}
                    className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                    onError={(e) => {
                      console.error('Image failed to load');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Extracted Text */}
          {document.extractedText && (
            <Card className="bg-white/95 backdrop-blur-xl shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Document Text Content</h2>
                  <span className="ml-auto text-xs text-gray-500">
                    {document.extractedText.length} characters
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                      {document.extractedText}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* No Content Available */}
          {!document.s3Url && !document.extractedText && (
            <Card className="bg-white/95 backdrop-blur-xl shadow-xl">
              <div className="p-6">
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm mb-2">No document content available</p>
                  <p className="text-gray-400 text-xs mt-2 mb-6">The document file is not accessible</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/analyze')}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analyze Document
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/documents')}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to List
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;