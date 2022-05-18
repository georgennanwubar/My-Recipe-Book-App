/* Creating an interface for the Auth Service. */
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?:boolean; //Not included in firebase signup request but included in login request
}

export interface AuthUserData {
  email: string;
  password?: string;
}

export interface UserData extends AuthUserData {
  userId: string;
  token: string;
  expiresIn: Date;
}

