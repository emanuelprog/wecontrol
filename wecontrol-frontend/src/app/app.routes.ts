import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';
import { RegisterLayoutComponent } from './components/register-layout/register-layout.component';
import { LoggedComponent } from './components/logged/logged.component';
import { AuthGuard } from './guard/auth.guard';
import { ForgotPasswordLayoutComponent } from './components/forgot-password-layout/forgot-password-layout.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MoaiMonthlyComponent } from './components/moai-monthly/moai-monthly.component';

export const routes: Routes = [
  { path: 'login', component: LoginLayoutComponent },
  { path: 'register', component: RegisterLayoutComponent },
  { path: 'logged', component: LoggedComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordLayoutComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'moai-monthly', component: MoaiMonthlyComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

