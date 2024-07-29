import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    sessionStorage.removeItem('currentUser');
    window.addEventListener('beforeunload', this.handleUnload);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('popstate', this.handlePopState);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleUnload);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('popstate', this.handlePopState);
  }

  handlePopState = (event: PopStateEvent) => {
    this.clearCurrentUser();
  }

  handleUnload = (event: BeforeUnloadEvent) => {
    this.clearCurrentUser();
  }

  handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.clearCurrentUser();
    }
  }

  clearCurrentUser(): void {
    const currentUserUUID = sessionStorage.getItem('currentUser');
    
    if (currentUserUUID) {
      StorageService.removeUser(currentUserUUID);
      sessionStorage.removeItem('currentUser');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.get('login')?.value, this.loginForm.get('password')?.value).subscribe({
        next: data => {
          if (data.body) {
            this.onMessage(data.body.message, '', 2000);
            this.router.navigate(['/logged']);
          }
        },
        error: err => {
          alert(err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
