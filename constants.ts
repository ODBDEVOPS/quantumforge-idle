// constants.ts
import { GameState, ResourceId, Resource, Producer, Recipe, Crafter, Cost, ResearchItem, SpecPath, Specialization, FusionRecipe, VoidUpgrade, Quest, Achievement, Planet, Galaxy } from './types';

export const INITIAL_RESOURCES: { [key in ResourceId]: Resource } = {
  [ResourceId.ENERGY_CRYSTAL]: { id: ResourceId.ENERGY_CRYSTAL, name: 'Energy Crystal', amount: 100, icon: '💎', description: 'Highly compressed photonic energy.' },
  [ResourceId.RAW_METAL]: { id: ResourceId.RAW_METAL, name: 'Raw Metal', amount: 50, icon: '⚙️', description: 'Unrefined iron and silicon isotopes.' },
  [ResourceId.SYNTHETIC_BIOMASS]: { id: ResourceId.SYNTHETIC_BIOMASS, name: 'Synthetic Biomass', amount: 20, icon: '🌿', description: 'Lab-grown organic material.' },
  [ResourceId.PROCESSOR]: { id: ResourceId.PROCESSOR, name: 'Processor', amount: 0, icon: '💡', description: 'A basic logic chip.' },
  [ResourceId.ALLOY_PLATE]: { id: ResourceId.ALLOY_PLATE, name: 'Alloy Plate', amount: 0, icon: '🧲', description: 'Tempered metallic plating.' },
  [ResourceId.ADVANCED_COMPONENT]: { id: ResourceId.ADVANCED_COMPONENT, name: 'Adv. Component', amount: 0, icon: '🌟', description: 'Complex sub-assemblies.' },
  [ResourceId.QUANTUM_CORE]: { id: ResourceId.QUANTUM_CORE, name: 'Quantum Core', amount: 0, icon: '⚛️', description: 'A stabilized singularity.' },
  [ResourceId.VOID_SHARDS]: { id: ResourceId.VOID_SHARDS, name: 'Void Shards', amount: 0, icon: '🌌', description: 'Residue from deconstructed matter.' },
  [ResourceId.DARK_MATTER]: { id: ResourceId.DARK_MATTER, name: 'Dark Matter', amount: 0, icon: '⬛', description: 'Non-barionic mass.' },
  [ResourceId.NANO_LATTICE]: { id: ResourceId.NANO_LATTICE, name: 'Nano Lattice', amount: 0, icon: '🕸️', description: 'A mesh of carbon-nanotubes.' },
  [ResourceId.NEURAL_LINK]: { id: ResourceId.NEURAL_LINK, name: 'Neural Link', amount: 0, icon: '🧠', description: 'Machine-organic interface.' },
  [ResourceId.CHRONO_FLUID]: { id: ResourceId.CHRONO_FLUID, name: 'Chrono Fluid', amount: 0, icon: '⏳', description: 'Substance that slows time locally.' },
  [ResourceId.SILICA_SAND]: { id: ResourceId.SILICA_SAND, name: 'Silica Sand', amount: 0, icon: '🏜️', description: 'Vital for silicon refinement.' },
  [ResourceId.HEAVY_WATER]: { id: ResourceId.HEAVY_WATER, name: 'Heavy Water', amount: 0, icon: '🧪', description: 'Core coolant for reactors.' },
  [ResourceId.GASEOUS_HELIUM]: { id: ResourceId.GASEOUS_HELIUM, name: 'Helium Gas', amount: 0, icon: '☁️', description: 'Used for cryogenics.' },
  [ResourceId.DATA_SEGMENT]: { id: ResourceId.DATA_SEGMENT, name: 'Data Segment', amount: 0, icon: '📑', description: 'Information packets from space.' },
  [ResourceId.CHITIN_PLATE]: { id: ResourceId.CHITIN_PLATE, name: 'Chitin Plate', amount: 0, icon: '🐚', description: 'Reinforced organic plating.' },
  [ResourceId.NEURO_FIBER]: { id: ResourceId.NEURO_FIBER, name: 'Neuro Fiber', amount: 0, icon: '🧬', description: 'Synthetic axons.' },
  [ResourceId.QUANTUM_BIT]: { id: ResourceId.QUANTUM_BIT, name: 'Quantum Bit', amount: 0, icon: '🧊', description: 'Information in superposition.' },
  [ResourceId.STAR_SILVER]: { id: ResourceId.STAR_SILVER, name: 'Star Silver', amount: 0, icon: '✨', description: 'Lustrous metal from supernovas.' },
  [ResourceId.SOLAR_FLARE]: { id: ResourceId.SOLAR_FLARE, name: 'Solar Flare', amount: 0, icon: '☀️', description: 'Raw plasma corona.' },
  [ResourceId.COMET_ICE]: { id: ResourceId.COMET_ICE, name: 'Comet Ice', amount: 0, icon: '❄️', description: 'Primordial frozen water.' },
  [ResourceId.RIFT_CORE]: { id: ResourceId.RIFT_CORE, name: 'Rift Core', amount: 0, icon: '🌀', description: 'Spatial instability.' },
  [ResourceId.SHADOW_MATTER]: { id: ResourceId.SHADOW_MATTER, name: 'Shadow Matter', amount: 0, icon: '🌒', description: 'Inverse of light.' },
  [ResourceId.TIME_SAND]: { id: ResourceId.TIME_SAND, name: 'Time Sand', amount: 0, icon: '⏳', description: 'Particles of temporal entropy.' },
  [ResourceId.PLASMA_CELL]: { id: ResourceId.PLASMA_CELL, name: 'Plasma Cell', amount: 0, icon: '⚡', description: 'Stable energy cells.' },
  [ResourceId.ANTIMATTER_VOID]: { id: ResourceId.ANTIMATTER_VOID, name: 'Antimatter', amount: 0, icon: '🕳️', description: 'Unrivaled energy source.' },
  [ResourceId.GRAVITY_PARTICLE]: { id: ResourceId.GRAVITY_PARTICLE, name: 'Gravity Particle', amount: 0, icon: '🧲', description: 'Theoretical gravitons.' },
  [ResourceId.PHOTON_STREAM]: { id: ResourceId.PHOTON_STREAM, name: 'Photon Stream', amount: 0, icon: '☄️', description: 'Coherent light energy.' },
  [ResourceId.GLITCH_DATA]: { id: ResourceId.GLITCH_DATA, name: 'Glitch Data', amount: 0, icon: '💾', description: 'Defies traditional logic model.' },
  [ResourceId.VOID_CELL]: { id: ResourceId.VOID_CELL, name: 'Void Cell', amount: 0, icon: '🖤', description: 'Absolute vacuum unit.' },
  [ResourceId.ENTROPY_SHARD]: { id: ResourceId.ENTROPY_SHARD, name: 'Entropy Shard', amount: 0, icon: '🦴', description: 'Radiating pure disorder.' },
  [ResourceId.COSMIC_LENS]: { id: ResourceId.COSMIC_LENS, name: 'Cosmic Lens', amount: 0, icon: '🧿', description: 'Focusses galactic radiation.' },
  [ResourceId.HYPER_SILICON]: { id: ResourceId.HYPER_SILICON, name: 'Hyper Silicon', amount: 0, icon: '📟', description: 'Arranged in perfect 4D grids.' },
  [ResourceId.LIQUID_LOGIC]: { id: ResourceId.LIQUID_LOGIC, name: 'Liquid Logic', amount: 0, icon: '💧', description: 'A fluid computer.' },
  [ResourceId.MEMORY_SHARD]: { id: ResourceId.MEMORY_SHARD, name: 'Memory Shard', amount: 0, icon: '🧿', description: 'Crystalline storage.' },
  [ResourceId.BIO_STEEL]: { id: ResourceId.BIO_STEEL, name: 'Bio-Steel', amount: 0, icon: '🦾', description: 'Living metallic tissue.' },
  [ResourceId.GHOST_DATA]: { id: ResourceId.GHOST_DATA, name: 'Ghost Data', amount: 0, icon: '👁️‍🗨️', description: 'Spectral echoes.' },
  [ResourceId.NEBULA_MIST]: { id: ResourceId.NEBULA_MIST, name: 'Nebula Mist', amount: 0, icon: '🌫️', description: 'Collected from stellar clouds.' },
  [ResourceId.SINGULARITY_CORE]: { id: ResourceId.SINGULARITY_CORE, name: 'Singularity Core', amount: 0, icon: '🌀', description: 'Zero volume mass.' },
  [ResourceId.AETHER_CELL]: { id: ResourceId.AETHER_CELL, name: 'Aether Cell', amount: 0, icon: '🌬️', description: 'Holding quintessence.' },
  [ResourceId.ZERO_POINT_CORE]: { id: ResourceId.ZERO_POINT_CORE, name: 'Zero Point Core', amount: 0, icon: '🔆', description: 'Extracts infinite energy.' },
  [ResourceId.PULSE_RESIN]: { id: ResourceId.PULSE_RESIN, name: 'Pulse Resin', amount: 0, icon: '💧', description: 'Harvested from organic structures.' },
  [ResourceId.GLIMMER_SILK]: { id: ResourceId.GLIMMER_SILK, name: 'Glimmer Silk', amount: 0, icon: '🧶', description: 'Woven from starlight.' },
  [ResourceId.OBLIVION_DUST]: { id: ResourceId.OBLIVION_DUST, name: 'Oblivion Dust', amount: 0, icon: '🧹', description: 'Fragments of reality.' },
  [ResourceId.ASTRAL_ESSENCE]: { id: ResourceId.ASTRAL_ESSENCE, name: 'Astral Essence', amount: 0, icon: '✨', description: 'Pure cosmic spirit.' },
  [ResourceId.VOID_TENDRILL]: { id: ResourceId.VOID_TENDRILL, name: 'Void Tendril', amount: 0, icon: '🎋', description: 'Lashing shadows of the deep.' },
  [ResourceId.REALITY_GLUE]: { id: ResourceId.REALITY_GLUE, name: 'Reality Glue', amount: 0, icon: '🍯', description: 'Keeps space-time from leaking.' },
  [ResourceId.LOGIC_HULL]: { id: ResourceId.LOGIC_HULL, name: 'Logic Hull', amount: 0, icon: '🛳️', description: 'Computing-ready structural plating.' },
  [ResourceId.DREAM_VAPOR]: { id: ResourceId.DREAM_VAPOR, name: 'Dream Vapor', amount: 0, icon: '🌫️', description: 'Subconscious residue.' },
  [ResourceId.STARDUST_AMALGAM]: { id: ResourceId.STARDUST_AMALGAM, name: 'Stardust Amalgam', amount: 0, icon: '🧪', description: 'Mixed stellar heavy elements.' },
  [ResourceId.QUANTUM_FOAM]: { id: ResourceId.QUANTUM_FOAM, name: 'Quantum Foam', amount: 0, icon: '🫧', description: 'The foundation of the sub-atomic.' },
  [ResourceId.PULSAR_QUARTZ]: { id: ResourceId.PULSAR_QUARTZ, name: 'Pulsar Quartz', amount: 0, icon: '💎', description: 'Vibrates with neutron-star frequency.' },
  [ResourceId.BLACK_HOLE_IRON]: { id: ResourceId.BLACK_HOLE_IRON, name: 'Black Hole Iron', amount: 0, icon: '🔩', description: 'Denser than possible metal.' },
  [ResourceId.NEUTRINO_GLASS]: { id: ResourceId.NEUTRINO_GLASS, name: 'Neutrino Glass', amount: 0, icon: '🪟', description: 'Almost entirely transparent to matter.' },
  [ResourceId.COSMIC_STRING]: { id: ResourceId.COSMIC_STRING, name: 'Cosmic String', amount: 0, icon: '🧶', description: '1D defects in space-time.' },
  [ResourceId.WORMHOLE_SEED]: { id: ResourceId.WORMHOLE_SEED, name: 'Wormhole Seed', amount: 0, icon: '🌰', description: 'A nascent spatial gateway.' },
  [ResourceId.SINGULARITY_THREAD]: { id: ResourceId.SINGULARITY_THREAD, name: 'Singularity Thread', amount: 0, icon: '🧵', description: 'Infinitely thin mass strand.' },
  [ResourceId.DIMENSIONAL_FABRIC]: { id: ResourceId.DIMENSIONAL_FABRIC, name: 'Dimensional Fabric', amount: 0, icon: '🧥', description: 'Material from the 5th dimension.' },
  [ResourceId.CHRONOS_PARTICLE]: { id: ResourceId.CHRONOS_PARTICLE, name: 'Chronos Particle', amount: 0, icon: '⌛', description: 'The basic unit of time.' },
  [ResourceId.AEON_TEAR]: { id: ResourceId.AEON_TEAR, name: 'Aeon Tear', amount: 0, icon: '💧', description: 'Crystallized sorrow of an ancient star.' },
  [ResourceId.GOD_PARTICLE]: { id: ResourceId.GOD_PARTICLE, name: 'God Particle', amount: 0, icon: '🎆', description: 'The Higgs boson in its pure form.' },
  [ResourceId.VOID_HEART]: { id: ResourceId.VOID_HEART, name: 'Void Heart', amount: 0, icon: '🖤', description: 'The beating center of the abyss.' },
  [ResourceId.STELLAR_BLOOD]: { id: ResourceId.STELLAR_BLOOD, name: 'Stellar Blood', amount: 0, icon: '🩸', description: 'Fluid from a living sun.' },
  [ResourceId.CORE_FRAGMENT]: { id: ResourceId.CORE_FRAGMENT, name: 'Core Fragment', amount: 0, icon: '🌋', description: 'A piece of a planet\'s heart.' },
  [ResourceId.GALAXY_SPORE]: { id: ResourceId.GALAXY_SPORE, name: 'Galaxy Spore', amount: 0, icon: '🍄', description: 'Spawns new star clusters.' },
  [ResourceId.UNIVERSAL_CONSTANT]: { id: ResourceId.UNIVERSAL_CONSTANT, name: 'Universal Constant', amount: 0, icon: '🔢', description: 'A hardcoded law of physics.' },
  [ResourceId.ENTROPY_REVERSAL]: { id: ResourceId.ENTROPY_REVERSAL, name: 'Entropy Reversal', amount: 0, icon: '⏪', description: 'Makes things newer.' },
  [ResourceId.MATTER_WAVE]: { id: ResourceId.MATTER_WAVE, name: 'Matter Wave', amount: 0, icon: '〰️', description: 'Solid objects in wave form.' },
  [ResourceId.PROBABILITY_POINT]: { id: ResourceId.PROBABILITY_POINT, name: 'Probability Point', amount: 0, icon: '🎲', description: 'Where things might happen.' },
  [ResourceId.FATE_FIBER]: { id: ResourceId.FATE_FIBER, name: 'Fate Fiber', amount: 0, icon: '🧬', description: 'Woven destiny strings.' },
  [ResourceId.ETERNITY_SHARD]: { id: ResourceId.ETERNITY_SHARD, name: 'Eternity Shard', amount: 0, icon: '⌛', description: 'A moment frozen forever.' },
  [ResourceId.GENESIS_SPARK]: { id: ResourceId.GENESIS_SPARK, name: 'Genesis Spark', amount: 0, icon: '🧨', description: 'The start of everything.' },
  [ResourceId.VOID_WHISPER]: { id: ResourceId.VOID_WHISPER, name: 'Void Whisper', amount: 0, icon: '👂', description: 'Information from the dark.' },
  [ResourceId.TRUTH_VALUE]: { id: ResourceId.TRUTH_VALUE, name: 'Truth Value', amount: 0, icon: '✅', description: 'An undeniable fact.' },
  [ResourceId.SOUL_RESIDUE]: { id: ResourceId.SOUL_RESIDUE, name: 'Soul Residue', amount: 0, icon: '👻', description: 'What remains after the end.' },
  [ResourceId.INFINITE_LOOP]: { id: ResourceId.INFINITE_LOOP, name: 'Infinite Loop', amount: 0, icon: '♾️', description: 'A process that never stops.' },
  [ResourceId.NEURAL_DATA]: { id: ResourceId.NEURAL_DATA, name: 'Neural Data', amount: 0, icon: '🧠', description: 'Raw mental signals.' },
  [ResourceId.VIRTUAL_PARTICLE]: { id: ResourceId.VIRTUAL_PARTICLE, name: 'Virtual Particle', amount: 0, icon: '✨', description: 'Ephemeral vacuum fluctuation.' },
  [ResourceId.STRING_FRAGMENT]: { id: ResourceId.STRING_FRAGMENT, name: 'String Fragment', amount: 0, icon: '🎻', description: 'Fragment of a cosmic string.' },
  [ResourceId.BRANE_MEMBRANE]: { id: ResourceId.BRANE_MEMBRANE, name: 'Brane Membrane', amount: 0, icon: '🧼', description: 'Multidimensional surface.' },
  [ResourceId.TACHYON_CONDENSATE]: { id: ResourceId.TACHYON_CONDENSATE, name: 'Tachyon Condensate', amount: 0, icon: '⏩', description: 'Faster-than-light material.' },
  [ResourceId.GRAVITATIONAL_WAVE]: { id: ResourceId.GRAVITATIONAL_WAVE, name: 'Grav-Wave', amount: 0, icon: '〰️', description: 'Ripples in space-time.' },
  [ResourceId.HIGGS_FIELD_STIM]: { id: ResourceId.HIGGS_FIELD_STIM, name: 'Higgs Stim', amount: 0, icon: '💥', description: 'Mass-giving stimulation.' },
  [ResourceId.DARK_ENERGY_VIAL]: { id: ResourceId.DARK_ENERGY_VIAL, name: 'Dark Energy', amount: 0, icon: '🧪', description: 'Expansion-driving essence.' },
  [ResourceId.EXISTENTIAL_ECHO]: { id: ResourceId.EXISTENTIAL_ECHO, name: 'Existential Echo', amount: 0, icon: '🗣️', description: 'Residue of prior existence.' },
  [ResourceId.PARALLEL_REALITY_KEY]: { id: ResourceId.PARALLEL_REALITY_KEY, name: 'Reality Key', amount: 0, icon: '🔑', description: 'Unlocks other timelines.' },
  [ResourceId.PARADOX_SHARD]: { id: ResourceId.PARADOX_SHARD, name: 'Paradox Shard', amount: 0, icon: '⁉️', description: 'Logically impossible matter.' },
  [ResourceId.CAUSALITY_LOOP]: { id: ResourceId.CAUSALITY_LOOP, name: 'Causality Loop', amount: 0, icon: '➰', description: 'Events causing themselves.' },
  [ResourceId.PROBABILITY_WAVE]: { id: ResourceId.PROBABILITY_WAVE, name: 'Prob-Wave', amount: 0, icon: '🎲', description: 'Uncollapsed state wave.' },
  [ResourceId.ENTROPY_VOID]: { id: ResourceId.ENTROPY_VOID, name: 'Entropy Void', amount: 0, icon: '⬛', description: 'Absolute point of decay.' },
  [ResourceId.ORDER_CRYSTAL]: { id: ResourceId.ORDER_CRYSTAL, name: 'Order Crystal', amount: 0, icon: '❄️', description: 'Perfectly arranged matter.' },
  [ResourceId.COSMIC_SEED]: { id: ResourceId.COSMIC_SEED, name: 'Cosmic Seed', amount: 0, icon: '🌱', description: 'Start of a new galaxy.' },
  [ResourceId.NEBULA_HEART]: { id: ResourceId.NEBULA_HEART, name: 'Nebula Heart', amount: 0, icon: '❤️', description: 'Core of a stellar cloud.' },
  [ResourceId.STELLAR_FORGE_CORE]: { id: ResourceId.STELLAR_FORGE_CORE, name: 'Forge Core', amount: 0, icon: '🔥', description: 'Heat of a billion suns.' },
  [ResourceId.GALAXY_MAP]: { id: ResourceId.GALAXY_MAP, name: 'Galaxy Map', amount: 0, icon: '🗺️', description: 'Data for universal travel.' },
  [ResourceId.UNIVERSE_FRAGMENT]: { id: ResourceId.UNIVERSE_FRAGMENT, name: 'Uni-Fragment', amount: 0, icon: '🌌', description: 'A piece of everything.' },
  [ResourceId.MULTIVERSE_LINK]: { id: ResourceId.MULTIVERSE_LINK, name: 'Multi-Link', amount: 0, icon: '🔗', description: 'Connection to other universes.' },
  [ResourceId.TIMELINE_BRANCH]: { id: ResourceId.TIMELINE_BRANCH, name: 'Timeline', amount: 0, icon: '🌿', description: 'Path of diverging history.' },
  [ResourceId.DIMENSION_ANCHOR]: { id: ResourceId.DIMENSION_ANCHOR, name: 'Dim-Anchor', amount: 0, icon: '⚓', description: 'Fixes a point in space-time.' },
  [ResourceId.REALITY_STITCH]: { id: ResourceId.REALITY_STITCH, name: 'Real-Stitch', amount: 0, icon: '🧵', description: 'Mending the weave of being.' },
  [ResourceId.VOID_PULSE]: { id: ResourceId.VOID_PULSE, name: 'Void Pulse', amount: 0, icon: '💓', description: 'Heartbeat of the abyss.' },
  [ResourceId.AETHER_MIST]: { id: ResourceId.AETHER_MIST, name: 'Aether Mist', amount: 0, icon: '🌬️', description: 'The breath of the cosmos.' },
  [ResourceId.CELESTIAL_GOLD]: { id: ResourceId.CELESTIAL_GOLD, name: 'Celest-Gold', amount: 0, icon: '📀', description: 'The wealth of the stars.' },
  [ResourceId.PHANTOM_MASS]: { id: ResourceId.PHANTOM_MASS, name: 'Phantom Mass', amount: 0, icon: '👻', description: 'Mass with no physical form.' },
  [ResourceId.LOGIC_BLOCK]: { id: ResourceId.LOGIC_BLOCK, name: 'Logic Block', amount: 0, icon: '🧱', description: 'Building material for thought.' },
  [ResourceId.ABSTRACT_CONCEPT]: { id: ResourceId.ABSTRACT_CONCEPT, name: 'Concept', amount: 0, icon: '💭', description: 'Non-material idea.' },
  [ResourceId.PURE_THOUGHT]: { id: ResourceId.PURE_THOUGHT, name: 'Pure Thought', amount: 0, icon: '🧠', description: 'Raw mental power.' },
  [ResourceId.WILL_POWER]: { id: ResourceId.WILL_POWER, name: 'Will Power', amount: 0, icon: '💢', description: 'Determination manifest.' },
};

