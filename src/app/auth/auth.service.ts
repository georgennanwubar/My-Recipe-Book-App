import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AuthUser, storedUser, User} from "./auth.model";
import {AuthResponseData} from "./auth.interface";
import {BehaviorSubject, catchError, tap, throwError} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseAPIKey: string = 'AIzaSyCoN-7c1_SvpRjn9L_kIKPpr6JoHDpg5qM';
  private signUpURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+ this.firebaseAPIKey;
  private loginURL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+ this.firebaseAPIKey;
  public user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;


  constructor(private http: HttpClient,
              private router: Router) {}

  signup(email: string, password: string){
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
  }

  autoLogin(){
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
      this.user.next(loadedUser);
      let expirationDuration = ( expirationDate.getTime() - new Date().getTime() );
      this.autoLogout(expirationDuration);
    }
  }

  logout(){
    this.user.next(null);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() =>{
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
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
  }
}
