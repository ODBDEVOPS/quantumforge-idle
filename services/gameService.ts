
// services/gameService.ts
import { GameState, ResourceId, Cost, Producer, Planet, Galaxy, SpecPath, VoidUpgrade, MiningSite, Fleet, FusionRecipe, Recipe, Crafter, CraftingJob, ResearchItem } from '../types';
import { INITIAL_GAME_STATE, ALL_QUESTS } from '../constants'; // Import ALL_QUESTS

const SAVE_KEY = 'quantumForgeIdleGameState';
const COST_MULTIPLIER = 1.15;

export const FORGER_RESOURCES = [
  ResourceId.RAW_METAL, ResourceId.ALLOY_PLATE, ResourceId.NANO_LATTICE, ResourceId.SILICA_SAND,
  ResourceId.STAR_SILVER, ResourceId.BIO_STEEL, ResourceId.HYPER_SILICON, ResourceId.CHITIN_PLATE,
  ResourceId.LOGIC_HULL, ResourceId.BLACK_HOLE_IRON, ResourceId.NEUTRINO_GLASS, ResourceId.CORE_FRAGMENT,
  ResourceId.STARDUST_AMALGAM, ResourceId.STRING_FRAGMENT, ResourceId.GRAVITATIONAL_WAVE,
  ResourceId.LOGIC_BLOCK, ResourceId.CELESTIAL_GOLD, ResourceId.STELLAR_FORGE_CORE,
];

export const ALCHEMIST_RESOURCES = [
  ResourceId.ENERGY_CRYSTAL, ResourceId.SYNTHETIC_BIOMASS, ResourceId.PROCESSOR, ResourceId.ADVANCED_COMPONENT,
  ResourceId.GASEOUS_HELIUM, ResourceId.HEAVY_WATER, ResourceId.PULSE_RESIN, ResourceId.NEURO_FIBER,
  ResourceId.NEURAL_LINK, ResourceId.CHRONO_FLUID, ResourceId.QUANTUM_BIT, ResourceId.LIQUID_LOGIC,
  ResourceId.DATA_SEGMENT, ResourceId.GHOST_DATA, ResourceId.GLITCH_DATA, ResourceId.MEMORY_SHARD,
  ResourceId.ASTRAL_ESSENCE, ResourceId.DREAM_VAPOR, ResourceId.GALAXY_SPORE, ResourceId.SOUL_RESIDUE,
  ResourceId.STELLAR_BLOOD, ResourceId.NEURAL_DATA, ResourceId.PURE_THOUGHT, ResourceId.WILL_POWER,
  ResourceId.EXISTENTIAL_ECHO, ResourceId.ABSTRACT_CONCEPT,
];

export const EXOTIC_RESOURCES = [
  ResourceId.VOID_SHARDS, ResourceId.DARK_MATTER, ResourceId.VOID_CELL, ResourceId.RIFT_CORE,
  ResourceId.SINGULARITY_CORE, ResourceId.QUANTUM_CORE, ResourceId.SHADOW_MATTER, ResourceId.ENTROPY_SHARD,
  ResourceId.ANTIMATTER_VOID, ResourceId.GRAVITY_PARTICLE, ResourceId.AETHER_CELL, ResourceId.ZERO_POINT_CORE,
  ResourceId.SOLAR_FLARE, ResourceId.OBLIVION_DUST, ResourceId.TIME_SAND, ResourceId.NEBULA_MIST,
  ResourceId.COSMIC_LENS, ResourceId.VOID_TENDRILL, ResourceId.REALITY_GLUE, ResourceId.QUANTUM_FOAM,
  ResourceId.PULSAR_QUARTZ, ResourceId.COSMIC_STRING, ResourceId.WORMHOLE_SEED, ResourceId.SINGULARITY_THREAD,
  ResourceId.DIMENSIONAL_FABRIC, ResourceId.CHRONOS_PARTICLE, ResourceId.AEON_TEAR, ResourceId.GOD_PARTICLE,
  ResourceId.VOID_HEART, ResourceId.UNIVERSAL_CONSTANT, ResourceId.ENTROPY_REVERSAL, ResourceId.MATTER_WAVE,
  ResourceId.PROBABILITY_POINT, ResourceId.FATE_FIBER, ResourceId.ETERNITY_SHARD, ResourceId.GENESIS_SPARK,
  ResourceId.VOID_WHISPER, ResourceId.TRUTH_VALUE, ResourceId.INFINITE_LOOP, ResourceId.VIRTUAL_PARTICLE,
  ResourceId.BRANE_MEMBRANE, ResourceId.TACHYON_CONDENSATE, ResourceId.HIGGS_FIELD_STIM, ResourceId.DARK_ENERGY_VIAL,
  ResourceId.PARALLEL_REALITY_KEY, ResourceId.PARADOX_SHARD, ResourceId.CAUSALITY_LOOP, ResourceId.PROBABILITY_WAVE,
  ResourceId.ENTROPY_VOID, ResourceId.ORDER_CRYSTAL, ResourceId.COSMIC_SEED, ResourceId.NEBULA_HEART,
  ResourceId.GALAXY_MAP, ResourceId.UNIVERSE_FRAGMENT, ResourceId.MULTIVERSE_LINK, ResourceId.TIMELINE_BRANCH,
  ResourceId.DIMENSION_ANCHOR, ResourceId.REALITY_STITCH, ResourceId.VOID_PULSE, ResourceId.AETHER_MIST,
  ResourceId.PHANTOM_MASS,
];

