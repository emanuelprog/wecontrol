import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmailService } from '../../services/email/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CryptoService } from '../../services/crypto/crypto.service';

@Component({
  selector: 'app-forgot-password-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forgot-password-layout.component.html',
  styleUrl: './forgot-password-layout.component.scss'
})
export class ForgotPasswordLayoutComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private emailService: EmailService, private snackBar: MatSnackBar, private cryptoService: CryptoService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', Validators.required]
    });
  }

  onSubmit() {
    this.emailService.confirmEmail(this.forgotPasswordForm.get('email')?.value).subscribe({
      next: data => {
        if (data.body) {
          const encryptedEmail = this.cryptoService.encrypt(this.forgotPasswordForm.get('email')?.value);
          const resetLink = `http://localhost:4200/reset-password?token=${encodeURIComponent(encryptedEmail)}`;
          const subject = 'Reset your password';

          this.emailService.sendEmail(this.forgotPasswordForm.get('email')?.value, subject, resetLink).then(
            response => this.onMessage('Reset link sent to your email', 'x', 2000),
            error => this.onMessage('Error sending email', 'x', 2000)
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
