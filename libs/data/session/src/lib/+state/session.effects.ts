import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import * as SessionActions from './session.actions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Action } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { SessionEntity } from './session.models';

@Injectable()
export class SessionEffects implements OnInitEffects {
  private readonly SESSIONS_COLLECTION = 'session';
  init$ = createEffect(() => this.actions$.pipe(
    ofType(SessionActions.initSessions),
    switchMap(() =>
      this.firestore.collection<SessionEntity>(this.SESSIONS_COLLECTION).valueChanges({idField: 'id'}).pipe(
        map((sessions: SessionEntity[]) => {
          return SessionActions.loadSessionsSuccess({ sessions });
        })
      )
    ),
    catchError(() => of(SessionActions.loadSessionsFailure({error: 'cannot load sessions'})))
  ));

  createSession$ = createEffect(() => this.actions$.pipe(
    ofType(SessionActions.createSession),
    switchMap((action) => {
      const promise = this.firestore.collection<Partial<SessionEntity>>(this.SESSIONS_COLLECTION).add(action.session);
      return from(promise);
    })
  ), {dispatch: false});
  finishSession$ = createEffect(() => this.actions$.pipe(
    ofType(SessionActions.finishSession),
    switchMap((action) => {
      const promise = this.firestore.doc(`${this.SESSIONS_COLLECTION}/${action.id}`).delete();
      return from(promise)
    })
  ), {dispatch: false});

  updateSession$ = createEffect(() => this.actions$.pipe(
    ofType(SessionActions.joinSession),
    switchMap((action) => {
      const promise = this.firestore.doc(`${this.SESSIONS_COLLECTION}/${action.id}`).set({
        users: {[action.sessionUser.id]: action.sessionUser}
      }, {merge: true});
      return from(promise);
    })
  ), {dispatch: false});

  startSession$ = createEffect(() => this.actions$.pipe(
    ofType(SessionActions.startSession),
    switchMap((action) => {
      const promise = this.firestore.doc(`${this.SESSIONS_COLLECTION}/${action.session.id}`).set(action.session);
      return from(promise);
    })
  ), {dispatch: false});

  chooseCard$ = createEffect(() => this.actions$.pipe(
    ofType(SessionActions.chooseCard),
    switchMap((action) => {
      const promise = this.firestore.doc(`${this.SESSIONS_COLLECTION}/${action.sessionId}`).set({
        users: {[action.sessionUser.id]: action.sessionUser}
      }, {merge: true});
      return from(promise);
    })
  ), {dispatch: false});

  constructor(
    private readonly actions$: Actions,
    private readonly firestore: AngularFirestore
  ) {}

  ngrxOnInitEffects(): Action {
    return SessionActions.initSessions();
  }
}
