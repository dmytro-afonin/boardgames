import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as EvolutionSessionActions from './evolution-session.actions';
import * as EvolutionSessionSelectors from './evolution-session.selectors';
import { User } from '@boardgames/data/auth';
import {
  CARDS_BASE_SCHEME,
  CardSchemeItem,
  EvolutionSessionEntity,
  HandCard,
  Phase,
  Player
} from './evolution-session.models';

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

  createSession(name: string, user: User): void {
    const cards = this.#createCardsFromSchema();

    const player: Player = {
      id: user.id,
      name: user.name,
      imageUrl: user.imageUrl,
      hand: [],
      animals: [],
      properties: []
    }

    const evolutionSession: Partial<EvolutionSessionEntity> = {
      host: user.id,
      name,
      cards,
      currentPlayer: '',
      eat: 0,
      phase: Phase.GROWING,
      started: false,
      players: {
        [user.id]: player
      }
    }

    this.store.dispatch(EvolutionSessionActions.createEvolutionSession({evolutionSession}));
  }


  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(EvolutionSessionActions.initEvolutionSession());
  }

  #createCardsFromSchema(): HandCard[] {
    let cards: HandCard[] = [];
    let scheme: CardSchemeItem[] = JSON.parse(JSON.stringify(this.#shuffle(CARDS_BASE_SCHEME)));

    while (scheme.length) {
      scheme = this.#shuffle(scheme);
      cards = this.#shuffle(cards);

      const randomSchemeIndex = this.#getRandomIndex(scheme.length);
      const randomSchemeItem = scheme[randomSchemeIndex];
      randomSchemeItem.count--;

      if (randomSchemeItem.count === 0) {
        scheme.splice(randomSchemeIndex, 1);
        scheme = this.#shuffle(scheme);
      }

      const item: HandCard = {type1: randomSchemeItem.type1};
      if (randomSchemeItem.type2) {
        item.type2 = randomSchemeItem.type2;
      }

      cards.push(item);
      cards = this.#shuffle(cards);
    }

    return this.#shuffle(cards);
  }

  #shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = this.#getRandomIndex(currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  #getRandomIndex(length: number): number {
    return Math.floor(Math.random() * length);
  }
}
