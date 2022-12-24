import { createAction, props } from '@ngrx/store';
import { EvolutionSessionEntity } from './evolution-session.models';

export const initEvolutionSession = createAction(
  '[EvolutionSession Page] Init'
);

export const loadEvolutionSessionSuccess = createAction(
  '[EvolutionSession/API] Load EvolutionSession Success',
  props<{ evolutionSession: EvolutionSessionEntity[] }>()
);

export const createEvolutionSession = createAction(
  '[EvolutionSession/API] Create EvolutionSession',
  props<{ evolutionSession: Partial<EvolutionSessionEntity> }>()
);

export const updateSession = createAction(
  '[EvolutionSession/API] Update EvolutionSession',
  props<{ evolutionSession: Partial<EvolutionSessionEntity> }>()
);

export const loadEvolutionSessionFailure = createAction(
  '[EvolutionSession/API] Load EvolutionSession Failure',
  props<{ error: string }>()
);

export const setSelectedSession = createAction(
  '[EvolutionSession/API] Set selected EvolutionSession',
  props<{ selectedId: string }>()
);
