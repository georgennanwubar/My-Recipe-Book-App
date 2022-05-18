import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpParams} from '@angular/common/http';
import {exhaustMap, map, Observable, take} from 'rxjs';
import {AuthService} from "./auth.service";
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService,
              private store: Store<fromApp.AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //return this.authService.user.pipe(
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user
      }),
      exhaustMap(user => {
        if( !user ){
          return next.handle(request);
        }
        const modifiedRequest = request.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
