import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './container/container.component';
import { RouterModule, Routes } from '@angular/router';
import { DataSessionModule } from '@boardgames/data/session';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), DataSessionModule],
  declarations: [ContainerComponent],
})
export class FeatureSessionListModule {}
