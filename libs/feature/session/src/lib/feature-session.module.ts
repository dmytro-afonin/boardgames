import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { RouterModule, Routes } from '@angular/router';
import { UiLeaderboardModule } from '@boardgames/ui/leaderboard';
import { UiHandModule } from '@boardgames/ui/hand';
import { UiHostModule } from '@boardgames/ui/host';
import { UiCardModule } from '@boardgames/ui/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
  {path: '', component: SessionComponent}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UiLeaderboardModule,
    UiHandModule,
    UiHostModule,
    MatButtonModule,
    MatDialogModule,
    UiCardModule,
    MatCardModule
  ],
  declarations: [SessionComponent],
})
export class FeatureSessionModule {}
