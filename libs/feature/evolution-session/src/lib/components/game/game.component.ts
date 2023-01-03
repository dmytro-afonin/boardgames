import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import {
  Animal,
  Attack,
  CardTypes,
  DoubleProperty,
  EvolutionSessionEntity,
  EvolutionSessionFacade,
  HandCard,
  Phase,
  Player, Turn,
  WEIGHT_PROPERTY_MAP
} from '@boardgames/data/evolution-session';
import { User } from '@boardgames/data/auth';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UI_PROPERTY_MAP } from '../../ui-player';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'feature-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('properties', [
      state('in', style({transform: 'translateX(0) translateY(0) scale(1)'})),
      transition('void => *', [
        animate('.6s ease-in' , keyframes([
          style({opacity:0 , transform:'translateY(-100%) scale(1)', border: "2px solid yellow", offset: 0}),
          style({opacity:1 , transform:'translateY(0) scale(1.3)', offset: 0.5}),
          style({opacity:1 , transform:'translateY(0) scale(1)', border: "none", offset: 1}),
        ]))
      ]),
      transition('* => void', [
        animate('.6s ease-in', keyframes([
          style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
          style({ opacity: 0, transform: 'translateY(-100%)', offset: 1 }),
        ]))
      ])
    ])
  ]
})
export class GameComponent implements OnChanges {
  @Input() session!: EvolutionSessionEntity;
  @Input() user!: User;
  showLog = false;
  players: Player[] = [];
  myPlayer!: Player;
  selectedProperty!: CardTypes | null;
  selectedAnimalIndex!: number | null;
  foodSelected!: boolean;
  log: Turn[] = [];

  constructor(
    private readonly sessionFacade: EvolutionSessionFacade
  ) {
  }
  trackByPlayer(_i: number, p: Player): string {
    return p.id;
  }
  trackByAnimal(_i: number, a: Animal): number {
    return a.index;
  }
  trackByProperty(_i: number, a: CardTypes): CardTypes {
    return a;
  }
  trackByLog(_i: number, a: Turn): CardTypes {
    return a.time;
  }
  /** ------------------ USER ACTIONS ------------------ */

  sortAnimalsInHand(event: CdkDragDrop<HandCard[]>) {
    moveItemInArray(this.myPlayer.hand, event.previousIndex, event.currentIndex);
  }
  actionAnimal(animal: Animal): void {
    if (animal.canBeActioned) {
      this.resetAnimalsActions();

      if (this.session.phase === Phase.GROWING) {
        this.addPropertyToAnimal(animal);
      } else if (this.foodSelected) {
        this.giveFoodToAnimal(animal);
      } else if (this.selectedProperty) {
        this.playPropertyOnAnimal(animal, this.myPlayer);
      }
    }
  }

  selectActionProperty(event: MouseEvent, prop: CardTypes, animal: Animal): void {
    event.stopPropagation();
    this.resetAnimalsActions();

    if (this.session.attack?.pray.animal === animal.index) {
      this.#defence(animal, prop);
    } else {
      this.#useAnimalProperty(animal, prop);
    }
  }

  actionEnemyAnimal(animal: Animal, enemy: Player): void {
    if (animal.canBeActioned) {
      this.resetAnimalsActions();

      if (this.session.phase === Phase.GROWING) {
        this.addParasite(animal, enemy);
      } else if (this.selectedProperty) {
        this.playPropertyOnAnimal(animal, enemy);
      }
    }
  }

  endPhase(event: MouseEvent): void {
    event.stopPropagation();
    this.session.log.push({
      time: Date.now(),
      action: `${this.myPlayer.name} finished phase`
    });

    this.cancelSelectedProperty();
    this.sessionFacade.endPhase(this.myPlayer, this.session);
  }

  /** ------------------ GROWING --------------------  */

