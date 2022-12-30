/**
 * Interface for the 'EvolutionSession' data
 */

export enum Phase {
  GROWING,
  ACTING
}

export enum CardTypes {
  ANIMAL,
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


export const WEIGHT_PROPERTY_MAP: Record<CardTypes, number> = {
  [CardTypes.ANIMAL]: 0,
  [CardTypes.MIMICRY]: 0,
  [CardTypes.SWIMMING]: 0,
  [CardTypes.RUNNING]: 0,
  [CardTypes.SCAVENGER]: 0,
  [CardTypes.SYMBIOSYS]: 0,
  [CardTypes.PIRACY]: 0,
  [CardTypes.TAIL_LOSS]: 0,
  [CardTypes.POISONOUS]: 0,
  [CardTypes.PARASITE]: 2,
  [CardTypes.CARNIVOROUS]: 1,
  [CardTypes.FAT_TISSUE]: 0,
  [CardTypes.HIGH_BODY_WEIGHT]: 1,
  [CardTypes.COMMUNICATION]: 0,
  [CardTypes.COOPERATION]: 0,
  [CardTypes.BURROWING]: 0,
  [CardTypes.CAMOUFLAGE]: 0,
  [CardTypes.SHARP_VISION]: 0,
  [CardTypes.GRAZING]: 0,
  [CardTypes.HIBERNATION_ABILITY]: 0
}


export interface HandCard {
  type1: CardTypes,
  type2?: CardTypes
}

export interface DoubleProperty {
  animal1: number;
  animal2: number;
  property: CardTypes;
}

export interface Animal {
  index: number;
  food: number;
  requiredFood: number;
  fat: number;
  attacked: boolean;
  piracyUsed: boolean;
  poisoned?: boolean;
  hibernation?: boolean;
  hibernationCooldown?: number;
  canBeActioned?: boolean;
  properties: CardTypes[]
}

export interface Player {
  order: number;
  id: string;
  name: string;
  imageUrl: string;
  hand: HandCard[];
  animals: Animal[];
  properties: DoubleProperty[];
  endPhase: boolean;
  attack: Attack | null;
  score: number;
}
export interface Attack {

  carnivorous: number;
  player: string;
  animalIndex: number;
}

export interface EvolutionSessionEntity {
  id: string | number; // Primary ID
  started: boolean;
  name: string;
  cards: HandCard[];
  currentPlayer: string;
  firstPlayer: string;
  host: string;
  eat: number;
  phase: Phase;
  finished: boolean;
  players: Record<string, Player>;
}

export interface CardSchemeItem {
  type1: CardTypes;
  type2?: CardTypes;
  count: number;
}

export const CARDS_BASE_SCHEME: CardSchemeItem[] = [
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
