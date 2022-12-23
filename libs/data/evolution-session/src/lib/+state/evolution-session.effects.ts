import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import * as EvolutionSessionActions from './evolution-session.actions';
import { Action } from '@ngrx/store';
import { catchError, from, map, of, switchMap } from 'rxjs';
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
      switchMap((action) => {
        const promise = this.firestore.collection<Partial<EvolutionSessionEntity>>(this.SESSIONS_COLLECTION).add(action.evolutionSession);
        return from(promise);
      })
    )
  }, {dispatch: false});

  ngrxOnInitEffects(): Action {
    return EvolutionSessionActions.initEvolutionSession();
  }
}
