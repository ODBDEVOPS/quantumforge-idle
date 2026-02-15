
// components/QuestCard.tsx
import React, { useState, useEffect } from 'react';
import { Quest, GameState } from '../types';
import Button from './Button';
import Tooltip from './Tooltip'; // Import Tooltip
import ProgressBar from './ProgressBar';

interface QuestCardProps {
  quest: Quest;
  gameState: GameState;
  onComplete: (questId: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, gameState, onComplete }) => {
  const [showCompleteAnimation, setShowCompleteAnimation] = useState(false);

  // Check if all requirements are met
  const allRequirementsMet = quest.requirements.every(req => 
    gameState.resources[req.resourceId].amount >= req.amount
  );

  // Trigger animation when quest becomes completable
  useEffect(() => {
    if (allRequirementsMet && !quest.isCompleted) {
      setShowCompleteAnimation(true);
      const timer = setTimeout(() => setShowCompleteAnimation(false), 2000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [allRequirementsMet, quest.isCompleted]);


  if (!quest.unlocked || quest.isCompleted) return null;

  return (
    <div className={`relative overflow-hidden p-5 rounded-3xl border transition-all duration-300 shadow-2xl
      ${allRequirementsMet && !quest.isCompleted 
        ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/30 border-blue-500/40 scale-[1.01] shadow-[0_0_30px_rgba(79,70,229,0.2)]' 
        : 'bg-gray-900/60 border-white/5 hover:border-white/10'}`}
    >
      {/* Dynamic Glow for Completeable Quests */}
      {allRequirementsMet && !quest.isCompleted && (
        <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none`}></div>
      )}

      {/* Header with Icon and Title */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-4xl border border-blue-500/30 shadow-inner group-hover:rotate-6 transition-transform">
            {quest.icon}
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-1">{quest.name}</h3>
            <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest bg-blue-500/20 px-2 py-0.5 rounded-full">High-Priority Request</span>
          </div>
        </div>
        {allRequirementsMet && !quest.isCompleted && (
          <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-bl-xl rounded-tr-3xl animate-pulse-micro">
            AWAITING AUTHORIZATION
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-400 italic leading-relaxed mb-5 border-l-2 border-white/5 pl-3">
        "{quest.description}"
      </p>

      {/* Requirements Section */}
      <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-3 mb-5">
        <h4 className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2">Reagent Matrix Requirements</h4>
        <div className="grid grid-cols-1 gap-2">
          {quest.requirements.map((req, i) => {
            const res = gameState.resources[req.resourceId];
            const hasEnough = res.amount >= req.amount;
            const progress = Math.min(1, res.amount / req.amount);

            return (
              <div key={i} className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{res.icon}</span>
                  <span className="text-[10px] font-black text-white uppercase">{res.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${hasEnough ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Math.floor(res.amount).toLocaleString()} / {req.amount.toLocaleString()}
                  </span>
                  <div className={`w-1.5 h-6 rounded-full ${hasEnough ? 'bg-emerald-500/50' : 'bg-red-500/50'}`}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-3 mb-5">
        <h4 className="text-[9px] text-gray-500 font-black uppercase tracking-widest block mb-2">Protocol Payloads</h4>
        <div className="flex flex-col gap-2">
          {/* XP Reward */}
          <div className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] font-black text-white uppercase">Experience Boost</span>
            <span className={`text-xl font-black ${allRequirementsMet ? 'text-blue-400 animate-pulse-micro' : 'text-gray-400'}`}>
              +{quest.rewards.xp} XP
            </span>
          </div>
          {/* Resource Rewards */}
          {quest.rewards.resources.map((reward, i) => (
            <div key={i} className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-black text-white uppercase">{gameState.resources[reward.resourceId].name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-base font-black ${allRequirementsMet ? 'text-emerald-400' : 'text-gray-400'}`}>
                  +{reward.amount.toLocaleString()}
                </span>
                <span className="text-xl">{gameState.resources[reward.resourceId].icon}</span>
              </div>
            </div>
          ))}
          {/* Fleet Reward (if any) */}
          {quest.rewards.fleet && (
            <div className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-black text-white uppercase">New Fleet Unit</span>
              <div className="flex items-center gap-2">
                <span className={`text-base font-black ${allRequirementsMet ? 'text-indigo-400' : 'text-gray-400'}`}>
                  {quest.rewards.fleet.type} (Lv.{quest.rewards.fleet.level})
                </span>
                <span className="text-xl">🚀</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complete Mission Button */}
      <Button 
        fullWidth 
        variant={allRequirementsMet ? "primary" : "outline"} 
        disabled={!allRequirementsMet}
        onClick={() => onComplete(quest.id)}
        className="!py-3 !text-[11px] uppercase tracking-widest relative z-10"
      >
        <span className="relative z-10">{allRequirementsMet ? "Synchronize Protocol Completion" : "Reagent Matrix Incomplete"}</span>
        {showCompleteAnimation && (
          <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-pulse-ring-sm opacity-70"></div>
        )}
      </Button>
    </div>
  );
};

export default QuestCard;
