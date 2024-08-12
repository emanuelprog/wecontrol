import { LoginResponse } from "./login.model";
import { MoaiMonthlyResponse } from "./moai-monthly.model";

export interface MoaiResponse {
  id: string,
  name: string,
  value: number,
  year: number,
  rules: string,
  status: string,
  organizer: LoginResponse,
  participants: LoginResponse[],
  monthly: MoaiMonthlyResponse[],
  createdAt: string
}

export class MoaiResponse implements MoaiResponse {
    constructor(
      public id: string,
      public name: string,
      public value: number,
      public year: number,
      public rules: string,
      public status: string,
      public organizer: LoginResponse,
      public participants: LoginResponse[],
      public monthly: MoaiMonthlyResponse[],
      public createdAt: string
      ) { }
  }

