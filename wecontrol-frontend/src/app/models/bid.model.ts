import { LoginResponse } from "./login.model";

export interface BidResponse {
  user: LoginResponse,
  valueBid: number
}

export class BidResponse implements BidResponse {
    constructor(
      public user: LoginResponse,
      public valueBid: number
      ) { }
  }

