import { BidResponse } from "./bid.model";
import { PayResponse } from "./pay.model";

export interface MoaiMonthlyResponse {
  month: string,
  bidStartDate: string,
  bidEndDate: string,
  status: string,
  bids: BidResponse[],
  pays: PayResponse[]
}

export class MoaiMonthlyResponse implements MoaiMonthlyResponse {
    constructor(
      public month: string,
      public bidStartDate: string,
      public bidEndDate: string,
      public status: string,
      public bids: BidResponse[],
      public pays: PayResponse[]
      ) { }
  }

