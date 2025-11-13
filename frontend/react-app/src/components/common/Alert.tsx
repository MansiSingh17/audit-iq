import React from 'react';

export interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ variant, message, children, className = '' }) => {
  const variantClasses = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className={`p-4 border rounded-lg flex items-start space-x-3 ${variantClasses[variant]} ${className}`}>
      {children || message}
    </div>
  );
};

export default Alert;