export const getResourceDeconstructValue = (id: ResourceId): number => {
  const values: Partial<Record<ResourceId, number>> = {
    [ResourceId.ENERGY_CRYSTAL]: 0.1, [ResourceId.RAW_METAL]: 0.1, [ResourceId.SYNTHETIC_BIOMASS]: 0.2, [ResourceId.SILICA_SAND]: 0.05,
    [ResourceId.PROCESSOR]: 1, [ResourceId.ALLOY_PLATE]: 1.5, [ResourceId.DATA_SEGMENT]: 0.5, [ResourceId.CHITIN_PLATE]: 0.3,
    [ResourceId.QUANTUM_BIT]: 5, [ResourceId.STAR_SILVER]: 10, [ResourceId.PLASMA_CELL]: 25, [ResourceId.NANO_LATTICE]: 15,
    [ResourceId.DARK_MATTER]: 100, [ResourceId.VOID_CELL]: 200, [ResourceId.QUANTUM_CORE]: 500, [ResourceId.SINGULARITY_CORE]: 2000,
    [ResourceId.ZERO_POINT_CORE]: 10000, [ResourceId.ASTRAL_ESSENCE]: 500, [ResourceId.DREAM_VAPOR]: 400, [ResourceId.AEON_TEAR]: 5000,
    [ResourceId.GOD_PARTICLE]: 25000, [ResourceId.TRUTH_VALUE]: 10000, [ResourceId.VOID_HEART]: 50000, [ResourceId.INFINITE_LOOP]: 100000,
    [ResourceId.UNIVERSE_FRAGMENT]: 250000, [ResourceId.MULTIVERSE_LINK]: 500000, [ResourceId.CELESTIAL_GOLD]: 50000,
    [ResourceId.PURE_THOUGHT]: 100000, [ResourceId.WILL_POWER]: 150000,
  };
  return values[id] || 1;
};

export const getXPToNextLevel = (level: number): number => Math.floor(100 * Math.pow(level, 1.5));
export const getGlobalLevelMultiplier = (level: number): number => 1 + (level - 1) * 0.05;
export const getMaxQueueSize = (level: number): number => 5 + Math.floor(level / 5);

const addXP = (state: GameState, amount: number): GameState => {
  let newXP = state.playerXP + amount;
  let newLevel = state.playerLevel;
  while (newXP >= getXPToNextLevel(newLevel)) {
    newXP -= getXPToNextLevel(newLevel);
    newLevel += 1;
  }
  return { ...state, playerXP: newXP, playerLevel: newLevel };
};

export const getVoidProductionBonus = (upgrades: VoidUpgrade[]): number => {
  const upgrade = upgrades.find(u => u.id === 'eternal_darkness');
  return upgrade ? 1 + (upgrade.level * 0.1) : 1;
};

export const getVoidCraftingSpeedBonus = (upgrades: VoidUpgrade[]): number => {
  const upgrade = upgrades.find(u => u.id === 'temporal_flow_amplification');
  return upgrade ? 1 + (upgrade.level * 0.1) : 1; // 10% per level increase in speed
}

export const getProducerCost = (p: Producer, archLvl: number, activeSpec: SpecPath): Cost[] => {
  const levelMultiplier = Math.pow(COST_MULTIPLIER, p.level);
  const archMultiplier = activeSpec === SpecPath.ARCHITECT ? Math.pow(0.9, archLvl) : 1;
  return p.cost.map(c => ({
    resourceId: c.resourceId,
    amount: c.amount * levelMultiplier * archMultiplier
  }));
};

