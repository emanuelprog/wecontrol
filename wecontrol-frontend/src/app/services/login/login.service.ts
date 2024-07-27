import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LoginResponse } from '../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = 'auth/login';

  constructor(private httpClient: HttpClient) { }

  login(login: string, password: string): Observable<HttpResponse<LoginResponse>> {
    return this.httpClient.post<LoginResponse>(this.loginUrl, { login, password }, { observe: 'response'});
  }
}
