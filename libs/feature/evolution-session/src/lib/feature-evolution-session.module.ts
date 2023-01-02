import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CdkOption } from '@angular/cdk/listbox';
import { UiCardModule } from '@boardgames/ui/card';
import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AnimalComponent } from './components/animal/animal.component';
import { MatChipsModule } from '@angular/material/chips';
import { PropertyComponent } from './components/property/property.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LobbyComponent } from './components/lobby/lobby.component';
import { ScoreComponent } from './components/score/score.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    CdkOption,
    UiCardModule,
    CdkDropList,
    CdkDrag,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    CdkDragHandle,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule
  ],
  declarations: [
    ContainerComponent,
    AnimalComponent,
    PropertyComponent,
    LobbyComponent,
    ScoreComponent,
    GameComponent
  ],
})
export class FeatureEvolutionSessionModule {}
