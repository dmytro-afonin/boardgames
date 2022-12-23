import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthFacade, User } from '@boardgames/data/auth';
import { EvolutionSessionFacade } from '@boardgames/data/evolution-session';
import { filter, Subscription, tap } from 'rxjs';

@Component({
  selector: 'feature-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ContainerComponent implements OnInit, OnDestroy {
  private sessionsFacade = inject(EvolutionSessionFacade);
  private authFacade = inject(AuthFacade);
  private fb = inject(FormBuilder);
  sub!: Subscription;
  currentUser!: User;
  sessions$ = this.sessionsFacade.allEvolutionSession$;
  formGroup = this.fb.group({
    session: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit(): void {
    this.sub = this.authFacade.allAuth$.pipe(
      filter((u): u is User => !!u),
      tap((u) => {
        this.currentUser = u;
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createSession(): void {
    const value = this.formGroup.getRawValue();
    this.sessionsFacade.createSession(String(value.session), this.currentUser);
    this.formGroup.reset();
  }
}