export const getMaxAffordableLevels = (p: Producer, state: GameState): number => {
  const archLvl = state.specializations[SpecPath.ARCHITECT]?.level || 0;
  let currentLevel = p.level;
  let count = 0;
  const tempResources = JSON.parse(JSON.stringify(state.resources));
  while (count < 100) {
    const nextCosts = getProducerCost({ ...p, level: currentLevel }, archLvl, state.activeSpec);
    let canAfford = nextCosts.every(cost => tempResources[cost.resourceId].amount >= cost.amount);
    if (!canAfford) break;
    nextCosts.forEach(cost => { tempResources[cost.resourceId].amount -= cost.amount; });
    currentLevel++;
    count++;
  }
  return count;
};

export const getResourceProductionStats = (state: GameState, resourceId: ResourceId) => {
  let totalRate = 0;
  const globalBonus = getGlobalLevelMultiplier(state.playerLevel);
  const voidBonus = getVoidProductionBonus(state.voidUpgrades);
  const currentPlanet = state.planets.find(p => p.id === state.currentPlanetId);
  const planetMultiplier = currentPlanet?.resourceMultipliers[resourceId] || 1;

  let miningMultiplier = 1;
  currentPlanet?.miningSites.forEach(site => {
    if (site.resourceId === resourceId && site.unlocked) {
      miningMultiplier += site.level * site.multiplierPerLevel;
    }
  });

  let fleetMultiplier = 1;
  currentPlanet?.fleets.forEach(fleet => {
    if (fleet.assigned && fleet.type === 'mining') {
      fleetMultiplier += 0.1 * fleet.level;
    }
  });

  let specMultiplier = 1;
  const specLevel = state.specializations[state.activeSpec]?.level || 0;
  if (state.activeSpec === SpecPath.FORGER && FORGER_RESOURCES.includes(resourceId)) specMultiplier += specLevel * 0.5;
  if (state.activeSpec === SpecPath.ALCHEMIST && ALCHEMIST_RESOURCES.includes(resourceId)) specMultiplier += specLevel * 0.5;
  if (state.activeSpec === SpecPath.VOID_SEEKER && EXOTIC_RESOURCES.includes(resourceId)) specMultiplier += specLevel * 0.4;

  // Apply global production multiplier from research
  const researchProductionMultiplier = state.globalResearchProductionMultiplier;

  state.producers.forEach(producer => {
    if (producer.level > 0 && producer.unlocked) {
      totalRate += producer.baseRate * producer.level * globalBonus * voidBonus * planetMultiplier * miningMultiplier * fleetMultiplier * specMultiplier * researchProductionMultiplier;
    }
  });

  return { totalRate };
};

export const getCraftingDuration = (recipe: Recipe, crafter: Crafter, gameState: GameState): number => {
  let duration = recipe.baseCraftTime; // in seconds

  // Crafter's intrinsic efficiency
  duration /= crafter.efficiencyMultiplier;

  // ARCHITECT specialization temporal compression bonus
  const architectLevel = gameState.specializations[SpecPath.ARCHITECT]?.level || 0;
  const temporalCompressionMultiplier = gameState.activeSpec === SpecPath.ARCHITECT ? Math.pow(1.25, architectLevel) : 1;
  duration /= temporalCompressionMultiplier;

  // Void Upgrade for global crafting speed
  const voidCraftingSpeedBonus = getVoidCraftingSpeedBonus(gameState.voidUpgrades);
  duration /= voidCraftingSpeedBonus;

  return duration * 1000; // Convert to milliseconds
};

export const unlockGalaxy = (state: GameState, galaxyId: string): GameState | null => {
  const galaxy = state.galaxies.find(g => g.id === galaxyId);
  if (!galaxy || galaxy.unlocked) return null;

  const newResources = { ...state.resources };
  for (const cost of galaxy.costToUnlock) {
    if (newResources[cost.resourceId].amount < cost.amount) return null;
  }
  for (const cost of galaxy.costToUnlock) {
    newResources[cost.resourceId].amount -= cost.amount;
  }

  const updatedGalaxies = state.galaxies.map(g => g.id === galaxyId ? { ...g, unlocked: true } : g);
  return { ...state, resources: newResources, galaxies: updatedGalaxies };
};

export const travelToPlanet = (state: GameState, planetId: string): GameState | null => {
  const planet = state.planets.find(p => p.id === planetId);
  if (!planet || !planet.unlocked) return null;
  return { ...state, currentPlanetId: planetId };
};

