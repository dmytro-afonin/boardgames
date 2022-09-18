import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTH_FEATURE_KEY } from './auth.reducer';
import { AuthEntity } from '../+state/auth.models';

// Lookup the 'Auth' feature state managed by NgRx
export const selectAuthState = createFeatureSelector<AuthEntity>(AUTH_FEATURE_KEY);


export const selectAuthLoaded = createSelector(
  selectAuthState,
  (state: AuthEntity) => state.loaded
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthEntity) => state.error
);

export const selectAuthUser = createSelector(
  selectAuthState, (state: AuthEntity) => state.user
);
