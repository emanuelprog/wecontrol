import { FormGroup } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private registerUrl = 'auth/register';

  constructor(private httpClient: HttpClient) { }

  register(registerForm: FormGroup): Observable<HttpResponse<any>> {
    const registerJson = {
      login: registerForm.get('login')?.value,
      password: registerForm.get('password')?.value,
      role: registerForm.get('role')?.value,
      name: registerForm.get('name')?.value,
      email: registerForm.get('email')?.value
    }
    return this.httpClient.post<any>(this.registerUrl, registerJson, { observe: 'response'});
  }
}
