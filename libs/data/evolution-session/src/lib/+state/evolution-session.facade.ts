import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as EvolutionSessionActions from './evolution-session.actions';
import * as EvolutionSessionSelectors from './evolution-session.selectors';
import { User } from '@boardgames/data/auth';
import {
  Animal,
  CARDS_BASE_SCHEME,
  CardSchemeItem, CardTypes, DoubleProperty,
  EvolutionSessionEntity,
  HandCard,
  Phase,
  Player, WEIGHT_PROPERTY_MAP
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

  selectCurrentSession$ = this.store.pipe(
    select(EvolutionSessionSelectors.selectEntity),
  );

  setCurrentSession(selectedId: string): void {
    this.store.dispatch(EvolutionSessionActions.setSelectedSession({selectedId}));
  }
  playAnimal(player: Player, session: EvolutionSessionEntity): void {
    if (!player.hand.length) {
      player.endPhase = true;
    }

    this.#processAction(player, session);
  }

  addPropertyToMyAnimal(player: Player, session: EvolutionSessionEntity): void {
    if (!player.hand.length) {
      player.endPhase = true;
    }

    this.#processAction(player, session);
  }
  addPropertyToEnemyAnimal(player: Player, session: EvolutionSessionEntity, enemy: Player): void {
    if (!player.hand.length) {
      player.endPhase = true;
    }

    const newSession: EvolutionSessionEntity = JSON.parse(JSON.stringify(session));
    newSession.players[enemy.id] = enemy;

    this.#processAction(player, newSession);
  }
  endPhase(player: Player, session: EvolutionSessionEntity): void {
    player.endPhase = true;

    this.#processAction(player, session);
  }
  startSession(evolutionSession: EvolutionSessionEntity): void {
    const session: EvolutionSessionEntity = JSON.parse(JSON.stringify(evolutionSession));
    const playerIds: string[] = Object.keys(session.players);
    for (let i = 0; i < 6; i ++) {
      for (let j = 0; j < playerIds.length; j++) {
        const player = session.players[playerIds[j]];
        player.order = j;
        session.cards = this.#addCard(player, session.cards);
      }
    }
    session.started = true;
    const randomPlayerIndex = this.#getRandomIndex(playerIds.length);
    session.firstPlayer = playerIds[randomPlayerIndex];
    session.currentPlayer = session.firstPlayer;
    this.store.dispatch(EvolutionSessionActions.updateSession({evolutionSession: session}));
  }

  joinSession(user: User, id: string): void {
    const player = this.#createPlayer(user);
    const evolutionSession: Partial<EvolutionSessionEntity> = {
      id,
      players: {[user.id]: player}
    }
    this.store.dispatch(EvolutionSessionActions.updateSession({evolutionSession}));
  }

  createSession(name: string, user: User): void {
    const cards = this.#createCardsFromSchema();

    const player: Player = this.#createPlayer(user);

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

  #processAction(player: Player, session: EvolutionSessionEntity): void {
    const newSession: EvolutionSessionEntity = JSON.parse(JSON.stringify(session));
    newSession.players[player.id] = player;

    const evolutionSession: Partial<EvolutionSessionEntity> = {
      id: newSession.id,
      ...this.#getSessionUpdateForAction(player, newSession)
    }

    this.store.dispatch(EvolutionSessionActions.updateSession({evolutionSession}));
  }

  #getSessionUpdateForAction(player: Player, session: EvolutionSessionEntity): Partial<EvolutionSessionEntity> {
    const allPlayers = Object.values(session.players);
    const availPlayers: Player[] = allPlayers.filter(p => !p.endPhase);

    if (!availPlayers.length) {
      if (!session.cards.length) {
        // todo calculate winner
      }
      return this.#setupNewPhase(player, session);
    }

    return {
      currentPlayer: this.#findNextPlayer(allPlayers, player),
      players: session.players
    }
  }

  #setupNewPhase(player: Player, session: EvolutionSessionEntity): Partial<EvolutionSessionEntity> {
    if (session.phase === Phase.GROWING) {
      const allPlayers = Object.values(session.players);
      return {
        players: {[player.id]: player},
        phase: Phase.ACTING,
        eat: this.#getFood(allPlayers.length),
        currentPlayer: session.firstPlayer
      }
    }

    const firstPlayer = this.#shiftFirstPlayer(session);
    return {
      ...this.#updateCards(session),
      phase: Phase.GROWING,
      firstPlayer,
      currentPlayer: firstPlayer
    }
  }

  #updateCards(session: EvolutionSessionEntity): Partial<EvolutionSessionEntity> {
    const newSession: EvolutionSessionEntity = JSON.parse(JSON.stringify(session));
    const allPlayers: Player[] = Object.values(newSession.players);
    let cards: HandCard[] = newSession.cards;
    const players: Player[] = this.#updatePlayerAnimals(allPlayers);
    const cardsReceiveMap = players.reduce((sum, cur) => {
      const amount = this.#getAmountOfCardsToReceive(cur);
      sum[cur.id] = amount;
      sum['all'] += amount;
      return sum;
    }, {all: 0} as Record<string, number>);

    const cardsToGive = Math.min(cardsReceiveMap['all'], cards.length);

    for (let i = 0; i < cardsToGive; i++) {
      const filteredPlayers = players.filter(p => cardsReceiveMap[p.id]);

      for (const player of filteredPlayers) {
        cards = this.#addCard(player, cards);
        cardsReceiveMap[player.id]--;
      }
    }

    return {
      cards,
      players: players.reduce((sum, cur) => {
        sum[cur.id] = cur;
        return sum;
      }, {} as Record<string, Player>)
    };
  }

  #addCard(player: Player, cards: HandCard[]): HandCard[] {
    const randomIndex = this.#getRandomIndex(cards.length);
    const card: HandCard[] = cards.splice(randomIndex, 1);
    player.hand.push(...card);
    return this.#shuffle(cards);
  }

  #getAmountOfCardsToReceive(player: Player): number {
    if (!player.animals.length && !player.hand.length) {
      return 6;
    }

    return player.animals.length + 1;
  }

  #updatePlayerAnimals(players: Player[]): Player[] {
    return players.map(p => {
      const animals = this.#killHungryAnimals(p.animals);
      const properties = this.#removeBrokenProperties(animals, p.properties);
      return {
        ...p,
        animals,
        properties
      }
    });
  }

  #removeBrokenProperties(animals: Animal[], properties: DoubleProperty[]): DoubleProperty[] {
    return properties.filter(p => animals.find(a => p.animal1 === a.index) && animals.find(a => p.animal2 === a.index))
  }

  #killHungryAnimals(animals: Animal[]): Animal[] {
    return animals
      .filter((a) => {
        if (a.hibernation) {
          return true;
        }
        const requiredFood = this.#getRequiredFood(a.properties);
        return a.food >= requiredFood;
      })
      .map(a => {
        const hibernationCooldown = this.#getHibernationCooldown(a);
        return {...a, food: 0, hibernation: false, hibernationCooldown}
      });
  }

  #getHibernationCooldown(a: Animal): number {
    if (a.hibernation) {
      return 1;
    }

    if (a.hibernationCooldown) {
      return a.hibernationCooldown - 1;
    }

    return 0;
  }

  #getRequiredFood(properties: CardTypes[]): number {
    return properties.reduce((sum, cur) => sum + WEIGHT_PROPERTY_MAP[cur], 1);
  }

  #shiftFirstPlayer(session: EvolutionSessionEntity): string {
    const allPlayers = Object.values(session.players);
    let newPlayerOrder = session.players[session.firstPlayer].order + 1;
    if (newPlayerOrder >= allPlayers.length) {
      newPlayerOrder = 0;
    }
    return (allPlayers.find(p => p.order === newPlayerOrder) as Player).id;
  }

  #findNextPlayer(players: Player[], currentPlayer: Player): string {
    const availPlayers: Player[] = players.filter(p => !p.endPhase);

    for (let i = currentPlayer.order + 1; i < players.length; i++) {
      const p = availPlayers.find(p => p.order === i);

      if (p) {
        return p.id;
      }
    }

    for (let i = 0; i <= currentPlayer.order; i++) {
      const p = availPlayers.find(p => p.order === i);

      if (p) {
        return p.id;
      }
    }

    return currentPlayer.id;
  }

  #getFood(players: number): number {
    switch (players) {
      case 2: return this.#getDiceNumber() + 2;
      case 3: return this.#getDiceNumber() + this.#getDiceNumber();
      default: return this.#getDiceNumber() + this.#getDiceNumber() + 2;
    }
  }

  #getDiceNumber(): number {
    return this.#getRandomIndex(6) + 1;
  }

  #createPlayer(user: User, order = 0): Player {
    return {
      order,
      id: user.id,
      name: user.name,
      imageUrl: user.imageUrl,
      hand: [],
      animals: [],
      properties: [],
      endPhase: false
    };
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