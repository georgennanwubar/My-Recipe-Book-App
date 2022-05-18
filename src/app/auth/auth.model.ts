export class AuthUser {
  public email: string;
  private readonly password: string;
  public returnSecureToken: boolean;
  public authenticated: boolean;

  constructor( email: string, password?: string, authenticated: boolean = true, returnSecureToken: boolean = true) {
    this.email = email;
    //only expose password if passed
    if( password ){
      this.password = password;
    }
    this.returnSecureToken = returnSecureToken;
    this.authenticated = authenticated;

  }
}

export class User extends AuthUser {

  constructor( public email: string, public id: string, private _token: string, private _tokenExpirationDate: Date, public redirect?: Boolean  ) {
    super(email);
  }

  get token(){
    if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
      return null;
    }
    return this._token;
  }
}



//@ts-ignore
export class storedUser extends User {

  constructor( public email: string, public id: string, public _token: string, public _tokenExpirationDate: Date) {

    super(email, id, _token, _tokenExpirationDate);

  }
}
