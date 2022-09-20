import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nrwl/angular/testing';

import * as SessionActions from './session.actions';
import { SessionEffects } from './session.effects';
import { SessionFacade } from './session.facade';
import { SessionEntity } from './session.models';
import {
  SESSION_FEATURE_KEY,
  sessionReducer,
} from './session.reducer';

describe('SessionFacade', () => {
  let facade: SessionFacade;
  let store: Store;
  const createSessionEntity = (id: string, name = ''): SessionEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(SESSION_FEATURE_KEY, sessionReducer),
          EffectsModule.forFeature([SessionEffects]),
        ],
        providers: [SessionFacade],
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule,
        ],
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.inject(Store);
      facade = TestBed.inject(SessionFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allSession$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allSession$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadSessionSuccess` to manually update list
     */
    it('allSession$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allSession$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        SessionActions.loadSessionsSuccess({
          sessions: [createSessionEntity('AAA'), createSessionEntity('BBB')],
        })
      );

      list = await readFirst(facade.allSession$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
