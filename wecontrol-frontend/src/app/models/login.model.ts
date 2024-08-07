export interface LoginResponse {
  id: string,
  login: string,
  email: string,
  name: string,
  accesToken: string
  role: string
  cellphone: string
}

export class LoginResponse implements LoginResponse {
    constructor(
    public id: string,
    public login: string,
    public email: string,
    public name: string,
    public accesToken: string,
    public role: string,
    public cellphone: string
      ) { }
  }

