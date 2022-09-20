import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as SessionActions from './session.actions';
import * as SessionSelectors from './session.selectors';

@Injectable()
export class SessionFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.select(SessionSelectors.selectSessionLoaded);
  allSession$ = this.store.select(SessionSelectors.selectAllSession);
  selectedSession$ = this.store.select(SessionSelectors.selectSelected);

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(SessionActions.initSessions());
  }
}