export const spendTowardsPlanetUnlock = (state: GameState, planetId: string, resourceId: ResourceId): GameState | null => {
  const planetIndex = state.planets.findIndex(p => p.id === planetId);
  if (planetIndex === -1) return null;
  const planet = state.planets[planetIndex];
  if (planet.unlocked) return null;

  const costIndex = planet.costToUnlock.findIndex(c => c.resourceId === resourceId);
  if (costIndex === -1) return null;
  const cost = planet.costToUnlock[costIndex];

  const available = state.resources[resourceId].amount;
  const needed = cost.amount;
  const toSpend = Math.min(available, needed);
  if (toSpend <= 0) return null;

  const newResources = { ...state.resources };
  newResources[resourceId].amount -= toSpend;

  const newCosts = [...planet.costToUnlock];
  newCosts[costIndex] = { ...cost, amount: needed - toSpend };

  // Check if all costs are 0 now
  const allZero = newCosts.every(c => c.amount <= 0);

  const newPlanets = [...state.planets];
  let updatedPlanet = { ...planet, costToUnlock: newCosts, unlocked: allZero };
  newPlanets[planetIndex] = updatedPlanet;

  let newState = { ...state, resources: newResources, planets: newPlanets };

  // If planet just became unlocked, check for associated quests to unlock
  if (allZero && !planet.unlocked) { // Check !planet.unlocked to ensure it's a new unlock
    if (updatedPlanet.id === 'krios') { // Example: Unlock Krios quest
      const kriosQuestIndex = newState.quests.findIndex(q => q.id === 'q_krios_cold_front');
      if (kriosQuestIndex !== -1 && !newState.quests[kriosQuestIndex].unlocked) {
        const updatedQuests = [...newState.quests];
        updatedQuests[kriosQuestIndex] = { ...updatedQuests[kriosQuestIndex], unlocked: true };
        newState.quests = updatedQuests;
      }
    }
    // Add other planet-specific quest unlocks here if needed
  }

  return newState;
};

export const upgradeMiningSite = (state: GameState, planetId: string, siteId: string): GameState | null => {
  const planetIndex = state.planets.findIndex(p => p.id === planetId);
  if (planetIndex === -1) return null;
  const planet = state.planets[planetIndex];
  const siteIndex = planet.miningSites.findIndex(s => s.id === siteId);
  if (siteIndex === -1) return null;
  const site = planet.miningSites[siteIndex];

  const cost = Math.floor(site.baseCost * Math.pow(1.5, site.level));
  if (state.resources[ResourceId.ENERGY_CRYSTAL].amount < cost) return null;

  const newResources = { ...state.resources };
  newResources[ResourceId.ENERGY_CRYSTAL].amount -= cost;

  const newSites = [...planet.miningSites];
  newSites[siteIndex] = { ...site, level: site.level + 1, unlocked: true };

  const newPlanets = [...state.planets];
  newPlanets[planetIndex] = { ...planet, miningSites: newSites };

  return { ...state, resources: newResources, planets: newPlanets };
};

export const upgradeFleet = (state: GameState, planetId: string, fleetId: string): GameState | null => {
  const planetIndex = state.planets.findIndex(p => p.id === planetId);
  if (planetIndex === -1) return null;
  const planet = state.planets[planetIndex];
  const fleetIndex = planet.fleets.findIndex(f => f.id === fleetId);
  if (fleetIndex === -1) return null;
  const fleet = planet.fleets[fleetIndex];

  const cost = 1000 * (fleet.level + 1);
  if (state.resources[ResourceId.ALLOY_PLATE].amount < cost) return null;

  const newResources = { ...state.resources };
  newResources[ResourceId.ALLOY_PLATE].amount -= cost;

  const newFleets = [...planet.fleets];
  newFleets[fleetIndex] = { ...fleet, level: fleet.level + 1 };

  const newPlanets = [...state.planets];
  newPlanets[planetIndex] = { ...planet, fleets: newFleets };

  return { ...state, resources: newResources, planets: newPlanets };
};

export const fuseResources = (state: GameState, recipeId: string, amount: number): GameState | null => {
  const recipe = state.fusionRecipes.find(r => r.id === recipeId);
  if (!recipe) return null;

  const architectLevel = state.specializations[SpecPath.ARCHITECT].level;
  const costMultiplier = state.activeSpec === SpecPath.ARCHITECT ? Math.pow(0.9, architectLevel) : 1;

  const newResources = { ...state.resources };
  for (const input of recipe.inputs) {
    const totalRequired = input.amount * amount * costMultiplier;
    if (newResources[input.resourceId].amount < totalRequired) return null;
  }

  for (const input of recipe.inputs) {
    newResources[input.resourceId].amount -= input.amount * amount * costMultiplier;
  }

  newResources[recipe.output.resourceId].amount += recipe.output.amount * amount;
  
  const xpReward = recipe.xpReward * amount;
  const newState = addXP({ ...state, resources: newResources }, xpReward);
  
  return checkAchievements(newState);
};

