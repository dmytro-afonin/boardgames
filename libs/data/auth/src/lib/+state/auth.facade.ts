import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable({providedIn: 'root'})
export class AuthFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.select(AuthSelectors.selectAuthLoaded);
  allAuth$ = this.store.select(AuthSelectors.selectAuthUser);

  constructor(private readonly store: Store) {}

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(AuthActions.initAuth());
  }

  anonymousLogin() {
    this.store.dispatch(AuthActions.anonymousLogin());
  }

  googleLogin() {
    this.store.dispatch(AuthActions.googleLogin());
  }
}
