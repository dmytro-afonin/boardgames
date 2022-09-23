import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { AuthFacade } from '@boardgames/data/auth';

@Component({
  selector: 'feature-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent {
  constructor(private readonly authFacade: AuthFacade) {
  }

  onLogInAnonymouslyButtonClick() {
    this.authFacade.anonymousLogin();
  }

  googleLogin() {
    this.authFacade.googleLogin();
  }
}