export const ALL_PLANETS: Planet[] = [
  {
    id: 'aethelgard',
    name: 'Aethelgard Prime',
    icon: '🌍',
    galaxyId: 'nebula_cluster',
    description: 'The cradle of your civilization. Stable climate and rich metallic veins.',
    unlocked: true,
    resourceMultipliers: { [ResourceId.RAW_METAL]: 1.2, [ResourceId.ENERGY_CRYSTAL]: 1.1 },
    costToUnlock: [],
    miningSites: [
      { id: 'site_alpha', name: 'Iron Ridge', resourceId: ResourceId.RAW_METAL, unlocked: true, level: 1, baseCost: 100, multiplierPerLevel: 0.1 },
      { id: 'site_beta', name: 'Crystal Flats', resourceId: ResourceId.ENERGY_CRYSTAL, unlocked: false, level: 0, baseCost: 500, multiplierPerLevel: 0.15 }
    ],
    fleets: [
      { id: 'f_logistics_1', name: 'Supply Group A', icon: '🚢', type: 'logistics', level: 1, assigned: true }
    ]
  },
  {
    id: 'krios',
    name: 'Krios Iceshelf',
    icon: '❄️',
    galaxyId: 'nebula_cluster',
    description: 'A frozen world perfect for heavy water distillation and comet ice harvesting.',
    unlocked: false,
    resourceMultipliers: { [ResourceId.HEAVY_WATER]: 1.5, [ResourceId.COMET_ICE]: 2.0 },
    costToUnlock: [{ resourceId: ResourceId.ALLOY_PLATE, amount: 100 }, { resourceId: ResourceId.PROCESSOR, amount: 50 }],
    miningSites: [
      { id: 'site_delta', name: 'Glacier Drill', resourceId: ResourceId.COMET_ICE, unlocked: true, level: 0, baseCost: 1000, multiplierPerLevel: 0.2 }
    ],
    fleets: []
  },
  {
    id: 'pyros',
    name: 'Pyros Cinder',
    icon: '🌋',
    galaxyId: 'nebula_cluster',
    description: 'High volcanic activity. Ideal for core fragment extraction and solar flare capture.',
    unlocked: false,
    resourceMultipliers: { [ResourceId.SOLAR_FLARE]: 1.5, [ResourceId.CORE_FRAGMENT]: 1.3 },
    costToUnlock: [{ resourceId: ResourceId.ADVANCED_COMPONENT, amount: 200 }, { resourceId: ResourceId.QUANTUM_CORE, amount: 10 }],
    miningSites: [
      { id: 'site_lava', name: 'Magma Siphon', resourceId: ResourceId.SOLAR_FLARE, unlocked: true, level: 0, baseCost: 5000, multiplierPerLevel: 0.25 }
    ],
    fleets: []
  },
  {
    id: 'aetheria',
    name: 'Aetheria Nimbus',
    icon: '☁️',
    galaxyId: 'nebula_cluster',
    description: 'A majestic gas giant with swirling atmospheric currents, rich in gaseous helium and elusive aether cells.',
    unlocked: false,
    resourceMultipliers: { [ResourceId.GASEOUS_HELIUM]: 1.8, [ResourceId.AETHER_CELL]: 1.5 },
    costToUnlock: [{ resourceId: ResourceId.ALLOY_PLATE, amount: 250 }, { resourceId: ResourceId.ADVANCED_COMPONENT, amount: 100 }, { resourceId: ResourceId.GASEOUS_HELIUM, amount: 500 }],
    miningSites: [
      { id: 'site_aether_pump', name: 'Nimbus Siphon', resourceId: ResourceId.GASEOUS_HELIUM, unlocked: false, level: 0, baseCost: 2000, multiplierPerLevel: 0.2 }
    ],
    fleets: []
  },
  {
    id: 'veridia',
    name: 'Veridian Canopy',
    icon: '🌳',
    galaxyId: 'nebula_cluster',
    description: 'A lush, overgrown jungle planet where exotic flora thrives, producing abundant synthetic biomass and unique pulse resin.',
    unlocked: false,
    resourceMultipliers: { [ResourceId.SYNTHETIC_BIOMASS]: 1.5, [ResourceId.PULSE_RESIN]: 1.8 },
    costToUnlock: [{ resourceId: ResourceId.SYNTHETIC_BIOMASS, amount: 800 }, { resourceId: ResourceId.PROCESSOR, amount: 150 }, { resourceId: ResourceId.CHITIN_PLATE, amount: 100 }],
    miningSites: [
      { id: 'site_resin_tap', name: 'Canopy Tap', resourceId: ResourceId.PULSE_RESIN, unlocked: false, level: 0, baseCost: 3000, multiplierPerLevel: 0.25 }
    ],
    fleets: []
  },
  {
    id: 'abyss',
    name: 'The Event Horizon',
    icon: '🕳️',
    galaxyId: 'void_reach',
    description: 'A planet orbiting a massive black hole. Time dilation makes production erratic but exotic.',
    unlocked: false,
    resourceMultipliers: { [ResourceId.VOID_CELL]: 2.5, [ResourceId.DARK_MATTER]: 1.8 },
    costToUnlock: [{ resourceId: ResourceId.SINGULARITY_CORE, amount: 5 }, { resourceId: ResourceId.VOID_SHARDS, amount: 1000000 }],
    miningSites: [
      { id: 'site_void', name: 'Singularity Well', resourceId: ResourceId.VOID_CELL, unlocked: true, level: 0, baseCost: 50000, multiplierPerLevel: 0.5 }
    ],
    fleets: []
  },
  {
    id: 'chronos',
    name: 'Chronos Sands',
    icon: '⏳',
    galaxyId: 'void_reach',
    description: 'A desolate desert world where temporal anomalies are frequent, yielding rare time sand and glimmer silk.',
    unlocked: false,
    resourceMultipliers: { [ResourceId.TIME_SAND]: 2.0, [ResourceId.GLIMMER_SILK]: 1.5 },
    costToUnlock: [{ resourceId: ResourceId.DARK_MATTER, amount: 50 }, { resourceId: ResourceId.CHRONO_FLUID, amount: 10 }, { resourceId: ResourceId.VOID_SHARDS, amount: 50000 }],
    miningSites: [
      { id: 'site_temporal_mine', name: 'Temporal Mine', resourceId: ResourceId.TIME_SAND, unlocked: false, level: 0, baseCost: 10000, multiplierPerLevel: 0.3 }
    ],
    fleets: []
  }
];

