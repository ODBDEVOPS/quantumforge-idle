
// components/AchievementCard.tsx
import React from 'react';
import { Achievement, GameState, ResourceId } from '../types';
import ProgressBar from './ProgressBar';

interface AchievementCardProps {
  achievement: Achievement;
  gameState: GameState;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, gameState }) => {
  const isUnlocked = achievement.isUnlocked;
  const req = achievement.requirement;
  
  // Calculate current progress for the requirement
  let currentVal = 0;
  switch (req.type) {
    case 'PLAYER_LEVEL':
      currentVal = gameState.playerLevel;
      break;
    case 'PRODUCER_LEVEL':
      const prod = gameState.producers.find(p => p.id === req.targetId);
      currentVal = prod?.level || 0;
      break;
    case 'STAT_COUNT':
      currentVal = (gameState.stats as any)[req.targetId || ''] || 0;
      break;
    case 'RESEARCH_COUNT':
      currentVal = gameState.research.filter(r => r.isResearched).length;
      break;
    case 'RESOURCE_TOTAL':
      currentVal = gameState.resources[req.targetId as ResourceId]?.amount || 0;
      break;
  }

  const progress = Math.min(1, currentVal / req.value);

  return (
    <div className={`relative overflow-hidden p-4 rounded-2xl border transition-all duration-500
      ${isUnlocked 
        ? 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
        : 'bg-gray-900/40 border-white/5 opacity-60 grayscale-[0.8]'}`}>
      
      {/* Glossy Overlay for Unlocked */}
      {isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>
      )}

      <div className="flex items-start gap-4 mb-3">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-4xl shadow-inner border transition-transform
          ${isUnlocked ? 'bg-amber-500/20 border-amber-500/30 rotate-3' : 'bg-black/40 border-white/10'}`}>
          {achievement.icon}
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-1">
            <h3 className={`text-sm font-black uppercase tracking-tight ${isUnlocked ? 'text-amber-400' : 'text-gray-300'}`}>
              {achievement.name}
            </h3>
            {isUnlocked && (
              <span className="text-[7px] font-black bg-amber-500 text-black px-1.5 py-0.5 rounded-sm uppercase">UNLOCKED</span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 italic leading-tight">
            {achievement.description}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">
            {isUnlocked ? 'Milestone Cleared' : `Progress: ${Math.floor(currentVal).toLocaleString()} / ${req.value.toLocaleString()}`}
          </span>
          <span className={`text-[8px] font-black ${isUnlocked ? 'text-amber-500' : 'text-gray-500'}`}>
            Reward: +{achievement.xpReward} XP
          </span>
        </div>
        
        <ProgressBar 
          progress={progress} 
          className={`h-1.5 !bg-black/40 ${isUnlocked ? '!from-amber-400 !to-yellow-600' : ''}`}
        />
      </div>

      {isUnlocked && achievement.unlockedAt && (
        <div className="mt-3 text-[7px] text-amber-500/50 font-bold uppercase tracking-[0.2em] text-center">
          Digitized on {new Date(achievement.unlockedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
