
// components/ProducerCard.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Producer, GameState, ResourceId, SpecPath } from '../types';
import { getProducerCost, getMaxAffordableLevels, getResourceProductionStats } from '../services/gameService';
import Tooltip from './Tooltip';

interface ProducerCardProps {
  producer: Producer;
  gameState: GameState;
  onUpgrade: (producerId: string) => void;
  onPurchaseMax: (producerId: string) => void;
  onSelect?: () => void;
}

const ProducerCard: React.FC<ProducerCardProps> = ({ producer, gameState, onUpgrade, onPurchaseMax, onSelect }) => {
  const [levelUpTrigger, setLevelUpTrigger] = useState(false);
  const prevLevel = useRef(producer.level);

  useEffect(() => {
    if (producer.level > prevLevel.current) {
      setLevelUpTrigger(true);
      const timer = setTimeout(() => setLevelUpTrigger(false), 600);
      prevLevel.current = producer.level;
      return () => clearTimeout(timer);
    }
    prevLevel.current = producer.level;
  }, [producer.level]);

  if (!producer.unlocked) return null;

  const theme = useMemo(() => {
    const resId = producer.produces;
    switch (resId) {
      case ResourceId.ENERGY_CRYSTAL:
        return { accent: 'cyan', text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20', btn: 'bg-cyan-600', ring: 'ring-cyan-500/50' };
      case ResourceId.RAW_METAL:
        return { accent: 'slate', text: 'text-slate-300', border: 'border-slate-400/30', bg: 'bg-slate-400/10', glow: 'shadow-slate-400/10', btn: 'bg-slate-500', ring: 'ring-slate-400/50' };
      case ResourceId.SYNTHETIC_BIOMASS:
        return { accent: 'emerald', text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20', btn: 'bg-emerald-600', ring: 'ring-emerald-500/50' };
      case ResourceId.SILICA_SAND:
        return { accent: 'amber', text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/20', btn: 'bg-amber-600', ring: 'ring-amber-500/50' };
      default:
        return { accent: 'indigo', text: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', glow: 'shadow-indigo-500/20', btn: 'bg-indigo-600', ring: 'ring-indigo-500/50' };
    }
  }, [producer.produces]);

  const architectLevel = gameState.specializations[SpecPath.ARCHITECT].level;
  const scaledCosts = getProducerCost(producer, architectLevel, gameState.activeSpec);
  const maxPossible = getMaxAffordableLevels(producer, gameState);
  const canAffordOne = scaledCosts.every(cost => gameState.resources[cost.resourceId].amount >= cost.amount);

  const { totalRate } = getResourceProductionStats(gameState, producer.produces);
  const nextRankRate = producer.level > 0 ? (totalRate / producer.level) * (producer.level + 1) : producer.baseRate;

  return (
    <div 
      onClick={onSelect}
      className={`group relative flex flex-col bg-gray-900/60 backdrop-blur-xl rounded-xl p-2.5 border-2 cursor-pointer transition-all duration-500 overflow-hidden
        ${canAffordOne ? `border-${theme.accent}-500/40 shadow-[0_0_15px_rgba(var(--tw-shadow-color),0.1)]` : 'border-white/5 hover:border-white/10'}`}
      style={{ '--tw-shadow-color': theme.accent === 'cyan' ? '6,182,212' : theme.accent === 'emerald' ? '16,185,129' : '99,102,241' } as React.CSSProperties}
    >
      {/* Background Scanline */}
      <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-${theme.accent}-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none`}></div>
      
      {/* Compact Header */}
      <div className="flex items-center gap-1.5 mb-2 relative z-10">
        <div className="relative flex-shrink-0">
          <div className={`w-8 h-8 ${theme.bg} rounded-lg flex items-center justify-center text-lg border border-white/10 shadow-inner group-hover:scale-105 transition-transform
            ${levelUpTrigger ? 'animate-level-up' : ''}`}
          >
            {producer.icon}
          </div>
          {producer.level > 0 && (
            <div className={`absolute -inset-0.5 border border-${theme.accent}-500/30 rounded-[0.5rem] animate-pulse`}></div>
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-grow">
          <div className="flex justify-between items-start gap-1">
            <h3 className="text-[9px] font-black text-white uppercase truncate tracking-tight leading-none">{producer.name}</h3>
            <span className={`text-[7px] font-black ${theme.text} bg-black/40 px-1 rounded`}>R{producer.level}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[8px] font-black uppercase tracking-tighter ${theme.text}`}>
              +{totalRate.toLocaleString(undefined, { maximumFractionDigits: 1 })}/s
            </span>
          </div>
        </div>
      </div>

      {/* Mini Stats Bar */}
      <div className="flex gap-1.5 mb-1.5 relative z-10 px-0.5">
        <div className="flex-1 bg-black/30 rounded-lg py-0.5 px-1 border border-white/5 flex justify-between items-center">
            <span className="text-[6px] text-gray-500 font-black uppercase">Efficiency</span>
            <span className="text-[7px] font-black text-gray-300">{(totalRate / Math.max(1, producer.level) * 60).toFixed(0)}/m</span>
        </div>
        <div className="flex-1 bg-black/30 rounded-lg py-0.5 px-1 border border-white/5 flex justify-between items-center">
          <span className="text-[6px] text-gray-500 font-black uppercase">Next</span>
          <span className="text-[7px] font-black text-emerald-400">+{((nextRankRate - totalRate)).toFixed(1)}</span>
        </div>
      </div>

      {/* Costs Area - Tightly Packed */}
      <div className="mb-2 space-y-1 relative z-10">
        <div className="flex flex-wrap gap-0.5">
          {scaledCosts.map((cost, i) => {
            const userRes = gameState.resources[cost.resourceId];
            const hasEnough = userRes.amount >= cost.amount;
            return (
              <Tooltip key={i} content={`${userRes.name}: ${Math.floor(userRes.amount).toLocaleString()} / ${Math.floor(cost.amount).toLocaleString()}`}>
                <div className={`flex items-center gap-0.5 px-1 py-0.25 rounded-lg text-[7px] font-black border transition-all
                  ${hasEnough ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400/70' : 'bg-red-500/5 border-red-500/10 text-red-400/80'}`}>
                  <span>{userRes.icon}</span>
                  <span>{cost.amount >= 1000 ? (cost.amount / 1000).toFixed(0) + 'k' : Math.floor(cost.amount)}</span>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 mt-auto relative z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpgrade(producer.id);
          }}
          disabled={!canAffordOne}
          className={`flex-grow h-7 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all relative overflow-hidden group/btn
            ${canAffordOne ? `${theme.btn} text-white shadow-md active:scale-95` : 'bg-gray-800 text-gray-600 opacity-40 cursor-not-allowed'}`}
        >
          <span className="relative z-10">Upgrade</span>
          {canAffordOne && (
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPurchaseMax(producer.id);
          }}
          disabled={maxPossible <= 0}
          className={`w-8 h-7 rounded-lg flex items-center justify-center text-[7px] font-black border transition-all
            ${maxPossible > 0 ? `border-${theme.accent}-500/20 bg-white/5 text-gray-300 hover:bg-white/10 active:scale-90` : 'border-white/5 text-gray-700 opacity-20'}`}
        >
          {maxPossible > 1 ? `+${maxPossible}` : 'MAX'}
        </button>
      </div>
    </div>
  );
};

export default ProducerCard;