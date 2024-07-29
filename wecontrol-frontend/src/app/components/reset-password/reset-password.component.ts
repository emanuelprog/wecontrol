import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CryptoService } from '../../services/crypto/crypto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmNewPassword = control.get('confirmNewPassword');

  return newPassword && confirmNewPassword && newPassword.value === confirmNewPassword.value ? null : { 'passwordMismatch': true };
};
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  email: string = '';
  resetPasswordForm: FormGroup;
  tokenExpired: boolean = false;
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cryptoService: CryptoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit() {
    this.checkToken();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  checkToken() {
    this.route.queryParams.subscribe(params => {
      const encryptedToken = params['token'];
      const decryptedData = this.cryptoService.decrypt(decodeURIComponent(encryptedToken));

      if (decryptedData) {
        const { email, timestamp } = decryptedData;
        if (this.cryptoService.isTokenExpired(timestamp)) {
          this.tokenExpired = true;
          this.onMessage('Token has expired. Please request a new password reset.', '', 2000);
          this.router.navigate(['/login']);
        } else {
          this.email = email;
        }
      } else {
        console.error('Invalid token');
      }
    });
  }

  resetPassword() {
    this.checkToken();
    if (this.resetPasswordForm.invalid) {
      this.onMessage('Form is invalid, please check!.', '', 2000);
    }
    if (!this.tokenExpired) {
      this.authService.resetPassword(this.email, this.resetPasswordForm.get('newPassword')?.value).subscribe({
        next: data => {
          if (data.body) {
            this.onMessage(data.body.message, '', 2000)
            this.router.navigate(['/login']);
          }
        },
        error: (err: any) => {
          this.onMessage(err.error.message, '', 2000)
        }
      })
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }

  get password() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmNewPassword');
  }

  get passwordMismatch() {
    return this.resetPasswordForm.errors?.['passwordMismatch'];
  }
}
