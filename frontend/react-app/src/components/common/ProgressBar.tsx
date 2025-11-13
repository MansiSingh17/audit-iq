import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showLabel = false,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={className}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-1 text-right">{clampedProgress}%</p>
      )}
    </div>
  );
};

export default ProgressBar;