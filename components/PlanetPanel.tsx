
// components/PlanetPanel.tsx
import React, { useMemo, useState } from 'react';
import { GameState, Planet, ResourceId, MiningSite, Fleet, Galaxy } from '../types';
import Button from './Button';
import Modal from './Modal';
import Tooltip from './Tooltip';
import ProgressBar from './ProgressBar';

interface PlanetPanelProps {
  gameState: GameState;
  onTravel: (planetId: string) => void;
  onUnlockGalaxy: (galaxyId: string) => void;
  onSpendPlanetCost: (planetId: string, resourceId: ResourceId) => void;
  onUpgradeSite: (planetId: string, siteId: string) => void;
  onUpgradeFleet: (planetId: string, fleetId: string) => void;
  onClose: () => void;
}

const PlanetPanel: React.FC<PlanetPanelProps> = ({ 
  gameState, onTravel, onUnlockGalaxy, onSpendPlanetCost, onUpgradeSite, onUpgradeFleet, onClose 
}) => {
  const [selectedGalaxyId, setSelectedGalaxyId] = useState(gameState.currentGalaxyId);
  const [detailedPlanetId, setDetailedPlanetId] = useState<string | null>(null);
  const [activeSitePopupId, setActiveSitePopupId] = useState<string | null>(null);

  const currentGalaxy = useMemo(() => 
    gameState.galaxies.find(g => g.id === selectedGalaxyId)!,
  [gameState.galaxies, selectedGalaxyId]);

  const planetsInGalaxy = useMemo(() => 
    gameState.planets.filter(p => p.galaxyId === selectedGalaxyId),
  [gameState.planets, selectedGalaxyId]);

  const activePlanet = useMemo(() => 
    gameState.planets.find(p => p.id === detailedPlanetId),
  [gameState.planets, detailedPlanetId]);

  const handlePlanetClick = (planet: Planet) => {
    setDetailedPlanetId(planet.id);
  };

  const getFleetVisuals = (type: Fleet['type']) => {
    switch (type) {
      case 'mining': return { color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20', iconBg: 'bg-teal-500/20' };
      case 'logistics': return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', iconBg: 'bg-purple-500/20' };
      case 'exploration': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', iconBg: 'bg-amber-500/20' };
    }
  };

  const colonizationProgress = useMemo(() => {
    if (!activePlanet || activePlanet.unlocked) return 100;
    
    // Find the initial state of the planet to get its original unlock costs
    const initialPlanetState = gameState.planets.find(p => p.id === activePlanet.id);
    if (!initialPlanetState) return 0; // Should not happen if data is consistent

    // Sum up the original required amounts for all resources
    const totalOriginalCost = initialPlanetState.costToUnlock.reduce((sum, cost) => sum + cost.amount, 0);
    
    // Sum up the currently remaining amounts for all resources
    const totalRemainingCost = activePlanet.costToUnlock.reduce((sum, cost) => sum + cost.amount, 0);

    if (totalOriginalCost === 0) return 0; // Avoid division by zero if planet has no unlock cost

    const amountPaid = totalOriginalCost - totalRemainingCost;
    return Math.floor((amountPaid / totalOriginalCost) * 100);
  }, [activePlanet, gameState.planets]);


  return (
    <Modal isOpen={true} onClose={onClose} title="Stellar Navigation Control">
      <div className="space-y-6">
        {/* Galaxy Selector Dashboard */}
        <div className="bg-black/30 rounded-3xl p-4 border border-white/5 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Clusters</h4>
            <span className="text-[8px] font-bold text-gray-500 uppercase">{gameState.galaxies.length} Terminals Online</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {gameState.galaxies.map(galaxy => {
              const isActive = galaxy.id === selectedGalaxyId;
              const isLocked = !galaxy.unlocked;
              return (
                <button
                  key={galaxy.id}
                  onClick={() => setSelectedGalaxyId(galaxy.id)}
                  className={`flex-shrink-0 px-5 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 snap-center
                    ${isActive ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10 active-glow' : 'bg-black/40 border-white/5 hover:border-white/20'}
                    ${isLocked ? 'grayscale opacity-70' : ''}`}
                >
                  <span className={`text-lg transition-transform ${isLocked ? 'scale-90 opacity-50' : ''}`}>{isLocked ? '🔒' : '🌀'}</span>
                  <div className="text-left">
                    <span className={`text-[10px] font-black uppercase block leading-none ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {galaxy.name}
                    </span>
                    {isActive && <span className="text-[7px] text-indigo-400 font-bold uppercase tracking-tighter">Current Sector</span>}
                    {isLocked && !isActive && <span className="text-[7px] text-red-400 font-bold uppercase tracking-tighter">Access Denied</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Galaxy Content */}
        {!currentGalaxy.unlocked ? (
          <div className="bg-indigo-900/10 border-2 border-dashed border-indigo-500/30 rounded-3xl p-8 space-y-6 text-center animate-fade-in">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-5xl mx-auto ring-animate mb-4">🔒</div>
            <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{currentGalaxy.name}</h3>
                <p className="text-xs text-gray-400 mt-2 italic">"{currentGalaxy.description}"</p>
            </div>
            <div className="bg-black/60 rounded-2xl p-5 border border-white/5 space-y-4">
              <span className="text-[9px] text-indigo-300 font-black uppercase tracking-[0.2em] block">Jump Sequence Calibration</span>
              <div className="space-y-3">
                {currentGalaxy.costToUnlock.map((cost, idx) => {
                  const res = gameState.resources[cost.resourceId];
                  const canAfford = res.amount >= cost.amount;
                  return (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{res.icon}</span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase">{res.name}</span>
                      </div>
                      <span className={`text-xs font-black ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                        {Math.floor(res.amount).toLocaleString()} / {cost.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
              <Button 
                fullWidth 
                variant={currentGalaxy.costToUnlock.every(c => gameState.resources[c.resourceId].amount >= c.amount) ? "primary" : "outline"}
                disabled={!currentGalaxy.costToUnlock.every(c => gameState.resources[c.resourceId].amount >= c.amount)}
                onClick={() => onUnlockGalaxy(currentGalaxy.id)}
              >
                ESTABLISH QUANTUM LINK
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Planetary Grid</h4>
              <span className="text-[8px] font-bold text-gray-500 uppercase">{planetsInGalaxy.length} Orbitals Detected</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {planetsInGalaxy.map(planet => {
                const isCurrent = planet.id === gameState.currentPlanetId;
                const isLocked = !planet.unlocked;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handlePlanetClick(planet)}
                    className={`group relative p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 
                      ${isCurrent ? 'bg-emerald-600/10 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/20'}
                      ${isLocked ? 'opacity-50 grayscale' : ''}`}
                  >
                    <div className={`text-5xl transition-transform group-hover:scale-110 ${isLocked ? 'grayscale opacity-30 scale-90' : ''}`}>
                        {planet.icon}
                    </div>
                    <div className="text-center w-full">
                      <span className="text-[10px] font-black text-white uppercase block truncate tracking-tighter">{planet.name}</span>
                      {isLocked ? (
                        <span className="text-[7px] font-bold text-red-500 uppercase tracking-tighter">Locked</span>
                      ) : (
                        <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-tighter">Colony</span>
                      )}
                    </div>
                    {isLocked && <div className="absolute top-2 right-2 text-[10px]">🔒</div>}
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-950 flex items-center justify-center text-[10px] text-black font-black">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Planet Detail Dossier Modal Overlay */}
        {activePlanet && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
            <div className="relative bg-gray-950 border-2 border-white/10 rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto scrollbar-hide p-7 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-[2rem] flex items-center justify-center text-6xl shadow-2xl border border-white/10 relative">
                    <div className="absolute inset-0 bg-white/5 rounded-[2rem] animate-pulse"></div>
                    {activePlanet.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">{activePlanet.name}</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-indigo-400 font-black bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-[0.2em]">
                            {currentGalaxy.name} • DEEP SCAN
                        </span>
                        {activePlanet.unlocked && <span className="text-[9px] font-black bg-emerald-500 text-black px-2 py-1 rounded-lg uppercase">COLONY ESTABLISHED</span>}
                    </div>
                  </div>
                </div>
                <button 
                    onClick={() => { setDetailedPlanetId(null); setActiveSitePopupId(null); }} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all text-3xl font-black"
                >&times;</button>
              </div>

              {/* Description Block */}
              <div className="bg-black/40 rounded-3xl p-5 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <span className="text-4xl text-white">📡</span>
                </div>
                <h4 className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Atmospheric Analysis</h4>
                <p className="text-[11px] text-gray-300 italic leading-relaxed">"{activePlanet.description}"</p>
              </div>

              {!activePlanet.unlocked ? (
                /* Organized Colonization Interface */
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex justify-between items-end px-1">
                      <div>
                        <h4 className="text-[12px] font-black text-red-500 uppercase tracking-widest">Colony Readiness</h4>
                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Deployment Sequence Incomplete</p>
                      </div>
                      <span className="text-2xl font-black text-white/80">{colonizationProgress}%</span>
                  </div>
                  
                  {/* Master Readiness Progress Bar */}
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div 
                        className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-emerald-500 transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                        style={{ width: `${colonizationProgress}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {activePlanet.costToUnlock.map((cost, idx) => {
                      const res = gameState.resources[cost.resourceId];
                      const isComplete = cost.amount <= 0;
                      const userAmount = Math.floor(res.amount);
                      const amountNeeded = cost.amount;
                      
                      return (
                        <div key={idx} className={`relative group bg-black/40 rounded-3xl p-4 border transition-all flex flex-col gap-3 ${isComplete ? 'border-emerald-500/30' : 'border-white/5 hover:border-white/20'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:rotate-6 ${isComplete ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/5'}`}>
                                {res.icon}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] font-black text-gray-200 uppercase leading-none mb-1">{res.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-black tracking-tight ${isComplete ? 'text-emerald-400' : 'text-gray-500'}`}>
                                    {isComplete ? 'FULFILLED' : `REMAINING: ${Math.floor(amountNeeded).toLocaleString()}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {!isComplete ? (
                              <div className="flex flex-col items-end gap-1">
                                <Button 
                                  size="sm" 
                                  variant={userAmount > 0 ? "secondary" : "outline"}
                                  disabled={userAmount <= 0}
                                  onClick={() => onSpendPlanetCost(activePlanet.id, res.id)}
                                  className="!py-2 !text-[10px] !px-5 uppercase tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                                >
                                  CONTRIBUTE
                                </Button>
                                <span className="text-[7px] text-gray-600 font-black uppercase">Stored: {userAmount.toLocaleString()}</span>
                              </div>
                            ) : (
                              <div className="bg-emerald-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-xl font-black shadow-[0_0_10px_rgba(16,185,129,0.5)]">✓</div>
                            )}
                          </div>
                          
                          {/* Individual Progress Bar */}
                          {!isComplete && (
                              <div className="flex flex-col gap-1 px-1">
                                <div className="flex justify-between items-center text-[7px] font-black text-gray-600 uppercase">
                                    <span>Deployment Progress</span>
                                    <span>{userAmount >= amountNeeded ? '100%' : `${Math.floor((userAmount / (userAmount + amountNeeded)) * 100)}% Available`}</span>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-indigo-500 transition-all duration-500" 
                                    style={{ width: `${Math.min(100, (userAmount / (userAmount + amountNeeded)) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {colonizationProgress < 100 && (
                      <div className="p-4 bg-red-950/20 rounded-2xl border border-red-500/20 text-center">
                          <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Awaiting Command Authorization and Resource Funding</p>
                      </div>
                  )}
                </div>
              ) : (
                /* Established Colony Management UI */
                <div className="space-y-8 animate-fade-in-up">
                  {/* Multipliers & Travel */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-500/5 p-4 rounded-3xl border border-emerald-500/20">
                      <span className="text-[8px] text-emerald-500/70 font-black uppercase tracking-widest block mb-3">Resource Affinities</span>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(activePlanet.resourceMultipliers).map(([resId, mult]) => (
                          <div key={resId} className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                            <span className="text-xs">{gameState.resources[resId as ResourceId].icon}</span>
                            <span className="text-[10px] font-black text-white">x{mult}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button 
                        variant={gameState.currentPlanetId === activePlanet.id ? "outline" : "primary"}
                        onClick={() => {
                          if (gameState.currentPlanetId !== activePlanet.id) {
                            onTravel(activePlanet.id);
                            setDetailedPlanetId(null);
                          }
                        }}
                        disabled={gameState.currentPlanetId === activePlanet.id}
                        className="h-full !rounded-[1.5rem] !py-4 flex flex-col items-center justify-center gap-1"
                      >
                        <span className="text-2xl">🚀</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {gameState.currentPlanetId === activePlanet.id ? "CURRENT STATION" : "INITIATE JUMP"}
                        </span>
                    </Button>
                  </div>

                  {/* Infrastructure */}
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest px-1">Mining Outposts</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {activePlanet.miningSites.map(site => {
                        const cost = Math.floor(site.baseCost * Math.pow(1.5, site.level));
                        const canAfford = gameState.resources[ResourceId.ENERGY_CRYSTAL].amount >= cost;
                        const isPopped = activeSitePopupId === site.id;

                        return (
                          <div key={site.id} className="relative">
                            <div 
                              onClick={() => setActiveSitePopupId(isPopped ? null : site.id)}
                              className={`bg-gray-900/40 rounded-2xl p-4 border transition-all cursor-pointer flex items-center justify-between group ${isPopped ? 'border-amber-500 bg-gray-900' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex items-center gap-4">
                                  <div className="text-2xl bg-amber-500/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:rotate-6 transition-transform">
                                    {gameState.resources[site.resourceId].icon}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-black text-white uppercase leading-none mb-1">{site.name}</h5>
                                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Rank {site.level} Upgrade</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-black text-emerald-400 block">+{(site.level * site.multiplierPerLevel * 100).toFixed(0)}%</span>
                                  <span className="text-[7px] text-gray-600 font-bold uppercase">Production Output</span>
                                </div>
                            </div>
                            
                            {isPopped && (
                              <div className="absolute top-0 left-0 w-full bg-gray-950 border-2 border-amber-500 rounded-3xl p-5 shadow-2xl z-10 animate-fade-in-up">
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h5 className="text-[12px] font-black text-amber-400 uppercase tracking-widest">{site.name} Protocol</h5>
                                        <span className="text-[8px] text-gray-500 font-black uppercase">Infrastructure Intelligence</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setActiveSitePopupId(null); }} className="text-gray-500 hover:text-white text-xl font-black">&times;</button>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <span className="text-[7px] text-gray-500 font-black uppercase block mb-1">Target Yield</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{gameState.resources[site.resourceId].icon}</span>
                                        <span className="text-[10px] font-bold text-white uppercase">{gameState.resources[site.resourceId].name}</span>
                                    </div>
                                  </div>
                                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <span className="text-[7px] text-gray-500 font-black uppercase block mb-1">Scaling Factor</span>
                                    <span className="text-xs font-black text-emerald-400">+{site.multiplierPerLevel * 100}% / Rank</span>
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 col-span-2 flex justify-between items-center">
                                    <div>
                                        <span className="text-[8px] text-gray-500 font-black uppercase block mb-1">Upgrade Flux Cost</span>
                                        <span className={`text-[11px] font-black ${canAfford ? 'text-amber-400' : 'text-red-400'}`}>
                                            {cost.toLocaleString()} 💎 Energy Crystals
                                        </span>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      disabled={!canAfford}
                                      onClick={(e) => { e.stopPropagation(); onUpgradeSite(activePlanet.id, site.id); setActiveSitePopupId(null); }}
                                      className="!rounded-xl !px-6"
                                    >
                                      UPGRADE
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fleets */}
                  <div className="space-y-4 pb-4">
                    <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-widest px-1">Assigned Support Fleets</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {activePlanet.fleets.map(fleet => {
                        const style = getFleetVisuals(fleet.type);
                        const cost = 1000 * (fleet.level + 1);
                        const canAfford = gameState.resources[ResourceId.ALLOY_PLATE].amount >= cost;
                        
                        return (
                          <div key={fleet.id} className={`p-4 rounded-[1.5rem] border flex items-center justify-between relative overflow-hidden ${style.bg} ${style.border}`}>
                            <div className="flex items-center gap-4 relative z-10">
                              <div className={`w-14 h-14 ${style.iconBg} rounded-2xl flex items-center justify-center text-4xl border border-white/5 shadow-inner`}>
                                {fleet.icon}
                              </div>
                              <div>
                                <h5 className={`text-xs font-black uppercase leading-none mb-1 ${style.color}`}>{fleet.name}</h5>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">{fleet.type} • LV. {fleet.level}</span>
                                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${fleet.assigned ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-gray-800 border-gray-700'}`}>
                                    <div className={`w-1 h-1 rounded-full ${fleet.assigned ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}></div>
                                    <span className={`text-[6px] font-black uppercase ${fleet.assigned ? 'text-emerald-400' : 'text-gray-400'}`}>
                                        {fleet.assigned ? 'ACTIVE' : 'IDLE'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 items-end relative z-10">
                              <span className="text-[9px] font-black text-white/80 uppercase tracking-tighter">{cost.toLocaleString()} 🧲</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                disabled={!canAfford}
                                onClick={() => onUpgradeFleet(activePlanet.id, fleet.id)}
                                className="!py-1.5 !text-[8px] !px-4 !bg-black/20 hover:!bg-black/40 !rounded-lg"
                              >
                                UPGRADE
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                      {activePlanet.fleets.length === 0 && (
                        <div className="p-12 text-center bg-white/5 rounded-[2rem] border-2 border-dashed border-white/5 opacity-40">
                          <span className="text-4xl block mb-2">🛰️</span>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">No support fleets garrisoned in this sector.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PlanetPanel;