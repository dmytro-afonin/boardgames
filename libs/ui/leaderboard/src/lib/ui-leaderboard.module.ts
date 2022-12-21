import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatIconModule } from '@angular/material/icon';
import { UiCardModule } from '@boardgames/ui/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule, UiCardModule, MatCardModule],
  declarations: [LeaderboardComponent],
  exports: [LeaderboardComponent],
})
export class UiLeaderboardModule {}
