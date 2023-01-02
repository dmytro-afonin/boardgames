import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { EvolutionSessionEntity, EvolutionSessionFacade } from '@boardgames/data/evolution-session';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthFacade, User } from '@boardgames/data/auth';

@Component({
  selector: 'feature-lobby',
  templateUrl: './lobby.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyComponent implements OnChanges {
  @Input() session!: EvolutionSessionEntity;
  @Input() user!: User;
  myPlayer = this.session.players[this.user.id];
  players = Object.values(this.session.players);

  joinGameForm: FormGroup = this.fb.nonNullable.group({
    name: new FormControl<string>('', [Validators.minLength(3), Validators.required]),
    doubleCards: new FormControl<boolean>(false)
  });

  constructor(
    private readonly sessionFacade: EvolutionSessionFacade,
    private readonly auth: AuthFacade,
    private readonly fb: FormBuilder
  ) {
  }

  ngOnChanges(): void {
    this.myPlayer = this.session.players[this.user.id];
    this.players = Object.values(this.session.players);

    if (!this.session.started && !this.joinGameForm.value.name) {
      this.joinGameForm.get('name')?.setValue(this.user.name);
    }
  }

  startSession(): void {
    const name = this.joinGameForm.value.name;
    const double = this.joinGameForm.value.doubleCards;
    this.sessionFacade.startSession({...this.user, name}, this.session, {double});
  }
  joinGame(): void {
    const name = this.joinGameForm.value.name;
    this.sessionFacade.joinSession({...this.user, name}, this.session.id as string);
  }
}
