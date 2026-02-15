
// components/CrafterCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Crafter, Recipe, GameState, CraftingJob, SpecPath } from '../types';
import { getMaxQueueSize, getCraftingDuration } from '../services/gameService';
import ProgressBar from './ProgressBar';
import Button from './Button'; // Import Button component
import Tooltip from './Tooltip'; // Import Tooltip

interface CrafterCardProps {
  crafter: Crafter;
  recipes: Recipe[];
  gameState: GameState;
  onCraft: (crafterId: string, recipeId: string, amount?: number) => void;
  currentTime: number;
}

const CrafterCard: React.FC<CrafterCardProps> = ({ crafter, recipes, gameState, onCraft, currentTime }) => {
  const [activeJobPulse, setActiveJobPulse] = useState(false);
  const [initiatingCraft, setInitiatingCraft] = useState<string | null>(null); // To show loading state on buttons
  const maxQueue = getMaxQueueSize(gameState.playerLevel);
  const isQueueFull = crafter.queue.length >= maxQueue;
  const activeJob = crafter.queue[0];

  useEffect(() => {
    if (activeJob) {
      setActiveJobPulse(true);
      const timer = setTimeout(() => setActiveJobPulse(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeJob?.id]);

  if (!crafter.unlocked) return null;

  const availableRecipes = recipes.filter(r => crafter.recipes.includes(r.id) && r.unlocked);

  const calculateMaxCraft = (recipe: Recipe) => {
    const architectLevel = gameState.specializations[SpecPath.ARCHITECT].level;
    const costMultiplier = gameState.activeSpec === SpecPath.ARCHITECT ? Math.pow(0.9, architectLevel) : 1;
    let minPossible = Infinity;
    recipe.inputs.forEach(input => {
      const avail = gameState.resources[input.resourceId].amount;
      const required = input.amount * costMultiplier; // Corrected: Use costMultiplier here
      const possible = Math.floor(avail / required);
      if (possible < minPossible) minPossible = possible; // Corrected: Use minPossible
    });
    const queueSpace = maxQueue - crafter.queue.length;
    return Math.max(0, Math.min(minPossible === Infinity ? 0 : minPossible, queueSpace));
  };

  const handleCraftClick = (recipeId: string, amount: number) => {
    setInitiatingCraft(recipeId); // Set initiating state for this recipe
    setTimeout(() => { // Simulate network delay or processing
      onCraft(crafter.id, recipeId, amount);
      setInitiatingCraft(null); // Clear initiating state
    }, 400); 
  };

  // Calculate output rate for active job
  const activeRecipe = activeJob ? recipes.find(r => r.id === activeJob.recipeId) : null;
  const activeJobOutputRate = activeJob && activeRecipe 
    ? (activeRecipe.outputs[0].amount / (activeJob.duration / 1000)) * 60 // Output amount per minute
    : 0;

  return (
    <div className={`bg-gray-900/60 backdrop-blur-xl rounded-2xl border-2 transition-all duration-500 relative overflow-hidden
      ${activeJob ? 'border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-white/5'}`}>
      
      {/* Dynamic background for active crafter */}
      {activeJob && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-400/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>
      )}

      {/* Header Terminal */}
      <div className="flex items-center justify-between py-2.5 px-3 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl bg-purple-500/10 border border-purple-500/20 shadow-lg ${activeJob ? 'animate-pulse' : 'grayscale opacity-50'}`}>
            {crafter.icon}
          </div>
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-tighter leading-none">{crafter.name}</h3>
            <p className={`text-[8px] font-extrabold uppercase tracking-[0.2em] mt-0.5 ${activeJob ? 'text-blue-400' : 'text-gray-500'}`}>Status: {activeJob ? 'Active Fabrication' : 'Idle - Standby'}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-0.5 justify-end">
            {Array.from({ length: maxQueue }).map((_, i) => (
              <div key={i} className={`
                ${crafter.queue.length > i 
                  ? 'w-2.5 h-2.5 bg-emerald-500 shadow-md shadow-emerald-500/40 ring-2 ring-emerald-300/60 shadow-inner shadow-emerald-500/30' 
                  : 'w-2 h-2 bg-gray-700/70'} 
                rounded-full transition-all`}></div>
            ))}
          </div>
          <span className={`text-[11px] font-black drop-shadow-sm ${isQueueFull ? 'text-red-400' : 'text-emerald-400'}`}>
            {crafter.queue.length}/{maxQueue}
          </span>
          <span className="text-[8px] text-gray-500 font-extrabold uppercase tracking-widest mt-0.5">Queue Capacity</span>
        </div>
      </div>

      {/* Active Fabrication Display */}
      <div className="py-2 px-3 bg-black/20 relative z-10">
        {activeJob ? (
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest">{activeRecipe?.name}</span>
              <span className="text-[9px] font-mono text-gray-300">{(Math.max(0, (activeJob.startTime + activeJob.duration - currentTime) / 1000)).toFixed(1)}s</span>
            </div>
            <ProgressBar 
              progress={Math.max(0, Math.min(1, (currentTime - activeJob.startTime) / activeJob.duration))} 
              className="h-1.5 !bg-gray-800"
              fillGradient="from-purple-500 to-indigo-600" // Custom gradient for crafter progress
            />
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Output Rate</span>
              <span className="text-[10px] font-extrabold text-emerald-400">+{activeJobOutputRate.toFixed(1)}/min</span>
            </div>
          </div>
        ) : (
          <div className="py-2 flex justify-center">
            <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.3em]">Ready for Schematic Input</span>
          </div>
        )}
      </div>

      {/* Schematic List - Condensed */}
      <div className="py-2.5 px-3 grid grid-cols-1 gap-1.5 relative z-10">
        {availableRecipes.length > 0 ? (
          availableRecipes.map(recipe => {
            const maxCraft = calculateMaxCraft(recipe);
            const outputRes = gameState.resources[recipe.outputs[0].resourceId];
            const canCraft = maxCraft > 0;
            const craftDuration = getCraftingDuration(recipe, crafter, gameState); // Get actual duration

            return (
              <div 
                key={recipe.id} 
                className={`flex items-center justify-between py-1.5 px-2 bg-white/5 rounded-xl border transition-all relative group
                  ${canCraft ? 'border-emerald-500/30 shadow-[inset_0_0_8px_rgba(16,185,129,0.1)] group-hover:bg-white/5 group-hover:scale-[1.005]' : 'border-white/5'}
                  ${canCraft ? 'group-hover:border-emerald-500/50' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-black/40 rounded-lg text-xl group-hover:scale-110 transition-transform">
                    {outputRes.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-200 uppercase leading-none">{recipe.name}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black text-emerald-300">+ {recipe.outputs[0].amount} {outputRes.icon}</span>
                      <span className="text-[7px] text-gray-500 font-bold px-1 py-0.5 rounded-sm bg-black/40">+{recipe.xpReward} XP</span>
                      <span className="text-[7px] text-gray-500 font-bold px-1 py-0.5 rounded-sm bg-black/40">({(craftDuration / 1000).toFixed(1)}s)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-1 group-hover:ring-1 group-hover:ring-white/10 group-hover:rounded-lg">
                    {recipe.inputs.map((input, idx) => {
                      const res = gameState.resources[input.resourceId];
                      const architectLevel = gameState.specializations[SpecPath.ARCHITECT].level;
                      const costMultiplier = gameState.activeSpec === SpecPath.ARCHITECT ? Math.pow(0.9, architectLevel) : 1;
                      const actualCost = input.amount * costMultiplier; // Cost for 1 craft
                      const hasEnough = res.amount >= actualCost;
                      return (
                        <Tooltip key={idx} content={`${res.name}: ${Math.floor(gameState.resources[input.resourceId].amount).toLocaleString()} / ${Math.floor(actualCost).toLocaleString()}`}>
                          <div className="flex items-center gap-0.5">
                            <span className="text-base opacity-70">{res.icon}</span> {/* Larger icon */}
                            <span className={`text-[10px] font-bold ${hasEnough ? 'text-emerald-400' : 'text-red-400'}`}>{Math.floor(actualCost)}</span>
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <Button
                      onClick={() => handleCraftClick(recipe.id, 1)}
                      disabled={!canCraft || isQueueFull || initiatingCraft === recipe.id}
                      className="!py-1.5 !text-[9px] font-black uppercase tracking-tight"
                      variant={canCraft && !isQueueFull ? "primary" : "outline"}
                    >
                      {initiatingCraft === recipe.id ? 'Initiating...' : 'Start'}
                    </Button>
                    <Button
                      onClick={() => handleCraftClick(recipe.id, maxCraft)}
                      disabled={maxCraft <= 0 || isQueueFull || initiatingCraft === recipe.id}
                      className="!py-1.5 !px-2 !text-[8px] font-black"
                      variant={maxCraft > 0 && !isQueueFull ? "secondary" : "outline"}
                    >
                      {initiatingCraft === recipe.id ? '...' : `Max (${maxCraft})`}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-10 flex flex-col items-center justify-center opacity-40">
            <span className="text-5xl mb-4">🕳️</span>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest text-center">No schematics loaded. Research new recipes for this fabricator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrafterCard;
