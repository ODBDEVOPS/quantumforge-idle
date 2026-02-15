
// components/Panel.tsx
import React, { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-700 ${className}`}>
      {title && (
        <h2 className="text-xl md:text-2xl font-extrabold text-emerald-400 mb-4 pb-2 border-b border-gray-700">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Panel;
