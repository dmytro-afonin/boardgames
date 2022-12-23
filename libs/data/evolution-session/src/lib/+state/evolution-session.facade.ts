import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as EvolutionSessionActions from './evolution-session.actions';
import * as EvolutionSessionSelectors from './evolution-session.selectors';
import { selectSessionList } from './evolution-session.selectors';

@Injectable()
export class EvolutionSessionFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(
    select(EvolutionSessionSelectors.selectEvolutionSessionLoaded)
  );
  allEvolutionSession$ = this.store.pipe(
    select(EvolutionSessionSelectors.selectSessionList)
  );
  selectedEvolutionSession$ = this.store.pipe(
    select(EvolutionSessionSelectors.selectEntity)
  );

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(EvolutionSessionActions.initEvolutionSession());
  }
}
