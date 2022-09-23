import { createAction, props } from '@ngrx/store';
import { User } from './auth.models';

export const initAuth = createAction('[Auth] Init');

export const loadAuthSuccess = createAction(
  '[Auth/firebase] Load Auth Success',
  props<{ user: User }>()
);

export const loadAuthFailure = createAction(
  '[Auth/firebase] Load Auth Failure',
  props<{ error: string }>()
);

export const anonymousLogin = createAction('[Auth] anonymousLogin');

export const anonymousLoginSuccess = createAction(
  '[Auth/firebase] anonymousLogin Success'
);

export const anonymousLoginFailure = createAction(
  '[Auth/firebase] anonymousLogin Failure',
  props<{ error: string }>()
);

export const googleLogin = createAction('[Auth] googleLogin');
