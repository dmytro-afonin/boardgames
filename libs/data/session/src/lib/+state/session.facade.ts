import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as SessionActions from './session.actions';
import * as SessionSelectors from './session.selectors';
import { CreateSessionPayload } from './session.models';
import { createSession, joinSession } from './session.actions';
import { User } from '@boardgames/data/auth';

@Injectable()
export class SessionFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.select(SessionSelectors.selectSessionLoaded);
  allSession$ = this.store.select(SessionSelectors.selectAllSession);
  selectSessionList$ = this.store.select(SessionSelectors.selectSessionList);
  selectedSession$ = this.store.select(SessionSelectors.selectSelected);

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(SessionActions.initSessions());
  }
  createSession(session: CreateSessionPayload): void {
    this.store.dispatch(createSession({ session }));
  }
  joinSession(id: string, user: User): void {
    this.store.dispatch(joinSession({ id, user }));
  }
}
