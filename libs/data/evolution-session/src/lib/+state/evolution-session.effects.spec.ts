import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as EvolutionSessionActions from './evolution-session.actions';
import { EvolutionSessionEffects } from './evolution-session.effects';

describe('EvolutionSessionEffects', () => {
  let actions: Observable<Action>;
  let effects: EvolutionSessionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        EvolutionSessionEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(EvolutionSessionEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', {
        a: EvolutionSessionActions.initEvolutionSession(),
      });

      const expected = hot('-a-|', {
        a: EvolutionSessionActions.loadEvolutionSessionSuccess({
          evolutionSession: [],
        }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
