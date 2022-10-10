import {
  ChangeDetectionStrategy,
  Component, OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, filter, Subscription, tap } from 'rxjs';
import { SessionEntity, SessionFacade, SessionUser } from '@boardgames/data/session';
import { AuthFacade, User } from '@boardgames/data/auth';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@boardgames/ui/winn-dialog';

@Component({
  selector: 'feature-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SessionComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  session!: SessionEntity | undefined;
  hand: string[] = [];
  user!: User;
  users: SessionUser[] = []
  sessionUser!: SessionUser;
  sessionId!: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sessionFacade: SessionFacade,
    private readonly auth: AuthFacade,
    private readonly dialog: MatDialog
  ) {}

  startSession(): void {
    this.sessionFacade.startSession(this.session as SessionEntity);
  }

  chooseCard(cardIndex: number): void {
    this.sessionFacade.chooseCard(cardIndex, this.sessionUser, (this.session as SessionEntity).id);
  }

  selectWinner(userId: string): void {
    this.sessionFacade.selectWinner(this.session as SessionEntity, userId);
  }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.auth.allAuth$.pipe(filter((u): u is User => !!u)),
      this.route.params,
      this.sessionFacade.selectedSessionEntities$
    ]).pipe(
      tap(([user, params, sessions]) => {
        this.user = user;
        this.sessionId = params['sessionId'];
        this.session = sessions[this.sessionId];
        if (!this.session) {
          return;
        }
        const sessionUser = this.session.users[this.user.id];
        this.sessionUser = sessionUser;
        if (!sessionUser && !this.session.started) {
          this.sessionFacade.joinSession(this.session, this.user);
          return;
        }
        this.users = Object.values(this.session.users);
        this.users.forEach(u => {
          if (u.score === 10) {
            this.dialog.open(DialogComponent, {
              data: {name: u.name},
            }).afterClosed().pipe(
              tap(() => {
                this.sessionFacade.finishSession(this.sessionId);
                this.router.navigate(['/']);
              })
            ).subscribe();
          }
        });
        this.hand = sessionUser.hand;
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
