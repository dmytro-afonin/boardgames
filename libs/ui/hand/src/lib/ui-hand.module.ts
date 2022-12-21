import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandComponent } from './hand/hand.component';
import { UiCardModule } from '@boardgames/ui/card';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  imports: [CommonModule, MatChipsModule, UiCardModule],
  declarations: [HandComponent],
  exports: [HandComponent],
})
export class UiHandModule {}
