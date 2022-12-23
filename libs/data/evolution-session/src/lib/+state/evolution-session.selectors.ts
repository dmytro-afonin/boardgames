import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EVOLUTION_SESSION_FEATURE_KEY,
  EvolutionSessionState,
  evolutionSessionAdapter,
} from './evolution-session.reducer';
import { selectAllSession, SessionEntity } from '@boardgames/data/session';
import { EvolutionSessionEntity } from './evolution-session.models';

// Lookup the 'EvolutionSession' feature state managed by NgRx
export const selectEvolutionSessionState =
  createFeatureSelector<EvolutionSessionState>(EVOLUTION_SESSION_FEATURE_KEY);

const { selectAll, selectEntities } = evolutionSessionAdapter.getSelectors();

export const selectEvolutionSessionLoaded = createSelector(
  selectEvolutionSessionState,
  (state: EvolutionSessionState) => state.loaded
);

export const selectEvolutionSessionError = createSelector(
  selectEvolutionSessionState,
  (state: EvolutionSessionState) => state.error
);

export const selectAllEvolutionSession = createSelector(
  selectEvolutionSessionState,
  (state: EvolutionSessionState) => selectAll(state)
);

export const selectSessionList = createSelector(
  selectAllEvolutionSession,
  (sessions: EvolutionSessionEntity[]) => {
    return sessions.map((session) => {
      return {
        ...session,
        usersArray: Object.values(session.players)
      }
    })
  }
);

export const selectEvolutionSessionEntities = createSelector(
  selectEvolutionSessionState,
  (state: EvolutionSessionState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectEvolutionSessionState,
  (state: EvolutionSessionState) => state.selectedId
);

export const selectEntity = createSelector(
  selectEvolutionSessionEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