export const purchaseProducer = (state: GameState, producerId: string): GameState | null => {
  const idx = state.producers.findIndex(p => p.id === producerId);
  if (idx === -1) return null;
  const p = state.producers[idx];
  const archLvl = state.specializations[SpecPath.ARCHITECT]?.level || 0;
  const costs = getProducerCost(p, archLvl, state.activeSpec);
  const newResources = { ...state.resources };
  for (const cost of costs) { if (newResources[cost.resourceId].amount < cost.amount) return null; }
  for (const cost of costs) { newResources[cost.resourceId].amount -= cost.amount; }
  const updatedProducers = [...state.producers];
  updatedProducers[idx] = { ...p, level: p.level + 1 };
  return checkAchievements(addXP({ ...state, resources: newResources, producers: updatedProducers }, 10 * (p.level + 1)));
};

export const purchaseMaxProducer = (state: GameState, producerId: string): GameState | null => {
  const p = state.producers.find(item => item.id === producerId);
  if (!p) return null;
  const max = getMaxAffordableLevels(p, state);
  if (max <= 0) return null;
  let currentState = state;
  for (let i = 0; i < max; i++) {
    const next = purchaseProducer(currentState, producerId);
    if (!next) break;
    currentState = next;
  }
  return currentState;
};

export const checkAchievements = (state: GameState): GameState => {
  let anyUnlocked = false;
  let newState = { ...state };
  const updatedAchievements = state.achievements.map(ach => {
    if (ach.isUnlocked) return ach;
    let met = false;
    const req = ach.requirement;
    switch (req.type) {
      case 'PLAYER_LEVEL': met = state.playerLevel >= req.value; break;
      case 'PRODUCER_LEVEL':
        const prod = state.producers.find(p => p.id === req.targetId);
        met = !!prod && prod.level >= req.value;
        break;
      case 'RESOURCE_TOTAL':
        const res = state.resources[req.targetId as ResourceId];
        met = !!res && res.amount >= req.value;
        break;
      case 'STAT_COUNT':
        const statVal = (state.stats as any)[req.targetId || ''];
        met = typeof statVal === 'number' && statVal >= req.value;
        break;
      case 'RESEARCH_COUNT':
        met = state.research.filter(r => r.isResearched).length >= req.value;
        break;
    }
    if (met) {
      anyUnlocked = true;
      return { ...ach, isUnlocked: true, unlockedAt: Date.now() };
    }
    return ach;
  });
  if (anyUnlocked) {
    let xpAwarded = 0;
    updatedAchievements.forEach((ach, i) => { if (ach.isUnlocked && !state.achievements[i].isUnlocked) xpAwarded += ach.xpReward; });
    newState = addXP({ ...newState, achievements: updatedAchievements }, xpAwarded);
  }
  return newState;
};

