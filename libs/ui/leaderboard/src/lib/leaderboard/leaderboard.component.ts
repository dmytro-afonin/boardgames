import {
  ChangeDetectionStrategy,
  Component, Input,
  ViewEncapsulation
} from '@angular/core';
import { User } from '@boardgames/data/auth';
import { SessionUser } from '@boardgames/data/session';

@Component({
  selector: 'ui-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent {
  @Input() users: SessionUser[] = [];
}
