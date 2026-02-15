
// components/Leaderboard.tsx
import React, { useMemo } from 'react';
import { GameState, LeaderboardEntry, SpecPath } from '../types';

interface LeaderboardProps {
  gameState: GameState;
  onClose: () => void;
}

const AI_NAMES = [
  "Xenon-7", "Dr. Nova", "VoidMaster", "Astra-01", "GigaWatt", 
  "NexusPrime", "Cortex-9", "Solaris", "EchoPulsar", "QuantumGhost",
  "TitanNebula", "CyberScribe", "VortexLord", "SiliconSage", "Orion"
];

const Leaderboard: React.FC<LeaderboardProps> = ({ gameState, onClose }) => {
  const ranking = useMemo(() => {
    const entries: LeaderboardEntry[] = AI_NAMES.map((name, i) => {
      // Create entries based on player level to keep it competitive
      const levelOffset = Math.floor(Math.sin(i * 1.5) * 5);
      const level = Math.max(1, gameState.playerLevel + levelOffset + (i < 3 ? 10 : -2)); // Top 3 AI players are generally higher level
      const score = level * 1000 + (Math.abs(levelOffset) * 250) + (Math.random() * 500); // Add some randomness
      
      const availableSpecs = Object.values(SpecPath).filter(spec => spec !== SpecPath.NONE);
      const randomSpec = availableSpecs[Math.floor(Math.random() * availableSpecs.length)];

      return {
        name,
        level,
        score,
        spec: randomSpec,
        isPlayer: false
      };
    });

    entries.push({
      name: "YOU",
      level: gameState.playerLevel,
      score: gameState.playerLevel * 1000 + Math.floor(gameState.stats.totalVoidShardsEarned / 10),
      spec: gameState.activeSpec,
      isPlayer: true
    });

    return entries.sort((a, b) => b.score - a.score);
  }, [gameState.playerLevel, gameState.stats.totalVoidShardsEarned, gameState.activeSpec]);

  const playerRank = ranking.findIndex(e => e.isPlayer) + 1;

  // Derive player's rank title based on level, similar to App.tsx
  const getRankTitle = (level: number) => {
    if (level < 5) return "Forge Initiate";
    if (level < 10) return "Sector Cadet";
    if (level < 20) return "Machine Overseer";
    if (level < 30) return "Master Artificer";
    if (level < 50) return "Sector Architect";
    if (level < 100) return "Quantum Sovereign";
    return "Transcendent Entity";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative bg-gray-900 border-2 border-indigo-500/50 rounded-[2.5rem] shadow-[0_0_50px_rgba(79,70,229,0.3)] max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Holographic Header */}
        <div className="p-8 border-b border-indigo-500/30 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse"></div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">Stellar Rankings</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.3em]">Quantum Integrated Network</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl font-black transition-colors">&times;</button>
          </div>
        </div>

        {/* Player Summary Row */}
        <div className="bg-indigo-500/10 p-4 border-b border-indigo-500/20 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/30 text-white font-black">
               #{playerRank}
             </div>
             <div>
               <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest block">Your Current Tier</span>
               <span className="text-sm font-black text-white uppercase">{getRankTitle(gameState.playerLevel)}</span>
             </div>
          </div>
          <div className="text-right">
             <span className="text-[8px] text-gray-500 font-black uppercase block">Power Level</span>
             <span className="text-lg font-black text-emerald-400">{Math.floor(gameState.playerLevel * 1000 + gameState.stats.totalVoidShardsEarned / 10).toLocaleString()}</span>
          </div>
        </div>

        {/* Rankings List */}
        <div className="flex-grow overflow-y-auto scrollbar-hide p-6 space-y-3">
          {ranking.map((entry, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;
            
            return (
              <div 
                key={idx}
                className={`relative p-4 rounded-2xl border transition-all flex items-center justify-between
                  ${entry.isPlayer ? 'bg-indigo-600/20 border-indigo-400 active-glow' : 'bg-black/20 border-white/5'}
                  ${isTop3 ? 'scale-[1.02]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm
                    ${rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 
                      rank === 2 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/50' :
                      rank === 3 ? 'bg-orange-700/20 text-orange-400 border border-orange-700/50' :
                      'bg-black/40 text-gray-500 border border-white/5'}`}>
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h4 className={`text-[12px] font-black uppercase ${entry.isPlayer ? 'text-white' : 'text-gray-300'}`}>{entry.name}</h4>
                       {entry.isPlayer && <span className="text-[6px] bg-emerald-500 text-black px-1 rounded-sm font-black">ONLINE</span>}
                    </div>
                    <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">LV.{entry.level} • {entry.spec}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[12px] font-black ${isTop3 ? 'text-indigo-400' : 'text-gray-400'}`}>
                    {Math.floor(entry.score).toLocaleString()}
                  </span>
                  <span className="text-[7px] text-gray-700 font-bold uppercase block tracking-tighter">Power Level</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/40 border-t border-white/5">
           <p className="text-[8px] text-center text-gray-600 font-black uppercase tracking-[0.2em]">Next Sync in 00:59:02</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;