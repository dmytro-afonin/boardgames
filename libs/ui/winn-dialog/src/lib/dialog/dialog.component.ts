import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string },) {
  }
}
