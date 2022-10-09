import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as SessionActions from './session.actions';
import * as SessionSelectors from './session.selectors';
import { Question, SessionEntity, SessionUser } from './session.models';
import { chooseCard, createSession, joinSession, startSession } from './session.actions';
import { User } from '@boardgames/data/auth';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SessionFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */


  questions: Question[] = [];
  answers: string[] = [];
  loaded$ = this.store.select(SessionSelectors.selectSessionLoaded);
  allSession$ = this.store.select(SessionSelectors.selectAllSession);
  selectSessionList$ = this.store.select(SessionSelectors.selectSessionList);
  selectedSession$ = this.store.select(SessionSelectors.selectSelected);
  selectedSessionEntities$ = this.store.select(SessionSelectors.selectSessionEntities);

  constructor(
    private readonly store: Store,
    private readonly http: HttpClient
  ) {
    this.http.get<Question[]>('/assets/questions.json').subscribe(questions => {
      this.questions = this.shuffle(questions);
    });
    this.http.get<string[]>('/assets/answers.json').subscribe(answers => {
      this.answers = this.shuffle(answers);
    });
  }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(SessionActions.initSessions());
  }
  createSession(name: string, user: User): void {
    const currentQuestion = this.questions.pop() as Question;
    const session: Partial<SessionEntity> = {
      name,
      questions: this.questions,
      answers: this.answers,
      currentUserId: user.id,
      started: false,
      currentQuestion,
      ownerId: user.id,
      users: {
        [user.id]: this.createNewSessionUser(user)
      }
    }
    this.store.dispatch(createSession({ session }));
  }

  createNewSessionUser(user: User): SessionUser {
    return { ...user, hand: [], score: 0, selectedCards: [] };
  }

  shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  joinSession(id: string, user: User): void {
    const sessionUser = this.createNewSessionUser(user);
    this.store.dispatch(joinSession({ id, sessionUser }));
  }

  startSession(session: SessionEntity): void {
    const clone: SessionEntity = JSON.parse(JSON.stringify(session));
    const users = Object.values(clone.users);
    users.forEach(u => {
      clone.users[u.id].hand = clone.answers.splice(0, 10);
    });
    clone.started = true;
    this.store.dispatch(startSession({ session: clone }));
  }

  chooseCard(cardIndex: number, sessionUser: SessionUser, sessionId: string): void {
    const clone: SessionUser = JSON.parse(JSON.stringify(sessionUser));
    const chosenCard = clone.hand.splice(cardIndex, 1);
    clone.selectedCards.push(...chosenCard);
    this.store.dispatch(chooseCard({ sessionUser: clone, sessionId }));
  }
  selectWinner(session: SessionEntity, userId: string): void {
    const clone: SessionEntity = JSON.parse(JSON.stringify(session));
    clone.currentUserId = userId;
    clone.currentQuestion = clone.questions.pop() as Question;
    clone.users[userId].score++;
    Object.values(clone.users).forEach(u => {
      const user = clone.users[u.id];
      user.hand.push(...clone.answers.splice(0, user.selectedCards.length));
      user.selectedCards = [];
    });
    this.store.dispatch(startSession({ session: clone }));
  }
}
