import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { EvolutionSessionEntity, Player } from '@boardgames/data/evolution-session';

@Component({
  selector: 'feature-score',
  templateUrl: './score.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScoreComponent implements OnChanges {
  @Input() session!: EvolutionSessionEntity;
  players: Player[] = [];

  ngOnChanges(): void {
    this.players = Object.values(this.session.players).sort((a,b) => a.score < b.score ? 1 : -1);
  }
}
