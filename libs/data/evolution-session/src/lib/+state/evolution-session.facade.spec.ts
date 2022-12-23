import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { readFirst } from '@nrwl/angular/testing';

import * as EvolutionSessionActions from './evolution-session.actions';
import { EvolutionSessionEffects } from './evolution-session.effects';
import { EvolutionSessionFacade } from './evolution-session.facade';
import { EvolutionSessionEntity } from './evolution-session.models';
import {
  EVOLUTION_SESSION_FEATURE_KEY,
  EvolutionSessionState,
  initialEvolutionSessionState,
  evolutionSessionReducer,
} from './evolution-session.reducer';
import * as EvolutionSessionSelectors from './evolution-session.selectors';

interface TestSchema {
  evolutionSession: EvolutionSessionState;
}

describe('EvolutionSessionFacade', () => {
  let facade: EvolutionSessionFacade;
  let store: Store<TestSchema>;
  const createEvolutionSessionEntity = (
    id: string,
    name = ''
  ): EvolutionSessionEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(
            EVOLUTION_SESSION_FEATURE_KEY,
            evolutionSessionReducer
          ),
          EffectsModule.forFeature([EvolutionSessionEffects]),
        ],
        providers: [EvolutionSessionFacade],
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
      facade = TestBed.inject(EvolutionSessionFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async () => {
      let list = await readFirst(facade.allEvolutionSession$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      facade.init();

      list = await readFirst(facade.allEvolutionSession$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(true);
    });

    /**
     * Use `loadEvolutionSessionSuccess` to manually update list
     */
    it('allEvolutionSession$ should return the loaded list; and loaded flag == true', async () => {
      let list = await readFirst(facade.allEvolutionSession$);
      let isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(0);
      expect(isLoaded).toBe(false);

      store.dispatch(
        EvolutionSessionActions.loadEvolutionSessionSuccess({
          evolutionSession: [
            createEvolutionSessionEntity('AAA'),
            createEvolutionSessionEntity('BBB'),
          ],
        })
      );

      list = await readFirst(facade.allEvolutionSession$);
      isLoaded = await readFirst(facade.loaded$);

      expect(list.length).toBe(2);
      expect(isLoaded).toBe(true);
    });
  });
});