export const ALL_GALAXIES: Galaxy[] = [
  { id: 'nebula_cluster', name: 'Nebula Cluster', description: 'The starting cluster.', unlocked: true, costToUnlock: [] },
  { id: 'void_reach', name: 'The Void Reach', description: 'A dark sector where the laws of physics are thin.', unlocked: false, costToUnlock: [{ resourceId: ResourceId.QUANTUM_CORE, amount: 50 }, { resourceId: ResourceId.DARK_MATTER, amount: 10000 }] },
];

export const ALL_PRODUCERS: Producer[] = [
  { id: 'solar_collector', name: 'Solar Collector', icon: '☀️', produces: ResourceId.ENERGY_CRYSTAL, baseRate: 0.1, cost: [{ resourceId: ResourceId.RAW_METAL, amount: 10 }], level: 1, unlocked: true, description: 'Generates basic energy crystals.' },
  { id: 'mining_drone', name: 'Mining Drone', icon: '⛏️', produces: ResourceId.RAW_METAL, baseRate: 0.05, cost: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 15 }], level: 1, unlocked: true, description: 'Extracts raw metals.' },
  { id: 'biomass_vat', name: 'Biomass Vat', icon: '🌿', produces: ResourceId.SYNTHETIC_BIOMASS, baseRate: 0.02, cost: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 20 }, { resourceId: ResourceId.RAW_METAL, amount: 10 }], level: 0, unlocked: false, description: 'Cultivates organic material.' },
  { id: 'silica_sifter', name: 'Silica Sifter', icon: '🏜️', produces: ResourceId.SILICA_SAND, baseRate: 0.08, cost: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 50 }], level: 0, unlocked: false, description: 'Sifts ground silicate minerals.' },
  { id: 'helium_pump', name: 'Helium Pump', icon: '☁️', produces: ResourceId.GASEOUS_HELIUM, baseRate: 0.03, cost: [{ resourceId: ResourceId.RAW_METAL, amount: 80 }], level: 0, unlocked: false, description: 'Extracts helium from atmosphere.' },
  { id: 'water_condenser', name: 'Heavy Water Condenser', icon: '🧪', produces: ResourceId.HEAVY_WATER, baseRate: 0.02, cost: [{ resourceId: ResourceId.SILICA_SAND, amount: 100 }], level: 0, unlocked: false, description: 'Distills heavy isotopes.' },
  { id: 'data_antenna', name: 'Signal Antenna', icon: '📡', produces: ResourceId.DATA_SEGMENT, baseRate: 0.01, cost: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 150 }], level: 0, unlocked: false, description: 'Captures cosmic data packets.' },
  { id: 'chitin_farm', name: 'Chitin Farm', icon: '🐚', produces: ResourceId.CHITIN_PLATE, baseRate: 0.015, cost: [{ resourceId: ResourceId.SYNTHETIC_BIOMASS, amount: 50 }], level: 0, unlocked: false, description: 'Grows reinforced organic shells.' },
  { id: 'neuro_spinner', name: 'Neuro Spinner', icon: '🧬', produces: ResourceId.NEURO_FIBER, baseRate: 0.01, cost: [{ resourceId: ResourceId.SYNTHETIC_BIOMASS, amount: 75 }], level: 0, unlocked: false, description: 'Weaves synthetic axons.' },
  { id: 'resin_tapper', name: 'Resin Tapper', icon: '💧', produces: ResourceId.PULSE_RESIN, baseRate: 0.025, cost: [{ resourceId: ResourceId.CHITIN_PLATE, amount: 20 }], level: 0, unlocked: false, description: 'Extracts vibrating resins.' },
];

