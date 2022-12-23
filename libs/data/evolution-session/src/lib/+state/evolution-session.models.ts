/**
 * Interface for the 'EvolutionSession' data
 */

export enum Phase {
  GROWING,
  ACTING
}

export enum CardTypes {
  MIMICRY,
  SWIMMING,
  RUNNING,
  SCAVENGER,
  SYMBIOSYS,
  PIRACY,
  TAIL_LOSS,
  POISONOUS,
  PARASITE,
  CARNIVOROUS,
  FAT_TISSUE,
  HIGH_BODY_WEIGHT,
  COMMUNICATION,
  COOPERATION,
  BURROWING,
  CAMOUFLAGE,
  SHARP_VISION,
  GRAZING,
  HIBERNATION_ABILITY
}

export interface HandCard {
  type1: CardTypes,
  type2?: CardTypes
}

export interface Properties {
  animal1: number;
  animal2?: number;
  property: CardTypes;
}

export interface Animal {
  index: number;
  food: number;
}

export interface Player {
  id: string;
  name: string;
  imageUrl: string;
  hand: HandCard[];
  animals: Animal[];
  properties: Properties[];
  action?: {
    actionType: CardTypes;
    player: string;
    playerCardIndex1: number;
    playerCardIndex2?: number;
  }
}

export interface EvolutionSessionEntity {
  id: string | number; // Primary ID
  name: string;
  cards: HandCard[];
  currentPlayer: string;
  host: string;
  eat: number;
  phase: Phase;
  players: Record<string, Player>;
}

export const CARDS_BASE_SCHEME = [
  { type1: CardTypes.MIMICRY                                          , count: 4 },
  { type1: CardTypes.SWIMMING                                         , count: 8 },
  { type1: CardTypes.RUNNING                                          , count: 4 },
  { type1: CardTypes.SCAVENGER                                        , count: 4 },
  { type1: CardTypes.SYMBIOSYS                                        , count: 4 },
  { type1: CardTypes.PIRACY                                           , count: 4 },
  { type1: CardTypes.TAIL_LOSS                                        , count: 4 },
  { type1: CardTypes.POISONOUS                                        , count: 4 },
  { type1: CardTypes.PARASITE           , type2: CardTypes.CARNIVOROUS, count: 4 },
  { type1: CardTypes.PARASITE           , type2: CardTypes.FAT_TISSUE , count: 4 },
  { type1: CardTypes.HIGH_BODY_WEIGHT   , type2: CardTypes.CARNIVOROUS, count: 4 },
  { type1: CardTypes.HIGH_BODY_WEIGHT   , type2: CardTypes.FAT_TISSUE , count: 4 },
  { type1: CardTypes.COMMUNICATION      , type2: CardTypes.CARNIVOROUS, count: 4 },
  { type1: CardTypes.COOPERATION        , type2: CardTypes.CARNIVOROUS, count: 4 },
  { type1: CardTypes.COOPERATION        , type2: CardTypes.FAT_TISSUE , count: 4 },
  { type1: CardTypes.BURROWING          , type2: CardTypes.FAT_TISSUE , count: 4 },
  { type1: CardTypes.CAMOUFLAGE         , type2: CardTypes.FAT_TISSUE , count: 4 },
  { type1: CardTypes.SHARP_VISION       , type2: CardTypes.FAT_TISSUE , count: 4 },
  { type1: CardTypes.GRAZING            , type2: CardTypes.FAT_TISSUE , count: 4 },
  { type1: CardTypes.HIBERNATION_ABILITY, type2: CardTypes.CARNIVOROUS, count: 4 }
];
