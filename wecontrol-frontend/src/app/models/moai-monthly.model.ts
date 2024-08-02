import { BidResponse } from "./bid.model"

export interface MoaiMonthlyResponse {
  id: string,
  idMoai: string,
  month: string,
  bidStartDate: string,
  bidEndDate: string,
  bids: BidResponse[],
  status: string
}

export class MoaiMonthlyResponse implements MoaiMonthlyResponse {
    constructor(
      public id: string,
      public idMoai: string,
      public month: string,
      public bidStartDate: string,
      public bidEndDate: string,
      public bids: BidResponse[],
      public status: string
      ) { }
  }

