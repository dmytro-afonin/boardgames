import {
  ChangeDetectionStrategy,
  Component, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { SessionEntity, SessionFacade } from '@boardgames/data/session';
import { filter, tap } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthFacade, User } from '@boardgames/data/auth';
import {Clipboard} from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'feature-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent implements OnInit {
  currentUser!: User;
  formGroup = this.fb.group({
    session: ['', [Validators.required, Validators.minLength(3)]]
  });
  sessions$ = this.sessionsFacade.selectSessionList$;

  constructor(
    private readonly sessionsFacade: SessionFacade,
    private readonly fb: FormBuilder,
    private readonly authFacade: AuthFacade,
    private readonly _snackBar: MatSnackBar,
    private clipboard: Clipboard
  ) {}

  createSession(): void {
    const value = this.formGroup.getRawValue();
    this.sessionsFacade.createSession(String(value.session), this.currentUser);
    this.formGroup.reset();
  }

  copyLink(session: SessionEntity): void {
    const link = `${window.location.origin}/session/${session.id}`;
    this.clipboard.copy(link);

    this._snackBar.open(`${link} copied to clipboard`, 'Share in Telegram', {duration: 5000})
      .onAction()
      .pipe(tap(() => {
        window.open(`https://t.me/share/url?url=${link}&text=Join Our Party Game!`, '_blank');
      }))
      .subscribe();
  }

  ngOnInit(): void {
    this.authFacade.allAuth$.pipe(
      filter((u): u is User => !!u),
      tap((u) => {
        this.currentUser = u;
      })
    ).subscribe();
  }
}
