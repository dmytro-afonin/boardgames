import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  declarations: [LeaderboardComponent],
  exports: [LeaderboardComponent],
})
export class UiLeaderboardModule {}
