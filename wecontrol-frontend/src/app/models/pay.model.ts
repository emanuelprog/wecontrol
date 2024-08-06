import { LoginResponse } from "./login.model";

export interface PayResponse {
  user: LoginResponse,
  valuePay: number
}

export class PayResponse implements PayResponse {
    constructor(
      public user: LoginResponse,
      public valuePay: number
      ) { }
  }

