import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { EvolutionSessionEntity } from '@boardgames/data/evolution-session';

@Component({
  selector: 'feature-score',
  templateUrl: './score.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreComponent {
  @Input() session!: EvolutionSessionEntity;
  players = Object.values(this.session.players).sort((a,b) => a.score < b.score ? 1 : -1);
}
