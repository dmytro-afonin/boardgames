import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import * as EvolutionSessionActions from './evolution-session.actions';
import { Action } from '@ngrx/store';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { EvolutionSessionEntity } from '@boardgames/data/evolution-session';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable()
export class EvolutionSessionEffects implements OnInitEffects {
  private readonly SESSIONS_COLLECTION = 'evolution-session';
  private actions$ = inject(Actions);
  private firestore = inject(AngularFirestore);

  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvolutionSessionActions.initEvolutionSession),
      switchMap(() =>
        this.firestore.collection<EvolutionSessionEntity>(this.SESSIONS_COLLECTION).valueChanges({idField: 'id'}).pipe(
          map((evolutionSession: EvolutionSessionEntity[]) => {
            return EvolutionSessionActions.loadEvolutionSessionSuccess({ evolutionSession });
          })
        )
      ),
      catchError(() => of(EvolutionSessionActions.loadEvolutionSessionFailure({error: 'cannot load sessions'})))
    )
  });

  createSession$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvolutionSessionActions.createEvolutionSession),
      tap((action) => {
        this.firestore
          .collection<Partial<EvolutionSessionEntity>>(this.SESSIONS_COLLECTION)
          .add(action.evolutionSession);
      })
    )
  }, {dispatch: false});
  updateSession$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EvolutionSessionActions.updateSession),
      tap((action) => {
        this.firestore
          .doc(`${this.SESSIONS_COLLECTION}/${action.evolutionSession.id}`)
          .set(action.evolutionSession, {merge: true});
      })
    )
  }, {dispatch: false});

  ngrxOnInitEffects(): Action {
    return EvolutionSessionActions.initEvolutionSession();
  }
}
