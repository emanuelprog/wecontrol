import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private registerUrl = 'auth/register';

  constructor(private httpClient: HttpClient) { }

  register(login: string, password: string, role: string): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.registerUrl, { login, password, role }, { observe: 'response'});
  }
}
