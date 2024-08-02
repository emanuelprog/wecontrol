import { LoginResponse } from "./login.model";

export interface BidResponse {
  id: string
  idMonthly: string,
  user: LoginResponse,
  valueBid: string
}

export class BidResponse implements BidResponse {
    constructor(
    public id: string,
    public idMonthly: string,
    public user: LoginResponse,
    public valueBid: string
      ) { }
  }