export const ALL_RECIPES: Recipe[] = [
  { id: 'processor_circuit', name: 'Processor Circuit', inputs: [{ resourceId: ResourceId.RAW_METAL, amount: 5 }, { resourceId: ResourceId.ENERGY_CRYSTAL, amount: 5 }], outputs: [{ resourceId: ResourceId.PROCESSOR, amount: 1 }], baseCraftTime: 10, xpReward: 20, unlocked: true, description: 'Basic processors.' },
  { id: 'alloy_plate', name: 'Alloy Refinement', inputs: [{ resourceId: ResourceId.RAW_METAL, amount: 10 }, { resourceId: ResourceId.SILICA_SAND, amount: 5 }], outputs: [{ resourceId: ResourceId.ALLOY_PLATE, amount: 1 }], baseCraftTime: 20, xpReward: 30, unlocked: true, description: 'Refined alloy plating.' },
  { id: 'adv_component', name: 'Advanced Component', inputs: [{ resourceId: ResourceId.PROCESSOR, amount: 3 }, { resourceId: ResourceId.ALLOY_PLATE, amount: 2 }, { resourceId: ResourceId.DATA_SEGMENT, amount: 10 }], outputs: [{ resourceId: ResourceId.ADVANCED_COMPONENT, amount: 1 }], baseCraftTime: 45, xpReward: 75, unlocked: false, description: 'Integrates complex systems.' },
  { id: 'nano_lattice', name: 'Nano Lattice', inputs: [{ resourceId: ResourceId.RAW_METAL, amount: 20 }, { resourceId: ResourceId.ENERGY_CRYSTAL, amount: 30 }, { resourceId: ResourceId.SYNTHETIC_BIOMASS, amount: 10 }], outputs: [{ resourceId: ResourceId.NANO_LATTICE, amount: 1 }], baseCraftTime: 60, xpReward: 100, unlocked: false, description: 'A flexible, strong nanostructure.' },
  { id: 'neural_link', name: 'Neural Link', inputs: [{ resourceId: ResourceId.ADVANCED_COMPONENT, amount: 2 }, { resourceId: ResourceId.NEURO_FIBER, amount: 50 }, { resourceId: ResourceId.DATA_SEGMENT, amount: 20 }], outputs: [{ resourceId: ResourceId.NEURAL_LINK, amount: 1 }], baseCraftTime: 90, xpReward: 150, unlocked: false, description: 'Connects organic thought to machine logic.' },
  { id: 'quantum_bit', name: 'Quantum Bit', inputs: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 50 }, { resourceId: ResourceId.PROCESSOR, amount: 5 }], outputs: [{ resourceId: ResourceId.QUANTUM_BIT, amount: 1 }], baseCraftTime: 30, xpReward: 60, unlocked: false, description: 'A fundamental unit of quantum information.' },
  { id: 'chrono_fluid_synth', name: 'Chrono Fluid Synthesis', inputs: [{ resourceId: ResourceId.CHRONO_FLUID, amount: 1 }, { resourceId: ResourceId.QUANTUM_BIT, amount: 5 }], outputs: [{ resourceId: ResourceId.CHRONO_FLUID, amount: 1 }], baseCraftTime: 120, xpReward: 200, unlocked: false, description: 'Refines and concentrates chrono-particles.' },
  { id: 'dark_matter_chamber', name: 'Dark Matter Chamber', inputs: [{ resourceId: ResourceId.ADVANCED_COMPONENT, amount: 5 }, { resourceId: ResourceId.NANO_LATTICE, amount: 10 }, { resourceId: ResourceId.VOID_SHARDS, amount: 1000 }], outputs: [{ resourceId: ResourceId.DARK_MATTER, amount: 1 }], baseCraftTime: 180, xpReward: 300, unlocked: false, description: 'Condenses elusive dark matter.' },
];

