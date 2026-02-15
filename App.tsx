
// App.tsx
import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react';
import { GameState, GameTab, Resource, ResourceId, Producer, Crafter, Recipe, ResearchItem, SpecPath, ResearchCategory, FusionRecipe, Specialization, AchievementCategory } from './types';
// Fix: Imported startResearch from gameService
import { loadGameState, saveGameState, updateGame, purchaseProducer, purchaseMaxProducer, startCrafting, startResearch, deconstructResource, upgradeSpecialization, getResourceProductionStats, getXPToNextLevel, getGlobalLevelMultiplier, fuseResources, buyVoidUpgrade, completeQuest, travelToPlanet, upgradeMiningSite, upgradeFleet, spendTowardsPlanetUnlock, unlockGalaxy } from './services/gameService';
import Layout from './components/Layout';
import ResourceDisplay from './components/ResourceDisplay';
import Panel from './components/Panel';
import ProducerCard from './components/ProducerCard';
import CrafterCard from './components/CrafterCard';
import FusionCard from './components/FusionCard';
import QuestCard from './components/QuestCard';
import InventoryItem from './components/InventoryItem';
import TechTreeItem from './components/TechTreeItem';
import AchievementCard from './components/AchievementCard';
import VoidMarket from './components/VoidMarket';
import Button from './components/Button';
import Modal from './components/Modal';
import ProgressBar from './components/ProgressBar';
import SpecializationDetail from './components/SpecializationDetail';
import PlanetPanel from './components/PlanetPanel';
import Leaderboard from './components/Leaderboard';

