
// components/ResourceDisplay.tsx
import React from 'react';
import { Resource, GameState } from '../types';
import { getResourceProductionStats } from '../services/gameService';
import Tooltip from './Tooltip';

interface ResourceDisplayProps {
  resource: Resource;
  gameState: GameState;
}

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resource, gameState }) => {
  const { totalRate } = getResourceProductionStats(gameState, resource.id);

  const tooltipContent = (
    <div className="space-y-0.5 text-[10px]">
      <p className="font-black text-white">{resource.name}</p>
      <div className="border-t border-white/10 my-1"></div>
      <p className="flex justify-between gap-4">
        <span>Amount:</span>
        <span className="text-emerald-300">{resource.amount.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
      </p>
      <p className="flex justify-between gap-4">
        <span>Producing:</span>
        <span className="text-teal-400">+{totalRate.toFixed(2)}/s</span>
      </p>
    </div>
  );

  return (
    <Tooltip content={tooltipContent}>
      <div className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-2 py-0.5 min-w-fit transition-colors">
        <span className="text-sm">{resource.icon}</span>
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-black text-emerald-400">
            {Math.floor(resource.amount).toLocaleString()}
          </span>
          {totalRate > 0 && (
            <span className="text-[7px] text-gray-500 font-bold">+{totalRate.toFixed(1)}/s</span>
          )}
        </div>
      </div>
    </Tooltip>
  );
};

export default ResourceDisplay;