  addPropertyToAnimal(animal: Animal): void {
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
      this.myPlayer.hand.splice(this.selectedAnimalIndex as number, 1);

      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} added ${UI_PROPERTY_MAP[this.selectedProperty].title} to his animal`
      });
      this.cancelSelectedProperty();
      this.sessionFacade.addPropertyToMyAnimal(this.myPlayer, this.session);
    }
  }
  preventPlayAnimalBetweenCommunications = (index: number): boolean => {
    return !this.myPlayer.properties.some(p => p.animal2 === index);
  }
  switchCardType(card: HandCard): void {
    const type2 = card.type2 as CardTypes;
    card.type2 = card.type1;
    card.type1 = type2;
  }
  animalDropped(event: CdkDragDrop<Animal[]>) {
    if (event.previousContainer !== event.container) {
      const animal: Animal = {
        index: event.currentIndex,
        food: 0,
        properties: [],
        requiredFood: 1,
        fat: 0,
        piracyUsed: false,
        attacked: false
      };
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
      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} added new animal`
      });
      this.sessionFacade.playAnimal(this.myPlayer, this.session);
    }
  }
  addParasite(animal: Animal, enemy: Player): void {
    if (this.selectedProperty) {
      animal.requiredFood += WEIGHT_PROPERTY_MAP[this.selectedProperty];
      animal.properties.unshift(this.selectedProperty);
      this.myPlayer.hand.splice(this.selectedAnimalIndex as number, 1);
      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} added parasite to ${enemy.name} animal`
      });
      this.cancelSelectedProperty();
      this.sessionFacade.addPropertyToEnemyAnimal(this.myPlayer, this.session, enemy);
    }
  }

  selectProperty(card: HandCard, index: number): void {
    if (this.session.currentPlayer !== this.myPlayer.id) {
      return;
    }
    this.selectedProperty = card.type1;
    this.selectedAnimalIndex = index;

    this.players.forEach(player => {
      player.animals.forEach(animal => {
        animal.canBeActioned = this.#canAddPropertyToEnemyAnimal(card, animal);
      })
    });
    this.myPlayer.animals.forEach(animal => {
      animal.canBeActioned = this.#canAddPropertyToMyAnimal(card, animal);
    });
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

  /** ------------------ FOOD ACTIONS ------------------ */

  selectFood(): void {
    this.foodSelected = !this.foodSelected;
    this.cancelSelectedProperty();

    this.myPlayer.animals.forEach(a => {
      if (this.canEat(a)) {
        a.canBeActioned = this.foodSelected;
      }
    });
  }

  giveFoodToAnimal(animal: Animal): void {
    this.handleFeedAnimal(animal);
    this.session.eat--;
    this.session.log.push({
      time: Date.now(),
      action: `${this.myPlayer.name} took 1 food`
    });
    this.handleCommunications(animal,  this.myPlayer,[CardTypes.COMMUNICATION, CardTypes.COOPERATION]);
    this.foodSelected = false;
    this.sessionFacade.feedAnimal(this.myPlayer, this.session);
  }

  /** ------------------ USE OWN ABILITIES ------------------ */
  #useAnimalProperty(animal: Animal, prop: CardTypes): void {
    this.selectedProperty = prop;
    this.selectedAnimalIndex = animal.index;

    switch (prop) {
      case CardTypes.FAT_TISSUE:
        return this.useFatTissue(animal);
      case CardTypes.GRAZING:
        return this.destroyFood();
      case CardTypes.HIBERNATION_ABILITY:
        return this.useHibernation(animal);
      case CardTypes.PIRACY:
        return this.createPiracyTargets(animal);
      case CardTypes.CARNIVOROUS:
        return this.createCarnivorousTargets(animal);
      default:
        return this.cancelSelectedProperty();
    }
  }

  useFatTissue(animal: Animal): void {
    if ((animal.food < animal.requiredFood) && animal.fat) {
      animal.food++;
      animal.fat--;
      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} used fat to feed animal`
      });
      this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
    }
    this.cancelSelectedProperty();
  }

  destroyFood(): void {
    if (this.session.eat) {
      this.session.eat--;
      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} destroyed 1 food`
      });
      this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
    }
    this.cancelSelectedProperty();
  }

  useHibernation(animal: Animal): void {
    if (!animal.hibernationCooldown && !animal.hibernation) {
      animal.hibernation = true;
      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} activated hibernation`
      });
      this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
    }
    this.cancelSelectedProperty();
  }

  createPiracyTargets(animal: Animal): void {
    if (!this.canEat(animal) || animal.piracyUsed) {
      this.cancelSelectedProperty();
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

  createCarnivorousTargets(animal: Animal): void {
    if (!this.canEat(animal) || animal.attacked) {
      this.cancelSelectedProperty();
      return;
    }

    this.foodSelected = false;

    this.myPlayer.animals.forEach(a => {
      a.canBeActioned = this.canAttack(animal, a, this.myPlayer, this.myPlayer);
    });

    this.players.forEach(p => {
      p.animals.forEach(a => {
        a.canBeActioned = this.canAttack(animal, a, p, this.myPlayer);
      })
    });
  }

  /** ------------------ APPLY ABILITIES TO OTHER ANIMALS  ------------------*/

  playPropertyOnAnimal(animal: Animal, player: Player): void {
    switch (this.selectedProperty) {
      case CardTypes.PIRACY: {
        this.stealFood(animal, player);
        break;
      }
      case CardTypes.CARNIVOROUS:
        this.attack(animal, player);
        break;
      case CardTypes.MIMICRY:
        this.useMimicry(animal);
    }
    this.cancelSelectedProperty();
  }

  stealFood(animal: Animal, player: Player): void {
    animal.food--;
    const pirate: Animal = this.myPlayer.animals[this.selectedAnimalIndex as number];
    this.handleFeedAnimal(pirate);
    pirate.piracyUsed = true;
    this.session.log.push({
      time: Date.now(),
      action: `${this.myPlayer.name} stole 1 food from ${player.name}`
    });
    this.handleCommunications(pirate, this.myPlayer,[CardTypes.COOPERATION]);
    this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
  }

  attack(animal: Animal, player: Player): void {
    const carnivorous = this.myPlayer.animals[this.selectedAnimalIndex as number];
    if (this.#animalCanDefend(animal, player, carnivorous)) {
      this.session.attack = {
        carnivorous: {
          player: this.myPlayer.id,
          animal: this.selectedAnimalIndex as number
        },
        pray: {
          player: player.id,
          animal: animal.index
        }
      };

      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} attack on ${player.name}`
      });
      this.sessionFacade.createAttack(this.session);
    } else {
      this.eatAnimal(carnivorous, animal, player, this.myPlayer);
      this.sessionFacade.updateSessionFood(this.myPlayer, this.session);
    }
  }

  useMimicry(animal: Animal): void {
    if (this.session.attack && animal.index !== this.selectedAnimalIndex) {
      this.selectedAnimalIndex = animal.index;
      const attacker = this.session.players[this.session.attack.carnivorous.player];
      const carnivorous = attacker.animals[this.session.attack.carnivorous.animal];
      if (this.#animalCanDefend(animal, this.myPlayer, carnivorous)) {
        this.session.attack.pray.animal = animal.index;
        this.session.log.push({
          time: Date.now(),
          action: `${this.myPlayer.name} use mimicry to change attack`
        });
      } else {
        this.eatAnimal(carnivorous, animal, this.myPlayer, attacker);
        this.sessionFacade.respondAttack(this.myPlayer, this.session);
      }
      this.cancelSelectedProperty();
    }
  }

  /** ------------------ DEFENCE ------------------ */
  #defence(animal: Animal, prop: CardTypes): void {
    if (!this.session.attack) {
      return;
    }

    if (this.selectedProperty === CardTypes.TAIL_LOSS) {
      this.useTailLoss(animal, prop);
      this.cancelSelectedProperty();
      return;
    }

    switch (prop) {
      case CardTypes.TAIL_LOSS:
        return this.selectTailLoss(animal, prop);
      case CardTypes.RUNNING:
        return this.tryToRun(animal);
      case CardTypes.MIMICRY:
        return this.createMimicryTargets(animal, prop);
    }
  }

  tryToRun(animal: Animal): void {

    this.session.log.push({
      time: Date.now(),
      action: `${this.myPlayer.name} is trying to RUN`
    });
    const attack: Attack = this.session.attack as Attack;
    const attacker: Player = this.session.players[attack.carnivorous.player];
    const carnivorous = attacker.animals[attack.carnivorous.animal];
    carnivorous.attacked = true;

    if (this.sessionFacade.getDiceNumber() < 4) {
      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} RUN failed`
      });
      this.eatAnimal(carnivorous, animal, this.myPlayer, attacker);
    } else {
      this.session.log.push({
        time: Date.now(),
        action: `${this.myPlayer.name} RUN success!`
      });
    }

    this.sessionFacade.respondAttack(this.myPlayer, this.session);
  }

  selectTailLoss(animal: Animal, prop: CardTypes): void {
    this.selectedProperty = prop;
    this.selectedAnimalIndex = animal.index;
  }

  useTailLoss(animal: Animal, prop: CardTypes): void {
    if (!this.session.attack) {
      return;
    }

    this.session.log.push({
      time: Date.now(),
      action: `${this.myPlayer.name} uses tail loss to drop ${UI_PROPERTY_MAP[prop].title}`
    });

    const propIndex = animal.properties.findIndex(a => a === prop);
    animal.properties.splice(propIndex, 1);
    switch (prop) {
      case CardTypes.FAT_TISSUE:
        if (animal.fat > animal.properties.filter(p => p === CardTypes.FAT_TISSUE).length) {
          animal.fat--;
        }
        break;
      case CardTypes.HIBERNATION_ABILITY:
        if (animal.hibernation) {
          animal.hibernation = false;
        }
        break;
      case CardTypes.PARASITE: {
        animal.requiredFood -= 2;
        if (animal.food > animal.requiredFood) {
          animal.food = animal.requiredFood;
        }
      }
        break;
    }

    const attacker = this.session.players[this.session.attack.carnivorous.player];
    const carnivorous = attacker.animals[this.session.attack.carnivorous.animal];
    carnivorous.attacked = true;
    this.handleFeedAnimal(carnivorous);
    this.handleCommunications(carnivorous, attacker, [CardTypes.COOPERATION]);
    this.sessionFacade.respondAttack(this.myPlayer, this.session);
  }

  createMimicryTargets(animal: Animal, prop: CardTypes): void {
    this.selectedProperty = prop;
    this.selectedAnimalIndex = animal.index;
    const attack: Attack = this.session.attack as Attack;
    const attacker: Player = this.session.players[attack.carnivorous.player];
    const carnivorous = attacker.animals[attack.carnivorous.animal];
    this.myPlayer.animals.forEach(a => {
      a.canBeActioned = this.canBeMimicryTarget(this.myPlayer, animal, carnivorous, a, attacker);
    });
  }

  /** ------------------ BEFORE EAT ------------------ */

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

  canAttack(carnivorous: Animal, pray: Animal, player: Player, attacker: Player): boolean {
    if (carnivorous.index === pray.index && player.id === attacker.id) {
      return false;
    }

    const cHasSwimming = carnivorous.properties.includes(CardTypes.SWIMMING);
    const pHasSwimming = pray.properties.includes(CardTypes.SWIMMING);
    if (cHasSwimming !== pHasSwimming) {
      return false;
    }

    const cIsBig = carnivorous.properties.includes(CardTypes.HIGH_BODY_WEIGHT);
    const pIsBig = pray.properties.includes(CardTypes.HIGH_BODY_WEIGHT);
    if (pIsBig && !cIsBig) {
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

  #animalCanDefend(animal: Animal, player: Player, carnivorous: Animal): boolean {
    const hasRunning = animal.properties.includes(CardTypes.RUNNING);
    const hasTailLoss = animal.properties.includes(CardTypes.TAIL_LOSS);

    const hasMimicry = animal.properties.includes(CardTypes.MIMICRY);
    const hasMimicryTargets = this.getMimicryTarget(player, animal, carnivorous);
    const mimicryWorks = !!(hasMimicry && hasMimicryTargets);
    return hasRunning || mimicryWorks || hasTailLoss;
  }

  getMimicryTarget(player: Player, animal: Animal, carnivorous: Animal): Animal | undefined {
    return player.animals.find(a => {
      return this.canBeMimicryTarget(player, animal, carnivorous, a, this.myPlayer);
    });
  }

  canBeMimicryTarget(player: Player, current: Animal, carnivorous: Animal, animal: Animal, attacker: Player): boolean {
    const notCurrent = animal.index !== current.index;
    const canAttack = this.canAttack(carnivorous, animal, player, attacker);
    const notMimicry = !animal.properties.includes(CardTypes.MIMICRY);
    return notCurrent && canAttack && notMimicry;
  }


  /** ------------------ EAT ------------------ */
  eatAnimal(carnivorous: Animal, animal: Animal, player: Player, attaker: Player): void {
    this.handleFeedAnimal(carnivorous);
    if (this.canEat(carnivorous)) {
      this.handleFeedAnimal(carnivorous);
    }
    this.session.log.push({
      time: Date.now(),
      action: `${attaker.name} ate ${player.name}'s animal`
    });
    if (animal.properties.includes(CardTypes.POISONOUS)) {
      carnivorous.poisoned = true;
    }
    carnivorous.attacked = true;
    player.animals.splice(animal.index, 1);
    player.animals.forEach((a, i) => a.index = i);
    player.properties = player.properties.filter(p => p.animal1 !== animal.index && p.animal2 !== animal.index);
    player.properties.forEach(p => {
      if (p.animal1 > animal.index) {
        p.animal1--;
        p.animal2--;
      }
    });

    this.#feedScavenger(attaker);

    this.handleCommunications(carnivorous, this.myPlayer,[CardTypes.COOPERATION]);
  }

  /** ------------------ AFTER EAT ------------------ */

  #feedScavenger(attacker: Player): void {
    const players = [...this.players];
    while(players[0].id !== attacker.id) {
      players.push(players.shift() as Player);
    }
    for (const player of players) {
      const scavenger = this.session.players[player.id].animals.find(a => a.properties.includes(CardTypes.SCAVENGER) && this.canEat(a));
      if (scavenger) {
        this.handleFeedAnimal(scavenger);
        this.session.log.push({
          time: Date.now(),
          action: `${player.name}'s scavenger received 1 food`
        });
        this.handleCommunications(scavenger, player, [CardTypes.COOPERATION]);
        return;
      }
    }
  }

  handleCommunications(animal: Animal, player: Player, types: CardTypes[]): void {
    const props = [...player.properties];

    const directions = [{from: 'animal1', to: 'animal2'},{from: 'animal2', to: 'animal1'}];

    directions.forEach(d => {
      let prop = props.find(p => p[d.from as keyof DoubleProperty] === animal.index && types.includes(p.property));
      while (prop) {
        const animal = player.animals[prop[d.to as keyof DoubleProperty]];
        if (!this.applyCommunication(animal, prop.property)) {
          break;
        }
        this.session.log.push({
          time: Date.now(),
          action: `${player.name}'s animal received 1 food by ${UI_PROPERTY_MAP[prop.property].title}`
        });
        prop = props.find(p => p[d.from as keyof DoubleProperty] === animal.index);
      }
    });
  }

  applyCommunication(animal: Animal, prop: CardTypes): boolean {
    const isCommunication = prop === CardTypes.COMMUNICATION;
    if (isCommunication && !this.session.eat) {
      return false;
    }

    if (this.canEat(animal)) {
      this.handleFeedAnimal(animal);
      if (isCommunication) {
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

  /** ------------------ CLEANUP ------------------ */
  cancelSelectedProperty(): void {
    this.selectedProperty = null;
    this.selectedAnimalIndex = null;
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

  /** ------------------ LIFECYCLE ------------------ */
  ngOnChanges(changes: SimpleChanges): void {
    const { previousValue, currentValue } = changes['session'];
    if (previousValue) {
      if (currentValue.attack) {
        const audio = new Audio('assets/attack.mp3');
        audio.play();
      } else if (previousValue.phase !== currentValue.phase) {
        const audio = new Audio('assets/new_phase.mp3');
        audio.play();
      } else if (previousValue.currentPlayer !== currentValue.currentPlayer) {
        const audio = new Audio('assets/next_turn.mp3');
        audio.play();
      }
    }
    this.log = [...this.session.log].reverse();
    const players = this.session.players;
    this.myPlayer = players[this.user.id];
    this.players = Object.values(players).sort((a,b) => a.order > b.order ? 1 : -1);
  }

}
