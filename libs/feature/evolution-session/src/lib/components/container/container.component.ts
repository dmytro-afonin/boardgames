import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Animal,
  CardTypes,
  DoubleProperty,
  EvolutionSessionEntity,
  EvolutionSessionFacade,
  HandCard,
  Phase,
  Player,
  WEIGHT_PROPERTY_MAP
} from '@boardgames/data/evolution-session';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { AuthFacade, User } from '@boardgames/data/auth';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'feature-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ContainerComponent implements OnInit {
  session!: EvolutionSessionEntity;
  user!: User;
  players!: Player[];
  myPlayer!: Player;
  selectedProperty!: CardTypes | null;
  selectedPropertyIndex!: number | null;
  foodSelected!: boolean;

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

  actionAnimal(animal: Animal): void {
    if (animal.canBeActioned) {
      if (this.session.phase === Phase.GROWING) {
        this.actionGrowingPhase(animal);
      } else {
        this.actionFoodPhase(animal);
      }
    }
  }

  selectActionProperty(event: MouseEvent, prop: CardTypes, animal: Animal): void {
    event.stopPropagation();

    this.selectedProperty = prop;
    this.selectedPropertyIndex = animal.index;

    console.log(this.selectedProperty);
    console.log(this.selectedPropertyIndex);

    switch (prop) {
      case CardTypes.GRAZING:
        return this.handleGrazing();
      case CardTypes.HIBERNATION_ABILITY:
        return this.handleHibernation(animal);
      case CardTypes.PIRACY:
        return this.handlePiracy(animal);
      case CardTypes.CARNIVOROUS:
        return this.handleCarnivorous(animal);
    }
  }

  handleCarnivorous(animal: Animal): void {
    if (!this.canEat(animal)) {
      return;
    }

    this.foodSelected = false;

    this.myPlayer.animals.forEach(a => {
      a.canBeActioned = this.canAttack(animal, a, this.myPlayer);
    });

    this.players.forEach(p => {
      p.animals.forEach(a => {
        a.canBeActioned = this.canAttack(animal, a, p);
      })
    });
  }
  canAttack(carnivorous: Animal, pray: Animal, player: Player): boolean {
    if (carnivorous.index === pray.index && player.id === this.myPlayer.id) {
      return false;
    }

    const cHasSwimming = carnivorous.properties.includes(CardTypes.SWIMMING);
    const pHasSwimming = pray.properties.includes(CardTypes.SWIMMING);
    if (cHasSwimming !== pHasSwimming) {
      return false;
    }

    const cIsBig = carnivorous.properties.includes(CardTypes.HIGH_BODY_WEIGHT);
    const pIsBig = pray.properties.includes(CardTypes.HIGH_BODY_WEIGHT);
    if (cIsBig !== pIsBig) {
      return false;
    }

    const pHasCamo = pray.properties.includes(CardTypes.CAMOUFLAGE);
    const cHasSharpVision = carnivorous.properties.includes(CardTypes.SHARP_VISION);
    if (pHasCamo && !cHasSharpVision) {
      return false;
    }

    const pHasBorrowing = pray.properties.includes(CardTypes.BURROWING);
    if (pHasBorrowing && pray.food >= pray.requiredFood) {
      return false;
    }

    const protectedBySymbiot = player.properties.find(p => p.property === CardTypes.SYMBIOSYS && p.animal2 === pray.index);
    return !protectedBySymbiot;
  }

  handlePiracy(animal: Animal): void {
    if (!this.canEat(animal)) {
      return;
    }
    this.myPlayer.animals.forEach(a => {
      if (a.food && this.canEat(a)) {
        a.canBeActioned = true;
      }
    });
    this.players.forEach(p => {
      p.animals.forEach(a => {
        if (a.food && this.canEat(a)) {
          a.canBeActioned = true;
        }
      })
    });
  }

  handleHibernation(animal: Animal): void {
    console.log({animal});
    animal.hibernation = false;
    if (!animal.hibernationCooldown && !animal.hibernation) {
      animal.hibernation = true;
      this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
    }
  }

  handleGrazing(): void {
    if (this.session.eat) {
      this.session.eat--;
      this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
    }
  }

  actionFoodPhase(animal: Animal): void {
    if (this.foodSelected) {
      this.foodSelectedAntionFoodPhase(animal);
    } else if (this.selectedProperty) {
      this.propertySelectedActionFoodPhase(animal, this.myPlayer);
    }
  }
  propertySelectedActionFoodPhase(animal: Animal, player: Player): void {
    switch (this.selectedProperty) {
      case CardTypes.PIRACY:
        animal.food--;
        this.handleFeedAnimal(this.myPlayer.animals[this.selectedPropertyIndex as number]);
        this.cancelSelectedProperty();
        return this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
      case CardTypes.CARNIVOROUS:
        return this.handleCarnivorousAttack(animal, player);
    }
  }

  handleCarnivorousAttack(animal: Animal, player: Player): void {
    const hasRunning = animal.properties.includes(CardTypes.RUNNING);
    const hasMimicry = animal.properties.includes(CardTypes.MIMICRY);
    const hasTailLoss = animal.properties.includes(CardTypes.TAIL_LOSS);
    const hasPoison = animal.properties.includes(CardTypes.POISONOUS);
    const carnivorous = this.myPlayer.animals[this.selectedPropertyIndex as number];
    if (hasPoison) {
      carnivorous.poisoned = true;
    }

    if (hasRunning || hasMimicry || hasTailLoss) {
      player.attack = {
        carnivorous: this.selectedPropertyIndex as number,
        player: player.id,
        animalIndex: animal.index
      }
      this.sessionFacade.createAttack(player, this.session);
    } else {
      this.handleFeedAnimal(carnivorous);
      if (this.canEat(carnivorous)) {
        this.handleFeedAnimal(carnivorous);
      }
      player.animals.splice(animal.index, 1);
      this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
    }
  }

  foodSelectedAntionFoodPhase(animal: Animal): void {
    this.handleFeedAnimal(animal);
    this.session.eat--;

    const props = [...this.myPlayer.properties];

    const directions = [{from: 'animal1', to: 'animal2'},{from: 'animal2', to: 'animal1'}];

    directions.forEach(d => {
      let prop = props.find(p => p[d.from as keyof DoubleProperty] === animal.index && p.property !== CardTypes.SYMBIOSYS);
      while (prop) {
        const animal = this.myPlayer.animals[prop[d.to as keyof DoubleProperty]];
        if (!this.feedAnimal(animal, prop.property)) {
          break;
        }
        prop = props.find(p => p[d.from as keyof DoubleProperty] === animal.index);
      }
    });
    this.foodSelected = false;
    this.resetAnimalsActions();
    this.sessionFacade.feedAnimal(this.myPlayer, this.session);
  }

  feedAnimal(animal: Animal, prop: CardTypes): boolean {
    const isCooperation = prop === CardTypes.COOPERATION;
    if (isCooperation && !this.session.eat) {
      return false;
    }

    if (this.canEat(animal)) {
      this.handleFeedAnimal(animal);
      if (isCooperation) {
        this.session.eat--;
      }
      return true;
    }
    return false;
  }

  handleFeedAnimal(animal: Animal): void {
    if (animal.food < animal.requiredFood) {
      animal.food++;
    } else {
      animal.fat++;
    }
  }

  actionGrowingPhase(animal: Animal): void {
    if (this.selectedProperty) {
      if ([CardTypes.COMMUNICATION, CardTypes.COOPERATION, CardTypes.SYMBIOSYS].includes(this.selectedProperty)) {
        this.myPlayer.properties.push({
          animal1: animal.index,
          animal2: animal.index + 1,
          property: this.selectedProperty
        })
      } else {
        animal.requiredFood += WEIGHT_PROPERTY_MAP[this.selectedProperty];
        animal.properties.unshift(this.selectedProperty);
      }
      this.myPlayer.hand.splice(this.selectedPropertyIndex as number, 1);

      this.cancelSelectedProperty();
      this.sessionFacade.addPropertyToMyAnimal(this.myPlayer, this.session);
    }
  }

  actionEnemyAnimal(animal: Animal, enemy: Player): void {
    if (animal.canBeActioned) {
      if (this.session.phase === Phase.GROWING) {
        this.actionEnemyGrowingPhase(animal, enemy);
      } else {
        if (this.selectedProperty) {
          this.propertySelectedActionFoodPhase(animal, enemy);
        }
      }
    }
  }
  actionEnemyGrowingPhase(animal: Animal, enemy: Player): void {
    if (this.selectedProperty) {
      animal.requiredFood += WEIGHT_PROPERTY_MAP[this.selectedProperty];
      animal.properties.unshift(this.selectedProperty);
      this.myPlayer.hand.splice(this.selectedPropertyIndex as number, 1);

      this.cancelSelectedProperty();
      this.sessionFacade.addPropertyToEnemyAnimal(this.myPlayer, this.session, enemy);
    }
  }

  selectFood(): void {
    this.foodSelected = !this.foodSelected;
    this.cancelSelectedProperty();

    this.myPlayer.animals.forEach(a => {
      if (this.canEat(a)) {
        a.canBeActioned = this.foodSelected;
      }
    });
  }

  canEat(a: Animal): boolean {
    const symbiosys = this.myPlayer.properties.find(p => p.property === CardTypes.SYMBIOSYS && p.animal2 === a.index);
    if (symbiosys) {
      const parent = this.myPlayer.animals[symbiosys.animal1];
      const isParentFed = parent.food >= parent.requiredFood;
      if (!isParentFed) {
        return false;
      }
    }
    const possibleFat = a.properties.filter(p => p === CardTypes.FAT_TISSUE).length;
    return a.food < a.requiredFood || a.fat < possibleFat;
  }

  selectProperty(card: HandCard, index: number): void {
    if (this.session.currentPlayer !== this.myPlayer.id) {
      return;
    }
    this.selectedProperty = card.type1;
    this.selectedPropertyIndex = index;

    console.log(this.selectedProperty);
    console.log(this.selectedPropertyIndex);

    this.players.forEach(player => {
      player.animals.forEach(animal => {
        animal.canBeActioned = this.#canAddPropertyToEnemyAnimal(card, animal);
      })
    });
    this.myPlayer.animals.forEach(animal => {
      animal.canBeActioned = this.#canAddPropertyToMyAnimal(card, animal);
    });
  }
  cancelSelectedProperty(): void {
    this.selectedProperty = null;
    this.selectedPropertyIndex = null;
    this.resetAnimalsActions();
  }

  resetAnimalsActions(): void {
    this.players.forEach(player => {
      player.animals.forEach(animal => {
        delete animal.canBeActioned;
      })
    });
    this.myPlayer.animals.forEach(animal => {
      delete animal.canBeActioned;
    });
  }

  switchCardType(card: HandCard): void {
    const type2 = card.type2 as CardTypes;
    card.type2 = card.type1;
    card.type1 = type2;
  }
  animalDropped(event: CdkDragDrop<Animal[]>) {
    if (event.previousContainer !== event.container) {
      const animal: Animal = {index: event.currentIndex, food: 0, properties: [], requiredFood: 1, fat: 0};
      this.myPlayer.properties.forEach(p => {
        if (p.animal1 >= event.currentIndex) {
          p.animal1++;
          p.animal2++;
        }
      });
      this.myPlayer.animals.forEach(a => {
        if (a.index >= event.currentIndex) {
          a.index++;
        }
      });
      this.myPlayer.animals.splice(event.currentIndex, 0, animal);
      this.myPlayer.hand.splice(event.previousIndex, 1);
      this.sessionFacade.playAnimal(this.myPlayer, this.session);
    }
  }

  endPhase(): void {
    this.sessionFacade.endPhase(this.myPlayer, this.session);
  }

  sortMyAnimals = (index: number): boolean => {
    return !this.myPlayer.properties.some(p => p.animal2 === index);
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
        this.session = JSON.parse(JSON.stringify(s));
        const players = this.session.players;
        if (!this.session.started && !players[this.user.id]) {
          this.sessionFacade.joinSession(this.user, this.session.id as string);
        }
        this.myPlayer = players[this.user.id];
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

    if (card.type1 === CardTypes.CARNIVOROUS && animal.properties.find(p => p === CardTypes.SCAVENGER)) {
      return false;
    }

    if (card.type1 === CardTypes.SCAVENGER && animal.properties.find(p => p === CardTypes.CARNIVOROUS)) {
      return false;
    }

    const hasSameProperty = animal.properties.find(p => p === card.type1);

    if ([CardTypes.COOPERATION, CardTypes.COMMUNICATION, CardTypes.SYMBIOSYS].includes(card.type1)) {
      const hasCardToCooperate = this.myPlayer.animals[animal.index + 1];
      return hasCardToCooperate && !hasSameProperty;
    }

    return !hasSameProperty;
  }
}
