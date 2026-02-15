
import React from 'react';
import { SpecPath, GameState, ResourceId } from '../types';
import Modal from './Modal';
import Button from './Button';

interface SpecializationDetailProps {
  path: SpecPath;
  gameState: GameState;
  onUpgrade: (path: SpecPath) => void;
  onClose: () => void;
}

const SpecializationDetail: React.FC<SpecializationDetailProps> = ({ path, gameState, onUpgrade, onClose }) => {
  const spec = gameState.specializations[path];
  const isActive = gameState.activeSpec === path;
  const canAfford = gameState.resources[ResourceId.VOID_SHARDS].amount >= spec.costToUpgrade;

  const getBonusRows = () => {
    const lvl = spec.level;
    const next = lvl + 1;
    switch (path) {
      case SpecPath.FORGER:
        return [
          { label: 'Metallic Production', current: `+${lvl * 50}%`, next: `+${next * 50}%`, desc: 'Boosts Metal, Alloy, Nano, Silica, etc.' },
          { label: 'Assembly Speed', current: `+${((Math.pow(1.2, lvl) - 1) * 100).toFixed(1)}%`, next: `+${((Math.pow(1.2, next) - 1) * 100).toFixed(1)}%`, desc: 'Metal-based recipes complete faster.' }
        ];
      case SpecPath.ALCHEMIST:
        return [
          { label: 'Bio-Organic Synthesis', current: `+${lvl * 50}%`, next: `+${next * 50}%`, desc: 'Boosts Crystals, Biomass, Processors, etc.' },
          { label: 'Bio-Unit Speed', current: `+${((Math.pow(1.2, lvl) - 1) * 100).toFixed(1)}%`, next: `+${((Math.pow(1.2, next) - 1) * 100).toFixed(1)}%`, desc: 'Bio-tech recipes complete faster.' }
        ];
      case SpecPath.ARCHITECT:
        return [
          { label: 'Cost Optimization', current: `-${(100 - Math.pow(0.9, lvl) * 100).toFixed(1)}%`, next: `-${(100 - Math.pow(0.9, next) * 100).toFixed(1)}%`, desc: 'Reduces all resource costs in the forge.' },
          { label: 'Temporal Compression', current: `+${((Math.pow(1.25, lvl) - 1) * 100).toFixed(1)}%`, next: `+${((Math.pow(1.25, next) - 1) * 100).toFixed(1)}%`, desc: 'Universal crafting speed boost.' }
        ];
      case SpecPath.VOID_SEEKER:
        return [
          { label: 'Recycle Resonance', current: `+${lvl * 25}%`, next: `+${next * 25}%`, desc: 'More Void Shards from deconstructing.' },
          { label: 'Exotic Extraction', current: `+${lvl * 40}%`, next: `+${next * 40}%`, desc: 'Boosts Dark Matter and Rare materials.' }
        ];
      case SpecPath.STELLAR_CARTOGRAPHER:
        return [
          { label: 'Quest Intelligence', current: `+${lvl * 30}%`, next: `+${next * 30}%`, desc: 'Higher XP and Resource mission payouts.' },
          { label: 'Lab Efficiency', current: `-${(100 - Math.pow(0.85, lvl) * 100).toFixed(1)}%`, next: `-${(100 - Math.pow(0.85, next) * 100).toFixed(1)}%`, desc: 'Reduces research calibration costs.' }
        ];
      default:
        return [];
    }
  };

  const bonuses = getBonusRows();

  return (
    <Modal isOpen={true} onClose={onClose} title="Alignment Details">
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/30">
          <div className="text-5xl animate-pulse">{spec.icon}</div>
          <div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight">{spec.name}</h4>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded uppercase">Rank {spec.level}</span>
               {isActive && <span className="text-[10px] font-black bg-emerald-500 text-black px-2 py-0.5 rounded uppercase animate-bounce">Active</span>}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 italic px-1 leading-relaxed">
          {spec.description}
        </p>

        {/* Scaling Table */}
        <div className="space-y-3">
          <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-1">Neural Scaling Efficiency</h5>
          <div className="space-y-2">
            {bonuses.map((b, i) => (
              <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                   <span className="text-xs font-black text-white">{b.label}</span>
                   <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-gray-500">{b.current}</span>
                      <span className="text-indigo-500">→</span>
                      <span className="text-emerald-400">{b.next}</span>
                   </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Footer */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-end mb-4 px-1">
             <div>
                <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Calibration Requirement</p>
                <p className={`text-lg font-black ${canAfford ? 'text-indigo-400' : 'text-red-400'}`}>{spec.costToUpgrade} 🌌</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Available Shards</p>
                <p className="text-sm font-bold text-gray-300">{Math.floor(gameState.resources[ResourceId.VOID_SHARDS].amount).toLocaleString()} 🌌</p>
             </div>
          </div>
          <Button 
            fullWidth 
            variant={canAfford ? "primary" : "outline"} 
            disabled={!canAfford}
            onClick={() => onUpgrade(path)}
            className="!py-3 uppercase tracking-widest"
          >
            {isActive ? "Deepen Alignment" : "Initiate Alignment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SpecializationDetail;
