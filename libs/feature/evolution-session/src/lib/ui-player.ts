import { CardTypes } from '@boardgames/data/evolution-session';


export const UI_PROPERTY_MAP: Record<CardTypes, UiProperty> = {
  [CardTypes.MIMICRY]: {
    title: 'Mimicry',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.SWIMMING]: {
    title: 'Swimming',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.RUNNING]: {
    title: 'Running',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.SCAVENGER]: {
    title: 'Scavenger',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.SYMBIOSYS]: {
    title: 'Symbiosys',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.PIRACY]: {
    title: 'Piracy',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.TAIL_LOSS]: {
    title: 'Tail loss',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.POISONOUS]: {
    title: 'Poisonous',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.PARASITE]: {
    title: 'Parasite',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.CARNIVOROUS]: {
    title: 'Carnivorous',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.FAT_TISSUE]: {
    title: 'Fat tissue',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.HIGH_BODY_WEIGHT]: {
    title: 'High body weight',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.COMMUNICATION]: {
    title: 'Communication',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.COOPERATION]: {
    title: 'Cooperation',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.BURROWING]: {
    title: 'Burrowing',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.CAMOUFLAGE]: {
    title: 'Camouflage',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.SHARP_VISION]: {
    title: 'Sharp vision',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.GRAZING]: {
    title: 'Grazing',
    eat: 0,
    image: '',
    description: '',
    class: ''
  },
  [CardTypes.HIBERNATION_ABILITY]: {
    title: 'Hibernation ability',
    eat: 0,
    image: '',
    description: '',
    class: ''
  }
}


export interface UiProperty {
  image: string;
  title: string;
  description: string;
  eat: number;
  class: string;
}