type GameAction =
  | { type: 'UPDATE_STATE'; payload: GameState }
  | { type: 'PURCHASE_PRODUCER'; payload: string }
  | { type: 'PURCHASE_MAX_PRODUCER'; payload: string }
  | { type: 'START_CRAFTING'; payload: { crafterId: string; recipeId: string; amount?: number } }
  | { type: 'FUSE_RESOURCES'; payload: { recipeId: string; amount: number } }
  | { type: 'START_RESEARCH'; payload: string }
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'DECONSTRUCT'; payload: { resourceId: ResourceId; amount: number } }
  | { type: 'UPGRADE_SPEC'; payload: SpecPath }
  | { type: 'TRAVEL_PLANET'; payload: string }
  | { type: 'UNLOCK_GALAXY'; payload: string }
  | { type: 'SPEND_PLANET_COST'; payload: { planetId: string, resourceId: ResourceId } }
  | { type: 'UPGRADE_SITE'; payload: { planetId: string; siteId: string } }
  | { type: 'UPGRADE_FLEET'; payload: { planetId: string; fleetId: string } }
  | { type: 'BUY_VOID_UPGRADE'; payload: string };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  let newState: GameState | null = null;
  switch (action.type) {
    case 'UPDATE_STATE':
      return action.payload;
    case 'PURCHASE_PRODUCER':
      newState = purchaseProducer(state, action.payload);
      return newState || state;
    case 'PURCHASE_MAX_PRODUCER':
      newState = purchaseMaxProducer(state, action.payload);
      return newState || state;
    case 'START_CRAFTING':
      newState = startCrafting(state, action.payload.crafterId, action.payload.recipeId, action.payload.amount || 1);
      return newState || state;
    case 'FUSE_RESOURCES':
      newState = fuseResources(state, action.payload.recipeId, action.payload.amount);
      return newState || state;
    case 'START_RESEARCH':
      newState = startResearch(state, action.payload);
      return newState || state;
    case 'COMPLETE_QUEST':
      newState = completeQuest(state, action.payload);
      return newState || state;
    case 'DECONSTRUCT':
      newState = deconstructResource(state, action.payload.resourceId, action.payload.amount);
      return newState || state;
    case 'UPGRADE_SPEC':
      newState = upgradeSpecialization(state, action.payload);
      return newState || state;
    case 'TRAVEL_PLANET':
      newState = travelToPlanet(state, action.payload);
      return newState || state;
    case 'UNLOCK_GALAXY':
      newState = unlockGalaxy(state, action.payload);
      return newState || state;
    case 'SPEND_PLANET_COST':
      newState = spendTowardsPlanetUnlock(state, action.payload.planetId, action.payload.resourceId);
      return newState || state;
    case 'UPGRADE_SITE':
      newState = upgradeMiningSite(state, action.payload.planetId, action.payload.siteId);
      return newState || state;
    case 'UPGRADE_FLEET':
      newState = upgradeFleet(state, action.payload.planetId, action.payload.fleetId);
      return newState || state;
    case 'BUY_VOID_UPGRADE':
      newState = buyVoidUpgrade(state, action.payload);
      return newState || state;
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, loadGameState());
  const [activeTab, setActiveTab] = useState<GameTab>(GameTab.PRODUCERS);
  const [researchStage, setResearchStage] = useState<1 | 2 | 3 | 4>(1);
  const [researchCategory, setResearchCategory] = useState<ResearchCategory | 'All'>('All');
  const [achievementTab, setAchievementTab] = useState<AchievementCategory | 'All'>('All');
  const [selectedResearchId, setSelectedResearchId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedSpecPath, setSelectedSpecPath] = useState<SpecPath | null>(null);
  const [selectedFusionRecipeId, setSelectedFusionRecipeId] = useState<string | null>(null);
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isPlanetPanelOpen, setIsPlanetPanelOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false); // New state for leaderboard

  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      const now = Date.now();
      const updatedState = updateGame(gameState, now);
      dispatch({ type: 'UPDATE_STATE', payload: updatedState });
      setCurrentTime(now);
    }, 1000);
    return () => clearInterval(gameLoopInterval);
  }, [gameState]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGameState(gameState);
    }, 5000);
    return () => clearInterval(saveInterval);
  }, [gameState]);

  // Effect to clear selectedResearchId if it points to a completed/no-longer-active research
  useEffect(() => {
    if (selectedResearchId) {
      const researchItem = gameState.research.find(r => r.id === selectedResearchId);
      if (!researchItem || researchItem.isResearched || gameState.activeResearch?.researchId !== selectedResearchId) {
        setSelectedResearchId(null);
      }
    }
  }, [gameState.activeResearch, gameState.research, selectedResearchId]);


  const handleTabChange = useCallback((tab: GameTab) => setActiveTab(tab), []);
  const handleUpgradeProducer = useCallback((id: string) => dispatch({ type: 'PURCHASE_PRODUCER', payload: id }), []);
  const handlePurchaseMaxProducer = useCallback((id: string) => dispatch({ type: 'PURCHASE_MAX_PRODUCER', payload: id }), []);
  const handleStartCrafting = useCallback((cId: string, rId: string, amt?: number) => dispatch({ type: 'START_CRAFTING', payload: { crafterId: cId, recipeId: rId, amount: amt } }), []);
  const handleFuseResources = useCallback((rId: string, amt: number) => dispatch({ type: 'FUSE_RESOURCES', payload: { recipeId: rId, amount: amt } }), []);
  const handleStartResearch = useCallback((id: string) => dispatch({ type: 'START_RESEARCH', payload: id }), []);
  const handleCompleteQuest = useCallback((id: string) => dispatch({ type: 'COMPLETE_QUEST', payload: id }), []);
  const handleDeconstruct = useCallback((id: ResourceId, amt: number) => dispatch({ type: 'DECONSTRUCT', payload: { resourceId: id, amount: amt } }), []);
  const handleUpgradeSpec = useCallback((path: SpecPath) => dispatch({ type: 'UPGRADE_SPEC', payload: path }), []);
  const handleTravelPlanet = useCallback((id: string) => dispatch({ type: 'TRAVEL_PLANET', payload: id }), []);
  const handleUnlockGalaxy = useCallback((id: string) => dispatch({ type: 'UNLOCK_GALAXY', payload: id }), []);
  const handleSpendPlanetCost = useCallback((pId: string, rId: ResourceId) => dispatch({ type: 'SPEND_PLANET_COST', payload: { planetId: pId, resourceId: rId } }), []);
  const handleUpgradeSite = useCallback((pId: string, sId: string) => dispatch({ type: 'UPGRADE_SITE', payload: { planetId: pId, siteId: sId } }), []);
  const handleUpgradeFleet = useCallback((pId: string, fId: string) => dispatch({ type: 'UPGRADE_FLEET', payload: { planetId: pId, fleetId: fId } }), []);
  const handleBuyVoidUpgrade = useCallback((id: string) => dispatch({ type: 'BUY_VOID_UPGRADE', payload: id }), []);

  const visibleProducers = gameState.producers.filter(p => p.unlocked);
  const visibleCrafters = gameState.crafters.filter(c => c.unlocked);
  const unlockedRecipes = gameState.recipes.filter(r => r.unlocked);
  const visibleFusionRecipes = gameState.fusionRecipes.filter(f => f.unlocked);
  const activeQuests = gameState.quests.filter(q => q.unlocked && !q.isCompleted);

  const navBadges = useMemo(() => ({
    [GameTab.RESEARCH]: gameState.research.filter(r => !r.isResearched && r.prerequisites?.every(preId => gameState.research.find(item => item.id === preId)?.isResearched)).length, // Show badge for available research
    [GameTab.QUESTS]: activeQuests.length,
    [GameTab.ACHIEVEMENTS]: gameState.achievements.filter(a => !a.isUnlocked).length,
  }), [activeQuests.length, gameState.achievements, gameState.research]);

  const currentPlanet = useMemo(() => 
    gameState.planets.find(p => p.id === gameState.currentPlanetId)!,
  [gameState.planets, gameState.currentPlanetId]);

  const xpRequired = getXPToNextLevel(gameState.playerLevel);
  const xpProgress = (gameState.playerXP / xpRequired) * 100;
  const syncBonus = ((getGlobalLevelMultiplier(gameState.playerLevel) - 1) * 100).toFixed(0);

  const getRankTitle = (level: number) => {
    if (level < 5) return "Forge Initiate";
    if (level < 10) return "Sector Cadet";
    if (level < 20) return "Machine Overseer";
    if (level < 30) return "Master Artificer";
    if (level < 50) return "Sector Architect";
    if (level < 100) return "Quantum Sovereign";
    return "Transcendent Entity";
  };

  const selectedProducer = useMemo(() => 
    gameState.producers.find(p => p.id === selectedProducerId),
  [gameState.producers, selectedProducerId]);

  // Active Research for display in the tab
  const activeResearchItem = useMemo(() => {
    if (gameState.activeResearch) {
      return gameState.research.find(r => r.id === gameState.activeResearch?.researchId);
    }
    return null;
  }, [gameState.activeResearch, gameState.research]);

  const filteredResearchItems = useMemo(() => {
    return gameState.research.filter(r => 
      r.tier === researchStage &&
      (researchCategory === 'All' || r.category === researchCategory)
    ).sort((a, b) => {
      // Sort unresearched items first, then by prerequisites met, then by cost
      const aResearched = a.isResearched;
      const bResearched = b.isResearched;

      if (aResearched && !bResearched) return 1; // b (unresearched) comes before a (researched)
      if (!aResearched && bResearched) return -1; // a (unresearched) comes before b (researched)

      // If both are unresearched, sort by prerequisites met
      if (!aResearched && !bResearched) {
        const aPrereqMet = a.prerequisites?.every(preId => gameState.research.find(item => item.id === preId)?.isResearched) ?? true;
        const bPrereqMet = b.prerequisites?.every(preId => gameState.research.find(item => item.id === preId)?.isResearched) ?? true;

        if (aPrereqMet && !bPrereqMet) return -1; // a (prereqs met) comes before b (prereqs not met)
        if (!aPrereqMet && bPrereqMet) return 1; // b (prereqs met) comes before a (prereqs not met)
      }
      
      // Finally, sort by cost (e.g., total energy crystal cost)
      const getPrimaryCost = (item: ResearchItem) => item.cost.find(c => c.resourceId === ResourceId.ENERGY_CRYSTAL)?.amount || item.cost[0]?.amount || 0;
      return getPrimaryCost(a) - getPrimaryCost(b);
    });
  }, [gameState.research, researchStage, researchCategory, gameState.activeSpec, gameState.specializations]);

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange} badges={navBadges}>
      {/* HUD Container */}
      <div className="flex gap-2 mb-3">
        {/* Player Profile Mini */}
        <div 
          onClick={() => setIsPlayerModalOpen(true)}
          className="flex-grow bg-gray-900/60 backdrop-blur-md rounded-2xl p-3 border border-blue-500/20 shadow-lg relative overflow-hidden cursor-pointer hover:bg-gray-900/80 transition-all"
        >
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-lg">👤</div>
              <div>
                <h2 className="text-[10px] font-black text-white leading-none mb-1 uppercase tracking-widest">{getRankTitle(gameState.playerLevel)}</h2>
                <span className="text-[8px] text-gray-500 font-bold uppercase">LV. {gameState.playerLevel}</span>
              </div>
            </div>
            <div className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black">+{syncBonus}%</div>
          </div>
          <div className="w-full h-1 bg-black/40 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${xpProgress}%` }}></div>
          </div>
        </div>

        {/* Planet Navigation Mini */}
        <div 
          onClick={() => setIsPlanetPanelOpen(true)}
          className="w-24 bg-gray-900/60 backdrop-blur-md rounded-2xl p-3 border border-indigo-500/20 shadow-lg cursor-pointer hover:bg-gray-900/80 transition-all flex flex-col items-center justify-center"
        >
          <span className="text-xl leading-none mb-1">{currentPlanet.icon}</span>
          <span className="text-[8px] font-black text-indigo-400 uppercase truncate w-full text-center tracking-tighter">{currentPlanet.name}</span>
        </div>
      </div>

      {/* Top compact resource bar */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-1 pb-2 mb-2 scrollbar-hide mask-fade-edges">
        {(Object.values(gameState.resources) as Resource[]).map((resource: Resource) => (
          (resource.amount > 0 || resource.id === ResourceId.ENERGY_CRYSTAL || resource.id === ResourceId.RAW_METAL) && (
            <ResourceDisplay key={resource.id} resource={resource} gameState={gameState} />
          )
        ))}
      </div>

      {activeTab === GameTab.PRODUCERS && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {visibleProducers.map(p => (
            <ProducerCard 
              key={p.id} 
              producer={p} 
              gameState={gameState} 
              onUpgrade={handleUpgradeProducer} 
              onPurchaseMax={handlePurchaseMaxProducer}
              onSelect={() => setSelectedProducerId(p.id)}
            />
          ))}
        </div>
      )}

      {activeTab === GameTab.CRAFTERS && (
        <div className="flex flex-col gap-3">
          {visibleCrafters.map(c => (
            <CrafterCard key={c.id} crafter={c} recipes={unlockedRecipes} gameState={gameState} onCraft={handleStartCrafting} currentTime={currentTime} />
          ))}
        </div>
      )}

      {activeTab === GameTab.FUSION && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Fusion Dashboard */}
          <div className="bg-gray-900/60 backdrop-blur-xl border-2 border-cyan-500/30 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-white/5 animate-pulse-slow">
                  ⚛️
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Molecular Fusion Laboratory</h2>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-2">Reactor Status: Stable & Efficient</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-center">
                  <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest block mb-0.5">Fusion Yield</span>
                  <span className="text-sm font-black text-emerald-400">100% Nominal</span>
                </div>
                <div className="bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-center">
                  <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest block mb-0.5">Architect Buff</span>
                  <span className="text-sm font-black text-purple-400">
                    -{((1 - Math.pow(0.9, gameState.specializations[SpecPath.ARCHITECT].level)) * 100).toFixed(0)}% Cost
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
            {visibleFusionRecipes.map(recipe => (
              <FusionCard 
                key={recipe.id} 
                recipe={recipe} 
                gameState={gameState} 
                onFuse={handleFuseResources} 
                isSelected={selectedFusionRecipeId === recipe.id}
                onSelect={() => setSelectedFusionRecipeId(prev => prev === recipe.id ? null : recipe.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === GameTab.QUESTS && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeQuests.map(quest => (
            <QuestCard key={quest.id} quest={quest} gameState={gameState} onComplete={handleCompleteQuest} />
          ))}
        </div>
      )}

      {activeTab === GameTab.INVENTORY && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {(Object.values(gameState.resources) as Resource[]).filter(r => r.amount > 0).map((r: Resource) => (
            <InventoryItem key={r.id} resource={r} onClick={() => setSelectedResource(r)} />
          ))}
        </div>
      )}

      {activeTab === GameTab.MARKET && (
        <VoidMarket gameState={gameState} onDeconstruct={handleDeconstruct} onBuyVoidUpgrade={handleBuyVoidUpgrade} />
      )}

      {activeTab === GameTab.SPECIALIZATION && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-10">
          {Object.values(SpecPath).filter(path => path !== SpecPath.NONE).map(path => {
            const spec = gameState.specializations[path];
            const isActive = gameState.activeSpec === path;
            const canAfford = gameState.resources[ResourceId.VOID_SHARDS].amount >= spec.costToUpgrade;

            return (
              <div key={path} 
                onClick={() => setSelectedSpecPath(path)}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col cursor-pointer ${isActive ? 'bg-indigo-900/30 border-indigo-500' : 'bg-gray-900/30 border-gray-800'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{spec.icon}</span>
                  <h4 className="text-[11px] font-black uppercase tracking-tight text-white">{spec.name}</h4>
                </div>
                <p className="text-[9px] text-gray-400 mb-2 leading-tight h-8 overflow-hidden">{spec.description}</p>
                <div className="mt-auto flex justify-between items-center text-[9px]">
                  <span className="text-indigo-400 font-black">{spec.costToUpgrade} 🌌</span>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleUpgradeSpec(path); }} disabled={!canAfford}>
                    {isActive ? "Empower" : "Align"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === GameTab.RESEARCH && (
        <div className="flex flex-col gap-4">
          {/* Active Research Display */}
          <div className={`bg-gray-900/60 backdrop-blur-xl border-2 rounded-3xl p-6 relative overflow-hidden shadow-xl
            ${activeResearchItem ? 'border-blue-500/30 shadow-[0_0_30px_rgba(30,144,255,0.1)]' : 'border-white/5'}`}>
            {activeResearchItem && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none"></div>
            )}
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-5xl border transition-all 
                  ${activeResearchItem ? 'bg-blue-500/10 border-blue-400/30 animate-pulse-slow' : 'bg-black/40 border-white/10 opacity-50'}`}>
                  {activeResearchItem ? activeResearchItem.icon : '🔎'}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                    {activeResearchItem ? activeResearchItem.name : 'Research Nexus'}
                  </h2>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-2">
                    {activeResearchItem ? 'Observation in Progress' : 'Awaiting Protocol Input'}
                  </p>
                </div>
              </div>
              {activeResearchItem && gameState.activeResearch && (
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Time Remaining</span>
                  <span className="text-lg font-black text-white">
                    {Math.max(0, Math.floor((gameState.activeResearch.startTime + gameState.activeResearch.duration - currentTime) / 1000))}s
                  </span>
                </div>
              )}
            </div>
            {activeResearchItem && gameState.activeResearch && (
              <div className="mt-5 space-y-2 relative z-10">
                <div className="flex justify-between text-[8px] font-black text-blue-400 uppercase tracking-widest">
                  <span>Progress</span>
                  <span>{((currentTime - gameState.activeResearch.startTime) / gameState.activeResearch.duration * 100).toFixed(0)}%</span>
                </div>
                <ProgressBar 
                  progress={(currentTime - gameState.activeResearch.startTime) / gameState.activeResearch.duration} 
                  className="h-1.5 !bg-black/60"
                />
              </div>
            )}
            {!activeResearchItem && (
                <p className="text-[9px] text-gray-500 italic mt-4 text-center">Select a research breakthrough from below to begin a new observation cycle.</p>
            )}
          </div>

          {/* Filter Controls for Research */}
          <div className="bg-gray-700/60 p-3 rounded-2xl border border-white/5 flex flex-col gap-3">
            {/* Tier Filters */}
            <div className="flex justify-between items-center px-1">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Research Tier</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((stage) => (
                  <button 
                    key={stage} 
                    onClick={() => setResearchStage(stage as any)}
                    className={`py-1.5 px-3 rounded-xl text-[10px] font-black uppercase transition-all
                      ${researchStage === stage ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-black/40 text-gray-500 hover:bg-white/5'}`}
                  >
                    Stage {stage}
                  </button>
                ))}
              </div>
            </div>
            {/* Category Filters */}
            <div className="flex justify-between items-center px-1 border-t border-white/5 pt-3">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Research Category</span>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Production', 'Crafting', 'Specialized', 'Void'].map((category) => (
                  <button 
                    key={category} 
                    onClick={() => setResearchCategory(category as ResearchCategory | 'All')}
                    className={`py-1.5 px-3 rounded-xl text-[10px] font-black uppercase transition-all
                      ${researchCategory === category ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-black/40 text-gray-500 hover:bg-white/5'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
            {filteredResearchItems.map(res => (
              <TechTreeItem 
                key={res.id} research={res} gameState={gameState} onResearch={handleStartResearch} 
                isSelected={selectedResearchId === res.id} isPrerequisite={false}
                onSelect={() => setSelectedResearchId(prev => prev === res.id ? null : res.id)}
                currentTime={currentTime}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === GameTab.ACHIEVEMENTS && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
          {gameState.achievements.map(ach => (
            <AchievementCard key={ach.id} achievement={ach} gameState={gameState} />
          ))}
        </div>
      )}

      {/* Modals */}
      {isPlanetPanelOpen && (
        <PlanetPanel 
          gameState={gameState} 
          onTravel={handleTravelPlanet}
          onUnlockGalaxy={handleUnlockGalaxy}
          onSpendPlanetCost={handleSpendPlanetCost}
          onUpgradeSite={handleUpgradeSite}
          onUpgradeFleet={handleUpgradeFleet}
          onClose={() => setIsPlanetPanelOpen(false)}
        />
      )}

      {selectedSpecPath && (
        <SpecializationDetail path={selectedSpecPath} gameState={gameState} onUpgrade={handleUpgradeSpec} onClose={() => setSelectedSpecPath(null)} />
      )}

      {isLeaderboardOpen && (
        <Leaderboard gameState={gameState} onClose={() => setIsLeaderboardOpen(false)} />
      )}

      {isPlayerModalOpen && (
        <Modal isOpen={true} onClose={() => setIsPlayerModalOpen(false)} title="Command Interface">
          <div className="space-y-6">
            {/* Header Identity */}
            <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-indigo-900/30 border border-blue-400/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <span className="text-7xl">👤</span>
               </div>
               <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-4xl shadow-inner border relative z-10">
                 {gameState.specializations[gameState.activeSpec].icon}
               </div>
               <div className="relative z-10">
                 <h4 className="text-xl font-black text-white uppercase leading-tight">{getRankTitle(gameState.playerLevel)}</h4>
                 <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Sector {gameState.playerLevel} Protocol</span>
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 </div>
               </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Void Harvest</span>
                <p className="text-xl font-black text-indigo-400 leading-none">{Math.floor(gameState.stats.totalVoidShardsEarned).toLocaleString()}</p>
                <span className="text-[7px] text-indigo-500/50 font-bold uppercase mt-1">Abyssal Resonance</span>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col gap-1">
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Fabrications</span>
                <p className="text-xl font-black text-emerald-400 leading-none">{gameState.stats.totalCraftsCompleted.toLocaleString()}</p>
                <span className="text-[7px] text-emerald-500/50 font-bold uppercase mt-1">Quantum Units Built</span>
              </div>
            </div>

            {/* Deep Analytics */}
            <div className="space-y-3 bg-black/30 p-5 rounded-3xl border border-white/5">
               <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Operational History</h5>
               <div className="grid grid-cols-1 gap-2.5">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-400 font-bold">Research Breakthroughs</span>
                     <span className="text-blue-400 font-black">{gameState.stats.totalResearchBreakthroughs} Calibrations</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-400 font-bold">Deconstructed Matter</span>
                     <span className="text-orange-400 font-black">{gameState.stats.totalResourcesDeconstructed.toLocaleString()} Units</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="text-gray-400 font-bold">Protocol Sync Time</span>
                     <span className="text-gray-200 font-black">
                        {Math.floor((Date.now() - gameState.stats.sessionStartTime) / 60000)}m Recorded
                     </span>
                  </div>
               </div>
            </div>

            {/* Navigation Link */}
            <Button 
              onClick={() => { setIsPlayerModalOpen(false); setIsLeaderboardOpen(true); }} 
              variant="secondary" 
              fullWidth
              className="!py-4 !rounded-2xl shadow-indigo-500/20 group"
            >
              <div className="flex items-center justify-center gap-3">
                 <span className="text-lg group-hover:rotate-12 transition-transform">🏆</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Global Rankings</span>
              </div>
            </Button>
          </div>
        </Modal>
      )}

      {selectedProducer && (
        <Modal isOpen={!!selectedProducer} onClose={() => setSelectedProducerId(null)} title="Facility Blueprint">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-900/40 rounded-2xl border border-white/10">
              <div className="text-5xl">{selectedProducer.icon}</div>
              <div>
                <h3 className="text-xl font-black text-white uppercase leading-none">{selectedProducer.name}</h3>
                <span className="text-[10px] font-black text-gray-500 uppercase">Rank {selectedProducer.level}</span>
              </div>
            </div>
            <p className="text-xs text-gray-300 italic">{selectedProducer.description}</p>
            <Button onClick={() => handleUpgradeProducer(selectedProducer.id)} fullWidth>UPGRADE</Button>
          </div>
        </Modal>
      )}

      {selectedResource && (
        <Modal isOpen={!!selectedResource} onClose={() => setSelectedResource(null)} title="Neural Analysis">
          <div className="space-y-4 text-center">
            <div className="text-6xl">{selectedResource.icon}</div>
            <h3 className="text-xl font-black text-white uppercase">{selectedResource.name}</h3>
            <p className="text-sm text-gray-300">{selectedResource.description}</p>
            <div className="p-4 bg-black/40 rounded-2xl">
              <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Stored Amount</span>
              <p className="text-2xl font-black text-emerald-400">{Math.floor(selectedResource.amount).toLocaleString()}</p>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default App;