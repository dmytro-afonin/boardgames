import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { RouterModule, Routes } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkOption } from '@angular/cdk/listbox';
import { UiCardModule } from '@boardgames/ui/card';
import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { AnimalComponent } from './components/animal/animal.component';
import { MatChipsModule } from '@angular/material/chips';
import { PropertyComponent } from './components/property/property.component';

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
    MatFormFieldModule,
    MatInputModule,
    CdkOption,
    UiCardModule,
    CdkDropList,
    CdkDrag,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    CdkDragHandle
  ],
  declarations: [ContainerComponent, AnimalComponent, PropertyComponent],
})
export class FeatureEvolutionSessionModule {}
