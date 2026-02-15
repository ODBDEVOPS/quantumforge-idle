
// components/VoidMarket.tsx
import React, { useState, useMemo } from 'react';
import { GameState, ResourceId, Resource, VoidUpgrade } from '../types';
import { getResourceDeconstructValue } from '../services/gameService';
import Button from './Button';

interface VoidMarketProps {
  gameState: GameState;
  onDeconstruct: (resourceId: ResourceId, amount: number) => void;
  onBuyVoidUpgrade: (upgradeId: string) => void;
}

const VoidMarket: React.FC<VoidMarketProps> = ({ gameState, onDeconstruct, onBuyVoidUpgrade }) => {
  const [activeSubTab, setActiveSubTab] = useState<'recycle' | 'shop'>('recycle');
  const [filter, setFilter] = useState<'all' | 'raw' | 'processed' | 'exotic'>('all');

  const getCategory = (resourceId: ResourceId): 'raw' | 'processed' | 'exotic' => {
    const val = getResourceDeconstructValue(resourceId);
    if (val < 1) return 'raw';
    if (val < 20) return 'processed';
    return 'exotic';
  };

  const recyclingList = useMemo(() => {
    return (Object.values(gameState.resources) as Resource[])
      .filter(r => r.id !== ResourceId.VOID_SHARDS && r.amount >= 1)
      .filter(r => filter === 'all' || getCategory(r.id) === filter)
      .sort((a, b) => getResourceDeconstructValue(b.id) - getResourceDeconstructValue(a.id));
  }, [gameState.resources, filter]);

  const totalValueAvailable = useMemo(() => {
    return recyclingList.reduce((acc, r) => acc + (Math.floor(r.amount) * getResourceDeconstructValue(r.id)), 0);
  }, [recyclingList]);

  const renderRecycle = () => (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-wrap gap-2">
        {['all', 'raw', 'processed', 'exotic'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
              ${filter === cat ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'}`}
          >
            {cat}
          </button>
        ))}
        {totalValueAvailable > 0 && (
          <Button 
            variant="danger" 
            size="sm" 
            className="ml-auto !py-1 !text-[9px]"
            onClick={() => {
              if(confirm(`Are you sure you want to recycle all filtered items for ${Math.floor(totalValueAvailable).toLocaleString()} Void Shards?`)) {
                recyclingList.forEach(r => onDeconstruct(r.id, Math.floor(r.amount)));
              }
            }}
          >
            PURGE FILTERED
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recyclingList.map(r => {
          const yieldPerUnit = getResourceDeconstructValue(r.id);
          const totalYield = r.amount * yieldPerUnit;
          const category = getCategory(r.id);
          const accentColor = category === 'exotic' ? 'text-amber-400' : category === 'processed' ? 'text-purple-400' : 'text-gray-400';

          return (
            <div key={r.id} className="group bg-gray-900/40 rounded-2xl p-4 border border-white/5 hover:border-indigo-500/30 transition-all hover:scale-[1.02] flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform shadow-lg">
                    {r.icon}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase truncate w-24">{r.name}</h4>
                    <span className={`text-[8px] font-bold uppercase tracking-tighter ${accentColor}`}>{category} grade</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[12px] font-black text-emerald-400 block">{Math.floor(r.amount).toLocaleString()}</span>
                  <span className="text-[7px] text-gray-600 font-bold uppercase">Stored</span>
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-2 flex justify-between items-center border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[7px] text-gray-500 font-black uppercase">Yield / Unit</span>
                  <span className="text-[10px] font-black text-indigo-300">{yieldPerUnit} 🌌</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[7px] text-gray-500 font-black uppercase">Max Return</span>
                  <span className="text-[10px] font-black text-indigo-400">+{Math.floor(totalYield).toLocaleString()} 🌌</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <Button onClick={() => onDeconstruct(r.id, 1)} variant="outline" className="!py-1 !text-[9px] !px-0">x1</Button>
                <Button onClick={() => onDeconstruct(r.id, Math.floor(r.amount * 0.1) || 1)} variant="outline" className="!py-1 !text-[9px] !px-0">10%</Button>
                <Button onClick={() => onDeconstruct(r.id, Math.floor(r.amount))} variant="secondary" className="!py-1 !text-[9px] !px-0 !bg-indigo-900/40">PURGE</Button>
              </div>
            </div>
          );
        })}
        {recyclingList.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30">
            <span className="text-6xl mb-4">🌑</span>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">The Abyss is silent. Collect resources to recycle.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {gameState.voidUpgrades.map((upgrade) => {
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
        const canAfford = gameState.resources[ResourceId.VOID_SHARDS].amount >= cost;
        
        return (
          <div key={upgrade.id} className="bg-gray-900/60 rounded-3xl p-6 border border-indigo-500/20 shadow-xl flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
              <span className="text-6xl">{upgrade.icon}</span>
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-4xl border border-indigo-500/30">
                {upgrade.icon}
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{upgrade.name}</h3>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Abyssal Offering • Rank {upgrade.level}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 italic leading-relaxed h-10 overflow-hidden">
              {upgrade.description}
            </p>

            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex justify-between items-end">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Upgrade Cost</span>
                <span className={`text-sm font-black ${canAfford ? 'text-indigo-400' : 'text-red-400'}`}>{cost.toLocaleString()} 🌌</span>
              </div>
              <Button 
                variant={canAfford ? "secondary" : "outline"}
                disabled={!canAfford}
                fullWidth
                onClick={() => onBuyVoidUpgrade(upgrade.id)}
                className="!py-3 !text-xs uppercase tracking-[0.2em]"
              >
                INFUSE OFFERING
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="bg-gray-900/60 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.1)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-white/5 animate-pulse-slow">
              🌌
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">The Void Abyss</h2>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setActiveSubTab('recycle')}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${activeSubTab === 'recycle' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Recycle
                </button>
                <button 
                  onClick={() => setActiveSubTab('shop')}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${activeSubTab === 'shop' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Exchange
                </button>
              </div>
            </div>
          </div>
          <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 text-center min-w-[160px]">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-1">Abyssal Shards</span>
            <span className="text-2xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]">
              {Math.floor(gameState.resources[ResourceId.VOID_SHARDS].amount).toLocaleString()} 🌌
            </span>
          </div>
        </div>
      </div>

      {activeSubTab === 'recycle' ? renderRecycle() : renderShop()}
    </div>
  );
};

export default VoidMarket;
