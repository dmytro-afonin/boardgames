import { Action } from '@ngrx/store';

import * as EvolutionSessionActions from './evolution-session.actions';
import { EvolutionSessionEntity } from './evolution-session.models';
import {
  EvolutionSessionState,
  initialEvolutionSessionState,
  evolutionSessionReducer,
} from './evolution-session.reducer';

describe('EvolutionSession Reducer', () => {
  const createEvolutionSessionEntity = (
    id: string,
    name = ''
  ): EvolutionSessionEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid EvolutionSession actions', () => {
    it('loadEvolutionSessionSuccess should return the list of known EvolutionSession', () => {
      const evolutionSession = [
        createEvolutionSessionEntity('PRODUCT-AAA'),
        createEvolutionSessionEntity('PRODUCT-zzz'),
      ];
      const action = EvolutionSessionActions.loadEvolutionSessionSuccess({
        evolutionSession,
      });

      const result: EvolutionSessionState = evolutionSessionReducer(
        initialEvolutionSessionState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = evolutionSessionReducer(
        initialEvolutionSessionState,
        action
      );

      expect(result).toBe(initialEvolutionSessionState);
    });
  });
});
