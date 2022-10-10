import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostComponent } from './host/host.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [CommonModule, MatCardModule, MatChipsModule],
  declarations: [HostComponent],
  exports: [HostComponent],
})
export class UiHostModule {}
