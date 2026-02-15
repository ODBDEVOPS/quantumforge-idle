
// components/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 1
  className?: string;
  fillGradient?: string; // Optional custom gradient classes for the fill
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '', fillGradient }) => {
  const percentage = Math.max(0, Math.min(100, progress * 100));

  // Default gradient if not provided
  const defaultGradient = 'from-emerald-500 to-teal-600';
  const gradientClasses = fillGradient || defaultGradient;

  return (
    <div className={`w-full bg-gray-700 rounded-full h-2.5 relative overflow-hidden ${className}`}>
      <div
        className={`bg-gradient-to-r ${gradientClasses} h-2.5 rounded-full transition-all duration-100 ease-linear`}
        style={{ width: `${percentage}%` }}
      ></div>
      <span className="absolute inset-0 text-xs font-semibold flex items-center justify-center text-white text-shadow-sm pointer-events-none">
        {`${Math.floor(percentage)}%`}
      </span>
    </div>
  );
};

export default ProgressBar;
