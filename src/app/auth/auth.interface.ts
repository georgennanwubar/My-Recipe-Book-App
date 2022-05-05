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
