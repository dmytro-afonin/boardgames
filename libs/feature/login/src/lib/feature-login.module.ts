import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataAuthModule } from '@boardgames/data/auth';
import { LoginContainerComponent } from './login-container/login-container.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    DataAuthModule,
    RouterModule.forChild([
    {
      path: '',
      component: LoginContainerComponent
    }
  ]), MatButtonModule],
  declarations: [LoginContainerComponent],
})
export class FeatureLoginModule {}
