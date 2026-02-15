
// types.ts

export enum ResourceId {
  ENERGY_CRYSTAL = 'ENERGY_CRYSTAL',
  RAW_METAL = 'RAW_METAL',
  SYNTHETIC_BIOMASS = 'SYNTHETIC_BIOMASS',
  PROCESSOR = 'PROCESSOR',
  ALLOY_PLATE = 'ALLOY_PLATE',
  ADVANCED_COMPONENT = 'ADVANCED_COMPONENT',
  QUANTUM_CORE = 'QUANTUM_CORE',
  VOID_SHARDS = 'VOID_SHARDS',
  DARK_MATTER = 'DARK_MATTER',
  NANO_LATTICE = 'NANO_LATTICE',
  NEURAL_LINK = 'NEURAL_LINK',
  CHRONO_FLUID = 'CHRONO_FLUID',
  SILICA_SAND = 'SILICA_SAND',
  HEAVY_WATER = 'HEAVY_WATER',
  GASEOUS_HELIUM = 'GASEOUS_HELIUM',
  DATA_SEGMENT = 'DATA_SEGMENT',
  CHITIN_PLATE = 'CHITIN_PLATE',
  NEURO_FIBER = 'NEURO_FIBER',
  QUANTUM_BIT = 'QUANTUM_BIT',
  STAR_SILVER = 'STAR_SILVER',
  SOLAR_FLARE = 'SOLAR_FLARE',
  COMET_ICE = 'COMET_ICE',
  RIFT_CORE = 'RIFT_CORE',
  SHADOW_MATTER = 'SHADOW_MATTER',
  TIME_SAND = 'TIME_SAND',
  PLASMA_CELL = 'PLASMA_CELL',
  ANTIMATTER_VOID = 'ANTIMATTER_VOID',
  GRAVITY_PARTICLE = 'GRAVITY_PARTICLE',
  PHOTON_STREAM = 'PHOTON_STREAM',
  GLITCH_DATA = 'GLITCH_DATA',
  VOID_CELL = 'VOID_CELL',
  ENTROPY_SHARD = 'ENTROPY_SHARD',
  COSMIC_LENS = 'COSMIC_LENS',
  HYPER_SILICON = 'HYPER_SILICON',
  LIQUID_LOGIC = 'LIQUID_LOGIC',
  MEMORY_SHARD = 'MEMORY_SHARD',
  BIO_STEEL = 'BIO_STEEL',
  GHOST_DATA = 'GHOST_DATA',
  NEBULA_MIST = 'NEBULA_MIST',
  SINGULARITY_CORE = 'SINGULARITY_CORE',
  AETHER_CELL = 'AETHER_CELL',
  ZERO_POINT_CORE = 'ZERO_POINT_CORE',
  PULSE_RESIN = 'PULSE_RESIN',
  GLIMMER_SILK = 'GLIMMER_SILK',
  OBLIVION_DUST = 'OBLIVION_DUST',
  ASTRAL_ESSENCE = 'ASTRAL_ESSENCE',
  VOID_TENDRILL = 'VOID_TENDRILL',
  REALITY_GLUE = 'REALITY_GLUE',
  LOGIC_HULL = 'LOGIC_HULL',
  DREAM_VAPOR = 'DREAM_VAPOR',
  STARDUST_AMALGAM = 'STARDUST_AMALGAM',
  QUANTUM_FOAM = 'QUANTUM_FOAM',
  PULSAR_QUARTZ = 'PULSAR_QUARTZ',
  BLACK_HOLE_IRON = 'BLACK_HOLE_IRON',
  NEUTRINO_GLASS = 'NEUTRINO_GLASS',
  COSMIC_STRING = 'COSMIC_STRING',
  WORMHOLE_SEED = 'WORMHOLE_SEED',
  SINGULARITY_THREAD = 'SINGULARITY_THREAD',
  DIMENSIONAL_FABRIC = 'DIMENSIONAL_FABRIC',
  CHRONOS_PARTICLE = 'CHRONOS_PARTICLE',
  AEON_TEAR = 'AEON_TEAR',
  GOD_PARTICLE = 'GOD_PARTICLE',
  VOID_HEART = 'VOID_HEART',
  STELLAR_BLOOD = 'STELLAR_BLOOD',
  CORE_FRAGMENT = 'CORE_FRAGMENT',
  GALAXY_SPORE = 'GALAXY_SPORE',
  UNIVERSAL_CONSTANT = 'UNIVERSAL_CONSTANT',
  ENTROPY_REVERSAL = 'ENTROPY_REVERSAL',
  MATTER_WAVE = 'MATTER_WAVE',
  PROBABILITY_POINT = 'PROBABILITY_POINT',
  FATE_FIBER = 'FATE_FIBER',
  ETERNITY_SHARD = 'ETERNITY_SHARD',
  GENESIS_SPARK = 'GENESIS_SPARK',
  VOID_WHISPER = 'VOID_WHISPER',
  TRUTH_VALUE = 'TRUTH_VALUE',
  SOUL_RESIDUE = 'SOUL_RESIDUE',
  INFINITE_LOOP = 'INFINITE_LOOP',
  NEURAL_DATA = 'NEURAL_DATA',
  VIRTUAL_PARTICLE = 'VIRTUAL_PARTICLE',
  STRING_FRAGMENT = 'STRING_FRAGMENT',
  BRANE_MEMBRANE = 'BRANE_MEMBRANE',
  TACHYON_CONDENSATE = 'TACHYON_CONDENSATE',
  GRAVITATIONAL_WAVE = 'GRAVITATIONAL_WAVE',
  HIGGS_FIELD_STIM = 'HIGGS_FIELD_STIM',
  DARK_ENERGY_VIAL = 'DARK_ENERGY_VIAL',
  EXISTENTIAL_ECHO = 'EXISTENTIAL_ECHO',
  PARALLEL_REALITY_KEY = 'PARALLEL_REALITY_KEY',
  PARADOX_SHARD = 'PARADOX_SHARD',
  CAUSALITY_LOOP = 'CAUSALITY_LOOP',
  PROBABILITY_WAVE = 'PROBABILITY_WAVE',
  ENTROPY_VOID = 'ENTROPY_VOID',
  ORDER_CRYSTAL = 'ORDER_CRYSTAL',
  COSMIC_SEED = 'COSMIC_SEED',
  NEBULA_HEART = 'NEBULA_HEART',
  STELLAR_FORGE_CORE = 'STELLAR_FORGE_CORE',
  GALAXY_MAP = 'GALAXY_MAP',
  UNIVERSE_FRAGMENT = 'UNIVERSE_FRAGMENT',
  MULTIVERSE_LINK = 'MULTIVERSE_LINK',
  TIMELINE_BRANCH = 'TIMELINE_BRANCH',
  DIMENSION_ANCHOR = 'DIMENSION_ANCHOR',
  REALITY_STITCH = 'REALITY_STITCH',
  VOID_PULSE = 'VOID_PULSE',
  AETHER_MIST = 'AETHER_MIST',
  CELESTIAL_GOLD = 'CELESTIAL_GOLD',
  PHANTOM_MASS = 'PHANTOM_MASS',
  LOGIC_BLOCK = 'LOGIC_BLOCK',
  ABSTRACT_CONCEPT = 'ABSTRACT_CONCEPT',
  PURE_THOUGHT = 'PURE_THOUGHT',
  WILL_POWER = 'WILL_POWER',
}

