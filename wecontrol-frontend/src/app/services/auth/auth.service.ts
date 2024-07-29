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
    const userList = StorageService.getUserList();
    console.log(userList);
    
    const existingUser = userList.find(userKey => {
      
      const data = StorageService.getUser(userKey);
      console.log(data);
      return data.user && data.user.login === login;
    });

    

    if (existingUser) {
      this.onMessage('You are already logged into another session. Please log out before trying again.', '', 2000);
      return of();
    }

    return this.httpClient.post<any>(`${this.baseUrl}/login`, { login, password }, { observe: 'response' }).pipe(
      tap(response => {

        const accessToken = response.body.body.accessToken;
        const refreshToken = response.body.body.refreshToken;
        const user = response.body.body;

        const userUUID = uuidv4();
        const userData = {
          user,
          accessToken,
          refreshToken,
          uuid: userUUID,
        };

        StorageService.addUser(userUUID, userData);

        sessionStorage.setItem('currentUser', userUUID);

        this.startRefreshTokenTimer(userUUID);
        this.startInactivityTimer();
        this.loggedIn.next(true);
      }),
      catchError(err => {
        if (err.status === 409) {
          this.onMessage('You are already logged into another session. Please log out before trying again.', '', 2000);
        } else {
          this.onMessage(err.error.message, '', 2000);
        }
        return of();
      })
    );
  }

  refreshToken(): Observable<any> {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    if (!currentUserUUID) {
      this.logout();
      return throwError(() => new Error('No current user found in session.'));
    }

    const user = StorageService.getUser(currentUserUUID);
    const refreshTokenRequest = {
      refreshToken: user.refreshToken,
      login: user.login,
    }

    return this.httpClient.post<any>(`${this.baseUrl}/refresh-token`, refreshTokenRequest).pipe(
      tap(response => {
        const accessToken = response.body.accessToken;
        user.accessToken = accessToken;

        StorageService.addUser(currentUserUUID, user);
        this.startRefreshTokenTimer(currentUserUUID);
      })
    );
  }

  startRefreshTokenTimer(userUUID: string): void {
    const user = StorageService.getUser(userUUID);
    if (!user) {
      this.logout();
      return;
    }

    const accessToken = user.accessToken;
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
    const currentUserUUID = sessionStorage.getItem('currentUser');
    if (currentUserUUID) {
      StorageService.removeUser(currentUserUUID);
      sessionStorage.removeItem('currentUser');
      this.clearLoginState();
      this.stopRefreshTokenTimer();
      this.clearInactivityTimer();
      this.loggedIn.next(false);
      this.router.navigate(['/login']);
    } 
  }

  private clearLoginState(): void {
    StorageService.clearAllUsers();
    sessionStorage.clear();
    this.loggedIn.next(false);
  }

  stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }

  private initStorageEventListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage) {
        this.ngZone.run(() => {
          if (event.key!.startsWith(StorageService.USER_PREFIX)) {
            const userUUID = event.key!.replace(StorageService.USER_PREFIX, '');
            const user = StorageService.getUser(userUUID);
            if (user) {
              this.loggedIn.next(true);
              this.startRefreshTokenTimer(userUUID);
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
