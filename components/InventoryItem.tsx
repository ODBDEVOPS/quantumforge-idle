
// components/InventoryItem.tsx
import React from 'react';
import { Resource } from '../types';

interface InventoryItemProps {
  resource: Resource;
  onClick?: () => void;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ resource, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group w-full flex items-center justify-between p-3 bg-gray-900/40 hover:bg-gray-800/60 active:scale-[0.98] transition-all rounded-lg border border-gray-700/50 hover:border-emerald-500/30 text-left shadow-lg"
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-black/40 rounded-lg text-2xl group-hover:scale-110 transition-transform">
          {resource.icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-gray-200 uppercase tracking-tight">{resource.name}</span>
          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-emerald-400/70 transition-colors">Tap for details</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-base font-black text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.3)]">
          {Math.floor(resource.amount).toLocaleString()}
        </span>
      </div>
    </button>
  );
};

export default InventoryItem;
