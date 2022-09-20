import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromSession from './+state/session.reducer';
import { SessionEffects } from './+state/session.effects';
import { SessionFacade } from './+state/session.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromSession.SESSION_FEATURE_KEY,
      fromSession.sessionReducer
    ),
    EffectsModule.forFeature([SessionEffects]),
  ],
  providers: [SessionFacade],
})
export class DataSessionModule {}
