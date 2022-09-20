import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import * as SessionActions from './session.actions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SessionEntity } from '@boardgames/data/session';
import { Action } from '@ngrx/store';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class SessionEffects implements OnInitEffects {
  init$ = createEffect(() => this.actions$.pipe(
    ofType(SessionActions.initSessions),
    switchMap(() =>
      this.firestore.collection<SessionEntity>('session').valueChanges({idField: 'id'}).pipe(
        map((sessions: SessionEntity[]) =>
          SessionActions.loadSessionsSuccess({ sessions })
        )
      )
    ),
    catchError(() => of(SessionActions.loadSessionsFailure({error: 'cannot load sessions'})))
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly firestore: AngularFirestore
  ) {}

  ngrxOnInitEffects(): Action {
    return SessionActions.initSessions();
  }
}
