export interface LoginResponse {
  status: number,
  message: string,
  body: { login: string, token: string}
}

export class LoginResponse implements LoginResponse {
    constructor(
    public status: number,
    public message: string,
    public body: { login: string, token: string}
      ) { }
  }

