import { SessionEntity } from './session.models';
import {
  sessionAdapter,
  SessionPartialState,
  initialSessionState,
} from './session.reducer';
import * as SessionSelectors from './session.selectors';

describe('Session Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getSessionId = (it: SessionEntity) => it.id;
  const createSessionEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as SessionEntity);

  let state: SessionPartialState;

  beforeEach(() => {
    state = {
      session: sessionAdapter.setAll(
        [
          createSessionEntity('PRODUCT-AAA'),
          createSessionEntity('PRODUCT-BBB'),
          createSessionEntity('PRODUCT-CCC'),
        ],
        {
          ...initialSessionState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Session Selectors', () => {
    it('getAllSession() should return the list of Session', () => {
      const results = SessionSelectors.getAllSession(state);
      const selId = getSessionId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = SessionSelectors.getSelected(state) as SessionEntity;
      const selId = getSessionId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSessionLoaded() should return the current "loaded" status', () => {
      const result = SessionSelectors.getSessionLoaded(state);

      expect(result).toBe(true);
    });

    it('getSessionError() should return the current "error" state', () => {
      const result = SessionSelectors.getSessionError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
