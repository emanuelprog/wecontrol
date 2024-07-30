export interface MoaiResponse {
  id: string,
  name: string,
  value: string,
  year: string,
  rules: string,
  duration: string,
  status: string,
  userId: string,
  userName: string
}

export class MoaiResponse implements MoaiResponse {
    constructor(
      public id: string,
      public name: string,
      public value: string,
      public year: string,
      public rules: string,
      public duration: string,
      public status: string,
      public userId: string,
      public userName: string
      ) { }
  }

