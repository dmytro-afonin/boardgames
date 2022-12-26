import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Animal,
  CardTypes,
  EvolutionSessionEntity,
  EvolutionSessionFacade,
  HandCard,
  Player
} from '@boardgames/data/evolution-session';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { AuthFacade, User } from '@boardgames/data/auth';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UI_PROPERTY_MAP } from '../../ui-player';

@Component({
  selector: 'feature-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ContainerComponent implements OnInit {
  propertyMap = UI_PROPERTY_MAP;
  cardTypes = CardTypes;
  session!: EvolutionSessionEntity;
  user!: User;
  players!: Player[];
  myPlayer!: Player;
  selectedProperty!: HandCard | null;
  selectedPropertyIndex!: number;

  constructor(
    private readonly sessionFacade: EvolutionSessionFacade,
    private readonly auth: AuthFacade,
    private readonly route: ActivatedRoute
  ) {
  }

  startSession(): void {
    this.sessionFacade.startSession(this.session);
  }

  handDrop(event: CdkDragDrop<HandCard[]>) {
    moveItemInArray(this.myPlayer.hand, event.previousIndex, event.currentIndex);
  }

  addPropertyToAnimal(animal: Animal): void {
    if (this.selectedProperty && animal.canAddProperty) {
      animal.properties.unshift(this.selectedProperty.type1);
      this.myPlayer.hand.splice(this.selectedPropertyIndex, 1);

      this.cancelSelectedProperty();
      this.sessionFacade.addPropertyToMyAnimal(this.myPlayer, this.session);
    }
  }

  addPropertyToEnemyAnimal(animal: Animal, enemy: Player): void {
    if (this.selectedProperty && animal.canAddProperty) {
      animal.properties.unshift(this.selectedProperty.type1);
      this.myPlayer.hand.splice(this.selectedPropertyIndex, 1);

      this.cancelSelectedProperty();
      this.sessionFacade.addPropertyToEnemyAnimal(this.myPlayer, this.session, enemy);
    }
  }

  selectProperty(card: HandCard, index: number): void {
    if (this.session.currentPlayer !== this.myPlayer.id) {
      return;
    }
    console.log(card);
    this.selectedProperty = card;
    this.selectedPropertyIndex = index;
    this.players.forEach(player => {
      player.animals.forEach(animal => {
        animal.canAddProperty = this.#canAddPropertyToEnemyAnimal(card, animal);
      })
    });
    this.myPlayer.animals.forEach(animal => {
      animal.canAddProperty = this.#canAddPropertyToMyAnimal(card, animal);
    });
  }
  cancelSelectedProperty(): void {
    this.selectedProperty = null;
    this.selectedPropertyIndex = 0;
    this.players.forEach(player => {
      player.animals.forEach(animal => {
        delete animal.canAddProperty;
      })
    });
    this.myPlayer.animals.forEach(animal => {
      delete animal.canAddProperty;
    });
  }
  switchCardType(card: HandCard): void {
    const type2 = card.type2 as CardTypes;
    card.type2 = card.type1;
    card.type1 = type2;
  }
  animalDropped(event: CdkDragDrop<Animal[]>) {
    console.log({event});
    if (event.previousContainer !== event.container) {
      const animal: Animal = {index: event.currentIndex, food: 0, properties: []};
      this.myPlayer.animals.splice(event.currentIndex, 0, animal);
      this.myPlayer.hand.splice(event.previousIndex, 1);
      this.sessionFacade.playAnimal(this.myPlayer, this.session);
    }
  }

  endPhase(): void {
    this.sessionFacade.endPhase(this.myPlayer, this.session);
  }

  sortMyAnimals(index: number, item: CdkDrag<Animal>): boolean {
    return true;
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap((map) => {
        const sessionId = map.get('sessionId') as string;
        this.sessionFacade.setCurrentSession(sessionId);
      })
    ).subscribe();

    this.auth.allAuth$.pipe(
      filter((s): s is User => !!s),
      tap(auth => this.user = auth),
      switchMap(() => this.sessionFacade.selectCurrentSession$),
      filter((s): s is EvolutionSessionEntity => !!s),
      tap((s) => {
        console.log({s});
        this.session = s;
        const players = JSON.parse(JSON.stringify(this.session.players));
        if (!this.session.started && !players[this.user.id]) {
          this.sessionFacade.joinSession(this.user, this.session.id as string);
        }
        this.myPlayer = players[this.user.id];
        delete players[this.user.id];
        this.players = Object.values(players);
      })
    ).subscribe();
  }

  #canAddPropertyToEnemyAnimal(card: HandCard, animal: Animal): boolean {
    return card.type1 === CardTypes.PARASITE && animal.properties.every(p => p !== CardTypes.PARASITE);
  }

  #canAddPropertyToMyAnimal(card: HandCard, animal: Animal): boolean {
    if (card.type1 === CardTypes.FAT_TISSUE) {
      return true;
    }

    if (card.type1 === CardTypes.PARASITE) {
      return false;
    }

    return animal.properties.every(p => p !== card.type1);
  }
}
