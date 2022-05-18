import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { StoreModule } from "@ngrx/store"
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import {CoreModule} from "./core.module";
import {appReducer} from "./store/app.reducer";
import {AuthEffects} from "./auth/store/auth.effects";
import {environment} from "../environments/environment";
import { RecipeEffects } from './recipes/store/recipe.effects';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production}),
    StoreRouterConnectingModule.forRoot(),

    SharedModule, //this should appear before as it contains modules used by other imported modules
    CoreModule

  ],
  bootstrap: [AppComponent]
  //entryComponents: [AlertComponent] //this is not need in Angular 9+
})

export class AppModule { }
