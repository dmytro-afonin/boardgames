import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostComponent } from './host/host.component';
import { UiCardModule } from '@boardgames/ui/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [CommonModule, MatChipsModule, UiCardModule, MatCardModule],
  declarations: [HostComponent],
  exports: [HostComponent],
})
export class UiHostModule {}
