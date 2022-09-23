import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import firebase from 'firebase/compat/app';
import { User } from './auth.models';
import { Action } from '@ngrx/store';
import { GoogleAuthProvider } from "firebase/auth";

@Injectable()
export class AuthEffects implements OnInitEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.initAuth),
      switchMap(() => this.auth.authState.pipe(
        map((firebaseUser: firebase.User | null) => {
          console.log({firebaseUser});
          if (firebaseUser) {
            const user: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName ?? firebaseUser.email ?? firebaseUser.uid
            };
            if (firebaseUser.photoURL) {
              user.imageUrl = firebaseUser.photoURL;
            }
            return AuthActions.loadAuthSuccess({ user });
          }
          return AuthActions.anonymousLogin();
        })
      )),
      catchError(() => {
        return of(AuthActions.loadAuthFailure({ error: 'unexpected error' }));
      })
    );
  });

  anonymousLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.anonymousLogin),
      switchMap(() => from(this.auth.signInAnonymously()).pipe(
        map(() => AuthActions.anonymousLoginSuccess()))
      ),
      catchError(() => {
        return of(AuthActions.anonymousLoginFailure({ error: 'unexpected error' }));
      })
    );
  });

  googleLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.googleLogin),
      tap(() => from(this.auth.signInWithPopup(new GoogleAuthProvider())).pipe(
        map(() => AuthActions.anonymousLoginSuccess()))
      ),
    );
  }, {dispatch: false});

  constructor(
    private readonly actions$: Actions,
    private readonly auth: AngularFireAuth
  ) {
  }

  ngrxOnInitEffects(): Action {
    return AuthActions.initAuth()
  }
}
