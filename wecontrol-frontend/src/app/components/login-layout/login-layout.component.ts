import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginResponse } from '../../models/login.model';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login-layout.component.html',
  styleUrl: './login-layout.component.scss'
})
export class LoginLayoutComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: LoginService, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.get('login')?.value, this.loginForm.get('password')?.value).subscribe({
        next: data => {
          if (data.body) {
            sessionStorage.setItem('login', data.body.login);
            sessionStorage.setItem('token', data.body.token);
            sessionStorage.setItem('name', data.body.name);
            this.onMessage('Successfully Logged In', '', 2000);
            this.router.navigate(['/logged']);
          }
        },
        error: (err: any) => {
          this.onMessage(err.error.message, '', 2000)
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
