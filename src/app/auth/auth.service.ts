import { Injectable } from '@angular/core';

import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import { Logout } from "./store/auth.actions";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() =>{
      this.store.dispatch(new Logout());
    }, expirationDuration);
  }

  clearLogoutTimer(){
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

/*  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(this.signUpURL, new AuthUser(email, password)).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
      })
    );
  }

  login(email, password){
    return this.http.post<AuthResponseData>(this.loginURL, new AuthUser(email, password)).pipe(
      catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
    );
  }*/

 /* autoLogin(){
    // const storedUser: {
    //   email:string,
    //   id: string,
    //   _token: string,
    //   _tokenExpirationDate: Date
    // } = JSON.parse(localStorage.getItem('userData'));

    const sUser: storedUser = JSON.parse(localStorage.getItem('userData'));
    if( !sUser ){
      return;
    }

    let expirationDate = new Date(sUser._tokenExpirationDate);

    const loadedUser = new User( sUser.email, sUser.id, sUser._token, expirationDate);

    if(loadedUser.token){
      //this.user.next(loadedUser);
      this.store.dispatch(new AuthActions.AuthenticateSuccess(loadedUser));
      let expirationDuration = ( expirationDate.getTime() - new Date().getTime() );
      this.autoLogout(expirationDuration);
    }
  }

  logout(){
    //this.user.next(null);
    this.store.dispatch(new AuthActions.Logout());
    //localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
  }*/


 /* private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    //this.user.next(user);
    this.store.dispatch(new AuthActions.AuthenticateSuccess(user)
    );
    this.autoLogout(expiresIn*1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred';
    if(!errorRes.error || !errorRes.error.error){
        return throwError(() => errorMessage);
    }
    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS': {
        errorMessage = 'Email already exists';
      }
      case 'EMAIL_NOT_FOUND': {
        errorMessage = 'User not found';
        break;
      }
      case 'INVALID_PASSWORD': {
        errorMessage = 'Invalid password';
        break;
      }
      case 'USER_DISABLED': {
        errorMessage = 'Account disabled';
        break;
      }
      default: {
        errorMessage += ': ' + errorRes.error.error.message;
        break;
      }
    }
    return throwError(() => errorMessage);
  }*/
}
