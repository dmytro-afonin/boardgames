import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as SessionActions from './session.actions';
import { SessionEntity } from './session.models';
import { joinSession } from './session.actions';

export const SESSION_FEATURE_KEY = 'session';

export interface SessionState extends EntityState<SessionEntity> {
  selectedId?: string | number; // which Session record has been selected
  loaded: boolean; // has the Session list been loaded
  error?: string | null; // last known error (if any)
}

export interface SessionPartialState {
  readonly [SESSION_FEATURE_KEY]: SessionState;
}

export const sessionAdapter: EntityAdapter<SessionEntity> =
  createEntityAdapter<SessionEntity>();

export const initialSessionState: SessionState = sessionAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const reducer = createReducer(
  initialSessionState,
  on(SessionActions.initSessions, (state): SessionState => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(SessionActions.joinSession, (state, action): SessionState => ({
    ...state,
    selectedId: action.id
  })),
  on(SessionActions.loadSessionsSuccess, (state, { sessions }): SessionState =>
    sessionAdapter.setAll(sessions, { ...state, loading: false, loaded: true })
  ),
  on(SessionActions.loadSessionsFailure, (state, { error }): SessionState => ({
    ...state,
    loaded: false,
    error,
  }))
);

export function sessionReducer(state: SessionState | undefined, action: Action) {
  return reducer(state, action);
}