export const ALL_FUSION_RECIPES: FusionRecipe[] = [
  { id: 'chrono_stabilization', name: 'Chrono Stabilization', inputs: [{ resourceId: ResourceId.TIME_SAND, amount: 100 }, { resourceId: ResourceId.ENERGY_CRYSTAL, amount: 1000 }], output: { resourceId: ResourceId.CHRONO_FLUID, amount: 10 }, xpReward: 400, unlocked: true, description: 'Stabilizes temporal grains into fluid form.' },
  { id: 'quantum_fusion', name: 'Quantum Fusion', inputs: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 5000 }, { resourceId: ResourceId.QUANTUM_BIT, amount: 100 }], output: { resourceId: ResourceId.QUANTUM_CORE, amount: 1 }, xpReward: 500, unlocked: true, description: 'Fuses energy into a core.' },
  { id: 'void_lattice_fabrication', name: 'Void Lattice', inputs: [{ resourceId: ResourceId.DARK_MATTER, amount: 50 }, { resourceId: ResourceId.NANO_LATTICE, amount: 100 }], output: { resourceId: ResourceId.VOID_CELL, amount: 5 }, xpReward: 1200, unlocked: true, description: 'Wraps dark matter in a carbon-nano mesh.' },
  { id: 'neural_mesh_synthesis', name: 'Neural Mesh', inputs: [{ resourceId: ResourceId.NEURAL_LINK, amount: 25 }, { resourceId: ResourceId.DATA_SEGMENT, amount: 500 }], output: { resourceId: ResourceId.NEURAL_DATA, amount: 10 }, xpReward: 1500, unlocked: true, description: 'Synthesizes raw neural data from filtered signals.' },
  { id: 'stardust_ignition', name: 'Stardust Ignition', inputs: [{ resourceId: ResourceId.NEBULA_MIST, amount: 5000 }, { resourceId: ResourceId.STAR_SILVER, amount: 500 }], output: { resourceId: ResourceId.STELLAR_FORGE_CORE, amount: 1 }, xpReward: 3000, unlocked: true, description: 'Ignites cosmic mist with heavy silver.' },
  { id: 'multiverse_key_bridge', name: 'Omni-Link', inputs: [{ resourceId: ResourceId.PARALLEL_REALITY_KEY, amount: 10 }, { resourceId: ResourceId.REALITY_GLUE, amount: 5000 }], output: { resourceId: ResourceId.MULTIVERSE_LINK, amount: 1 }, xpReward: 10000, unlocked: true, description: 'Stabilizes a permanent cross-reality bridge.' },
];

