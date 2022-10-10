import {
  ChangeDetectionStrategy,
  Component, Input, OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { SessionEntity, SessionUser } from '@boardgames/data/session';
import { ThemePalette } from '@angular/material/core';

interface DisplayedUser extends SessionUser {
  color?: ThemePalette;
  statusIcon: string;
}

@Component({
  selector: 'ui-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent implements OnChanges {
  @Input() session!: SessionEntity;
  displayedUsers: DisplayedUser[] = []

  ngOnChanges(): void {
    this.displayedUsers = Object.values(this.session.users).map(u => {
      let color: ThemePalette;
      let statusIcon;
      if (u.id === this.session.currentUserId) {
        color = 'warn';
      } else if (u.id === this.session.ownerId) {
        color = 'primary';
      }
      if (u.selectedCards.length === this.session.currentQuestion.options) {
        statusIcon = 'done';
      } else {
        statusIcon = 'hourglass_empty';
      }
      return {
        ...u,
        color,
        statusIcon
      }
    })
  }
}
