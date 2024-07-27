import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmailService } from '../../services/email/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forgot-password-layout.component.html',
  styleUrl: './forgot-password-layout.component.scss'
})
export class ForgotPasswordLayoutComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private emailService: EmailService, private snackBar: MatSnackBar) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  onSubmit() {
    this.emailService.confirmEmail(this.forgotPasswordForm.get('email')?.value).subscribe({
      next: data => {
        if (data.body) {
          const resetLink = `http://localhost:4200/reset-password?email=${encodeURIComponent(this.forgotPasswordForm.get('email')?.value)}`;
          const subject = 'Reset your password';

          this.emailService.sendEmail(this.forgotPasswordForm.get('email')?.value, subject, resetLink).then(
            response => alert('Reset link sent to your email'),
            error => alert('Error sending email')
          );
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })

  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
