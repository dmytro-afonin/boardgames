import { CardTypes } from '@boardgames/data/evolution-session';


export const UI_PROPERTY_MAP: Record<CardTypes, UiProperty> = {
  [CardTypes.ANIMAL]: {
    title: 'Animal',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.MIMICRY]: {
    title: 'Mimicry',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.SWIMMING]: {
    title: 'Swimming',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-blue-300 text-sky-700'
  },
  [CardTypes.RUNNING]: {
    title: 'Running',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.SCAVENGER]: {
    title: 'Scavenger',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.SYMBIOSYS]: {
    title: 'Symbiosys',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.PIRACY]: {
    title: 'Piracy',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.TAIL_LOSS]: {
    title: 'Tail loss',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.POISONOUS]: {
    title: 'Poisonous',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.PARASITE]: {
    title: 'Parasite',
    eat: 2,
    image: '',
    description: '',
    class: 'bg-violet-200 text-fuchsia-800',
    foodCounterClass: 'text-red-600'
  },
  [CardTypes.CARNIVOROUS]: {
    title: 'Carnivorous',
    eat: 1,
    image: '',
    description: '',
    class: 'bg-red-600 text-white'
  },
  [CardTypes.FAT_TISSUE]: {
    title: 'Fat tissue',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-yellow-200 text-yellow-800'
  },
  [CardTypes.HIGH_BODY_WEIGHT]: {
    title: 'High body weight',
    eat: 1,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900',
    foodCounterClass: 'text-red-600'
  },
  [CardTypes.COMMUNICATION]: {
    title: 'Communication',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.COOPERATION]: {
    title: 'Cooperation',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.BURROWING]: {
    title: 'Burrowing',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.CAMOUFLAGE]: {
    title: 'Camouflage',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.SHARP_VISION]: {
    title: 'Sharp vision',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.GRAZING]: {
    title: 'Grazing',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  },
  [CardTypes.HIBERNATION_ABILITY]: {
    title: 'Hibernation ability',
    eat: 0,
    image: '',
    description: '',
    class: 'bg-lime-50 text-green-900'
  }
}


export interface UiProperty {
  image: string;
  title: string;
  description: string;
  eat: number;
  class: string;
  foodCounterClass?: string;
}
