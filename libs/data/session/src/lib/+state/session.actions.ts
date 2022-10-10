import { createAction, props } from '@ngrx/store';
import { SessionEntity, SessionUser } from './session.models';

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
  props<{ session: Partial<SessionEntity> }>()
);

export const joinSession = createAction(
  '[Session/Firestore] updateSession',
  props<{ id: string; sessionUser: SessionUser;}>()
);

export const startSession = createAction(
  '[Session/Firestore] startSession',
  props<{ session: SessionEntity; }>()
);

export const finishSession = createAction(
  '[Session/Firestore] finishSession',
  props<{ id: string; }>()
);


export const chooseCard = createAction(
  '[Session/Firestore] chooseCard',
  props<{ sessionUser: SessionUser; sessionId: string }>()
);