export interface Resource {
  id: ResourceId;
  name: string;
  amount: number;
  icon: string;
  description?: string;
}

export interface Cost {
  resourceId: ResourceId;
  amount: number;
}

export interface MiningSite {
  id: string;
  name: string;
  resourceId: ResourceId;
  unlocked: boolean;
  level: number;
  baseCost: number;
  multiplierPerLevel: number;
}

export interface Fleet {
  id: string;
  name: string;
  icon: string;
  type: 'mining' | 'logistics' | 'exploration';
  level: number;
  assigned: boolean;
}

export interface Planet {
  id: string;
  name: string;
  icon: string;
  description: string;
  galaxyId: string;
  unlocked: boolean;
  resourceMultipliers: { [key in ResourceId]?: number };
  costToUnlock: Cost[];
  miningSites: MiningSite[];
  fleets: Fleet[];
}

export interface Galaxy {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  costToUnlock: Cost[];
}

export interface Producer {
  id: string;
  name: string;
  icon: string;
  produces: ResourceId;
  baseRate: number;
  cost: Cost[];
  level: number;
  unlocked: boolean;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  inputs: Cost[];
  outputs: Cost[];
  baseCraftTime: number; // in seconds
  xpReward: number; // Added XP reward for crafting completion
  unlocked: boolean;
  description: string;
}

