import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as EvolutionSessionActions from './evolution-session.actions';
import { EvolutionSessionEntity } from './evolution-session.models';

export const EVOLUTION_SESSION_FEATURE_KEY = 'evolutionSession';


export interface EvolutionSessionState extends EntityState<EvolutionSessionEntity> {
  selectedId?: string | number; // which EvolutionSession record has been selected
  loaded: boolean; // has the EvolutionSession list been loaded
  error?: string | null; // last known error (if any)
}

export interface EvolutionSessionPartialState {
  readonly [EVOLUTION_SESSION_FEATURE_KEY]: EvolutionSessionState;
}

export const evolutionSessionAdapter: EntityAdapter<EvolutionSessionEntity> =
  createEntityAdapter<EvolutionSessionEntity>();

export const initialEvolutionSessionState: EvolutionSessionState =
  evolutionSessionAdapter.getInitialState({
    // set initial required properties
    loaded: false,
  });

const reducer = createReducer(
  initialEvolutionSessionState,
  on(EvolutionSessionActions.initEvolutionSession, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(
    EvolutionSessionActions.loadEvolutionSessionSuccess,
    (state, { evolutionSession }) =>
      evolutionSessionAdapter.setAll(evolutionSession, {
        ...state,
        loaded: true,
      })
  ),
  on(
    EvolutionSessionActions.loadEvolutionSessionFailure,
    (state, { error }) => ({ ...state, error })
  ),
  on(EvolutionSessionActions.setSelectedSession, (state, { selectedId }): EvolutionSessionState => {
    return {...state, selectedId};
  })
);

export function evolutionSessionReducer(
  state: EvolutionSessionState | undefined,
  action: Action
) {
  return reducer(state, action);
}
