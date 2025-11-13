import FeaturesPage from './components/FeaturesPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DocumentList from './components/DocumentList';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import RiskDashboard from './components/RiskDashboard';
import GrammarChecker from './components/GrammarChecker';
import ChecklistGenerator from './components/ChecklistGenerator';
import AuditFindings from './components/AuditFindings';
import ChatPage from './components/ChatPage';
import ChatWidget from './components/ChatWidget';
import DocumentViewer from './components/DocumentViewer';
import './index.css';

function App() {
  return (
    <Router>
      {/* Wrapper to prevent horizontal overflow */}
      <div className="overflow-x-hidden w-full max-w-[100vw] min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-right" />
        
        {/* Main content wrapper */}
        <div className="overflow-x-hidden w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/features" replace />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentList />} />
            <Route path="/analyze" element={<DocumentAnalyzer />} />
            <Route path="/risk/:documentId" element={<RiskDashboard />} />
            <Route path="/grammar" element={<GrammarChecker />} />
            <Route path="/generate-checklist" element={<ChecklistGenerator />} />
            <Route path="/findings" element={<AuditFindings />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/document/:id" element={<DocumentViewer />} />
          </Routes>
        </div>
        
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;