export interface FusionRecipe {
  id: string;
  name: string;
  inputs: Cost[];
  output: Cost;
  xpReward: number;
  unlocked: boolean;
  description: string;
}

export interface VoidUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  baseCost: number;
  costMultiplier: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: Cost[];
  rewards: {
    resources: Cost[];
    xp: number;
    fleet?: { // New: Optional fleet reward
      id: string;
      type: 'mining' | 'logistics' | 'exploration';
      level: number;
    };
  };
  isCompleted: boolean;
  unlocked: boolean;
}

export type AchievementCategory = 'Growth' | 'Industry' | 'Assembly' | 'Cosmos';

export interface Achievement {
  id: string;
  name: string;
  category: AchievementCategory;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: number;
  xpReward: number;
  requirement: {
    type: 'PRODUCER_LEVEL' | 'PLAYER_LEVEL' | 'RESOURCE_TOTAL' | 'STAT_COUNT' | 'RESEARCH_COUNT';
    targetId?: string;
    value: number;
  };
}

export interface Crafter {
  id: string;
  name: string;
  icon: string;
  recipes: string[];
  queue: CraftingJob[];
  efficiencyMultiplier: number; // e.g., 1.0 = normal, 1.2 = 20% faster
  level: number;
  unlocked: boolean;
  description: string;
}

export interface CraftingJob {
  id: string;
  recipeId: string;
  crafterId: string;
  startTime: number; // Timestamp when job started
  duration: number;  // Total duration in milliseconds
}

export interface ResearchJob {
  researchId: string;
  startTime: number;
  duration: number;
}

export enum GameTab {
  GALAXY = 'GALAXY',
  PRODUCERS = 'PRODUCERS',
  CRAFTERS = 'CRAFTERS',
  FUSION = 'FUSION',
  QUESTS = 'QUESTS',
  INVENTORY = 'INVENTORY',
  RESEARCH = 'RESEARCH',
  MARKET = 'MARKET',
  SPECIALIZATION = 'SPECIALIZATION',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
}

export type ResearchCategory = 'Production' | 'Crafting' | 'Specialized' | 'Void';

export interface ResearchItem {
  id: string;
  name: string;
  category: ResearchCategory;
  tier: 1 | 2 | 3 | 4;
  description: string;
  cost: Cost[];
  researchTime: number;
  xpReward: number; // Added XP reward for research completion
  prerequisites?: string[];
  unlocks: {
    producerId?: string;
    crafterId?: string;
    recipeId?: string;
    fusionRecipeId?: string;
    questId?: string;
    globalMultiplier?: {
      resourceId?: ResourceId;
      multiplier: number;
    }
  }[];
  isResearched: boolean;
  icon: string;
}

export enum SpecPath {
  NONE = 'NONE',
  FORGER = 'FORGER',
  ALCHEMIST = 'ALCHEMIST',
  ARCHITECT = 'ARCHITECT',
  VOID_SEEKER = 'VOID_SEEKER',
  STELLAR_CARTOGRAPHER = 'STELLAR_CARTOGRAPHER',
}

export interface Specialization {
  id: SpecPath;
  name: string;
  description: string;
  icon: string;
  level: number;
  costToUpgrade: number;
}

export interface LeaderboardEntry {
  name: string;
  level: number;
  score: number;
  spec: SpecPath;
  isPlayer: boolean;
}

export interface GameState {
  resources: { [key in ResourceId]: Resource };
  producers: Producer[];
  crafters: Crafter[];
  recipes: Recipe[];
  fusionRecipes: FusionRecipe[];
  research: ResearchItem[];
  activeResearch: ResearchJob | null;
  quests: Quest[];
  achievements: Achievement[];
  specializations: { [key in SpecPath]: Specialization };
  voidUpgrades: VoidUpgrade[];
  activeSpec: SpecPath;
  lastTick: number;
  playerLevel: number;
  playerXP: number;
  planets: Planet[];
  galaxies: Galaxy[];
  currentPlanetId: string;
  currentGalaxyId: string;
  globalResearchProductionMultiplier: number; // New: Global multiplier from research
  stats: {
    totalVoidShardsEarned: number;
    totalCraftsCompleted: number;
    totalQuestsCompleted: number;
    totalResourcesDeconstructed: number;
    totalResearchBreakthroughs: number;
    sessionStartTime: number;
  };
}
