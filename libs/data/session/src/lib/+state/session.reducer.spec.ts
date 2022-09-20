import { Action } from '@ngrx/store';

import * as SessionActions from './session.actions';
import { SessionEntity } from './session.models';
import {
  SessionState,
  initialSessionState,
  sessionReducer,
} from './session.reducer';

describe('Session Reducer', () => {
  const createSessionEntity = (id: string, name = ''): SessionEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Session actions', () => {
    it('loadSessionSuccess should return the list of known Session', () => {
      const session = [
        createSessionEntity('PRODUCT-AAA'),
        createSessionEntity('PRODUCT-zzz'),
      ];
      const action = SessionActions.loadSessionSuccess({ session });

      const result: SessionState = sessionReducer(initialSessionState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = sessionReducer(initialSessionState, action);

      expect(result).toBe(initialSessionState);
    });
  });
});
