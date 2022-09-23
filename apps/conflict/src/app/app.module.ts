import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { HttpClientModule } from "@angular/common/http";
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataAuthModule } from '@boardgames/data/auth';
import { DataSessionModule } from '@boardgames/data/session';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [],
    loadChildren: () => import('@boardgames/feature/login').then(m => m.FeatureLoginModule)
  },
  {
    path: '',
    canActivate: [AngularFireAuthGuard],
    loadChildren: () => import('@boardgames/feature/session-list').then(m => m.FeatureSessionListModule)
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      paramsInheritanceStrategy: "always"
    }),
    BrowserAnimationsModule,
    DataAuthModule,
    DataSessionModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