export const updateGame = (state: GameState, newTime: number): GameState => {
  let currentState = { ...state };
  const deltaTime = (newTime - currentState.lastTick) / 1000;
  if (deltaTime <= 0) return currentState;
  
  const newResources = { ...currentState.resources };
  let newGlobalResearchProductionMultiplier = currentState.globalResearchProductionMultiplier;
  const globalBonus = getGlobalLevelMultiplier(currentState.playerLevel);
  const voidProductionBonus = getVoidProductionBonus(currentState.voidUpgrades);
  const currentPlanet = currentState.planets.find(p => p.id === currentState.currentPlanetId);

  // --- Process Active Research ---
  if (currentState.activeResearch) {
    const researchJob = currentState.activeResearch;
    if (newTime >= researchJob.startTime + researchJob.duration) {
      const completedResearchIndex = currentState.research.findIndex(r => r.id === researchJob.researchId);
      if (completedResearchIndex !== -1) {
        const completedResearch = currentState.research[completedResearchIndex];
        
        // Mark research as completed
        const updatedResearchList = [...currentState.research];
        updatedResearchList[completedResearchIndex] = { ...completedResearch, isResearched: true };
        currentState.research = updatedResearchList;

        // Apply unlocks
        completedResearch.unlocks.forEach(unlock => {
          if (unlock.producerId) {
            const idx = currentState.producers.findIndex(p => p.id === unlock.producerId);
            if (idx !== -1) {
              const updatedProducers = [...currentState.producers];
              updatedProducers[idx] = { ...updatedProducers[idx], unlocked: true };
              currentState.producers = updatedProducers;
            }
          } else if (unlock.crafterId) {
            const idx = currentState.crafters.findIndex(c => c.id === unlock.crafterId);
            if (idx !== -1) {
              const updatedCrafters = [...currentState.crafters];
              updatedCrafters[idx] = { ...updatedCrafters[idx], unlocked: true };
              currentState.crafters = updatedCrafters;
            }
          } else if (unlock.recipeId) {
            const idx = currentState.recipes.findIndex(r => r.id === unlock.recipeId);
            if (idx !== -1) {
              const updatedRecipes = [...currentState.recipes];
              updatedRecipes[idx] = { ...updatedRecipes[idx], unlocked: true };
              currentState.recipes = updatedRecipes;
            }
          } else if (unlock.fusionRecipeId) {
            const idx = currentState.fusionRecipes.findIndex(f => f.id === unlock.fusionRecipeId);
            if (idx !== -1) {
              const updatedFusionRecipes = [...currentState.fusionRecipes];
              updatedFusionRecipes[idx] = { ...updatedFusionRecipes[idx], unlocked: true };
              currentState.fusionRecipes = updatedFusionRecipes;
            }
          } else if (unlock.questId) {
            const idx = currentState.quests.findIndex(q => q.id === unlock.questId);
            if (idx !== -1) {
              const updatedQuests = [...currentState.quests];
              updatedQuests[idx] = { ...updatedQuests[idx], unlocked: true };
              currentState.quests = updatedQuests;
            }
          } else if (unlock.globalMultiplier) {
            if (unlock.globalMultiplier.resourceId === undefined) { // Apply to all resources
              newGlobalResearchProductionMultiplier *= unlock.globalMultiplier.multiplier;
            }
            // Specific resource multipliers can be added here if needed
          }
        });

        // Grant XP
        currentState = addXP(currentState, completedResearch.xpReward);

        // Update stats
        currentState.stats.totalResearchBreakthroughs += 1;
      }
      // Clear active research
      currentState.activeResearch = null;
    }
  }

  // --- Resource Production ---
  currentState.producers.forEach(p => {
    if (p.level > 0 && p.unlocked) {
      const pm = currentPlanet?.resourceMultipliers[p.produces] || 1;
      let miningMultiplier = 1;
      currentPlanet?.miningSites.forEach(site => {
        if (site.resourceId === p.produces && site.unlocked) { miningMultiplier += site.level * site.multiplierPerLevel; }
      });
      let fleetMultiplier = 1;
      currentPlanet?.fleets.forEach(fleet => {
        if (fleet.assigned && fleet.type === 'mining') { fleetMultiplier += 0.1 * fleet.level; }
      });
      let specMultiplier = 1;
      const specLevel = currentState.specializations[currentState.activeSpec]?.level || 0;
      if (currentState.activeSpec === SpecPath.FORGER && FORGER_RESOURCES.includes(p.produces)) specMultiplier += specLevel * 0.5;
      if (currentState.activeSpec === SpecPath.ALCHEMIST && ALCHEMIST_RESOURCES.includes(p.produces)) specMultiplier += specLevel * 0.5;
      if (currentState.activeSpec === SpecPath.VOID_SEEKER && EXOTIC_RESOURCES.includes(p.produces)) specMultiplier += specLevel * 0.4;
      
      newResources[p.produces].amount += p.baseRate * p.level * globalBonus * voidProductionBonus * pm * miningMultiplier * fleetMultiplier * specMultiplier * newGlobalResearchProductionMultiplier * deltaTime;
    }
  });

  // --- Process Crafting Jobs ---
  currentState.crafters = currentState.crafters.map(crafter => {
    let currentCrafter = { ...crafter };
    if (currentCrafter.queue.length > 0) {
      let jobProcessed = true;
      while (jobProcessed && currentCrafter.queue.length > 0) {
        const activeJob = currentCrafter.queue[0];
        if ((activeJob.startTime + activeJob.duration) <= newTime) {
          // Job completed
          const completedRecipe = currentState.recipes.find(r => r.id === activeJob.recipeId);
          if (completedRecipe) {
            // Add outputs
            completedRecipe.outputs.forEach(output => {
              newResources[output.resourceId].amount += output.amount;
            });

            // Grant XP
            currentState = addXP(currentState, completedRecipe.xpReward);

            // Update stats
            currentState.stats.totalCraftsCompleted += 1;
          }
          currentCrafter.queue.shift(); // Remove completed job
        } else {
          jobProcessed = false; // Current job not finished, stop processing queue
        }
      }
    }
    return currentCrafter;
  });

  currentState.resources = newResources;
  currentState.globalResearchProductionMultiplier = newGlobalResearchProductionMultiplier;
  currentState.lastTick = newTime;

  return checkAchievements(currentState);
};

