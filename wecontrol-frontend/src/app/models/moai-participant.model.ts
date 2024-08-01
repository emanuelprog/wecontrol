import { LoginResponse } from "./login.model";

export interface MoaiParticipantResponse {
  id: string,
  participant: LoginResponse,
  idMoai: string,
}

export class MoaiParticipantResponse implements MoaiParticipantResponse {
    constructor(
    public id: string,
    public participant: LoginResponse,
    public idMoai: string,
      ) { }
  }

