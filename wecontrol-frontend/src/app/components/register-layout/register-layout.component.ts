import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value === confirmPassword.value ? null : { 'passwordMismatch': true };
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

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['USER']
    }, { validators: passwordMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.registerService.register(this.registerForm.get('login')?.value, this.registerForm.get('password')?.value, this.registerForm.get('role')?.value).subscribe({
        next: data => {
          if (data.body) {
            this.onSucess('Successfully registered user!', '', 2000);
            this.router.navigate(['/login']);
          }
        },
        error: (err: any) => {
          this.onError('Unable to register!', '', 2000)
        }
      })
    } else {
      this.onError('Fill in all fields', '', 2000);
    }
  }

  private onSucess(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }

  private onError(message: string, action: string, duration: number) {
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
