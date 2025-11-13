import React from 'react';
import { Github, Mail, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © 2024 AuditIQ. AI-Powered Audit Quality Assistant.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com" className="text-gray-600 hover:text-gray-900">
              <Github className="w-5 h-5" />
            </a>
            <a href="mailto:support@auditiq.com" className="text-gray-600 hover:text-gray-900">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://auditiq.com" className="text-gray-600 hover:text-gray-900">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;