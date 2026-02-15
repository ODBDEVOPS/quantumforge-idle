
// components/TechTreeItem.tsx
import React from 'react';
import { ResearchItem, GameState, SpecPath, ResourceId } from '../types';
import Button from './Button';
import Tooltip from './Tooltip';
import ProgressBar from './ProgressBar';

interface TechTreeItemProps {
  research: ResearchItem;
  gameState: GameState;
  onResearch: (researchId: string) => void;
  isSelected: boolean;
  isPrerequisite: boolean;
  onSelect: () => void;
  currentTime: number;
}

const TechTreeItem: React.FC<TechTreeItemProps> = ({ research, gameState, onResearch, isSelected, isPrerequisite, onSelect, currentTime }) => {
  const activeSpec = gameState.activeSpec;
  const activeLevel = gameState.specializations[activeSpec].level;
  let costReduction = 1;
  if (activeSpec === SpecPath.STELLAR_CARTOGRAPHER && activeLevel > 0) {
    costReduction = Math.pow(0.85, activeLevel);
  }

  const canAfford = !research.isResearched && research.cost.every(cost =>
    gameState.resources[cost.resourceId].amount >= cost.amount * costReduction
  );

  const prerequisitesMet = !research.prerequisites || research.prerequisites.every(preId => 
    gameState.research.find(r => r.id === preId)?.isResearched
  );

  const isActiveResearch = gameState.activeResearch?.researchId === research.id;
  const isLocked = !prerequisitesMet;

  const renderUnlocks = () => {
    return research.unlocks.map((unlock, i) => {
      let icon = '❓';
      let label = 'Unknown';
      
      if (unlock.producerId) {
        const p = gameState.producers.find(item => item.id === unlock.producerId);
        if (p) { icon = p.icon; label = `Unlock Producer: ${p.name}`; }
      } else if (unlock.recipeId) {
        const r = gameState.recipes.find(item => item.id === unlock.recipeId);
        if (r) { icon = '📜'; label = `Unlock Recipe: ${r.name}`; }
      } else if (unlock.crafterId) {
        const c = gameState.crafters.find(item => item.id === unlock.crafterId);
        if (c) { icon = c.icon; label = `Unlock Crafter: ${c.name}`; }
      } else if (unlock.globalMultiplier) {
        icon = '📈'; 
        label = `Global Multiplier: x${unlock.globalMultiplier.multiplier}`;
        if (unlock.globalMultiplier.resourceId) {
            label = `${gameState.resources[unlock.globalMultiplier.resourceId].name} Multiplier: x${unlock.globalMultiplier.multiplier}`;
        }
      } else if (unlock.questId) {
        icon = '📜'; label = 'New Sector Mission';
      }

      return (
        <Tooltip key={i} content={label}>
          <div className="flex items-center justify-center w-7 h-7 bg-white/5 rounded-md border border-white/10 text-xs"> {/* Slightly larger icons */}
            {icon}
          </div>
        </Tooltip>
      );
    });
  };

  return (
    <div 
      onClick={onSelect}
      className={`relative group bg-gray-900/60 backdrop-blur-sm rounded-xl p-3 border shadow-xl flex flex-col transition-all duration-500 cursor-pointer overflow-hidden
      ${isSelected ? 'border-blue-400 scale-[1.03] shadow-blue-500/30' : isPrerequisite ? 'border-amber-400/50' : 'border-white/5'}
      ${isActiveResearch ? 'bg-blue-900/20 border-blue-400/40' : ''}
      ${isLocked ? 'opacity-40 grayscale-[0.7] pointer-events-none' : ''}`}
    >
      {/* Dynamic Hover Glow */}
      {!isLocked && (
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
          ${isSelected ? 'bg-blue-500/10 shadow-[0_0_25px_rgba(30,144,255,0.4)]' : 'group-hover:bg-blue-500/5 group-hover:shadow-[0_0_15px_rgba(30,144,255,0.2)]'}`}></div>
      )}
      
      {/* Glossy Overlay for Active */}
      {isActiveResearch && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>
      )}

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 text-center">
            <span className="text-5xl text-gray-500 opacity-70 mb-2">🔒</span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Protocol Lock Engaged</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-2 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center bg-black/40 rounded-xl text-2xl border transition-all ${isActiveResearch ? 'border-blue-400 shadow-lg shadow-blue-500/20 active-glow' : 'border-white/5'}`}>
            {research.icon}
          </div>
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-tight leading-none mb-1">{research.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-sm uppercase ${research.isResearched ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-900/40 text-blue-300'}`}>
                {research.isResearched ? 'COMPLETED' : `TIER ${research.tier} breakthrough`}
              </span>
              {!research.isResearched && (
                <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">{research.researchTime}s observation</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mb-3 leading-relaxed h-10 overflow-hidden italic px-1">
        {research.description}
      </p>

      {!research.isResearched ? (
        <div className="mt-auto space-y-3 relative z-10">
          <div className="flex justify-between items-end gap-4 px-1">
            <div className="flex flex-col gap-1">
               <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Calibration Costs</span>
               <div className="flex flex-wrap gap-1.5">
                  {research.cost.map((cost, idx) => {
                    const actualCost = Math.floor(cost.amount * costReduction);
                    const hasEnough = gameState.resources[cost.resourceId].amount >= actualCost;
                    const resource = gameState.resources[cost.resourceId];
                    return (
                      <Tooltip 
                        key={idx} 
                        content={`${resource.name}: ${Math.floor(resource.amount).toLocaleString()} / ${actualCost.toLocaleString()}`}
                      >
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all 
                          ${hasEnough ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/80' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                          <span className="text-xs grayscale-[0.5]">{resource.icon}</span>
                          <span className="text-[9px] font-black">{actualCost.toLocaleString()}</span>
                        </div>
                      </Tooltip>
                    );
                  })}
               </div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest">Tech Expansion</span>
               <div className="flex gap-1">
                 {renderUnlocks()}
               </div>
            </div>
          </div>

          {isActiveResearch ? (
            <div className="space-y-1.5">
               <div className="flex justify-between text-[8px] font-black text-blue-400 uppercase tracking-widest">
                  <span>Observation in progress</span>
                  <span>{((currentTime - gameState.activeResearch!.startTime) / gameState.activeResearch!.duration * 100).toFixed(0)}%</span>
               </div>
               <ProgressBar 
                  progress={(currentTime - gameState.activeResearch!.startTime) / gameState.activeResearch!.duration} 
                  className="h-1.5 !bg-black/60"
               />
            </div>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onResearch(research.id);
              }}
              disabled={!canAfford || !!gameState.activeResearch || isLocked}
              fullWidth
              variant={canAfford && !isLocked ? "primary" : "outline"}
              className="!py-1.5 !text-[10px] uppercase tracking-widest"
            >
              {isLocked ? "Prerequisites Unmet" : !!gameState.activeResearch ? "Lab Occupied" : "Initiate breakthrough"}
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-auto flex flex-col gap-2 p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-[10px] font-black animate-fade-in-up">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">✅</span>
              <span className="uppercase tracking-widest">Breakthrough Achieved</span>
            </div>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">+ {research.xpReward} XP</span>
          </div>
          <div className="border-t border-emerald-500/20 pt-2 flex justify-between items-center">
            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Unlocks:</span>
            <div className="flex gap-1">
              {renderUnlocks()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechTreeItem;
