import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [CommonModule, MatListModule, MatCardModule],
  declarations: [LeaderboardComponent],
  exports: [LeaderboardComponent],
})
export class UiLeaderboardModule {}
