import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { AuthFacade, User } from '@boardgames/data/auth';

@Component({
  selector: 'boardgames-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  user: User | undefined;
  constructor(private readonly authFacade: AuthFacade) {
  }
  ngOnInit(): void {
    this.sub = this.authFacade.allAuth$.pipe(
      tap((u) => {
        this.user = u;
      })
    ).subscribe();
  }

  googleLogin() : void {
    this.authFacade.googleLogin();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
