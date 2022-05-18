import { Action } from "@ngrx/store";
import {AuthUserData} from "../auth.interface";
import {User} from "../auth.model";

export const LOGIN_START = '[Auth] Login Start';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login'
export const LOGOUT = '[Auth] Logout';


export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;
  constructor( public payload: User ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: AuthUserData ) {
  }
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: AuthUserData ) {
  }
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;
  constructor(public payload: string) {
  }
}

export type AuthActions = LoginStart
  | SignupStart
  | AuthenticateSuccess
  | AuthenticateFail
  | ClearError
  | AutoLogin
  | Logout;
