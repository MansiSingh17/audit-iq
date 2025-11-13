import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { documentService } from '../services/documentService';
import type { AuditDocument } from '../services/documentService';
import Card from './common/Card';
import Button from './common/Button';
import ProgressBar from './common/ProgressBar';
import Alert from './common/Alert';
import toast from 'react-hot-toast';

const COMPLIANCE_STANDARDS = [
  { value: 'ISO_27001', label: 'ISO 27001:2022 - Information Security' },
  { value: 'GDPR', label: 'GDPR - Data Protection' },
  { value: 'HIPAA', label: 'HIPAA - Healthcare Privacy' },
  { value: 'SOC2', label: 'SOC 2 - Service Organization Control' },
  { value: 'PCI_DSS', label: 'PCI DSS - Payment Card Security' },
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
  const uploadInProgressRef = useRef(false); // Prevent duplicate uploads

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    // Prevent duplicate uploads
    if (uploadInProgressRef.current) {
      console.warn('⚠️ Upload already in progress, ignoring duplicate request');
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }

    // Set upload lock
    uploadInProgressRef.current = true;
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      console.log('📤 Starting upload:', file.name, 'Standard:', standard);
      
      await documentService.uploadDocument(file, standard);
      
      console.log('✅ Upload successful');
      toast.success('Document uploaded successfully!');
      
      // Clear form
      setFile(null);
      setUploadProgress(100);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Notify parent
      onUploadComplete();
      
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload document';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      uploadInProgressRef.current = false; // Release upload lock
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Upload Audit Document</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compliance Standard
              </label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={uploading}
              >
                {COMPLIANCE_STANDARDS.map((std) => (
                  <option key={std.value} value={std.value}>
                    {std.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document File
              </label>
              <div className="flex items-center justify-center w-full">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    disabled={uploading}
                  />
                </label>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
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
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </div>
      </Card>

      {documents.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
            <div className="space-y-2">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onDocumentSelect(doc)}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <p className="font-medium">{doc.fileName}</p>
                  <p className="text-sm text-gray-500">{doc.standard}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DocumentUpload;