export const loadGameState = (): GameState => {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return INITIAL_GAME_STATE;
  try {
    const loaded = JSON.parse(raw);
    // Ensure new fields are initialized for old save files
    return { ...INITIAL_GAME_STATE, ...loaded, lastTick: Date.now(),
      globalResearchProductionMultiplier: loaded.globalResearchProductionMultiplier ?? INITIAL_GAME_STATE.globalResearchProductionMultiplier,
      // Ensure crafter queues are arrays (handle potential undefined/null from old saves)
      crafters: loaded.crafters ? loaded.crafters.map((c: Crafter) => ({ ...c, queue: c.queue || [] })) : INITIAL_GAME_STATE.crafters,
      // Ensure quests are loaded with default unlocked status if not present in save, but respect actual state
      quests: INITIAL_GAME_STATE.quests.map(initialQuest => {
        const loadedQuest = loaded.quests?.find((q: { id: string; }) => q.id === initialQuest.id);
        return loadedQuest ? { ...initialQuest, ...loadedQuest } : initialQuest;
      }),
      // Fix: Ensure stats object and its properties are initialized if missing
      stats: {
        ...INITIAL_GAME_STATE.stats,
        ...loaded.stats,
        totalQuestsCompleted: loaded.stats?.totalQuestsCompleted ?? INITIAL_GAME_STATE.stats.totalQuestsCompleted,
      }
    };
  } catch (e) {
    console.error("Failed to load game state, returning initial state:", e);
    return INITIAL_GAME_STATE;
  }
};

export const saveGameState = (state: GameState) => {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
};

export const deconstructResource = (s: GameState, id: ResourceId, amt: number) => {
  const res = s.resources[id];
  if (!res || res.amount < amt) return s;
  const newResources = { ...s.resources };
  newResources[id].amount -= amt;
  const yieldPerUnit = getResourceDeconstructValue(id);
  const shardYield = amt * yieldPerUnit;
  newResources[ResourceId.VOID_SHARDS].amount += shardYield;
  const newStats = { ...s.stats, totalVoidShardsEarned: s.stats.totalVoidShardsEarned + shardYield, totalResourcesDeconstructed: s.stats.totalResourcesDeconstructed + amt };
  return checkAchievements({ ...s, resources: newResources, stats: newStats });
};

export const upgradeSpecialization = (s: GameState, path: SpecPath) => {
  const spec = s.specializations[path];
  if (s.resources[ResourceId.VOID_SHARDS].amount < spec.costToUpgrade) return s;
  const newResources = { ...s.resources };
  newResources[ResourceId.VOID_SHARDS].amount -= spec.costToUpgrade;
  const updatedSpecs = { ...s.specializations };
  updatedSpecs[path] = { ...spec, level: spec.level + 1, costToUpgrade: Math.floor(spec.costToUpgrade * 1.5) };
  return { ...s, resources: newResources, specializations: updatedSpecs, activeSpec: path };
};

export const buyVoidUpgrade = (s: GameState, id: string) => {
  const idx = s.voidUpgrades.findIndex(u => u.id === id);
  const u = s.voidUpgrades[idx];
  const cost = Math.floor(u.baseCost * Math.pow(u.costMultiplier, u.level));
  if (s.resources[ResourceId.VOID_SHARDS].amount < cost) return s;
  const newResources = { ...s.resources };
  newResources[ResourceId.VOID_SHARDS].amount -= cost;
  const updatedUpgrades = [...s.voidUpgrades];
  updatedUpgrades[idx] = { ...u, level: u.level + 1 };
  return { ...s, resources: newResources, voidUpgrades: updatedUpgrades };
};

