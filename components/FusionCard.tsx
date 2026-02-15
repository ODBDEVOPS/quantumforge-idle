
// components/FusionCard.tsx
import React, { useState, useMemo } from 'react';
import { FusionRecipe, GameState, SpecPath } from '../types';
import Button from './Button';
import Tooltip from './Tooltip';

interface FusionCardProps {
  recipe: FusionRecipe;
  gameState: GameState;
  onFuse: (recipeId: string, amount: number) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const FusionCard: React.FC<FusionCardProps> = ({ recipe, gameState, onFuse, isSelected, onSelect }) => {
  const [fuseAmount, setFuseAmount] = useState(1);
  const [isFusing, setIsFusing] = useState(false);

  if (!recipe.unlocked) return null;

  const outputRes = gameState.resources[recipe.output.resourceId];
  
  const calculateMaxFusion = () => {
    const architectLevel = gameState.specializations[SpecPath.ARCHITECT].level;
    const costMultiplier = gameState.activeSpec === SpecPath.ARCHITECT ? Math.pow(0.9, architectLevel) : 1;

    let minMax = Infinity;
    recipe.inputs.forEach(input => {
      const available = gameState.resources[input.resourceId].amount;
      const required = input.amount * costMultiplier;
      const possible = Math.floor(available / required);
      if (possible < minMax) minMax = possible;
    });
    return minMax === Infinity ? 0 : minMax;
  };

  const maxPossible = calculateMaxFusion();
  const canAfford = maxPossible >= fuseAmount;

  // Determine tier based on XP reward
  const tierInfo = useMemo(() => {
    if (recipe.xpReward < 500) return { label: 'Stable', color: 'text-gray-400', border: 'border-gray-500/20' };
    if (recipe.xpReward < 2000) return { label: 'Volatile', color: 'text-cyan-400', border: 'border-cyan-500/20' };
    return { label: 'Transcendent', color: 'text-fuchsia-400', border: 'border-fuchsia-500/40' };
  }, [recipe.xpReward]);

  const handleFuse = () => {
    setIsFusing(true);
    setTimeout(() => {
      onFuse(recipe.id, fuseAmount);
      setIsFusing(false);
    }, 400);
  };

  return (
    <div 
      onClick={onSelect}
      className={`group relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 border-2 transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-[1.02]' : 'border-white/5 hover:border-cyan-500/30'}`}
    >
      {/* visual flair for ready status */}
      {canAfford && !isSelected && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none"></div>
      )}

      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all shadow-lg
            ${isSelected ? 'bg-cyan-500/20 border-cyan-400' : 'bg-black/40 border-white/5'}`}>
            <span className={`text-3xl transition-transform ${isFusing ? 'animate-ping' : 'group-hover:scale-110'}`}>{outputRes.icon}</span>
          </div>
          <div className="flex flex-col">
            <h3 className={`text-[11px] font-black uppercase tracking-tight leading-none ${isSelected ? 'text-cyan-400' : 'text-gray-300'}`}>{recipe.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[7px] font-black uppercase px-1 rounded bg-black/40 ${tierInfo.color}`}>{tierInfo.label}</span>
              <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Yield: {recipe.output.amount}x</span>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${canAfford ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {canAfford ? 'Ready' : 'Insufficient'}
          </span>
          <span className="text-[7px] text-gray-600 font-bold">+{recipe.xpReward} XP</span>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 space-y-4 animate-fade-in-up">
          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Reagent Matrix</span>
              <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Required Flux</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {recipe.inputs.map((input, idx) => {
                const res = gameState.resources[input.resourceId];
                const architectLevel = gameState.specializations[SpecPath.ARCHITECT].level;
                const costMultiplier = gameState.activeSpec === SpecPath.ARCHITECT ? Math.pow(0.9, architectLevel) : 1;
                const actualCost = input.amount * costMultiplier * fuseAmount;
                const hasEnough = res.amount >= actualCost;
                
                return (
                  <div key={idx} className="flex justify-between items-center px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{res.icon}</span>
                      <span className="text-[9px] font-black text-gray-300 uppercase truncate w-24">{res.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black ${hasEnough ? 'text-emerald-400' : 'text-red-500'}`}>{Math.floor(actualCost).toLocaleString()}</span>
                      <div className={`w-1 h-4 rounded-full ${hasEnough ? 'bg-emerald-500/40' : 'bg-red-500/40'}`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
             <span className="text-[8px] font-black text-gray-500 uppercase">Load</span>
             <input 
               type="range" 
               min="1" 
               max={Math.max(1, maxPossible)} 
               value={fuseAmount} 
               onChange={(e) => {
                 e.stopPropagation();
                 setFuseAmount(parseInt(e.target.value));
               }}
               onClick={(e) => e.stopPropagation()}
               className="flex-grow h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
             />
             <span className="text-[10px] font-black text-white w-8 text-center">{fuseAmount}</span>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={(e) => { e.stopPropagation(); handleFuse(); }}
              disabled={!canAfford || fuseAmount <= 0 || isFusing}
              fullWidth
              className={`!py-1.5 !text-[10px] uppercase tracking-widest !bg-gradient-to-r !from-cyan-600 !to-blue-700 !shadow-cyan-500/20`}
            >
              {isFusing ? 'COLLAPSING...' : `IGNITE FUSION`}
            </Button>
            <Button 
              onClick={(e) => { e.stopPropagation(); setFuseAmount(maxPossible); }}
              disabled={maxPossible <= 0}
              variant="outline"
              className="!px-3 !py-1.5 !text-[9px] font-black"
            >
              MAX
            </Button>
          </div>
        </div>
      )}

      {!isSelected && (
        <p className="mt-3 text-[9px] text-gray-500 italic truncate px-1 group-hover:text-gray-400 transition-colors">
          {recipe.description}
        </p>
      )}
    </div>
  );
};

export default FusionCard;
