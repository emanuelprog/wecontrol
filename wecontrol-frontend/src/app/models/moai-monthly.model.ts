import { BidResponse } from "./bid.model";

export interface MoaiMonthlyResponse {
  month: string,
  bidStartDateStr: string,
  bidEndDateStr: string,
  status: string,
  bids: BidResponse[]
}

export class MoaiMonthlyResponse implements MoaiMonthlyResponse {
    constructor(
      public month: string,
      public bidStartDateStr: string,
      public bidEndDateStr: string,
      public status: string,
      public bids: BidResponse[]
      ) { }
  }

