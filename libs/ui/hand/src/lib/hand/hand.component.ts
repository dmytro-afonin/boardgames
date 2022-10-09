import {
  ChangeDetectionStrategy,
  Component, Input, Output,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { Question, SessionUser } from '@boardgames/data/session';

@Component({
  selector: 'ui-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandComponent {
  @Input() sessionUser!: SessionUser;
  @Input() question!: Question;
  @Output() optionSelected = new Subject<number>();
}