export const ALL_VOID_UPGRADES: VoidUpgrade[] = [
  { id: 'eternal_darkness', name: 'Eternal Darkness', description: 'Increases all base production rates by 10%.', icon: '🌘', level: 0, baseCost: 100, costMultiplier: 2.5 },
  { id: 'temporal_flow_amplification', name: 'Temporal Flow Amplification', description: 'Increases all crafting speed by 10%.', icon: '⏳', level: 0, baseCost: 200, costMultiplier: 2.5 }, // New void upgrade for crafting speed
];

export const ALL_QUESTS: Quest[] = [
  { id: 'starter_delivery', name: 'Emergency Supplies', description: 'Deliver fundamental materials.', icon: '📦', requirements: [{ resourceId: ResourceId.RAW_METAL, amount: 200 }], rewards: { resources: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 100 }], xp: 250 }, isCompleted: false, unlocked: true },
  {
    id: 'q_biomass_logistics',
    name: 'Bio-Logistics Chain',
    description: 'Establish a stable supply of organic materials for new colonies.',
    icon: '🌿📦',
    requirements: [{ resourceId: ResourceId.SYNTHETIC_BIOMASS, amount: 500 }],
    rewards: { resources: [{ resourceId: ResourceId.ADVANCED_COMPONENT, amount: 5 }], xp: 300 },
    isCompleted: false,
    unlocked: false, // Unlocked by research
  },
  {
    id: 'q_processor_assembly',
    name: 'Neural Net Integration',
    description: 'Synthesize advanced processors for higher-tier constructs.',
    icon: '💡🔗',
    requirements: [{ resourceId: ResourceId.PROCESSOR, amount: 100 }, { resourceId: ResourceId.ALLOY_PLATE, amount: 50 }],
    rewards: { resources: [{ resourceId: ResourceId.QUANTUM_BIT, amount: 10 }], xp: 750 },
    isCompleted: false,
    unlocked: false, // Unlocked by research
  },
  {
    id: 'q_deep_void_harvest',
    name: 'Abyssal Extraction Initiative',
    description: 'Tap into the void for its exotic fragments and dark matter.',
    icon: '🌌🖤',
    requirements: [{ resourceId: ResourceId.VOID_SHARDS, amount: 50000 }, { resourceId: ResourceId.DARK_MATTER, amount: 10 }],
    rewards: { resources: [{ resourceId: ResourceId.SINGULARITY_CORE, amount: 1 }, { resourceId: ResourceId.VOID_CELL, amount: 20 }], xp: 2500 },
    isCompleted: false,
    unlocked: false, // Unlocked by research
  },
  {
    id: 'q_krios_cold_front',
    name: 'Krios Cold Front',
    description: 'Prepare for extended operations on Krios Iceshelf. Establish initial heavy water production.',
    icon: '❄️🧪',
    requirements: [{ resourceId: ResourceId.HEAVY_WATER, amount: 100 }, { resourceId: ResourceId.COMET_ICE, amount: 50 }],
    rewards: {
      resources: [{ resourceId: ResourceId.ALLOY_PLATE, amount: 50 }],
      xp: 1000,
      fleet: { id: 'f_krios_logistics', type: 'logistics', level: 1 } // New fleet reward
    },
    isCompleted: false,
    unlocked: false, // Unlocked when Krios is colonized
  },
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'novice_commander', name: 'Novice Commander', category: 'Growth', description: 'Reach Player Rank 5.', icon: '🎖️', isUnlocked: false, xpReward: 500, requirement: { type: 'PLAYER_LEVEL', value: 5 } },
  { id: 'industrial_giant', name: 'Industrial Giant', category: 'Industry', description: 'Reach Rank 50 with any Producer.', icon: '🏭', isUnlocked: false, xpReward: 1000, requirement: { type: 'PRODUCER_LEVEL', targetId: 'solar_collector', value: 50 } },
  // Fix: Added missing 'name' property
  { id: 'master_crafter', name: 'Master Crafter', category: 'Assembly', description: 'Complete 100 crafts.', icon: '🏆', isUnlocked: false, xpReward: 750, requirement: { type: 'STAT_COUNT', targetId: 'totalCraftsCompleted', value: 100 } }, // New achievement for crafting
  { id: 'void_diver', name: 'Void Diver', category: 'Cosmos', description: 'Harvest 100,000 Void Shards.', icon: '🌌', isUnlocked: false, xpReward: 1500, requirement: { type: 'STAT_COUNT', targetId: 'totalVoidShardsEarned', value: 100000 } }, // New achievement for Void Shards
  { id: 'research_initiate', name: 'Research Initiate', category: 'Growth', description: 'Complete 5 research breakthroughs.', icon: '🔬', isUnlocked: false, xpReward: 500, requirement: { type: 'STAT_COUNT', targetId: 'totalResearchBreakthroughs', value: 5 } }, // New achievement for research
  { id: 'quest_seeker', name: 'Quest Seeker', category: 'Growth', description: 'Complete 5 quests.', icon: '📜', isUnlocked: false, xpReward: 1000, requirement: { type: 'STAT_COUNT', targetId: 'totalQuestsCompleted', value: 5 } }, // New achievement for quests
];

