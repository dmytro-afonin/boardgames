import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import {
  Animal,
  EvolutionSessionEntity, Player
} from '@boardgames/data/evolution-session';

@Component({
  selector: 'feature-animal-communications',
  templateUrl: './animal-communications.component.html',
  styleUrls: ['./animal-communications.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalCommunicationsComponent {
  @Input() player!: Player;
  @Input() animal!: Animal;
}
