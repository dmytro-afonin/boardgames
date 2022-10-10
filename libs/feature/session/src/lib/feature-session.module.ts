import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionComponent } from './session/session.component';
import { RouterModule, Routes } from '@angular/router';
import { UiLeaderboardModule } from '@boardgames/ui/leaderboard';
import { UiHandModule } from '@boardgames/ui/hand';
import { UiHostModule } from '@boardgames/ui/host';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {path: '', component: SessionComponent}
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes),
    UiLeaderboardModule, UiHandModule, UiHostModule, MatButtonModule,
    MatDialogModule,
    MatCardModule],
  declarations: [SessionComponent],
})
export class FeatureSessionModule {}
