import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as SessionActions from './session.actions';
import { SessionEffects } from './session.effects';

describe('SessionEffects', () => {
  let actions: Observable<Action>;
  let effects: SessionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        SessionEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(SessionEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: SessionActions.initSession() });

      const expected = hot('-a-|', {
        a: SessionActions.loadSessionSuccess({ session: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
