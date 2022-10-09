import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HandComponent } from './hand/hand.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatCardModule],
  declarations: [HandComponent],
  exports: [HandComponent],
})
export class UiHandModule {}
