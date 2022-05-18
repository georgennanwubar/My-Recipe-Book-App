import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptorService} from "./auth/auth.interceptor";

@NgModule({
  /*
   Adding services providers here 'ShoppingListService, RecipeServiceTs, etc..'
   limits their availability to this app and its children.
  */
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
