import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'ai';
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  text,
  variant = 'spinner',
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2 className={`${sizes[size]} text-blue-600 animate-spin`} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            <div className={`${sizes[size]} bg-blue-600 rounded-full animate-bounce`}></div>
            <div className={`${sizes[size]} bg-indigo-600 rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`${sizes[size]} bg-purple-600 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className="relative">
            <div className={`${sizes[size]} bg-blue-600 rounded-full animate-ping absolute`}></div>
            <div className={`${sizes[size]} bg-blue-600 rounded-full`}></div>
          </div>
        );
      
      case 'ai':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <Sparkles className={`${sizes[size]} text-blue-600 animate-spin relative`} />
          </div>
        );
      
      default:
        return null;
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {renderLoader()}
      {text && (
        <p className="text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;