export const ALL_CRAFTERS: Crafter[] = [
  { id: 'basic_fabricator', name: 'Basic Fabricator', icon: '🛠️', recipes: ['processor_circuit', 'alloy_plate'], queue: [], efficiencyMultiplier: 1.0, level: 0, unlocked: true, description: 'Simple crafting machine.' }
];

export const INITIAL_SPECIALIZATIONS: { [key in SpecPath]: Specialization } = {
  [SpecPath.NONE]: { id: SpecPath.NONE, name: 'Unaligned', description: 'No path chosen.', icon: '🌑', level: 0, costToUpgrade: 0 },
  [SpecPath.FORGER]: { id: SpecPath.FORGER, name: 'Path of the Forger', description: 'Metallic production boost.', icon: '⚒️', level: 0, costToUpgrade: 10 },
  [SpecPath.ALCHEMIST]: { id: SpecPath.ALCHEMIST, name: 'Path of the Alchemist', description: 'Energy/Bio boost.', icon: '⚗️', level: 0, costToUpgrade: 10 },
  [SpecPath.ARCHITECT]: { id: SpecPath.ARCHITECT, name: 'Path of the Architect', description: 'Cost reduction.', icon: '📐', level: 0, costToUpgrade: 10 },
  [SpecPath.VOID_SEEKER]: { id: SpecPath.VOID_SEEKER, name: 'Path of the Void Seeker', description: 'Exotic boost.', icon: '👁️‍🗨️', level: 0, costToUpgrade: 10 },
  [SpecPath.STELLAR_CARTOGRAPHER]: { id: SpecPath.STELLAR_CARTOGRAPHER, name: 'Path of the Cartographer', description: 'Quest/Research boost.', icon: '🧭', level: 0, costToUpgrade: 10 },
};

