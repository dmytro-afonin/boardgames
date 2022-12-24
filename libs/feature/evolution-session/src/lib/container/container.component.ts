import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Animal, CardTypes,
  EvolutionSessionEntity,
  EvolutionSessionFacade,
  HandCard,
  Player
} from '@boardgames/data/evolution-session';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { AuthFacade, User } from '@boardgames/data/auth';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSelectionListChange } from '@angular/material/list';
import { UI_PROPERTY_MAP } from '../ui-player';

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
  selectedProperty!: string;

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
  selectProperty(e: MatSelectionListChange): void {
    console.log(e);
    this.selectedProperty = e.options[0].value;
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
}
