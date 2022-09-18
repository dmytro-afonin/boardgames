import { createReducer, on, Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthEntity } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthEntity;
}

export const initialAuthState: AuthEntity = {
  loading: false,
  loaded: false,
  error: '',
};

const reducer = createReducer(
  initialAuthState,
  on(AuthActions.initAuth, (state): AuthEntity => ({
    ...state,
    loading: true,
    loaded: false,
    error: '',
  })),
  on(AuthActions.loadAuthSuccess, (state, { user }): AuthEntity => ({
    ...state,
    loading: false,
    error: '',
    loaded: true,
    user
  })),
  on(AuthActions.loadAuthFailure, (state, { error }): AuthEntity => ({
    ...state,
    loading: false,
    error
  }))
);

export function authReducer(state: AuthEntity | undefined, action: Action) {
  return reducer(state, action);
}
