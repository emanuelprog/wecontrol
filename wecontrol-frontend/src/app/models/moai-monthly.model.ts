export interface MoaiMonthlyResponse {
  id: string,
  idMoai: string,
  month: string,
  bidStartDate: string,
  bidEndDate: string,
  highestBid: string,
  idHighestBidderUser: string,
  status: string
}

export class MoaiMonthlyResponse implements MoaiMonthlyResponse {
    constructor(
      public id: string,
      public idMoai: string,
      public month: string,
      public bidStartDate: string,
      public bidEndDate: string,
      public highestBid: string,
      public idHighestBidderUser: string,
      public status: string
      ) { }
  }

