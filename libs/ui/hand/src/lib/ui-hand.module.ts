import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandComponent } from './hand/hand.component';
import { MatChipsModule } from '@angular/material/chips';
import { UiCardModule } from '@boardgames/ui/card';

@NgModule({
  imports: [CommonModule, MatChipsModule, UiCardModule],
  declarations: [HandComponent],
  exports: [HandComponent],
})
export class UiHandModule {}
