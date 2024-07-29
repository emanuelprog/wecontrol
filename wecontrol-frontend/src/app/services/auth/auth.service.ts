import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, catchError, interval, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { StorageService } from '../storage/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginResponse } from '../../models/login.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'auth';
  refreshTokenTimeout: any;
  loggedIn = new BehaviorSubject<boolean>(false);
  inactivityTimeout: any;

  constructor(private httpClient: HttpClient, private ngZone: NgZone, private snackBar: MatSnackBar, private router: Router) {
    this.initStorageEventListener();
    this.initActivityListeners();
  }

  login(login: string, password: string): Observable<HttpResponse<any>> {
    const user: LoginResponse = StorageService.getItem('user');
    const accessToken = StorageService.getItem('accessToken');
    const sessionUUID = sessionStorage.getItem('sessionUUID');

    if (accessToken && user.login === login && sessionUUID !== StorageService.getItem('sessionUUID')) {
      this.onMessage('You are already logged into another session. Please log out before trying again.', '', 2000);
      return of();
    }

    return this.httpClient.post<any>(`${this.baseUrl}/login`, { login, password }, { observe: 'response' }).pipe(
      tap(response => {

        const accessToken = response.body.body.accessToken;
        const refreshToken = response.body.body.refreshToken;

        const newSessionUUID = uuidv4();
        sessionStorage.setItem('sessionUUID', newSessionUUID);
        StorageService.setItem('sessionUUID', newSessionUUID);

        StorageService.setItem('user', response.body.body);
        StorageService.setItem('accessToken', accessToken);
        StorageService.setItem('refreshToken', refreshToken);

        this.startRefreshTokenTimer();
        this.startInactivityTimer();
        this.loggedIn.next(true);
      }),
      catchError(error => {
        if (error.status === 409) {
          this.onMessage('You are already logged into another session. Please log out before trying again.', '', 2000);
        }
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = sessionStorage.getItem('refreshToken');
    const refreshTokenRequest = {
      refreshToken: refreshToken,
      login: StorageService.getItem('user').login,
    }
    return this.httpClient.post<any>(`${this.baseUrl}/refresh-token`, refreshTokenRequest).pipe(
      tap(response => {
        const accessToken = response.body.accessToken;

        StorageService.setItem('accessToken', accessToken);
        this.startRefreshTokenTimer();
      })
    );
  }

  startRefreshTokenTimer(): void {
    const accessToken = StorageService.getItem('accessToken');

    if (accessToken) {
      try {
        const tokenParts = accessToken.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid token format');
        }

        const jwtToken = JSON.parse(atob(tokenParts[1]));
        if (!jwtToken.exp) {
          throw new Error('Token does not contain expiration time');
        }

        const expires = new Date(jwtToken.exp * 1000);

        const timeout = expires.getTime() - Date.now() - 1000;
        this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.logout();
      }
    }
  }

  logout(): void {
    StorageService.removeItem('accessToken');
    StorageService.removeItem('refreshToken');
    this.clearLoginState();
    this.stopRefreshTokenTimer();
    this.clearInactivityTimer();
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  private clearLoginState(): void {
    StorageService.clear();
    sessionStorage.clear();
    this.loggedIn.next(false);
  }

  stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  private initStorageEventListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.storageArea === sessionStorage) {
        this.ngZone.run(() => {
          if (event.key === 'accessToken' || event.key === 'refreshToken') {
            const accessToken = StorageService.getItem('accessToken');
            const refreshToken = StorageService.getItem('refreshToken');
            if (accessToken && refreshToken) {
              this.loggedIn.next(true);
              this.startRefreshTokenTimer();
            } else {
              this.loggedIn.next(false);
              this.stopRefreshTokenTimer();
            }
          }
        });
      }
    });
  }

  private initActivityListeners(): void {
    ['click', 'mousemove', 'keydown', 'scroll'].forEach(event => {
      window.addEventListener(event, () => this.resetInactivityTimer());
    });
  }

  private startInactivityTimer(): void {
    this.clearInactivityTimer();
    this.inactivityTimeout = setTimeout(() => this.logout(), 30 * 60 * 1000);
  }

  private resetInactivityTimer(): void {
    this.startInactivityTimer();
  }

  private clearInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
  }

  register(registerForm: FormGroup): Observable<HttpResponse<any>> {
    const registerJson = {
      login: registerForm.get('login')?.value,
      password: registerForm.get('password')?.value,
      role: registerForm.get('role')?.value,
      name: registerForm.get('name')?.value,
      email: registerForm.get('email')?.value
    }
    return this.httpClient.post<any>(this.baseUrl + '/register', registerJson, { observe: 'response'});
  }

  resetPassword(email: string, newPassword: string): Observable<HttpResponse<any>> {
    const resetPasswordJson = {
      email: email,
      newPassword: newPassword
    }
    return this.httpClient.post<any>(this.baseUrl + '/reset-password', resetPasswordJson, { observe: 'response'});
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
