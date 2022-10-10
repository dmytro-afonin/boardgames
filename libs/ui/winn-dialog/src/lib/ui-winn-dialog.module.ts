import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  declarations: [DialogComponent],
  exports: [DialogComponent],
})
export class UiWinnDialogModule {}
