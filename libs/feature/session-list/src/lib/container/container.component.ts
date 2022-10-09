import {
  ChangeDetectionStrategy,
  Component, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { SessionEntity, SessionFacade } from '@boardgames/data/session';
import { filter, tap } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthFacade, User } from '@boardgames/data/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Clipboard} from '@angular/cdk/clipboard';

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
    private readonly router: Router,
    private readonly _snackBar: MatSnackBar,
    private clipboard: Clipboard
  ) {}


  joinSession(session: SessionEntity): void {
    this.sessionsFacade.joinSession(session.id, this.currentUser);
    this.router.navigate(['session', session.id]);
  }

  createSession(): void {
    const value = this.formGroup.getRawValue();
    this.sessionsFacade.createSession(String(value.session), this.currentUser);
    this.formGroup.reset();
  }

  copyLink(session: SessionEntity): void {
    const link = `${window.location.origin}/session/${session.id}`;
    this.clipboard.copy(link);
    window.open(`https://t.me/share/url?url=${link}`, '_blank');
    this._snackBar.open(`${link} copied to clipboard`, 'Okay', {duration: 3000});
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
