import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { documentService } from '../services/documentService';
import type { AuditDocument } from '../services/documentService';
import Button from './common/Button';
import ProgressBar from './common/ProgressBar';
import Alert from './common/Alert';
import toast from 'react-hot-toast';

const COMPLIANCE_STANDARDS = [
  { value: 'ISO_27001', label: 'ISO 27001:2022 - Information Security', icon: '🔒' },
  { value: 'GDPR', label: 'GDPR - Data Protection', icon: '🛡️' },
  { value: 'HIPAA', label: 'HIPAA - Healthcare Privacy', icon: '🏥' },
  { value: 'SOC2', label: 'SOC 2 - Service Organization Control', icon: '📋' },
  { value: 'PCI_DSS', label: 'PCI DSS - Payment Card Security', icon: '💳' },
];

interface DocumentUploadProps {
  onUploadComplete: () => void;
  documents: AuditDocument[];
  onDocumentSelect: (doc: AuditDocument) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onUploadComplete, 
  documents, 
  onDocumentSelect 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [standard, setStandard] = useState('ISO_27001');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const uploadInProgressRef = useRef(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (uploadInProgressRef.current) {
      console.warn('⚠️ Upload already in progress, ignoring duplicate request');
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }

    uploadInProgressRef.current = true;
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      console.log('📤 Starting upload:', file.name, 'Standard:', standard);
      
      await documentService.uploadDocument(file, standard);
      
      console.log('✅ Upload successful');
      toast.success('Document uploaded successfully!');
      
      setFile(null);
      setUploadProgress(100);
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      onUploadComplete();
      
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload document';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      uploadInProgressRef.current = false;
      
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-corporate">
        <div className="p-6">
          <h2 className="text-corporate-primary text-2xl mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Upload Audit Document</h2>
          
          <div className="space-y-6">
            {/* Standard Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                Compliance Standard
              </label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="input-corporate"
                disabled={uploading}
              >
                {COMPLIANCE_STANDARDS.map((std) => (
                  <option key={std.value} value={std.value}>
                    {std.icon} {std.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                Document File
              </label>
              <div className="relative">
                <div className={`border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center transition-all ${uploading ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-blue-900 hover:bg-slate-50 cursor-pointer'}`}>
                  <Upload className={`w-16 h-16 mx-auto mb-4 transition-all ${uploading ? 'text-slate-300' : 'text-slate-400'}`} strokeWidth={2} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    disabled={uploading}
                    id="file-upload-input"
                  />
                  <label htmlFor="file-upload-input" className={uploading ? 'cursor-not-allowed' : 'cursor-pointer'}>
                    <span className="text-blue-900 hover:text-amber-600 font-bold text-lg transition-colors">
                      Click to upload
                    </span>
                    <span className="text-slate-600"> or drag and drop</span>
                  </label>
                  <p className="text-sm text-slate-500 mt-3">
                    PDF, DOC, DOCX (MAX. 10MB)
                  </p>
                </div>
                {file && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="icon-container-corporate w-10 h-10">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">{file.name}</p>
                        <p className="text-xs text-blue-700">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <ProgressBar progress={uploadProgress} />
            )}

            {error && (
              <Alert variant="error" message={error} />
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              variant="primary"
              fullWidth
              className="btn-corporate-primary text-lg py-4"
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="card-corporate">
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Recent Uploads</h3>
            <div className="space-y-2">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onDocumentSelect(doc)}
                  className="p-4 border-2 border-slate-200 rounded-xl hover:border-blue-900 hover:bg-slate-50 cursor-pointer transition-all hover-lift-corporate"
                >
                  <p className="font-bold text-slate-900" style={{ fontFamily: 'Inter, sans-serif' }}>{doc.fileName}</p>
                  <p className="text-sm text-slate-600">{doc.standard}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;