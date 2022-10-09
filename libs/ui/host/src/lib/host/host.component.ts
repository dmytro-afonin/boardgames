import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { SessionEntity, SessionUser } from '@boardgames/data/session';
import { Subject } from 'rxjs';

@Component({
  selector: 'ui-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HostComponent implements OnChanges {
  @Input() session!: SessionEntity;
  @Input() user!: SessionUser;
  @Output() winnerSelected = new Subject<string>();
  displayedUsers: SessionUser[] = [];
  isAnswersReady = false;

  ngOnChanges(): void {
    this.displayedUsers = Object.values(this.session.users).filter(u => u.id !== this.session.currentUserId);
    this.isAnswersReady = this.displayedUsers.every(u => u.selectedCards.length === this.session.currentQuestion.options);
  }

  selectOption(userId: string): void {
    this.winnerSelected.next(userId);
  }
}
