import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostComponent } from './host/host.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [CommonModule, MatCardModule, MatListModule],
  declarations: [HostComponent],
  exports: [HostComponent],
})
export class UiHostModule {}
