import { createAction, props } from '@ngrx/store';
import { SessionEntity } from './session.models';

export const initSessions = createAction('[Sessions] Init');

export const loadSessionsSuccess = createAction(
  '[Session/Firestore] Load Sessions Success',
  props<{ sessions: SessionEntity[] }>()
);

export const loadSessionsFailure = createAction(
  '[Session/Firestore] Load Sessions Failure',
  props<{ error: string }>()
);
