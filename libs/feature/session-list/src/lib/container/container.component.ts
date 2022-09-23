import {
  ChangeDetectionStrategy,
  Component, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CreateSessionPayload, SessionEntity, SessionFacade } from '@boardgames/data/session';
import { filter, Observable, tap } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthFacade, User } from '@boardgames/data/auth';

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
  ) {}


  joinSession(session: SessionEntity): void {
    this.sessionsFacade.joinSession(session.id, this.currentUser);
  }

  createSession(): void {
    const value = this.formGroup.getRawValue();
    const session: CreateSessionPayload = {
      name: value.session + '',
      ownerId: this.currentUser.id,
      users: {
        [this.currentUser.id]: {
          name: this.currentUser.name,
          imageUrl: this.currentUser.imageUrl
        }
      }
    }
    this.sessionsFacade.createSession(session);
    this.formGroup.reset();
  }

  ngOnInit(): void {
    this.sessionsFacade.allSession$.pipe().subscribe();
    this.authFacade.allAuth$.pipe(
      filter((u): u is User => !!u),
      tap((u) => {
        this.currentUser = u;
      })
    ).subscribe();
  }
}
