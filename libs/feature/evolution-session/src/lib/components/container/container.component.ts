import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  EvolutionSessionEntity,
  EvolutionSessionFacade,
} from '@boardgames/data/evolution-session';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { AuthFacade, User } from '@boardgames/data/auth';

@Component({
  selector: 'feature-container',
  templateUrl: './container.component.html',
  encapsulation: ViewEncapsulation.Emulated,
})
export class ContainerComponent implements OnInit {
  session!: EvolutionSessionEntity;
  user!: User;
  constructor(
    private readonly sessionFacade: EvolutionSessionFacade,
    private readonly auth: AuthFacade,
    private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap((map) => {
        const sessionId = map.get('sessionId') as string;
        this.sessionFacade.setCurrentSession(sessionId);
      })
    ).subscribe();

    this.auth.allAuth$.pipe(
      filter((s): s is User => !!s),
      tap(auth => this.user = auth),
      switchMap(() => this.sessionFacade.selectCurrentSession$),
      filter((s): s is EvolutionSessionEntity => !!s),
      tap((s) => {
        this.session = JSON.parse(JSON.stringify(s));
      })
    ).subscribe();
  }
}