export const startCrafting = (s: GameState, crafterId: string, recipeId: string, amount: number): GameState | null => {
  const crafterIndex = s.crafters.findIndex(c => c.id === crafterId);
  const recipe = s.recipes.find(r => r.id === recipeId);

  if (crafterIndex === -1 || !recipe || !recipe.unlocked) return null;

  const crafter = s.crafters[crafterIndex];
  if (!crafter.unlocked) return null;

  const maxQueue = getMaxQueueSize(s.playerLevel);
  if (crafter.queue.length + amount > maxQueue) return null; // Not enough queue space

  const architectLevel = s.specializations[SpecPath.ARCHITECT]?.level || 0;
  const costMultiplier = s.activeSpec === SpecPath.ARCHITECT ? Math.pow(0.9, architectLevel) : 1;

  const newResources = { ...s.resources };
  
  // Check if all resources can be afforded for the total amount
  for (const input of recipe.inputs) {
    const totalRequired = input.amount * amount * costMultiplier;
    if (newResources[input.resourceId].amount < totalRequired) return null;
  }

  // Deduct resources
  for (const input of recipe.inputs) {
    newResources[input.resourceId].amount -= input.amount * amount * costMultiplier;
  }

  const updatedCrafters = [...s.crafters];
  const craftingDuration = getCraftingDuration(recipe, crafter, s);

  // Add all crafting jobs to the queue
  for (let i = 0; i < amount; i++) {
    const newJob: CraftingJob = {
      id: `${crafter.id}-${recipe.id}-${Date.now()}-${i}`,
      recipeId: recipe.id,
      crafterId: crafter.id,
      startTime: Date.now(),
      duration: craftingDuration,
    };
    updatedCrafters[crafterIndex].queue.push(newJob);
  }

  // Note: XP and stats are now handled in updateGame when the craft completes.
  // totalCraftsCompleted will be incremented there.

  return checkAchievements({ ...s, resources: newResources, crafters: updatedCrafters });
};

export const startResearch = (state: GameState, researchId: string): GameState | null => {
  const researchItem = state.research.find(r => r.id === researchId);
  if (!researchItem) return null; // Research item not found
  if (researchItem.isResearched) return null; // Already researched
  if (state.activeResearch) return null; // Lab is occupied

  // Check prerequisites
  const prerequisitesMet = !researchItem.prerequisites || researchItem.prerequisites.every(preId =>
    state.research.find(r => r.id === preId)?.isResearched
  );
  if (!prerequisitesMet) return null; // Prerequisites not met

  // Calculate cost with specialization bonus
  const activeSpec = state.activeSpec;
  const activeLevel = state.specializations[activeSpec].level;
  let costReduction = 1;
  if (activeSpec === SpecPath.STELLAR_CARTOGRAPHER && activeLevel > 0) {
    costReduction = Math.pow(0.85, activeLevel);
  }

  const newResources = { ...state.resources };
  // Check if all resources can be afforded
  for (const cost of researchItem.cost) {
    const actualCost = Math.floor(cost.amount * costReduction);
    if (newResources[cost.resourceId].amount < actualCost) return null;
  }

  // Deduct resources
  for (const cost of researchItem.cost) {
    const actualCost = Math.floor(cost.amount * costReduction);
    newResources[cost.resourceId].amount -= actualCost;
  }

  // Create new research job
  const newResearchJob = {
    researchId: researchItem.id,
    startTime: Date.now(),
    duration: researchItem.researchTime * 1000, // Convert to milliseconds
  };

  return { ...state, resources: newResources, activeResearch: newResearchJob };
};

export const completeQuest = (state: GameState, questId: string): GameState | null => {
  const questIndex = state.quests.findIndex(q => q.id === questId);
  if (questIndex === -1) return null;

  const quest = state.quests[questIndex];
  if (quest.isCompleted || !quest.unlocked) return null; // Cannot complete if already completed or locked

  // Check requirements (should ideally be done in UI before calling, but for robustness)
  const allRequirementsMet = quest.requirements.every(req => 
    state.resources[req.resourceId].amount >= req.amount
  );
  if (!allRequirementsMet) return null;

  const newResources = { ...state.resources };
  const updatedQuests = [...state.quests];
  const updatedPlanets = [...state.planets]; // Need to modify planets for fleet rewards

  // Deduct required resources
  quest.requirements.forEach(req => {
    newResources[req.resourceId].amount -= req.amount;
  });

  // Add resource rewards
  quest.rewards.resources.forEach(reward => {
    newResources[reward.resourceId].amount += reward.amount;
  });

  // Mark quest as completed
  updatedQuests[questIndex] = { ...quest, isCompleted: true };

  // Grant XP
  let newState = addXP({ ...state, resources: newResources, quests: updatedQuests }, quest.rewards.xp);

  // Add fleet reward if applicable
  if (quest.rewards.fleet) {
    const currentPlanetIndex = updatedPlanets.findIndex(p => p.id === newState.currentPlanetId);
    if (currentPlanetIndex !== -1) {
      const newFleet: Fleet = { ...quest.rewards.fleet, assigned: false, icon: '🚀', name: quest.rewards.fleet.id }; // Assuming basic icon and name if not fully defined in rewards
      updatedPlanets[currentPlanetIndex].fleets = [...updatedPlanets[currentPlanetIndex].fleets, newFleet];
      newState.planets = updatedPlanets;
    }
  }

  // Update stats
  newState.stats.totalQuestsCompleted += 1;

  // Check achievements again after state changes
  return checkAchievements(newState);
};