export const ALL_RESEARCH_ITEMS: ResearchItem[] = [
  { 
    id: 'unlock_biomass', name: 'Biomass Synthesis', category: 'Production', tier: 1, researchTime: 10, xpReward: 50,
    description: 'Unlock the Biomass Vat. Essential for organic material production.', 
    cost: [{ resourceId: ResourceId.ENERGY_CRYSTAL, amount: 100 }], 
    unlocks: [{ producerId: 'biomass_vat' }, { questId: 'q_biomass_logistics' }], isResearched: false, icon: '🌿' 
  },
  { 
    id: 'basic_silica_extraction', name: 'Silica Extraction', category: 'Production', tier: 1, researchTime: 15, xpReward: 75,
    description: 'Unlock the Silica Sifter. Vital for processor components.', 
    cost: [{ resourceId: ResourceId.RAW_METAL, amount: 120 }], 
    prerequisites: ['unlock_biomass'],
    unlocks: [{ producerId: 'silica_sifter' }], isResearched: false, icon: '🏜️' 
  },
  { 
    id: 'advanced_alloy_crafting', name: 'Advanced Alloy', category: 'Crafting', tier: 2, researchTime: 30, xpReward: 150,
    description: 'Enhance alloy production efficiency. Unlocks better alloy plate recipes.', 
    cost: [{ resourceId: ResourceId.PROCESSOR, amount: 50 }, { resourceId: ResourceId.ALLOY_PLATE, amount: 20 }], 
    prerequisites: ['basic_silica_extraction'],
    unlocks: [{ recipeId: 'alloy_plate' }, { questId: 'q_processor_assembly' }], isResearched: false, icon: '🔗' 
  },
  { 
    id: 'neural_network_basics', name: 'Neural Network Basics', category: 'Specialized', tier: 2, researchTime: 45, xpReward: 200,
    description: 'Begin research into neural interfaces. Unlocks Neural Link production.', 
    cost: [{ resourceId: ResourceId.SYNTHETIC_BIOMASS, amount: 200 }, { resourceId: ResourceId.PROCESSOR, amount: 75 }], 
    prerequisites: ['advanced_alloy_crafting'],
    unlocks: [{ producerId: 'neuro_spinner' }, { recipeId: 'neural_link' }], isResearched: false, icon: '🧠' 
  },
  { 
    id: 'void_essence_channeling', name: 'Void Essence Channeling', category: 'Void', tier: 3, researchTime: 90, xpReward: 500,
    description: 'Improve Void Shard harvesting and unlock Dark Matter production.', 
    cost: [{ resourceId: ResourceId.VOID_SHARDS, amount: 500 }, { resourceId: ResourceId.QUANTUM_CORE, amount: 2 }], 
    prerequisites: ['neural_network_basics'],
    unlocks: [{ producerId: 'data_antenna' }, { globalMultiplier: { multiplier: 1.15 } }, { recipeId: 'dark_matter_chamber' }, { questId: 'q_deep_void_harvest' }], // 15% global production boost
    isResearched: false, icon: '🌌' 
  },
  { 
    id: 'quantum_entanglement_theory', name: 'Quantum Entanglement Theory', category: 'Specialized', tier: 4, researchTime: 180, xpReward: 1000,
    description: 'Deep understanding of quantum mechanics, leading to more efficient processes.', 
    cost: [{ resourceId: ResourceId.DARK_MATTER, amount: 10 }, { resourceId: ResourceId.QUANTUM_CORE, amount: 5 }], 
    prerequisites: ['void_essence_channeling'],
    unlocks: [{ fusionRecipeId: 'quantum_fusion' }, { recipeId: 'quantum_bit' }], isResearched: false, icon: '⚛️' 
  },
];

export const INITIAL_GAME_STATE: GameState = {
  resources: INITIAL_RESOURCES,
  producers: ALL_PRODUCERS,
  crafters: ALL_CRAFTERS,
  recipes: ALL_RECIPES,
  fusionRecipes: ALL_FUSION_RECIPES,
  voidUpgrades: ALL_VOID_UPGRADES,
  research: ALL_RESEARCH_ITEMS,
  activeResearch: null,
  quests: ALL_QUESTS,
  achievements: ALL_ACHIEVEMENTS,
  specializations: INITIAL_SPECIALIZATIONS,
  activeSpec: SpecPath.NONE,
  lastTick: Date.now(),
  playerLevel: 1,
  playerXP: 0,
  planets: ALL_PLANETS,
  galaxies: ALL_GALAXIES,
  currentPlanetId: 'aethelgard',
  currentGalaxyId: 'nebula_cluster',
  globalResearchProductionMultiplier: 1, // Initialize new multiplier
  stats: {
    totalVoidShardsEarned: 0,
    totalCraftsCompleted: 0,
    totalQuestsCompleted: 0,
    totalResourcesDeconstructed: 0,
    totalResearchBreakthroughs: 0,
    sessionStartTime: Date.now(),
  }
};