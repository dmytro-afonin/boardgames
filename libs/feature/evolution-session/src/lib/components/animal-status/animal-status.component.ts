import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import {
  Animal,
  EvolutionSessionEntity,
} from '@boardgames/data/evolution-session';

@Component({
  selector: 'feature-animal-status',
  templateUrl: './animal-status.component.html',
  styleUrls: ['./animal-status.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimalStatusComponent {
  @Input() session!: EvolutionSessionEntity;
  @Input() animal!: Animal;
}
