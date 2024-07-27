import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  loginResponse: LoginResponse | undefined;

  constructor(private fb: FormBuilder, private loginService: LoginService, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = this.fb.group({
      login: [''],
      password: ['']
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.get('login')?.value, this.loginForm.get('password')?.value).subscribe({
        next: data => {
          if (data.body) {
            this.loginResponse = data.body;
            sessionStorage.setItem('login', this.loginResponse.body.login);
            sessionStorage.setItem('token', this.loginResponse.body.token);
            this.onSucess(this.loginResponse.message, '', 2000);
            this.router.navigate(['/logged']);
          }
        },
        error: (err: any) => {
          this.onError('Não foi possível Logar!', '', 2000)
        }
      })
    }
  }

  private onSucess(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }

  private onError(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
