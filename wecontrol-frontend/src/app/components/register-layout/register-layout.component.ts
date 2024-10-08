import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
};
export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  };
};
@Component({
  selector: 'app-register-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register-layout.component.html',
  styleUrl: './register-layout.component.scss'
})

export class RegisterLayoutComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, noWhitespaceValidator()]],
      email: ['', [Validators.required, noWhitespaceValidator(), Validators.email]],
      login: ['', [Validators.required, noWhitespaceValidator()]],
      password: ['', [Validators.required, Validators.minLength(6), noWhitespaceValidator()]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), noWhitespaceValidator()]],
      role: ['USER'],
      cellphone: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    passwordField.type = this.showPassword ? 'text' : 'password';
  }

  formatCellphone(): void {
    let input = this.registerForm.get('cellphone')?.value.replace(/\D/g, '');
    if (input.length > 11) {
      input = input.substring(0, 11);
    }
    const part1 = input.substring(0, 2);
    const part2 = input.substring(2, 3);
    const part3 = input.substring(3, 7);
    const part4 = input.substring(7, 11);

    let formatted = '';
    if (input.length > 7) {
      formatted = `(${part1}) ${part2} ${part3}-${part4}`;
    } else if (input.length > 3) {
      formatted = `(${part1}) ${part2} ${part3}`;
    } else if (input.length > 2) {
      formatted = `(${part1}) ${part2}`;
    } else if (input.length > 0) {
      formatted = `(${part1}`;
    }

    this.registerForm.get('cellphone')?.setValue(formatted, { emitEvent: false });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm).subscribe({
        next: data => {
          if (data.body) {
            this.onMessage(data.body.message, '', 2000);
            this.router.navigate(['/login']);
          }
        },
        error: (err: any) => {
          this.onMessage(err.error.message, '', 2000)
        }
      })
    } else {
      this.onMessage('Invalid form. Please verify!', '', 2000);
      this.registerForm.markAllAsTouched();
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get passwordMismatch() {
    return this.registerForm.errors?.['passwordMismatch'];
  }
}
