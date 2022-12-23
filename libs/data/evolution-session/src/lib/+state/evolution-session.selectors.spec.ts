import { EvolutionSessionEntity } from './evolution-session.models';
import {
  evolutionSessionAdapter,
  EvolutionSessionPartialState,
  initialEvolutionSessionState,
} from './evolution-session.reducer';
import * as EvolutionSessionSelectors from './evolution-session.selectors';

describe('EvolutionSession Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getEvolutionSessionId = (it: EvolutionSessionEntity) => it.id;
  const createEvolutionSessionEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as EvolutionSessionEntity);

  let state: EvolutionSessionPartialState;

  beforeEach(() => {
    state = {
      evolutionSession: evolutionSessionAdapter.setAll(
        [
          createEvolutionSessionEntity('PRODUCT-AAA'),
          createEvolutionSessionEntity('PRODUCT-BBB'),
          createEvolutionSessionEntity('PRODUCT-CCC'),
        ],
        {
          ...initialEvolutionSessionState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('EvolutionSession Selectors', () => {
    it('selectAllEvolutionSession() should return the list of EvolutionSession', () => {
      const results =
        EvolutionSessionSelectors.selectAllEvolutionSession(state);
      const selId = getEvolutionSessionId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = EvolutionSessionSelectors.selectEntity(
        state
      ) as EvolutionSessionEntity;
      const selId = getEvolutionSessionId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEvolutionSessionLoaded() should return the current "loaded" status', () => {
      const result =
        EvolutionSessionSelectors.selectEvolutionSessionLoaded(state);

      expect(result).toBe(true);
    });

    it('selectEvolutionSessionError() should return the current "error" state', () => {
      const result =
        EvolutionSessionSelectors.selectEvolutionSessionError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
