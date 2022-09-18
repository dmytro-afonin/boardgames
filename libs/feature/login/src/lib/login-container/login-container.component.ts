import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AuthFacade } from '@boardgames/data/auth';
import { tap } from 'rxjs';

@Component({
  selector: 'feature-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent {
  constructor(private readonly authFacade: AuthFacade) {
    this.authFacade.allAuth$.pipe(tap((u) => {
      console.log({u});
    })).subscribe();
  }

  onLogInAnonymouslyButtonClick() {
    this.authFacade.anonymousLogin();
  }
}
