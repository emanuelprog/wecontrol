export interface LoginResponse {
  name: string,
  login: string,
  token: string
}

export class LoginResponse implements LoginResponse {
    constructor(
      public name: string,
      public login: string,
      public token: string
      ) { }
  }

