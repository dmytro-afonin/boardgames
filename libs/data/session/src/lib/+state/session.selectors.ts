import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  SESSION_FEATURE_KEY,
  SessionState,
  sessionAdapter,
} from './session.reducer';

// Lookup the 'Session' feature state managed by NgRx
export const selectSessionState =
  createFeatureSelector<SessionState>(SESSION_FEATURE_KEY);

const { selectAll, selectEntities } = sessionAdapter.getSelectors();

export const selectSessionLoaded = createSelector(
  selectSessionState,
  (state: SessionState) => state.loaded
);

export const selectSessionError = createSelector(
  selectSessionState,
  (state: SessionState) => state.error
);

export const selectAllSession = createSelector(
  selectSessionState,
  (state: SessionState) => selectAll(state)
);

export const selectSessionEntities = createSelector(
  selectSessionState,
  (state: SessionState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectSessionState,
  (state: SessionState) => state.selectedId
);

export const selectSelected = createSelector(
  selectSessionEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
