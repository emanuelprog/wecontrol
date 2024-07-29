export interface LoginResponse {
  id: string,
  login: string,
  email: string,
  name: string,
  token: string
}

export class LoginResponse implements LoginResponse {
    constructor(
    public id: string,
    public login: string,
    public email: string,
    public name: string,
    public token: string
      ) { }
  }

