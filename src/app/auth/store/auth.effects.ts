import {Actions, createEffect, ofType} from '@ngrx/effects'
import * as AuthActions from "./auth.actions";
import {catchError, switchMap, map, of, tap} from "rxjs";
import {AuthResponseData} from "../auth.interface";
import {AuthUser, storedUser, User} from "../auth.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Injectable()

export class AuthEffects {

  constructor(private actions$: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService){}

  private loginURL = environment.firebaseLoginURL + '?key=' + environment.firebaseAPIKey;
  private signupURL = environment.firebaseSignupURL + '?key=' + environment.firebaseAPIKey;

  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupActions: AuthActions.SignupStart) => {
        return this.http.post<AuthResponseData>(this.signupURL,
          new AuthUser(signupActions.payload.email, signupActions.payload.password)
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map( resData => {
            return handleAuthentication(resData);
          }),
          catchError(errorResponse => {
            return handleError(errorResponse);
          })
        )
      })
    )
  );

  authLogin = createEffect(() =>
    this.actions$.pipe( //don't call subscribe here ngrx will auto-subscribe for you
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>(this.loginURL,
          new AuthUser(authData.payload.email,authData.payload.password)
        ).pipe(
          tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
          map(resData => {
            return handleAuthentication(resData);
          }),
          catchError(errorResponse => {
            return handleError(errorResponse);
          })
        )
      })
    )
  );

  authAutoLogin = createEffect(() =>
    this.actions$.pipe( //don't call subscribe here ngrx will auto-subscribe for you
      ofType(AuthActions.AUTO_LOGIN), map( () => {
        const sUser: storedUser = JSON.parse(localStorage.getItem('userData'));
        if( !sUser ){
          return {type: 'DUMMY'};
        }
        let expirationDate = new Date(sUser._tokenExpirationDate);
        const loadedUser = new User( sUser.email, sUser.id, sUser._token, expirationDate, false);
        if(loadedUser.token){
          let expirationDuration = ( expirationDate.getTime() - new Date().getTime() );
          this.authService.setLogoutTimer(expirationDuration);

          return new AuthActions.AuthenticateSuccess(loadedUser);
        }
        return {type: 'DUMMY'};
      })
    )
  );

  authLogout = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGOUT), tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    ),
    {dispatch: false}
  );

  authRedirect = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
        if(authSuccessAction.payload.redirect){
          this.router.navigate(['/']);
        }
      })
    ),
    { dispatch: false }
  );

}

const handleAuthentication = <AuthResponseData>(userDetails) => {
  const expirationDate = new Date(new Date().getTime() + +userDetails.expiresIn * 1000);
  const user = new User(userDetails.email, userDetails.userId, userDetails.idToken, expirationDate, true);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess(user);
};

const handleError = (errorResponse) => {
  let errorMessage = 'An unknown error occurred';
  if(!errorResponse.error || !errorResponse.error.error){
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }

  switch(errorResponse.error.error.message) {
    case 'EMAIL_EXISTS': {
      errorMessage = 'Email already exists';
      break;
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
      errorMessage += ': ' + errorResponse.error.error.message;
      break;
    }
  }
  return of(new AuthActions.AuthenticateFail(errorMessage));
}

