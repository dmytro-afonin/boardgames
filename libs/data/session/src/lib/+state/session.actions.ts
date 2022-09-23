import { createAction, props } from '@ngrx/store';
import { CreateSessionPayload, SessionEntity } from './session.models';
import { User } from '@boardgames/data/auth';

export const initSessions = createAction('[Sessions] Init');

export const loadSessionsSuccess = createAction(
  '[Session/Firestore] Load Sessions Success',
  props<{ sessions: SessionEntity[] }>()
);

export const loadSessionsFailure = createAction(
  '[Session/Firestore] Load Sessions Failure',
  props<{ error: string }>()
);

export const createSession = createAction('[Sessions] createSession',
  props<{ session: CreateSessionPayload }>()
);

export const joinSession = createAction(
  '[Session/Firestore] updateSession',
  props<{ id: string; user: User;}>()
);
