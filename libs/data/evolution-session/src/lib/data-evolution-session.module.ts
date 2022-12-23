import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromEvolutionSession from './+state/evolution-session.reducer';
import { EvolutionSessionEffects } from './+state/evolution-session.effects';
import { EvolutionSessionFacade } from './+state/evolution-session.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromEvolutionSession.EVOLUTION_SESSION_FEATURE_KEY,
      fromEvolutionSession.evolutionSessionReducer
    ),
    EffectsModule.forFeature([EvolutionSessionEffects]),
  ],
  providers: [EvolutionSessionFacade],
})
export class DataEvolutionSessionModule {}
